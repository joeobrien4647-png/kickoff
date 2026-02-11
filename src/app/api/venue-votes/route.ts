import { db } from "@/lib/db";
import { venueVotes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get("city");

    const votes = city
      ? db.select().from(venueVotes).where(eq(venueVotes.city, city)).all()
      : db.select().from(venueVotes).all();

    return NextResponse.json(votes);
  } catch (error) {
    console.error("[API] GET /api/venue-votes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch venue votes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { venueName, city, category, voterName } = body;

    if (!venueName || !city || !category || !voterName) {
      return NextResponse.json(
        { error: "venueName, city, category, and voterName are required" },
        { status: 400 }
      );
    }

    // Check if vote already exists (toggle behavior)
    const existing = db
      .select()
      .from(venueVotes)
      .where(
        and(
          eq(venueVotes.venueName, venueName),
          eq(venueVotes.city, city),
          eq(venueVotes.voterName, voterName)
        )
      )
      .get();

    if (existing) {
      // Remove vote (toggle off)
      db.delete(venueVotes).where(eq(venueVotes.id, existing.id)).run();
      return NextResponse.json({ action: "removed" });
    } else {
      // Add vote (toggle on)
      const vote = db
        .insert(venueVotes)
        .values({
          id: generateId(),
          venueName,
          city,
          category,
          voterName,
          vote: 1,
          createdAt: now(),
        })
        .returning()
        .get();

      return NextResponse.json({ action: "added", vote });
    }
  } catch (error) {
    console.error("[API] POST /api/venue-votes error:", error);
    return NextResponse.json(
      { error: "Failed to toggle venue vote" },
      { status: 500 }
    );
  }
}
