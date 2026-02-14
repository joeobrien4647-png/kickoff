"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  Zap,
  Crown,
  Star,
  Check,
  MapPin,
  UtensilsCrossed,
  Users,
  Compass,
  Flame,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DAILY_CHALLENGES, type Challenge } from "@/lib/daily-challenges";

// ── Constants ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "kickoff_challenge_scores";

const TRAVELERS = [
  { name: "Joe", emoji: "\u{1F1EC}\u{1F1E7}" },
  { name: "Jonny", emoji: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}" },
  { name: "Gregor", emoji: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}" },
] as const;

const CITY_TABS = [
  "All",
  "Boston",
  "New York",
  "Philadelphia",
  "Washington DC",
  "Nashville",
  "Miami",
] as const;

const CITY_SHORT_LABELS: Record<string, string> = {
  All: "All",
  Boston: "Boston",
  "New York": "NYC",
  Philadelphia: "Philly",
  "Washington DC": "DC",
  Nashville: "Nashville",
  Miami: "Miami",
};

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  medium: { label: "Medium", className: "bg-wc-blue/15 text-wc-blue border-wc-blue/20" },
  hard: { label: "Hard", className: "bg-wc-gold/15 text-wc-gold border-wc-gold/20" },
  legendary: { label: "Legendary", className: "bg-wc-coral/15 text-wc-coral border-wc-coral/20" },
} as const;

const CATEGORY_ICONS: Record<Challenge["category"], React.ReactNode> = {
  food: <UtensilsCrossed className="size-3.5" />,
  social: <Users className="size-3.5" />,
  adventure: <Compass className="size-3.5" />,
  culture: <Star className="size-3.5" />,
  dare: <Flame className="size-3.5" />,
};

// ── Types ──────────────────────────────────────────────────────────────────────

type TravelerScore = {
  points: number;
  completed: string[]; // challenge IDs
};

type ScoreMap = Record<string, TravelerScore>;

// ── Storage helpers ────────────────────────────────────────────────────────────

function readScores(): ScoreMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ScoreMap;
  } catch {
    return {};
  }
}

function writeScores(scores: ScoreMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // localStorage unavailable
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

export function DailyChallenges() {
  const [scores, setScores] = useState<ScoreMap>({});
  const [activeCity, setActiveCity] = useState<string>("All");

  // Hydrate from localStorage
  useEffect(() => {
    setScores(readScores());
  }, []);

  // Toggle a challenge completion for a traveler
  const toggleChallenge = useCallback(
    (travelerName: string, challenge: Challenge) => {
      setScores((prev) => {
        const traveler = prev[travelerName] ?? { points: 0, completed: [] };
        const isCompleted = traveler.completed.includes(challenge.id);

        let updated: TravelerScore;
        if (isCompleted) {
          updated = {
            points: traveler.points - challenge.points,
            completed: traveler.completed.filter((id) => id !== challenge.id),
          };
          toast(`${challenge.title} unmarked for ${travelerName}`);
        } else {
          updated = {
            points: traveler.points + challenge.points,
            completed: [...traveler.completed, challenge.id],
          };
          toast.success(
            `${travelerName} completed "${challenge.title}" (+${challenge.points} pts)`
          );
        }

        const next = { ...prev, [travelerName]: updated };
        writeScores(next);
        return next;
      });
    },
    []
  );

  // Derived data
  const leaderboard = useMemo(() => {
    return [...TRAVELERS]
      .map((t) => ({
        ...t,
        points: scores[t.name]?.points ?? 0,
        completedCount: scores[t.name]?.completed.length ?? 0,
      }))
      .sort((a, b) => b.points - a.points);
  }, [scores]);

  const filteredChallenges = useMemo(() => {
    if (activeCity === "All") return DAILY_CHALLENGES;
    return DAILY_CHALLENGES.filter(
      (c) => c.city === activeCity || c.city === "Any"
    );
  }, [activeCity]);

  const totalPointsAvailable = DAILY_CHALLENGES.reduce(
    (sum, c) => sum + c.points,
    0
  );

  const totalPointsEarned = Object.values(scores).reduce(
    (sum, s) => sum + s.points,
    0
  );

  const totalCompletions = Object.values(scores).reduce(
    (sum, s) => sum + s.completed.length,
    0
  );

  const totalPossibleCompletions = DAILY_CHALLENGES.length * TRAVELERS.length;

  const percentComplete =
    totalPossibleCompletions > 0
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
      : 0;

  const leaderPoints = leaderboard[0]?.points ?? 0;

  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-wc-gold/15">
          <Zap className="size-4 text-wc-gold" />
        </div>
        <div>
          <h2 className="text-base font-bold leading-tight">
            Daily Challenges
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete challenges to earn bragging rights
          </p>
        </div>
      </div>

      {/* ── Leaderboard ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {leaderboard.map((t) => {
          const isLeader = t.points > 0 && t.points === leaderPoints;

          return (
            <Card
              key={t.name}
              className={cn(
                "py-3 transition-colors",
                isLeader && "ring-1 ring-wc-gold/30 bg-wc-gold/5"
              )}
            >
              <CardContent className="flex flex-col items-center gap-1 px-2 text-center">
                <div className="relative">
                  <span className="text-2xl leading-none">{t.emoji}</span>
                  {isLeader && (
                    <Crown className="absolute -top-2.5 -right-2.5 size-3.5 text-wc-gold" />
                  )}
                </div>
                <span className="text-xs font-semibold truncate w-full">
                  {t.name}
                </span>
                <span
                  className={cn(
                    "text-lg font-bold tabular-nums leading-tight",
                    t.points > 0 ? "text-wc-gold" : "text-muted-foreground"
                  )}
                >
                  {t.points}
                  <span className="text-[10px] font-medium text-muted-foreground ml-0.5">
                    pts
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {t.completedCount} done
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── City Tabs ───────────────────────────────────────────────────── */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {CITY_TABS.map((city) => (
          <button
            key={city}
            onClick={() => setActiveCity(city)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeCity === city
                ? "bg-wc-teal text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {CITY_SHORT_LABELS[city] ?? city}
          </button>
        ))}
      </div>

      {/* ── Challenge Cards ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        {filteredChallenges.map((challenge) => {
          const diff = DIFFICULTY_CONFIG[challenge.difficulty];

          return (
            <Card key={challenge.id} className="py-3">
              <CardContent className="space-y-2.5 px-4">
                {/* Top row: title + badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">
                        {CATEGORY_ICONS[challenge.category]}
                      </span>
                      <h3 className="text-sm font-bold truncate">
                        {challenge.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0 font-medium",
                        diff.className
                      )}
                    >
                      {challenge.difficulty === "legendary" && (
                        <Sparkles className="size-2.5 mr-0.5" />
                      )}
                      {diff.label}
                    </Badge>
                    <span className="text-xs font-bold tabular-nums text-wc-gold">
                      +{challenge.points}
                    </span>
                  </div>
                </div>

                {/* Bottom row: city tag + traveler completion buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="size-3" />
                    <span>{challenge.city}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {TRAVELERS.map((traveler) => {
                      const isComplete =
                        scores[traveler.name]?.completed.includes(
                          challenge.id
                        ) ?? false;

                      return (
                        <Button
                          key={traveler.name}
                          variant="ghost"
                          size="icon-xs"
                          onClick={() =>
                            toggleChallenge(traveler.name, challenge)
                          }
                          className={cn(
                            "relative rounded-full text-xs font-bold transition-all",
                            isComplete
                              ? "bg-wc-teal/15 text-wc-teal ring-1 ring-wc-teal/30 hover:bg-wc-teal/25"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                          title={
                            isComplete
                              ? `Undo for ${traveler.name}`
                              : `Mark complete for ${traveler.name}`
                          }
                        >
                          {traveler.name[0]}
                          {isComplete && (
                            <div className="absolute -bottom-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-wc-teal">
                              <Check className="size-2 text-white" />
                            </div>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Stats Footer ────────────────────────────────────────────────── */}
      <Card className="py-3">
        <CardContent className="px-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Trophy className="size-3.5 text-wc-gold" />
              <span className="text-muted-foreground">
                <span className="font-bold text-foreground tabular-nums">
                  {totalPointsAvailable}
                </span>{" "}
                pts available
              </span>
            </div>
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground tabular-nums">
                {percentComplete}%
              </span>{" "}
              complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-wc-teal transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <p className="text-center text-[10px] text-muted-foreground italic">
            The real prize is the memories... and bragging rights
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
