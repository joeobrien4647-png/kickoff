"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { today } from "@/lib/dates";
import type { Stop, JournalEntry } from "@/lib/schema";

interface AddJournalFormProps {
  stops: Stop[];
  currentUser: string;
  /** Pre-fill for editing an existing entry */
  entry?: JournalEntry;
  /** Controlled open state -- used when editing */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: () => void;
  /** Trigger element (e.g. a button) -- if omitted, renders floating FAB */
  children?: ReactNode;
}

export function AddJournalForm({
  stops,
  currentUser,
  entry,
  open: controlledOpen,
  onOpenChange,
  onSave,
  children,
}: AddJournalFormProps) {
  const router = useRouter();
  const isEditing = !!entry;
  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => onOpenChange?.(v)
    : setInternalOpen;

  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState(entry?.date ?? today());
  const [stopId, setStopId] = useState(entry?.stopId ?? "none");
  const [highlight, setHighlight] = useState(entry?.highlight ?? "");
  const [bestMeal, setBestMeal] = useState(entry?.bestMeal ?? "");
  const [funniestMoment, setFunniestMoment] = useState(
    entry?.funniestMoment ?? ""
  );
  const [rating, setRating] = useState(entry?.rating ?? 0);

  function resetForm() {
    setDate(today());
    setStopId("none");
    setHighlight("");
    setBestMeal("");
    setFunniestMoment("");
    setRating(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;

    setSubmitting(true);
    try {
      const payload = {
        date,
        stopId: stopId && stopId !== "none" ? stopId : undefined,
        highlight: highlight.trim() || undefined,
        bestMeal: bestMeal.trim() || undefined,
        funniestMoment: funniestMoment.trim() || undefined,
        rating: rating || undefined,
        addedBy: currentUser,
      };

      const url = isEditing ? `/api/journal/${entry.id}` : "/api/journal";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || `Failed to ${isEditing ? "update" : "save"} entry`
        );
      }

      toast.success(
        isEditing ? "Journal entry updated!" : "Journal entry saved!"
      );

      if (!isEditing) resetForm();
      setOpen(false);
      if (onSave) {
        onSave();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save entry"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating FAB — only when no children and not controlled */}
      {!children && !isControlled && (
        <Button
          onClick={() => setOpen(true)}
          size="icon-lg"
          className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
        >
          <Plus className="size-5" />
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        {/* Custom trigger element (e.g. "Add Today's Recap" button) */}
        {children && !isControlled ? (
          <SheetTrigger asChild>{children}</SheetTrigger>
        ) : null}

        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit Journal Entry" : "Day Recap"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update this day's recap."
                : "How was today? Capture the highlights."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isEditing}
              />
            </div>

            {/* Stop / City */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">City / Stop</label>
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a stop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No stop</SelectItem>
                  {stops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Highlight */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Highlight of the Day
              </label>
              <Textarea
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="What was the best thing about today?"
                rows={2}
              />
            </div>

            {/* Best Meal */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Best Meal</label>
              <Input
                value={bestMeal}
                onChange={(e) => setBestMeal(e.target.value)}
                placeholder="That burger from..."
              />
            </div>

            {/* Funniest Moment */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Funniest Moment</label>
              <Textarea
                value={funniestMoment}
                onChange={(e) => setFunniestMoment(e.target.value)}
                placeholder="When Jonny..."
                rows={2}
              />
            </div>

            {/* Star Rating Picker */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Day Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setRating(rating === starValue ? 0 : starValue)
                      }
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "size-7",
                          starValue <= rating
                            ? "fill-wc-gold text-wc-gold"
                            : "text-muted-foreground/30 hover:text-wc-gold/50"
                        )}
                      />
                    </button>
                  );
                })}
                {rating > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                  ? "Save Changes"
                  : "Save Recap"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
