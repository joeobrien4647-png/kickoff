"use client";

import { useState, useMemo } from "react";
import { MapPin, Clock, Users, Navigation } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import type { FanZone } from "@/lib/fan-zones";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FanZoneFinderProps {
  fanZones: FanZone[];
  /** Pre-select a city tab (e.g. from the current stop) */
  city?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FanZoneFinder({ fanZones, city }: FanZoneFinderProps) {
  // Derive unique cities in order of appearance
  const cities = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const zone of fanZones) {
      if (!seen.has(zone.city)) {
        seen.add(zone.city);
        result.push(zone.city);
      }
    }
    return result;
  }, [fanZones]);

  const initialCity = city && cities.includes(city) ? city : "all";
  const [activeTab, setActiveTab] = useState(initialCity);

  const filteredZones = useMemo(
    () =>
      activeTab === "all"
        ? fanZones
        : fanZones.filter((z) => z.city === activeTab),
    [fanZones, activeTab]
  );

  return (
    <div className="space-y-4">
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

        {/* Single content area — filtering is done via state, not per-tab content */}
        <TabsContent value={activeTab} className="mt-4">
          {filteredZones.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No fan zones found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredZones.map((zone) => (
                <FanZoneCard key={`${zone.city}-${zone.name}`} zone={zone} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fan Zone Card
// ---------------------------------------------------------------------------

function FanZoneCard({ zone }: { zone: FanZone }) {
  const identity = getCityIdentity(zone.city);

  return (
    <Card className="py-4 gap-3">
      <CardHeader className="pb-0">
        <CardTitle className="text-base leading-snug">{zone.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <MapPin className={cn("size-3 shrink-0", identity.color)} />
          {zone.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {zone.description}
        </p>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {zone.capacity}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {zone.hours}
          </span>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5">
          {zone.features.map((feature) => (
            <Badge
              key={feature}
              variant="secondary"
              className="text-[10px] font-normal px-2 py-0.5"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={zone.mapsUrl}
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
