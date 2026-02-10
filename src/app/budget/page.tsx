import { db } from "@/lib/db";
import { expenses, expenseSplits, travelers, stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { BudgetView } from "@/components/budget/budget-view";

export default async function BudgetPage() {
  const allExpenses = db.select().from(expenses).all();
  const allSplits = db.select().from(expenseSplits).all();
  const allTravelers = db.select().from(travelers).all();
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();

  // Total spent across all expenses
  const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Per-person: sum of each traveler's share from splits
  const perPerson: Record<string, number> = {};
  for (const t of allTravelers) {
    perPerson[t.id] = 0;
  }
  for (const s of allSplits) {
    perPerson[s.travelerId] = (perPerson[s.travelerId] ?? 0) + s.share;
  }

  // Category breakdown: sum of amounts per category
  const categoryBreakdown: Record<string, number> = {};
  for (const e of allExpenses) {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] ?? 0) + e.amount;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Budget</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track expenses, splits, and who owes whom.
        </p>
      </section>

      <BudgetView
        expenses={allExpenses}
        splits={allSplits}
        travelers={allTravelers}
        stops={allStops}
        totalSpent={totalSpent}
        perPerson={perPerson}
        categoryBreakdown={categoryBreakdown}
      />
    </div>
  );
}
