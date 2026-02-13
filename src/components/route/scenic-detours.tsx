"use client";

import { useState } from "react";
import {
  Mountain,
  Clock,
  Car,
  DollarSign,
  Star,
  Moon,
  Compass,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScenicDetour } from "@/lib/scenic-detours";

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", className: "border-emerald-500/40 text-emerald-400" },
  moderate: { label: "Moderate", className: "border-amber-500/40 text-amber-400" },
  ambitious: { label: "Ambitious", className: "border-red-500/40 text-red-400" },
} as const;

interface ScenicDetoursProps {
  detours: ScenicDetour[];
}

function DetourCard({ detour }: { detour: ScenicDetour }) {
  const [expanded, setExpanded] = useState(false);
  const diff = DIFFICULTY_CONFIG[detour.difficulty];

  return (
    <Card className="py-4 transition-all hover:bg-accent/30">
      <CardContent className="space-y-3">
        {/* Header: Name + tagline */}
        <div>
          <div className="flex items-start gap-2">
            <Mountain className="size-4 text-wc-teal shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold leading-tight">{detour.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 italic">
                {detour.tagline}
              </p>
            </div>
            {detour.overnightNeeded && (
              <span title="Overnight needed">
                <Moon className="size-3.5 text-purple-400 shrink-0" />
              </span>
            )}
          </div>
        </div>

        {/* Badges row: leg, miles, hours, difficulty */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] gap-1">
            <MapPin className="size-2.5" />
            {detour.nearestLeg}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] gap-1 border-amber-500/30 text-amber-400"
          >
            <Car className="size-2.5" />
            +{detour.detourMiles}mi
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] gap-1 border-amber-500/30 text-amber-400"
          >
            <Clock className="size-2.5" />
            +{detour.detourHours}h
          </Badge>
          <Badge variant="outline" className={cn("text-[10px]", diff.className)}>
            {diff.label}
          </Badge>
        </div>

        {/* Description (truncated unless expanded) */}
        <p
          className={cn(
            "text-xs text-muted-foreground leading-relaxed",
            !expanded && "line-clamp-2"
          )}
        >
          {detour.description}
        </p>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-wc-teal hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3" />
              Less
            </>
          ) : (
            <>
              <ChevronDown className="size-3" />
              More details
            </>
          )}
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
            {/* Highlights */}
            <div className="flex flex-wrap gap-1.5">
              {detour.highlights.map((h) => (
                <Badge
                  key={h}
                  variant="secondary"
                  className="text-[10px] font-normal"
                >
                  {h}
                </Badge>
              ))}
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="size-3 text-wc-gold shrink-0" />
                <span>{detour.bestFor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-3 text-wc-gold shrink-0" />
                <span>{detour.estimatedCost}/pp</span>
              </div>
            </div>

            {/* Season note */}
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
              {detour.season}
            </p>

            {/* Detour from */}
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">Detour from:</span>{" "}
              {detour.detourFromCity}
            </p>

            {/* Overnight indicator */}
            {detour.overnightNeeded && (
              <div className="flex items-center gap-1.5 text-[11px] text-purple-400">
                <Moon className="size-3" />
                Overnight stay recommended
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ScenicDetours({ detours }: ScenicDetoursProps) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Compass className="size-4 text-wc-teal" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Scenic Detours & Side Trips
        </h2>
        <Badge variant="secondary" className="text-[10px] ml-auto">
          {detours.length} options
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground -mt-2">
        Optional stops to break up the long drives. None are on the main route
        &mdash; pick the ones that call to you.
      </p>

      {/* Detour cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {detours.map((detour) => (
          <DetourCard key={detour.id} detour={detour} />
        ))}
      </div>
    </div>
  );
}
