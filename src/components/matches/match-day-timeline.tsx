"use client";

import {
  Train,
  Car,
  Utensils,
  Trophy,
  PartyPopper,
  Sun,
  MapPin,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/dates";
import { getMatchDayPlan, type StepType, type MatchDayStep } from "@/lib/match-day-plans";
import type { Match, Stop } from "@/lib/schema";

// ── Step type styling ───────────────────────────────────────────────
const STEP_STYLES: Record<
  StepType,
  {
    icon: React.ComponentType<{ className?: string }>;
    dot: string;
    iconColor: string;
  }
> = {
  transport: {
    icon: Train,
    dot: "border-wc-blue bg-wc-blue/20",
    iconColor: "text-wc-blue",
  },
  food: {
    icon: Utensils,
    dot: "border-amber-400 bg-amber-400/20",
    iconColor: "text-amber-400",
  },
  activity: {
    icon: Sun,
    dot: "border-wc-teal bg-wc-teal/20",
    iconColor: "text-wc-teal",
  },
  match: {
    icon: Trophy,
    dot: "border-wc-gold bg-wc-gold/20",
    iconColor: "text-wc-gold",
  },
  celebration: {
    icon: PartyPopper,
    dot: "border-wc-coral bg-wc-coral/20",
    iconColor: "text-wc-coral",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────
function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const newH = Math.floor(wrapped / 60);
  const newM = wrapped % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

// ── Fallback generic steps (when no venue-specific plan exists) ─────
const GENERIC_STEPS: MatchDayStep[] = [
  {
    offset: -180,
    time: "-3h",
    label: "Breakfast",
    description: "Fuel up for match day",
    type: "food",
  },
  {
    offset: -150,
    time: "-2.5h",
    label: "Travel to stadium",
    description: "Leave early - traffic will be intense",
    type: "transport",
  },
  {
    offset: -120,
    time: "-2h",
    label: "Pre-match drinks",
    description: "Find the fan zone and soak in the atmosphere",
    type: "activity",
  },
  {
    offset: -45,
    time: "-45m",
    label: "Enter stadium",
    description: "Find your seats and grab a drink",
    type: "activity",
  },
  {
    offset: 0,
    time: "KICKOFF",
    label: "KICKOFF",
    description: "Match time!",
    type: "match",
  },
  {
    offset: 120,
    time: "+2h",
    label: "Full time",
    description: "Final whistle",
    type: "celebration",
  },
  {
    offset: 150,
    time: "+2.5h",
    label: "Post-match celebration",
    description: "Find a bar, relive the goals",
    type: "celebration",
  },
  {
    offset: 210,
    time: "+3.5h",
    label: "Return to accommodation",
    description: "Rest up for the next adventure",
    type: "transport",
  },
];

// ── Props ────────────────────────────────────────────────────────────
interface MatchDayTimelineProps {
  match: Match;
  stop?: Stop;
}

// ── Component ────────────────────────────────────────────────────────
export function MatchDayTimeline({ match, stop }: MatchDayTimelineProps) {
  if (!match.kickoff) return null;

  const kickoffTime = match.kickoff;
  const plan = getMatchDayPlan(match.venue);
  const steps = plan?.steps ?? GENERIC_STEPS;

  return (
    <div className="space-y-3">
      {/* Venue header with transport info */}
      {plan && (
        <div className="rounded-lg bg-muted/30 border border-border px-3 py-2.5 space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 text-wc-gold shrink-0" />
            <span className="text-sm font-semibold">
              {plan.venue}
            </span>
            <span className="text-xs text-muted-foreground">
              {plan.city}
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Train className="size-3 shrink-0 mt-0.5" />
            <span>
              {plan.transportFromCity} ({plan.transportTime})
            </span>
          </div>
          {plan.parkingTip && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Car className="size-3 shrink-0 mt-0.5" />
              <span>{plan.parkingTip}</span>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="relative pl-6 space-y-0">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const isKickoff = step.type === "match";
          const style = STEP_STYLES[step.type];
          const Icon = style.icon;
          const actualTime = addMinutesToTime(kickoffTime, step.offset);

          return (
            <div
              key={step.offset}
              className={cn(
                "relative flex items-start gap-3",
                !isLast && "pb-5"
              )}
            >
              {/* Colored dot on the line */}
              <div
                className={cn(
                  "absolute -left-6 top-0.5 flex items-center justify-center size-[22px] rounded-full border-2",
                  style.dot
                )}
              >
                <Icon className={cn("size-3", style.iconColor)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-px">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-mono tabular-nums",
                      isKickoff
                        ? "text-wc-gold font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatTime(actualTime)}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isKickoff && "text-wc-gold font-bold"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
                {step.tip && (
                  <div className="flex items-start gap-1.5 mt-1.5 rounded-md bg-wc-gold/5 border border-wc-gold/10 px-2 py-1.5">
                    <Lightbulb className="size-3 text-wc-gold shrink-0 mt-0.5" />
                    <span className="text-[11px] text-wc-gold/80 leading-snug">
                      {step.tip}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
