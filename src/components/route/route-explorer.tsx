"use client";

import { useState } from "react";
import { Car, Plane, Clock, DollarSign, Check, X, Train } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RouteMapWrapper } from "@/components/map/route-map-wrapper";
import type { RouteScenario } from "@/lib/route-scenarios";

const CITY_COLORS: Record<string, string> = {
  Boston: "#2dd4bf",
  "New York": "#3b82f6",
  Philadelphia: "#f87171",
  "Washington DC": "#f59e0b",
  Charlotte: "#a78bfa",
  Atlanta: "#c084fc",
  Miami: "#34d399",
  Nashville: "#f472b6",
  Charleston: "#fb923c",
  Savannah: "#a3e635",
  Orlando: "#38bdf8",
};

interface RouteExplorerProps {
  scenarios: RouteScenario[];
}

export function RouteExplorer({ scenarios }: RouteExplorerProps) {
  const [selected, setSelected] = useState<RouteScenario>(scenarios[0]);

  return (
    <div className="space-y-4">
      {/* ---- Interactive Map ---- */}
      <Card className="overflow-hidden p-0">
        <RouteMapWrapper scenario={selected} cityColors={CITY_COLORS} />
      </Card>

      {/* ---- Scenario Selector ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {scenarios.map((scenario) => {
          const isSelected = scenario.id === selected.id;

          return (
            <Card
              key={scenario.id}
              className={cn(
                "cursor-pointer transition-all py-3",
                isSelected
                  ? "ring-2 ring-wc-blue bg-wc-blue/5"
                  : "hover:bg-accent/50"
              )}
              onClick={() => setSelected(scenario)}
            >
              <CardContent className="space-y-2">
                {/* Name + Tagline */}
                <div>
                  <p className="text-sm font-bold">{scenario.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {scenario.tagline}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Car className="size-3" />
                    {scenario.totalMiles.toLocaleString()} mi
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {scenario.totalDriveHours}h
                    {scenario.totalDriveMinutes > 0
                      ? ` ${scenario.totalDriveMinutes}m`
                      : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Plane className="size-3" />
                    {scenario.flightCount} flights
                  </span>
                  {(scenario.totalTrainHours ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Train className="size-3" />
                      {scenario.totalTrainHours}h{(scenario.totalTrainMinutes ?? 0) > 0 ? ` ${scenario.totalTrainMinutes}m` : ""} train
                    </span>
                  )}
                </div>

                {/* Flight Cost Badge */}
                {scenario.flightCount > 0 && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <DollarSign className="size-3" />~$
                    {scenario.estimatedFlightCostPP}/pp
                  </Badge>
                )}

                {/* Train Cost Badge */}
                {(scenario.estimatedTrainCostPP ?? 0) > 0 && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Train className="size-3" />~${scenario.estimatedTrainCostPP}/pp train
                  </Badge>
                )}

                {/* Pros */}
                <ul className="space-y-0.5">
                  {scenario.pros.map((pro) => (
                    <li
                      key={pro}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <Check className="size-3 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>

                {/* Cons */}
                <ul className="space-y-0.5">
                  {scenario.cons.map((con) => (
                    <li
                      key={con}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <X className="size-3 shrink-0 text-red-400 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ---- Cost Comparison ---- */}
      <Card className="py-4">
        <CardContent className="space-y-3">
          <h3 className="text-sm font-bold">Cost Comparison <span className="text-xs font-normal text-muted-foreground">(3 travelers)</span></h3>
          <div className="space-y-2">
            {scenarios.map((s) => {
              const flightTotal = s.estimatedFlightCostPP * 3;
              const gasCost = Math.round(s.totalMiles * 0.15);
              const trainTotal = (s.estimatedTrainCostPP ?? 0) * 3;
              const totalCost = flightTotal + gasCost + trainTotal;
              const isActive = s.id === selected.id;

              return (
                <div key={s.id} className={cn("flex items-center gap-3 p-2 rounded-md text-xs", isActive && "bg-wc-blue/10")}>
                  <span className={cn("font-medium w-40 truncate", isActive && "text-wc-blue")}>{s.name}</span>
                  <div className="flex items-center gap-3 text-muted-foreground ml-auto">
                    {gasCost > 0 && <span>Gas: ${gasCost}</span>}
                    {trainTotal > 0 && <span>Train: ${trainTotal}</span>}
                    {flightTotal > 0 && <span>Flights: ${flightTotal}</span>}
                    <span className={cn("font-bold tabular-nums", isActive ? "text-wc-gold" : "text-foreground")}>
                      ~${totalCost}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground">Estimates based on $0.15/mi gas, Amtrak Northeast Corridor fares, one-way flight averages. Excludes tolls and parking.</p>
        </CardContent>
      </Card>
    </div>
  );
}
