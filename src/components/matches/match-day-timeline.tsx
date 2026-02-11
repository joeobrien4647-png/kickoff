"use client";

import {
  Coffee,
  Car,
  Beer,
  DoorOpen,
  Trophy,
  Clock,
  PartyPopper,
  Hotel,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/dates";
import type { Match, Stop } from "@/lib/schema";

// ── Timeline block definition ────────────────────────────────────────
interface TimelineBlock {
  /** Offset in minutes relative to kickoff */
  offset: number;
  label: string;
  tip?: string;
  icon: React.ComponentType<{ className?: string }>;
  isKickoff?: boolean;
}

const BLOCKS: TimelineBlock[] = [
  {
    offset: -180,
    label: "Wake up & breakfast",
    tip: "Fuel up — it's going to be a long day",
    icon: Coffee,
  },
  {
    offset: -150,
    label: "Travel to stadium area",
    tip: "Leave early — traffic will be intense",
    icon: Car,
  },
  {
    offset: -120,
    label: "Pre-match drinks at fan zone",
    tip: "Soak in the atmosphere",
    icon: Beer,
  },
  {
    offset: -45,
    label: "Enter stadium",
    tip: "Find your seats and grab a drink",
    icon: DoorOpen,
  },
  {
    offset: 0,
    label: "KICKOFF",
    icon: Trophy,
    isKickoff: true,
  },
  {
    offset: 120,
    label: "Full time",
    tip: "Final whistle — what a match!",
    icon: Clock,
  },
  {
    offset: 150,
    label: "Post-match celebration",
    tip: "Find a bar, relive the goals",
    icon: PartyPopper,
  },
  {
    offset: 210,
    label: "Return to accommodation",
    tip: "Rest up for the next adventure",
    icon: Hotel,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────
function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutes;
  // Handle overflow past midnight
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const newH = Math.floor(wrapped / 60);
  const newM = wrapped % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

// ── Props ────────────────────────────────────────────────────────────
interface MatchDayTimelineProps {
  match: Match;
  stop?: Stop;
}

// ── Component ────────────────────────────────────────────────────────
export function MatchDayTimeline({ match, stop }: MatchDayTimelineProps) {
  if (!match.kickoff) return null;

  const kickoffTime = match.kickoff; // "HH:MM" format

  // Build timeline entries with computed times
  const entries = BLOCKS.map((block) => {
    const time = addMinutesToTime(kickoffTime, block.offset);

    // Inject fan zone info for the fan zone step
    let tip = block.tip;
    if (block.offset === -120 && match.fanZone) {
      tip = `Head to ${match.fanZone}`;
    }

    return { ...block, time, tip };
  });

  return (
    <div className="relative pl-6 space-y-0">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

      {entries.map((entry, i) => {
        const Icon = entry.icon;
        const isLast = i === entries.length - 1;

        return (
          <div
            key={entry.offset}
            className={cn("relative flex items-start gap-3", !isLast && "pb-5")}
          >
            {/* Dot on the line */}
            <div
              className={cn(
                "absolute -left-6 top-0.5 flex items-center justify-center size-[22px] rounded-full border-2",
                entry.isKickoff
                  ? "border-wc-gold bg-wc-gold/20"
                  : "border-border bg-background"
              )}
            >
              <Icon
                className={cn(
                  "size-3",
                  entry.isKickoff ? "text-wc-gold" : "text-muted-foreground"
                )}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-px">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-mono tabular-nums",
                    entry.isKickoff
                      ? "text-wc-gold font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  {formatTime(entry.time)}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    entry.isKickoff && "text-wc-gold font-bold"
                  )}
                >
                  {entry.label}
                </span>
              </div>
              {entry.tip && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {entry.tip}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
