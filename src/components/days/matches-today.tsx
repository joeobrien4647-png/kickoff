import { Trophy } from "lucide-react";
import { MatchCard } from "@/components/match-card";
import type { Match } from "@/lib/schema";

interface MatchesTodayProps {
  matches: Match[];
  currentStopCity: string | null;
}

export function MatchesToday({ matches, currentStopCity }: MatchesTodayProps) {
  // Sort: matches at current city first, then by kickoff time
  const sorted = [...matches].sort((a, b) => {
    const aLocal = isNearby(a.city, currentStopCity) ? 0 : 1;
    const bLocal = isNearby(b.city, currentStopCity) ? 0 : 1;
    if (aLocal !== bLocal) return aLocal - bLocal;
    if (a.kickoff && b.kickoff) return a.kickoff.localeCompare(b.kickoff);
    return 0;
  });

  return (
    <section className="space-y-3">
      {/* Section heading */}
      <div className="flex items-center gap-2">
        <Trophy className="size-4 text-wc-gold" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Matches Today
        </h2>
        <span className="text-xs text-muted-foreground/60">
          {matches.length} game{matches.length !== 1 && "s"}
        </span>
      </div>

      <div className="space-y-2">
        {sorted.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            nearby={isNearby(match.city, currentStopCity)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Check if a match city is "nearby" the current stop city.
 * Handles cases like "Foxborough" being near "Boston",
 * "East Rutherford" near "New York", "Miami Gardens" near "Miami".
 */
function isNearby(matchCity: string, stopCity: string | null): boolean {
  if (!stopCity) return false;

  const mc = matchCity.toLowerCase();
  const sc = stopCity.toLowerCase();

  // Direct match
  if (mc.includes(sc) || sc.includes(mc)) return true;

  // Known proximity mappings
  const CITY_ALIASES: Record<string, string[]> = {
    boston: ["foxborough", "foxboro"],
    "new york": ["east rutherford", "rutherford"],
    miami: ["miami gardens"],
    atlanta: ["atlanta"],
    philadelphia: ["philadelphia"],
  };

  for (const [city, aliases] of Object.entries(CITY_ALIASES)) {
    if (sc.includes(city)) {
      if (aliases.some((alias) => mc.includes(alias))) return true;
    }
  }

  return false;
}
