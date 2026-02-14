"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HotelReviewProps {
  accommodation: {
    id: string;
    name: string;
    rating: number | null;
    review: string | null;
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HotelReview({ accommodation }: HotelReviewProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(accommodation.rating ?? 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [review, setReview] = useState(accommodation.review ?? "");
  const [saving, setSaving] = useState(false);

  const hasExistingReview = accommodation.rating != null;
  const displayRating = hoveredStar || rating;

  async function handleSave() {
    if (rating < 1 || rating > 5) {
      toast.error("Select a rating between 1 and 5");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/accommodations/${accommodation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          review: review.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save review");
      toast.success("Review saved");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Failed to save review");
    } finally {
      setSaving(false);
    }
  }

  // ── Read-only display ──
  if (hasExistingReview && !editing) {
    return (
      <div className="rounded-lg border bg-card p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Rating
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "size-4",
                    star <= (accommodation.rating ?? 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-3" />
          </Button>
        </div>
        {accommodation.review && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {accommodation.review}
          </p>
        )}
      </div>
    );
  }

  // ── Editable form ──
  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {hasExistingReview ? "Edit review" : "Rate your stay"}
        </span>
        {hasExistingReview && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setRating(accommodation.rating ?? 0);
              setReview(accommodation.review ?? "");
              setEditing(false);
            }}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Star selector */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "size-5 transition-colors",
                star <= displayRating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-1.5 text-xs text-muted-foreground">
            {rating}/5
          </span>
        )}
      </div>

      {/* Review textarea */}
      <Textarea
        placeholder="How was your stay?"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="min-h-[60px] text-sm"
      />

      {/* Save */}
      <Button
        size="sm"
        onClick={handleSave}
        disabled={saving || rating < 1}
        className="w-full"
      >
        {saving ? "Saving..." : "Save Review"}
      </Button>
    </div>
  );
}
