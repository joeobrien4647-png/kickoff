import { db } from "@/lib/db";
import { journalEntries } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    const allowedFields = [
      "stopId",
      "highlight",
      "bestMeal",
      "funniestMoment",
      "rating",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(journalEntries).set(updates).where(eq(journalEntries.id, id)).run();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    logActivity(
      "updated",
      "journal",
      id,
      `${actor} updated the journal entry for ${existing.date}`,
      actor
    );

    const updated = db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/journal/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    db.delete(journalEntries).where(eq(journalEntries.id, id)).run();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    logActivity(
      "deleted",
      "journal",
      id,
      `${actor} deleted the journal entry for ${existing.date}`,
      actor
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/journal/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
