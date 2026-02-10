import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { stops, itineraryItems, matches, ideas, accommodations } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";
import { tripDays, TRIP_START } from "@/lib/dates";
import { DayNav } from "@/components/days/day-nav";
import { DayHeader } from "@/components/days/day-header";
import { DayGlance } from "@/components/days/day-glance";
import { AccommodationCard } from "@/components/days/accommodation-card";
import { DayTimeline } from "@/components/days/day-timeline";
import { MatchesToday } from "@/components/days/matches-today";
import { IdeasPreview } from "@/components/days/ideas-preview";
import { CityGuideCard } from "@/components/city-guide-card";
import type { Stop } from "@/lib/schema";

interface DayPageProps {
  params: Promise<{ date: string }>;
}

function dayNumber(date: string): number {
  const start = new Date(TRIP_START + "T12:00:00");
  const current = new Date(date + "T12:00:00");
  return Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function stopForDate(date: string, allStops: Stop[]): Stop | null {
  return (
    allStops.find(
      (stop) => date >= stop.arriveDate && date <= stop.departDate
    ) ?? null
  );
}

export default async function DayPage({ params }: DayPageProps) {
  const { date } = await params;

  // Validate date is within trip range
  const days = tripDays();
  if (!days.includes(date)) {
    notFound();
  }

  const num = dayNumber(date);

  // Fetch all stops for date resolution
  const allStops = db.select().from(stops).all();
  const currentStop = stopForDate(date, allStops);

  // Get itinerary items for this date
  const dayItems = db
    .select()
    .from(itineraryItems)
    .where(eq(itineraryItems.date, date))
    .all();

  // Get ALL matches happening today (any East Coast venue)
  const dayMatches = db
    .select()
    .from(matches)
    .where(eq(matches.matchDate, date))
    .all();

  // Get accommodation for current stop
  const accommodation = currentStop
    ? db
        .select()
        .from(accommodations)
        .where(eq(accommodations.stopId, currentStop.id))
        .get()
    : null;

  // Get top ideas for current stop (status: idea or planned)
  const stopIdeas = currentStop
    ? db
        .select()
        .from(ideas)
        .where(
          and(
            eq(ideas.stopId, currentStop.id),
            inArray(ideas.status, ["idea", "planned"])
          )
        )
        .all()
    : [];

  // Sort ideas by vote count (descending), take top 5
  const sortedIdeas = stopIdeas
    .map((idea) => {
      const voteList = idea.votes ? JSON.parse(idea.votes) as string[] : [];
      return { ...idea, voteCount: voteList.length };
    })
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 5);

  // Determine if this is a travel day
  const isTravelDay = dayItems.some((item) => item.type === "travel");

  // Find drive info if arriving at current stop today
  const driveInfo = currentStop?.arriveDate === date && currentStop.driveFromPrev
    ? JSON.parse(currentStop.driveFromPrev) as { miles: number; hours: number; minutes: number }
    : null;

  // Find the previous stop for drive context
  const prevStop = driveInfo
    ? allStops
        .filter((s) => s.sortOrder < (currentStop?.sortOrder ?? 0))
        .sort((a, b) => b.sortOrder - a.sortOrder)[0] ?? null
    : null;

  return (
    <div className="mx-auto max-w-2xl pb-20">
      <DayNav date={date} dayNumber={num} />

      <div className="space-y-6 mt-2">
        {/* Section 1: Day Header */}
        <DayHeader
          date={date}
          dayNumber={num}
          stop={currentStop}
          isTravelDay={isTravelDay}
          driveInfo={driveInfo}
          fromCity={prevStop?.city ?? null}
          toCity={currentStop?.city ?? null}
          matches={dayMatches}
        />

        {/* Section 1b: Day-at-a-Glance */}
        <DayGlance
          city={currentStop?.city ?? null}
          matchCount={dayMatches.length}
          isTravelDay={isTravelDay}
          plannedCount={dayItems.filter((i) => i.type !== "travel").length}
          ideaCount={stopIdeas.length}
          accommodationConfirmed={accommodation ? accommodation.confirmed : null}
        />

        {/* Section 2: Accommodation */}
        {accommodation && (
          <AccommodationCard accommodation={accommodation} />
        )}

        {/* Section 3: Today's Plan (Timeline) */}
        <DayTimeline
          date={date}
          stopId={currentStop?.id ?? null}
          items={dayItems}
        />

        {/* Section 4: Matches Today */}
        {dayMatches.length > 0 && (
          <MatchesToday
            matches={dayMatches}
            currentStopCity={currentStop?.city ?? null}
          />
        )}

        {/* Section 5: Ideas for This Stop */}
        {currentStop && sortedIdeas.length > 0 && (
          <IdeasPreview
            ideas={sortedIdeas}
            stopId={currentStop.id}
            stopCity={currentStop.city}
          />
        )}

        {/* Section 6: City Guide */}
        {currentStop && (
          <CityGuideCard city={currentStop.city} />
        )}
      </div>
    </div>
  );
}
