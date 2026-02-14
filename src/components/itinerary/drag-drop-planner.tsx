"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GripVertical,
  Plane,
  Car,
  Trophy,
  UtensilsCrossed,
  Camera,
  Zap,
  Moon,
  MoreHorizontal,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/dates";
import { toast } from "sonner";
import type { ItineraryItem } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DragDropPlannerProps {
  itineraryItems: ItineraryItem[];
  currentUser: string;
}

// ---------------------------------------------------------------------------
// Type styling (mirrors existing components)
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  string,
  { icon: typeof Trophy; label: string; accent: string; bg: string }
> = {
  travel: {
    icon: Plane,
    label: "Travel",
    accent: "text-wc-blue",
    bg: "bg-wc-blue/10 text-wc-blue border-wc-blue/20",
  },
  match: {
    icon: Trophy,
    label: "Match",
    accent: "text-wc-gold",
    bg: "bg-wc-gold/10 text-wc-gold border-wc-gold/20",
  },
  food: {
    icon: UtensilsCrossed,
    label: "Food",
    accent: "text-wc-coral",
    bg: "bg-wc-coral/10 text-wc-coral border-wc-coral/20",
  },
  sightseeing: {
    icon: Camera,
    label: "Sightseeing",
    accent: "text-wc-teal",
    bg: "bg-wc-teal/10 text-wc-teal border-wc-teal/20",
  },
  activity: {
    icon: Zap,
    label: "Activity",
    accent: "text-purple-400",
    bg: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  },
  rest: {
    icon: Moon,
    label: "Rest",
    accent: "text-muted-foreground",
    bg: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  other: {
    icon: MoreHorizontal,
    label: "Other",
    accent: "text-muted-foreground",
    bg: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.other;
}

function getIcon(item: ItineraryItem) {
  const config = getTypeConfig(item.type);
  if (item.type === "travel" && item.title.toLowerCase().includes("drive")) {
    return Car;
  }
  return config.icon;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DragDropPlanner({
  itineraryItems: initialItems,
  currentUser,
}: DragDropPlannerProps) {
  const router = useRouter();

  // Local ordered state for immediate visual feedback
  const [items, setItems] = useState(() =>
    [...initialItems].sort((a, b) => {
      if (a.startTime && b.startTime)
        return a.startTime.localeCompare(b.startTime);
      if (a.startTime && !b.startTime) return -1;
      if (!a.startTime && b.startTime) return 1;
      return a.sortOrder - b.sortOrder;
    }),
  );

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  // ---- Reorder logic ----

  const reorder = useCallback(
    (fromIdx: number, toIdx: number) => {
      if (fromIdx === toIdx) return;

      const reordered = [...items];
      const [moved] = reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, moved);
      setItems(reordered);

      // Persist new order
      const payload = reordered.map((item, i) => ({
        id: item.id,
        sortOrder: i,
      }));

      setIsSaving(true);
      fetch("/api/itinerary/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Reorder failed");
          toast.success("Order updated");
          router.refresh();
        })
        .catch(() => {
          toast.error("Failed to save new order");
          // Revert to original order on failure
          setItems(
            [...initialItems].sort((a, b) => a.sortOrder - b.sortOrder),
          );
        })
        .finally(() => setIsSaving(false));
    },
    [items, initialItems, router],
  );

  // ---- Drag handlers ----

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    // Store ref for ghost image
    dragNodeRef.current = e.currentTarget;
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropIndex(index);
  }

  function handleDragLeave() {
    setDropIndex(null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, toIndex: number) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex) {
      reorder(dragIndex, toIndex);
    }
    setDragIndex(null);
    setDropIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDropIndex(null);
  }

  // ---- Empty state ----

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No items to reorder for this day.
        </p>
      </div>
    );
  }

  // ---- Render ----

  return (
    <div className="space-y-2">
      {/* Hint */}
      <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
        <GripVertical className="size-3" />
        Drag to reorder
      </p>

      {/* Draggable list */}
      <div className="space-y-1.5">
        {items.map((item, index) => {
          const config = getTypeConfig(item.type);
          const Icon = getIcon(item);
          const isDragging = dragIndex === index;
          const isDropTarget = dropIndex === index;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "transition-all duration-150",
                isDragging && "opacity-50",
                isDropTarget &&
                  dragIndex !== null &&
                  dragIndex !== index &&
                  "border-t-2 border-t-wc-teal",
              )}
            >
              <Card
                className={cn(
                  "flex flex-row items-center gap-3 p-3 py-3 cursor-grab active:cursor-grabbing select-none",
                  "hover:shadow-md transition-shadow",
                  isDragging && "shadow-lg ring-1 ring-wc-teal/30",
                  isSaving && "pointer-events-none",
                )}
              >
                {/* Drag handle */}
                <div className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  <GripVertical className="size-5" />
                </div>

                {/* Time */}
                <div className="shrink-0 w-16">
                  {item.startTime ? (
                    <span className="text-xs font-medium tabular-nums text-muted-foreground">
                      {formatTime(item.startTime)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50 uppercase">
                      Anytime
                    </span>
                  )}
                </div>

                {/* Icon + Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("shrink-0", config.accent)}>
                      <Icon className="size-4" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                  </div>

                  {item.location && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-muted-foreground/50 shrink-0" />
                      <span className="text-xs text-muted-foreground/70 truncate">
                        {item.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Type badge */}
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-[10px] px-1.5 py-0 capitalize",
                    config.bg,
                  )}
                >
                  {config.label}
                </Badge>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
