import { db } from "@/lib/db";
import { stops, itineraryItems, matches } from "@/lib/schema";
import { tripDays, formatDate, TRIP_START } from "@/lib/dates";
import { getCityIdentity, countryFlag } from "@/lib/constants";
import { DayCard } from "@/components/days/day-card";
import {
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
  Car,
  MapPin,
} from "lucide-react";
import type { Stop, ItineraryItem, Match } from "@/lib/schema";
import type { LucideIcon } from "lucide-react";

/** Map city identity icon names to actual Lucide components */
const CITY_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
  MapPin,
};

/** Find which stop a traveler is at on a given date */
function stopForDate(date: string, allStops: Stop[]): Stop | null {
  return (
    allStops.find(
      (stop) => date >= stop.arriveDate && date <= stop.departDate
    ) ?? null
  );
}

/** Compute day number (1-indexed) from trip start */
function dayNumber(date: string): number {
  const start = new Date(TRIP_START + "T12:00:00");
  const current = new Date(date + "T12:00:00");
  return Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

/** Count nights at a stop (departDate - arriveDate) */
function nightsAtStop(stop: Stop): number {
  const arrive = new Date(stop.arriveDate + "T12:00:00");
  const depart = new Date(stop.departDate + "T12:00:00");
  return Math.round((depart.getTime() - arrive.getTime()) / (1000 * 60 * 60 * 24));
}

/** Group an array by a key function, preserving insertion order */
function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

export default function DaysPage() {
  const days = tripDays();
  const allStops = db.select().from(stops).all();
  const allItems = db.select().from(itineraryItems).all();
  const allMatches = db.select().from(matches).all();

  // Pre-index by date for O(1) lookups
  const itemsByDate = new Map<string, ItineraryItem[]>();
  for (const item of allItems) {
    const list = itemsByDate.get(item.date) ?? [];
    list.push(item);
    itemsByDate.set(item.date, list);
  }

  const matchesByDate = new Map<string, Match[]>();
  for (const match of allMatches) {
    const list = matchesByDate.get(match.matchDate) ?? [];
    list.push(match);
    matchesByDate.set(match.matchDate, list);
  }

  // Count planned items vs empty days
  const plannedDays = days.filter((d) => (itemsByDate.get(d)?.length ?? 0) > 0).length;
  const matchDays = days.filter((d) => (matchesByDate.get(d)?.length ?? 0) > 0).length;

  // Group days by their stop city
  const dayEntries = days.map((date) => {
    const stop = stopForDate(date, allStops);
    return { date, stop, city: stop?.city ?? "Unknown" };
  });

  // Ordered groups preserving trip chronology
  const cityGroups = groupBy(dayEntries, (e) => e.city);

  // Build a lookup from city to its stop for drive info and date ranges
  const stopByCity = new Map<string, Stop>();
  for (const stop of allStops) {
    stopByCity.set(stop.city, stop);
  }

  // Total days for progress bar proportions
  const totalDays = days.length;

  // Ordered list of stops for the progress bar
  const orderedStops = [...allStops].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Day Planner</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {days.length} days &middot; {formatDate(days[0])} &ndash;{" "}
            {formatDate(days[days.length - 1])}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{plannedDays}</span> planned
          </span>
          <span>
            <span className="font-semibold text-wc-gold">{matchDays}</span> match day{matchDays !== 1 && "s"}
          </span>
        </div>
      </div>

      {/* Trip Progress Bar */}
      <div className="space-y-3">
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
          {orderedStops.map((stop) => {
            const nights = nightsAtStop(stop);
            const identity = getCityIdentity(stop.city);
            // Width proportional to nights in this city
            const widthPercent = (nights / totalDays) * 100;
            return (
              <div
                key={stop.id}
                className={`h-full ${identity.color.replace("text-", "bg-")}`}
                style={{ width: `${widthPercent}%` }}
                title={`${stop.city}: ${nights} night${nights !== 1 ? "s" : ""}`}
              />
            );
          })}
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-wc-gold" />
            Match
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-wc-blue" />
            Travel
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-wc-teal" />
            Planned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-wc-coral" />
            Open
          </span>
        </div>
      </div>

      {/* City-Grouped Sections */}
      <div className="space-y-2">
        {Array.from(cityGroups.entries()).map(([city, entries], groupIndex) => {
          const stop = stopByCity.get(city);
          const identity = getCityIdentity(city);
          const IconComponent = CITY_ICONS[identity.icon] ?? MapPin;

          // Drive connector: show before this group if there's drive data from prev city
          const driveData =
            stop?.driveFromPrev
              ? (JSON.parse(stop.driveFromPrev) as { miles: number; hours: number; minutes: number })
              : null;

          return (
            <div key={city}>
              {/* Drive Connector (between city groups) */}
              {groupIndex > 0 && driveData && (
                <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  <Car className="size-3.5" />
                  <span>{driveData.miles} mi</span>
                  <span className="text-muted-foreground/50">&middot;</span>
                  <span>
                    {driveData.hours > 0 && `${driveData.hours}h `}
                    {driveData.minutes > 0 && `${driveData.minutes}m`}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}

              {/* City Header */}
              <div className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-3 ${identity.bg}`}>
                <IconComponent className={`size-5 ${identity.color} shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h2 className={`text-lg font-bold ${identity.color}`}>{city}</h2>
                    <span className="text-xs text-muted-foreground">{identity.tagline}</span>
                  </div>
                  {stop && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(stop.arriveDate)} &ndash; {formatDate(stop.departDate)}
                      <span className="ml-2 opacity-60">
                        &middot; {nightsAtStop(stop)} night{nightsAtStop(stop) !== 1 ? "s" : ""}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Day Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {entries.map(({ date, stop: dayStop }) => {
                  const dayItems = itemsByDate.get(date) ?? [];
                  const dayMatches = matchesByDate.get(date) ?? [];

                  // Drive info if arriving this day
                  const driveInfo =
                    dayStop?.arriveDate === date && dayStop.driveFromPrev
                      ? (JSON.parse(dayStop.driveFromPrev) as { miles: number; hours: number; minutes: number })
                      : null;

                  return (
                    <DayCard
                      key={date}
                      date={date}
                      dayNumber={dayNumber(date)}
                      stop={dayStop}
                      items={dayItems}
                      matches={dayMatches}
                      driveInfo={driveInfo}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
