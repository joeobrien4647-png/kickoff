"use client";

import { useState, useMemo } from "react";
import {
  Fuel,
  UtensilsCrossed,
  MapPin,
  ExternalLink,
  Clock,
  AlertTriangle,
  Bath,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { REST_STOPS, LEG_INFO, type RestStop } from "@/lib/rest-stops";

// ── Style maps ───────────────────────────────────────────────────────

const STOP_TYPE_STYLE: Record<RestStop["type"], string> = {
  service_plaza: "bg-wc-teal/15 text-wc-teal",
  rest_area: "bg-wc-blue/15 text-wc-blue",
  town_stop: "bg-wc-gold/15 text-wc-gold",
};

const STOP_TYPE_LABEL: Record<RestStop["type"], string> = {
  service_plaza: "Service Plaza",
  rest_area: "Rest Area",
  town_stop: "Town Stop",
};

const LEG_TABS = LEG_INFO.map((l) => l.leg);

// Short labels for tab triggers so they fit on mobile
const LEG_SHORT_LABEL: Record<string, string> = {
  "Boston \u2192 NYC": "BOS\u2192NYC",
  "NYC \u2192 Philly": "NYC\u2192PHL",
  "Philly \u2192 DC": "PHL\u2192DC",
  "DC \u2192 Nashville": "DC\u2192NSH",
  "Nashville \u2192 Miami": "NSH\u2192MIA",
};

// ── Main Component ───────────────────────────────────────────────────

export function RestStopPlanner() {
  const [activeLeg, setActiveLeg] = useState(LEG_TABS[0]);

  const stopsForLeg = useMemo(
    () => REST_STOPS.filter((s) => s.leg === activeLeg),
    [activeLeg],
  );

  const legInfo = LEG_INFO.find((l) => l.leg === activeLeg);

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="size-5 text-wc-teal" />
          Rest Stop Planner
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Safety reminder */}
        <div className="flex items-start gap-2 rounded-md border border-wc-coral/30 bg-wc-coral/5 px-3 py-2.5 text-xs">
          <AlertTriangle className="size-4 shrink-0 text-wc-coral mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-wc-coral">
              Break every 2 hours &mdash; stay alert, stay alive!
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Long-distance driving is tiring. Plan stops every 100-150 miles or
              every 2 hours. Swap drivers if possible.
            </p>
          </div>
        </div>

        {/* Leg tabs */}
        <Tabs value={activeLeg} onValueChange={setActiveLeg}>
          <TabsList className="w-full">
            {LEG_TABS.map((leg) => (
              <TabsTrigger key={leg} value={leg} className="text-[11px] px-1.5">
                {LEG_SHORT_LABEL[leg] ?? leg}
              </TabsTrigger>
            ))}
          </TabsList>

          {LEG_TABS.map((leg) => (
            <TabsContent key={leg} value={leg}>
              {/* Leg summary */}
              {legInfo && activeLeg === leg && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs gap-1"
                  >
                    <MapPin className="size-3" />
                    {legInfo.totalMiles} miles
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs gap-1"
                  >
                    <Clock className="size-3" />
                    {legInfo.estimatedDrive}
                  </Badge>
                </div>
              )}

              {/* Timeline */}
              <div className="relative space-y-0">
                {stopsForLeg.length > 0 && activeLeg === leg && (
                  <>
                    {/* Vertical line connecting the dots */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

                    {stopsForLeg.map((stop, i) => (
                      <StopTimelineItem
                        key={`${stop.name}-${i}`}
                        stop={stop}
                        isLast={i === stopsForLeg.length - 1}
                      />
                    ))}
                  </>
                )}

                {stopsForLeg.length === 0 && activeLeg === leg && (
                  <div className="py-8 text-center">
                    <MapPin className="mx-auto size-5 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No rest stops listed for this leg.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ── Timeline Stop Card ──────────────────────────────────────────────

function StopTimelineItem({
  stop,
  isLast,
}: {
  stop: RestStop;
  isLast: boolean;
}) {
  return (
    <div className={cn("relative flex gap-3 pl-0", !isLast && "pb-4")}>
      {/* Timeline dot */}
      <div className="relative z-10 mt-2.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-border bg-card">
        <div
          className={cn(
            "size-2.5 rounded-full",
            stop.type === "service_plaza" && "bg-wc-teal",
            stop.type === "rest_area" && "bg-wc-blue",
            stop.type === "town_stop" && "bg-wc-gold",
          )}
        />
      </div>

      {/* Stop card */}
      <Card className="flex-1 py-3 gap-2">
        <CardContent className="space-y-2">
          {/* Row 1: Name + type badge */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-bold leading-tight">{stop.name}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="ghost"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    STOP_TYPE_STYLE[stop.type],
                  )}
                >
                  {STOP_TYPE_LABEL[stop.type]}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {stop.location}
                </span>
              </div>
            </div>

            {/* Distance + time badges */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 tabular-nums">
                {stop.milesFromStart} mi
              </Badge>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {stop.estimatedTime}
              </span>
            </div>
          </div>

          {/* Amenity icons row */}
          <div className="flex items-center gap-3">
            <AmenityIcon
              icon={Fuel}
              label="Gas"
              available={stop.hasGas}
            />
            <AmenityIcon
              icon={UtensilsCrossed}
              label="Food"
              available={stop.hasFood}
            />
            <AmenityIcon
              icon={Bath}
              label="Restrooms"
              available={stop.hasRestrooms}
            />
          </div>

          {/* Food options */}
          {stop.foodOptions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {stop.foodOptions.map((food) => (
                <Badge
                  key={food}
                  variant="ghost"
                  className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground"
                >
                  {food}
                </Badge>
              ))}
            </div>
          )}

          {/* Notes */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {stop.notes}
          </p>

          {/* Directions link */}
          <a
            href={stop.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-wc-teal hover:text-wc-teal p-0 h-auto"
            >
              <ExternalLink className="size-3" />
              Get Directions
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Amenity Icon ────────────────────────────────────────────────────

function AmenityIcon({
  icon: Icon,
  label,
  available,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  available: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-[10px]",
        available
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-muted-foreground/40 line-through",
      )}
    >
      <Icon className="size-3" />
      <span>{label}</span>
    </div>
  );
}
