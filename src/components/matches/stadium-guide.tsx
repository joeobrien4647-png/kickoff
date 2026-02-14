"use client";

import { useState } from "react";
import {
  MapPin,
  ShieldAlert,
  Utensils,
  Beer,
  Check,
  X,
  Clock,
  Lightbulb,
  Car,
  Train,
  Navigation,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import type { StadiumGuide as StadiumGuideType } from "@/lib/stadium-guides";

// ── Transport method icons ──────────────────────────────────────────
const TRANSPORT_ICON: Record<string, typeof Car> = {
  "Uber/Lyft": Car,
  "Commuter Rail": Train,
  "Drive + Park": Car,
  "Shuttle bus": Car,
  Shuttle: Car,
  "NJ Transit bus": Car,
  "NJ Transit train": Train,
  "Subway (SEPTA)": Train,
};

// ── Props ───────────────────────────────────────────────────────────
interface StadiumGuideProps {
  guides: StadiumGuideType[];
}

// ── Main component ──────────────────────────────────────────────────
export function StadiumGuide({ guides }: StadiumGuideProps) {
  const [activeStadium, setActiveStadium] = useState(guides[0]?.city ?? "");

  if (guides.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-gold/20 text-wc-gold">
          <MapPin className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-none">Stadium Pocket Guide</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Everything you need on match day, at a glance
          </p>
        </div>
      </div>

      {/* Stadium tabs */}
      <Tabs value={activeStadium} onValueChange={setActiveStadium}>
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList variant="line" className="w-full justify-start">
            {guides.map((guide) => {
              const identity = getCityIdentity(guide.city);
              return (
                <TabsTrigger
                  key={guide.city}
                  value={guide.city}
                  className={cn(
                    "text-xs whitespace-nowrap",
                    activeStadium === guide.city && identity.color,
                  )}
                >
                  {guide.city}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {guides.map((guide) => (
          <TabsContent key={guide.city} value={guide.city}>
            <StadiumDetail guide={guide} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

// ── Single stadium detail ───────────────────────────────────────────
function StadiumDetail({ guide }: { guide: StadiumGuideType }) {
  const identity = getCityIdentity(guide.city);

  return (
    <div className="space-y-4 mt-1">
      {/* ── Header card: name, address, capacity, gates ── */}
      <Card className="py-3 gap-2">
        <CardContent className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight">
                {guide.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className={cn("size-3 shrink-0", identity.color)} />
                {guide.address}
              </p>
            </div>
            <Button variant="outline" size="xs" asChild className="shrink-0">
              <a
                href={guide.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="size-3" />
                Map
              </a>
            </Button>
          </div>

          {/* Quick badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              {guide.capacity} capacity
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 border-wc-teal/30 text-wc-teal"
            >
              <Clock className="size-2.5 mr-0.5" />
              Gates: {guide.gatesOpen}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ── Bag policy (amber warning) ── */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3.5 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-amber-500 shrink-0" />
          <span className="text-sm font-semibold text-amber-500">
            Bag Policy
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {guide.bagPolicy}
        </p>
      </div>

      {/* ── Allowed / Prohibited items ── */}
      <div className="grid grid-cols-2 gap-3">
        <ItemList
          title="Allowed"
          items={guide.allowedItems}
          icon={<Check className="size-3 text-emerald-400 shrink-0 mt-0.5" />}
          borderClass="border-emerald-500/20"
        />
        <ItemList
          title="Prohibited"
          items={guide.prohibitedItems}
          icon={<X className="size-3 text-red-400 shrink-0 mt-0.5" />}
          borderClass="border-red-500/20"
        />
      </div>

      {/* ── Food & Drink ── */}
      <Card className="py-3 gap-2">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Utensils className="size-3.5 text-wc-coral" />
            Food Inside
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {guide.foodInside.map((food) => (
              <div
                key={food.name}
                className="flex items-start justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-medium">{food.name}</span>
                  <span className="text-muted-foreground ml-1.5">
                    {food.note}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-wc-gold tabular-nums">
                  {food.price}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="py-3 gap-2">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Beer className="size-3.5 text-wc-gold" />
            Drink Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {guide.drinkPrices.map((drink) => (
              <div
                key={drink.item}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="text-muted-foreground">{drink.item}</span>
                <span className="font-mono text-wc-gold tabular-nums">
                  {drink.price}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Getting There ── */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-1.5">
          <Car className="size-3.5 text-wc-blue" />
          Getting There
        </h4>
        <div className="grid gap-2">
          {guide.gettingThere.map((option) => {
            const Icon = TRANSPORT_ICON[option.method] ?? Car;
            return (
              <TransportCard key={option.method} option={option} icon={Icon} />
            );
          })}
        </div>
      </div>

      {/* ── Tips ── */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-1.5">
          <Lightbulb className="size-3.5 text-wc-gold" />
          Match Day Tips
        </h4>
        <ol className="space-y-1.5 pl-1">
          {guide.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span className="shrink-0 flex items-center justify-center size-4 rounded-full bg-wc-gold/10 text-wc-gold text-[10px] font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground leading-relaxed">
                {tip}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ── Allowed/Prohibited items list ───────────────────────────────────
function ItemList({
  title,
  items,
  icon,
  borderClass,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  borderClass: string;
}) {
  return (
    <div className={cn("rounded-lg border p-2.5 space-y-1.5", borderClass)}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Transport option card ───────────────────────────────────────────
function TransportCard({
  option,
  icon: Icon,
}: {
  option: StadiumGuideType["gettingThere"][number];
  icon: typeof Car;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Icon className="size-3 text-wc-blue" />
          {option.method}
        </span>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 font-mono tabular-nums"
        >
          {option.cost}
        </Badge>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {option.details}
      </p>
    </div>
  );
}
