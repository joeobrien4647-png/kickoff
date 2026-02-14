"use client";

import { useState } from "react";
import {
  Star,
  Pencil,
  Trash2,
  Share2,
  Sparkles,
  UtensilsCrossed,
  Laugh,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dates";
import { getCityIdentity } from "@/lib/constants";
import { AddJournalForm } from "@/components/journal/add-journal-form";
import type { JournalEntry, Stop } from "@/lib/schema";

interface JournalCardProps {
  entry: JournalEntry;
  city: string | null;
  dayNumber: number;
  stops: Stop[];
  currentUser: string;
  onMutate: () => void;
}

export function JournalCard({
  entry,
  city,
  dayNumber,
  stops,
  currentUser,
  onMutate,
}: JournalCardProps) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const identity = city ? getCityIdentity(city) : null;

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-reset after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/journal/${entry.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Journal entry deleted");
      onMutate();
    } catch {
      toast.error("Failed to delete journal entry");
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  }

  function handleShare() {
    const stars = entry.rating
      ? Array.from({ length: entry.rating }, () => "\u2B50").join("")
      : "";
    const lines = [
      `\uD83D\uDCD6 Day ${dayNumber}${city ? ` \u2014 ${city}` : ""}`,
    ];
    if (entry.highlight) lines.push(`\u2B50 ${entry.highlight}`);
    if (entry.bestMeal) lines.push(`\uD83C\uDF7D\uFE0F ${entry.bestMeal}`);
    if (entry.funniestMoment) lines.push(`\uD83E\uDD23 ${entry.funniestMoment}`);
    if (entry.rating) lines.push(`${stars} (${entry.rating}/5)`);

    const text = lines.join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  return (
    <>
      <Card className="overflow-hidden py-0">
        {/* City-themed gradient header */}
        <div
          className={cn(
            "px-4 py-3 bg-gradient-to-r",
            identity?.gradient ?? "from-muted/12 via-transparent to-transparent"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">
                Day {dayNumber} &mdash; {formatDate(entry.date)}
              </h3>
              {city && (
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1 text-[10px] px-1.5 py-0",
                    identity?.bg,
                    identity?.color,
                    identity?.border
                  )}
                >
                  <MapPin className="size-2.5 mr-0.5" />
                  {city}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setEditing(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleDelete}
                disabled={loading}
                className={cn(
                  "transition-colors",
                  confirmDelete
                    ? "text-destructive hover:text-destructive"
                    : "text-muted-foreground hover:text-destructive/70"
                )}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="px-4 py-3 space-y-2.5">
          {/* Highlight */}
          {entry.highlight && (
            <div className="flex gap-2">
              <Sparkles className="size-4 text-wc-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Highlight of the Day
                </p>
                <p className="text-sm">{entry.highlight}</p>
              </div>
            </div>
          )}

          {/* Best Meal */}
          {entry.bestMeal && (
            <div className="flex gap-2">
              <UtensilsCrossed className="size-4 text-wc-coral shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Best Meal
                </p>
                <p className="text-sm">{entry.bestMeal}</p>
              </div>
            </div>
          )}

          {/* Funniest Moment */}
          {entry.funniestMoment && (
            <div className="flex gap-2">
              <Laugh className="size-4 text-wc-teal shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Funniest Moment
                </p>
                <p className="text-sm">{entry.funniestMoment}</p>
              </div>
            </div>
          )}

          {/* Rating */}
          {entry.rating && (
            <div className="flex items-center gap-1.5 pt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < entry.rating!
                      ? "fill-wc-gold text-wc-gold"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                {entry.rating}/5
              </span>
            </div>
          )}

          {/* Empty state for entries with no content */}
          {!entry.highlight &&
            !entry.bestMeal &&
            !entry.funniestMoment &&
            !entry.rating && (
              <p className="text-xs text-muted-foreground italic">
                No details added yet.
              </p>
            )}

          {/* Added by */}
          {entry.addedBy && (
            <p className="text-[10px] text-muted-foreground/60 pt-1">
              Added by {entry.addedBy}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit form sheet */}
      {editing && (
        <AddJournalForm
          stops={stops}
          currentUser={currentUser}
          entry={entry}
          open={editing}
          onOpenChange={setEditing}
          onSave={() => {
            setEditing(false);
            onMutate();
          }}
        />
      )}
    </>
  );
}
