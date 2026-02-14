import { db } from "@/lib/db";
import { cashLogs } from "@/lib/schema";
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
      .from(cashLogs)
      .orderBy(desc(cashLogs.date))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/cash error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cash logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, currency, location, person, date, notes } = body;

    if (!type || amount == null || !person || !date) {
      return NextResponse.json(
        { error: "type, amount, person, and date are required" },
        { status: 400 }
      );
    }

    if (type !== "withdrawal" && type !== "spend") {
      return NextResponse.json(
        { error: "type must be 'withdrawal' or 'spend'" },
        { status: 400 }
      );
    }

    const id = generateId();

    const newLog = {
      id,
      type: type as "withdrawal" | "spend",
      amount: Number(amount),
      currency: currency || "USD",
      location: location || null,
      person,
      date,
      notes: notes || null,
      createdAt: now(),
    };

    db.insert(cashLogs).values(newLog).run();

    const session = await getSession();
    const actor = session?.travelerName || person;
    const description = type === "withdrawal"
      ? `${actor} withdrew $${Number(amount).toFixed(2)} at ${location || "ATM"}`
      : `${actor} spent $${Number(amount).toFixed(2)} cash${notes ? ` on ${notes}` : ""}`;

    logActivity("created", "cash_log", id, description, actor);

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/cash error:", error);
    return NextResponse.json(
      { error: "Failed to create cash log" },
      { status: 500 }
    );
  }
}
