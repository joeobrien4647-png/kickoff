import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quickPolls } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { eq } from "drizzle-orm";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const poll = db
      .select()
      .from(quickPolls)
      .where(eq(quickPolls.id, id))
      .get();

    if (!poll)
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });

    if (poll.closed)
      return NextResponse.json({ error: "Poll already closed" }, { status: 400 });

    db.update(quickPolls)
      .set({ closed: true })
      .where(eq(quickPolls.id, id))
      .run();

    logActivity(
      "closed",
      "poll",
      id,
      `Closed poll: ${poll.question}`,
      session.travelerName
    );

    const updated = db
      .select()
      .from(quickPolls)
      .where(eq(quickPolls.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] POST /api/polls/[id]/close error:", error);
    return NextResponse.json(
      { error: "Failed to close poll" },
      { status: 500 }
    );
  }
}
