import { db } from "@/lib/db";
import { parkingSpots } from "@/lib/schema";
import { eq } from "drizzle-orm";
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
      .from(parkingSpots)
      .where(eq(parkingSpots.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Parking spot not found" },
        { status: 404 }
      );
    }

    const allowedFields = [
      "stopId",
      "location",
      "address",
      "level",
      "spot",
      "photo",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(parkingSpots)
      .set(updates)
      .where(eq(parkingSpots.id, id))
      .run();

    const session = await getSession();
    logActivity(
      "updated",
      "parking",
      id,
      `${session?.travelerName || "Unknown"} updated parking spot: ${existing.location}`,
      session?.travelerName || "Unknown"
    );

    const updated = db
      .select()
      .from(parkingSpots)
      .where(eq(parkingSpots.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/parking/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update parking spot" },
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
      .from(parkingSpots)
      .where(eq(parkingSpots.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Parking spot not found" },
        { status: 404 }
      );
    }

    db.delete(parkingSpots).where(eq(parkingSpots.id, id)).run();

    const session = await getSession();
    logActivity(
      "deleted",
      "parking",
      id,
      `${session?.travelerName || "Unknown"} removed parking spot: ${existing.location}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/parking/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete parking spot" },
      { status: 500 }
    );
  }
}
