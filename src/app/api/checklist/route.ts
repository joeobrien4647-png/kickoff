import { db } from "@/lib/db";
import { logistics } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const status = request.nextUrl.searchParams.get("status");

    const conditions = [];
    if (category) conditions.push(eq(logistics.category, category as typeof logistics.category.enumValues[number]));
    if (status) conditions.push(eq(logistics.status, status as typeof logistics.status.enumValues[number]));

    const rows =
      conditions.length > 0
        ? db.select().from(logistics).where(and(...conditions)).all()
        : db.select().from(logistics).all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/checklist error:", error);
    return NextResponse.json(
      { error: "Failed to fetch checklist items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { title, category, status, priority, dueDate, assignedTo, confirmationRef, url, cost, notes } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "title and category are required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const newItem = {
      id: generateId(),
      title,
      category,
      status: status || ("todo" as const),
      priority: priority != null ? Number(priority) : 1,
      dueDate: dueDate || null,
      confirmationRef: confirmationRef || null,
      url: url || null,
      cost: cost != null ? Number(cost) : null,
      assignedTo: assignedTo || null,
      notes: notes || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(logistics).values(newItem).run();

    logActivity("created", "checklist", newItem.id, `${session?.travelerName || "Unknown"} added checklist item: ${title}`, session?.travelerName || "Unknown");

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/checklist error:", error);
    return NextResponse.json(
      { error: "Failed to create checklist item" },
      { status: 500 }
    );
  }
}
