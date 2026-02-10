import { db } from "@/lib/db";
import { matches } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const venue = request.nextUrl.searchParams.get("venue");
    const date = request.nextUrl.searchParams.get("date");

    let rows;
    if (venue) {
      rows = db.select().from(matches).where(eq(matches.venue, venue)).all();
    } else if (date) {
      rows = db
        .select()
        .from(matches)
        .where(eq(matches.matchDate, date))
        .all();
    } else {
      rows = db.select().from(matches).all();
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/matches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { homeTeam, awayTeam, venue, city, matchDate } = body;

    if (!homeTeam || !awayTeam || !venue || !city || !matchDate) {
      return NextResponse.json(
        { error: "homeTeam, awayTeam, venue, city, and matchDate are required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const newMatch = {
      id: generateId(),
      stopId: body.stopId || null,
      homeTeam,
      awayTeam,
      venue,
      city,
      matchDate,
      kickoff: body.kickoff || null,
      groupName: body.groupName || null,
      round: body.round || "group",
      ticketStatus: "none" as const,
      ticketPrice: null,
      ticketUrl: null,
      ticketNotes: null,
      fanZone: null,
      attending: false,
      priority: body.priority ?? 0,
      notes: body.notes || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(matches).values(newMatch).run();

    return NextResponse.json(newMatch, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/matches error:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
