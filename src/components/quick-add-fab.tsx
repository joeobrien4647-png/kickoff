"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  X,
  DollarSign,
  StickyNote,
  Lightbulb,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES, IDEA_CATEGORIES } from "@/lib/constants";
import { today } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Traveler, Stop } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActiveSheet = "expense" | "note" | "idea" | null;

interface QuickAction {
  key: ActiveSheet & string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const ACTIONS: QuickAction[] = [
  { key: "idea", label: "Idea", icon: Lightbulb, color: "bg-amber-500" },
  { key: "note", label: "Note", icon: StickyNote, color: "bg-blue-500" },
  { key: "expense", label: "Expense", icon: DollarSign, color: "bg-emerald-500" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuickAddFAB() {
  const router = useRouter();

  // Data from API
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // FAB state
  const [expanded, setExpanded] = useState(false);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  // Fetch travelers + stops once on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) return;
        const data = await res.json();
        setTravelers(data.travelers ?? []);
        setStops(data.stops ?? []);
        setDataLoaded(true);
      } catch {
        // Silently fail -- the forms can still render with empty selects
      }
    }
    load();
  }, []);

  const openSheet = useCallback((sheet: ActiveSheet) => {
    setActiveSheet(sheet);
    setExpanded(false);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  return (
    <>
      {/* ---- Backdrop ---- */}
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* ---- Radial action buttons ---- */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col-reverse items-end gap-3 md:hidden">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              type="button"
              onClick={() => openSheet(action.key)}
              className={cn(
                "flex items-center gap-2 rounded-full pr-4 pl-3 py-2 shadow-lg text-white text-sm font-medium transition-all duration-200",
                action.color,
                expanded
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-4 opacity-0 scale-75 pointer-events-none",
              )}
              style={{
                transitionDelay: expanded ? `${i * 50}ms` : "0ms",
              }}
              tabIndex={expanded ? 0 : -1}
              aria-hidden={!expanded}
            >
              <Icon className="size-4" />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* ---- Main FAB ---- */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          "fixed bottom-20 right-4 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 md:hidden",
          "bg-wc-teal text-white hover:bg-wc-teal/90 active:scale-95",
        )}
        aria-label={expanded ? "Close quick actions" : "Quick add"}
      >
        <Plus
          className={cn(
            "size-6 transition-transform duration-200",
            expanded && "rotate-45",
          )}
        />
      </button>

      {/* ---- Sheets ---- */}
      <QuickExpenseSheet
        open={activeSheet === "expense"}
        onOpenChange={(open) => !open && closeSheet()}
        travelers={travelers}
        stops={stops}
        onSuccess={() => {
          closeSheet();
          router.refresh();
        }}
      />

      <QuickNoteSheet
        open={activeSheet === "note"}
        onOpenChange={(open) => !open && closeSheet()}
        stops={stops}
        onSuccess={() => {
          closeSheet();
          router.refresh();
        }}
      />

      <QuickIdeaSheet
        open={activeSheet === "idea"}
        onOpenChange={(open) => !open && closeSheet()}
        stops={stops}
        onSuccess={() => {
          closeSheet();
          router.refresh();
        }}
      />
    </>
  );
}

// ===========================================================================
// Quick Expense Sheet
// ===========================================================================

interface QuickExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travelers: Traveler[];
  stops: Stop[];
  onSuccess: () => void;
}

function QuickExpenseSheet({
  open,
  onOpenChange,
  travelers,
  stops,
  onSuccess,
}: QuickExpenseSheetProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [paidBy, setPaidBy] = useState("");
  const [splitEqual, setSplitEqual] = useState(true);
  const [saving, setSaving] = useState(false);

  const amountRef = useRef<HTMLInputElement>(null);

  // Reset form & auto-focus when opened
  useEffect(() => {
    if (open) {
      setAmount("");
      setDescription("");
      setCategory("food");
      setPaidBy(travelers[0]?.id ?? "");
      setSplitEqual(true);
      setSaving(false);
      // Auto-focus after sheet animation
      setTimeout(() => amountRef.current?.focus(), 100);
    }
  }, [open, travelers]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!paidBy) {
      toast.error("Select who paid");
      return;
    }

    const splits = splitEqual
      ? travelers.map((t) => ({
          travelerId: t.id,
          share: Math.round((num / travelers.length) * 100) / 100,
        }))
      : travelers.map((t) => ({
          travelerId: t.id,
          share: t.id === paidBy ? num : 0,
        }));

    setSaving(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          amount: num,
          category,
          paidBy,
          date: today(),
          stopId: null,
          notes: null,
          splits,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add expense");
      }

      toast.success("Expense added!");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Quick Expense</SheetTitle>
          <SheetDescription>Log an expense to split.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Amount */}
          <div className="space-y-1.5">
            <label htmlFor="qa-exp-amount" className="text-sm font-medium">
              Amount ($) <span className="text-destructive">*</span>
            </label>
            <Input
              ref={amountRef}
              id="qa-exp-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="qa-exp-desc" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <Input
              id="qa-exp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Uber to stadium"
            />
          </div>

          {/* Category + Paid by */}
          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Paid by <span className="text-destructive">*</span>
              </label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Who paid?" />
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
          </div>

          {/* Split equally */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={splitEqual}
              onChange={(e) => setSplitEqual(e.target.checked)}
              className="accent-wc-teal"
            />
            Split equally among everyone
          </label>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={saving || !amount || !description.trim()}
          >
            {saving ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ===========================================================================
// Quick Note Sheet
// ===========================================================================

interface QuickNoteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stops: Stop[];
  onSuccess: () => void;
}

function QuickNoteSheet({
  open,
  onOpenChange,
  stops,
  onSuccess,
}: QuickNoteSheetProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setContent("");
      setTitle("");
      setSaving(false);
      setTimeout(() => contentRef.current?.focus(), 100);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Note content is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add note");
      }

      toast.success("Note added!");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Quick Note</SheetTitle>
          <SheetDescription>Jot down something for the trip.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Content */}
          <div className="space-y-1.5">
            <label htmlFor="qa-note-content" className="text-sm font-medium">
              Note <span className="text-destructive">*</span>
            </label>
            <Textarea
              ref={contentRef}
              id="qa-note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to remember?"
              rows={3}
            />
          </div>

          {/* Title (optional) */}
          <div className="space-y-1.5">
            <label htmlFor="qa-note-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="qa-note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional title"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={saving || !content.trim()}
          >
            {saving ? "Adding..." : "Add Note"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ===========================================================================
// Quick Idea Sheet
// ===========================================================================

interface QuickIdeaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stops: Stop[];
  onSuccess: () => void;
}

function QuickIdeaSheet({
  open,
  onOpenChange,
  stops,
  onSuccess,
}: QuickIdeaSheetProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [stopId, setStopId] = useState("");
  const [saving, setSaving] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory("");
      setStopId(stops[0]?.id ?? "");
      setSaving(false);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, stops]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!category) {
      toast.error("Pick a category");
      return;
    }
    if (!stopId) {
      toast.error("Pick a stop");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopId,
          title: title.trim(),
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add idea");
      }

      toast.success("Idea added!");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Quick Idea</SheetTitle>
          <SheetDescription>
            Suggest something to do on the trip.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="qa-idea-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              ref={titleRef}
              id="qa-idea-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fenway Park tour"
            />
          </div>

          {/* Category + Stop */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick one" />
                </SelectTrigger>
                <SelectContent>
                  {IDEA_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Stop <span className="text-destructive">*</span>
              </label>
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {stops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={saving || !title.trim() || !category || !stopId}
          >
            {saving ? "Adding..." : "Add Idea"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
