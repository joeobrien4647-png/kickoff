"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  Car,
  MapPin,
  Coffee,
  Fuel,
  Camera,
  Navigation,
  Landmark,
  CircleDot,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LEG_DETAILS, type PitStop } from "@/lib/route-details";

// ── Pit Stop Styling ─────────────────────────────────────────────────────

const STOP_STYLE: Record<
  PitStop["type"],
  { dot: string; text: string; label: string; icon: typeof Fuel }
> = {
  rest_area: { dot: "bg-gray-400", text: "text-gray-400", label: "Rest Area", icon: CircleDot },
  gas:       { dot: "bg-amber-400", text: "text-amber-400", label: "Gas", icon: Fuel },
  food:      { dot: "bg-orange-400", text: "text-orange-400", label: "Food", icon: Coffee },
  scenic:    { dot: "bg-emerald-400", text: "text-emerald-400", label: "Scenic", icon: Camera },
  coffee:    { dot: "bg-amber-700", text: "text-amber-700", label: "Coffee", icon: Coffee },
  attraction:{ dot: "bg-purple-400", text: "text-purple-400", label: "Attraction", icon: Landmark },
};

const BUFFER_MINUTES_PER_STOP = 15;

// ── Time Helpers ─────────────────────────────────────────────────────────

/** Parse "HH:MM" into total minutes from midnight */
function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/** Format total minutes from midnight into "h:mm AM/PM" */
function formatTime(totalMinutes: number): string {
  // Wrap around midnight
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = Math.round(wrapped % 60);
  const period = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${m.toString().padStart(2, "0")} ${period}`;
}

/** Format a duration in minutes as "Xh Ym" */
function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ── Timeline Calculation ─────────────────────────────────────────────────

type TimelineEntry = {
  kind: "departure" | "stop" | "arrival";
  name: string;
  time: number; // minutes from midnight
  miles: number;
  stopType?: PitStop["type"];
  cumulativeBreak: number; // minutes of breaks accumulated so far
};

function buildTimeline(legIndex: number, departureMinutes: number): TimelineEntry[] {
  const leg = LEG_DETAILS[legIndex];
  const totalDriveMinutes = leg.hours * 60 + leg.minutes;
  const avgSpeedMph = leg.miles / (totalDriveMinutes / 60);

  const entries: TimelineEntry[] = [];

  // Departure
  entries.push({
    kind: "departure",
    name: leg.from,
    time: departureMinutes,
    miles: 0,
    cumulativeBreak: 0,
  });

  // Pit stops
  let cumulativeBreak = 0;
  for (const stop of leg.pitStops) {
    const driveMinutesToStop = (stop.milesFromStart / avgSpeedMph) * 60;
    cumulativeBreak += BUFFER_MINUTES_PER_STOP;
    const arrivalAtStop = departureMinutes + driveMinutesToStop + cumulativeBreak - BUFFER_MINUTES_PER_STOP;

    entries.push({
      kind: "stop",
      name: stop.name,
      time: arrivalAtStop,
      miles: stop.milesFromStart,
      stopType: stop.type,
      cumulativeBreak,
    });
  }

  // Arrival
  const totalBreak = leg.pitStops.length * BUFFER_MINUTES_PER_STOP;
  entries.push({
    kind: "arrival",
    name: leg.to,
    time: departureMinutes + totalDriveMinutes + totalBreak,
    miles: leg.miles,
    cumulativeBreak: totalBreak,
  });

  return entries;
}

// ── Component ────────────────────────────────────────────────────────────

export function DeparturePlanner() {
  const [selectedLeg, setSelectedLeg] = useState("0");
  const [departureTime, setDepartureTime] = useState("08:00");

  const legIndex = parseInt(selectedLeg, 10);
  const leg = LEG_DETAILS[legIndex];
  const departureMinutes = parseTime(departureTime);

  const timeline = useMemo(
    () => buildTimeline(legIndex, departureMinutes),
    [legIndex, departureMinutes]
  );

  const totalDriveMinutes = leg.hours * 60 + leg.minutes;
  const totalBreakMinutes = leg.pitStops.length * BUFFER_MINUTES_PER_STOP;
  const totalTripMinutes = totalDriveMinutes + totalBreakMinutes;
  const arrivalTime = departureMinutes + totalTripMinutes;

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* ── Controls ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Navigation className="size-4 text-wc-blue" />
            <h3 className="text-sm font-semibold">Departure Time Planner</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Leg selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Route Leg
              </label>
              <Select value={selectedLeg} onValueChange={setSelectedLeg}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEG_DETAILS.map((l, i) => (
                    <SelectItem key={i} value={String(i)}>
                      <Car className="size-3.5 text-wc-blue" />
                      {l.from} &rarr; {l.to}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Departure Time
              </label>
              <Input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* ── Summary Bar ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-wc-blue/10 px-3 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-wc-blue">
            <Car className="size-3.5" />
            {leg.miles} mi
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-wc-coral">
            <Clock className="size-3.5" />
            {formatDuration(totalDriveMinutes)} driving
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-wc-teal">
            <Coffee className="size-3.5" />
            {formatDuration(totalBreakMinutes)} breaks
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-wc-gold">
            <MapPin className="size-3.5" />
            Arrive {formatTime(arrivalTime)}
          </span>
        </div>

        {/* ── Vertical Timeline ──────────────────────────────────── */}
        <div className="relative space-y-0">
          {timeline.map((entry, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === timeline.length - 1;
            const style = entry.stopType ? STOP_STYLE[entry.stopType] : null;
            const StopIcon = style?.icon ?? MapPin;

            // Dot color: blue for departure, gold for arrival, type-specific otherwise
            const dotBg = isFirst
              ? "bg-wc-blue"
              : isLast
                ? "bg-wc-gold"
                : style?.dot ?? "bg-gray-400";

            const iconColor = isFirst
              ? "text-white"
              : isLast
                ? "text-white"
                : style?.text ?? "text-gray-400";

            return (
              <div key={idx} className="relative flex gap-3 pb-4 last:pb-0">
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px border-l border-dashed border-muted-foreground/20" />
                )}

                {/* Dot */}
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5",
                    isFirst || isLast ? dotBg : `${dotBg}/15`
                  )}
                >
                  {isFirst ? (
                    <Car className={cn("size-3.5", iconColor)} />
                  ) : isLast ? (
                    <MapPin className={cn("size-3.5", iconColor)} />
                  ) : (
                    <StopIcon className={cn("size-3.5", iconColor)} />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Time */}
                    <span
                      className={cn(
                        "text-xs font-semibold tabular-nums",
                        isFirst
                          ? "text-wc-blue"
                          : isLast
                            ? "text-wc-gold"
                            : "text-foreground"
                      )}
                    >
                      {formatTime(entry.time)}
                    </span>

                    {/* Name */}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        (isFirst || isLast) && "font-semibold"
                      )}
                    >
                      {entry.name}
                    </span>

                    {/* Type badge for pit stops */}
                    {entry.kind === "stop" && style && (
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-1.5 py-0", style.text)}
                      >
                        {style.label}
                      </Badge>
                    )}

                    {/* Departure / Arrival label */}
                    {isFirst && (
                      <Badge className="bg-wc-blue/15 text-wc-blue border-0 text-[10px] px-1.5 py-0">
                        Depart
                      </Badge>
                    )}
                    {isLast && (
                      <Badge className="bg-wc-gold/15 text-wc-gold border-0 text-[10px] px-1.5 py-0">
                        Arrive
                      </Badge>
                    )}
                  </div>

                  {/* Distance info */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {entry.miles} mi from start
                    </span>
                    {entry.kind === "stop" && (
                      <span className="text-[10px] text-muted-foreground">
                        +{BUFFER_MINUTES_PER_STOP}min break
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pro Tip ────────────────────────────────────────────── */}
        <div className="flex items-start gap-2 rounded-lg border border-wc-gold/20 bg-wc-gold/5 px-3 py-2.5">
          <AlertCircle className="size-3.5 shrink-0 text-wc-gold mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-wc-gold">Pro tip:</span> Add 30
            min to account for traffic, tolls, and wrong turns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
