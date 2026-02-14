import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { souvenirs } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { logActivity } from "@/lib/activity";

export function GET() {
  try {
    const all = db.select().from(souvenirs).all();
    return NextResponse.json(all);
  } catch (error) {
    console.error("[API] GET /api/souvenirs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch souvenirs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { recipientName, item, city, cost } = body;

    if (!recipientName?.trim()) {
      return NextResponse.json(
        { error: "Recipient name is required" },
        { status: 400 }
      );
    }

    const id = generateId();
    const timestamp = now();

    db.insert(souvenirs)
      .values({
        id,
        recipientName: recipientName.trim(),
        item: item?.trim() || null,
        city: city?.trim() || null,
        stopId: null,
        purchased: false,
        cost: cost ? Number(cost) : null,
        addedBy: session.travelerName,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .run();

    logActivity(
      "created",
      "souvenir",
      id,
      `Added souvenir for ${recipientName.trim()}`,
      session.travelerName
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/souvenirs error:", error);
    return NextResponse.json(
      { error: "Failed to create souvenir" },
      { status: 500 }
    );
  }
}
