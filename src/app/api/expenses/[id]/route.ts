import { db } from "@/lib/db";
import { expenses, expenseSplits } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.select().from(expenses).where(eq(expenses.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Allowlist of updatable fields
    const allowedFields = [
      "description",
      "amount",
      "category",
      "paidBy",
      "date",
      "stopId",
      "notes",
      "receiptPhoto",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(expenses).set(updates).where(eq(expenses.id, id)).run();

    // If splits are provided, replace them
    if (Array.isArray(body.splits)) {
      // Delete old splits
      db.delete(expenseSplits).where(eq(expenseSplits.expenseId, id)).run();

      // Insert new splits
      const timestamp = now();
      for (const split of body.splits) {
        db.insert(expenseSplits)
          .values({
            id: generateId(),
            expenseId: id,
            travelerId: split.travelerId,
            share: Number(split.share),
            settled: false,
            createdAt: timestamp,
          })
          .run();
      }
    }

    const updated = db.select().from(expenses).where(eq(expenses.id, id)).get();
    const updatedSplits = db
      .select()
      .from(expenseSplits)
      .where(eq(expenseSplits.expenseId, id))
      .all();

    const session = await getSession();
    logActivity("updated", "expense", id, `${session?.travelerName || "Unknown"} updated an expense`, session?.travelerName || "Unknown");

    return NextResponse.json({ ...updated, splits: updatedSplits });
  } catch (error) {
    console.error("[API] PATCH /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = db.select().from(expenses).where(eq(expenses.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Splits cascade via FK onDelete
    db.delete(expenses).where(eq(expenses.id, id)).run();

    const session = await getSession();
    logActivity("deleted", "expense", id, `${session?.travelerName || "Unknown"} deleted an expense`, session?.travelerName || "Unknown");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
