import { db } from "@/lib/db";
import { drivingAssignments } from "@/lib/schema";
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
      .from(drivingAssignments)
      .where(eq(drivingAssignments.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Driving assignment not found" },
        { status: 404 }
      );
    }

    const allowedFields = [
      "fromCity",
      "toCity",
      "driverName",
      "estimatedHours",
      "date",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(drivingAssignments)
      .set(updates)
      .where(eq(drivingAssignments.id, id))
      .run();

    const updated = db
      .select()
      .from(drivingAssignments)
      .where(eq(drivingAssignments.id, id))
      .get();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    logActivity(
      "updated",
      "driving_assignment",
      id,
      `${actor} updated driving assignment: ${updated?.fromCity} → ${updated?.toCity}`,
      actor
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/driving/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update driving assignment" },
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
      .from(drivingAssignments)
      .where(eq(drivingAssignments.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Driving assignment not found" },
        { status: 404 }
      );
    }

    db.delete(drivingAssignments)
      .where(eq(drivingAssignments.id, id))
      .run();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    logActivity(
      "deleted",
      "driving_assignment",
      id,
      `${actor} removed driving assignment: ${existing.fromCity} → ${existing.toCity}`,
      actor
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/driving/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete driving assignment" },
      { status: 500 }
    );
  }
}
