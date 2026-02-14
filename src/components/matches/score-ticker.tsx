"use client";

import { useMemo } from "react";
import { countryFlag } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Match } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ScoreTickerProps {
  matches: Match[];
  /** Override "today" for testing -- defaults to current date (YYYY-MM-DD) */
  date?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScoreTicker({ matches, date, className }: ScoreTickerProps) {
  const today = date ?? new Date().toISOString().slice(0, 10);

  // Only matches with actual scores entered
  const scored = useMemo(
    () =>
      matches.filter(
        (m) =>
          m.matchDate === today &&
          m.actualHomeScore !== null &&
          m.actualAwayScore !== null
      ),
    [matches, today]
  );

  if (scored.length === 0) {
    return (
      <div
        className={cn(
          "overflow-hidden bg-card/80 backdrop-blur-sm border-b border-border px-4 py-1.5 text-center text-xs text-muted-foreground",
          className
        )}
      >
        No match results yet
      </div>
    );
  }

  // Build ticker items as JSX fragments
  const tickerItems = scored.map((m, i) => (
    <span key={m.id} className="inline-flex items-center gap-1.5 shrink-0">
      <span>{countryFlag(m.homeTeam)}</span>
      <span className="font-medium">{m.homeTeam}</span>
      <span className="font-bold text-wc-gold tabular-nums">
        {m.actualHomeScore}-{m.actualAwayScore}
      </span>
      <span className="font-medium">{m.awayTeam}</span>
      <span>{countryFlag(m.awayTeam)}</span>
      {i < scored.length - 1 && (
        <span className="text-muted-foreground/40 mx-1" aria-hidden>
          &bull;
        </span>
      )}
    </span>
  ));

  // Duplicate content for seamless looping
  return (
    <div
      className={cn(
        "overflow-hidden bg-card/80 backdrop-blur-sm border-b border-border",
        className
      )}
    >
      <div className="ticker-track flex items-center gap-8 py-1.5 text-xs whitespace-nowrap">
        <div className="flex items-center gap-1 shrink-0">{tickerItems}</div>
        <div className="flex items-center gap-1 shrink-0" aria-hidden>
          {tickerItems}
        </div>
      </div>
    </div>
  );
}
