"use client";

import { useMemo } from "react";
import { today } from "@/lib/dates";
import type { Expense, Traveler, Stop } from "@/lib/schema";

const BUDGET_PER_PERSON = 3000;

/**
 * Map city identity Tailwind color tokens to CSS custom property references.
 * CITY_IDENTITY stores Tailwind classes like "text-wc-teal", but for inline
 * styles on bar elements we need the underlying CSS variable.
 */
const CITY_BAR_COLORS: Record<string, string> = {
  Boston: "var(--wc-teal)",
  "New York": "var(--wc-blue)",
  Philadelphia: "var(--wc-coral)",
  "Washington DC": "var(--wc-gold)",
  Atlanta: "oklch(0.65 0.22 300)", // purple-400 equivalent
  Miami: "oklch(0.72 0.18 162)", // emerald-400 equivalent
};

function cityBarColor(city: string): string {
  return CITY_BAR_COLORS[city] ?? "var(--wc-teal)";
}

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

interface BudgetAnalyticsProps {
  expenses: Expense[];
  travelers: Traveler[];
  stops: Stop[];
  totalSpent: number;
  perPerson: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

export function BudgetAnalytics({
  expenses,
  travelers,
  stops,
  totalSpent,
}: BudgetAnalyticsProps) {
  // ── Spending by City ──
  const spendingByCity = useMemo(() => {
    const stopMap = new Map(stops.map((s) => [s.id, s]));
    const cityTotals = new Map<string, number>();

    for (const e of expenses) {
      const stop = e.stopId ? stopMap.get(e.stopId) : null;
      const city = stop?.city ?? "Unassigned";
      cityTotals.set(city, (cityTotals.get(city) ?? 0) + e.amount);
    }

    return Array.from(cityTotals.entries())
      .map(([city, amount]) => ({ city, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, stops]);

  const maxCityAmount = spendingByCity[0]?.amount ?? 1;

  // ── Spending by Person (who paid) ──
  const spendingByPerson = useMemo(() => {
    const paidTotals = new Map<string, number>();
    for (const e of expenses) {
      paidTotals.set(e.paidBy, (paidTotals.get(e.paidBy) ?? 0) + e.amount);
    }

    return travelers
      .map((t) => ({ traveler: t, amount: paidTotals.get(t.id) ?? 0 }))
      .filter((entry) => entry.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, travelers]);

  const maxPersonAmount = spendingByPerson[0]?.amount ?? 1;

  // ── Daily Spending Trend ──
  const dailySpending = useMemo(() => {
    const dayTotals = new Map<string, number>();
    for (const e of expenses) {
      dayTotals.set(e.date, (dayTotals.get(e.date) ?? 0) + e.amount);
    }
    return Array.from(dayTotals.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [expenses]);

  const maxDayAmount = useMemo(
    () => Math.max(...dailySpending.map((d) => d.amount), 1),
    [dailySpending],
  );

  const todayStr = today();

  // ── Budget Health ──
  const budgetHealth = useMemo(() => {
    const totalBudget = BUDGET_PER_PERSON * travelers.length;
    const pctUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const overBudget = totalSpent > totalBudget;
    const greenPct = overBudget ? (totalBudget / totalSpent) * 100 : pctUsed;
    const redPct = overBudget ? 100 - greenPct : 0;

    return { totalBudget, pctUsed, overBudget, greenPct, redPct };
  }, [travelers.length, totalSpent]);

  if (expenses.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Analytics
      </h2>

      {/* ── Budget Health ── */}
      <div className="rounded-lg border bg-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Budget Health</span>
          <span className="text-sm tabular-nums font-medium">
            {Math.round(budgetHealth.pctUsed)}% used
          </span>
        </div>
        <div className="h-4 rounded-full bg-muted/40 overflow-hidden flex">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min(budgetHealth.greenPct, 100)}%`,
              backgroundColor: "var(--wc-teal)",
            }}
          />
          {budgetHealth.redPct > 0 && (
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${budgetHealth.redPct}%`,
                backgroundColor: "var(--destructive)",
              }}
            />
          )}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${fmt(totalSpent)} spent</span>
          <span>${fmt(budgetHealth.totalBudget)} budget</span>
        </div>
      </div>

      {/* ── Spending by City ── */}
      {spendingByCity.length > 0 && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <span className="text-sm font-medium">Spending by City</span>
          <div className="space-y-2">
            {spendingByCity.map(({ city, amount }) => {
              const pct = (amount / maxCityAmount) * 100;
              return (
                <div key={city} className="flex items-center gap-3">
                  <span className="text-sm w-28 shrink-0 truncate">{city}</span>
                  <div className="flex-1 h-5 rounded bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cityBarColor(city),
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium tabular-nums w-20 text-right">
                    ${fmt(amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Spending by Person ── */}
      {spendingByPerson.length > 0 && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <span className="text-sm font-medium">Spending by Person</span>
          <div className="space-y-2">
            {spendingByPerson.map(({ traveler, amount }) => {
              const pct = (amount / maxPersonAmount) * 100;
              return (
                <div key={traveler.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: traveler.color }}
                    />
                    <span className="text-sm truncate">{traveler.name}</span>
                  </div>
                  <div className="flex-1 h-5 rounded bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: traveler.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium tabular-nums w-20 text-right">
                    ${fmt(amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Daily Spending Trend ── */}
      {dailySpending.length > 1 && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <span className="text-sm font-medium">Daily Spending</span>
          <div className="flex items-end gap-1 h-32">
            {dailySpending.map(({ date, amount }) => {
              const heightPct = (amount / maxDayAmount) * 100;
              const isToday = date === todayStr;
              return (
                <div
                  key={date}
                  className="flex-1 flex flex-col items-center justify-end h-full min-w-0"
                >
                  <span className="text-[9px] tabular-nums font-medium text-muted-foreground mb-1 hidden sm:block">
                    ${Math.round(amount)}
                  </span>
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${Math.max(heightPct, 3)}%`,
                      backgroundColor: isToday
                        ? "var(--wc-coral)"
                        : "var(--wc-teal)",
                      opacity: isToday ? 1 : 0.65,
                    }}
                  />
                  <span
                    className={`text-[9px] mt-1 truncate w-full text-center ${
                      isToday
                        ? "font-bold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {shortDate(date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
