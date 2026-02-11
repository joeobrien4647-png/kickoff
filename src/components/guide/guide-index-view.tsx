"use client";

import Link from "next/link";
import { MapPin, Utensils, Landmark, Music } from "lucide-react";
import { formatDate } from "@/lib/dates";
import type { CityProfile } from "@/lib/city-profiles";
import type { Stop } from "@/lib/schema";

// Accent colors cycle through the WC palette for card left borders
const ACCENT_COLORS = [
  "border-l-wc-teal",
  "border-l-wc-gold",
  "border-l-wc-coral",
  "border-l-wc-blue",
  "border-l-wc-teal",
  "border-l-wc-gold",
] as const;

// Map city profile name to the stop city value in the database
const PROFILE_TO_STOP_CITY: Record<string, string> = {
  Boston: "Boston",
  "New York": "New York",
  Philadelphia: "Philadelphia",
  "Washington DC": "Washington",
  Atlanta: "Atlanta",
  Miami: "Miami",
};

interface CityEntry {
  slug: string;
  name: string;
  profile: CityProfile;
}

interface GuideIndexViewProps {
  cities: CityEntry[];
  stops: Stop[];
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0] : text;
}

export function GuideIndexView({ cities, stops }: GuideIndexViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cities.map((city, i) => {
        const stopCity = PROFILE_TO_STOP_CITY[city.name];
        const stop = stops.find((s) => s.city === stopCity);
        const { profile } = city;

        return (
          <Link
            key={city.slug}
            href={`/guide/${city.slug}`}
            className={`group bg-card rounded-xl border border-l-4 ${ACCENT_COLORS[i]} shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3`}
          >
            {/* City name + state */}
            <div>
              <h2 className="text-lg font-semibold group-hover:text-wc-teal transition-colors">
                {city.name}
              </h2>
              {stop && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {stop.state}
                  </span>
                </div>
              )}
            </div>

            {/* Overview excerpt */}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {firstSentence(profile.overview)}
            </p>

            {/* Stop dates */}
            {stop && (
              <p className="text-xs font-medium text-foreground/70">
                {formatDate(stop.arriveDate)} &ndash;{" "}
                {formatDate(stop.departDate)}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
              <span className="flex items-center gap-1">
                <Utensils className="size-3" />
                {profile.restaurants.length}
              </span>
              <span className="flex items-center gap-1">
                <Landmark className="size-3" />
                {profile.attractions.length}
              </span>
              <span className="flex items-center gap-1">
                <Music className="size-3" />
                {profile.nightlife.length}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
