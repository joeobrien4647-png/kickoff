"use client";

import {
  Car,
  ParkingSquare,
  DollarSign,
  MapPin,
  Navigation,
  Lightbulb,
  Smartphone,
  Building2,
  ExternalLink,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { PARKING_GUIDE, type ParkingInfo } from "@/lib/parking-data";

// ── Helpers ────────────────────────────────────────────────────────

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// ── Sub-components ─────────────────────────────────────────────────

function StadiumSection({ info }: { info: ParkingInfo }) {
  const identity = getCityIdentity(info.city);
  const hasStadium = info.stadium.name !== "No WC venue";

  return (
    <Card className="py-3 gap-2">
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className={cn("size-4", identity.color)} />
            <h3 className="text-sm font-semibold">{info.stadium.name}</h3>
          </div>
          {hasStadium && (
            <Badge
              variant="ghost"
              className="text-[10px] px-1.5 py-0 bg-wc-coral/15 text-wc-coral shrink-0"
            >
              <DollarSign className="size-2.5" />
              {info.stadium.cost}
            </Badge>
          )}
        </div>

        {/* Lot description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {info.stadium.lots}
        </p>

        {/* Google Maps link for stadiums with parking */}
        {hasStadium && (
          <a
            href={mapsUrl(`${info.stadium.name} parking`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-wc-blue hover:underline"
          >
            <MapPin className="size-3" />
            View parking on Google Maps
            <ExternalLink className="size-2.5" />
          </a>
        )}

        {/* Tips */}
        {info.stadium.tips.length > 0 && (
          <>
            <Separator />
            <ul className="space-y-1.5">
              {info.stadium.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <Lightbulb className="size-3 shrink-0 text-wc-gold mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Rideshare info */}
        {info.stadium.ridesharePickup && (
          <div className="flex items-start gap-2 rounded-md bg-wc-blue/5 border border-wc-blue/15 px-2.5 py-2 text-xs">
            <Navigation className="size-3.5 shrink-0 text-wc-blue mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-[10px] uppercase tracking-wider mb-0.5">
                Rideshare Pickup
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {info.stadium.ridesharePickup}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CityParkingSection({ info }: { info: ParkingInfo }) {
  return (
    <Card className="py-3 gap-2">
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Car className="size-4 text-wc-teal" />
          <h3 className="text-sm font-semibold">City Parking</h3>
        </div>

        {/* Rates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-lg border p-2.5 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Garage Average
            </p>
            <p className="text-xs font-medium">{info.cityParking.garageAvg}</p>
          </div>
          <div className="rounded-lg border p-2.5 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Street Parking
            </p>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              {info.cityParking.streetParking}
            </p>
          </div>
        </div>

        {/* Free options callout */}
        {info.cityParking.freeOptions && (
          <div className="flex items-start gap-2 rounded-md bg-emerald-500/5 border border-emerald-500/15 px-2.5 py-2 text-xs">
            <DollarSign className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider mb-0.5">
                Free Options
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {info.cityParking.freeOptions}
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Tips */}
        <ul className="space-y-1.5">
          {info.cityParking.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs">
              <Lightbulb className="size-3 shrink-0 text-wc-gold mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">
                {tip}
              </span>
            </li>
          ))}
        </ul>

        {/* Hotel parking note */}
        <div className="flex items-start gap-2 rounded-md bg-wc-gold/5 border border-wc-gold/15 px-2.5 py-2 text-xs">
          <Smartphone className="size-3.5 shrink-0 text-wc-gold mt-0.5" />
          <div>
            <p className="font-semibold text-foreground text-[10px] uppercase tracking-wider mb-0.5">
              Hotel Parking
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {info.accommodation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CityContent({ info }: { info: ParkingInfo }) {
  return (
    <div className="space-y-3 pt-1">
      <StadiumSection info={info} />
      <CityParkingSection info={info} />
    </div>
  );
}

// ── Tab config ─────────────────────────────────────────────────────

const CITY_TABS = PARKING_GUIDE.map((info) => ({
  value: info.city.toLowerCase().replace(/\s+/g, "-"),
  label: info.city,
  info,
}));

// ── Main Component ─────────────────────────────────────────────────

export function ParkingGuideView() {
  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-coral/20 text-wc-coral">
          <ParkingSquare className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Parking Guide</h2>
          <p className="text-xs text-muted-foreground">
            Stadium lots, city parking &amp; rideshare info
          </p>
        </div>
      </div>

      {/* City tabs */}
      <Tabs defaultValue={CITY_TABS[0].value}>
        <TabsList variant="line" className="w-full flex-wrap">
          {CITY_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CITY_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <CityContent info={tab.info} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
