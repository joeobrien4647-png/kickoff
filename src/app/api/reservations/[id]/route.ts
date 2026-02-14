import { db } from "@/lib/db";
import { reservations } from "@/lib/schema";
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

    const existing = db.select().from(reservations).where(eq(reservations.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    const allowedFields = [
      "name",
      "type",
      "date",
      "time",
      "partySize",
      "confirmationRef",
      "address",
      "phone",
      "url",
      "notes",
      "stopId",
      "status",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(reservations).set(updates).where(eq(reservations.id, id)).run();

    logActivity(
      "updated",
      "reservation",
      id,
      `${session?.travelerName || "Unknown"} updated reservation: ${existing.name}`,
      session?.travelerName || "Unknown"
    );

    const updated = db.select().from(reservations).where(eq(reservations.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/reservations/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
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

    const existing = db.select().from(reservations).where(eq(reservations.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    db.delete(reservations).where(eq(reservations.id, id)).run();

    const session = await getSession();
    logActivity(
      "deleted",
      "reservation",
      id,
      `${session?.travelerName || "Unknown"} deleted reservation: ${existing.name}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/reservations/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
