import { db } from "@/lib/db";
import { ideas, stops } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const stopId = request.nextUrl.searchParams.get("stopId");

    const rows = stopId
      ? db.select().from(ideas).where(eq(ideas.stopId, stopId)).all()
      : db.select().from(ideas).all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/ideas error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { stopId, title, category, description, url, address, estimatedCost, estimatedDuration, type, options } = body;

    if (!stopId || !title || !category) {
      return NextResponse.json(
        { error: "stopId, title, and category are required" },
        { status: 400 }
      );
    }

    // Verify stop exists
    const stop = db.select().from(stops).where(eq(stops.id, stopId)).get();
    if (!stop) {
      return NextResponse.json(
        { error: "Stop not found" },
        { status: 404 }
      );
    }

    const timestamp = now();
    const newIdea = {
      id: generateId(),
      stopId,
      title,
      category,
      description: description || null,
      url: url || null,
      address: address || null,
      estimatedCost: estimatedCost ? Number(estimatedCost) : null,
      estimatedDuration: estimatedDuration || null,
      votes: "[]",
      type: type || "idea",
      options: options || null,
      status: "idea" as const,
      itineraryItemId: null,
      addedBy: session?.travelerName || null,
      notes: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(ideas).values(newIdea).run();

    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/ideas error:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
