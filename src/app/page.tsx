import Link from "next/link";
import { Trophy, Route, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { daysUntilTrip, dayOfTrip, formatDate } from "@/lib/dates";
import { db } from "@/lib/db";
import {
  matches,
  stops,
  packingItems,
  logistics,
  travelers,
  expenses,
  ideas,
  decisions,
  photos,
  transports,
} from "@/lib/schema";
import { asc, sql } from "drizzle-orm";
import { getCityIdentity, ROUTE_STOPS } from "@/lib/constants";
import { MatchCard } from "@/components/match-card";
import { MilestonesCard } from "@/components/milestones-card";
import { WeatherWidget } from "@/components/weather-widget";
import { ActivityFeed } from "@/components/activity-feed";
import { WhosPaying } from "@/components/whos-paying";
import { TripStats } from "@/components/trip-stats";
import { TrumpHologram } from "@/components/trump-hologram";
import { HeroCountdown } from "@/components/hero-countdown";
import { TripCountdown } from "@/components/trip-countdown";
import { CurrencyConverter } from "@/components/currency-converter";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { TripShareCard } from "@/components/trip-share-card";
import { PreTripTimeline } from "@/components/pre-trip-timeline";
import { Achievements } from "@/components/achievements";
import { RunningBalance } from "@/components/running-balance";
import { TripReadiness } from "@/components/trip-readiness";

// ---------------------------------------------------------------------------
// SVG progress ring (36x36, radius 15.9, strokeWidth 3)
// ---------------------------------------------------------------------------
const RING_R = 15.9;
const RING_C = 2 * Math.PI * RING_R; // ~99.9

function ProgressRing({
  pct,
  colorClass,
}: {
  pct: number;
  colorClass: string;
}) {
  const offset = RING_C * (1 - pct / 100);
  return (
    <svg viewBox="0 0 36 36" className="size-9 shrink-0" aria-hidden>
      {/* background track */}
      <circle
        cx="18"
        cy="18"
        r={RING_R}
        fill="none"
        className="stroke-muted"
        strokeWidth={3}
      />
      {/* filled arc */}
      <circle
        cx="18"
        cy="18"
        r={RING_R}
        fill="none"
        className={colorClass}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
      />
      {/* centered percentage */}
      <text
        x="18"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-[9px] font-semibold"
      >
        {pct}%
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Journey node for the horizontal route line
// ---------------------------------------------------------------------------
function JourneyNode({
  city,
  isActive,
  isFirst,
  isLast,
}: {
  city: string;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const identity = getCityIdentity(city);
  return (
    <div
      className="flex flex-col items-center gap-1.5"
      style={{
        // first and last nodes sit at the edges; others are centered
        alignItems: isFirst ? "flex-start" : isLast ? "flex-end" : "center",
      }}
    >
      <div
        className={`size-3 rounded-full border-2 ${
          isActive
            ? `${identity.bg} ${identity.border}`
            : "bg-muted border-border"
        }`}
      />
      <span
        className={`text-[10px] leading-none ${
          isActive ? identity.color : "text-muted-foreground"
        }`}
      >
        {city}
      </span>
    </div>
  );
}

// ===========================================================================
// Page
// ===========================================================================
export default function HomePage() {
  const remaining = daysUntilTrip();
  const currentDay = dayOfTrip();
  const isDuringTrip = currentDay !== null;

  // Pull real data
  const allMatches = db.select().from(matches).all();
  const allStops = db
    .select()
    .from(stops)
    .orderBy(asc(stops.sortOrder))
    .all();
  const packingStats = db
    .select({
      total: sql<number>`count(*)`,
      packed: sql<number>`sum(case when checked = 1 then 1 else 0 end)`,
    })
    .from(packingItems)
    .get()!;
  const logisticsStats = db
    .select({
      total: sql<number>`count(*)`,
      done: sql<number>`sum(case when status = 'done' then 1 else 0 end)`,
    })
    .from(logistics)
    .get()!;

  // Travelers for the "Who's Paying?" spinner
  const allTravelers = db.select().from(travelers).all();

  // Expense total for trip stats
  const expenseTotal = db
    .select({ total: sql<number>`coalesce(sum(amount), 0)` })
    .from(expenses)
    .get()!;

  // Ideas count for trip stats
  const ideasCount = db
    .select({ total: sql<number>`count(*)` })
    .from(ideas)
    .get()!;

  // Achievement stats
  const expenseCount = db
    .select({ total: sql<number>`count(*)` })
    .from(expenses)
    .get()!;
  const photosCount = db
    .select({ total: sql<number>`count(*)` })
    .from(photos)
    .get()!;
  const flightsCount = db
    .select({ total: sql<number>`count(*)` })
    .from(transports)
    .get()!;

  // Next match (closest future match)
  const today = new Date().toISOString().slice(0, 10);
  const upcomingMatches = allMatches
    .filter((m) => m.matchDate >= today)
    .sort((a, b) => a.matchDate.localeCompare(b.matchDate));
  const nextMatch = upcomingMatches[0] ?? null;

  // Route summary
  let totalMiles = 0;
  for (const stop of allStops) {
    if (stop.driveFromPrev) {
      try {
        const drive = JSON.parse(stop.driveFromPrev) as {
          miles: number;
          hours: number;
          minutes: number;
        };
        totalMiles += drive.miles;
      } catch {}
    }
  }

  const attendingCount = allMatches.filter((m) => m.attending).length;
  const purchasedCount = allMatches.filter(
    (m) => m.ticketStatus === "purchased"
  ).length;
  const packingPct =
    packingStats.total > 0
      ? Math.round(((packingStats.packed ?? 0) / packingStats.total) * 100)
      : 0;
  const logisticsPct =
    logisticsStats.total > 0
      ? Math.round(
          ((logisticsStats.done ?? 0) / logisticsStats.total) * 100
        )
      : 0;

  // Determine which stops are "reached" during the trip (for the journey line)
  // During the trip, a stop is active if today >= its arrival date
  const currentStopIndex = isDuringTrip
    ? allStops.findIndex((s) => today < s.arriveDate) - 1
    : -1; // before trip: nothing active

  // Next upcoming stop for weather widget:
  // During trip — current stop; before trip — first stop
  const nextStop = isDuringTrip
    ? allStops[Math.max(0, currentStopIndex)]
    : allStops[0];

  // Look up lat/lng from constants (stops table may have nulls)
  const weatherCoords = nextStop
    ? ROUTE_STOPS.find((rs) => rs.name === nextStop.city) ?? null
    : null;

  return (
    <div className="mx-auto max-w-5xl pb-8">
      {/* ── Hero / Countdown ─────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center pt-8 md:pt-12">
        <HeroCountdown />
        <p className="text-sm text-muted-foreground/70 mt-1">
          {attendingCount} matches &middot; {allStops.length} cities &middot;{" "}
          {Math.round(totalMiles)} miles
        </p>

        <h2 className="text-2xl md:text-3xl font-semibold mt-6">
          World Cup 2026
        </h2>
        <p className="text-muted-foreground mt-1">Boston to Miami</p>
        <p className="text-sm text-muted-foreground/80 mt-0.5">
          Jun 11 &ndash; Jun 26
        </p>
      </section>

      {/* ── Two-column layout: main + sidebar ─────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* ── Main column ───────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* ── Quick stats grid ──────────────────────────────────────── */}
          <section className="grid grid-cols-2 gap-3">
            {/* Matches */}
            <Link href="/matches">
              <Card className="py-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2.5 text-wc-teal">
                    <Trophy className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Matches</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {allMatches.length} tracked
                      {purchasedCount > 0 && ` · ${purchasedCount} tickets`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Route */}
            <Link href="/route">
              <Card className="py-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2.5 text-wc-blue">
                    <Route className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Route</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {allStops.length} stops · {Math.round(totalMiles)} mi
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Checklist — with progress ring */}
            <Link href="/checklist">
              <Card className="py-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3">
                  <ProgressRing pct={logisticsPct} colorClass="stroke-wc-coral" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Checklist</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {logisticsStats.done ?? 0}/{logisticsStats.total} done
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Packing — with progress ring */}
            <Link href="/packing">
              <Card className="py-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3">
                  <ProgressRing pct={packingPct} colorClass="stroke-wc-gold" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Packing</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {packingStats.packed ?? 0}/{packingStats.total} packed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>

          {/* ── Milestones ────────────────────────────────────────────── */}
          <MilestonesCard />

          {/* ── Next Match ─────────────────────────────────────────────── */}
          {nextMatch && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Next Match
                </h3>
                <Link
                  href="/matches"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                >
                  All matches <ChevronRight className="size-3" />
                </Link>
              </div>
              <MatchCard match={nextMatch} />
            </section>
          )}

          {/* ── Journey progress line ──────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                The Route
              </h3>
              <Link
                href="/route"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                Full breakdown <ChevronRight className="size-3" />
              </Link>
            </div>
            <Card className="py-4">
              <CardContent>
                <div className="relative px-1.5">
                  {/* Horizontal track */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 h-0.5 bg-border" />

                  {/* City nodes */}
                  <div className="relative flex justify-between">
                    {allStops.map((stop, i) => (
                      <JourneyNode
                        key={stop.id}
                        city={stop.city}
                        isActive={isDuringTrip && i <= currentStopIndex}
                        isFirst={i === 0}
                        isLast={i === allStops.length - 1}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  {Math.round(totalMiles)} miles &middot;{" "}
                  {allStops[0]?.arriveDate && formatDate(allStops[0].arriveDate)}{" "}
                  &ndash;{" "}
                  {allStops[allStops.length - 1]?.departDate &&
                    formatDate(allStops[allStops.length - 1].departDate)}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* ── Pre-Trip Countdown Checklist ────────────────────────── */}
          <PreTripTimeline tripStartDate="2026-06-11" />
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className="space-y-6">
          {/* Trip countdown */}
          <TripCountdown />

          {/* Trip readiness */}
          <TripReadiness />

          {/* Weather widget for next stop */}
          {nextStop && weatherCoords && (
            <WeatherWidget
              city={nextStop.city}
              lat={weatherCoords.lat}
              lng={weatherCoords.lng}
            />
          )}

          {/* Currency converter */}
          <CurrencyConverter />

          {/* Running balance */}
          <RunningBalance />

          {/* Activity feed */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Recent Activity
            </h3>
            <Card className="py-4">
              <CardContent>
                <ActivityFeed limit={15} />
              </CardContent>
            </Card>
          </section>

          {/* Trump Hologram */}
          <TrumpHologram />

          {/* WhatsApp group link */}
          <WhatsAppLink />

          {/* Share trip card */}
          <TripShareCard
            stops={allStops.map((s) => ({
              city: s.city,
              arriveDate: s.arriveDate,
              departDate: s.departDate,
            }))}
            matches={allMatches.map((m) => ({
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              matchDate: m.matchDate,
              venue: m.venue,
              city: m.city,
              attending: m.attending ? 1 : 0,
            }))}
            travelers={allTravelers.map((t) => ({
              name: t.name,
              emoji: t.emoji,
            }))}
            totalMiles={totalMiles}
            totalSpent={expenseTotal.total}
            perPersonSpent={
              allTravelers.length > 0
                ? expenseTotal.total / allTravelers.length
                : 0
            }
            packingProgress={`${packingStats.packed ?? 0}/${packingStats.total}`}
            checklistProgress={`${logisticsStats.done ?? 0}/${logisticsStats.total}`}
            ticketsPurchased={purchasedCount}
          />

          {/* Who's Paying? spinner */}
          {allTravelers.length > 1 && (
            <WhosPaying
              travelers={allTravelers.map((t) => ({
                name: t.name,
                emoji: t.emoji,
                color: t.color,
              }))}
            />
          )}

          {/* Trip Stats */}
          <TripStats
            totalMiles={totalMiles}
            totalStops={allStops.length}
            totalMatches={allMatches.length}
            attendingMatches={attendingCount}
            totalExpenses={expenseTotal.total}
            totalIdeas={ideasCount.total}
            packingProgress={packingPct}
            daysUntil={remaining}
          />

          {/* Achievements */}
          <Achievements
            stats={{
              totalMiles,
              statesVisited: allStops.length,
              flightsPlanned: flightsCount.total,
              matchesAttending: attendingCount,
              ticketsPurchased: purchasedCount,
              predictionsCorrect: 0,
              decisionsVoted: 0,
              ideasCreated: ideasCount.total,
              photosUploaded: photosCount.total,
              packingProgress: packingPct,
              checklistProgress: logisticsPct,
              expensesLogged: expenseCount.total,
              activeTravelers: allTravelers.length,
              daysUntilTrip: remaining,
            }}
          />
        </aside>
      </div>
    </div>
  );
}
