"use client";

import { useState } from "react";
import { Tv, MapPin, Users, Star, CalendarCheck, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import {
  WATCH_SPOTS,
  WATCH_SPOT_CITIES,
  type WatchSpot,
} from "@/lib/watch-spots";

// ── Type badge styling ──────────────────────────────────────────────
const TYPE_CONFIG: Record<
  WatchSpot["type"],
  { label: string; className: string }
> = {
  sports_bar: {
    label: "Sports Bar",
    className: "bg-wc-blue/10 text-wc-blue border-wc-blue/30",
  },
  fan_zone: {
    label: "Fan Zone",
    className: "bg-wc-gold/10 text-wc-gold border-wc-gold/30",
  },
  pub: {
    label: "Pub",
    className: "bg-wc-teal/10 text-wc-teal border-wc-teal/30",
  },
  rooftop: {
    label: "Rooftop",
    className: "bg-purple-400/10 text-purple-400 border-purple-400/30",
  },
  beer_garden: {
    label: "Beer Garden",
    className: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  },
};

// ── Atmosphere indicator ────────────────────────────────────────────
const ATMOSPHERE_CONFIG: Record<
  WatchSpot["atmosphere"],
  { label: string; className: string }
> = {
  rowdy: { label: "Rowdy", className: "text-wc-coral" },
  chill: { label: "Chill", className: "text-wc-teal" },
  upscale: { label: "Upscale", className: "text-wc-gold" },
  family: { label: "Family", className: "text-wc-blue" },
};

function mapsUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + city)}`;
}

// ── Single spot card ────────────────────────────────────────────────
function SpotCard({ spot, city }: { spot: WatchSpot; city: string }) {
  const type = TYPE_CONFIG[spot.type];
  const atmo = ATMOSPHERE_CONFIG[spot.atmosphere];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 px-3 py-2.5 border-b border-border">
        <div className="min-w-0">
          <h4 className="text-sm font-bold leading-tight truncate">
            {spot.name}
          </h4>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <MapPin className="size-2.5 shrink-0" />
            {spot.neighborhood}
          </span>
        </div>
        <Badge
          variant="outline"
          className={cn("shrink-0 text-[10px] uppercase tracking-wide", type.className)}
        >
          {type.label}
        </Badge>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {spot.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-[11px]">
            <Tv className="size-3 text-muted-foreground" />
            <span className="text-foreground font-medium">{spot.screenCount}</span>
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Users className="size-3 text-muted-foreground" />
            <span className={cn("font-medium", atmo.className)}>
              {atmo.label}
            </span>
          </span>
          {spot.reservationNeeded && (
            <span className="flex items-center gap-1 text-[11px]">
              <CalendarCheck className="size-3 text-wc-coral" />
              <span className="text-wc-coral font-medium">Reserve</span>
            </span>
          )}
          <a
            href={mapsUrl(spot.name, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-wc-teal hover:underline ml-auto"
          >
            <Navigation className="size-3" />
            <span className="font-medium">Navigate</span>
          </a>
        </div>
      </div>

      {/* Tip footer */}
      <div className="px-3 py-2 border-t border-border bg-wc-gold/5">
        <p className="text-[11px] leading-relaxed">
          <Star className="size-2.5 text-wc-gold inline mr-1 -translate-y-px" />
          <span className="text-wc-gold font-medium">Tip:</span>{" "}
          <span className="text-muted-foreground">{spot.tip}</span>
        </p>
      </div>
    </div>
  );
}

// ── Main watch guide component ──────────────────────────────────────
export function WatchGuide() {
  const [activeCity, setActiveCity] = useState<string>(WATCH_SPOT_CITIES[0]);
  const spots = WATCH_SPOTS[activeCity] ?? [];

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Tv className="size-5 text-wc-gold" />
        <div>
          <h2 className="text-lg font-bold leading-none">Where to Watch</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Best bars &amp; fan zones when you can&rsquo;t be at the stadium
          </p>
        </div>
      </div>

      {/* City tabs */}
      <Tabs value={activeCity} onValueChange={setActiveCity}>
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList variant="line" className="w-full justify-start">
            {WATCH_SPOT_CITIES.map((city) => {
              const identity = getCityIdentity(city);
              return (
                <TabsTrigger
                  key={city}
                  value={city}
                  className={cn(
                    "text-xs whitespace-nowrap",
                    activeCity === city && identity.color
                  )}
                >
                  {city}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {WATCH_SPOT_CITIES.map((city) => {
          const citySpots = WATCH_SPOTS[city] ?? [];
          const identity = getCityIdentity(city);

          return (
            <TabsContent key={city} value={city}>
              {/* City tagline */}
              <p
                className={cn(
                  "text-xs font-medium mb-3 mt-1",
                  identity.color
                )}
              >
                {citySpots.length} spots in {city}
              </p>

              {/* Spot cards */}
              <div className="space-y-3">
                {citySpots.map((spot) => (
                  <SpotCard key={spot.name} spot={spot} city={city} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
