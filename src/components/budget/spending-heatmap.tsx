"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Interpolate between two oklch-ish hex-like stops for intensity */
const INTENSITY_SCALE = [
  "oklch(0.92 0.05 145)",  // very light green — near zero
  "oklch(0.82 0.10 145)",  // light green
  "oklch(0.72 0.14 130)",  // medium green-yellow
  "oklch(0.62 0.16 80)",   // warm yellow
  "oklch(0.55 0.18 45)",   // orange
  "oklch(0.45 0.20 25)",   // dark red-orange
  "oklch(0.38 0.22 18)",   // dark red
];

function intensityColor(amount: number, max: number): string {
  if (max === 0) return INTENSITY_SCALE[0];
  const ratio = Math.min(amount / max, 1);
  const idx = Math.min(Math.floor(ratio * (INTENSITY_SCALE.length - 1)), INTENSITY_SCALE.length - 1);
  return INTENSITY_SCALE[idx];
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

interface SpendingHeatmapProps {
  expenses: { amount: number; date: string }[];
  tripStart: string;
  tripDays: number;
}

export function SpendingHeatmap({ expenses, tripStart, tripDays }: SpendingHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const { days, maxSpend } = useMemo(() => {
    // Build a map of date -> total spend
    const spendByDate = new Map<string, number>();
    for (const e of expenses) {
      spendByDate.set(e.date, (spendByDate.get(e.date) ?? 0) + e.amount);
    }

    // Generate each day of the trip
    const startDate = new Date(tripStart + "T12:00:00");
    const days: { dayNum: number; date: string; label: string; amount: number }[] = [];

    for (let i = 0; i < tripDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days.push({
        dayNum: i + 1,
        date: dateStr,
        label,
        amount: spendByDate.get(dateStr) ?? 0,
      });
    }

    const maxSpend = Math.max(...days.map((d) => d.amount), 1);

    return { days, maxSpend };
  }, [expenses, tripStart, tripDays]);

  // The threshold for the legend's "high" label
  const legendMax = Math.max(500, Math.ceil(maxSpend / 100) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
          Spending Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 4x4 grid */}
        <div className="grid grid-cols-4 gap-2">
          {days.map((day) => {
            const isHovered = hoveredDay === day.dayNum;
            return (
              <button
                key={day.dayNum}
                type="button"
                className="relative rounded-lg p-2 text-center transition-all duration-200 hover:ring-2 hover:ring-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  backgroundColor: intensityColor(day.amount, legendMax),
                }}
                onMouseEnter={() => setHoveredDay(day.dayNum)}
                onMouseLeave={() => setHoveredDay(null)}
                onTouchStart={() => setHoveredDay(day.dayNum)}
                onTouchEnd={() => setHoveredDay(null)}
              >
                <span className="block text-xs font-bold text-white/90 drop-shadow-sm">
                  Day {day.dayNum}
                </span>
                <span className="block text-[10px] text-white/70 drop-shadow-sm">
                  {day.label}
                </span>
                {isHovered && (
                  <span className="absolute inset-x-0 -top-7 text-xs font-semibold bg-card text-foreground border rounded px-1.5 py-0.5 shadow-md mx-auto w-fit z-10">
                    ${fmt(day.amount)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>$0</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden flex">
            {INTENSITY_SCALE.map((color, i) => (
              <div
                key={i}
                className="flex-1 h-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span>${fmt(legendMax)}+</span>
        </div>
      </CardContent>
    </Card>
  );
}
