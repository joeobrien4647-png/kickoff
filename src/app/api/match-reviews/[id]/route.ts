import { db } from "@/lib/db";
import { matchReviews } from "@/lib/schema";
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
      .from(matchReviews)
      .where(eq(matchReviews.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Match review not found" },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = { updatedAt: now() };
    if (body.atmosphere !== undefined) updates.atmosphere = body.atmosphere;
    if (body.highlights !== undefined) updates.highlights = body.highlights;
    if (body.scorers !== undefined)
      updates.scorers = JSON.stringify(body.scorers);
    if (body.mvp !== undefined) updates.mvp = body.mvp;

    db.update(matchReviews).set(updates).where(eq(matchReviews.id, id)).run();

    logActivity(
      "updated",
      "match_review",
      id,
      `Updated match review`,
      session.travelerName
    );

    const updated = db
      .select()
      .from(matchReviews)
      .where(eq(matchReviews.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/match-reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update match review" },
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
      .from(matchReviews)
      .where(eq(matchReviews.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Match review not found" },
        { status: 404 }
      );
    }

    db.delete(matchReviews).where(eq(matchReviews.id, id)).run();

    logActivity(
      "deleted",
      "match_review",
      id,
      `Deleted match review`,
      session.travelerName
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/match-reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete match review" },
      { status: 500 }
    );
  }
}
