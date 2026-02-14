import { db } from "@/lib/db";
import {
  travelers,
  stops,
  accommodations,
  matches,
  itineraryItems,
} from "@/lib/schema";
import { asc } from "drizzle-orm";
import {
  tripDays,
  formatDateLong,
  TRIP_START,
  TRIP_END,
} from "@/lib/dates";
import { countryFlag } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { PrintActions } from "@/components/print-actions";
import Link from "next/link";
import type { Stop } from "@/lib/schema";

function stopForDate(date: string, allStops: Stop[]): Stop | null {
  return (
    allStops.find(
      (stop) => date >= stop.arriveDate && date <= stop.departDate
    ) ?? null
  );
}

export default function PrintPage() {
  // ── Data fetching ──────────────────────────────────────────────
  const allTravelers = db.select().from(travelers).all();
  const allStops = db
    .select()
    .from(stops)
    .orderBy(asc(stops.sortOrder))
    .all();
  const allAccommodations = db.select().from(accommodations).all();
  const allMatches = db
    .select()
    .from(matches)
    .orderBy(asc(matches.matchDate))
    .all();
  const allItems = db
    .select()
    .from(itineraryItems)
    .orderBy(asc(itineraryItems.date), asc(itineraryItems.startTime))
    .all();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 print:max-w-none print:px-0">
      {/* Non-printing action bar */}
      <PrintActions />

      {/* Print sub-pages */}
      <nav className="flex flex-wrap gap-2 mb-6 print:hidden">
        <Link
          href="/print/packing"
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
        >
          Packing Checklist
        </Link>
        <Link
          href="/print/schedule"
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
        >
          Day-by-Day Schedule
        </Link>
        <Link
          href="/print/contacts"
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
        >
          Emergency Contacts
        </Link>
      </nav>

      {/* Trip Header */}
      <header className="text-center mb-8 print:mb-4">
        <h1 className="text-3xl font-bold print:text-2xl">
          World Cup 2026 Road Trip
        </h1>
        <p className="text-lg text-muted-foreground mt-1 print:text-base">
          Boston to Miami &mdash; {formatDateLong(TRIP_START)} to{" "}
          {formatDateLong(TRIP_END)}
        </p>
        {allTravelers.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Travelers:{" "}
            {allTravelers
              .map((t) => `${t.emoji} ${t.name}`)
              .join(" \u00b7 ")}
          </p>
        )}
      </header>

      {/* Day-by-day breakdown */}
      {tripDays().map((date, i) => {
        const dayNum = i + 1;
        const stop = stopForDate(date, allStops);
        const dayMatches = allMatches.filter((m) => m.matchDate === date);
        const dayItems = allItems.filter((item) => item.date === date);
        const acc = stop
          ? allAccommodations.find((a) => a.stopId === stop.id)
          : null;
        const isTravelDay = dayItems.some((item) => item.type === "travel");
        const driveInfo =
          stop?.arriveDate === date && stop.driveFromPrev
            ? (JSON.parse(stop.driveFromPrev) as {
                miles: number;
                hours: number;
                minutes: number;
              })
            : null;
        const plannedItems = dayItems.filter((item) => item.type !== "travel");

        return (
          <section
            key={date}
            className="mb-6 print:mb-3 print:break-inside-avoid"
          >
            {/* Day header */}
            <div className="flex items-baseline gap-3 border-b border-border pb-1 mb-2">
              <span className="text-lg font-bold">Day {dayNum}</span>
              <span className="text-sm text-muted-foreground">
                {formatDateLong(date)}
              </span>
              {stop && (
                <span className="text-sm font-medium">{stop.city}</span>
              )}
              {isTravelDay && (
                <Badge variant="outline" className="text-[10px]">
                  Travel Day
                </Badge>
              )}
            </div>

            {/* Drive info */}
            {driveInfo && (
              <p className="text-xs text-muted-foreground mb-2">
                Drive: {driveInfo.miles} miles, {driveInfo.hours}h{" "}
                {driveInfo.minutes}m
              </p>
            )}

            {/* Accommodation */}
            {acc && (
              <p className="text-xs text-muted-foreground mb-2">
                {acc.name} ({acc.type}){" "}
                {acc.confirmed ? "Confirmed" : "Not booked"}
              </p>
            )}

            {/* Matches */}
            {dayMatches.length > 0 && (
              <div className="mb-2">
                {dayMatches.map((match) => (
                  <p key={match.id} className="text-sm">
                    {countryFlag(match.homeTeam)} {match.homeTeam} vs{" "}
                    {match.awayTeam} {countryFlag(match.awayTeam)}
                    <span className="text-muted-foreground">
                      {" "}
                      &mdash; {match.venue}
                      {match.kickoff ? `, ${match.kickoff}` : ""}
                    </span>
                  </p>
                ))}
              </div>
            )}

            {/* Planned items */}
            {plannedItems.length > 0 && (
              <div className="space-y-0.5">
                {plannedItems.map((item) => (
                  <p
                    key={item.id}
                    className="text-xs text-muted-foreground"
                  >
                    {item.startTime ? `${item.startTime} \u2014 ` : ""}
                    {item.title}
                  </p>
                ))}
              </div>
            )}

            {/* Empty day */}
            {!isTravelDay &&
              dayMatches.length === 0 &&
              plannedItems.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  Free day &mdash; explore {stop?.city ?? "the area"}!
                </p>
              )}
          </section>
        );
      })}

      {/* Footer stats */}
      <footer className="border-t border-border pt-4 mt-8 text-center text-xs text-muted-foreground print:mt-4">
        <p>
          {allStops.length} cities &middot; {allMatches.length} matches &middot;{" "}
          {tripDays().length} days
        </p>
        <p className="mt-1">
          Generated from Kickoff &mdash; World Cup 2026 Trip Planner
        </p>
      </footer>
    </div>
  );
}
