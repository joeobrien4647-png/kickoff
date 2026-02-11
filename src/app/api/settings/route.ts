import { db } from "@/lib/db";
import {
  tripSettings,
  travelers,
  stops,
  matches,
  itineraryItems,
  expenses,
  expenseSplits,
  packingItems,
  ideas,
  logistics,
  notes,
  accommodations,
  predictions,
  activityLog,
} from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      tripSettings: db.select().from(tripSettings).all(),
      travelers: db.select().from(travelers).all(),
      stops: db.select().from(stops).all(),
      matches: db.select().from(matches).all(),
      itineraryItems: db.select().from(itineraryItems).all(),
      expenses: db.select().from(expenses).all(),
      expenseSplits: db.select().from(expenseSplits).all(),
      packingItems: db.select().from(packingItems).all(),
      ideas: db.select().from(ideas).all(),
      logistics: db.select().from(logistics).all(),
      notes: db.select().from(notes).all(),
      accommodations: db.select().from(accommodations).all(),
      predictions: db.select().from(predictions).all(),
      activityLog: db.select().from(activityLog).all(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
