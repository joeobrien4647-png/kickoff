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
import { ITINERARY_TYPES } from "@/lib/constants";
import type { ItineraryItem } from "@/lib/schema";

interface ItineraryItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  stopId: string | null;
  item: ItineraryItem | null;
}

export function ItineraryItemForm({
  open,
  onOpenChange,
  date,
  stopId,
  item,
}: ItineraryItemFormProps) {
  const router = useRouter();
  const isEditing = item !== null;

  const [title, setTitle] = useState("");
  const [type, setType] = useState("activity");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset form when item changes or sheet opens
  useEffect(() => {
    if (open) {
      if (item) {
        setTitle(item.title);
        setType(item.type);
        setStartTime(item.startTime ?? "");
        setEndTime(item.endTime ?? "");
        setLocation(item.location ?? "");
        setCost(item.cost != null ? String(item.cost) : "");
        setNotes(item.notes ?? "");
        setConfirmed(item.confirmed);
      } else {
        setTitle("");
        setType("activity");
        setStartTime("");
        setEndTime("");
        setLocation("");
        setCost("");
        setNotes("");
        setConfirmed(false);
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
        type,
        date,
        stopId,
        startTime: startTime || null,
        endTime: endTime || null,
        location: location.trim() || null,
        cost: cost ? Number(cost) : null,
        notes: notes.trim() || null,
        confirmed,
      };

      const url = isEditing ? `/api/itinerary/${item.id}` : "/api/itinerary";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
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
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!item) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/itinerary/${item.id}`, {
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
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Item" : "Add Item"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this itinerary item"
              : "Add something to your day"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dinner at Eataly"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITINERARY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start time
              </label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="endTime" className="text-sm font-medium">
                End time
              </label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Times Square"
            />
          </div>

          {/* Cost */}
          <div className="space-y-1.5">
            <label htmlFor="cost" className="text-sm font-medium">
              Cost ($)
            </label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
            />
          </div>

          {/* Confirmed Toggle */}
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="size-4 rounded border-input accent-wc-teal"
            />
            <span className="text-sm font-medium">Confirmed</span>
          </label>
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
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add item"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
