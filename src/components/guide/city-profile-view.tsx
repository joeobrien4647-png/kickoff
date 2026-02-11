"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Lightbulb,
  Bus,
  Smartphone,
  Clock,
  PartyPopper,
  ShoppingBag,
  ExternalLink,
  Map,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RestaurantCard } from "@/components/guide/restaurant-card";
import { AttractionCard } from "@/components/guide/attraction-card";
import { NightlifeCard } from "@/components/guide/nightlife-card";
import { VoteButton } from "@/components/guide/vote-button";
import { TopPicks } from "@/components/guide/top-picks";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { CityProfile } from "@/lib/city-profiles";
import type { Stop, VenueVote } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the travelerName from the kickoff_session cookie (client-side). */
function getCurrentUser(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("kickoff_session="));
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match.split("=").slice(1).join("="));
    const session = JSON.parse(decoded) as { travelerName?: string };
    return session.travelerName ?? null;
  } catch {
    return null;
  }
}

/** Map profile city name to the stop city value in the DB */
const PROFILE_TO_STOP_CITY: Record<string, string> = {
  Boston: "Boston",
  "New York": "New York",
  Philadelphia: "Philadelphia",
  "Washington DC": "Washington",
  Atlanta: "Atlanta",
  Miami: "Miami",
};

// ---------------------------------------------------------------------------
// Filter chip component
// ---------------------------------------------------------------------------

function FilterChips({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
            selected === opt
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

interface CityProfileViewProps {
  cityName: string;
  state: string;
  profile: CityProfile;
  stops: Stop[];
}

export function CityProfileView({
  cityName,
  state,
  profile,
  stops,
}: CityProfileViewProps) {
  // --------------- Votes & current user ---------------
  const [allVotes, setAllVotes] = useState<VenueVote[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    fetch(`/api/venue-votes?city=${encodeURIComponent(cityName)}`)
      .then((r) => r.json())
      .then((data: VenueVote[]) => setAllVotes(data))
      .catch(() => {}); // silently fail — votes are non-critical
  }, [cityName]);

  /** Get votes for a specific venue */
  const votesFor = useCallback(
    (venueName: string) => allVotes.filter((v) => v.venueName === venueName),
    [allVotes]
  );

  /** Handle optimistic vote update from any card */
  const handleVoteChange = useCallback(
    (venueName: string, newVotes: VenueVote[]) => {
      setAllVotes((prev) => [
        ...prev.filter((v) => v.venueName !== venueName),
        ...newVotes,
      ]);
    },
    []
  );

  // --------------- Filters ---------------
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [attractionFilter, setAttractionFilter] = useState("All");
  const [nightlifeFilter, setNightlifeFilter] = useState("All");

  // Unique filter values
  const cuisines = useMemo(
    () => ["All", ...Array.from(new Set(profile.restaurants.map((r) => r.cuisine)))],
    [profile.restaurants]
  );
  const attractionTypes = useMemo(
    () => ["All", ...Array.from(new Set(profile.attractions.map((a) => a.category)))],
    [profile.attractions]
  );
  const nightlifeTypes = useMemo(
    () => ["All", ...Array.from(new Set(profile.nightlife.map((n) => n.type)))],
    [profile.nightlife]
  );

  // Formatted labels for attraction/nightlife types
  const typeLabel = (t: string) =>
    t === "All"
      ? "All"
      : t
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

  // Filtered data
  const filteredRestaurants = useMemo(
    () =>
      cuisineFilter === "All"
        ? profile.restaurants
        : profile.restaurants.filter((r) => r.cuisine === cuisineFilter),
    [profile.restaurants, cuisineFilter]
  );
  const filteredAttractions = useMemo(
    () =>
      attractionFilter === "All"
        ? profile.attractions
        : profile.attractions.filter((a) => a.category === attractionFilter),
    [profile.attractions, attractionFilter]
  );
  const filteredNightlife = useMemo(
    () =>
      nightlifeFilter === "All"
        ? profile.nightlife
        : profile.nightlife.filter((n) => n.type === nightlifeFilter),
    [profile.nightlife, nightlifeFilter]
  );

  // Stop dates
  const stopCity = PROFILE_TO_STOP_CITY[cityName];
  const stop = stops.find((s) => s.city === stopCity);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/guide"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        All Cities
      </Link>

      {/* Header */}
      <section className="space-y-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">{cityName}</h1>
          <span className="text-sm text-muted-foreground">{state}</span>
        </div>
        {stop && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {formatDate(stop.arriveDate)} &ndash; {formatDate(stop.departDate)}
          </p>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {profile.overview}
        </p>
      </section>

      {/* Top Picks */}
      <TopPicks votes={allVotes} />

      {/* Tabs */}
      <Tabs defaultValue="eat">
        <TabsList variant="line" className="w-full flex-wrap">
          <TabsTrigger value="eat">Eat</TabsTrigger>
          <TabsTrigger value="see">See &amp; Do</TabsTrigger>
          <TabsTrigger value="nightlife">Nightlife</TabsTrigger>
          <TabsTrigger value="shopping">Shopping</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
          <TabsTrigger value="matchday">Match Day</TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════ EAT ═══════════════════════════ */}
        <TabsContent value="eat" className="space-y-4 pt-2">
          <FilterChips
            options={cuisines}
            selected={cuisineFilter}
            onSelect={setCuisineFilter}
          />
          {filteredRestaurants.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No restaurants match that filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRestaurants.map((r) => (
                <RestaurantCard
                  key={r.name}
                  restaurant={r}
                  city={cityName}
                  votes={votesFor(r.name)}
                  currentUser={currentUser}
                  onVoteChange={handleVoteChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════ SEE & DO ═══════════════════════════ */}
        <TabsContent value="see" className="space-y-4 pt-2">
          <FilterChips
            options={attractionTypes.map(typeLabel)}
            selected={typeLabel(attractionFilter)}
            onSelect={(label) => {
              if (label === "All") {
                setAttractionFilter("All");
              } else {
                // Convert label back to category key
                const key = attractionTypes.find((t) => typeLabel(t) === label);
                if (key) setAttractionFilter(key);
              }
            }}
          />
          {filteredAttractions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No attractions match that filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAttractions.map((a) => (
                <AttractionCard
                  key={a.name}
                  attraction={a}
                  city={cityName}
                  votes={votesFor(a.name)}
                  currentUser={currentUser}
                  onVoteChange={handleVoteChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════ NIGHTLIFE ═══════════════════════════ */}
        <TabsContent value="nightlife" className="space-y-4 pt-2">
          <FilterChips
            options={nightlifeTypes.map(typeLabel)}
            selected={typeLabel(nightlifeFilter)}
            onSelect={(label) => {
              if (label === "All") {
                setNightlifeFilter("All");
              } else {
                const key = nightlifeTypes.find((t) => typeLabel(t) === label);
                if (key) setNightlifeFilter(key);
              }
            }}
          />
          {filteredNightlife.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No nightlife spots match that filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNightlife.map((n) => (
                <NightlifeCard
                  key={n.name}
                  spot={n}
                  city={cityName}
                  votes={votesFor(n.name)}
                  currentUser={currentUser}
                  onVoteChange={handleVoteChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════ SHOPPING ═══════════════════════════ */}
        <TabsContent value="shopping" className="space-y-4 pt-2">
          {profile.shopping.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No shopping areas listed yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.shopping.map((area) => (
                <div
                  key={area.name}
                  className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{area.name}</h3>
                    <ShoppingBag className="size-4 text-muted-foreground shrink-0" />
                  </div>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {area.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {area.description}
                  </p>
                  <div className="mt-auto pt-2 border-t border-border flex items-center gap-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(area.name + ", " + cityName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Map className="size-2.5" /> Google Maps
                    </a>
                    <a
                      href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(area.name + " " + cityName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <ExternalLink className="size-2.5" /> TripAdvisor
                    </a>
                    <div className="ml-auto">
                      <VoteButton
                        venueName={area.name}
                        city={cityName}
                        category="shopping"
                        votes={votesFor(area.name)}
                        currentUser={currentUser}
                        onVoteChange={handleVoteChange}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════ TIPS ═══════════════════════════ */}
        <TabsContent value="tips" className="space-y-6 pt-2">
          {/* Local tips */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Local Tips
            </h2>
            <ul className="space-y-2.5">
              {profile.localTips.map((tip, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <Lightbulb className="size-4 text-wc-gold shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Getting around */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Getting Around
            </h2>
            <div className="bg-card rounded-xl border shadow-sm p-5 space-y-4">
              <div className="flex gap-2.5">
                <Bus className="size-4 text-wc-teal shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.gettingAround.summary}
                </p>
              </div>

              {/* Transit apps */}
              <div className="flex items-center gap-2 flex-wrap">
                <Smartphone className="size-3.5 text-muted-foreground" />
                {profile.gettingAround.apps.map((app) => (
                  <Badge key={app} variant="outline" className="text-xs">
                    {app}
                  </Badge>
                ))}
              </div>

              {/* To stadium */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <p className="text-xs font-semibold text-foreground">
                  Getting to the Stadium
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {profile.gettingAround.toStadium}
                </p>
              </div>

              {/* Extra tips */}
              {profile.gettingAround.tips.length > 0 && (
                <ul className="space-y-2 pt-2 border-t border-border">
                  {profile.gettingAround.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="text-wc-teal font-bold shrink-0">&bull;</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </TabsContent>

        {/* ═══════════════════════════ MATCH DAY ═══════════════════════════ */}
        <TabsContent value="matchday" className="space-y-5 pt-2">
          {/* Arrive early */}
          <div className="bg-card rounded-xl border shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-wc-gold" />
              <h3 className="font-semibold text-sm">Arrive Early</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.matchDayGuide.arriveEarlyTip}
            </p>
          </div>

          {/* Near stadium */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Near the Stadium
            </h3>
            <ul className="space-y-2.5">
              {profile.matchDayGuide.nearStadium.map((spot, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <MapPin className="size-4 text-wc-coral shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">
                    {spot}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* After party */}
          <div className="bg-card rounded-xl border shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <PartyPopper className="size-4 text-wc-coral" />
              <h3 className="font-semibold text-sm">After the Match</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.matchDayGuide.afterParty}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
