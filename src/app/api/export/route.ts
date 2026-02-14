import { db } from "@/lib/db";
import {
  tripSettings,
  travelers,
  stops,
  accommodations,
  matches,
  itineraryItems,
  expenses,
  expenseSplits,
  packingItems,
  ideas,
  logistics,
  notes,
  predictions,
  activityLog,
  venueVotes,
  transports,
  decisions,
  photos,
  reservations,
  journalEntries,
  drivingAssignments,
  meetingPoints,
  fuelLogs,
  tollLogs,
  souvenirs,
  matchReviews,
  quickPolls,
} from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all tables in parallel-safe manner (synchronous better-sqlite3)
    const data = {
      tripSettings: db.select().from(tripSettings).all(),
      travelers: db.select().from(travelers).all(),
      stops: db.select().from(stops).all(),
      accommodations: db.select().from(accommodations).all(),
      matches: db.select().from(matches).all(),
      itineraryItems: db.select().from(itineraryItems).all(),
      expenses: db.select().from(expenses).all(),
      expenseSplits: db.select().from(expenseSplits).all(),
      packingItems: db.select().from(packingItems).all(),
      ideas: db.select().from(ideas).all(),
      logistics: db.select().from(logistics).all(),
      notes: db.select().from(notes).all(),
      predictions: db.select().from(predictions).all(),
      activityLog: db.select().from(activityLog).all(),
      venueVotes: db.select().from(venueVotes).all(),
      transports: db.select().from(transports).all(),
      decisions: db.select().from(decisions).all(),
      // Photos: metadata only, strip base64 data to keep export manageable
      photos: db
        .select()
        .from(photos)
        .all()
        .map(({ data: _base64, ...metadata }) => metadata),
      reservations: db.select().from(reservations).all(),
      journalEntries: db.select().from(journalEntries).all(),
      drivingAssignments: db.select().from(drivingAssignments).all(),
      meetingPoints: db.select().from(meetingPoints).all(),
      fuelLogs: db.select().from(fuelLogs).all(),
      tollLogs: db.select().from(tollLogs).all(),
      souvenirs: db.select().from(souvenirs).all(),
      matchReviews: db.select().from(matchReviews).all(),
      quickPolls: db.select().from(quickPolls).all(),
    };

    const exportPayload = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      data,
    };

    const json = JSON.stringify(exportPayload, null, 2);
    const today = new Date().toISOString().slice(0, 10);

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="kickoff-backup-${today}.json"`,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
