"use client";

import { useState, useMemo } from "react";
import {
  Pill,
  ShoppingCart,
  MapPin,
  Clock,
  Navigation,
  Store,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import type { EssentialStore } from "@/lib/essential-stores";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORE_TYPE_CONFIG = {
  pharmacy: {
    icon: Pill,
    label: "Pharmacy",
    badgeBg: "bg-wc-coral/15",
    badgeText: "text-wc-coral",
  },
  supermarket: {
    icon: ShoppingCart,
    label: "Supermarket",
    badgeBg: "bg-wc-teal/15",
    badgeText: "text-wc-teal",
  },
  convenience: {
    icon: Store,
    label: "Convenience",
    badgeBg: "bg-wc-gold/15",
    badgeText: "text-wc-gold",
  },
} as const;

type StoreType = keyof typeof STORE_TYPE_CONFIG;

const ALL_TYPES: StoreType[] = ["pharmacy", "supermarket", "convenience"];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EssentialStoresFinderProps {
  stores: EssentialStore[];
  /** Pre-select a city tab (e.g. from the current stop) */
  city?: string;
}

// ---------------------------------------------------------------------------
// Store Card
// ---------------------------------------------------------------------------

function StoreCard({ store }: { store: EssentialStore }) {
  const identity = getCityIdentity(store.city);
  const config = STORE_TYPE_CONFIG[store.type];
  const Icon = config.icon;

  return (
    <Card className="py-4 gap-3">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base leading-snug flex items-center gap-2">
            <Icon className={cn("size-4 shrink-0", config.badgeText)} />
            {store.name}
          </CardTitle>
          <Badge
            variant="ghost"
            className={cn(
              "text-[10px] px-1.5 py-0 shrink-0",
              config.badgeBg,
              config.badgeText,
            )}
          >
            {config.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <MapPin className={cn("size-3 shrink-0", identity.color)} />
          {store.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Hours */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {store.hours}
        </div>

        {/* Notes */}
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          {store.notes}
        </p>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={store.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation className="size-3.5" />
            Get Directions
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Type Filter Toggle
// ---------------------------------------------------------------------------

function TypeFilter({
  activeType,
  onTypeChange,
}: {
  activeType: StoreType | "all";
  onTypeChange: (type: StoreType | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button
        variant={activeType === "all" ? "default" : "outline"}
        size="xs"
        onClick={() => onTypeChange("all")}
      >
        All
      </Button>
      {ALL_TYPES.map((type) => {
        const config = STORE_TYPE_CONFIG[type];
        const Icon = config.icon;
        const isActive = activeType === type;
        return (
          <Button
            key={type}
            variant={isActive ? "default" : "outline"}
            size="xs"
            onClick={() => onTypeChange(type)}
          >
            <Icon className="size-3" />
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function EssentialStoresFinder({
  stores,
  city,
}: EssentialStoresFinderProps) {
  // Derive unique cities in order of appearance
  const cities = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of stores) {
      if (!seen.has(s.city)) {
        seen.add(s.city);
        result.push(s.city);
      }
    }
    return result;
  }, [stores]);

  const initialCity = city && cities.includes(city) ? city : "all";
  const [activeTab, setActiveTab] = useState(initialCity);
  const [activeType, setActiveType] = useState<StoreType | "all">("all");

  const filtered = useMemo(
    () =>
      stores.filter((s) => {
        const cityMatch = activeTab === "all" || s.city === activeTab;
        const typeMatch = activeType === "all" || s.type === activeType;
        return cityMatch && typeMatch;
      }),
    [stores, activeTab, activeType],
  );

  return (
    <div className="space-y-4">
      {/* City filter tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          variant="line"
          className="w-full overflow-x-auto justify-start scrollbar-none"
        >
          <TabsTrigger value="all">All Cities</TabsTrigger>
          {cities.map((c) => {
            const identity = getCityIdentity(c);
            return (
              <TabsTrigger key={c} value={c} className="shrink-0">
                <span className={cn(identity.color)}>{c}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {/* Type filter toggle */}
          <TypeFilter activeType={activeType} onTypeChange={setActiveType} />

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No stores found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((s) => (
                <StoreCard
                  key={`${s.city}-${s.name}-${s.type}`}
                  store={s}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
