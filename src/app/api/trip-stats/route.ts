import { db } from "@/lib/db";
import { stops, expenses, photos, matches, fuelLogs, tollLogs } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total miles driven (sum of driveFromPrev.miles across all stops)
    const allStops = db.select().from(stops).all();
    let totalMiles = 0;
    const statesSet = new Set<string>();

    for (const stop of allStops) {
      statesSet.add(stop.state);
      if (stop.driveFromPrev) {
        try {
          const drive = JSON.parse(stop.driveFromPrev) as { miles?: number };
          totalMiles += drive.miles ?? 0;
        } catch {
          // skip malformed JSON
        }
      }
    }

    // States visited
    const statesCount = statesSet.size;

    // Total spent (sum of expenses)
    const expenseResult = db
      .select({ total: sql<number>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .get();
    const totalSpent = expenseResult?.total ?? 0;

    // Photos taken
    const photoResult = db
      .select({ count: sql<number>`count(*)` })
      .from(photos)
      .get();
    const photoCount = photoResult?.count ?? 0;

    // Matches attended
    const matchResult = db
      .select({ count: sql<number>`count(*)` })
      .from(matches)
      .where(eq(matches.attending, true))
      .get();
    const matchesAttended = matchResult?.count ?? 0;

    // Trip days — computed from first arrive to last depart
    let tripDays = 0;
    if (allStops.length > 0) {
      const sorted = [...allStops].sort((a, b) =>
        a.arriveDate.localeCompare(b.arriveDate)
      );
      const first = new Date(sorted[0].arriveDate + "T12:00:00");
      const last = new Date(sorted[sorted.length - 1].departDate + "T12:00:00");
      tripDays = Math.max(
        1,
        Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1
      );
    }

    // Fuel cost
    const fuelResult = db
      .select({ total: sql<number>`coalesce(sum(${fuelLogs.totalCost}), 0)` })
      .from(fuelLogs)
      .get();
    const fuelCost = fuelResult?.total ?? 0;

    // Toll cost
    const tollResult = db
      .select({ total: sql<number>`coalesce(sum(${tollLogs.amount}), 0)` })
      .from(tollLogs)
      .get();
    const tollCost = tollResult?.total ?? 0;

    return NextResponse.json({
      totalMiles: Math.round(totalMiles),
      statesCount,
      totalSpent: Math.round(totalSpent * 100) / 100,
      photoCount,
      matchesAttended,
      tripDays,
      fuelCost: Math.round(fuelCost * 100) / 100,
      tollCost: Math.round(tollCost * 100) / 100,
    });
  } catch (error) {
    console.error("[API] GET /api/trip-stats error:", error);
    return NextResponse.json(
      { error: "Failed to compute trip stats" },
      { status: 500 }
    );
  }
}
