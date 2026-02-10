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
import { PACKING_CATEGORIES } from "@/lib/constants";
import type { PackingItem, Traveler } from "@/lib/schema";

interface PackingItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: PackingItem | null;
  travelers: Traveler[];
}

export function PackingItemForm({
  open,
  onOpenChange,
  item,
  travelers,
}: PackingItemFormProps) {
  const router = useRouter();
  const isEditing = item !== null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("clothing");
  const [quantity, setQuantity] = useState("1");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset form when item changes or sheet opens
  useEffect(() => {
    if (open) {
      if (item) {
        setName(item.name);
        setCategory(item.category);
        setQuantity(String(item.quantity));
        setAssignedTo(item.assignedTo ?? "");
        setNotes(item.notes ?? "");
      } else {
        setName("");
        setCategory("clothing");
        setQuantity("1");
        setAssignedTo("");
        setNotes("");
      }
    }
  }, [open, item]);

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        quantity: Math.max(1, Number(quantity) || 1),
        assignedTo: assignedTo || null,
        notes: notes.trim() || null,
      };

      const endpoint = isEditing
        ? `/api/packing/${item.id}`
        : "/api/packing";
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
      const res = await fetch(`/api/packing/${item.id}`, {
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
            {isEditing ? "Edit Packing Item" : "Add Packing Item"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this packing item"
              : "Add something to the packing list"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="pk-name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="pk-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Passport"
            />
          </div>

          {/* Category + Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACKING_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="pk-qty" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="pk-qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          {/* Assigned to */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Assigned to</label>
            <Select
              value={assignedTo || "__shared__"}
              onValueChange={(v) => setAssignedTo(v === "__shared__" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Shared" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__shared__">Shared</SelectItem>
                {travelers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="pk-notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="pk-notes"
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
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add item"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
