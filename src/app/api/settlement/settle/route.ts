import { db } from "@/lib/db";
import { expenses, expenseSplits, travelers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to } = body;

    if (!from || !to) {
      return NextResponse.json(
        { error: "from and to are required" },
        { status: 400 }
      );
    }

    // Resolve traveler names to IDs
    const allTravelers = db.select().from(travelers).all();
    const fromTraveler = allTravelers.find((t) => t.name === from);
    const toTraveler = allTravelers.find((t) => t.name === to);

    if (!fromTraveler || !toTraveler) {
      return NextResponse.json(
        { error: "Traveler not found" },
        { status: 404 }
      );
    }

    // Find all expenses paid by the creditor (to)
    const creditorExpenses = db
      .select()
      .from(expenses)
      .where(eq(expenses.paidBy, toTraveler.id))
      .all();

    const creditorExpenseIds = new Set(creditorExpenses.map((e) => e.id));

    // Find all unsettled splits where the debtor (from) owes on those expenses
    const allSplits = db
      .select()
      .from(expenseSplits)
      .where(eq(expenseSplits.travelerId, fromTraveler.id))
      .all();

    const splitsToSettle = allSplits.filter(
      (s) => creditorExpenseIds.has(s.expenseId) && !s.settled
    );

    // Mark them as settled
    let settledCount = 0;
    for (const split of splitsToSettle) {
      db.update(expenseSplits)
        .set({ settled: true })
        .where(eq(expenseSplits.id, split.id))
        .run();
      settledCount++;
    }

    return NextResponse.json({
      settled: settledCount,
      from: from,
      to: to,
    });
  } catch (error) {
    console.error("[API] POST /api/settlement/settle error:", error);
    return NextResponse.json(
      { error: "Failed to settle" },
      { status: 500 }
    );
  }
}
