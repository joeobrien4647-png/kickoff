import { db } from "@/lib/db";
import { predictions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing = db
      .select()
      .from(predictions)
      .where(eq(predictions.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    if (existing.travelerName !== session.travelerName) {
      return NextResponse.json(
        { error: "You can only edit your own predictions" },
        { status: 403 }
      );
    }

    const updates: Record<string, unknown> = { updatedAt: now() };
    if (body.homeScore != null) updates.homeScore = Number(body.homeScore);
    if (body.awayScore != null) updates.awayScore = Number(body.awayScore);

    db.update(predictions).set(updates).where(eq(predictions.id, id)).run();

    const updated = db
      .select()
      .from(predictions)
      .where(eq(predictions.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/predictions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update prediction" },
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
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = db
      .select()
      .from(predictions)
      .where(eq(predictions.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    if (existing.travelerName !== session.travelerName) {
      return NextResponse.json(
        { error: "You can only delete your own predictions" },
        { status: 403 }
      );
    }

    db.delete(predictions).where(eq(predictions.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/predictions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete prediction" },
      { status: 500 }
    );
  }
}
