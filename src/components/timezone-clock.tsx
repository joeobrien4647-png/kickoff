"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TIMEZONES = {
  london: "Europe/London",
  eastern: "America/New_York",
  central: "America/Chicago",
} as const;

function formatTime(tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function formatTime12(tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

/** Get the UTC offset difference in hours between two timezones right now */
function getOffsetDiff(tzFrom: string, tzTo: string): number {
  const now = new Date();
  // Build a formatter that shows the raw offset parts
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: tzFrom,
    timeZoneName: "shortOffset",
  };
  const fromOffset = parseOffset(
    new Intl.DateTimeFormat("en-US", opts).format(now)
  );
  const toOffset = parseOffset(
    new Intl.DateTimeFormat("en-US", {
      ...opts,
      timeZone: tzTo,
    }).format(now)
  );
  return fromOffset - toOffset;
}

/** Parse "GMT+1" / "GMT-5" / "GMT" from formatted string */
function parseOffset(formatted: string): number {
  const match = formatted.match(/GMT([+-]?\d+)?/);
  if (!match) return 0;
  return match[1] ? parseInt(match[1], 10) : 0;
}

interface TimeDisplayProps {
  flag: string;
  label: string;
  time12: string;
  time24: string;
}

function TimeDisplay({ flag, label, time12, time24 }: TimeDisplayProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-base leading-none" role="img" aria-label={label}>
        {flag}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold tabular-nums truncate">{time12}</p>
        <p className="text-[10px] text-muted-foreground tabular-nums">
          {time24}
        </p>
      </div>
    </div>
  );
}

interface TimezoneClockProps {
  showNashville?: boolean;
  className?: string;
}

export function TimezoneClock({
  showNashville = false,
  className,
}: TimezoneClockProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const londonTime12 = formatTime12(TIMEZONES.london);
  const londonTime24 = formatTime(TIMEZONES.london);
  const easternTime12 = formatTime12(TIMEZONES.eastern);
  const easternTime24 = formatTime(TIMEZONES.eastern);
  const centralTime12 = formatTime12(TIMEZONES.central);
  const centralTime24 = formatTime(TIMEZONES.central);

  const offsetHours = Math.abs(getOffsetDiff(TIMEZONES.london, TIMEZONES.eastern));

  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            World Clock
          </p>
          <Clock className="size-3.5 text-muted-foreground/60" />
        </div>

        {/* Time displays */}
        <div
          className={cn(
            "grid gap-3",
            showNashville ? "grid-cols-3" : "grid-cols-2"
          )}
        >
          <TimeDisplay
            flag="\uD83C\uDDEC\uD83C\uDDE7"
            label="United Kingdom"
            time12={londonTime12}
            time24={londonTime24}
          />

          <TimeDisplay
            flag="\uD83C\uDDFA\uD83C\uDDF8"
            label="US Eastern"
            time12={easternTime12}
            time24={easternTime24}
          />

          {showNashville && (
            <TimeDisplay
              flag="\uD83C\uDFB5"
              label="Nashville (Central)"
              time12={centralTime12}
              time24={centralTime24}
            />
          )}
        </div>

        {/* Separator + offset reminder */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="h-px flex-1 bg-border" />
          <Badge
            variant="secondary"
            className="text-[10px] text-wc-teal font-medium"
          >
            US is {offsetHours}h behind UK
          </Badge>
          <div className="h-px flex-1 bg-border" />
        </div>
      </CardContent>
    </Card>
  );
}
