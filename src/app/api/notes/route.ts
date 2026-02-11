import { db } from "@/lib/db";
import { notes, stops } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const stopId = request.nextUrl.searchParams.get("stopId");

    const rows = stopId
      ? db.select().from(notes).where(eq(notes.stopId, stopId)).orderBy(desc(notes.pinned), desc(notes.createdAt)).all()
      : db.select().from(notes).orderBy(desc(notes.pinned), desc(notes.createdAt)).all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { title, content, stopId, date } = body;

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
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
    const newNote = {
      id: generateId(),
      title: title || null,
      content,
      stopId: stopId || null,
      date: date || null,
      pinned: false,
      addedBy: body.addedBy || session?.travelerName || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(notes).values(newNote).run();

    logActivity("created", "note", newNote.id, `${session?.travelerName || "Unknown"} added a note: ${title || "Untitled"}`, session?.travelerName || "Unknown");

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
