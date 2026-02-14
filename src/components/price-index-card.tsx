"use client";

import { useState } from "react";
import {
  Beer,
  Car,
  Coffee,
  Droplets,
  Lightbulb,
  Pizza,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { CITY_PRICES, GBP_RATE, getCostTier } from "@/lib/price-index";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function usd(n: number) {
  return `$${n % 1 === 0 ? n : n.toFixed(2)}`;
}

function gbp(n: number) {
  const converted = n * GBP_RATE;
  return `\u00A3${converted % 1 === 0 ? converted : converted.toFixed(2)}`;
}

function fmt(n: number, showGbp: boolean) {
  return showGbp ? gbp(n) : usd(n);
}

function range(r: { low: number; high: number }, showGbp: boolean) {
  return `${fmt(r.low, showGbp)}-${fmt(r.high, showGbp)}`;
}

const TIER_STYLES = {
  cheap: {
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    label: "Budget-friendly",
  },
  moderate: {
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    label: "Moderate",
  },
  expensive: {
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    label: "Pricey",
  },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PriceIndexCard() {
  const [showGbp, setShowGbp] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-base font-semibold">Price Index</h2>
        <Button
          variant="outline"
          size="xs"
          onClick={() => setShowGbp((v) => !v)}
          className="tabular-nums"
        >
          {showGbp ? "\u00A3 GBP" : "$ USD"}
        </Button>
      </div>

      <Tabs defaultValue={CITY_PRICES[0].city} className="px-6 pb-6 pt-3">
        <TabsList variant="line" className="w-full flex-wrap gap-0">
          {CITY_PRICES.map(({ city }) => {
            const identity = getCityIdentity(city);
            return (
              <TabsTrigger key={city} value={city} className="text-xs px-2">
                <span className={cn("hidden sm:inline", identity.color)}>
                  {city}
                </span>
                {/* Short name on mobile */}
                <span className={cn("sm:hidden", identity.color)}>
                  {city === "Washington DC"
                    ? "DC"
                    : city === "Philadelphia"
                      ? "Philly"
                      : city === "New York"
                        ? "NYC"
                        : city}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {CITY_PRICES.map((cp) => {
          const identity = getCityIdentity(cp.city);
          const tier = getCostTier(cp.city);
          const tierStyle = TIER_STYLES[tier];

          return (
            <TabsContent key={cp.city} value={cp.city}>
              <div className="space-y-4 pt-4">
                {/* City header */}
                <div className="flex items-center gap-2">
                  <h3 className={cn("text-lg font-semibold", identity.color)}>
                    {cp.city}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-1.5 py-0 h-4", tierStyle.badge)}
                  >
                    {tierStyle.label}
                  </Badge>
                </div>

                {/* Price grid */}
                <div className="grid grid-cols-2 gap-3">
                  <PriceItem
                    icon={Beer}
                    label="Pint"
                    value={range(cp.pint, showGbp)}
                  />
                  <PriceItem
                    icon={Wine}
                    label="Cocktail"
                    value={range(cp.cocktail, showGbp)}
                  />
                  <PriceItem
                    icon={Coffee}
                    label="Coffee"
                    value={fmt(cp.coffee, showGbp)}
                  />
                  <PriceItem
                    icon={Pizza}
                    label="Pizza Slice"
                    value={fmt(cp.slice, showGbp)}
                  />
                  <PriceItem
                    icon={Droplets}
                    label="Water Bottle"
                    value={fmt(cp.bottleWater, showGbp)}
                  />
                  <PriceItem
                    icon={Car}
                    label="Uber (5 mi)"
                    value={range(cp.uber5mi, showGbp)}
                  />
                </div>

                {/* Meal tiers */}
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <UtensilsCrossed className="size-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Meal Prices
                    </span>
                  </div>
                  <MealRow
                    label="Casual"
                    desc="Burgers, tacos, diners"
                    value={fmt(cp.meal.casual, showGbp)}
                  />
                  <MealRow
                    label="Mid-range"
                    desc="Sit-down restaurant"
                    value={fmt(cp.meal.midRange, showGbp)}
                  />
                  <MealRow
                    label="Nice"
                    desc="Steakhouse / upscale"
                    value={fmt(cp.meal.nice, showGbp)}
                  />
                </div>

                {/* Budget tip */}
                <div className="flex items-start gap-2 rounded-lg border border-wc-gold/20 bg-wc-gold/5 p-3">
                  <Lightbulb className="size-4 shrink-0 text-wc-gold mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Budget tip:
                    </span>{" "}
                    {cp.budgetTip}
                  </p>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Fine print */}
      <div className="px-6 pb-4">
        <p className="text-[10px] text-muted-foreground/60 text-center">
          Prices are approximate 2025-2026 estimates. GBP rate: $1 ={" "}
          {"\u00A3"}
          {GBP_RATE}
        </p>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PriceItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground leading-tight">
          {label}
        </p>
        <p className="text-sm font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function MealRow({
  label,
  desc,
  value,
}: {
  label: string;
  desc: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-xs ml-1.5">{desc}</span>
      </div>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
