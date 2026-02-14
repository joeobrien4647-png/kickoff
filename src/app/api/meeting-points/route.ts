import { db } from "@/lib/db";
import { meetingPoints, stops } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const stopId = request.nextUrl.searchParams.get("stopId");
    const date = request.nextUrl.searchParams.get("date");

    let rows;
    if (stopId) {
      rows = db.select().from(meetingPoints).where(eq(meetingPoints.stopId, stopId)).all();
    } else if (date) {
      rows = db.select().from(meetingPoints).where(eq(meetingPoints.date, date)).all();
    } else {
      rows = db.select().from(meetingPoints).all();
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/meeting-points error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting points" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { name, address, time, date, stopId, notes } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    // Verify stop exists if provided
    if (stopId) {
      const stop = db.select().from(stops).where(eq(stops.id, stopId)).get();
      if (!stop) {
        return NextResponse.json(
          { error: "Stop not found" },
          { status: 404 }
        );
      }
    }

    const timestamp = now();
    const newPoint = {
      id: generateId(),
      stopId: stopId || null,
      name,
      address: address || null,
      lat: null,
      lng: null,
      time: time || null,
      date: date || null,
      notes: notes || null,
      addedBy: session?.travelerName || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(meetingPoints).values(newPoint).run();

    logActivity(
      "created",
      "meeting_point",
      newPoint.id,
      `${session?.travelerName || "Unknown"} set meeting point: ${name}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json(newPoint, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/meeting-points error:", error);
    return NextResponse.json(
      { error: "Failed to create meeting point" },
      { status: 500 }
    );
  }
}
