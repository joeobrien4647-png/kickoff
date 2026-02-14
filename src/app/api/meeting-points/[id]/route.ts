import { db } from "@/lib/db";
import { meetingPoints } from "@/lib/schema";
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
    const session = await getSession();
    const body = await request.json();

    const existing = db.select().from(meetingPoints).where(eq(meetingPoints.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Meeting point not found" }, { status: 404 });
    }

    const allowedFields = [
      "name",
      "address",
      "lat",
      "lng",
      "time",
      "date",
      "stopId",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(meetingPoints).set(updates).where(eq(meetingPoints.id, id)).run();

    logActivity(
      "updated",
      "meeting_point",
      id,
      `${session?.travelerName || "Unknown"} updated meeting point: ${existing.name}`,
      session?.travelerName || "Unknown"
    );

    const updated = db.select().from(meetingPoints).where(eq(meetingPoints.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/meeting-points/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update meeting point" },
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

    const existing = db.select().from(meetingPoints).where(eq(meetingPoints.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Meeting point not found" }, { status: 404 });
    }

    db.delete(meetingPoints).where(eq(meetingPoints.id, id)).run();

    const session = await getSession();
    logActivity(
      "deleted",
      "meeting_point",
      id,
      `${session?.travelerName || "Unknown"} removed meeting point: ${existing.name}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/meeting-points/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete meeting point" },
      { status: 500 }
    );
  }
}
