"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckSquare,
  Square,
  CheckCheck,
  ListChecks,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LOGISTICS_CATEGORIES } from "@/lib/constants";
import type { Logistics } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BulkChecklistBarProps {
  items: Logistics[];
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BulkChecklistBar({ items, onComplete }: BulkChecklistBarProps) {
  const router = useRouter();
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const selectedCount = selectedIds.size;

  // Group item ids by category for "select all in category" buttons
  const categorizedIds = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const item of items) {
      const list = map.get(item.category) || [];
      list.push(item.id);
      map.set(item.category, list);
    }
    return map;
  }, [items]);

  // ---- Selection helpers ----

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectCategory = useCallback(
    (category: string) => {
      const ids = categorizedIds.get(category) || [];
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of ids) next.add(id);
        return next;
      });
    },
    [categorizedIds]
  );

  // ---- Bulk mark done ----

  const markSelectedDone = useCallback(async () => {
    const targetIds = Array.from(selectedIds);
    if (targetIds.length === 0) return;

    setLoading(true);
    try {
      const results = await Promise.allSettled(
        targetIds.map((id) =>
          fetch(`/api/checklist/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "done" }),
          })
        )
      );

      const succeeded = results.filter(
        (r) => r.status === "fulfilled" && (r.value as Response).ok
      ).length;

      if (succeeded > 0) {
        toast.success(`Updated ${succeeded} item${succeeded !== 1 ? "s" : ""}`);
        router.refresh();
        onComplete();
      }

      if (succeeded < targetIds.length) {
        toast.error(
          `Failed to update ${targetIds.length - succeeded} item${targetIds.length - succeeded !== 1 ? "s" : ""}`
        );
      }

      setSelectedIds(new Set());
    } catch {
      toast.error("Bulk update failed");
    } finally {
      setLoading(false);
    }
  }, [selectedIds, router, onComplete]);

  // ---- Enter/exit ----

  function enterBulkMode() {
    setBulkMode(true);
    setSelectedIds(new Set());
  }

  function exitBulkMode() {
    setBulkMode(false);
    setSelectedIds(new Set());
  }

  // ---- Collapsed (toggle only) ----

  if (!bulkMode) {
    return (
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={enterBulkMode}
          className="text-xs gap-1.5 h-7"
        >
          <ListChecks className="size-3.5" />
          Bulk Edit
        </Button>
      </div>
    );
  }

  // ---- Expanded toolbar ----

  // Active categories that actually have items
  const activeCategories = Array.from(categorizedIds.entries())
    .map(([value, ids]) => {
      const meta = LOGISTICS_CATEGORIES.find((c) => c.value === value);
      return { value, label: meta?.label || value, count: ids.length };
    })
    .filter((c) => c.count > 0);

  return (
    <div
      className={cn(
        "sticky top-0 z-30 -mx-4 px-4 py-2 space-y-2",
        "bg-background/95 backdrop-blur-sm border-b border-border"
      )}
    >
      {/* Top row: count + actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="text-[11px] px-2 py-0.5 tabular-nums">
          {selectedCount} selected
        </Badge>

        {/* Select all / none */}
        <Button
          variant="outline"
          size="sm"
          onClick={selectAll}
          className="text-[11px] h-7 px-2 gap-1"
          disabled={loading}
        >
          <CheckSquare className="size-3" />
          All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={deselectAll}
          className="text-[11px] h-7 px-2 gap-1"
          disabled={loading}
        >
          <Square className="size-3" />
          None
        </Button>

        {/* Mark done */}
        <Button
          variant="default"
          size="sm"
          onClick={markSelectedDone}
          disabled={loading || selectedCount === 0}
          className="text-[11px] h-7 px-2.5 gap-1 ml-auto"
        >
          {loading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <CheckCheck className="size-3" />
          )}
          Mark All Selected as Done
        </Button>

        {/* Exit */}
        <Button
          variant="ghost"
          size="sm"
          onClick={exitBulkMode}
          className="h-7 w-7 p-0 shrink-0"
          disabled={loading}
        >
          <X className="size-3.5" />
        </Button>
      </div>

      {/* Category quick-select row */}
      {activeCategories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide shrink-0">
            Select:
          </span>
          {activeCategories.map((cat) => (
            <Button
              key={cat.value}
              variant="outline"
              size="sm"
              onClick={() => selectCategory(cat.value)}
              className="text-[10px] h-6 px-2 gap-1 shrink-0"
              disabled={loading}
            >
              {cat.label}
              <span className="text-muted-foreground">({cat.count})</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

// Export toggle helper for parent integration
export type { BulkChecklistBarProps };
