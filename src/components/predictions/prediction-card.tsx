"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Check,
  X,
  Target,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/dates";
import { countryFlag } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Match, Prediction, Traveler } from "@/lib/schema";

interface PredictionCardProps {
  match: Match;
  predictions: Prediction[];
  travelers: Traveler[];
  currentUser: string;
}

type PredictionOutcome = "exact" | "correct" | "wrong" | null;

function getResult(home: number, away: number): "home" | "away" | "draw" {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

function scorePrediction(
  pred: Prediction,
  match: Match
): PredictionOutcome {
  if (match.actualHomeScore == null || match.actualAwayScore == null) return null;
  if (
    pred.homeScore === match.actualHomeScore &&
    pred.awayScore === match.actualAwayScore
  ) {
    return "exact";
  }
  if (
    getResult(pred.homeScore, pred.awayScore) ===
    getResult(match.actualHomeScore, match.actualAwayScore)
  ) {
    return "correct";
  }
  return "wrong";
}

const OUTCOME_STYLES: Record<string, string> = {
  exact: "bg-emerald-500/8 border-emerald-500/30",
  correct: "bg-amber-500/8 border-amber-500/30",
  wrong: "bg-destructive/5 border-destructive/20",
};

const OUTCOME_BADGE: Record<string, { label: string; className: string }> = {
  exact: {
    label: "Exact!  +3",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  correct: {
    label: "Correct  +1",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  wrong: {
    label: "Wrong  +0",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

export function PredictionCard({
  match,
  predictions,
  travelers,
  currentUser,
}: PredictionCardProps) {
  const router = useRouter();
  const hasActualScore =
    match.actualHomeScore != null && match.actualAwayScore != null;

  // Is the match date in the past?
  const matchDatePassed = match.matchDate < new Date().toISOString().slice(0, 10);
  // Can we reveal other predictions? Only after the match is played or date has passed
  const canReveal = hasActualScore || matchDatePassed;

  const myPrediction = predictions.find((p) => p.travelerName === currentUser);
  const otherPredictions = predictions.filter(
    (p) => p.travelerName !== currentUser
  );
  const travelerMap = new Map(travelers.map((t) => [t.name, t]));

  const [homeScore, setHomeScore] = useState<string>(
    myPrediction ? String(myPrediction.homeScore) : ""
  );
  const [awayScore, setAwayScore] = useState<string>(
    myPrediction ? String(myPrediction.awayScore) : ""
  );
  const [saving, setSaving] = useState(false);

  // Track if user has unsaved changes
  const hasChanges =
    myPrediction
      ? homeScore !== String(myPrediction.homeScore) ||
        awayScore !== String(myPrediction.awayScore)
      : homeScore !== "" || awayScore !== "";

  const canSave =
    homeScore !== "" &&
    awayScore !== "" &&
    hasChanges &&
    !saving;

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success("Prediction saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save prediction");
    } finally {
      setSaving(false);
    }
  }, [canSave, match.id, homeScore, awayScore, router]);

  const myOutcome = myPrediction ? scorePrediction(myPrediction, match) : null;

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-colors",
        myOutcome ? OUTCOME_STYLES[myOutcome] : "border-border bg-card"
      )}
    >
      {/* Top bar: group/round + date/time */}
      <div className="flex items-center justify-between bg-wc-gold/8 border-b border-wc-gold/10 px-3 py-1.5">
        <span className="text-xs font-medium text-wc-gold">
          {match.groupName ?? match.round ?? "Match"}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {formatDate(match.matchDate)}
          {match.kickoff && <> &middot; {formatTime(match.kickoff)}</>}
        </span>
      </div>

      {/* Teams + scores */}
      <div className="px-3 py-3">
        <div className="flex items-center">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-2xl leading-none">
              {countryFlag(match.homeTeam)}
            </span>
            <span className="text-sm font-bold text-center leading-tight truncate max-w-full">
              {match.homeTeam}
            </span>
          </div>

          {/* Actual score or vs */}
          {hasActualScore ? (
            <div className="flex items-center gap-1.5 mx-3 shrink-0">
              <span className="text-2xl font-bold tabular-nums">
                {match.actualHomeScore}
              </span>
              <span className="text-xs text-muted-foreground/50">-</span>
              <span className="text-2xl font-bold tabular-nums">
                {match.actualAwayScore}
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-muted-foreground/50 mx-3 shrink-0">
              vs
            </span>
          )}

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-2xl leading-none">
              {countryFlag(match.awayTeam)}
            </span>
            <span className="text-sm font-bold text-center leading-tight truncate max-w-full">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          <span>{match.venue}, {match.city}</span>
        </div>
      </div>

      {/* My prediction input */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Target className="size-3.5 text-wc-teal" />
          <span className="text-xs font-medium">Your Prediction</span>
          {myOutcome && (
            <Badge
              variant="outline"
              className={cn(
                "ml-auto text-[10px] uppercase tracking-wide",
                OUTCOME_BADGE[myOutcome].className
              )}
            >
              {myOutcome === "exact" && <Check className="size-3" />}
              {myOutcome === "correct" && <Check className="size-3" />}
              {myOutcome === "wrong" && <X className="size-3" />}
              {OUTCOME_BADGE[myOutcome].label}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-xs text-muted-foreground truncate max-w-[4rem]">
              {match.homeTeam}
            </span>
            <input
              type="number"
              min={0}
              max={20}
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              placeholder="-"
              className={cn(
                "w-12 h-9 text-center text-sm font-bold rounded-lg border bg-background",
                "tabular-nums outline-none transition-colors",
                "focus:border-wc-teal focus:ring-1 focus:ring-wc-teal/50",
                "placeholder:text-muted-foreground/40"
              )}
            />
            <span className="text-xs text-muted-foreground/50">-</span>
            <input
              type="number"
              min={0}
              max={20}
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              placeholder="-"
              className={cn(
                "w-12 h-9 text-center text-sm font-bold rounded-lg border bg-background",
                "tabular-nums outline-none transition-colors",
                "focus:border-wc-teal focus:ring-1 focus:ring-wc-teal/50",
                "placeholder:text-muted-foreground/40"
              )}
            />
            <span className="text-xs text-muted-foreground truncate max-w-[4rem]">
              {match.awayTeam}
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!canSave}
            className="shrink-0"
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Other travelers' predictions */}
      {otherPredictions.length > 0 && (
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-2 mb-2">
            {canReveal ? (
              <Eye className="size-3.5 text-muted-foreground" />
            ) : (
              <EyeOff className="size-3.5 text-muted-foreground" />
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {canReveal
                ? "Other Predictions"
                : `${otherPredictions.length} other prediction${otherPredictions.length !== 1 ? "s" : ""} (hidden until match day)`}
            </span>
          </div>

          {canReveal && (
            <div className="space-y-1.5">
              {otherPredictions.map((pred) => {
                const traveler = travelerMap.get(pred.travelerName);
                const outcome = scorePrediction(pred, match);

                return (
                  <div
                    key={pred.id}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm",
                      outcome === "exact" && "bg-emerald-500/8",
                      outcome === "correct" && "bg-amber-500/8",
                      outcome === "wrong" && "bg-destructive/5",
                      !outcome && "bg-muted/30"
                    )}
                  >
                    <span className="text-sm leading-none">
                      {traveler?.emoji ?? "?"}
                    </span>
                    <span className="text-xs font-medium truncate min-w-0 flex-1">
                      {pred.travelerName}
                    </span>
                    <span className="text-sm font-bold tabular-nums shrink-0">
                      {pred.homeScore} - {pred.awayScore}
                    </span>
                    {outcome && (
                      <span className="shrink-0">
                        {outcome === "exact" && (
                          <Target className="size-3.5 text-emerald-400" />
                        )}
                        {outcome === "correct" && (
                          <Check className="size-3.5 text-amber-400" />
                        )}
                        {outcome === "wrong" && (
                          <X className="size-3.5 text-destructive" />
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
