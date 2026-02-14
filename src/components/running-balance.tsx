import Link from "next/link";
import { Wallet, ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { expenses, expenseSplits, travelers } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Balance {
  name: string;
  color: string;
  net: number;
}

interface Settlement {
  fromName: string;
  fromColor: string;
  toName: string;
  toColor: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Greedy settlement: match the largest debtor with the largest creditor
 * until all debts are resolved. Minimizes the number of transactions.
 */
function computeSettlements(
  balances: Balance[],
): Settlement[] {
  const debtors = balances
    .filter((b) => b.net < -0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.net - b.net); // most negative first

  const creditors = balances
    .filter((b) => b.net > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.net - a.net); // largest credit first

  const txns: Settlement[] = [];
  let di = 0;
  let ci = 0;

  while (di < debtors.length && ci < creditors.length) {
    const debt = Math.abs(debtors[di].net);
    const credit = creditors[ci].net;
    const transfer = Math.min(debt, credit);

    if (transfer > 0.01) {
      txns.push({
        fromName: debtors[di].name,
        fromColor: debtors[di].color,
        toName: creditors[ci].name,
        toColor: creditors[ci].color,
        amount: Math.round(transfer * 100) / 100,
      });
    }

    debtors[di].net += transfer;
    creditors[ci].net -= transfer;

    if (Math.abs(debtors[di].net) < 0.01) di++;
    if (creditors[ci].net < 0.01) ci++;
  }

  return txns;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RunningBalance() {
  // Fetch all data directly from the database
  const allExpenses = db.select().from(expenses).all();
  const allSplits = db.select().from(expenseSplits).all();
  const allTravelers = db.select().from(travelers).all();

  const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const hasExpenses = allExpenses.length > 0;

  // Build per-person share totals from splits
  const perPerson: Record<string, number> = {};
  for (const t of allTravelers) {
    perPerson[t.id] = 0;
  }
  for (const s of allSplits) {
    perPerson[s.travelerId] = (perPerson[s.travelerId] ?? 0) + s.share;
  }

  // Compute net balance for each traveler
  const balances: Balance[] = allTravelers.map((t) => {
    const paid = allExpenses
      .filter((e) => e.paidBy === t.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const owes = perPerson[t.id] ?? 0;
    return { name: t.name, color: t.color, net: paid - owes };
  });

  const txns = computeSettlements(balances);
  const allSettled = txns.length === 0;

  return (
    <Card className="py-0 gap-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-wc-teal" />
          <h2 className="text-sm font-semibold">Running Balance</h2>
        </div>
        {hasExpenses && (
          <span className="text-xs text-muted-foreground tabular-nums">
            ${fmt(totalSpent)} spent
          </span>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Traveler balances */}
        {hasExpenses ? (
          <div className="grid gap-1.5">
            {balances.map((b) => {
              const isPositive = b.net > 0.01;
              const isNegative = b.net < -0.01;
              return (
                <div
                  key={b.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: b.color }}
                  />
                  <span className="font-medium">{b.name}</span>
                  <span
                    className={cn(
                      "ml-auto tabular-nums font-semibold text-xs",
                      isPositive && "text-emerald-500",
                      isNegative && "text-destructive",
                      !isPositive && !isNegative && "text-muted-foreground",
                    )}
                  >
                    {isPositive ? "+" : isNegative ? "-" : ""}${fmt(Math.abs(b.net))}
                    <span className="text-[10px] font-normal text-muted-foreground ml-1">
                      {isPositive ? "owed" : isNegative ? "owes" : "even"}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-2">
            No expenses logged yet.
          </p>
        )}

        {/* Settlement transactions */}
        {hasExpenses && (
          <>
            {allSettled ? (
              <div className="flex items-center justify-center gap-1.5 py-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span className="text-xs">All square!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  To Settle
                </p>
                <div className="grid gap-1.5">
                  {txns.map((txn, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 text-xs"
                    >
                      <span
                        className="size-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: txn.fromColor }}
                      />
                      <span className="font-medium">{txn.fromName}</span>
                      <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                      <span
                        className="size-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: txn.toColor }}
                      />
                      <span className="font-medium">{txn.toName}</span>
                      <span className="ml-auto font-bold tabular-nums">
                        ${fmt(txn.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Footer link */}
      <Link
        href="/budget"
        className="flex items-center justify-center gap-1 px-4 py-2.5 border-t text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
      >
        Full breakdown
        <ChevronRight className="size-3" />
      </Link>
    </Card>
  );
}
