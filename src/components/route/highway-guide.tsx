"use client";

import { useState, useMemo } from "react";
import { Utensils, MapPin, Clock, DollarSign, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { HighwayEat, RoadsideAttraction } from "@/lib/highway-eats";

// ── Type badge color mapping ───────────────────────────────────────

const EAT_TYPE_STYLE: Record<HighwayEat["type"], string> = {
  diner: "bg-wc-gold/15 text-wc-gold",
  bbq: "bg-wc-coral/15 text-wc-coral",
  fast_food: "bg-wc-blue/15 text-wc-blue",
  deli: "bg-wc-teal/15 text-wc-teal",
  bakery: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  drive_thru: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  roadside: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  chain: "bg-wc-blue/15 text-wc-blue",
};

const EAT_TYPE_LABEL: Record<HighwayEat["type"], string> = {
  diner: "Diner",
  bbq: "BBQ",
  fast_food: "Fast Food",
  deli: "Deli",
  bakery: "Bakery",
  drive_thru: "Drive-Thru",
  roadside: "Roadside",
  chain: "Chain",
};

const ATTRACTION_TYPE_STYLE: Record<RoadsideAttraction["type"], string> = {
  quirky: "bg-wc-coral/15 text-wc-coral",
  historic: "bg-wc-gold/15 text-wc-gold",
  natural: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  roadside_art: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  experience: "bg-wc-blue/15 text-wc-blue",
};

const ATTRACTION_TYPE_LABEL: Record<RoadsideAttraction["type"], string> = {
  quirky: "Quirky",
  historic: "Historic",
  natural: "Natural",
  roadside_art: "Roadside Art",
  experience: "Experience",
};

const PRICE_ICON_COUNT: Record<string, number> = {
  $: 1,
  $$: 2,
  free: 0,
};

// ── Component ──────────────────────────────────────────────────────

interface HighwayGuideProps {
  eats: HighwayEat[];
  attractions: RoadsideAttraction[];
}

/** Extract unique legs from both data sets in route order */
const LEG_ORDER = [
  "Boston \u2192 NYC",
  "NYC \u2192 Philly",
  "Philly \u2192 DC",
  "DC \u2192 Nashville",
  "Nashville \u2192 Miami",
];

export function HighwayGuide({ eats, attractions }: HighwayGuideProps) {
  const [selectedLeg, setSelectedLeg] = useState("all");

  const filteredEats = useMemo(
    () =>
      selectedLeg === "all"
        ? eats
        : eats.filter((e) => e.leg === selectedLeg),
    [eats, selectedLeg],
  );

  const filteredAttractions = useMemo(
    () =>
      selectedLeg === "all"
        ? attractions
        : attractions.filter((a) => a.leg === selectedLeg),
    [attractions, selectedLeg],
  );

  return (
    <section className="space-y-4">
      {/* ---- Section Header ---- */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-coral/20 text-wc-coral">
            <Utensils className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Road Trip Guide</h2>
            <p className="text-xs text-muted-foreground">
              Where to eat &amp; what to see between cities
            </p>
          </div>
        </div>

        {/* ---- Leg Filter ---- */}
        <Select value={selectedLeg} onValueChange={setSelectedLeg}>
          <SelectTrigger size="sm" className="w-auto text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Legs</SelectItem>
            {LEG_ORDER.map((leg) => (
              <SelectItem key={leg} value={leg}>
                {leg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ---- Tabs ---- */}
      <Tabs defaultValue="eats">
        <TabsList className="w-full">
          <TabsTrigger value="eats" className="gap-1.5">
            <Utensils className="size-3.5" />
            Highway Eats
          </TabsTrigger>
          <TabsTrigger value="attractions" className="gap-1.5">
            <MapPin className="size-3.5" />
            Roadside Finds
          </TabsTrigger>
        </TabsList>

        {/* ── Eats Tab ── */}
        <TabsContent value="eats">
          {filteredEats.length === 0 ? (
            <EmptyState message="No food stops on this leg yet." />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredEats.map((eat, i) => (
                <EatCard key={`${eat.name}-${i}`} eat={eat} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Attractions Tab ── */}
        <TabsContent value="attractions">
          {filteredAttractions.length === 0 ? (
            <EmptyState message="No roadside finds on this leg yet." />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredAttractions.map((attraction, i) => (
                <AttractionCard
                  key={`${attraction.name}-${i}`}
                  attraction={attraction}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function EatCard({ eat }: { eat: HighwayEat }) {
  return (
    <Card className="py-3 gap-2">
      <CardContent className="space-y-2">
        {/* Row 1: Name + badges */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-bold leading-tight">{eat.name}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="ghost"
                className={cn("text-[10px] px-1.5 py-0", EAT_TYPE_STYLE[eat.type])}
              >
                {EAT_TYPE_LABEL[eat.type]}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {eat.highway}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {eat.nearCity}
              </span>
            </div>
          </div>
          <PriceBadge price={eat.priceRange} />
        </div>

        {/* One-liner */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {eat.oneLiner}
        </p>

        {/* Must order */}
        <div className="flex items-start gap-1.5 text-xs">
          <span className="font-semibold text-wc-gold shrink-0">Order:</span>
          <span className="text-muted-foreground">{eat.mustOrder}</span>
        </div>

        {/* British note */}
        {eat.britishNote && (
          <div className="flex items-start gap-2 rounded-md bg-wc-blue/5 px-2.5 py-2 text-xs">
            <Info className="size-3.5 shrink-0 text-wc-blue mt-0.5" />
            <span className="text-muted-foreground leading-relaxed">
              {eat.britishNote}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AttractionCard({ attraction }: { attraction: RoadsideAttraction }) {
  return (
    <Card className="py-3 gap-2">
      <CardContent className="space-y-2">
        {/* Row 1: Name + badges */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-bold leading-tight">
              {attraction.name}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="ghost"
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  ATTRACTION_TYPE_STYLE[attraction.type],
                )}
              >
                {ATTRACTION_TYPE_LABEL[attraction.type]}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {attraction.highway}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {attraction.nearCity}
              </span>
            </div>
          </div>
          <CostBadge cost={attraction.cost} />
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {attraction.description}
        </p>

        {/* Time + Why stop */}
        <div className="flex items-start gap-1.5 text-xs">
          <Clock className="size-3 shrink-0 text-wc-teal mt-0.5" />
          <span className="text-muted-foreground">{attraction.timeNeeded}</span>
        </div>

        {/* Why stop callout */}
        <div className="flex items-start gap-2 rounded-md bg-wc-coral/5 px-2.5 py-2 text-xs">
          <MapPin className="size-3.5 shrink-0 text-wc-coral mt-0.5" />
          <span className="text-muted-foreground leading-relaxed">
            {attraction.whyStop}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceBadge({ price }: { price: "$" | "$$" }) {
  const count = PRICE_ICON_COUNT[price] ?? 1;
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {Array.from({ length: count }).map((_, i) => (
        <DollarSign
          key={i}
          className="size-3 text-wc-gold"
        />
      ))}
      {Array.from({ length: 2 - count }).map((_, i) => (
        <DollarSign
          key={`dim-${i}`}
          className="size-3 text-muted-foreground/30"
        />
      ))}
    </div>
  );
}

function CostBadge({ cost }: { cost: "free" | "$" | "$$" }) {
  if (cost === "free") {
    return (
      <Badge variant="ghost" className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        Free
      </Badge>
    );
  }
  return <PriceBadge price={cost} />;
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="py-8">
      <CardContent className="flex flex-col items-center gap-2 text-center">
        <MapPin className="size-5 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
