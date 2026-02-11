import { db } from "@/lib/db";
import { accommodations } from "@/lib/schema";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = db.select().from(accommodations).all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/accommodations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, stopId, type, address, contact, costPerNight, nights, confirmed, bookingUrl, notes } = body;

    if (!name || !stopId || !type) {
      return NextResponse.json(
        { error: "name, stopId, and type are required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const id = generateId();

    const newAccommodation = {
      id,
      name,
      stopId,
      type,
      address: address || null,
      contact: contact || null,
      costPerNight: costPerNight != null ? Number(costPerNight) : null,
      nights: nights != null ? Number(nights) : null,
      confirmed: confirmed ?? false,
      bookingUrl: bookingUrl || null,
      notes: notes || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(accommodations).values(newAccommodation).run();

    const session = await getSession();
    logActivity("created", "accommodation", id, `${session?.travelerName || "Unknown"} added accommodation: ${name}`, session?.travelerName || "Unknown");

    return NextResponse.json(newAccommodation, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/accommodations error:", error);
    return NextResponse.json(
      { error: "Failed to create accommodation" },
      { status: 500 }
    );
  }
}
