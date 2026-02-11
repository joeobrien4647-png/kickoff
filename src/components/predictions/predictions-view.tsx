"use client";

import { useMemo } from "react";
import { Leaderboard } from "@/components/predictions/leaderboard";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { formatDate } from "@/lib/dates";
import type { Match, Prediction, Traveler } from "@/lib/schema";

interface PredictionsViewProps {
  matches: Match[];
  predictions: Prediction[];
  travelers: Traveler[];
  currentUser: string;
}

export function PredictionsView({
  matches,
  predictions,
  travelers,
  currentUser,
}: PredictionsViewProps) {
  // Group matches by date, sorted chronologically
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, Match[]>();
    const sorted = [...matches].sort((a, b) =>
      a.matchDate.localeCompare(b.matchDate)
    );

    for (const match of sorted) {
      const date = match.matchDate;
      if (!groups.has(date)) groups.set(date, []);
      groups.get(date)!.push(match);
    }

    return groups;
  }, [matches]);

  // Build a lookup: matchId -> predictions for that match
  const predictionsByMatch = useMemo(() => {
    const map = new Map<string, Prediction[]>();
    for (const pred of predictions) {
      if (!map.has(pred.matchId)) map.set(pred.matchId, []);
      map.get(pred.matchId)!.push(pred);
    }
    return map;
  }, [predictions]);

  // Summary stats
  const myPredictionCount = predictions.filter(
    (p) => p.travelerName === currentUser
  ).length;
  const scoredMatchCount = matches.filter(
    (m) => m.actualHomeScore != null && m.actualAwayScore != null
  ).length;

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <Leaderboard
        matches={matches}
        predictions={predictions}
        travelers={travelers}
        currentUser={currentUser}
      />

      {/* Stats summary */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{myPredictionCount}</span>
          /{matches.length} predicted
        </span>
        <span>
          <span className="font-medium text-foreground">{scoredMatchCount}</span>
          /{matches.length} played
        </span>
      </div>

      {/* Match grid grouped by date */}
      <div className="space-y-6">
        {Array.from(groupedByDate.entries()).map(([date, dateMatches]) => (
          <section key={date} className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {formatDate(date)}
            </h3>
            <div className="space-y-3">
              {dateMatches.map((match) => (
                <PredictionCard
                  key={match.id}
                  match={match}
                  predictions={predictionsByMatch.get(match.id) ?? []}
                  travelers={travelers}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
