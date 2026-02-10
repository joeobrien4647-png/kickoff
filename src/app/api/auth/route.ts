import { db } from "@/lib/db";
import { tripSettings, travelers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { buildSetCookieHeader } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripCode, travelerId, travelerName } = body;

    if (!tripCode) {
      return NextResponse.json(
        { error: "Trip code is required" },
        { status: 400 }
      );
    }

    // Validate trip code against the single-row tripSettings table
    const trip = db
      .select()
      .from(tripSettings)
      .where(eq(tripSettings.tripCode, tripCode))
      .get();

    if (!trip) {
      return NextResponse.json(
        { error: "Invalid trip code" },
        { status: 401 }
      );
    }

    // Step 1: Return travelers list
    if (!travelerId || !travelerName) {
      const allTravelers = db.select().from(travelers).all();
      return NextResponse.json({ travelers: allTravelers });
    }

    // Step 2: Set session cookie
    const session = { tripCode, travelerId, travelerName };
    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", buildSetCookieHeader(session));
    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
