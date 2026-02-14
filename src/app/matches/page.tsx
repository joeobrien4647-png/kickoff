import { db } from "@/lib/db";
import { matches, stops, travelers } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { MatchesView } from "@/components/matches/matches-view";
import { WatchGuide } from "@/components/matches/watch-guide";
import { BroadcastGuideSection } from "@/components/matches/broadcast-guide-section";
import { CalendarExport } from "@/components/calendar-export";
import { FanZoneFinder } from "@/components/matches/fan-zone-finder";
import { FAN_ZONES } from "@/lib/fan-zones";
import { GroupStageTables } from "@/components/matches/group-stage-tables";
import { ScoreTicker } from "@/components/matches/score-ticker";

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

      <ScoreTicker matches={allMatches} />

      <MatchesView
        matches={allMatches}
        stops={allStops}
        travelers={allTravelers}
        stats={stats}
      />

      {/* Separator */}
      <div className="border-t border-border" />

      {/* How to Watch — channels & streaming */}
      <BroadcastGuideSection />

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Calendar Export */}
      <CalendarExport />

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Group Stage Tables */}
      <GroupStageTables matches={allMatches} />

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Where to Watch — bars & fan zones */}
      <WatchGuide />

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Fan Zone Finder */}
      <FanZoneFinder fanZones={FAN_ZONES} />
    </div>
  );
}
