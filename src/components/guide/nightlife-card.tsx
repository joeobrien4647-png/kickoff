"use client";

import { MapPin, ExternalLink, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NightlifeSpot } from "@/lib/city-profiles";

function googleMapsUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + city)}`;
}

function tripAdvisorUrl(name: string, city: string) {
  return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(name + " " + city)}`;
}

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
  city?: string;
}

export function NightlifeCard({ spot, city }: NightlifeCardProps) {
  const typeColor = TYPE_COLORS[spot.type] ?? "";
  const typeLabel = TYPE_LABELS[spot.type] ?? spot.type;

  return (
    <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-0">
      <div className="flex flex-col gap-2.5">
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

      {/* Links */}
      {city && (
        <div className="mt-auto pt-2 border-t border-border flex items-center gap-3">
          <a
            href={googleMapsUrl(spot.name, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Map className="size-2.5" /> Google Maps
          </a>
          <a
            href={tripAdvisorUrl(spot.name, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ExternalLink className="size-2.5" /> TripAdvisor
          </a>
        </div>
      )}
      </div>
    </div>
  );
}
