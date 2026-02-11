"use client";

import { useMemo, useState } from "react";
import { Handshake, ArrowRight, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Expense, ExpenseSplit, Traveler } from "@/lib/schema";

interface SettlementCardProps {
  expenses: Expense[];
  splits: ExpenseSplit[];
  travelers: Traveler[];
  perPerson: Record<string, number>;
}

interface Balance {
  traveler: Traveler;
  paid: number;
  owes: number;
  net: number;
}

interface Transaction {
  from: Traveler;
  to: Traveler;
  amount: number;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function computeSettlements(
  expenses: Expense[],
  travelers: Traveler[],
  perPerson: Record<string, number>,
): { balances: Balance[]; txns: Transaction[] } {
  // For each traveler: total paid vs total share owed
  const balances: Balance[] = travelers.map((t) => {
    const paid = expenses
      .filter((e) => e.paidBy === t.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const owes = perPerson[t.id] ?? 0;
    return { traveler: t, paid, owes, net: paid - owes };
  });

  // Greedy algorithm: minimize number of transactions
  // Sort creditors descending, debtors ascending (most negative first)
  const debtors = balances
    .filter((b) => b.net < -0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.net - b.net);
  const creditors = balances
    .filter((b) => b.net > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.net - a.net);

  const txns: Transaction[] = [];
  let di = 0;
  let ci = 0;

  while (di < debtors.length && ci < creditors.length) {
    const debt = Math.abs(debtors[di].net);
    const credit = creditors[ci].net;
    const transfer = Math.min(debt, credit);

    if (transfer > 0.01) {
      txns.push({
        from: debtors[di].traveler,
        to: creditors[ci].traveler,
        amount: Math.round(transfer * 100) / 100,
      });
    }

    debtors[di].net += transfer;
    creditors[ci].net -= transfer;

    if (Math.abs(debtors[di].net) < 0.01) di++;
    if (creditors[ci].net < 0.01) ci++;
  }

  return { balances, txns };
}

export function SettlementCard({
  expenses,
  splits,
  travelers,
  perPerson,
}: SettlementCardProps) {
  const { balances, txns } = useMemo(
    () => computeSettlements(expenses, travelers, perPerson),
    [expenses, travelers, perPerson],
  );

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const allSettled = txns.length === 0;
  const hasExpenses = expenses.length > 0;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Handshake className="size-4 text-wc-teal" />
        <h2 className="text-sm font-semibold">Settlement</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Balances per traveler */}
        {hasExpenses && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Balances
            </p>
            <div className="grid gap-1.5">
              {balances.map((b) => {
                const isPositive = b.net > 0.01;
                const isNegative = b.net < -0.01;
                return (
                  <div
                    key={b.traveler.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: b.traveler.color }}
                    />
                    <span className="font-medium">{b.traveler.name}</span>
                    <span
                      className={cn(
                        "ml-auto tabular-nums font-semibold",
                        isPositive && "text-emerald-500",
                        isNegative && "text-destructive",
                        !isPositive && !isNegative && "text-muted-foreground",
                      )}
                    >
                      {isPositive ? "+" : ""}${fmt(Math.abs(b.net))}
                      {isNegative && (
                        <span className="text-[10px] font-normal text-muted-foreground ml-1">
                          owes
                        </span>
                      )}
                      {isPositive && (
                        <span className="text-[10px] font-normal text-muted-foreground ml-1">
                          owed
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Settlement transactions */}
        {allSettled ? (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>
              {hasExpenses ? "All settled!" : "No expenses yet."}
            </span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              To Settle
            </p>
            <div className="grid gap-2">
              {txns.map((txn, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                >
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: txn.from.color }}
                  />
                  <span className="font-medium">{txn.from.name}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground shrink-0 animate-pulse" />
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: txn.to.color }}
                  />
                  <span className="font-medium">{txn.to.name}</span>
                  <span className="ml-auto font-bold tabular-nums">
                    ${fmt(txn.amount)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(txn.amount.toFixed(2));
                      setCopiedIdx(i);
                      toast.success("Amount copied!");
                      setTimeout(() => setCopiedIdx(null), 1500);
                    }}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
                    title={`Copy $${fmt(txn.amount)}`}
                  >
                    {copiedIdx === i ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment app quick links */}
        {!allSettled && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground mb-1.5">Pay with</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Monzo", href: "https://monzo.me" },
                { label: "Revolut", href: "https://revolut.me" },
                { label: "PayPal", href: "https://paypal.me" },
                { label: "Wise", href: "https://wise.com" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                  <ExternalLink className="size-2.5" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
