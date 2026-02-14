import { db } from "@/lib/db";
import { matchReviews } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const matchId = request.nextUrl.searchParams.get("matchId");

    let rows;
    if (matchId) {
      rows = db
        .select()
        .from(matchReviews)
        .where(eq(matchReviews.matchId, matchId))
        .all();
    } else {
      rows = db.select().from(matchReviews).all();
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/match-reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch match reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { matchId, atmosphere, highlights, scorers, mvp } = body;

    if (!matchId) {
      return NextResponse.json(
        { error: "matchId is required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const newReview = {
      id: generateId(),
      matchId,
      atmosphere: atmosphere ?? null,
      highlights: highlights ?? null,
      scorers: scorers ? JSON.stringify(scorers) : null,
      mvp: mvp ?? null,
      addedBy: session.travelerName,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(matchReviews).values(newReview).run();

    logActivity(
      "created",
      "match_review",
      newReview.id,
      `Added match review`,
      session.travelerName
    );

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/match-reviews error:", error);
    return NextResponse.json(
      { error: "Failed to create match review" },
      { status: 500 }
    );
  }
}
