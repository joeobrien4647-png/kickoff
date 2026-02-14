"use client";

import {
  Route,
  Fuel,
  DollarSign,
  MapPin,
  Lightbulb,
  Car,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import {
  FUEL_ESTIMATES,
  RENTAL_CAR_INFO,
  TOTAL_FUEL_ESTIMATE,
  type FuelEstimate,
} from "@/lib/fuel-data";

// ── Sub-components ─────────────────────────────────────────────────

function TotalCard() {
  return (
    <Card className="py-4 gap-3 border-wc-teal/30 bg-gradient-to-br from-wc-teal/8 via-transparent to-transparent">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-teal/20 text-wc-teal">
            <Fuel className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Trip Fuel Estimate</h2>
            <p className="text-xs text-muted-foreground">
              Boston to Miami, {TOTAL_FUEL_ESTIMATE.miles} miles total
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-card border p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Miles</p>
            <p className="text-lg font-bold text-wc-teal">
              {TOTAL_FUEL_ESTIMATE.miles.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-card border p-3 text-center">
            <p className="text-xs text-muted-foreground">Est. Gallons</p>
            <p className="text-lg font-bold text-wc-gold">
              ~{TOTAL_FUEL_ESTIMATE.gallons}
            </p>
          </div>
          <div className="rounded-lg bg-card border p-3 text-center">
            <p className="text-xs text-muted-foreground">Est. Cost</p>
            <p className="text-lg font-bold text-wc-coral">
              ${TOTAL_FUEL_ESTIMATE.cost}
            </p>
          </div>
        </div>

        {/* Rental info */}
        <div className="flex items-start gap-2 rounded-lg bg-wc-blue/5 border border-wc-blue/15 px-3 py-2.5 text-xs">
          <Car className="size-3.5 shrink-0 text-wc-blue mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">
              {RENTAL_CAR_INFO.type} &middot; {RENTAL_CAR_INFO.mpg} MPG
            </p>
            <p className="text-muted-foreground">
              {RENTAL_CAR_INFO.pickupCity} &rarr; {RENTAL_CAR_INFO.dropoffCity}
              {" \u2014 "}
              {RENTAL_CAR_INFO.estimatedCost}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LegCard({ leg }: { leg: FuelEstimate }) {
  const fromIdentity = getCityIdentity(leg.from);
  const toIdentity = getCityIdentity(leg.to);

  return (
    <Card className="py-3 gap-2">
      <CardContent className="space-y-2.5">
        {/* Route header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn("text-sm font-bold", fromIdentity.color)}>
              {leg.from}
            </span>
            <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
            <span className={cn("text-sm font-bold", toIdentity.color)}>
              {leg.to}
            </span>
          </div>
          <Badge
            variant="ghost"
            className="text-[10px] px-1.5 py-0 bg-wc-coral/15 text-wc-coral shrink-0"
          >
            ${leg.estimatedCost}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Route className="size-3 text-wc-teal" />
            <span>{leg.miles} mi</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="size-3 text-wc-gold" />
            <span>~{leg.estimatedGallons} gal</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="size-3 text-wc-coral" />
            <span>${leg.gasPrice.toFixed(2)}/gal avg</span>
          </div>
        </div>

        <Separator />

        {/* Recommended stations */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recommended Stations
          </p>
          <div className="flex flex-wrap gap-1.5">
            {leg.stations.map((station) => (
              <Badge
                key={station}
                variant="outline"
                className="text-[10px] px-1.5 py-0"
              >
                <MapPin className="size-2.5 mr-0.5" />
                {station}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TipsCard() {
  return (
    <Card className="py-3 gap-2">
      <CardContent className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-wc-gold" />
          <h3 className="text-sm font-semibold">Fuel Tips</h3>
        </div>
        <ul className="space-y-2 pl-0.5">
          {RENTAL_CAR_INFO.tips.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-xs">
              <span className="text-wc-teal font-bold shrink-0">
                {i + 1}.
              </span>
              <span className="text-muted-foreground leading-relaxed">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ── Main Component ─────────────────────────────────────────────────

export function FuelEstimator() {
  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-teal/20 text-wc-teal">
          <Fuel className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Gas &amp; Fuel Costs</h2>
          <p className="text-xs text-muted-foreground">
            Per-leg fuel estimates at ~{RENTAL_CAR_INFO.mpg} MPG
          </p>
        </div>
      </div>

      {/* Total estimate hero card */}
      <TotalCard />

      {/* Per-leg breakdown */}
      <div className="grid grid-cols-1 gap-3">
        {FUEL_ESTIMATES.map((leg) => (
          <LegCard key={`${leg.from}-${leg.to}`} leg={leg} />
        ))}
      </div>

      {/* Tips */}
      <TipsCard />
    </section>
  );
}
