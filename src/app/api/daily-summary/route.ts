import { db } from "@/lib/db";
import {
  stops,
  expenses,
  matches,
  journalEntries,
  photos,
  itineraryItems,
  travelers,
  tripSettings,
} from "@/lib/schema";
import { eq, and, lte, gte, sql } from "drizzle-orm";
import { TRIP_START } from "@/lib/dates";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dayNumber(date: string): number {
  const start = new Date(TRIP_START + "T12:00:00");
  const current = new Date(date + "T12:00:00");
  return (
    Math.floor(
      (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1
  );
}

function fmtDateHuman(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function scoreText(
  homeTeam: string,
  awayTeam: string,
  homeScore: number | null,
  awayScore: number | null,
): string {
  if (homeScore !== null && awayScore !== null) {
    return `${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`;
  }
  return `${homeTeam} vs ${awayTeam}`;
}

// ---------------------------------------------------------------------------
// GET /api/daily-summary?date=YYYY-MM-DD
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const dateParam = request.nextUrl.searchParams.get("date");
    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return NextResponse.json(
        { error: "date query param required (YYYY-MM-DD)" },
        { status: 400 },
      );
    }

    const date = dateParam;
    const dayNum = dayNumber(date);

    // ---- Current city (stop where arriveDate <= date <= departDate) --------
    const currentStop = db
      .select()
      .from(stops)
      .where(and(lte(stops.arriveDate, date), gte(stops.departDate, date)))
      .get();

    const city = currentStop?.city ?? null;

    // ---- Total expenses for the day ----------------------------------------
    const expenseResult = db
      .select({ total: sql<number>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .where(eq(expenses.date, date))
      .get();
    const spent = Math.round((expenseResult?.total ?? 0) * 100) / 100;

    // ---- Traveler count (for per-person split) -----------------------------
    const travelerList = db.select().from(travelers).all();
    const travelerCount = Math.max(travelerList.length, 1);
    const perPerson = Math.round((spent / travelerCount) * 100) / 100;

    // ---- Matches on that day -----------------------------------------------
    const dayMatches = db
      .select()
      .from(matches)
      .where(eq(matches.matchDate, date))
      .all();

    const matchResults = dayMatches.map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      venue: m.venue,
      city: m.city,
      homeScore: m.actualHomeScore,
      awayScore: m.actualAwayScore,
      attending: m.attending,
    }));

    // ---- Journal entry (if any) --------------------------------------------
    const journal = db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.date, date))
      .get();

    // ---- Photo count -------------------------------------------------------
    const photoResult = db
      .select({ count: sql<number>`count(*)` })
      .from(photos)
      .where(eq(photos.takenDate, date))
      .get();
    const photoCount = photoResult?.count ?? 0;

    // ---- Itinerary items ---------------------------------------------------
    const dayItinerary = db
      .select()
      .from(itineraryItems)
      .where(eq(itineraryItems.date, date))
      .all();

    // ---- Next stop (for "Tomorrow" line) -----------------------------------
    const nextStop = db
      .select()
      .from(stops)
      .where(eq(stops.arriveDate, nextDay(date)))
      .get();

    // ---- Trip settings (for name) ------------------------------------------
    const settings = db.select().from(tripSettings).get();

    // ---- Compose the shareable text summary --------------------------------
    const lines: string[] = [];

    // Header
    const tripName = settings?.name ?? "KICKOFF 2026";
    lines.push(
      `\uD83C\uDFF4 ${tripName.toUpperCase()} \u2014 Day ${dayNum} (${fmtDateHuman(date)})`,
    );
    if (city) {
      lines.push(`\uD83D\uDCCD ${city}`);
    }
    lines.push("");

    // Spending
    if (spent > 0) {
      lines.push(
        `\uD83D\uDCB0 Spent today: $${spent}${travelerCount > 1 ? ` ($${perPerson} per person)` : ""}`,
      );
    }

    // Journal highlights
    if (journal?.bestMeal) {
      lines.push(`\uD83C\uDF55 Best meal: ${journal.bestMeal}`);
    }
    if (journal?.funniestMoment) {
      lines.push(`\uD83D\uDE02 Funniest moment: ${journal.funniestMoment}`);
    }
    if (journal?.highlight) {
      lines.push(`\u2B50 Highlight: ${journal.highlight}`);
    }

    // Matches
    if (dayMatches.length > 0) {
      lines.push("");
      for (const m of dayMatches) {
        const score = scoreText(
          m.homeTeam,
          m.awayTeam,
          m.actualHomeScore,
          m.actualAwayScore,
        );
        const attendTag = m.attending ? " (WE WERE THERE!)" : "";
        lines.push(`\u26BD Match: ${score}${attendTag}`);
      }
    }

    // Photos
    if (photoCount > 0) {
      lines.push(`\uD83D\uDCF8 ${photoCount} photo${photoCount !== 1 ? "s" : ""} taken`);
    }

    // Tomorrow
    if (nextStop) {
      lines.push("");
      let tomorrowLine = `Tomorrow: ${nextStop.city}`;
      if (nextStop.driveFromPrev) {
        try {
          const drive = JSON.parse(nextStop.driveFromPrev) as {
            miles?: number;
            hours?: number;
            minutes?: number;
          };
          if (drive.miles) {
            tomorrowLine += ` (${drive.miles} miles`;
            if (drive.hours || drive.minutes) {
              const parts: string[] = [];
              if (drive.hours) parts.push(`${drive.hours} hr${drive.hours !== 1 ? "s" : ""}`);
              if (drive.minutes) parts.push(`${drive.minutes} min`);
              tomorrowLine += `, ~${parts.join(" ")}`;
            }
            tomorrowLine += ")";
          }
        } catch {
          // skip malformed JSON
        }
      }
      lines.push(tomorrowLine);
    }

    const summary = lines.join("\n");

    return NextResponse.json({
      date,
      dayNumber: dayNum,
      city,
      summary,
      stats: {
        spent,
        perPerson,
        travelerCount,
        photoCount,
        matchResults,
        journal: journal
          ? {
              highlight: journal.highlight,
              bestMeal: journal.bestMeal,
              funniestMoment: journal.funniestMoment,
              rating: journal.rating,
            }
          : null,
        itineraryItems: dayItinerary.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          startTime: item.startTime,
          endTime: item.endTime,
          location: item.location,
        })),
        nextStop: nextStop
          ? { city: nextStop.city, driveFromPrev: nextStop.driveFromPrev }
          : null,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/daily-summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate daily summary" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function nextDay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
