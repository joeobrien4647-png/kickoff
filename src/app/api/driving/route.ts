import { db } from "@/lib/db";
import { drivingAssignments } from "@/lib/schema";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = db.select().from(drivingAssignments).all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/driving error:", error);
    return NextResponse.json(
      { error: "Failed to fetch driving assignments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromCity, toCity, driverName, estimatedHours, date, notes } = body;

    if (!fromCity || !toCity || !driverName) {
      return NextResponse.json(
        { error: "fromCity, toCity, and driverName are required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const id = generateId();

    const newAssignment = {
      id,
      fromCity,
      toCity,
      driverName,
      estimatedHours: estimatedHours != null ? Number(estimatedHours) : null,
      date: date || null,
      notes: notes || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(drivingAssignments).values(newAssignment).run();

    const session = await getSession();
    const actor = session?.travelerName || driverName;
    logActivity(
      "created",
      "driving_assignment",
      id,
      `${actor} assigned ${driverName} to drive ${fromCity} → ${toCity}`,
      actor
    );

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/driving error:", error);
    return NextResponse.json(
      { error: "Failed to create driving assignment" },
      { status: 500 }
    );
  }
}
