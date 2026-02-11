"use client";

import { Clock, DollarSign, ExternalLink, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Attraction } from "@/lib/city-profiles";

function googleMapsUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + city)}`;
}

function tripAdvisorUrl(name: string, city: string) {
  return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(name + " " + city)}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  landmark: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  museum: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  park: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  market: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  viewpoint: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  activity: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
};

const CATEGORY_LABELS: Record<string, string> = {
  landmark: "Landmark",
  museum: "Museum",
  park: "Park",
  market: "Market",
  viewpoint: "Viewpoint",
  activity: "Activity",
};

interface AttractionCardProps {
  attraction: Attraction;
  city?: string;
}

export function AttractionCard({ attraction, city }: AttractionCardProps) {
  const categoryColor = CATEGORY_COLORS[attraction.category] ?? "";
  const categoryLabel = CATEGORY_LABELS[attraction.category] ?? attraction.category;

  return (
    <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-0">
      <div className="flex flex-col gap-2.5">
      {/* Name */}
      <h3 className="font-semibold text-sm leading-snug">
        {attraction.name}
      </h3>

      {/* Badge + meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={categoryColor}>
          {categoryLabel}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {attraction.duration}
        </span>
        {attraction.cost !== "free" ? (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <DollarSign className="size-3" />
            {attraction.cost}
          </span>
        ) : (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Free
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {attraction.description}
      </p>

      {/* Tip */}
      {attraction.tip && (
        <p className="text-xs">
          <span className="font-medium text-wc-teal">Tip:</span>{" "}
          <span className="text-muted-foreground">{attraction.tip}</span>
        </p>
      )}

      {/* Links */}
      {city && (
        <div className="mt-auto pt-2 border-t border-border flex items-center gap-3">
          <a
            href={googleMapsUrl(attraction.name, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Map className="size-2.5" /> Google Maps
          </a>
          <a
            href={tripAdvisorUrl(attraction.name, city)}
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
