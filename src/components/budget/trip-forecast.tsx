"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  Plane,
  Car,
  Bed,
  Utensils,
  Ticket,
  Coins,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Types ──

interface TripForecastProps {
  travelers: { id: string; name: string; emoji: string; color: string }[];
  totalSpentSoFar: number;
  expenseCount: number;
}

// ── Cost Model ──

const TRAVELERS_COUNT = 3;
const USD_TO_GBP = 0.79;

interface CostEstimate {
  label: string;
  perPerson?: number;
  total?: number;
  perDay?: boolean;
  days?: number;
  notes: string;
  category: string;
}

const COST_ESTIMATES: Record<string, CostEstimate> = {
  flights: {
    label: "Flights (return, UK \u2194 US)",
    perPerson: 650,
    notes: "LHR\u2192BOS, MIA\u2192LHR. Based on June 2026 averages.",
    category: "transport",
  },
  rentalCar: {
    label: "Rental car (15 days, one-way)",
    total: 900,
    notes: "Boston pickup, Miami drop-off. One-way fee included.",
    category: "transport",
  },
  gas: {
    label: "Gas (~1,900 miles @ $0.15/mi)",
    total: 285,
    notes: "Split 3 ways. US gas is much cheaper than UK.",
    category: "transport",
  },
  accommodation: {
    label: "Accommodation",
    total: 1800,
    notes: "Mix of Airbnb, hotels, and free stays (Lisa\u2019s, Greg\u2019s sister).",
    category: "accommodation",
  },
  dailyBudget: {
    label: "Daily spending",
    perPerson: 150,
    perDay: true,
    days: 15,
    notes: "Food, drinks, activities, local transport. Adjustable.",
    category: "daily",
  },
  matchTickets: {
    label: "Match tickets (estimate)",
    perPerson: 300,
    notes: "2\u20133 matches @ $100\u2013150 each if available.",
    category: "tickets",
  },
  misc: {
    label: "Misc (tips, tolls, parking, souvenirs)",
    perPerson: 200,
    notes: "US tipping adds up fast. Budget $1\u20132 per drink, 18\u201320% at restaurants.",
    category: "other",
  },
};

// ── Category Icons ──

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  transport: Car,
  accommodation: Bed,
  daily: Utensils,
  tickets: Ticket,
  other: Coins,
};

// ── Helpers ──

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ── Component ──

export function TripForecast({
  travelers,
  totalSpentSoFar,
  expenseCount,
}: TripForecastProps) {
  const [dailyBudget, setDailyBudget] = useState(150);

  // Compute each line item's per-person cost, driven by the slider for daily spending
  const lineItems = useMemo(() => {
    return Object.entries(COST_ESTIMATES).map(([key, est]) => {
      let perPerson: number;

      if (key === "dailyBudget") {
        // Dynamic: slider controls this
        perPerson = dailyBudget * (est.days ?? 15);
      } else if (est.perPerson != null) {
        perPerson = est.perPerson;
      } else {
        // Shared cost split across travelers
        perPerson = Math.round((est.total ?? 0) / TRAVELERS_COUNT);
      }

      return {
        key,
        label: est.label,
        perPerson,
        notes: est.notes,
        category: est.category,
      };
    });
  }, [dailyBudget]);

  const totalPerPerson = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.perPerson, 0),
    [lineItems],
  );

  const totalForGroup = totalPerPerson * TRAVELERS_COUNT;
  const maxItemCost = Math.max(...lineItems.map((i) => i.perPerson), 1);

  // Progress: how much of the forecast has already been spent
  const spentPct = totalForGroup > 0
    ? Math.min((totalSpentSoFar / totalForGroup) * 100, 100)
    : 0;

  // GBP conversion
  const gbpPerPerson = Math.round(totalPerPerson * USD_TO_GBP);

  return (
    <Card className="overflow-hidden">
      {/* ── Header ── */}
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-lg bg-wc-gold/10">
            <TrendingUp className="size-4 text-wc-gold" />
          </div>
          <div>
            <CardTitle>Trip Forecast</CardTitle>
            <CardDescription>Projected cost for 15 days, 6 stops, ~1,900 miles</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ── Headline Numbers ── */}
        <div className="text-center space-y-1">
          <p className="text-4xl font-bold tracking-tight">
            <span className="text-wc-teal">$</span>
            {fmtCurrency(totalPerPerson)}
            <span className="text-lg font-normal text-muted-foreground ml-1">/person</span>
          </p>
          <p className="text-sm text-muted-foreground">
            ${fmtCurrency(totalForGroup)} total for {travelers.length || TRAVELERS_COUNT}
          </p>
        </div>

        {/* ── Breakdown Table ── */}
        <div className="space-y-2">
          {lineItems.map((item) => {
            const Icon = CATEGORY_ICONS[item.category] ?? DollarSign;
            const barPct = (item.perPerson / maxItemCost) * 100;

            return (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <Icon className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm flex-1 min-w-0 truncate">{item.label}</span>
                  <span className="text-sm font-semibold tabular-nums shrink-0">
                    ${fmtCurrency(item.perPerson)}
                  </span>
                </div>
                {/* Background proportion bar */}
                <div className="ml-6 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barPct}%`,
                      backgroundColor: item.key === "dailyBudget"
                        ? "var(--wc-coral)"
                        : "var(--wc-teal)",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <p className="ml-6 text-[11px] text-muted-foreground leading-tight">
                  {item.notes}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Daily Budget Slider ── */}
        <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Daily Budget</span>
            <Badge variant="secondary" className="tabular-nums">
              ${dailyBudget}/day
            </Badge>
          </div>
          <input
            type="range"
            min={100}
            max={300}
            step={10}
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            className={cn(
              "w-full h-2 rounded-full appearance-none cursor-pointer",
              "bg-muted/60",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:size-5",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-wc-teal",
              "[&::-webkit-slider-thumb]:shadow-md",
              "[&::-webkit-slider-thumb]:cursor-pointer",
              "[&::-webkit-slider-thumb]:transition-transform",
              "[&::-webkit-slider-thumb]:hover:scale-110",
              "[&::-moz-range-thumb]:size-5",
              "[&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-wc-teal",
              "[&::-moz-range-thumb]:border-0",
              "[&::-moz-range-thumb]:shadow-md",
              "[&::-moz-range-thumb]:cursor-pointer",
            )}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>$100/day (frugal)</span>
            <span>$300/day (splash out)</span>
          </div>
        </div>

        {/* ── Already Spent ── */}
        <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">Already Spent</span>
            </div>
            <span className="text-sm font-semibold tabular-nums">
              ${fmtCurrency(totalSpentSoFar)}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${spentPct}%`,
                backgroundColor: spentPct > 80 ? "var(--destructive)" : "var(--wc-teal)",
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>
              {expenseCount} expense{expenseCount !== 1 ? "s" : ""} logged
            </span>
            <span>
              {Math.round(spentPct)}% of forecast
            </span>
          </div>
        </div>
      </CardContent>

      {/* ── Footer: GBP conversion ── */}
      <CardFooter className="justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground">
          <Plane className="inline size-3 mr-1 -mt-0.5" />
          {"\u2248 \u00A3"}{fmtCurrency(gbpPerPerson)} per person at $1 = {"\u00A3"}0.79
        </p>
      </CardFooter>
    </Card>
  );
}
