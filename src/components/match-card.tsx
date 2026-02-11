"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Ticket,
  CheckCircle2,
  Search,
  Tv,
  Trophy,
  CalendarClock,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/dates";
import { countryFlag, TICKET_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MatchDayTimeline } from "@/components/matches/match-day-timeline";
import type { Match, Stop } from "@/lib/schema";

// ── Ticket badge config ─────────────────────────────────────────────
const TICKET_BADGE = {
  purchased: {
    icon: CheckCircle2,
    label: "Tickets Secured",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  seeking: {
    icon: Search,
    label: "Seeking Tickets",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse",
  },
  none: {
    icon: Ticket,
    label: "No Tickets",
    className: "bg-muted text-muted-foreground border-border",
  },
  gave_up: {
    icon: Tv,
    label: "Watching Elsewhere",
    className: "bg-muted/50 text-muted-foreground/60 border-border",
  },
} as const;

// ── Props ────────────────────────────────────────────────────────────
interface MatchCardProps {
  match: Match;
  /** Highlight when this match is near the traveler's current stop */
  nearby?: boolean;
  /** Tighter spacing for embedding inside other cards */
  compact?: boolean;
  /** Associated stop — used for Match Day Plan timeline */
  stop?: Stop;
}

// ── Component ────────────────────────────────────────────────────────
export function MatchCard({ match, nearby, compact, stop }: MatchCardProps) {
  const [timelineOpen, setTimelineOpen] = useState(false);
  const mustSee = match.priority >= 3;
  const ticket = TICKET_BADGE[match.ticketStatus];
  const TicketIcon = ticket.icon;
  const showTimeline = match.attending && !!match.kickoff;

  // ── Live countdown ──────────────────────────────────────────────────
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  function getMatchCountdown(): string | null {
    const matchDateTime = new Date(
      `${match.matchDate}T${match.kickoff ?? "12:00"}:00`
    );
    const diff = matchDateTime.getTime() - Date.now();

    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days === 0 && hours === 0 && minutes <= 0) return null;
    if (days === 0 && hours === 0) return `${minutes}m`;
    if (days === 0) return `${hours}h ${minutes}m`;
    if (days <= 7) return `${days}d ${hours}h`;
    return `${days}d`;
  }

  const isToday = match.matchDate === new Date().toISOString().slice(0, 10);
  const countdown = getMatchCountdown();

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden transition-colors",
        // Nearby gold accent
        nearby
          ? "border-wc-gold/30 bg-wc-gold/5"
          : "border-border bg-card",
        // Must-see gold shimmer ring
        mustSee && "ring-1 ring-wc-gold/40 shadow-[0_0_12px_-4px] shadow-wc-gold/20",
        // Compact mode reduces padding
        compact && "text-sm"
      )}
    >
      {/* ── Top bar: group + kickoff ─────────────────────────────── */}
      <div
        className={cn(
          "flex items-center justify-between bg-wc-gold/8 border-b border-wc-gold/10",
          compact ? "px-3 py-1.5" : "px-4 py-2"
        )}
      >
        <span className="text-xs font-medium text-wc-gold">
          {match.groupName ?? match.round ?? "Match"}
        </span>

        {/* Countdown */}
        {isToday ? (
          <span className="text-[10px] font-bold text-wc-coral uppercase tracking-wide animate-pulse">
            TODAY
          </span>
        ) : countdown ? (
          <span className="text-[10px] font-medium text-wc-teal tabular-nums">
            {countdown}
          </span>
        ) : null}

        {match.kickoff && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {formatTime(match.kickoff)}
          </span>
        )}
      </div>

      {/* ── Face-off center ──────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center",
          compact ? "px-3 py-3" : "px-4 py-4"
        )}
      >
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <span className="text-2xl leading-none">
            {countryFlag(match.homeTeam)}
          </span>
          <span className="text-sm font-bold text-center leading-tight truncate max-w-full">
            {match.homeTeam}
          </span>
        </div>

        {/* Divider */}
        <span className="text-xs font-medium text-muted-foreground/50 mx-3 shrink-0">
          vs
        </span>

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

      {/* ── Bottom bar: venue + ticket status ────────────────────── */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-t border-border",
          compact ? "px-3 py-1.5" : "px-4 py-2"
        )}
      >
        <span className="flex items-center gap-1 text-xs text-muted-foreground truncate min-w-0">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">
            {match.venue}, {match.city}
          </span>
        </span>

        <Badge
          variant="outline"
          className={cn(
            "shrink-0 gap-1 text-[10px] uppercase tracking-wide",
            ticket.className
          )}
        >
          <TicketIcon className="size-3" />
          {ticket.label}
        </Badge>
      </div>

      {/* ── Match Day Plan (collapsible timeline) ──────────────────── */}
      {showTimeline && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTimelineOpen((prev) => !prev);
            }}
            className={cn(
              "flex items-center gap-2 w-full text-left border-t border-border transition-colors hover:bg-muted/30",
              compact ? "px-3 py-1.5" : "px-4 py-2"
            )}
          >
            <CalendarClock className="size-3.5 text-wc-gold" />
            <span className="text-xs font-medium text-wc-gold">
              Match Day Plan
            </span>
            <ChevronDown
              className={cn(
                "size-3 text-muted-foreground ml-auto transition-transform",
                timelineOpen && "rotate-180"
              )}
            />
          </button>
          {timelineOpen && (
            <div className="border-t border-border px-4 py-4">
              <MatchDayTimeline match={match} stop={stop} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
