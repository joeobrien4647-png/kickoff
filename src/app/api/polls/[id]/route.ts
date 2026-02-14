import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quickPolls } from "@/lib/schema";
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
    const { optionIndex } = body;

    if (typeof optionIndex !== "number") {
      return NextResponse.json(
        { error: "optionIndex is required" },
        { status: 400 }
      );
    }

    const poll = db
      .select()
      .from(quickPolls)
      .where(eq(quickPolls.id, id))
      .get();

    if (!poll)
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });

    if (poll.closed)
      return NextResponse.json({ error: "Poll is closed" }, { status: 400 });

    const options = JSON.parse(poll.options) as {
      text: string;
      votes: string[];
    }[];

    if (optionIndex < 0 || optionIndex >= options.length) {
      return NextResponse.json(
        { error: "Invalid option index" },
        { status: 400 }
      );
    }

    const voterName = session.travelerName;

    // Remove voter from all options first (prevent double voting)
    for (const opt of options) {
      opt.votes = opt.votes.filter((v) => v !== voterName);
    }

    // Add vote to selected option
    options[optionIndex].votes.push(voterName);

    db.update(quickPolls)
      .set({ options: JSON.stringify(options) })
      .where(eq(quickPolls.id, id))
      .run();

    logActivity(
      "voted",
      "poll",
      id,
      `Voted "${options[optionIndex].text}" on: ${poll.question}`,
      voterName
    );

    const updated = db
      .select()
      .from(quickPolls)
      .where(eq(quickPolls.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/polls/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to vote on poll" },
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
      .from(quickPolls)
      .where(eq(quickPolls.id, id))
      .get();

    if (!existing)
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });

    db.delete(quickPolls).where(eq(quickPolls.id, id)).run();

    logActivity(
      "deleted",
      "poll",
      id,
      `Deleted poll: ${existing.question}`,
      session.travelerName
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/polls/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete poll" },
      { status: 500 }
    );
  }
}
