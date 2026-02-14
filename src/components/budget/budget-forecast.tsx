"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TRIP_START } from "@/lib/dates";

// ── Constants ──

const TRIP_DAYS = 16;
const TRAVELERS = 3;
const DAILY_BUDGET_PP = 150;
const TOTAL_BUDGET = DAILY_BUDGET_PP * TRAVELERS * TRIP_DAYS; // $7,200

// ── Helpers ──

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtWhole(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** Compute the current trip day (1-based), or 0 if before trip, or TRIP_DAYS if after. */
function computeCurrentDay(): number {
  const now = new Date();
  const start = new Date(TRIP_START + "T00:00:00");
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays < 1) return 0;
  if (diffDays > TRIP_DAYS) return TRIP_DAYS;
  return diffDays;
}

// ── Types ──

interface BudgetForecastProps {
  totalSpent: number;
}

// ── Component ──

export function BudgetForecast({ totalSpent }: BudgetForecastProps) {
  const currentDay = computeCurrentDay();
  const safeDays = Math.max(currentDay, 1);

  const projection = useMemo(
    () => (totalSpent / safeDays) * TRIP_DAYS,
    [totalSpent, safeDays],
  );

  const dailyAvgPerPerson = useMemo(
    () => totalSpent / TRAVELERS / safeDays,
    [totalSpent, safeDays],
  );

  // Budget health: green / amber / red
  const projectionRatio = projection / TOTAL_BUDGET;
  const status: "green" | "amber" | "red" =
    projectionRatio > 1 ? "red" : projectionRatio > 0.8 ? "amber" : "green";

  const statusConfig = {
    green: {
      label: "On Track",
      barColor: "var(--wc-teal)",
      projColor: "var(--wc-teal)",
      badgeCn: "bg-wc-teal/15 text-wc-teal",
    },
    amber: {
      label: "Watch It",
      barColor: "var(--wc-gold)",
      projColor: "var(--wc-gold)",
      badgeCn: "bg-wc-gold/15 text-wc-gold",
    },
    red: {
      label: "Over Budget",
      barColor: "var(--wc-coral)",
      projColor: "var(--destructive)",
      badgeCn: "bg-destructive/15 text-destructive",
    },
  }[status];

  // Progress bar widths (capped at 100% for display, but we show overflow via label)
  const spentPct = Math.min((totalSpent / TOTAL_BUDGET) * 100, 100);
  const projectedPct = Math.min((projection / TOTAL_BUDGET) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Budget vs Forecast</CardTitle>
          <Badge variant="secondary" className={cn("text-xs", statusConfig.badgeCn)}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ── Actual vs Projected side-by-side ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Actual so far
            </p>
            <p className="text-2xl font-bold tabular-nums">
              ${fmtWhole(totalSpent)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Day {currentDay} of {TRIP_DAYS}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Projected total
            </p>
            <p
              className="text-2xl font-bold tabular-nums"
              style={{ color: statusConfig.projColor }}
            >
              ${fmtWhole(projection)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              at current pace
            </p>
          </div>
        </div>

        {/* ── Visual Progress Bar ── */}
        <div className="space-y-2">
          {/* Stacked bar: spent (solid) + projected remainder (striped) */}
          <div className="relative h-5 rounded-full bg-muted/40 overflow-hidden">
            {/* Projected fill (background, lighter) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 opacity-30"
              style={{
                width: `${projectedPct}%`,
                backgroundColor: statusConfig.barColor,
              }}
            />
            {/* Actual spent fill (foreground, solid) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${spentPct}%`,
                backgroundColor: statusConfig.barColor,
              }}
            />
            {/* Budget marker line at 100% */}
            {projectedPct < 100 && (
              <div className="absolute inset-y-0 right-0 w-px bg-foreground/20" />
            )}
          </div>

          {/* Labels below bar */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              ${fmtWhole(totalSpent)} spent
            </span>
            <span>
              ${fmtWhole(TOTAL_BUDGET)} budget
            </span>
          </div>
        </div>

        {/* ── Per-Person Daily Average ── */}
        <div className="rounded-lg border bg-muted/20 p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Per-person daily avg
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Target: ${DAILY_BUDGET_PP}/day
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-xl font-bold tabular-nums",
                dailyAvgPerPerson > DAILY_BUDGET_PP
                  ? "text-destructive"
                  : "text-wc-teal",
              )}
            >
              ${fmt(dailyAvgPerPerson)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              /person/day
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
