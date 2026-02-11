"use client";

import { MapPin, Car, Plane, Clock, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { StopCard } from "@/components/route/stop-card";
import { DriveSegment } from "@/components/route/drive-segment";
import type { RouteStop, DriveInfo } from "@/app/route/page";

interface RouteOverviewProps {
  routeStops: RouteStop[];
  totalMiles: number;
  totalHours: number;
  totalMinutes: number;
  stopCount: number;
  tripDays: number;
}

function parseDrive(raw: string | null): DriveInfo | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DriveInfo;
  } catch {
    return null;
  }
}

const ROUTE_ALTERNATIVES = [
  {
    label: "DC to Atlanta",
    detail:
      "9.5 hours driving. Consider internal flight (~$100-150pp, 2hrs).",
  },
  {
    label: "Atlanta to Miami",
    detail:
      "10 hours driving. Consider internal flight (~$80-120pp, 2hrs).",
  },
  {
    label: "Alternative",
    detail:
      "Skip Atlanta, fly DC to Miami directly (~$120-180pp).",
  },
];

export function RouteOverview({
  routeStops,
  totalMiles,
  totalHours,
  totalMinutes,
  stopCount,
  tripDays,
}: RouteOverviewProps) {
  return (
    <div className="space-y-8">
      {/* ---- Summary Header ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          icon={<Navigation className="size-4 text-wc-blue" />}
          value={`${totalMiles.toLocaleString()}`}
          unit="miles"
        />
        <SummaryCard
          icon={<Clock className="size-4 text-wc-coral" />}
          value={`${totalHours}h ${totalMinutes}m`}
          unit="driving"
        />
        <SummaryCard
          icon={<MapPin className="size-4 text-wc-teal" />}
          value={`${stopCount}`}
          unit="stops"
        />
        <SummaryCard
          icon={<Car className="size-4 text-wc-gold" />}
          value={`${tripDays}`}
          unit="days"
        />
      </div>

      {/* ---- Route Timeline ---- */}
      <section className="relative">
        {/* ARRIVE marker */}
        <div className="flex items-center gap-3 pb-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-blue/20 text-wc-blue">
            <Plane className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase text-wc-blue">
            Arrive
          </span>
        </div>

        {/* Stops + Drive segments */}
        {routeStops.map((rs, index) => {
          const drive = parseDrive(rs.stop.driveFromPrev);
          const isLast = index === routeStops.length - 1;
          const prev = index > 0 ? routeStops[index - 1] : null;

          return (
            <div key={rs.stop.id}>
              {/* Drive segment from previous stop (skip first stop) */}
              {drive && <DriveSegment drive={drive} />}

              {/* Stop card with connecting line */}
              <div className="relative pl-11">
                {/* Vertical connector line */}
                {!isLast && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-px border-l-2 border-dashed border-muted" />
                )}

                {/* Pin icon — tinted with city identity color */}
                {(() => {
                  const identity = getCityIdentity(rs.stop.city);
                  return (
                    <div className={cn("absolute left-0 top-0 flex size-8 shrink-0 items-center justify-center rounded-full border border-border", identity.bg)}>
                      <MapPin className={cn("size-4", identity.color)} />
                    </div>
                  );
                })()}

                <StopCard
                  routeStop={rs}
                  prevCity={prev?.stop.city}
                  prevDepartDate={prev?.stop.departDate}
                />
              </div>
            </div>
          );
        })}

        {/* DEPART marker */}
        <div className="flex items-center gap-3 pt-4 pl-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-coral/20 text-wc-coral">
            <Plane className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase text-wc-coral">
            Depart
          </span>
        </div>
      </section>

      {/* ---- Alternative Routes ---- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Route Considerations</h2>
        <div className="space-y-2">
          {ROUTE_ALTERNATIVES.map((alt) => (
            <Card key={alt.label} className="py-3">
              <CardContent className="flex items-start gap-3">
                <Car className="size-4 text-wc-coral shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{alt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {alt.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Small stat card for the summary row */
function SummaryCard({
  icon,
  value,
  unit,
}: {
  icon: React.ReactNode;
  value: string;
  unit: string;
}) {
  return (
    <Card className="py-4">
      <CardContent className="flex flex-col items-center gap-1 text-center">
        {icon}
        <p className="text-xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </CardContent>
    </Card>
  );
}
