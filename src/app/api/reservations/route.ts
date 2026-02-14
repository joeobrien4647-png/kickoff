import { db } from "@/lib/db";
import { reservations, stops } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const stopId = request.nextUrl.searchParams.get("stopId");

    const rows = stopId
      ? db.select().from(reservations).where(eq(reservations.stopId, stopId)).all()
      : db.select().from(reservations).all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/reservations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { name, type, date, time, partySize, confirmationRef, address, phone, url, notes, stopId, status } = body;

    if (!name || !type || !date) {
      return NextResponse.json(
        { error: "name, type, and date are required" },
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
    const newReservation = {
      id: generateId(),
      stopId: stopId || null,
      name,
      type,
      date,
      time: time || null,
      partySize: partySize ? Number(partySize) : null,
      confirmationRef: confirmationRef || null,
      address: address || null,
      phone: phone || null,
      url: url || null,
      notes: notes || null,
      status: status || "pending",
      addedBy: session?.travelerName || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(reservations).values(newReservation).run();

    logActivity(
      "created",
      "reservation",
      newReservation.id,
      `${session?.travelerName || "Unknown"} added reservation: ${name}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/reservations error:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}
