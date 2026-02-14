import { db } from "@/lib/db";
import {
  journalEntries,
  photos,
  matches,
  expenses,
  stops,
} from "@/lib/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { TRIP_START } from "@/lib/dates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlogEntry = {
  date: string;
  dayNumber: number;
  city: string;
  title: string;
  highlight: string | null;
  bestMeal: string | null;
  funniestMoment: string | null;
  matchResults: {
    home: string;
    away: string;
    homeScore: number;
    awayScore: number;
  }[];
  photoCount: number;
  totalSpend: number;
  rating: number | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Day number (1-based) for a given date relative to trip start. */
function dayNumber(date: string): number {
  const start = new Date(TRIP_START);
  const current = new Date(date);
  return (
    Math.floor(
      (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );
}

/** Find which stop (city) a date falls within based on arrive/depart dates. */
function cityForDate(
  date: string,
  allStops: { city: string; arriveDate: string; departDate: string }[]
): string {
  const stop = allStops.find(
    (s) => date >= s.arriveDate && date <= s.departDate
  );
  return stop?.city ?? "On the Road";
}

// ---------------------------------------------------------------------------
// GET /api/blog
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get("date");

    // Fetch all journal entries (the blog backbone)
    const allEntries = dateFilter
      ? db
          .select()
          .from(journalEntries)
          .where(eq(journalEntries.date, dateFilter))
          .all()
      : db
          .select()
          .from(journalEntries)
          .orderBy(asc(journalEntries.date))
          .all();

    if (allEntries.length === 0) {
      return NextResponse.json({ entries: [] });
    }

    // Fetch supporting data once
    const allStops = db
      .select()
      .from(stops)
      .orderBy(asc(stops.sortOrder))
      .all();
    const allPhotos = db
      .select({ id: photos.id, takenDate: photos.takenDate })
      .from(photos)
      .all();
    const allMatches = db.select().from(matches).all();
    const allExpenses = db.select().from(expenses).all();

    // Index supporting data by date for fast lookups
    const photosByDate = new Map<string, number>();
    for (const p of allPhotos) {
      if (p.takenDate) {
        photosByDate.set(p.takenDate, (photosByDate.get(p.takenDate) ?? 0) + 1);
      }
    }

    const matchesByDate = new Map<
      string,
      { home: string; away: string; homeScore: number; awayScore: number }[]
    >();
    for (const m of allMatches) {
      if (m.actualHomeScore != null && m.actualAwayScore != null) {
        const list = matchesByDate.get(m.matchDate) ?? [];
        list.push({
          home: m.homeTeam,
          away: m.awayTeam,
          homeScore: m.actualHomeScore,
          awayScore: m.actualAwayScore,
        });
        matchesByDate.set(m.matchDate, list);
      }
    }

    const expensesByDate = new Map<string, number>();
    for (const e of allExpenses) {
      expensesByDate.set(e.date, (expensesByDate.get(e.date) ?? 0) + e.amount);
    }

    // Compose blog entries
    const entries: BlogEntry[] = allEntries.map((entry) => {
      const city = cityForDate(entry.date, allStops);
      const dayNum = dayNumber(entry.date);

      return {
        date: entry.date,
        dayNumber: dayNum,
        city,
        title: `Day ${dayNum}: ${city}`,
        highlight: entry.highlight,
        bestMeal: entry.bestMeal,
        funniestMoment: entry.funniestMoment,
        matchResults: matchesByDate.get(entry.date) ?? [],
        photoCount: photosByDate.get(entry.date) ?? 0,
        totalSpend: Math.round((expensesByDate.get(entry.date) ?? 0) * 100) / 100,
        rating: entry.rating,
      };
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("[API] GET /api/blog error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog" },
      { status: 500 }
    );
  }
}
