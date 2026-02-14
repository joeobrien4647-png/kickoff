import { db } from "@/lib/db";
import { fuelLogs } from "@/lib/schema";
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
      .from(fuelLogs)
      .orderBy(desc(fuelLogs.date))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/fuel-logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fuel logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stopId, gallons, pricePerGallon, station, odometer, date } = body;

    if (!gallons || !pricePerGallon || !date) {
      return NextResponse.json(
        { error: "gallons, pricePerGallon, and date are required" },
        { status: 400 }
      );
    }

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    const id = generateId();
    const totalCost = Math.round(Number(gallons) * Number(pricePerGallon) * 100) / 100;

    const newLog = {
      id,
      stopId: stopId || null,
      gallons: Number(gallons),
      pricePerGallon: Number(pricePerGallon),
      totalCost,
      station: station || null,
      odometer: odometer ? Number(odometer) : null,
      date,
      addedBy: actor,
      createdAt: now(),
    };

    db.insert(fuelLogs).values(newLog).run();

    logActivity(
      "created",
      "fuel_log",
      id,
      `${actor} logged ${gallons} gal at ${station || "unknown station"}`,
      actor
    );

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/fuel-logs error:", error);
    return NextResponse.json(
      { error: "Failed to create fuel log" },
      { status: 500 }
    );
  }
}
