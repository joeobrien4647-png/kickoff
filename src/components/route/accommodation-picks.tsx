"use client";

import { useState } from "react";
import {
  Bed,
  MapPin,
  ExternalLink,
  Star,
  DollarSign,
  UtensilsCrossed,
  Footprints,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ACCOMMODATION_CITIES } from "@/lib/accommodation-picks";
import type { AccommodationPick } from "@/lib/accommodation-picks";

// ── Style maps ───────────────────────────────────────────────────

const TYPE_STYLE: Record<AccommodationPick["type"], { label: string; className: string }> = {
  hotel: { label: "Hotel", className: "bg-purple-500/15 text-purple-700 dark:text-purple-400" },
  airbnb: { label: "Airbnb", className: "bg-pink-500/15 text-pink-700 dark:text-pink-400" },
  hostel: { label: "Hostel", className: "bg-orange-500/15 text-orange-700 dark:text-orange-400" },
  motel: { label: "Motel", className: "bg-gray-500/15 text-gray-700 dark:text-gray-400" },
};

const TIER_STYLE: Record<
  AccommodationPick["tier"],
  { label: string; className: string }
> = {
  budget: { label: "Budget", className: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400" },
  mid: { label: "Mid-Range", className: "border-wc-blue/40 text-wc-blue" },
  splurge: { label: "Splurge", className: "border-wc-gold/40 text-wc-gold" },
};

// ── Main component ───────────────────────────────────────────────

interface AccommodationPicksProps {
  picks: AccommodationPick[];
}

export function AccommodationPicks({ picks }: AccommodationPicksProps) {
  const [activeCity, setActiveCity] = useState<string>(ACCOMMODATION_CITIES[0]);

  const cityPicks = picks.filter((p) => p.city === activeCity);

  return (
    <section className="space-y-4">
      {/* ── Section header ── */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-teal/20 text-wc-teal">
          <Bed className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Where to Stay</h2>
          <p className="text-xs text-muted-foreground">
            Hand-picked stays from hostels to splurges
          </p>
        </div>
      </div>

      {/* ── City tabs (horizontal scroll) ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {ACCOMMODATION_CITIES.map((city) => {
          const isActive = city === activeCity;
          const count = picks.filter((p) => p.city === city).length;
          return (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-wc-teal text-white"
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {city}
              <span
                className={cn(
                  "ml-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px]",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted-foreground/15 text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Pick cards ── */}
      <div className="grid grid-cols-1 gap-3">
        {cityPicks.map((pick) => (
          <PickCard key={`${pick.city}-${pick.name}`} pick={pick} />
        ))}
      </div>
    </section>
  );
}

// ── Card sub-component ───────────────────────────────────────────

function PickCard({ pick }: { pick: AccommodationPick }) {
  const typeInfo = TYPE_STYLE[pick.type];
  const tierInfo = TIER_STYLE[pick.tier];

  return (
    <Card className="py-3 gap-2">
      <CardContent className="space-y-2.5">
        {/* Row 1: Name + price */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-bold leading-tight">{pick.name}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="ghost"
                className={cn("text-[10px] px-1.5 py-0", typeInfo.className)}
              >
                {typeInfo.label}
              </Badge>
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", tierInfo.className)}>
                {tierInfo.label}
              </Badge>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <MapPin className="size-2.5" />
                {pick.neighborhood}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-0.5 text-wc-gold">
              <DollarSign className="size-3.5" />
              <span className="text-base font-bold tabular-nums">{pick.pricePerNight}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">/night</span>
          </div>
        </div>

        {/* Why we picked it */}
        <div className="flex items-start gap-1.5 text-xs">
          <Star className="size-3 shrink-0 text-wc-gold mt-0.5" />
          <span className="text-muted-foreground leading-relaxed">{pick.whyWePickedIt}</span>
        </div>

        {/* Walk to stadium */}
        {pick.walkToStadium && (
          <div className="flex items-start gap-1.5 text-xs">
            <Footprints className="size-3 shrink-0 text-wc-teal mt-0.5" />
            <span className="text-muted-foreground">{pick.walkToStadium}</span>
          </div>
        )}

        {/* Nearby food */}
        <div className="flex items-start gap-1.5 text-xs">
          <UtensilsCrossed className="size-3 shrink-0 text-wc-coral mt-0.5" />
          <span className="text-muted-foreground">{pick.nearbyFood}</span>
        </div>

        {/* British note callout */}
        {pick.britishNote && (
          <div className="flex items-start gap-2 rounded-md bg-wc-blue/5 px-2.5 py-2 text-xs">
            <Info className="size-3.5 shrink-0 text-wc-blue mt-0.5" />
            <span className="text-muted-foreground leading-relaxed">{pick.britishNote}</span>
          </div>
        )}

        {/* Book button */}
        <Button
          variant="outline"
          size="xs"
          className="w-full gap-1.5 text-wc-teal border-wc-teal/30 hover:bg-wc-teal/10 hover:text-wc-teal"
          asChild
        >
          <a href={pick.bookingUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3" />
            Search on Booking.com
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
