import { db } from "@/lib/db";
import { matches, stops } from "@/lib/schema";
import {
  generateICalendar,
  matchesToCalendarEvents,
  stopsToCalendarEvents,
} from "@/lib/calendar";
import type { CalendarEvent } from "@/lib/calendar";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");

    let events: CalendarEvent[] = [];

    if (type !== "travel") {
      const allMatches = db.select().from(matches).all();
      events = events.concat(matchesToCalendarEvents(allMatches));
    }

    if (type !== "matches") {
      const allStops = db.select().from(stops).all();
      events = events.concat(stopsToCalendarEvents(allStops));
    }

    // Sort chronologically by date, then by start time
    events.sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return (a.startTime ?? "").localeCompare(b.startTime ?? "");
    });

    const ical = generateICalendar(events);

    return new NextResponse(ical, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="kickoff-2026.ics"',
      },
    });
  } catch (error) {
    console.error("[API] GET /api/calendar error:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar" },
      { status: 500 }
    );
  }
}
