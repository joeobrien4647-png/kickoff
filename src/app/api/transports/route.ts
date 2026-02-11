import { db } from "@/lib/db";
import { transports } from "@/lib/schema";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = db.select().from(transports).all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/transports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      fromCity,
      toCity,
      departDate,
      departTime,
      arriveTime,
      carrier,
      confirmationRef,
      cost,
      bookingUrl,
      notes,
    } = body;

    if (!type || !fromCity || !toCity || !departDate) {
      return NextResponse.json(
        { error: "type, fromCity, toCity, and departDate are required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const id = generateId();

    const newTransport = {
      id,
      type,
      fromCity,
      toCity,
      departDate,
      departTime: departTime || null,
      arriveTime: arriveTime || null,
      carrier: carrier || null,
      confirmationRef: confirmationRef || null,
      cost: cost != null ? Number(cost) : null,
      bookingUrl: bookingUrl || null,
      notes: notes || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(transports).values(newTransport).run();

    const session = await getSession();
    logActivity(
      "created",
      "transport",
      id,
      `${session?.travelerName || "Unknown"} added transport: ${type} from ${fromCity} to ${toCity}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json(newTransport, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/transports error:", error);
    return NextResponse.json(
      { error: "Failed to create transport" },
      { status: 500 }
    );
  }
}
