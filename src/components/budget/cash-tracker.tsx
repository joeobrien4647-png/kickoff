"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Banknote,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  Trash2,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDate, today } from "@/lib/dates";
import type { CashLog } from "@/lib/schema";

const TRAVELERS = ["Joe", "Jonny", "Greg"] as const;
const LOW_CASH_THRESHOLD = 20;
const QUICK_AMOUNTS = [20, 50, 100, 200] as const;

interface CashTrackerProps {
  currentUser: string;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CashTracker({ currentUser }: CashTrackerProps) {
  const router = useRouter();
  const [logs, setLogs] = useState<CashLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<"withdrawal" | "spend">("withdrawal");

  // Form fields
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [person, setPerson] = useState(currentUser);
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Fetch ──
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/cash");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLogs(data);
    } catch {
      toast.error("Failed to load cash logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Computed: cash on hand per person ──
  const cashOnHand = useMemo(() => {
    const balances: Record<string, number> = {};
    for (const name of TRAVELERS) {
      balances[name] = 0;
    }
    for (const log of logs) {
      if (log.type === "withdrawal") {
        balances[log.person] = (balances[log.person] ?? 0) + log.amount;
      } else {
        balances[log.person] = (balances[log.person] ?? 0) - log.amount;
      }
    }
    return balances;
  }, [logs]);

  // ── Open form ──
  function openWithdrawalForm() {
    setSheetType("withdrawal");
    setAmount("");
    setLocation("");
    setPerson(currentUser);
    setDate(today());
    setNotes("");
    setSheetOpen(true);
  }

  function openSpendForm() {
    setSheetType("spend");
    setAmount("");
    setLocation("");
    setPerson(currentUser);
    setDate(today());
    setNotes("");
    setSheetOpen(true);
  }

  function handleQuickAmount(value: number) {
    setAmount(String(value));
  }

  // ── Save ──
  async function handleSave() {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!person) {
      toast.error("Select a person");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        type: sheetType,
        amount: Number(amount),
        currency: "USD",
        location: location.trim() || null,
        person,
        date: date || today(),
        notes: notes.trim() || null,
      };

      const res = await fetch("/api/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success(
        sheetType === "withdrawal" ? "Withdrawal recorded" : "Cash spend recorded"
      );
      setSheetOpen(false);
      await fetchLogs();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/cash/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Entry deleted");
      await fetchLogs();
      router.refresh();
    } catch {
      toast.error("Failed to delete entry");
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          Loading cash tracker...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── A) Cash on Hand per Person ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Banknote className="size-4" />
            Cash on Hand
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {TRAVELERS.map((name) => {
              const balance = cashOnHand[name] ?? 0;
              const isLow = balance <= LOW_CASH_THRESHOLD;
              const isNegative = balance <= 0;

              return (
                <div
                  key={name}
                  className={cn(
                    "rounded-lg border p-3 text-center space-y-1.5",
                    isNegative
                      ? "border-destructive/40 bg-destructive/5"
                      : isLow
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-emerald-500/40 bg-emerald-500/5"
                  )}
                >
                  <Wallet
                    className={cn(
                      "size-5 mx-auto",
                      isNegative
                        ? "text-destructive"
                        : isLow
                          ? "text-amber-500"
                          : "text-emerald-500"
                    )}
                  />
                  <p className="text-xs font-medium text-muted-foreground">
                    {name}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold tabular-nums",
                      isNegative
                        ? "text-destructive"
                        : isLow
                          ? "text-amber-500"
                          : "text-emerald-500"
                    )}
                  >
                    ${fmt(balance)}
                  </p>
                  {isLow && balance > 0 && (
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <AlertTriangle className="size-3" />
                      <span className="text-[10px] font-medium">Low cash!</span>
                    </div>
                  )}
                  {isNegative && (
                    <div className="flex items-center justify-center gap-1 text-destructive">
                      <AlertTriangle className="size-3" />
                      <span className="text-[10px] font-medium">Low cash!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── B) Action Buttons ── */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={openWithdrawalForm}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <ArrowUpCircle className="size-4 mr-1.5" />
          ATM Withdrawal
        </Button>
        <Button
          onClick={openSpendForm}
          variant="destructive"
        >
          <ArrowDownCircle className="size-4 mr-1.5" />
          Cash Spent
        </Button>
      </div>

      {/* ── C) Transaction History ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Banknote className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No cash transactions yet.</p>
              <p className="text-xs mt-1">
                Record an ATM withdrawal or cash spend to get started.
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto -mx-1 px-1 space-y-1.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
                >
                  {log.type === "withdrawal" ? (
                    <ArrowUpCircle className="size-4 text-emerald-500 shrink-0" />
                  ) : (
                    <ArrowDownCircle className="size-4 text-destructive shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {log.type === "withdrawal"
                          ? log.location || "ATM"
                          : log.notes || "Cash spend"}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 shrink-0"
                      >
                        {log.person}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(log.date)}
                      {log.type === "withdrawal" && log.notes && (
                        <span> &middot; {log.notes}</span>
                      )}
                      {log.type === "spend" && log.location && (
                        <span> &middot; {log.location}</span>
                      )}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "text-sm font-bold tabular-nums shrink-0",
                      log.type === "withdrawal"
                        ? "text-emerald-500"
                        : "text-destructive"
                    )}
                  >
                    {log.type === "withdrawal" ? "+" : "-"}${fmt(log.amount)}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleDelete(log.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── D) Form Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetType === "withdrawal" ? "ATM Withdrawal" : "Cash Spent"}
            </SheetTitle>
            <SheetDescription>
              {sheetType === "withdrawal"
                ? "Record cash withdrawn from an ATM"
                : "Record a cash payment"}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 p-4">
            {/* Quick amount buttons (withdrawal only) */}
            {sheetType === "withdrawal" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Quick Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {QUICK_AMOUNTS.map((qa) => (
                    <Button
                      key={qa}
                      type="button"
                      variant={amount === String(qa) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuickAmount(qa)}
                    >
                      ${qa}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Amount */}
            <div className="space-y-1.5">
              <label htmlFor="cash-amount" className="text-sm font-medium">
                Amount ($) <span className="text-destructive">*</span>
              </label>
              <Input
                id="cash-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Location / Notes depending on type */}
            {sheetType === "withdrawal" ? (
              <div className="space-y-1.5">
                <label htmlFor="cash-location" className="text-sm font-medium">
                  ATM / Location
                </label>
                <Input
                  id="cash-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Chase ATM on 5th Ave"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="cash-notes" className="text-sm font-medium">
                  What for?
                </label>
                <Input
                  id="cash-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Street tacos"
                />
              </div>
            )}

            {/* Person + Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Who <span className="text-destructive">*</span>
                </label>
                <Select value={person} onValueChange={setPerson}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVELERS.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="cash-date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="cash-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Extra notes for withdrawal / location for spend */}
            {sheetType === "withdrawal" ? (
              <div className="space-y-1.5">
                <label htmlFor="cash-extra-notes" className="text-sm font-medium">
                  Notes
                </label>
                <Input
                  id="cash-extra-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any details..."
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="cash-spend-location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="cash-spend-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where did you pay?"
                />
              </div>
            )}
          </div>

          <SheetFooter>
            <Button
              onClick={handleSave}
              disabled={saving || !amount || !person}
            >
              {saving
                ? "Saving..."
                : sheetType === "withdrawal"
                  ? "Record Withdrawal"
                  : "Record Spend"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
