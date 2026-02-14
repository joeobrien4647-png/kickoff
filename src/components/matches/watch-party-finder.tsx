"use client";

import { useState, useMemo } from "react";
import { Tv, MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import type { WatchPartySpot } from "@/lib/watch-spots";

// ── Type badge styling ──────────────────────────────────────────────
const TYPE_CONFIG: Record<
  WatchPartySpot["type"],
  { label: string; className: string }
> = {
  sports_bar: {
    label: "Sports Bar",
    className: "bg-wc-blue/10 text-wc-blue border-wc-blue/30",
  },
  pub: {
    label: "Pub",
    className: "bg-wc-teal/10 text-wc-teal border-wc-teal/30",
  },
  rooftop: {
    label: "Rooftop",
    className: "bg-purple-400/10 text-purple-400 border-purple-400/30",
  },
  fan_zone: {
    label: "Fan Zone",
    className: "bg-wc-gold/10 text-wc-gold border-wc-gold/30",
  },
  restaurant: {
    label: "Restaurant",
    className: "bg-wc-coral/10 text-wc-coral border-wc-coral/30",
  },
};

// ── Props ───────────────────────────────────────────────────────────
interface WatchPartyFinderProps {
  watchSpots: WatchPartySpot[];
}

// ── Main component ──────────────────────────────────────────────────
export function WatchPartyFinder({ watchSpots }: WatchPartyFinderProps) {
  // Derive unique cities preserving insertion order
  const cities = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const spot of watchSpots) {
      if (!seen.has(spot.city)) {
        seen.add(spot.city);
        result.push(spot.city);
      }
    }
    return result;
  }, [watchSpots]);

  const [activeCity, setActiveCity] = useState(cities[0] ?? "");

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-blue/20 text-wc-blue">
          <Tv className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-none">Watch Party Finder</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Best spots to catch the match when you&rsquo;re not at the stadium
          </p>
        </div>
      </div>

      {/* City tabs */}
      <Tabs value={activeCity} onValueChange={setActiveCity}>
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList variant="line" className="w-full justify-start">
            {cities.map((city) => {
              const identity = getCityIdentity(city);
              return (
                <TabsTrigger
                  key={city}
                  value={city}
                  className={cn(
                    "text-xs whitespace-nowrap",
                    activeCity === city && identity.color,
                  )}
                >
                  {city}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {cities.map((city) => {
          const citySpots = watchSpots.filter((s) => s.city === city);
          const identity = getCityIdentity(city);

          return (
            <TabsContent key={city} value={city}>
              <p
                className={cn(
                  "text-xs font-medium mb-3 mt-1",
                  identity.color,
                )}
              >
                {citySpots.length} {citySpots.length === 1 ? "spot" : "spots"} in {city}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {citySpots.map((spot) => (
                  <WatchPartyCard key={`${spot.city}-${spot.name}`} spot={spot} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}

// ── Watch Party Card ────────────────────────────────────────────────
function WatchPartyCard({ spot }: { spot: WatchPartySpot }) {
  const type = TYPE_CONFIG[spot.type];

  return (
    <Card className="py-0 gap-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-2">
        <div className="min-w-0">
          <h4 className="text-sm font-bold leading-tight">{spot.name}</h4>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <MapPin className="size-2.5 shrink-0" />
            {spot.address}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-[10px] uppercase tracking-wide",
            type.className,
          )}
        >
          {type.label}
        </Badge>
      </div>

      {/* Body */}
      <CardContent className="space-y-2.5 pb-3">
        {/* Screens */}
        <div className="flex items-start gap-1.5 text-xs">
          <Tv className="size-3 text-wc-blue shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{spot.screens}</span>
        </div>

        {/* Atmosphere */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {spot.atmosphere}
        </p>

        {/* Food note */}
        <div className="rounded-md bg-muted/30 px-2.5 py-2 text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Food: </span>
          {spot.foodNote}
        </div>

        {/* Reservation tip */}
        <div className="rounded-md bg-wc-gold/5 border border-wc-gold/10 px-2.5 py-2 text-xs leading-relaxed">
          <span className="font-semibold text-wc-gold">Reservations: </span>
          <span className="text-muted-foreground">{spot.reservationTip}</span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="border-t border-border pt-2.5 pb-3">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={spot.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation className="size-3.5" />
            Get Directions
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
