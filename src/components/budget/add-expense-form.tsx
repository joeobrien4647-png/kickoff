"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { today } from "@/lib/dates";
import type { Expense, Traveler, Stop } from "@/lib/schema";

type SplitMode = "equal" | "custom";

interface AddExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  travelers: Traveler[];
  stops: Stop[];
}

export function AddExpenseForm({
  open,
  onOpenChange,
  expense,
  travelers,
  stops,
}: AddExpenseFormProps) {
  const router = useRouter();
  const isEditing = expense !== null;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [paidBy, setPaidBy] = useState("");
  const [date, setDate] = useState("");
  const [stopId, setStopId] = useState("__none__");
  const [splitMode, setSplitMode] = useState<SplitMode>("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset form when expense changes or sheet opens
  useEffect(() => {
    if (open) {
      if (expense) {
        setDescription(expense.description);
        setAmount(String(expense.amount));
        setCategory(expense.category);
        setPaidBy(expense.paidBy);
        setDate(expense.date);
        setStopId(expense.stopId ?? "__none__");
        setNotes(expense.notes ?? "");
        // Default to equal split on edit — user can change
        setSplitMode("equal");
        const equalShare = expense.amount / travelers.length;
        const splits: Record<string, string> = {};
        for (const t of travelers) {
          splits[t.id] = equalShare.toFixed(2);
        }
        setCustomSplits(splits);
      } else {
        setDescription("");
        setAmount("");
        setCategory("food");
        setPaidBy(travelers[0]?.id ?? "");
        setDate(today());
        setStopId("__none__");
        setSplitMode("equal");
        setCustomSplits({});
        setNotes("");
      }
    }
  }, [open, expense, travelers]);

  // Recompute equal splits when amount changes
  useEffect(() => {
    if (splitMode === "equal" && amount) {
      const num = Number(amount);
      if (!isNaN(num) && travelers.length > 0) {
        const share = num / travelers.length;
        const splits: Record<string, string> = {};
        for (const t of travelers) {
          splits[t.id] = share.toFixed(2);
        }
        setCustomSplits(splits);
      }
    }
  }, [amount, splitMode, travelers]);

  function buildSplits(): { travelerId: string; share: number }[] {
    if (splitMode === "equal") {
      const num = Number(amount);
      const share = num / travelers.length;
      return travelers.map((t) => ({
        travelerId: t.id,
        share: Math.round(share * 100) / 100,
      }));
    }
    return travelers.map((t) => ({
      travelerId: t.id,
      share: Math.round((Number(customSplits[t.id]) || 0) * 100) / 100,
    }));
  }

  async function handleSave() {
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!paidBy) {
      toast.error("Select who paid");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        description: description.trim(),
        amount: Number(amount),
        category,
        paidBy,
        date: date || today(),
        stopId: stopId === "__none__" ? null : stopId,
        notes: notes.trim() || null,
        splits: buildSplits(),
      };

      const endpoint = isEditing ? `/api/expenses/${expense.id}` : "/api/expenses";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success(isEditing ? "Expense updated" : "Expense added");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!expense) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${expense.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Expense deleted");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Expense" : "Add Expense"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update this expense" : "Log a new expense to split"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-4">
          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="exp-desc" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <Input
              id="exp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Uber to stadium"
            />
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="exp-amount" className="text-sm font-medium">
                Amount ($) <span className="text-destructive">*</span>
              </label>
              <Input
                id="exp-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Paid by + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Paid by <span className="text-destructive">*</span>
              </label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {travelers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="exp-date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="exp-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Stop */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Stop</label>
            <Select value={stopId} onValueChange={setStopId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">-- No specific stop --</SelectItem>
                {stops.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Split</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === "equal"}
                  onChange={() => setSplitMode("equal")}
                  className="accent-wc-teal"
                />
                Equal split
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === "custom"}
                  onChange={() => setSplitMode("custom")}
                  className="accent-wc-teal"
                />
                Custom split
              </label>
            </div>

            {splitMode === "custom" && (
              <div className="space-y-2 pt-1">
                {travelers.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-sm w-16">{t.name}</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={customSplits[t.id] ?? ""}
                      onChange={(e) =>
                        setCustomSplits((prev) => ({ ...prev, [t.id]: e.target.value }))
                      }
                      className="flex-1"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="exp-notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="exp-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
            />
          </div>
        </div>

        <SheetFooter>
          {isEditing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="size-4 mr-1.5" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !description.trim() || !amount}
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add expense"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
