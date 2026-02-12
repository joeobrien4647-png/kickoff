import { db } from "@/lib/db";
import { matches, stops, travelers } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { MatchesView } from "@/components/matches/matches-view";
import { WatchGuide } from "@/components/matches/watch-guide";

export default function MatchesPage() {
  const allMatches = db.select().from(matches).all();
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();
  const allTravelers = db.select().from(travelers).all();

  // Compute stats
  const stats = {
    total: allMatches.length,
    mustSee: allMatches.filter((m) => m.priority >= 3).length,
    purchased: allMatches.filter((m) => m.ticketStatus === "purchased").length,
    seeking: allMatches.filter((m) => m.ticketStatus === "seeking").length,
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Matches</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All World Cup matches on the East Coast &mdash; plan which to attend.
        </p>
      </section>
      <MatchesView
        matches={allMatches}
        stops={allStops}
        travelers={allTravelers}
        stats={stats}
      />

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Where to Watch guide */}
      <WatchGuide />
    </div>
  );
}
