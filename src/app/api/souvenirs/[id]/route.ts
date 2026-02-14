import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { souvenirs } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { now } from "@/lib/dates";
import { logActivity } from "@/lib/activity";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const existing = db
      .select()
      .from(souvenirs)
      .where(eq(souvenirs.id, id))
      .get();

    if (!existing)
      return NextResponse.json({ error: "Souvenir not found" }, { status: 404 });

    const allowedFields = ["item", "city", "purchased", "cost"] as const;
    const updates: Record<string, unknown> = { updatedAt: now() };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(souvenirs)
      .set(updates)
      .where(eq(souvenirs.id, id))
      .run();

    logActivity(
      "updated",
      "souvenir",
      id,
      `Updated souvenir for ${existing.recipientName}`,
      session.travelerName
    );

    const updated = db
      .select()
      .from(souvenirs)
      .where(eq(souvenirs.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/souvenirs/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update souvenir" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const existing = db
      .select()
      .from(souvenirs)
      .where(eq(souvenirs.id, id))
      .get();

    if (!existing)
      return NextResponse.json({ error: "Souvenir not found" }, { status: 404 });

    db.delete(souvenirs).where(eq(souvenirs.id, id)).run();

    logActivity(
      "deleted",
      "souvenir",
      id,
      `Deleted souvenir for ${existing.recipientName}`,
      session.travelerName
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/souvenirs/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete souvenir" },
      { status: 500 }
    );
  }
}
