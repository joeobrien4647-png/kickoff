"use client";

import { Navigation, ExternalLink, Clock, AlertTriangle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { DRIVING_LEGS } from "@/lib/driving-links";

export function DrivingLinksCard() {
  return (
    <div className="space-y-3">
      {DRIVING_LEGS.map((leg) => {
        const fromId = getCityIdentity(leg.from);
        const toId = getCityIdentity(leg.to);
        const timeLabel =
          leg.minutes > 0
            ? `${leg.hours}h ${leg.minutes}m`
            : `${leg.hours}h`;
        const isLong = leg.hours + leg.minutes / 60 > 5;

        return (
          <Card key={`${leg.from}-${leg.to}`} className="gap-0 py-0 overflow-hidden">
            {/* Header gradient strip */}
            <div
              className={cn(
                "h-1",
                isLong ? "bg-wc-coral" : "bg-wc-blue"
              )}
            />

            <CardContent className="p-4 space-y-3">
              {/* Route heading */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <span className={fromId.color}>{leg.from}</span>
                    <span className="text-muted-foreground">&rarr;</span>
                    <span className={toId.color}>{leg.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{leg.miles} mi</span>
                    <span>&middot;</span>
                    <Clock className="size-3" />
                    <span>{timeLabel}</span>
                    {isLong && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-wc-coral/30 text-wc-coral gap-1"
                      >
                        <AlertTriangle className="size-3" />
                        Long drive
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Navigate button */}
                <Button
                  asChild
                  size="sm"
                  className="bg-wc-blue hover:bg-wc-blue/90 text-white gap-1.5 shrink-0"
                >
                  <a
                    href={leg.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="size-3.5" />
                    Navigate
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              </div>

              {/* Toll info */}
              <div className="flex items-start gap-2 text-xs">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-amber-400/30 text-amber-400 shrink-0"
                >
                  Tolls
                </Badge>
                <span className="text-muted-foreground">{leg.tollInfo}</span>
              </div>

              {/* Highlights */}
              {leg.highlights.length > 0 && (
                <div className="space-y-1">
                  {leg.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <MapPin className="size-3 mt-0.5 shrink-0 text-wc-teal" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
