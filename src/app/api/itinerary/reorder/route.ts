import { db } from "@/lib/db";
import { itineraryItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { now } from "@/lib/dates";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as {
      items: { id: string; sortOrder: number }[];
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required" },
        { status: 400 },
      );
    }

    const timestamp = now();

    // Run updates in a loop (better-sqlite3 is synchronous)
    for (const item of items) {
      db.update(itineraryItems)
        .set({ sortOrder: item.sortOrder, updatedAt: timestamp })
        .where(eq(itineraryItems.id, item.id))
        .run();
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[API] POST /api/itinerary/reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder itinerary items" },
      { status: 500 },
    );
  }
}
