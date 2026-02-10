import { db } from "@/lib/db";
import { packingItems } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const assignedTo = request.nextUrl.searchParams.get("assignedTo");

    const conditions = [];
    if (category) conditions.push(eq(packingItems.category, category as typeof packingItems.category.enumValues[number]));
    if (assignedTo) conditions.push(eq(packingItems.assignedTo, assignedTo));

    const rows =
      conditions.length > 0
        ? db.select().from(packingItems).where(and(...conditions)).all()
        : db.select().from(packingItems).all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/packing error:", error);
    return NextResponse.json(
      { error: "Failed to fetch packing items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { name, category, assignedTo, quantity, notes } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "name and category are required" },
        { status: 400 }
      );
    }

    const newItem = {
      id: generateId(),
      name,
      category,
      assignedTo: assignedTo || null,
      checked: false,
      quantity: quantity != null ? Number(quantity) : 1,
      notes: notes || null,
      createdAt: now(),
    };

    db.insert(packingItems).values(newItem).run();

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/packing error:", error);
    return NextResponse.json(
      { error: "Failed to create packing item" },
      { status: 500 }
    );
  }
}
