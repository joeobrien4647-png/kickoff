"use client";

import { useState } from "react";
import {
  ChevronDown,
  Clock,
  DollarSign,
  Star,
  Lightbulb,
  Fuel,
  Coffee,
  UtensilsCrossed,
  Camera,
  Landmark,
  CircleDot,
  AlertTriangle,
  Hotel,
  Navigation,
  Car,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LegDetail, PitStop } from "@/lib/route-details";

// ── Constants ───────────────────────────────────────────────────────────

const LONG_LEG_HOURS = 6;

/** Color config for each pit stop type */
const PIT_STOP_STYLE: Record<
  PitStop["type"],
  { dot: string; bg: string; label: string; icon: typeof Fuel }
> = {
  gas: { dot: "bg-amber-400", bg: "bg-amber-400/10", label: "Gas", icon: Fuel },
  food: { dot: "bg-orange-400", bg: "bg-orange-400/10", label: "Food", icon: UtensilsCrossed },
  scenic: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", label: "Scenic", icon: Camera },
  attraction: { dot: "bg-purple-400", bg: "bg-purple-400/10", label: "Attraction", icon: Landmark },
  coffee: { dot: "bg-amber-700", bg: "bg-amber-700/10", label: "Coffee", icon: Coffee },
  rest_area: { dot: "bg-blue-400", bg: "bg-blue-400/10", label: "Rest Area", icon: CircleDot },
};

// ── Props ───────────────────────────────────────────────────────────────

interface LegDetailsProps {
  legs: LegDetail[];
}

// ── Component ───────────────────────────────────────────────────────────

export function LegDetails({ legs }: LegDetailsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="space-y-3">
      {legs.map((leg, index) => {
        const isOpen = openIndex === index;
        const totalHours = leg.hours + leg.minutes / 60;
        const isLong = totalHours >= LONG_LEG_HOURS;
        const timeLabel =
          leg.minutes > 0
            ? `${leg.hours}h ${leg.minutes}m`
            : `${leg.hours}h`;

        return (
          <Card
            key={`${leg.from}-${leg.to}`}
            className={cn(
              "overflow-hidden transition-colors py-0",
              isLong && "border-wc-coral/20 bg-wc-coral/[0.03]"
            )}
          >
            {/* ── Collapsible Header ─────────────────────────────── */}
            <button
              onClick={() => toggle(index)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-4 py-3.5 transition-colors hover:bg-accent/30",
                isOpen && "border-b border-border"
              )}
            >
              {/* Leg number */}
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isLong
                    ? "bg-wc-coral/15 text-wc-coral"
                    : "bg-wc-blue/15 text-wc-blue"
                )}
              >
                {index + 1}
              </span>

              {/* From -> To */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {leg.from}{" "}
                  <span className="text-muted-foreground font-normal">
                    &rarr;
                  </span>{" "}
                  {leg.to}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {leg.miles} mi
                  </span>
                  {leg.highways.slice(0, 2).map((hw) => (
                    <Badge
                      key={hw}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {hw}
                    </Badge>
                  ))}
                  {leg.highways.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{leg.highways.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Time badge */}
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 gap-1 text-xs tabular-nums",
                  isLong
                    ? "border-wc-coral/30 text-wc-coral"
                    : "border-border text-muted-foreground"
                )}
              >
                <Clock className="size-3" />
                {timeLabel}
              </Badge>

              {/* Long drive warning */}
              {isLong && (
                <AlertTriangle className="size-4 shrink-0 text-wc-coral" />
              )}

              {/* Chevron */}
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {/* ── Expanded Content ────────────────────────────────── */}
            {isOpen && (
              <CardContent className="space-y-5 py-4">
                {/* Highway Route */}
                <DetailSection title="Highway Route">
                  <div className="flex flex-wrap gap-1.5">
                    {leg.highways.map((hw, i) => (
                      <span key={hw} className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {hw}
                        </Badge>
                        {i < leg.highways.length - 1 && (
                          <span className="text-muted-foreground text-xs">
                            &rarr;
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </DetailSection>

                {/* Terrain & Scenery */}
                <DetailSection title="Terrain & Scenery">
                  <p className="text-sm text-muted-foreground">
                    {leg.terrain}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3.5",
                          i < leg.scenicRating
                            ? "fill-wc-gold text-wc-gold"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {leg.scenicRating}/5
                    </span>
                  </div>
                </DetailSection>

                {/* Tolls */}
                <DetailSection title="Tolls">
                  <div className="flex items-center gap-1.5 text-sm">
                    <DollarSign className="size-3.5 text-wc-gold" />
                    <span className="text-muted-foreground">
                      {leg.tollEstimate}
                    </span>
                  </div>
                </DetailSection>

                {/* Best Time */}
                <DetailSection title="Best Time to Depart">
                  <div className="flex items-start gap-1.5 text-sm">
                    <Clock className="size-3.5 text-wc-teal shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {leg.bestTimeToDepart}
                    </span>
                  </div>
                </DetailSection>

                {/* Pit Stops Timeline */}
                <DetailSection title="Pit Stops">
                  <div className="relative space-y-0">
                    {leg.pitStops.map((stop, stopIdx) => {
                      const style = PIT_STOP_STYLE[stop.type];
                      const StopIcon = style.icon;
                      const isLastStop = stopIdx === leg.pitStops.length - 1;

                      return (
                        <div key={stop.name} className="relative flex gap-3 pb-4 last:pb-0">
                          {/* Vertical connector line */}
                          {!isLastStop && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-px border-l border-dashed border-muted-foreground/20" />
                          )}

                          {/* Colored dot */}
                          <div
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full mt-0.5",
                              style.bg
                            )}
                          >
                            <StopIcon
                              className={cn("size-3", style.dot.replace("bg-", "text-"))}
                            />
                          </div>

                          {/* Stop details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium">
                                {stop.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {style.label}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground tabular-nums">
                                {stop.milesFromStart} mi
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {stop.location}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {stop.description}
                            </p>
                            {stop.tip && (
                              <p className="text-xs text-wc-gold mt-1 flex items-start gap-1">
                                <Lightbulb className="size-3 shrink-0 mt-0.5" />
                                <span>{stop.tip}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DetailSection>

                {/* Overnight Options */}
                {leg.overnightOptions && leg.overnightOptions.length > 0 && (
                  <DetailSection title="Overnight Options">
                    <div className="grid gap-2">
                      {leg.overnightOptions.map((opt) => (
                        <div
                          key={opt.city}
                          className="rounded-lg border border-border p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center gap-1.5">
                              <Hotel className="size-3.5 text-wc-blue" />
                              {opt.city}, {opt.state}
                            </span>
                            <div className="flex gap-2 text-[10px] text-muted-foreground tabular-nums">
                              <span>{opt.milesFromStart} mi in</span>
                              <span>{opt.milesRemaining} mi left</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {opt.description}
                          </p>
                          <div className="text-xs">
                            <span className="font-medium text-wc-teal">
                              Stay:{" "}
                            </span>
                            <span className="text-muted-foreground">
                              {opt.hotelSuggestion}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="font-medium text-wc-coral">
                              Eat:{" "}
                            </span>
                            <span className="text-muted-foreground">
                              {opt.nearbyFood}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DetailSection>
                )}

                {/* Driving Tips */}
                <DetailSection title="Tips">
                  <ul className="space-y-1.5">
                    {leg.drivingTips.map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <Lightbulb className="size-3 shrink-0 text-wc-gold mt-0.5" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </DetailSection>

                {/* Leg Summary Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Car className="size-3" />
                    {leg.miles} mi
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {timeLabel}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Navigation className="size-3" />
                    {leg.pitStops.length} stops
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <DollarSign className="size-3" />
                    {leg.tollEstimate}
                  </span>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* ── Grand Total ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-medium">
          <Car className="size-3 text-wc-blue" />
          {legs.reduce((sum, l) => sum + l.miles, 0).toLocaleString()} total
          miles
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          <Clock className="size-3 text-wc-coral" />
          {Math.floor(
            legs.reduce((sum, l) => sum + l.hours + l.minutes / 60, 0)
          )}
          h{" "}
          {Math.round(
            (legs.reduce((sum, l) => sum + l.hours + l.minutes / 60, 0) % 1) *
              60
          )}
          m driving
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          <Navigation className="size-3 text-wc-teal" />
          {legs.reduce((sum, l) => sum + l.pitStops.length, 0)} pit stops
        </span>
      </div>
    </div>
  );
}

// ── Sub-Components ──────────────────────────────────────────────────────

/** Small section heading used within expanded leg details */
function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
        {title}
      </h4>
      {children}
    </div>
  );
}
