import { db } from "@/lib/db";
import { itineraryItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const stopId = searchParams.get("stopId");

    let items;
    if (date) {
      items = db
        .select()
        .from(itineraryItems)
        .where(eq(itineraryItems.date, date))
        .all();
    } else if (stopId) {
      items = db
        .select()
        .from(itineraryItems)
        .where(eq(itineraryItems.stopId, stopId))
        .all();
    } else {
      items = db.select().from(itineraryItems).all();
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch itinerary items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { title, type, date, stopId, matchId, startTime, endTime, location, cost, confirmed, sortOrder, notes } = body;

    if (!title || !type || !date) {
      return NextResponse.json(
        { error: "Title, type, and date are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const item = db
      .insert(itineraryItems)
      .values({
        id: generateId(),
        date,
        stopId: stopId || null,
        matchId: matchId || null,
        title,
        type,
        startTime: startTime || null,
        endTime: endTime || null,
        location: location || null,
        cost: cost ? Number(cost) : null,
        confirmed: confirmed ?? false,
        addedBy: session?.travelerName || null,
        sortOrder: sortOrder ?? 0,
        notes: notes || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to create itinerary item" },
      { status: 500 }
    );
  }
}
