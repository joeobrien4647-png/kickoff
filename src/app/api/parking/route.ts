import { db } from "@/lib/db";
import { parkingSpots } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(parkingSpots)
      .orderBy(desc(parkingSpots.createdAt))
      .all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/parking error:", error);
    return NextResponse.json(
      { error: "Failed to fetch parking spots" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { stopId, location, address, level, spot, photo, notes } = body;

    if (!location) {
      return NextResponse.json(
        { error: "location is required" },
        { status: 400 }
      );
    }

    const newSpot = {
      id: generateId(),
      stopId: stopId || null,
      location,
      address: address || null,
      level: level || null,
      spot: spot || null,
      photo: photo || null,
      notes: notes || null,
      addedBy: session?.travelerName || null,
      createdAt: now(),
    };

    db.insert(parkingSpots).values(newSpot).run();

    logActivity(
      "created",
      "parking",
      newSpot.id,
      `${session?.travelerName || "Unknown"} saved parking spot: ${location}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/parking error:", error);
    return NextResponse.json(
      { error: "Failed to save parking spot" },
      { status: 500 }
    );
  }
}
