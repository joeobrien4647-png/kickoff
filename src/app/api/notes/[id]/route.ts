import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
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

    const existing = db.select().from(notes).where(eq(notes.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const allowedFields = [
      "title",
      "content",
      "stopId",
      "date",
      "pinned",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(notes).set(updates).where(eq(notes.id, id)).run();

    const session = await getSession();
    logActivity("updated", "note", id, `${session?.travelerName || "Unknown"} updated a note`, session?.travelerName || "Unknown");

    const updated = db.select().from(notes).where(eq(notes.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
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

    const existing = db.select().from(notes).where(eq(notes.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    db.delete(notes).where(eq(notes.id, id)).run();

    const session = await getSession();
    logActivity("deleted", "note", id, `${session?.travelerName || "Unknown"} deleted a note`, session?.travelerName || "Unknown");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
