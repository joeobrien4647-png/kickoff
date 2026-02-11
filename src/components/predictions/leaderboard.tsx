"use client";

import { useMemo } from "react";
import { Trophy, Medal, Target, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Match, Prediction, Traveler } from "@/lib/schema";

interface LeaderboardProps {
  matches: Match[];
  predictions: Prediction[];
  travelers: Traveler[];
  currentUser: string;
}

interface TravelerScore {
  name: string;
  emoji: string;
  color: string;
  exactCount: number;
  correctCount: number;
  totalPredictions: number;
  points: number;
}

function getResult(home: number, away: number): "home" | "away" | "draw" {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function Leaderboard({
  matches,
  predictions,
  travelers,
  currentUser,
}: LeaderboardProps) {
  const scores = useMemo(() => {
    // Only matches with actual scores count
    const scoredMatches = matches.filter(
      (m) => m.actualHomeScore != null && m.actualAwayScore != null
    );
    const scoredMatchIds = new Set(scoredMatches.map((m) => m.id));
    const matchMap = new Map(scoredMatches.map((m) => [m.id, m]));

    const travelerMap = new Map(travelers.map((t) => [t.name, t]));

    const scoresByName: TravelerScore[] = travelers.map((t) => {
      const travelerPredictions = predictions.filter(
        (p) => p.travelerName === t.name
      );

      let exactCount = 0;
      let correctCount = 0;
      let totalPredictions = travelerPredictions.length;

      for (const pred of travelerPredictions) {
        if (!scoredMatchIds.has(pred.matchId)) continue;
        const match = matchMap.get(pred.matchId)!;
        const actualHome = match.actualHomeScore!;
        const actualAway = match.actualAwayScore!;

        if (pred.homeScore === actualHome && pred.awayScore === actualAway) {
          exactCount++;
        } else if (
          getResult(pred.homeScore, pred.awayScore) ===
          getResult(actualHome, actualAway)
        ) {
          correctCount++;
        }
      }

      return {
        name: t.name,
        emoji: t.emoji,
        color: t.color,
        exactCount,
        correctCount,
        totalPredictions,
        points: exactCount * 3 + correctCount * 1,
      };
    });

    return scoresByName.sort((a, b) => b.points - a.points);
  }, [matches, predictions, travelers]);

  const scoredMatchCount = matches.filter(
    (m) => m.actualHomeScore != null && m.actualAwayScore != null
  ).length;

  if (scores.length === 0) return null;

  return (
    <Card className="py-4">
      <CardContent className="px-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-wc-gold" />
          <h2 className="text-sm font-bold">Leaderboard</h2>
          {scoredMatchCount > 0 && (
            <span className="text-[11px] text-muted-foreground ml-auto">
              {scoredMatchCount} match{scoredMatchCount !== 1 ? "es" : ""} scored
            </span>
          )}
        </div>

        <div className="space-y-1">
          {scores.map((score, index) => {
            const rank = index + 1;
            const isCurrentUser = score.name === currentUser;

            return (
              <div
                key={score.name}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  isCurrentUser
                    ? "bg-wc-gold/8 ring-1 ring-wc-gold/20"
                    : "hover:bg-muted/50"
                )}
              >
                {/* Rank */}
                <div className="shrink-0 w-6 text-center">
                  {rank === 1 ? (
                    <Trophy className="size-4 text-wc-gold mx-auto" />
                  ) : rank === 2 ? (
                    <Medal className="size-4 text-muted-foreground mx-auto" />
                  ) : rank === 3 ? (
                    <Medal className="size-4 text-wc-coral mx-auto" />
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">
                      {rank}
                    </span>
                  )}
                </div>

                {/* Traveler */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-base leading-none">{score.emoji}</span>
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      isCurrentUser && "text-wc-gold"
                    )}
                  >
                    {score.name}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1" title="Exact predictions">
                    <Target className="size-3 text-emerald-400" />
                    <span className="text-xs text-muted-foreground">
                      {score.exactCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" title="Correct results">
                    <Hash className="size-3 text-amber-400" />
                    <span className="text-xs text-muted-foreground">
                      {score.correctCount}
                    </span>
                  </div>
                  <div className="min-w-[2.5rem] text-right">
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        score.points > 0 ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {score.points}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-0.5">
                      pts
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
