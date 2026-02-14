import { db } from "@/lib/db";
import { stops, matches, itineraryItems } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { tripDays, formatDate, formatTime } from "@/lib/dates";
import { countryFlag } from "@/lib/constants";
import { PrintLayout } from "@/components/print/print-layout";
import type { Stop, Match, ItineraryItem } from "@/lib/schema";

function stopForDate(date: string, allStops: Stop[]): Stop | null {
  return (
    allStops.find(
      (stop) => date >= stop.arriveDate && date <= stop.departDate
    ) ?? null
  );
}

function activityLabel(item: ItineraryItem, dayMatches: Match[]): string {
  if (item.type === "match" && item.matchId) {
    const match = dayMatches.find((m) => m.id === item.matchId);
    if (match) {
      return `${countryFlag(match.homeTeam)} ${match.homeTeam} vs ${match.awayTeam} ${countryFlag(match.awayTeam)}`;
    }
  }
  return item.title;
}

export default function PrintSchedulePage() {
  const allStops = db
    .select()
    .from(stops)
    .orderBy(asc(stops.sortOrder))
    .all();
  const allMatches = db
    .select()
    .from(matches)
    .orderBy(asc(matches.matchDate))
    .all();
  const allItems = db
    .select()
    .from(itineraryItems)
    .orderBy(asc(itineraryItems.date), asc(itineraryItems.sortOrder))
    .all();

  const days = tripDays();

  return (
    <PrintLayout title="Trip Schedule">
      <div className="space-y-6 print:space-y-4">
        {days.map((date, i) => {
          const dayNum = i + 1;
          const stop = stopForDate(date, allStops);
          const dayMatches = allMatches.filter((m) => m.matchDate === date);
          const dayItems = allItems.filter((item) => item.date === date);

          // Combine itinerary items and any matches not already linked
          const linkedMatchIds = new Set(
            dayItems.filter((it) => it.matchId).map((it) => it.matchId)
          );
          const unlinkedMatches = dayMatches.filter(
            (m) => !linkedMatchIds.has(m.id)
          );

          const hasContent =
            dayItems.length > 0 || unlinkedMatches.length > 0;

          return (
            <section
              key={date}
              className="print:break-inside-avoid"
            >
              {/* Day header */}
              <div className="flex items-baseline gap-3 border-b border-border pb-1 mb-2 print:border-black/20">
                <span className="text-sm font-bold">Day {dayNum}</span>
                <span className="text-sm">{formatDate(date)}</span>
                {stop && (
                  <span className="text-sm text-muted-foreground print:text-black/60">
                    {stop.city}, {stop.state}
                  </span>
                )}
              </div>

              {hasContent ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground print:text-black/50">
                      <th className="pb-1 pr-3 font-medium w-16">Time</th>
                      <th className="pb-1 pr-3 font-medium">Activity</th>
                      <th className="pb-1 font-medium w-36">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-border/50 print:border-black/10"
                      >
                        <td className="py-1 pr-3 text-muted-foreground print:text-black/60 align-top">
                          {item.startTime ? formatTime(item.startTime) : "\u2014"}
                        </td>
                        <td className="py-1 pr-3 align-top">
                          {activityLabel(item, dayMatches)}
                        </td>
                        <td className="py-1 text-muted-foreground print:text-black/60 align-top">
                          {item.location ?? "\u2014"}
                        </td>
                      </tr>
                    ))}
                    {unlinkedMatches.map((match) => (
                      <tr
                        key={match.id}
                        className="border-t border-border/50 print:border-black/10"
                      >
                        <td className="py-1 pr-3 text-muted-foreground print:text-black/60 align-top">
                          {match.kickoff ? formatTime(match.kickoff) : "\u2014"}
                        </td>
                        <td className="py-1 pr-3 align-top">
                          {countryFlag(match.homeTeam)} {match.homeTeam} vs{" "}
                          {match.awayTeam} {countryFlag(match.awayTeam)}
                        </td>
                        <td className="py-1 text-muted-foreground print:text-black/60 align-top">
                          {match.venue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-muted-foreground italic print:text-black/40">
                  Free day &mdash; explore {stop?.city ?? "the area"}!
                </p>
              )}
            </section>
          );
        })}
      </div>

      <footer className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground print:border-black/20 print:mt-6">
        <p>
          {days.length} days &middot; {allStops.length} cities &middot;{" "}
          {allMatches.length} matches
        </p>
        <p className="mt-1">
          Generated from Kickoff &mdash; World Cup 2026 Trip Planner
        </p>
      </footer>
    </PrintLayout>
  );
}
