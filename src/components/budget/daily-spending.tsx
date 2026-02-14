"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { today } from "@/lib/dates";

// ── Types ──

interface ExpenseEntry {
  amount: number;
  date: string;
  category: string;
}

interface DailySpendingProps {
  expenses: ExpenseEntry[];
}

// ── Category Colors ──

const CATEGORY_COLORS: Record<string, string> = {
  food: "var(--wc-teal)",
  transport: "var(--wc-blue)",
  tickets: "var(--wc-gold)",
  accommodation: "var(--wc-coral)",
  drinks: "oklch(0.65 0.28 304)",       // purple-400
  activities: "oklch(0.72 0.18 162)",    // emerald-400
  shopping: "oklch(0.70 0.20 330)",      // pink-400
  other: "oklch(0.55 0 0)",             // zinc-400
};

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  transport: "Transport",
  tickets: "Tickets",
  accommodation: "Accommodation",
  drinks: "Drinks",
  activities: "Activities",
  shopping: "Shopping",
  other: "Other",
};

// ── Helpers ──

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function weekday(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

// ── Component ──

export function DailySpending({ expenses }: DailySpendingProps) {
  const todayStr = today();

  // Group expenses by date, tracking category breakdown per day
  const dailyData = useMemo(() => {
    const dayMap = new Map<string, Map<string, number>>();

    for (const e of expenses) {
      if (!dayMap.has(e.date)) {
        dayMap.set(e.date, new Map());
      }
      const catMap = dayMap.get(e.date)!;
      catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.amount);
    }

    return Array.from(dayMap.entries())
      .map(([date, catMap]) => {
        const segments = Array.from(catMap.entries())
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount);
        const total = segments.reduce((sum, s) => sum + s.amount, 0);
        return { date, segments, total };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [expenses]);

  const maxDayTotal = useMemo(
    () => Math.max(...dailyData.map((d) => d.total), 1),
    [dailyData],
  );

  // Running total by day
  const runningTotals = useMemo(() => {
    let cumulative = 0;
    return dailyData.map((d) => {
      cumulative += d.total;
      return cumulative;
    });
  }, [dailyData]);

  // All unique categories that appear across the data (for legend)
  const activeCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const day of dailyData) {
      for (const seg of day.segments) {
        cats.add(seg.category);
      }
    }
    // Sort by the order they appear in CATEGORY_COLORS keys
    const order = Object.keys(CATEGORY_COLORS);
    return Array.from(cats).sort(
      (a, b) => order.indexOf(a) - order.indexOf(b),
    );
  }, [dailyData]);

  // ── Empty state ──
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-2xl mb-2">&#x1F4B8;</p>
            <p className="text-sm font-medium">No expenses recorded yet</p>
            <p className="text-xs mt-1">
              Start logging expenses and your daily breakdown will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Daily Spending</CardTitle>
          <Badge variant="secondary" className="tabular-nums text-xs">
            {dailyData.length} day{dailyData.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Category Legend ── */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {activeCategories.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="text-[11px] text-muted-foreground">
                {CATEGORY_LABELS[cat] ?? cat}
              </span>
            </div>
          ))}
        </div>

        {/* ── Horizontal Stacked Bar Chart ── */}
        <div className="space-y-1.5">
          {dailyData.map((day, i) => {
            const isToday = day.date === todayStr;
            const barWidthPct = (day.total / maxDayTotal) * 100;

            return (
              <div
                key={day.date}
                className={cn(
                  "group rounded-md p-2 transition-colors",
                  isToday
                    ? "bg-wc-teal/8 ring-1 ring-wc-teal/25"
                    : "hover:bg-muted/30",
                )}
              >
                {/* Date + Amount header row */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        isToday ? "text-wc-teal" : "text-muted-foreground",
                      )}
                    >
                      {weekday(day.date)}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        isToday ? "text-foreground font-semibold" : "text-foreground",
                      )}
                    >
                      {shortDate(day.date)}
                    </span>
                    {isToday && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 bg-wc-teal/15 text-wc-teal"
                      >
                        Today
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-semibold tabular-nums">
                    ${fmt(day.total)}
                  </span>
                </div>

                {/* Stacked horizontal bar */}
                <div
                  className="h-4 rounded-sm overflow-hidden flex"
                  style={{ width: `${Math.max(barWidthPct, 4)}%` }}
                >
                  {day.segments.map((seg) => {
                    const segPct = (seg.amount / day.total) * 100;
                    return (
                      <div
                        key={seg.category}
                        className="h-full transition-all duration-500 first:rounded-l-sm last:rounded-r-sm"
                        style={{
                          width: `${segPct}%`,
                          backgroundColor: CATEGORY_COLORS[seg.category] ?? CATEGORY_COLORS.other,
                          opacity: isToday ? 1 : 0.75,
                        }}
                        title={`${CATEGORY_LABELS[seg.category] ?? seg.category}: $${fmt(seg.amount)}`}
                      />
                    );
                  })}
                </div>

                {/* Running total */}
                <div className="flex justify-end mt-0.5">
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    running: ${fmt(runningTotals[i])}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Grand Total ── */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="text-sm font-bold tabular-nums">
            ${fmt(runningTotals[runningTotals.length - 1] ?? 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
