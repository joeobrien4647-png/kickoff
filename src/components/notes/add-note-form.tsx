"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
} from "@/components/ui/sheet";
import type { Stop, Note } from "@/lib/schema";

interface AddNoteFormProps {
  stops: Stop[];
  defaultStopId?: string;
  note?: Note;
  /** Controlled open state — used when editing */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: () => void;
}

export function AddNoteForm({
  stops,
  defaultStopId,
  note,
  open: controlledOpen,
  onOpenChange,
  onSave,
}: AddNoteFormProps) {
  const router = useRouter();
  const isEditing = !!note;
  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => onOpenChange?.(v)
    : setInternalOpen;

  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [stopId, setStopId] = useState(note?.stopId ?? defaultStopId ?? "");
  const [date, setDate] = useState(note?.date ?? "");

  // Sync stopId when the active tab changes (for add mode)
  useEffect(() => {
    if (!isEditing) {
      setStopId(defaultStopId || "");
    }
  }, [defaultStopId, isEditing]);

  function resetForm() {
    setTitle("");
    setContent("");
    setStopId(defaultStopId || "");
    setDate("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim() || undefined,
        content: content.trim(),
        stopId: stopId || undefined,
        date: date || undefined,
      };

      const url = isEditing ? `/api/notes/${note.id}` : "/api/notes";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "add"} note`);
      }

      toast.success(isEditing ? "Note updated!" : "Note added!");

      if (!isEditing) resetForm();
      setOpen(false);
      if (onSave) {
        onSave();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save note"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating add button — only in add mode */}
      {!isControlled && (
        <Button
          onClick={() => setOpen(true)}
          size="icon-lg"
          className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
        >
          <Plus className="size-5" />
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isEditing ? "Edit Note" : "Add a Note"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update this note."
                : "Jot down something for the trip."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional title"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to remember?"
                rows={4}
                required
              />
            </div>

            {/* Stop */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Stop</label>
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="General (no stop)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General (no stop)</SelectItem>
                  {stops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !content.trim()}
            >
              {submitting
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                  ? "Save Changes"
                  : "Add Note"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
