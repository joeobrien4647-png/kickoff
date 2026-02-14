"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type CountdownEvent = {
  label: string;
  date: string; // ISO date e.g. "2026-06-14"
  time?: string; // "15:00" (optional)
  type: "match" | "travel" | "activity" | "deadline";
  icon?: string; // emoji override
};

interface EventCountdownsProps {
  events: CountdownEvent[];
}

// ---------------------------------------------------------------------------
// Type-specific styling
// ---------------------------------------------------------------------------
const EVENT_STYLES: Record<
  CountdownEvent["type"],
  { accent: string; bg: string; border: string; icon: string }
> = {
  match: {
    accent: "text-wc-teal",
    bg: "bg-wc-teal/10",
    border: "border-wc-teal/20",
    icon: "\u26BD",
  },
  travel: {
    accent: "text-wc-blue",
    bg: "bg-wc-blue/10",
    border: "border-wc-blue/20",
    icon: "\u2708\uFE0F",
  },
  activity: {
    accent: "text-wc-gold",
    bg: "bg-wc-gold/10",
    border: "border-wc-gold/20",
    icon: "\uD83C\uDFAF",
  },
  deadline: {
    accent: "text-wc-coral",
    bg: "bg-wc-coral/10",
    border: "border-wc-coral/20",
    icon: "\u23F0",
  },
};

// ---------------------------------------------------------------------------
// Time math
// ---------------------------------------------------------------------------
function getEventTimestamp(event: CountdownEvent): number {
  const dateStr = event.time
    ? `${event.date}T${event.time}:00`
    : `${event.date}T00:00:00`;
  return new Date(dateStr).getTime();
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "NOW!";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remHours = hours % 24;
    const remMins = minutes % 60;
    return `${days}d ${remHours}h ${remMins}m`;
  }
  if (hours > 0) {
    const remMins = minutes % 60;
    return `${hours}h ${remMins}m`;
  }
  // Less than 1 hour — show minutes and seconds
  const remSecs = seconds % 60;
  return `${minutes}m ${remSecs}s`;
}

// ---------------------------------------------------------------------------
// Individual event row
// ---------------------------------------------------------------------------
function EventRow({
  event,
  remaining,
  isUrgent,
}: {
  event: CountdownEvent;
  remaining: number;
  isUrgent: boolean;
}) {
  const style = EVENT_STYLES[event.type];
  const icon = event.icon || style.icon;
  const isNow = remaining <= 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-all",
        isUrgent ? cn(style.bg, style.border) : "border-border",
        isNow && "animate-pulse"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-base",
          isUrgent ? style.bg : "bg-muted"
        )}
      >
        {icon}
      </div>

      {/* Label + type */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isUrgent && "font-semibold"
          )}
        >
          {event.label}
        </p>
        <p className="text-[10px] text-muted-foreground capitalize">
          {event.type}
          {event.time && ` \u00B7 ${event.time}`}
        </p>
      </div>

      {/* Countdown */}
      <div className="shrink-0 text-right">
        {isNow ? (
          <span
            className={cn(
              "text-sm font-bold animate-pulse",
              style.accent
            )}
          >
            NOW!
          </span>
        ) : (
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              isUrgent ? style.accent : "text-muted-foreground"
            )}
          >
            {formatCountdown(remaining)}
          </span>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// Main component
// ===========================================================================
export function EventCountdowns({ events }: EventCountdownsProps) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Sort by soonest first, filter to upcoming (or just started = NOW), take top 5
  const upcoming = useMemo(() => {
    return events
      .map((event) => ({
        event,
        timestamp: getEventTimestamp(event),
      }))
      .filter(({ timestamp }) => timestamp >= now - 60_000) // include events started within last minute
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 5);
  }, [events, now]);

  if (upcoming.length === 0) return null;

  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <h3 className="text-sm font-bold">Upcoming Events</h3>

        <div className="space-y-2">
          {upcoming.map(({ event, timestamp }, i) => (
            <EventRow
              key={`${event.date}-${event.label}`}
              event={event}
              remaining={timestamp - now}
              isUrgent={i === 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
