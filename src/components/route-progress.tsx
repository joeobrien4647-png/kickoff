"use client";

import { useMemo } from "react";
import { Car, Check, Flag, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { formatDate } from "@/lib/dates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Stop = {
  city: string;
  arriveDate: string;
  departDate: string;
  sortOrder: number;
};

export type RouteProgressProps = {
  stops: Stop[];
  currentDate?: string; // ISO date string, defaults to today
};

// ---------------------------------------------------------------------------
// Leg mileage — cumulative distances along the route
// Sourced from route-details.ts LEG_DETAILS
// ---------------------------------------------------------------------------
const LEG_MILES = [0, 215, 95, 140, 670, 780]; // [start, BOS->NYC, NYC->PHL, PHL->DC, DC->NSH, NSH->MIA]
const TOTAL_MILES = LEG_MILES.reduce((sum, m) => sum + m, 0); // 1900

/** Cumulative miles at each stop index */
function cumulativeMiles(): number[] {
  const cum: number[] = [0];
  for (let i = 1; i < LEG_MILES.length; i++) {
    cum.push(cum[i - 1] + LEG_MILES[i]);
  }
  return cum;
}

const CUM_MILES = cumulativeMiles();

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
function toMs(dateStr: string): number {
  return new Date(dateStr + "T12:00:00").getTime();
}

function diffDays(a: string, b: string): number {
  return Math.round((toMs(b) - toMs(a)) / (1000 * 60 * 60 * 24));
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Compute trip state from stops + current date
// ---------------------------------------------------------------------------
type TripPhase = "before" | "during" | "after";
type StopStatus = "visited" | "current" | "upcoming";

type TripState = {
  phase: TripPhase;
  /** 0-based index of the current stop (-1 if before, stops.length if after) */
  currentStopIndex: number;
  /** Progress along the track: 0..1 */
  trackProgress: number;
  /** Day N of the trip (1-indexed), null if not during */
  dayOfTrip: number | null;
  /** Total trip days */
  totalDays: number;
  /** Miles covered so far */
  milesCovered: number;
  /** Per-stop status */
  stopStatuses: StopStatus[];
};

function computeTripState(stops: Stop[], date: string): TripState {
  const n = stops.length;
  const tripStart = stops[0].arriveDate;
  const tripEnd = stops[n - 1].departDate;
  const totalDays = diffDays(tripStart, tripEnd);

  // Before the trip starts
  if (date < tripStart) {
    return {
      phase: "before",
      currentStopIndex: -1,
      trackProgress: 0,
      dayOfTrip: null,
      totalDays,
      milesCovered: 0,
      stopStatuses: stops.map(() => "upcoming"),
    };
  }

  // After the trip ends
  if (date >= tripEnd) {
    return {
      phase: "after",
      currentStopIndex: n,
      trackProgress: 1,
      dayOfTrip: null,
      totalDays,
      milesCovered: TOTAL_MILES,
      stopStatuses: stops.map(() => "visited"),
    };
  }

  // During the trip — find which stop or segment we're in
  const dayNum = diffDays(tripStart, date) + 1;

  // Check each stop: are we at a city or traveling between?
  for (let i = 0; i < n; i++) {
    const arrive = stops[i].arriveDate;
    const depart = stops[i].departDate;

    // We're at this city
    if (date >= arrive && date < depart) {
      const statuses: StopStatus[] = stops.map((_, j) =>
        j < i ? "visited" : j === i ? "current" : "upcoming"
      );

      // Track position: at the node for this stop
      const trackPos = n > 1 ? i / (n - 1) : 0;

      return {
        phase: "during",
        currentStopIndex: i,
        trackProgress: trackPos,
        dayOfTrip: dayNum,
        totalDays,
        milesCovered: CUM_MILES[i],
        stopStatuses: statuses,
      };
    }

    // We're traveling from stop i to stop i+1
    if (i < n - 1) {
      const depart_i = stops[i].departDate;
      const arrive_next = stops[i + 1].arriveDate;

      if (date >= depart_i && date < arrive_next) {
        const statuses: StopStatus[] = stops.map((_, j) =>
          j <= i ? "visited" : "upcoming"
        );

        // Interpolate between stop i and stop i+1
        const travelDays = diffDays(depart_i, arrive_next);
        const daysTraveled = diffDays(depart_i, date);
        const frac = travelDays > 0 ? daysTraveled / travelDays : 0;
        const trackPos = n > 1 ? (i + frac) / (n - 1) : 0;

        // Miles interpolation
        const segmentMiles = CUM_MILES[i + 1] - CUM_MILES[i];
        const milesCovered = CUM_MILES[i] + segmentMiles * frac;

        return {
          phase: "during",
          currentStopIndex: i, // last visited stop
          trackProgress: trackPos,
          dayOfTrip: dayNum,
          totalDays,
          milesCovered: Math.round(milesCovered),
          stopStatuses: statuses,
        };
      }
    }
  }

  // Fallback (shouldn't reach here)
  return {
    phase: "during",
    currentStopIndex: 0,
    trackProgress: 0,
    dayOfTrip: diffDays(tripStart, date) + 1,
    totalDays,
    milesCovered: 0,
    stopStatuses: stops.map(() => "upcoming"),
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function RouteProgress({ stops, currentDate }: RouteProgressProps) {
  const date = currentDate ?? todayISO();

  const state = useMemo(() => computeTripState(stops, date), [stops, date]);

  const progressPct = Math.round(state.trackProgress * 100);
  const milesRemaining = TOTAL_MILES - state.milesCovered;

  return (
    <Card className="py-5 overflow-hidden">
      <CardContent className="space-y-4">
        {/* ── Header: Day count & progress ────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Car className="size-4 text-wc-teal" />
            <span className="text-sm font-semibold">Route Progress</span>
          </div>
          <Badge variant="secondary" className="text-xs tabular-nums">
            {state.phase === "before" && "Trip hasn't started"}
            {state.phase === "after" && "Trip complete!"}
            {state.phase === "during" &&
              `Day ${state.dayOfTrip} of ${state.totalDays} — ${progressPct}%`}
          </Badge>
        </div>

        {/* ── Desktop: horizontal track ────────────────────────────── */}
        <div className="hidden sm:block">
          <HorizontalTrack stops={stops} state={state} />
        </div>

        {/* ── Mobile: vertical track ──────────────────────────────── */}
        <div className="block sm:hidden">
          <VerticalTrack stops={stops} state={state} />
        </div>

        {/* ── Stats row ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
          <span className="flex items-center gap-1.5">
            <Flag className="size-3 text-wc-teal" />
            {state.milesCovered.toLocaleString()} mi covered
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3 text-wc-coral" />
            {milesRemaining.toLocaleString()} mi remaining
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Horizontal Track (desktop)
// ---------------------------------------------------------------------------
function HorizontalTrack({
  stops,
  state,
}: {
  stops: Stop[];
  state: TripState;
}) {
  const n = stops.length;

  return (
    <div className="relative pt-8 pb-6 px-2">
      {/* ── Gradient track line ─────────────────────────────────── */}
      <div className="absolute top-[calc(2rem+5px)] left-2 right-2 h-[3px] rounded-full bg-gradient-to-r from-wc-teal to-wc-gold opacity-25" />

      {/* ── Filled progress line ────────────────────────────────── */}
      <div
        className="absolute top-[calc(2rem+5px)] left-2 h-[3px] rounded-full bg-gradient-to-r from-wc-teal to-wc-gold transition-all duration-700 ease-out"
        style={{
          width: `${state.trackProgress * 100}%`,
        }}
      />

      {/* ── Car marker ──────────────────────────────────────────── */}
      <div
        className="absolute top-1 z-10 transition-all duration-700 ease-out"
        style={{
          left: `calc(${state.trackProgress * 100}% + 0.5rem)`,
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex flex-col items-center route-progress-bounce">
          <Car className="size-5 text-wc-gold" />
        </div>
      </div>

      {/* ── City nodes ──────────────────────────────────────────── */}
      <div className="relative flex justify-between">
        {stops.map((stop, i) => {
          const status = state.stopStatuses[i];
          return (
            <CityNode
              key={stop.city}
              city={stop.city}
              arriveDate={stop.arriveDate}
              status={status}
              isFirst={i === 0}
              isLast={i === n - 1}
              layout="horizontal"
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vertical Track (mobile)
// ---------------------------------------------------------------------------
function VerticalTrack({
  stops,
  state,
}: {
  stops: Stop[];
  state: TripState;
}) {
  const n = stops.length;

  return (
    <div className="relative pl-8 py-2">
      {/* ── Gradient track line (vertical) ──────────────────────── */}
      <div className="absolute left-[19px] top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-wc-teal to-wc-gold opacity-25" />

      {/* ── Filled progress line (vertical) ─────────────────────── */}
      <div
        className="absolute left-[19px] top-2 w-[3px] rounded-full bg-gradient-to-b from-wc-teal to-wc-gold transition-all duration-700 ease-out"
        style={{
          height: `${state.trackProgress * 100}%`,
        }}
      />

      {/* ── Car marker (vertical) ───────────────────────────────── */}
      <div
        className="absolute left-[9px] z-10 transition-all duration-700 ease-out"
        style={{
          top: `calc(${state.trackProgress * 100}% + 0.5rem)`,
          transform: "translateY(-50%)",
        }}
      >
        <div className="route-progress-bounce">
          <Car className="size-5 text-wc-gold" />
        </div>
      </div>

      {/* ── City nodes ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {stops.map((stop, i) => {
          const status = state.stopStatuses[i];
          return (
            <CityNode
              key={stop.city}
              city={stop.city}
              arriveDate={stop.arriveDate}
              status={status}
              isFirst={i === 0}
              isLast={i === n - 1}
              layout="vertical"
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// City Node
// ---------------------------------------------------------------------------
function CityNode({
  city,
  arriveDate,
  status,
  isFirst,
  isLast,
  layout,
}: {
  city: string;
  arriveDate: string;
  status: StopStatus;
  isFirst: boolean;
  isLast: boolean;
  layout: "horizontal" | "vertical";
}) {
  const identity = getCityIdentity(city);

  const isHorizontal = layout === "horizontal";

  // Node dot styling based on status
  const nodeClasses = cn(
    "size-[13px] rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-500",
    status === "visited" && `${identity.bg} ${identity.border} ${identity.color}`,
    status === "current" && `${identity.bg} ${identity.border} route-progress-pulse`,
    status === "upcoming" && "bg-muted border-border"
  );

  if (isHorizontal) {
    return (
      <div
        className="flex flex-col items-center gap-1.5 min-w-0"
        style={{
          alignItems: isFirst
            ? "flex-start"
            : isLast
              ? "flex-end"
              : "center",
        }}
      >
        {/* Dot */}
        <div className={nodeClasses}>
          {status === "visited" && (
            <Check className={cn("size-2", identity.color)} strokeWidth={3} />
          )}
        </div>

        {/* City label */}
        <span
          className={cn(
            "text-[10px] leading-tight font-medium",
            status === "upcoming"
              ? "text-muted-foreground"
              : identity.color
          )}
        >
          {city}
        </span>

        {/* Date */}
        <span className="text-[9px] text-muted-foreground/70 leading-none">
          {formatDate(arriveDate)}
        </span>
      </div>
    );
  }

  // Vertical layout
  return (
    <div className="flex items-center gap-3 relative">
      {/* Dot — positioned to sit on the vertical track */}
      <div
        className={cn(nodeClasses, "absolute -left-8")}
        style={{ top: "50%", transform: "translate(-50%, -50%)", left: "-19px" }}
      >
        {status === "visited" && (
          <Check className={cn("size-2", identity.color)} strokeWidth={3} />
        )}
      </div>

      {/* City info */}
      <div className="min-w-0">
        <span
          className={cn(
            "text-sm font-medium leading-tight",
            status === "upcoming"
              ? "text-muted-foreground"
              : identity.color
          )}
        >
          {city}
        </span>
        <span className="text-xs text-muted-foreground/70 ml-2">
          {formatDate(arriveDate)}
        </span>
        {status === "current" && (
          <Badge
            variant="secondary"
            className={cn("ml-2 text-[10px] px-1.5 py-0", identity.color)}
          >
            Now
          </Badge>
        )}
      </div>
    </div>
  );
}
