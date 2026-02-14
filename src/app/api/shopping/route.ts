import { db } from "@/lib/db";
import { shoppingItems } from "@/lib/schema";
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
      ? db.select().from(shoppingItems).where(eq(shoppingItems.stopId, stopId)).all()
      : db.select().from(shoppingItems).all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/shopping error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { name, category, stopId, quantity } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const newItem = {
      id: generateId(),
      name,
      category: category || "other",
      stopId: stopId || null,
      quantity: quantity != null ? Number(quantity) : 1,
      checked: false,
      addedBy: session?.travelerName || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(shoppingItems).values(newItem).run();

    logActivity(
      "created",
      "shopping",
      newItem.id,
      `${session?.travelerName || "Unknown"} added shopping item: ${name}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/shopping error:", error);
    return NextResponse.json(
      { error: "Failed to create shopping item" },
      { status: 500 }
    );
  }
}
