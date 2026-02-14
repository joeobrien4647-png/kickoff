import { db } from "@/lib/db";
import { stops } from "@/lib/schema";
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

    const existing = db.select().from(stops).where(eq(stops.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    }

    const allowedFields = [
      "name",
      "city",
      "state",
      "arriveDate",
      "departDate",
      "sortOrder",
      "lat",
      "lng",
      "driveFromPrev",
      "checkedInAt",
      "checkedInBy",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(stops).set(updates).where(eq(stops.id, id)).run();

    const updated = db.select().from(stops).where(eq(stops.id, id)).get();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";

    // Log check-in activity specifically
    if (body.checkedInAt) {
      logActivity(
        "checked_in",
        "stop",
        id,
        `${actor} checked in at ${existing.city}`,
        actor
      );
    } else {
      logActivity(
        "updated",
        "stop",
        id,
        `${actor} updated stop: ${existing.city}`,
        actor
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/stops/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update stop" },
      { status: 500 }
    );
  }
}
