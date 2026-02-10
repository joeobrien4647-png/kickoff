import { db } from "@/lib/db";
import { matches } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { now } from "@/lib/dates";
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
      .from(matches)
      .where(eq(matches.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    const allowedFields = [
      "ticketStatus",
      "priority",
      "attending",
      "ticketPrice",
      "ticketUrl",
      "ticketNotes",
      "fanZone",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(matches).set(updates).where(eq(matches.id, id)).run();

    const updated = db
      .select()
      .from(matches)
      .where(eq(matches.id, id))
      .get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/matches/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
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
      .from(matches)
      .where(eq(matches.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    db.delete(matches).where(eq(matches.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/matches/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    );
  }
}
