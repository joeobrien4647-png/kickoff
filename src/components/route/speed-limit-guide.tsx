"use client";

import { useState } from "react";
import { Gauge, ChevronDown, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SPEED_LIMITS, STRICT_STATES, type StateSpeedLimit } from "@/lib/speed-limits";

// ── Helpers ──────────────────────────────────────────────────────────

function SpeedCell({ mph, kmh }: { mph: number; kmh: number }) {
  return (
    <div className="text-center">
      <span className="text-sm font-semibold tabular-nums">{mph}</span>
      <span className="text-[10px] text-muted-foreground ml-0.5">mph</span>
      <div className="text-[10px] text-muted-foreground tabular-nums">
        {kmh} km/h
      </div>
    </div>
  );
}

function StateSummaryBadge({ state }: { state: StateSpeedLimit }) {
  const isStrict = STRICT_STATES.has(state.abbreviation);
  return (
    <Badge
      variant="ghost"
      className={cn(
        "text-xs px-2 py-0.5",
        isStrict
          ? "bg-wc-coral/15 text-wc-coral"
          : "bg-muted text-muted-foreground",
      )}
    >
      {state.abbreviation}: {state.interstate.mph} mph
    </Badge>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export function SpeedLimitGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="size-5 text-wc-teal" />
          Speed Limit Guide
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info banner */}
        <div className="flex items-start gap-2 rounded-md bg-wc-blue/5 px-3 py-2.5 text-xs">
          <Info className="size-3.5 shrink-0 text-wc-blue mt-0.5" />
          <div className="space-y-1 text-muted-foreground leading-relaxed">
            <p>
              US speed limits are in <strong className="text-foreground">mph</strong>.
              1 mph &asymp; 1.6 km/h. Limits shown below include km/h conversions.
            </p>
            <p>
              UK driving licence is valid in the US for up to 90 days &mdash;
              no International Driving Permit needed.
            </p>
          </div>
        </div>

        {/* Virginia warning callout */}
        <div className="flex items-start gap-2 rounded-md border border-wc-coral/30 bg-wc-coral/5 px-3 py-2.5 text-xs">
          <AlertTriangle className="size-4 shrink-0 text-wc-coral mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-wc-coral">Virginia &mdash; Strict Enforcement</p>
            <p className="text-muted-foreground leading-relaxed">
              Driving 20+ mph over the limit <em>or</em> over 85 mph is a
              <strong className="text-wc-coral"> reckless driving</strong> charge
              (Class 1 misdemeanor). This can mean fines up to $2,500, licence
              suspension, and even jail time. Cruise control is your friend through VA.
            </p>
          </div>
        </div>

        {/* Summary row (always visible) */}
        <div className="flex flex-wrap gap-1.5">
          {SPEED_LIMITS.map((s) => (
            <StateSummaryBadge key={s.abbreviation} state={s} />
          ))}
        </div>

        {/* Expand / collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-1.5 text-xs text-muted-foreground"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Hide" : "Show"} full state-by-state breakdown
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </Button>

        {/* Full breakdown */}
        {expanded && (
          <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_repeat(4,_minmax(0,_1fr))] gap-2 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <div>State</div>
              <div className="text-center">Interstate</div>
              <div className="text-center">Urban</div>
              <div className="text-center">Residential</div>
              <div className="text-center">School</div>
            </div>

            {/* State rows */}
            {SPEED_LIMITS.map((state) => {
              const isStrict = STRICT_STATES.has(state.abbreviation);
              return (
                <div
                  key={state.abbreviation}
                  className={cn(
                    "rounded-lg border p-3 space-y-2 transition-colors",
                    isStrict
                      ? "border-wc-coral/30 bg-wc-coral/5"
                      : "border-border bg-card/50",
                  )}
                >
                  {/* Speed grid */}
                  <div className="grid grid-cols-[1fr_repeat(4,_minmax(0,_1fr))] items-center gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0 shrink-0",
                          isStrict && "border-wc-coral/40 text-wc-coral",
                        )}
                      >
                        {state.abbreviation}
                      </Badge>
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          isStrict && "text-wc-coral",
                        )}
                      >
                        {state.state}
                      </span>
                    </div>
                    <SpeedCell mph={state.interstate.mph} kmh={state.interstate.kmh} />
                    <SpeedCell mph={state.urban.mph} kmh={state.urban.kmh} />
                    <SpeedCell mph={state.residential.mph} kmh={state.residential.kmh} />
                    <SpeedCell mph={state.schoolZone.mph} kmh={state.schoolZone.kmh} />
                  </div>

                  {/* Notes */}
                  <p
                    className={cn(
                      "text-[11px] leading-relaxed",
                      isStrict
                        ? "text-wc-coral/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {state.notes}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
