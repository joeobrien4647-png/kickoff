"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DollarSign,
  Target,
  Plus,
  ChevronDown,
  ChevronRight,
  UtensilsCrossed,
  Car,
  Ticket,
  Bed,
  Beer,
  MapPin,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dates";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { AddExpenseForm } from "@/components/budget/add-expense-form";
import { SettlementCard } from "@/components/budget/settlement-card";
import { BudgetAnalytics } from "@/components/budget/budget-analytics";
import type { Expense, ExpenseSplit, Traveler, Stop } from "@/lib/schema";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  food: UtensilsCrossed,
  transport: Car,
  tickets: Ticket,
  accommodation: Bed,
  drinks: Beer,
  activities: MapPin,
  shopping: ShoppingBag,
  other: MoreHorizontal,
};

const BUDGET_PER_PERSON = 3000;

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface BudgetViewProps {
  expenses: Expense[];
  splits: ExpenseSplit[];
  travelers: Traveler[];
  stops: Stop[];
  totalSpent: number;
  perPerson: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

export function BudgetView({
  expenses,
  splits,
  travelers,
  stops,
  totalSpent,
  perPerson,
  categoryBreakdown,
}: BudgetViewProps) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("__all__");
  const [personFilter, setPersonFilter] = useState("__all__");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(new Set());

  const totalBudget = BUDGET_PER_PERSON * travelers.length;
  const remaining = totalBudget - totalSpent;

  // Filtered expense list
  const filteredExpenses = useMemo(() => {
    let list = [...expenses];
    if (categoryFilter !== "__all__") {
      list = list.filter((e) => e.category === categoryFilter);
    }
    if (personFilter !== "__all__") {
      list = list.filter((e) => e.paidBy === personFilter);
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, categoryFilter, personFilter]);

  // Group expenses by date
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, Expense[]>();
    for (const e of filteredExpenses) {
      const list = groups.get(e.date) ?? [];
      list.push(e);
      groups.set(e.date, list);
    }
    return groups;
  }, [filteredExpenses]);

  // Category breakdown sorted descending
  const sortedCategories = useMemo(() => {
    return EXPENSE_CATEGORIES
      .map((c) => ({ ...c, amount: categoryBreakdown[c.value] ?? 0 }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [categoryBreakdown]);

  const maxCategoryAmount = sortedCategories[0]?.amount ?? 1;

  function getTraveler(id: string) {
    return travelers.find((t) => t.id === id);
  }

  function toggleExpanded(id: string) {
    setExpandedExpenses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setFormOpen(true);
  }

  function handleAdd() {
    setEditingExpense(null);
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Expense deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete expense");
    }
  }

  return (
    <div className="space-y-6">
      {/* ── A) Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Spent */}
        <div className="rounded-lg border bg-card p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="size-3.5" />
            <span className="text-xs font-medium">Total Spent</span>
          </div>
          <p className="text-xl font-bold">${fmt(totalSpent)}</p>
        </div>

        {/* Per-person cards */}
        {travelers.map((t) => (
          <div key={t.id} className="rounded-lg border bg-card p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-xs font-medium text-muted-foreground">{t.name}</span>
            </div>
            <p className="text-xl font-bold">${fmt(perPerson[t.id] ?? 0)}</p>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  backgroundColor: t.color,
                  width: totalSpent > 0
                    ? `${((perPerson[t.id] ?? 0) / totalSpent) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>
        ))}

        {/* Budget target */}
        <div className="rounded-lg border bg-card p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Target className="size-3.5" />
            <span className="text-xs font-medium">Remaining</span>
          </div>
          <p className={cn("text-xl font-bold", remaining < 0 ? "text-destructive" : "text-wc-teal")}>
            ${fmt(remaining)}
          </p>
          <p className="text-[10px] text-muted-foreground">of ${fmt(totalBudget)} budget</p>
        </div>
      </div>

      {/* ── B) Category Breakdown ── */}
      {sortedCategories.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            By Category
          </h2>
          <div className="space-y-2">
            {sortedCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.value] || MoreHorizontal;
              const pct = (cat.amount / maxCategoryAmount) * 100;
              return (
                <div key={cat.value} className="flex items-center gap-3">
                  <Icon className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm w-24 shrink-0">{cat.label}</span>
                  <div className="flex-1 h-5 rounded bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded bg-wc-teal/70 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium tabular-nums w-20 text-right">
                    ${fmt(cat.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── B2) Analytics ── */}
      <BudgetAnalytics
        expenses={expenses}
        travelers={travelers}
        stops={stops}
        totalSpent={totalSpent}
        perPerson={perPerson}
        categoryBreakdown={categoryBreakdown}
      />

      {/* ── C) Who Owes Whom ── */}
      <SettlementCard
        expenses={expenses}
        splits={splits}
        travelers={travelers}
        perPerson={perPerson}
      />

      {/* ── D) Expense List ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Expenses
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All categories</SelectItem>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={personFilter} onValueChange={setPersonFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All people" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All people</SelectItem>
              {travelers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grouped list */}
        {groupedByDate.size === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No expenses yet.</p>
            <p className="text-xs mt-1">Tap the + button to add one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(groupedByDate.entries()).map(([date, dateExpenses]) => (
              <div key={date} className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground px-1">
                  {formatDate(date)}
                </p>
                <div className="space-y-1.5">
                  {dateExpenses.map((expense) => {
                    const payer = getTraveler(expense.paidBy);
                    const catMeta = EXPENSE_CATEGORIES.find((c) => c.value === expense.category);
                    const CatIcon = CATEGORY_ICONS[expense.category] || MoreHorizontal;
                    const isExpanded = expandedExpenses.has(expense.id);
                    const expenseSplitsForThis = splits.filter((s) => s.expenseId === expense.id);

                    return (
                      <div
                        key={expense.id}
                        className="rounded-lg border bg-card overflow-hidden"
                      >
                        <button
                          onClick={() => toggleExpanded(expense.id)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-muted/30 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">
                                {expense.description}
                              </span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                <CatIcon className="size-2.5 mr-0.5" />
                                {catMeta?.label ?? expense.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-muted-foreground">paid by</span>
                              {payer && (
                                <span className="flex items-center gap-1">
                                  <span
                                    className="size-1.5 rounded-full"
                                    style={{ backgroundColor: payer.color }}
                                  />
                                  <span className="text-xs font-medium">{payer.name}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-bold tabular-nums shrink-0">
                            ${fmt(expense.amount)}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 border-t space-y-2">
                            {/* Split breakdown */}
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">Split</p>
                              {expenseSplitsForThis.map((s) => {
                                const st = getTraveler(s.travelerId);
                                return (
                                  <div key={s.id} className="flex items-center gap-2 text-xs">
                                    {st && (
                                      <span
                                        className="size-1.5 rounded-full"
                                        style={{ backgroundColor: st.color }}
                                      />
                                    )}
                                    <span>{st?.name ?? "Unknown"}</span>
                                    <span className="ml-auto tabular-nums font-medium">
                                      ${fmt(s.share)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {expense.notes && (
                              <p className="text-xs text-muted-foreground">{expense.notes}</p>
                            )}

                            <div className="flex gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(expense);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="text-xs h-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(expense.id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── E) Floating add button ── */}
      <Button
        onClick={handleAdd}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
      >
        <Plus className="size-5" />
      </Button>

      {/* ── Add/Edit form sheet ── */}
      <AddExpenseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        expense={editingExpense}
        travelers={travelers}
        stops={stops}
      />
    </div>
  );
}
