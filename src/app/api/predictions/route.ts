import { db } from "@/lib/db";
import { predictions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const matchId = request.nextUrl.searchParams.get("matchId");
    const travelerName = request.nextUrl.searchParams.get("travelerName");

    let rows;
    if (matchId && travelerName) {
      rows = db
        .select()
        .from(predictions)
        .where(
          and(
            eq(predictions.matchId, matchId),
            eq(predictions.travelerName, travelerName)
          )
        )
        .all();
    } else if (matchId) {
      rows = db
        .select()
        .from(predictions)
        .where(eq(predictions.matchId, matchId))
        .all();
    } else if (travelerName) {
      rows = db
        .select()
        .from(predictions)
        .where(eq(predictions.travelerName, travelerName))
        .all();
    } else {
      rows = db.select().from(predictions).all();
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/predictions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
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
    const { matchId, homeScore, awayScore } = body;

    if (!matchId || homeScore == null || awayScore == null) {
      return NextResponse.json(
        { error: "matchId, homeScore, and awayScore are required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const travelerName = session.travelerName;

    // Upsert: check if prediction already exists for this match + traveler
    const existing = db
      .select()
      .from(predictions)
      .where(
        and(
          eq(predictions.matchId, matchId),
          eq(predictions.travelerName, travelerName)
        )
      )
      .get();

    if (existing) {
      db.update(predictions)
        .set({
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
          updatedAt: timestamp,
        })
        .where(eq(predictions.id, existing.id))
        .run();

      const updated = db
        .select()
        .from(predictions)
        .where(eq(predictions.id, existing.id))
        .get();

      return NextResponse.json(updated);
    }

    const newPrediction = {
      id: generateId(),
      matchId,
      travelerName,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(predictions).values(newPrediction).run();

    return NextResponse.json(newPrediction, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/predictions error:", error);
    return NextResponse.json(
      { error: "Failed to save prediction" },
      { status: 500 }
    );
  }
}
