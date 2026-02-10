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
import { IDEA_CATEGORIES } from "@/lib/constants";
import type { Stop } from "@/lib/schema";

interface AddIdeaFormProps {
  stops: Stop[];
  defaultStopId?: string;
}

export function AddIdeaForm({ stops, defaultStopId }: AddIdeaFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [stopId, setStopId] = useState(defaultStopId || "");

  // Sync stopId when the active tab changes
  useEffect(() => {
    setStopId(defaultStopId || "");
  }, [defaultStopId]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [address, setAddress] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");

  function resetForm() {
    setStopId(defaultStopId || "");
    setTitle("");
    setCategory("");
    setDescription("");
    setUrl("");
    setAddress("");
    setEstimatedCost("");
    setEstimatedDuration("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stopId || !title || !category) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopId,
          title,
          category,
          description: description || undefined,
          url: url || undefined,
          address: address || undefined,
          estimatedCost: estimatedCost ? Number(estimatedCost) : undefined,
          estimatedDuration: estimatedDuration || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add idea");
      }

      toast.success("Idea added!");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add idea"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating add button */}
      <Button
        onClick={() => setOpen(true)}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
      >
        <Plus className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add an Idea</SheetTitle>
            <SheetDescription>
              Suggest something to do on the trip.
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

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fenway Park tour"
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

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is it? Why should we go?"
                rows={2}
              />
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL</label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            {/* Cost + Duration side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Est. Cost ($)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="15"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Duration</label>
                <Input
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="2 hours"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !stopId || !title || !category}
            >
              {submitting ? "Adding..." : "Add Idea"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
