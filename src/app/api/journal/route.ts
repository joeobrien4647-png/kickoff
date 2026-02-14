import { db } from "@/lib/db";
import { journalEntries, stops } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(journalEntries)
      .orderBy(desc(journalEntries.date))
      .all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/journal error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { date, stopId, highlight, bestMeal, funniestMoment, rating } = body;

    if (!date) {
      return NextResponse.json(
        { error: "date is required" },
        { status: 400 }
      );
    }

    // Verify stop exists if provided
    if (stopId) {
      const stop = db.select().from(stops).where(eq(stops.id, stopId)).get();
      if (!stop) {
        return NextResponse.json(
          { error: "Stop not found" },
          { status: 404 }
        );
      }
    }

    const timestamp = now();
    const actor = body.addedBy || session?.travelerName || "Unknown";

    // Upsert: check if entry for this date already exists
    const existing = db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.date, date))
      .get();

    if (existing) {
      // Update existing entry
      db.update(journalEntries)
        .set({
          stopId: stopId || null,
          highlight: highlight || null,
          bestMeal: bestMeal || null,
          funniestMoment: funniestMoment || null,
          rating: rating ?? null,
          addedBy: actor,
          updatedAt: timestamp,
        })
        .where(eq(journalEntries.id, existing.id))
        .run();

      logActivity(
        "updated",
        "journal",
        existing.id,
        `${actor} updated the journal entry for ${date}`,
        actor
      );

      const updated = db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, existing.id))
        .get();
      return NextResponse.json(updated);
    }

    // Create new entry
    const newEntry = {
      id: generateId(),
      date,
      stopId: stopId || null,
      highlight: highlight || null,
      bestMeal: bestMeal || null,
      funniestMoment: funniestMoment || null,
      rating: rating ?? null,
      addedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(journalEntries).values(newEntry).run();

    logActivity(
      "created",
      "journal",
      newEntry.id,
      `${actor} added a journal entry for ${date}`,
      actor
    );

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/journal error:", error);
    return NextResponse.json(
      { error: "Failed to save journal entry" },
      { status: 500 }
    );
  }
}
