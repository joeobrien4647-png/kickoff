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
import { LOGISTICS_CATEGORIES } from "@/lib/constants";
import type { Logistics, Traveler } from "@/lib/schema";

interface ChecklistItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Logistics | null;
  travelers: Traveler[];
}

export function ChecklistItemForm({
  open,
  onOpenChange,
  item,
  travelers,
}: ChecklistItemFormProps) {
  const router = useRouter();
  const isEditing = item !== null;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("documents");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("1");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [confirmationRef, setConfirmationRef] = useState("");
  const [url, setUrl] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset form when item changes or sheet opens
  useEffect(() => {
    if (open) {
      if (item) {
        setTitle(item.title);
        setCategory(item.category);
        setStatus(item.status);
        setPriority(String(item.priority));
        setDueDate(item.dueDate ?? "");
        setAssignedTo(item.assignedTo ?? "");
        setConfirmationRef(item.confirmationRef ?? "");
        setUrl(item.url ?? "");
        setCost(item.cost != null ? String(item.cost) : "");
        setNotes(item.notes ?? "");
      } else {
        setTitle("");
        setCategory("documents");
        setStatus("todo");
        setPriority("1");
        setDueDate("");
        setAssignedTo("");
        setConfirmationRef("");
        setUrl("");
        setCost("");
        setNotes("");
      }
    }
  }, [open, item]);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        category,
        status,
        priority: Number(priority),
        dueDate: dueDate || null,
        assignedTo: assignedTo || null,
        confirmationRef: confirmationRef.trim() || null,
        url: url.trim() || null,
        cost: cost ? Number(cost) : null,
        notes: notes.trim() || null,
      };

      const endpoint = isEditing
        ? `/api/checklist/${item.id}`
        : "/api/checklist";
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

      toast.success(isEditing ? "Item updated" : "Item added");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!item) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/checklist/${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Item deleted");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Checklist Item" : "Add Checklist Item"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this logistics item"
              : "Add a pre-trip task to track"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="cl-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="cl-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Book flights to Boston"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOGISTICS_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Urgent</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="0">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cl-due" className="text-sm font-medium">
                Due date
              </label>
              <Input
                id="cl-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Assigned to */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Assigned to</label>
            <Select
              value={assignedTo || "__none__"}
              onValueChange={(v) => setAssignedTo(v === "__none__" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Anyone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Anyone</SelectItem>
                {travelers.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Confirmation ref */}
          <div className="space-y-1.5">
            <label htmlFor="cl-ref" className="text-sm font-medium">
              Confirmation reference
            </label>
            <Input
              id="cl-ref"
              value={confirmationRef}
              onChange={(e) => setConfirmationRef(e.target.value)}
              placeholder="e.g. ABC123"
            />
          </div>

          {/* URL + Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="cl-url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="cl-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cl-cost" className="text-sm font-medium">
                Cost ($)
              </label>
              <Input
                id="cl-cost"
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="cl-notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="cl-notes"
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
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add item"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
