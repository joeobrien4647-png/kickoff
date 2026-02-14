"use client";

import {
  Building2,
  UtensilsCrossed,
  Beer,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Map,
  Navigation,
  Lightbulb,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VENUE_INFO } from "@/lib/venue-maps";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface VenueInfoCardProps {
  venue: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function VenueInfoCard({ venue }: VenueInfoCardProps) {
  const info = VENUE_INFO[venue];
  if (!info) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(info.address)}`;

  return (
    <Card className="overflow-hidden border-wc-gold/30 bg-gradient-to-br from-wc-gold/5 via-transparent to-transparent">
      {/* Header */}
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="size-5 text-wc-gold shrink-0" />
            <CardTitle className="text-lg leading-tight">{info.name}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-wc-gold/40 text-wc-gold gap-1"
          >
            <Users className="size-3" />
            {info.capacity}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground ml-[30px]">{info.city}</p>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {/* Section guide */}
        <Section
          icon={<Map className="size-4 text-wc-gold" />}
          title="Sections"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {info.sections}
          </p>
        </Section>

        {/* Food & Drink */}
        <Section
          icon={<UtensilsCrossed className="size-4 text-wc-gold" />}
          title="Food Inside"
        >
          <div className="flex flex-wrap gap-1.5">
            {info.foodInside.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="text-xs font-normal"
              >
                {item}
              </Badge>
            ))}
          </div>
        </Section>

        <Section
          icon={<Beer className="size-4 text-wc-gold" />}
          title="Drink Rules"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {info.drinkRules}
          </p>
        </Section>

        {/* Bag policy — alert style */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <div className="flex items-start gap-2">
            <ShoppingBag className="size-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-500 mb-1">
                Bag Policy
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {info.clearBagPolicy}
              </p>
            </div>
          </div>
        </div>

        {/* Gates */}
        <Section
          icon={<Clock className="size-4 text-wc-gold" />}
          title="Gates"
        >
          <p className="text-sm text-muted-foreground">{info.gates}</p>
        </Section>

        {/* Tips */}
        <Section
          icon={<Lightbulb className="size-4 text-wc-gold" />}
          title="Tips"
        >
          <ul className="space-y-1.5">
            {info.tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <AlertTriangle className="size-3 mt-1 shrink-0 text-wc-gold/60" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={info.mapUrl} target="_blank" rel="noopener noreferrer">
              <Map className="size-3.5" />
              View Seating Map
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="size-3.5" />
              Navigate
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section helper
// ---------------------------------------------------------------------------
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h4>
      </div>
      <div className={cn("ml-6")}>{children}</div>
    </div>
  );
}
