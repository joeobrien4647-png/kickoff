"use client";

import { useEffect, useState } from "react";
import { Trophy, Radio, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LiveScoreBadgeProps = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  kickoff: string | null;
  homeScore: number | null;
  awayScore: number | null;
};

type MatchStatus = "upcoming" | "live" | "finished";

function getMatchStatus(matchDate: string, kickoff: string | null): MatchStatus {
  const now = new Date();
  const matchStart = new Date(`${matchDate}T${kickoff || "00:00"}:00`);
  const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000);

  if (now < matchStart) return "upcoming";
  if (now >= matchStart && now <= matchEnd) return "live";
  return "finished";
}

function getTimeUntil(matchDate: string, kickoff: string | null): string | null {
  const matchStart = new Date(`${matchDate}T${kickoff || "00:00"}:00`);
  const diff = matchStart.getTime() - Date.now();

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (hours === 0 && minutes <= 0) return null;
  if (hours === 0) return `${minutes}m`;
  if (hours < 24) return `${hours}h ${minutes}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export function LiveScoreBadge({
  homeTeam,
  awayTeam,
  matchDate,
  kickoff,
  homeScore,
  awayScore,
}: LiveScoreBadgeProps) {
  // Re-render every 30s to keep status and countdown fresh
  const [, tick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const status = getMatchStatus(matchDate, kickoff);
  const hasScores = homeScore !== null && awayScore !== null;

  // ── Scores exist ──────────────────────────────────────────────────
  if (hasScores) {
    return (
      <div className="flex items-center gap-2">
        {/* Score display */}
        <span className="tabular-nums text-base font-bold tracking-wide">
          {homeScore} &ndash; {awayScore}
        </span>

        {/* Status badge */}
        {status === "live" ? (
          <Badge
            variant="outline"
            className="gap-1 border-red-500/30 bg-red-500/10 text-[10px] uppercase tracking-wide text-red-400"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-red-400" />
            </span>
            Live
          </Badge>
        ) : status === "finished" ? (
          <Badge
            variant="outline"
            className="gap-1 border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground"
          >
            <Trophy className="size-3" />
            FT
          </Badge>
        ) : null}
      </div>
    );
  }

  // ── No scores ─────────────────────────────────────────────────────
  if (status === "live") {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1 border-red-500/30 bg-red-500/10 text-[10px] uppercase tracking-wide text-red-400"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-red-400" />
          </span>
          Live
        </Badge>
        <span className="text-xs text-muted-foreground">No score yet</span>
      </div>
    );
  }

  if (status === "upcoming") {
    const timeLeft = getTimeUntil(matchDate, kickoff);
    if (!timeLeft) return null;

    return (
      <div className="flex items-center gap-1.5">
        <Clock className="size-3 text-wc-teal" />
        <span className="text-[11px] font-medium tabular-nums text-wc-teal">
          Starts in {timeLeft}
        </span>
      </div>
    );
  }

  // Finished but no score entered
  return (
    <Badge
      variant="outline"
      className="gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] uppercase tracking-wide text-amber-400"
    >
      <Radio className="size-3" />
      Score pending
    </Badge>
  );
}
