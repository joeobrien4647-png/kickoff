"use client";

import { useState } from "react";
import {
  Plane,
  Car,
  Trophy,
  UtensilsCrossed,
  Camera,
  Zap,
  Moon,
  MoreHorizontal,
  Plus,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { ItineraryItemForm } from "@/components/days/itinerary-item-form";
import type { ItineraryItem } from "@/lib/schema";

interface DayTimelineProps {
  date: string;
  stopId: string | null;
  items: ItineraryItem[];
}

const TYPE_CONFIG: Record<
  string,
  { icon: typeof Trophy; accent: string; dot: string; border: string; bg: string }
> = {
  travel: {
    icon: Plane,
    accent: "text-wc-blue",
    dot: "bg-wc-blue",
    border: "border-l-wc-blue/50",
    bg: "bg-wc-blue/5",
  },
  match: {
    icon: Trophy,
    accent: "text-wc-gold",
    dot: "bg-wc-gold",
    border: "border-l-wc-gold/50",
    bg: "bg-wc-gold/5",
  },
  food: {
    icon: UtensilsCrossed,
    accent: "text-wc-coral",
    dot: "bg-wc-coral",
    border: "border-l-wc-coral/50",
    bg: "bg-wc-coral/5",
  },
  sightseeing: {
    icon: Camera,
    accent: "text-wc-teal",
    dot: "bg-wc-teal",
    border: "border-l-wc-teal/50",
    bg: "bg-wc-teal/5",
  },
  activity: {
    icon: Zap,
    accent: "text-purple-400",
    dot: "bg-purple-400",
    border: "border-l-purple-400/50",
    bg: "bg-purple-400/5",
  },
  rest: {
    icon: Moon,
    accent: "text-muted-foreground",
    dot: "bg-muted-foreground",
    border: "border-l-muted-foreground/30",
    bg: "bg-muted/30",
  },
  other: {
    icon: MoreHorizontal,
    accent: "text-muted-foreground",
    dot: "bg-muted-foreground",
    border: "border-l-muted-foreground/30",
    bg: "bg-muted/30",
  },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.other;
}

export function DayTimeline({ date, stopId, items }: DayTimelineProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  // Sort: items with startTime first (ascending), then nulls last
  const sorted = [...items].sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime && !b.startTime) return -1;
    if (!a.startTime && b.startTime) return 1;
    return a.sortOrder - b.sortOrder;
  });

  function handleAdd() {
    setEditingItem(null);
    setFormOpen(true);
  }

  function handleEdit(item: ItineraryItem) {
    setEditingItem(item);
    setFormOpen(true);
  }

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Today&apos;s Plan
          </h2>
        </div>
        {sorted.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdd}
            className="text-xs gap-1 h-7"
          >
            <Plus className="size-3" />
            Add
          </Button>
        )}
      </div>

      {/* Timeline */}
      {sorted.length > 0 ? (
        <div className="relative ml-4">
          {/* Vertical line */}
          <div className="absolute left-0 top-3 bottom-3 w-px bg-border" />

          <div className="space-y-2">
            {sorted.map((item) => {
              const config = getTypeConfig(item.type);
              const Icon =
                item.type === "travel" && item.title.toLowerCase().includes("drive")
                  ? Car
                  : config.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleEdit(item)}
                  className={cn(
                    "group relative flex w-full gap-4 rounded-lg border-l-2 p-3 pl-7 text-left transition-colors hover:bg-accent/50",
                    config.border,
                    item.type === "match" && "border border-wc-gold/20 border-l-2",
                    item.type === "travel" && "border border-dashed border-border border-l-2"
                  )}
                >
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-[-5px] top-4 size-2.5 rounded-full ring-2 ring-background",
                      config.dot
                    )}
                  />

                  {/* Time column (left side) */}
                  {item.startTime ? (
                    <div className="shrink-0 w-16 pt-0.5">
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {formatTime(item.startTime)}
                      </span>
                    </div>
                  ) : (
                    <div className="shrink-0 w-16 pt-0.5">
                      <span className="text-[10px] text-muted-foreground/50 uppercase">
                        Anytime
                      </span>
                    </div>
                  )}

                  {/* Event card content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("shrink-0", config.accent)}>
                        <Icon className="size-4" />
                      </div>
                      <span className="text-sm font-medium truncate">{item.title}</span>
                      {!item.confirmed && (
                        <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wide shrink-0">
                          tentative
                        </span>
                      )}
                    </div>

                    {/* Time range + location */}
                    <div className="flex items-center gap-2 mt-1">
                      {item.startTime && item.endTime && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(item.startTime)} &ndash; {formatTime(item.endTime)}
                        </span>
                      )}
                      {item.location && (
                        <span className="text-xs text-muted-foreground/70 truncate">
                          {(item.startTime && item.endTime) ? "\u00b7 " : ""}
                          {item.location}
                        </span>
                      )}
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground/60 mt-1.5 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Cost */}
                  {item.cost != null && item.cost > 0 && (
                    <span className="text-xs font-medium text-muted-foreground tabular-nums shrink-0 pt-0.5">
                      ${item.cost}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-10 text-center">
          <CalendarDays className="size-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground mb-1">
            No plans yet for today
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4">
            Check out the ideas below or add something!
          </p>
          <Button variant="outline" size="sm" onClick={handleAdd} className="gap-1.5">
            <Plus className="size-3.5" />
            Add to plan
          </Button>
        </div>
      )}

      {/* Floating add button */}
      {sorted.length > 0 && (
        <div className="flex justify-center pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="gap-1.5 text-xs"
          >
            <Plus className="size-3.5" />
            Add to plan
          </Button>
        </div>
      )}

      {/* Form Sheet */}
      <ItineraryItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        date={date}
        stopId={stopId}
        item={editingItem}
      />
    </section>
  );
}
