import { db } from "@/lib/db";
import { expenses, expenseSplits, travelers } from "@/lib/schema";
import { NextResponse } from "next/server";

interface TravelerSummary {
  name: string;
  emoji: string;
  color: string;
  totalPaid: number;
  totalOwes: number;
  balance: number;
  byCategory: Record<string, { paid: number; owes: number }>;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export async function GET() {
  try {
    const allExpenses = db.select().from(expenses).all();
    const allSplits = db.select().from(expenseSplits).all();
    const allTravelers = db.select().from(travelers).all();

    // --- Compute totals per traveler ---
    const summaries = new Map<string, TravelerSummary>();

    for (const t of allTravelers) {
      summaries.set(t.id, {
        name: t.name,
        emoji: t.emoji,
        color: t.color,
        totalPaid: 0,
        totalOwes: 0,
        balance: 0,
        byCategory: {},
      });
    }

    // Total each person PAID (sum of expenses where paidBy = their id)
    for (const e of allExpenses) {
      const s = summaries.get(e.paidBy);
      if (!s) continue;
      s.totalPaid += e.amount;

      // Per-category paid
      if (!s.byCategory[e.category]) {
        s.byCategory[e.category] = { paid: 0, owes: 0 };
      }
      s.byCategory[e.category].paid += e.amount;
    }

    // Total each person OWES (sum of their splits)
    // Also build a map of expenseId -> category for category breakdown
    const expenseCategoryMap = new Map(allExpenses.map((e) => [e.id, e.category]));

    for (const split of allSplits) {
      const s = summaries.get(split.travelerId);
      if (!s) continue;
      s.totalOwes += split.share;

      // Per-category owes
      const category = expenseCategoryMap.get(split.expenseId) ?? "other";
      if (!s.byCategory[category]) {
        s.byCategory[category] = { paid: 0, owes: 0 };
      }
      s.byCategory[category].owes += split.share;
    }

    // Compute net balance: paid - owes (positive = owed money, negative = owes money)
    for (const s of summaries.values()) {
      s.balance = Math.round((s.totalPaid - s.totalOwes) * 100) / 100;
      s.totalPaid = Math.round(s.totalPaid * 100) / 100;
      s.totalOwes = Math.round(s.totalOwes * 100) / 100;
    }

    // --- Simplified settlement: minimum transactions ---
    // Greedy: person who owes most pays person who is owed most, repeat
    const debtors: { id: string; name: string; amount: number }[] = [];
    const creditors: { id: string; name: string; amount: number }[] = [];

    for (const [id, s] of summaries) {
      if (s.balance < -0.01) {
        debtors.push({ id, name: s.name, amount: Math.abs(s.balance) });
      } else if (s.balance > 0.01) {
        creditors.push({ id, name: s.name, amount: s.balance });
      }
    }

    // Sort: biggest debtor first, biggest creditor first
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: Settlement[] = [];
    let di = 0;
    let ci = 0;

    while (di < debtors.length && ci < creditors.length) {
      const transfer = Math.min(debtors[di].amount, creditors[ci].amount);

      if (transfer > 0.01) {
        settlements.push({
          from: debtors[di].name,
          to: creditors[ci].name,
          amount: Math.round(transfer * 100) / 100,
        });
      }

      debtors[di].amount -= transfer;
      creditors[ci].amount -= transfer;

      if (debtors[di].amount < 0.01) di++;
      if (creditors[ci].amount < 0.01) ci++;
    }

    // Check if all splits between relevant parties are settled
    const settledStatus: Record<string, boolean> = {};
    for (const txn of settlements) {
      // Find the traveler IDs for from/to
      const fromId = allTravelers.find((t) => t.name === txn.from)?.id;
      const toId = allTravelers.find((t) => t.name === txn.to)?.id;

      if (!fromId || !toId) {
        settledStatus[`${txn.from}->${txn.to}`] = false;
        continue;
      }

      // A settlement is "settled" if all splits where:
      // - travelerId = fromId (they owe)
      // - the expense was paidBy toId (the creditor paid)
      // are marked as settled
      const relevantSplits = allSplits.filter((s) => {
        const expense = allExpenses.find((e) => e.id === s.expenseId);
        return s.travelerId === fromId && expense?.paidBy === toId;
      });

      const allMarkedSettled =
        relevantSplits.length > 0 && relevantSplits.every((s) => s.settled);
      settledStatus[`${txn.from}->${txn.to}`] = allMarkedSettled;
    }

    const totalGroupSpend = Math.round(
      allExpenses.reduce((sum, e) => sum + e.amount, 0) * 100
    ) / 100;

    const travelerCount = allTravelers.length || 1;
    const perPersonAverage = Math.round((totalGroupSpend / travelerCount) * 100) / 100;

    return NextResponse.json({
      travelers: allTravelers.map((t) => {
        const s = summaries.get(t.id)!;
        return {
          name: s.name,
          emoji: s.emoji,
          color: s.color,
          totalPaid: s.totalPaid,
          totalOwes: s.totalOwes,
          balance: s.balance,
          byCategory: s.byCategory,
        };
      }),
      settlements: settlements.map((txn) => ({
        ...txn,
        settled: settledStatus[`${txn.from}->${txn.to}`] ?? false,
      })),
      totalGroupSpend,
      perPersonAverage,
    });
  } catch (error) {
    console.error("[API] GET /api/settlement error:", error);
    return NextResponse.json(
      { error: "Failed to compute settlement" },
      { status: 500 }
    );
  }
}
