"use client";

import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NightlifeSpot } from "@/lib/city-profiles";

const TYPE_COLORS: Record<string, string> = {
  bar: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  club: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  live_music: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  rooftop: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  dive: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  sports_bar: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  brewery: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
};

const TYPE_LABELS: Record<string, string> = {
  bar: "Bar",
  club: "Club",
  live_music: "Live Music",
  rooftop: "Rooftop",
  dive: "Dive",
  sports_bar: "Sports Bar",
  brewery: "Brewery",
};

interface NightlifeCardProps {
  spot: NightlifeSpot;
}

export function NightlifeCard({ spot }: NightlifeCardProps) {
  const typeColor = TYPE_COLORS[spot.type] ?? "";
  const typeLabel = TYPE_LABELS[spot.type] ?? spot.type;

  return (
    <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-2.5">
      {/* Name + price */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug">{spot.name}</h3>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {spot.priceRange}
        </span>
      </div>

      {/* Type badge + neighborhood */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={typeColor}>
          {typeLabel}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          {spot.neighborhood}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {spot.oneLiner}
      </p>
    </div>
  );
}
