import { db } from "@/lib/db";
import { accommodations } from "@/lib/schema";
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

    const existing = db.select().from(accommodations).where(eq(accommodations.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Accommodation not found" }, { status: 404 });
    }

    const allowedFields = [
      "name",
      "stopId",
      "type",
      "address",
      "contact",
      "costPerNight",
      "nights",
      "confirmed",
      "bookingUrl",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(accommodations).set(updates).where(eq(accommodations.id, id)).run();

    const updated = db.select().from(accommodations).where(eq(accommodations.id, id)).get();

    const session = await getSession();
    logActivity("updated", "accommodation", id, `${session?.travelerName || "Unknown"} updated accommodation: ${updated?.name ?? existing.name}`, session?.travelerName || "Unknown");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/accommodations/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update accommodation" },
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

    const existing = db.select().from(accommodations).where(eq(accommodations.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Accommodation not found" }, { status: 404 });
    }

    db.delete(accommodations).where(eq(accommodations.id, id)).run();

    const session = await getSession();
    logActivity("deleted", "accommodation", id, `${session?.travelerName || "Unknown"} deleted accommodation: ${existing.name}`, session?.travelerName || "Unknown");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/accommodations/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete accommodation" },
      { status: 500 }
    );
  }
}
