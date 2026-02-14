"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCityIdentity } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Inline-safe color mapping from city identity tokens to CSS values */
const CITY_CSS_COLORS: Record<string, string> = {
  "text-wc-teal": "var(--wc-teal)",
  "text-wc-blue": "var(--wc-blue)",
  "text-wc-coral": "var(--wc-coral)",
  "text-wc-gold": "var(--wc-gold)",
  "text-orange-400": "oklch(0.75 0.18 55)",
  "text-emerald-400": "oklch(0.72 0.18 162)",
  "text-muted-foreground": "var(--muted-foreground)",
};

function cssColor(city: string): string {
  const identity = getCityIdentity(city);
  return CITY_CSS_COLORS[identity.color] ?? "var(--wc-teal)";
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

interface CitySpendingProps {
  expenses: { amount: number; stopId: string | null; category: string }[];
  stops: { id: string; city: string }[];
}

export function CitySpending({ expenses, stops }: CitySpendingProps) {
  const { cityData, total, mostExpensive, cheapest } = useMemo(() => {
    const stopMap = new Map(stops.map((s) => [s.id, s.city]));
    const cityTotals = new Map<string, number>();

    for (const e of expenses) {
      const city = e.stopId ? (stopMap.get(e.stopId) ?? "Unassigned") : "Unassigned";
      cityTotals.set(city, (cityTotals.get(city) ?? 0) + e.amount);
    }

    const sorted = Array.from(cityTotals.entries())
      .map(([city, amount]) => ({ city, amount }))
      .sort((a, b) => b.amount - a.amount);

    const total = sorted.reduce((sum, c) => sum + c.amount, 0);
    const mostExpensive = sorted[0] ?? null;
    const cheapest = sorted.length > 1 ? sorted[sorted.length - 1] : null;

    return { cityData: sorted, total, mostExpensive, cheapest };
  }, [expenses, stops]);

  const maxAmount = cityData[0]?.amount ?? 1;

  if (cityData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
          Spending by City
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cityData.map(({ city, amount }) => {
          const widthPct = (amount / maxAmount) * 100;
          const totalPct = total > 0 ? (amount / total) * 100 : 0;
          const color = cssColor(city);

          return (
            <div key={city} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={cn("font-medium", getCityIdentity(city).color)}>
                  {city}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-6 rounded bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${Math.max(widthPct, 2)}%`,
                      backgroundColor: color,
                      opacity: 0.8,
                    }}
                  />
                </div>
                <span className="text-sm font-medium tabular-nums shrink-0">
                  ${fmt(amount)}{" "}
                  <span className="text-muted-foreground text-xs">
                    ({Math.round(totalPct)}%)
                  </span>
                </span>
              </div>
            </div>
          );
        })}

        {/* Summary */}
        {mostExpensive && (
          <div className="pt-3 border-t text-xs text-muted-foreground text-center">
            <span>
              Most expensive:{" "}
              <span className={cn("font-semibold", getCityIdentity(mostExpensive.city).color)}>
                {mostExpensive.city}
              </span>{" "}
              (${fmt(mostExpensive.amount)})
            </span>
            {cheapest && cheapest.city !== mostExpensive.city && (
              <span>
                {" | "}Cheapest:{" "}
                <span className={cn("font-semibold", getCityIdentity(cheapest.city).color)}>
                  {cheapest.city}
                </span>{" "}
                (${fmt(cheapest.amount)})
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
