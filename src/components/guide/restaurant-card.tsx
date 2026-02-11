"use client";

import { MapPin, ExternalLink, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/guide/vote-button";
import type { Restaurant } from "@/lib/city-profiles";
import type { VenueVote } from "@/lib/schema";

function googleMapsUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + city)}`;
}

function tripAdvisorUrl(name: string, city: string) {
  return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(name + " " + city)}`;
}

// Cuisine colors — subtle backgrounds for visual variety
const CUISINE_COLORS: Record<string, string> = {
  Seafood: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Italian: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  American: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  Mexican: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "Tex-Mex": "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  Japanese: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  Chinese: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Korean: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Southern: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  BBQ: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  Cuban: "bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-300",
  Latin: "bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-300",
  French: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  Pizza: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  Deli: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  Brunch: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  Ethiopian: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const DEFAULT_CUISINE_COLOR =
  "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300";

interface RestaurantCardProps {
  restaurant: Restaurant;
  city?: string;
  votes?: VenueVote[];
  currentUser?: string | null;
  onVoteChange?: (venueName: string, newVotes: VenueVote[]) => void;
}

export function RestaurantCard({ restaurant, city, votes, currentUser, onVoteChange }: RestaurantCardProps) {
  const cuisineColor = CUISINE_COLORS[restaurant.cuisine] ?? DEFAULT_CUISINE_COLOR;

  return (
    <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-0">
      <div className="flex flex-col gap-2.5">
      {/* Header: name + match day indicator */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug">
          {restaurant.name}
        </h3>
        {restaurant.matchDayFriendly && (
          <span className="shrink-0 text-base" title="Match day friendly" aria-label="Match day friendly">
            {"\u26BD"}
          </span>
        )}
      </div>

      {/* Badges row: cuisine + price */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={cuisineColor}>
          {restaurant.cuisine}
        </Badge>
        <span className="text-xs font-medium text-muted-foreground">
          {restaurant.priceRange}
        </span>
      </div>

      {/* Neighborhood */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3" />
        {restaurant.neighborhood}
      </div>

      {/* One-liner */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {restaurant.oneLiner}
      </p>

      {/* Must order */}
      <p className="text-xs">
        <span className="font-medium text-wc-coral">Must order:</span>{" "}
        <span className="text-muted-foreground">{restaurant.mustOrder}</span>
      </p>

      {/* Links + Vote */}
      {city && (
        <div className="mt-auto pt-2 border-t border-border flex items-center gap-3">
          <a
            href={googleMapsUrl(restaurant.name, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Map className="size-2.5" /> Google Maps
          </a>
          <a
            href={tripAdvisorUrl(restaurant.name, city)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ExternalLink className="size-2.5" /> TripAdvisor
          </a>
          {votes && onVoteChange && (
            <div className="ml-auto">
              <VoteButton
                venueName={restaurant.name}
                city={city}
                category="restaurant"
                votes={votes}
                currentUser={currentUser ?? null}
                onVoteChange={onVoteChange}
              />
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
