import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quickPolls } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { logActivity } from "@/lib/activity";
import { desc } from "drizzle-orm";

export function GET() {
  try {
    const all = db
      .select()
      .from(quickPolls)
      .orderBy(desc(quickPolls.createdAt))
      .all();
    return NextResponse.json(all);
  } catch (error) {
    console.error("[API] GET /api/polls error:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { question, options, expiresAt } = body;

    if (!question?.trim() || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "Question and at least 2 options required" },
        { status: 400 }
      );
    }

    const id = generateId();
    const optionsJson = JSON.stringify(
      options.map((text: string) => ({ text: text.trim(), votes: [] }))
    );

    db.insert(quickPolls)
      .values({
        id,
        question: question.trim(),
        options: optionsJson,
        createdBy: session.travelerName,
        expiresAt: expiresAt || null,
        closed: false,
        createdAt: now(),
      })
      .run();

    logActivity(
      "created",
      "poll",
      id,
      `Created poll: ${question.trim()}`,
      session.travelerName
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/polls error:", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
