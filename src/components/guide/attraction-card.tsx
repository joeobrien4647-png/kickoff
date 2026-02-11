"use client";

import { Clock, DollarSign, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "@/components/guide/image-carousel";
import type { Attraction } from "@/lib/city-profiles";

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
  attraction: Attraction & { images?: string[] };
  city?: string;
}

export function AttractionCard({ attraction, city }: AttractionCardProps) {
  const categoryColor = CATEGORY_COLORS[attraction.category] ?? "";
  const categoryLabel = CATEGORY_LABELS[attraction.category] ?? attraction.category;
  const hasImages = attraction.images && attraction.images.length > 0;

  return (
    <div className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow ${hasImages ? "overflow-hidden" : "p-4"} flex flex-col gap-0`}>
      {/* Image carousel */}
      {hasImages && (
        <ImageCarousel images={attraction.images!} alt={attraction.name} />
      )}

      <div className={`flex flex-col gap-2.5 ${hasImages ? "p-4" : ""}`}>
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

      {/* Tip + TripAdvisor link */}
      <div className="mt-auto pt-2 border-t border-border flex items-end justify-between gap-2">
        {attraction.tip ? (
          <p className="text-xs">
            <span className="font-medium text-wc-teal">Tip:</span>{" "}
            <span className="text-muted-foreground">{attraction.tip}</span>
          </p>
        ) : <span />}
        {city && (
          <a
            href={tripAdvisorUrl(attraction.name, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            TripAdvisor <ExternalLink className="size-2.5" />
          </a>
        )}
      </div>
      </div>
    </div>
  );
}
