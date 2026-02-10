"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { CITY_GUIDES } from "@/lib/city-guides";
import {
  ChevronDown,
  ChevronUp,
  Thermometer,
  MapPin,
  UtensilsCrossed,
  Car,
  Phone,
  Sparkles,
  Sun,
  CloudRain,
} from "lucide-react";

interface CityGuideCardProps {
  city: string;
}

export function CityGuideCard({ city }: CityGuideCardProps) {
  const [expanded, setExpanded] = useState(false);
  const guide = CITY_GUIDES[city];
  if (!guide) return null;

  const identity = getCityIdentity(city);
  const WeatherIcon = guide.weather.rainChance >= 40 ? CloudRain : Sun;

  return (
    <Card
      className={cn(
        "border-l-4 overflow-hidden py-0",
        identity.border,
        `bg-gradient-to-r ${identity.gradient}`
      )}
    >
      <CardContent className="px-4 py-0">
        {/* Collapsed: one-line summary */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between py-4 text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <h3 className={cn("text-sm font-semibold uppercase tracking-wide", identity.color)}>
              City Guide
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <WeatherIcon className="size-3.5" />
              <span>High {guide.weather.highF}°F</span>
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
              {guide.weather.rainChance}% rain
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {guide.restaurants.length} picks
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          )}
        </button>

        {/* Expanded: full guide */}
        {expanded && (
          <div className="space-y-5 pb-5">
            {/* Weather */}
            <section className="space-y-1">
              <div className="flex items-center gap-2">
                <Thermometer className={cn("size-4", identity.color)} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Weather
                </h4>
              </div>
              <div className="ml-6 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">
                  {guide.weather.highF}°F / {guide.weather.lowF}°F
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  {guide.weather.rainChance}% rain
                </Badge>
                <span className="text-muted-foreground">
                  {guide.weather.description}
                </span>
              </div>
            </section>

            {/* Fan Zone */}
            <section className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className={cn("size-4", identity.color)} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Fan Zone
                </h4>
              </div>
              <div className="ml-6 text-sm">
                {guide.fanZone ? (
                  <>
                    <p className="font-medium">{guide.fanZone.name}</p>
                    <p className="text-muted-foreground text-xs">{guide.fanZone.address}</p>
                    <p className="text-muted-foreground mt-0.5">{guide.fanZone.notes}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">No official fan zone</p>
                )}
              </div>
            </section>

            {/* Top Picks */}
            <section className="space-y-1">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className={cn("size-4", identity.color)} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Top Picks
                </h4>
              </div>
              <div className="ml-6 space-y-2">
                {guide.restaurants.map((r) => (
                  <div key={r.name} className="flex items-start gap-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-muted-foreground text-xs">{r.type}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                          {r.priceRange}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">{r.oneLiner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Getting Around */}
            <section className="space-y-1">
              <div className="flex items-center gap-2">
                <Car className={cn("size-4", identity.color)} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Getting Around
                </h4>
              </div>
              <ul className="ml-6 space-y-1">
                {guide.transport.map((tip) => (
                  <li key={tip} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Emergency */}
            <section className="space-y-1">
              <div className="flex items-center gap-2">
                <Phone className={cn("size-4", identity.color)} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Emergency
                </h4>
              </div>
              <div className="ml-6 text-sm">
                <p className="font-medium">{guide.emergency.hospital}</p>
                <p className="text-muted-foreground text-xs">{guide.emergency.hospitalAddress}</p>
              </div>
            </section>

            {/* Fun Fact */}
            <section className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className={cn("size-4", identity.color)} />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Fun Fact
                </h4>
              </div>
              <p className="ml-6 text-sm italic text-muted-foreground">
                {guide.funFact}
              </p>
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
