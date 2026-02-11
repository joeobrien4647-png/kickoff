import { db } from "@/lib/db";
import { ideas } from "@/lib/schema";
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

    const existing = db.select().from(ideas).where(eq(ideas.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    // Handle vote toggle
    if (body.action === "vote") {
      const voterName = session?.travelerName;
      if (!voterName) {
        return NextResponse.json(
          { error: "Must be logged in to vote" },
          { status: 401 }
        );
      }

      const currentVotes: string[] = JSON.parse(existing.votes || "[]");
      const idx = currentVotes.indexOf(voterName);

      if (idx >= 0) {
        currentVotes.splice(idx, 1);
      } else {
        currentVotes.push(voterName);
      }

      db.update(ideas)
        .set({ votes: JSON.stringify(currentVotes), updatedAt: now() })
        .where(eq(ideas.id, id))
        .run();

      logActivity("voted", "idea", id, `${voterName} voted on: ${existing.title}`, voterName);

      const updated = db.select().from(ideas).where(eq(ideas.id, id)).get();
      return NextResponse.json(updated);
    }

    // Handle poll vote
    if (body.action === "poll_vote") {
      const voterName = session?.travelerName;
      if (!voterName) {
        return NextResponse.json(
          { error: "Must be logged in to vote" },
          { status: 401 }
        );
      }

      const optionIndex: number = body.optionIndex;
      const options: { text: string; votes: string[] }[] = JSON.parse(
        existing.options || "[]"
      );

      if (optionIndex < 0 || optionIndex >= options.length) {
        return NextResponse.json(
          { error: "Invalid option index" },
          { status: 400 }
        );
      }

      // Check if user already voted for this option (toggle off)
      const alreadyVotedHere = options[optionIndex].votes.includes(voterName);

      // Remove user's vote from all options
      for (const opt of options) {
        opt.votes = opt.votes.filter((v) => v !== voterName);
      }

      // If they weren't already on this option, add them
      if (!alreadyVotedHere) {
        options[optionIndex].votes.push(voterName);
      }

      db.update(ideas)
        .set({ options: JSON.stringify(options), updatedAt: now() })
        .where(eq(ideas.id, id))
        .run();

      logActivity("voted", "idea", id, `${voterName} voted on poll: ${existing.title}`, voterName);

      const updated = db.select().from(ideas).where(eq(ideas.id, id)).get();
      return NextResponse.json(updated);
    }

    // Handle status change
    if (body.status) {
      db.update(ideas)
        .set({ status: body.status, updatedAt: now() })
        .where(eq(ideas.id, id))
        .run();

      logActivity("updated", "idea", id, `${session?.travelerName || "Unknown"} updated idea status to ${body.status}`, session?.travelerName || "Unknown");

      const updated = db.select().from(ideas).where(eq(ideas.id, id)).get();
      return NextResponse.json(updated);
    }

    // Handle general field updates
    const allowedFields = [
      "title",
      "category",
      "description",
      "url",
      "address",
      "estimatedCost",
      "estimatedDuration",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(ideas).set(updates).where(eq(ideas.id, id)).run();

    logActivity("updated", "idea", id, `${session?.travelerName || "Unknown"} updated idea: ${existing.title}`, session?.travelerName || "Unknown");

    const updated = db.select().from(ideas).where(eq(ideas.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/ideas/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update idea" },
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

    const existing = db.select().from(ideas).where(eq(ideas.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    db.delete(ideas).where(eq(ideas.id, id)).run();

    const session = await getSession();
    logActivity("deleted", "idea", id, `${session?.travelerName || "Unknown"} deleted an idea`, session?.travelerName || "Unknown");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/ideas/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete idea" },
      { status: 500 }
    );
  }
}
