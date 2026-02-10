"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/sheet";
import { IDEA_CATEGORIES } from "@/lib/constants";
import type { Stop } from "@/lib/schema";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

interface AddPollFormProps {
  stops: Stop[];
  defaultStopId?: string;
}

export function AddPollForm({ stops, defaultStopId }: AddPollFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [stopId, setStopId] = useState(defaultStopId || "");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState(["", ""]);

  // Sync stopId when the active tab changes
  useEffect(() => {
    setStopId(defaultStopId || "");
  }, [defaultStopId]);

  function resetForm() {
    setStopId(defaultStopId || "");
    setQuestion("");
    setCategory("");
    setOptions(["", ""]);
  }

  function updateOption(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  }

  function addOption() {
    if (options.length >= MAX_OPTIONS) return;
    setOptions([...options, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= MIN_OPTIONS) return;
    setOptions(options.filter((_, i) => i !== index));
  }

  const filledOptions = options.filter((o) => o.trim());
  const canSubmit =
    stopId && question.trim() && category && filledOptions.length >= MIN_OPTIONS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const pollOptions = filledOptions.map((text) => ({
        text: text.trim(),
        votes: [],
      }));

      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopId,
          title: question.trim(),
          category,
          type: "poll",
          options: JSON.stringify(pollOptions),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create poll");
      }

      toast.success("Poll created!");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create poll"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating poll button — positioned above the add idea button */}
      <Button
        onClick={() => setOpen(true)}
        size="icon-lg"
        className="fixed bottom-18 right-4 z-40 rounded-full shadow-lg bg-wc-coral text-white hover:bg-wc-coral/90"
      >
        <BarChart3 className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create a Poll</SheetTitle>
            <SheetDescription>
              Ask the group a question and let everyone vote.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Stop */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Stop</label>
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a stop" />
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

            {/* Question */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question</label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Best sports bar for the match?"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a category" />
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

            {/* Options */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Options ({options.length}/{MAX_OPTIONS})
              </label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1"
                    />
                    {options.length > MIN_OPTIONS && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeOption(idx)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="size-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < MAX_OPTIONS && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="mt-1"
                >
                  <Plus className="size-3.5" />
                  Add Option
                </Button>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !canSubmit}
            >
              {submitting ? "Creating..." : "Create Poll"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
