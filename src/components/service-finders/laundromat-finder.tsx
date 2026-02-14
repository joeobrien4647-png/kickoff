"use client";

import { useState, useMemo } from "react";
import { Shirt, MapPin, Clock, Navigation, DollarSign } from "lucide-react";
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
import type { Laundromat } from "@/lib/laundromats";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LaundromatFinderProps {
  laundromats: Laundromat[];
  /** Pre-select a city tab (e.g. from the current stop) */
  city?: string;
}

// ---------------------------------------------------------------------------
// Laundromat Card
// ---------------------------------------------------------------------------

function LaundromatCard({ laundromat }: { laundromat: Laundromat }) {
  const identity = getCityIdentity(laundromat.city);

  return (
    <Card className="py-4 gap-3">
      <CardHeader className="pb-0">
        <CardTitle className="text-base leading-snug">
          {laundromat.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <MapPin className={cn("size-3 shrink-0", identity.color)} />
          {laundromat.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Hours & cost */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {laundromat.hours}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="size-3" />
            {laundromat.estimatedCost}
          </span>
        </div>

        {/* Service badges */}
        <div className="flex flex-wrap gap-1.5">
          {laundromat.hasWashDry && (
            <Badge
              variant="secondary"
              className="text-[10px] font-normal px-2 py-0.5 bg-wc-teal/15 text-wc-teal"
            >
              <Shirt className="size-2.5 mr-0.5" />
              Wash & Dry
            </Badge>
          )}
          {laundromat.hasFoldService && (
            <Badge
              variant="secondary"
              className="text-[10px] font-normal px-2 py-0.5 bg-wc-gold/15 text-wc-gold"
            >
              Fold Service
            </Badge>
          )}
        </div>

        {/* Notes */}
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          {laundromat.notes}
        </p>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={laundromat.mapsUrl}
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

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function LaundromatFinder({
  laundromats,
  city,
}: LaundromatFinderProps) {
  // Derive unique cities in order of appearance
  const cities = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const l of laundromats) {
      if (!seen.has(l.city)) {
        seen.add(l.city);
        result.push(l.city);
      }
    }
    return result;
  }, [laundromats]);

  const initialCity = city && cities.includes(city) ? city : "all";
  const [activeTab, setActiveTab] = useState(initialCity);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? laundromats
        : laundromats.filter((l) => l.city === activeTab),
    [laundromats, activeTab],
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

        <TabsContent value={activeTab} className="mt-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shirt className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No laundromats found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((l) => (
                <LaundromatCard
                  key={`${l.city}-${l.name}`}
                  laundromat={l}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
