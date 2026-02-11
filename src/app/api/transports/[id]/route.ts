import { db } from "@/lib/db";
import { transports } from "@/lib/schema";
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
      .from(transports)
      .where(eq(transports.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Transport not found" },
        { status: 404 }
      );
    }

    const allowedFields = [
      "type",
      "fromCity",
      "toCity",
      "departDate",
      "departTime",
      "arriveTime",
      "carrier",
      "confirmationRef",
      "cost",
      "bookingUrl",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] =
          field === "cost" && body[field] != null
            ? Number(body[field])
            : body[field];
      }
    }

    db.update(transports).set(updates).where(eq(transports.id, id)).run();

    const session = await getSession();
    logActivity(
      "updated",
      "transport",
      id,
      `${session?.travelerName || "Unknown"} updated transport: ${existing.type} ${existing.fromCity} → ${existing.toCity}`,
      session?.travelerName || "Unknown"
    );

    const updated = db
      .select()
      .from(transports)
      .where(eq(transports.id, id))
      .get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/transports/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update transport" },
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
      .from(transports)
      .where(eq(transports.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Transport not found" },
        { status: 404 }
      );
    }

    db.delete(transports).where(eq(transports.id, id)).run();

    const session = await getSession();
    logActivity(
      "deleted",
      "transport",
      id,
      `${session?.travelerName || "Unknown"} deleted transport: ${existing.type} ${existing.fromCity} → ${existing.toCity}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/transports/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete transport" },
      { status: 500 }
    );
  }
}
