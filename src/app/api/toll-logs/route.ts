import { db } from "@/lib/db";
import { tollLogs } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(tollLogs)
      .orderBy(desc(tollLogs.date))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/toll-logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch toll logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromCity, toCity, amount, road, date } = body;

    if (!fromCity || !toCity || !amount || !date) {
      return NextResponse.json(
        { error: "fromCity, toCity, amount, and date are required" },
        { status: 400 }
      );
    }

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    const id = generateId();

    const newLog = {
      id,
      fromCity,
      toCity,
      amount: Number(amount),
      road: road || null,
      date,
      addedBy: actor,
      createdAt: now(),
    };

    db.insert(tollLogs).values(newLog).run();

    logActivity(
      "created",
      "toll_log",
      id,
      `${actor} logged toll: ${fromCity} to ${toCity} ($${Number(amount).toFixed(2)})`,
      actor
    );

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/toll-logs error:", error);
    return NextResponse.json(
      { error: "Failed to create toll log" },
      { status: 500 }
    );
  }
}
