"use client";

import { Trophy } from "lucide-react";
import type { VenueVote } from "@/lib/schema";

interface TopPicksProps {
  votes: VenueVote[];
}

export function TopPicks({ votes }: TopPicksProps) {
  if (votes.length === 0) return null;

  // Tally votes per venue
  const tally = new Map<string, number>();
  for (const v of votes) {
    tally.set(v.venueName, (tally.get(v.venueName) ?? 0) + 1);
  }

  // Sort descending by count, take top 5
  const ranked = Array.from(tally.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (ranked.length === 0) return null;

  return (
    <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl px-4 py-3 flex items-start gap-2.5">
      <Trophy className="size-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="text-sm">
        <span className="font-semibold text-amber-800">Top picks: </span>
        <span className="text-amber-700">
          {ranked.map(([name, count], i) => (
            <span key={name}>
              {name}{" "}
              <span className="text-amber-500 font-medium">
                ({count} {count === 1 ? "vote" : "votes"})
              </span>
              {i < ranked.length - 1 && ", "}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
