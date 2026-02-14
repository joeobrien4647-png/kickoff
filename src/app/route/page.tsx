import { db } from "@/lib/db";
import { stops, accommodations, matches, ideas, decisions as decisionsTable, travelers } from "@/lib/schema";
import { asc, sql } from "drizzle-orm";
import { RouteOverview } from "@/components/route/route-overview";
import { RouteExplorer } from "@/components/route/route-explorer";
import { RouteMap } from "@/components/route/route-map";
import { KeyDecisions } from "@/components/route/key-decisions";
import { RouteComparison } from "@/components/route/route-comparison";
import { ROUTE_SCENARIOS } from "@/lib/route-scenarios";
import { ScenicDetours } from "@/components/route/scenic-detours";
import { SCENIC_DETOURS } from "@/lib/scenic-detours";
import { HighwayGuide } from "@/components/route/highway-guide";
import { HIGHWAY_EATS, ROADSIDE_ATTRACTIONS } from "@/lib/highway-eats";
import { LegDetails } from "@/components/route/leg-details";
import { LEG_DETAILS } from "@/lib/route-details";
import { DeparturePlanner } from "@/components/route/departure-planner";
import { AccommodationPicks } from "@/components/route/accommodation-picks";
import { ACCOMMODATION_PICKS } from "@/lib/accommodation-picks";
import { RoadTripPlaylists } from "@/components/route/road-trip-playlists";
import { LEG_PLAYLISTS } from "@/lib/road-trip-playlists";
import { CultureGuide } from "@/components/route/culture-guide";
import { FuelEstimator } from "@/components/fuel-estimator";
import { ParkingGuideView } from "@/components/parking-guide";
import { DrivingLinksCard } from "@/components/route/driving-links-card";
import { Navigation } from "lucide-react";
import { getSession } from "@/lib/auth";
import type { Stop, Accommodation, Match } from "@/lib/schema";

/** Drive info stored as JSON in the driveFromPrev column */
export type DriveInfo = {
  miles: number;
  hours: number;
  minutes: number;
};

/** Everything we need for one stop on the route */
export type RouteStop = {
  stop: Stop;
  accommodation: Accommodation | null;
  matches: Match[];
  ideaCount: number;
};

function parseDrive(raw: string | null): DriveInfo | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DriveInfo;
  } catch {
    return null;
  }
}

const CITY_SLUG: Record<string, string> = {
  Boston: "boston",
  "New York": "nyc",
  Philadelphia: "philadelphia",
  "Washington DC": "washington-dc",
  Nashville: "nashville",
  Miami: "miami",
};

export default async function RoutePage() {
  const allStops = db
    .select()
    .from(stops)
    .orderBy(asc(stops.sortOrder))
    .all();

  const allAccommodations = db.select().from(accommodations).all();
  const allMatches = db.select().from(matches).all();

  // Count ideas per stop in one query
  const ideaCounts = db
    .select({
      stopId: ideas.stopId,
      count: sql<number>`count(*)`,
    })
    .from(ideas)
    .groupBy(ideas.stopId)
    .all();

  const allDecisions = db.select().from(decisionsTable).orderBy(asc(decisionsTable.sortOrder)).all();
  const allTravelers = db.select().from(travelers).all();
  const session = await getSession();

  const ideaCountMap = new Map(ideaCounts.map((r) => [r.stopId, r.count]));
  const accByStop = new Map(allAccommodations.map((a) => [a.stopId, a]));

  const routeStops: RouteStop[] = allStops.map((stop) => ({
    stop,
    accommodation: accByStop.get(stop.id) ?? null,
    matches: allMatches.filter((m) => m.stopId === stop.id),
    ideaCount: ideaCountMap.get(stop.id) ?? 0,
  }));

  // Compute totals from driveFromPrev JSON
  let totalMiles = 0;
  let totalMinutes = 0;

  for (const stop of allStops) {
    const drive = parseDrive(stop.driveFromPrev);
    if (drive) {
      totalMiles += drive.miles;
      totalMinutes += drive.hours * 60 + drive.minutes;
    }
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainderMinutes = totalMinutes % 60;

  // Trip duration: first arrive to last depart
  const tripStart = allStops[0]?.arriveDate ?? "";
  const tripEnd = allStops[allStops.length - 1]?.departDate ?? "";
  const tripDays =
    tripStart && tripEnd
      ? Math.round(
          (new Date(tripEnd + "T12:00:00").getTime() -
            new Date(tripStart + "T12:00:00").getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Route Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Boston to Miami &mdash; explore route options and plan your journey.
        </p>
      </section>

      <RouteExplorer scenarios={ROUTE_SCENARIOS} currentUser={session?.travelerName ?? ""} />

      <RouteComparison scenarios={ROUTE_SCENARIOS} />

      <KeyDecisions
        decisions={allDecisions}
        travelers={allTravelers}
        currentUser={session?.travelerName ?? ""}
      />

      <RouteMap
        stops={allStops.map((stop) => ({
          city: stop.city,
          state: stop.state,
          slug: CITY_SLUG[stop.city] ?? stop.city.toLowerCase(),
          arriveDate: stop.arriveDate,
          departDate: stop.departDate,
          matchCount: allMatches.filter((m) => m.stopId === stop.id).length,
          drive: parseDrive(stop.driveFromPrev) ?? undefined,
        }))}
      />

      <DeparturePlanner />

      <AccommodationPicks picks={ACCOMMODATION_PICKS} />

      <FuelEstimator />

      <ParkingGuideView />

      <ScenicDetours detours={SCENIC_DETOURS} />

      <HighwayGuide eats={HIGHWAY_EATS} attractions={ROADSIDE_ATTRACTIONS} />

      <RoadTripPlaylists playlists={LEG_PLAYLISTS} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Navigation className="size-5 text-wc-blue" />
          Leg by Leg
        </h2>
        <p className="text-sm text-muted-foreground">
          Pit stops, highway info, and timing for every drive.
        </p>
        <LegDetails legs={LEG_DETAILS} />
      </section>

      <DrivingLinksCard />

      <CultureGuide />

      <RouteOverview
        routeStops={routeStops}
        totalMiles={totalMiles}
        totalHours={totalHours}
        totalMinutes={remainderMinutes}
        stopCount={allStops.length}
        tripDays={tripDays}
      />
    </div>
  );
}
