import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decisions } from "@/lib/schema";
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
      .from(decisions)
      .where(eq(decisions.id, id))
      .get();
    if (!existing)
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 }
      );

    db.update(decisions)
      .set({
        ...(body.status && { status: body.status }),
        ...(body.decidedOption !== undefined && {
          decidedOption: body.decidedOption,
        }),
        updatedAt: now(),
      })
      .where(eq(decisions.id, id))
      .run();

    logActivity(
      "updated",
      "decision",
      id,
      `Decision: ${body.decidedOption ?? "updated"}`,
      session.travelerName
    );

    const updated = db
      .select()
      .from(decisions)
      .where(eq(decisions.id, id))
      .get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/decisions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update decision" },
      { status: 500 }
    );
  }
}
