import Link from "next/link";
import { MapPin, Navigation, Trophy, ExternalLink, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dates";
import { getCityIdentity } from "@/lib/constants";

// ============ TYPES ============

export interface RouteMapStop {
  city: string;
  state: string;
  slug: string;
  arriveDate: string;
  departDate: string;
  matchCount: number;
  drive?: { miles: number; hours: number; minutes: number };
}

interface RouteMapProps {
  stops: RouteMapStop[];
}

// ============ CONSTANTS ============

/** Inline hex colors for SVG elements — these map to the city identity system */
const CITY_HEX: Record<string, string> = {
  Boston: "#2dd4bf",       // teal
  "New York": "#3b82f6",   // blue
  Philadelphia: "#f87171",  // coral
  "Washington DC": "#f59e0b", // gold
  Atlanta: "#c084fc",       // purple
  Miami: "#34d399",         // emerald
};

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/dir/Boston+MA/New+York+NY/Philadelphia+PA/Washington+DC/Atlanta+GA/Miami+FL";

// ============ SUB-COMPONENTS ============

function DriveLabel({ drive }: { drive: { miles: number; hours: number; minutes: number } }) {
  const timeLabel =
    drive.minutes > 0
      ? `${drive.hours}h ${drive.minutes}m`
      : `${drive.hours}h`;

  return (
    <span className="text-[11px] text-muted-foreground tabular-nums">
      {drive.miles} mi &middot; {timeLabel}
    </span>
  );
}

function MatchBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-wc-gold">
      <Trophy className="size-3" />
      {count} {count === 1 ? "match" : "matches"}
    </span>
  );
}

// ============ MAIN COMPONENT ============

export function RouteMap({ stops }: RouteMapProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Navigation className="size-4 text-wc-blue" />
          <h2 className="text-base font-bold">Journey Map</h2>
          <span className="text-xs text-muted-foreground ml-auto">
            {stops.length} stops
          </span>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {stops.map((stop, index) => {
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;
            const identity = getCityIdentity(stop.city);
            const hex = CITY_HEX[stop.city] ?? "#64748b";

            return (
              <div key={stop.city} className="relative">
                {/* ---- Drive segment between stops ---- */}
                {stop.drive && (
                  <div className="relative flex items-center pl-[19px] py-1">
                    {/* Connecting line behind the drive info */}
                    <div
                      className="absolute left-[11px] top-0 bottom-0 w-px"
                      style={{ backgroundColor: `${hex}30` }}
                    />

                    {/* Drive info pill */}
                    <div className="ml-6 flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
                      <Car className="size-3 text-muted-foreground" />
                      <DriveLabel drive={stop.drive} />
                    </div>
                  </div>
                )}

                {/* ---- Stop node ---- */}
                <div className="relative flex items-start gap-4 pl-[19px] py-2">
                  {/* Connector line going down (skip for last stop) */}
                  {!isLast && (
                    <div
                      className="absolute left-[11px] top-6 bottom-0 w-px"
                      style={{ backgroundColor: `${hex}30` }}
                    />
                  )}

                  {/* Connector line coming from above (for non-first, non-drive stops) */}
                  {!isFirst && !stop.drive && (
                    <div
                      className="absolute left-[11px] top-0 h-6 w-px"
                      style={{ backgroundColor: `${hex}30` }}
                    />
                  )}

                  {/* City dot */}
                  <div className="relative z-10 flex-shrink-0 -ml-[19px]">
                    <div
                      className="flex size-6 items-center justify-center rounded-full border-2"
                      style={{
                        borderColor: hex,
                        backgroundColor: `${hex}18`,
                      }}
                    >
                      <MapPin className="size-3" style={{ color: hex }} />
                    </div>
                  </div>

                  {/* Stop details */}
                  <div className="flex-1 min-w-0 -mt-0.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <Link
                        href={`/guide/${stop.slug}`}
                        className={cn(
                          "text-sm font-bold hover:underline decoration-1 underline-offset-2",
                          identity.color
                        )}
                      >
                        {stop.city}, {stop.state}
                      </Link>
                      <MatchBadge count={stop.matchCount} />
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDate(stop.arriveDate)} &ndash;{" "}
                      {formatDate(stop.departDate)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Google Maps button */}
        <div className="mt-6 pt-4 border-t border-border">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3.5 py-2",
              "text-sm font-medium",
              "bg-wc-blue/10 text-wc-blue hover:bg-wc-blue/20",
              "transition-colors"
            )}
          >
            <ExternalLink className="size-3.5" />
            View full route on Google Maps
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
