import { db } from "@/lib/db";
import { expenses, expenseSplits } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const paidBy = request.nextUrl.searchParams.get("paidBy");

    let rows = db.select().from(expenses).all();

    if (category) {
      rows = rows.filter((e) => e.category === category);
    }
    if (paidBy) {
      rows = rows.filter((e) => e.paidBy === paidBy);
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[API] GET /api/expenses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, amount, category, paidBy, date, stopId, notes, splits } = body;

    if (!description || amount == null || !category || !paidBy || !date) {
      return NextResponse.json(
        { error: "description, amount, category, paidBy, and date are required" },
        { status: 400 }
      );
    }

    const timestamp = now();
    const expenseId = generateId();

    const newExpense = {
      id: expenseId,
      description,
      amount: Number(amount),
      category,
      paidBy,
      date,
      stopId: stopId || null,
      notes: notes || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.insert(expenses).values(newExpense).run();

    // Insert splits
    if (Array.isArray(splits)) {
      for (const split of splits) {
        db.insert(expenseSplits)
          .values({
            id: generateId(),
            expenseId,
            travelerId: split.travelerId,
            share: Number(split.share),
            settled: false,
            createdAt: timestamp,
          })
          .run();
      }
    }

    // Return expense with splits
    const createdSplits = db
      .select()
      .from(expenseSplits)
      .where(eq(expenseSplits.expenseId, expenseId))
      .all();

    return NextResponse.json({ ...newExpense, splits: createdSplits }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/expenses error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
