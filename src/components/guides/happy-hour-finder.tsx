"use client";

import { useState, useMemo } from "react";
import { Beer, MapPin, ExternalLink, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import type { HappyHourSpot } from "@/lib/happy-hours";

// ---------------------------------------------------------------------------
// Type badge config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  HappyHourSpot["type"],
  { label: string; className: string }
> = {
  bar: {
    label: "Bar",
    className: "bg-wc-gold/15 text-wc-gold",
  },
  restaurant: {
    label: "Restaurant",
    className: "bg-emerald-500/15 text-emerald-500",
  },
  rooftop: {
    label: "Rooftop",
    className: "bg-sky-500/15 text-sky-500",
  },
  brewery: {
    label: "Brewery",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  pub: {
    label: "Pub",
    className: "bg-red-500/15 text-red-500",
  },
};

// ---------------------------------------------------------------------------
// Spot Card
// ---------------------------------------------------------------------------

function SpotCard({ spot }: { spot: HappyHourSpot }) {
  const identity = getCityIdentity(spot.city);
  const typeConfig = TYPE_CONFIG[spot.type];

  return (
    <Card className="py-4 gap-3">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            {spot.name}
          </CardTitle>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-normal px-2 py-0.5 shrink-0 border-0",
              typeConfig.className,
            )}
          >
            {typeConfig.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <MapPin className={cn("size-3 shrink-0", identity.color)} />
          {spot.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Hours */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3 shrink-0" />
          <span className="font-medium">{spot.happyHourTimes}</span>
        </div>

        {/* Deals */}
        <ul className="space-y-1">
          {spot.deals.map((deal) => (
            <li
              key={deal}
              className="text-xs text-foreground/80 flex items-baseline gap-1.5"
            >
              <span className="text-wc-gold shrink-0">&#8226;</span>
              {deal}
            </li>
          ))}
        </ul>

        {/* Atmosphere */}
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          {spot.atmosphere}
        </p>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={spot.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="size-3.5" />
            Get Directions
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface HappyHourFinderProps {
  spots: HappyHourSpot[];
  /** Pre-select a city tab (e.g. from the current stop) */
  city?: string;
}

export function HappyHourFinder({ spots, city }: HappyHourFinderProps) {
  // Derive unique cities in order of appearance
  const cities = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of spots) {
      if (!seen.has(s.city)) {
        seen.add(s.city);
        result.push(s.city);
      }
    }
    return result;
  }, [spots]);

  const initialCity = city && cities.includes(city) ? city : "all";
  const [activeTab, setActiveTab] = useState(initialCity);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? spots
        : spots.filter((s) => s.city === activeTab),
    [spots, activeTab],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Beer className="size-5 text-wc-gold" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Happy Hour Finder
        </h2>
      </div>

      {/* City filter tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          variant="line"
          className="w-full overflow-x-auto justify-start scrollbar-none"
        >
          <TabsTrigger value="all">All Cities</TabsTrigger>
          {cities.map((c) => {
            const identity = getCityIdentity(c);
            return (
              <TabsTrigger key={c} value={c} className="shrink-0">
                <span className={cn(identity.color)}>{c}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Beer className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No happy hour spots found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((s) => (
                <SpotCard key={`${s.city}-${s.name}`} spot={s} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
