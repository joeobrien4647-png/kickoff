"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckSquare, Square, CheckCheck, ListChecks, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BulkActionsProps = {
  items: Array<{ id: string; checked: boolean }>;
  entityType: "packing" | "checklist";
  onComplete: () => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BulkActions({ items, entityType, onComplete }: BulkActionsProps) {
  const router = useRouter();
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const selectedCount = selectedIds.size;
  const totalCount = items.length;
  const doneCount = items.filter((i) => i.checked).length;
  const pendingCount = totalCount - doneCount;

  // ---- Selection helpers ----

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ---- Bulk operations ----

  const bulkUpdate = useCallback(
    async (targetIds: string[]) => {
      if (targetIds.length === 0) return;

      setLoading(true);
      try {
        const endpoint =
          entityType === "packing" ? "/api/packing" : "/api/checklist";
        const payload =
          entityType === "packing"
            ? { checked: true }
            : { status: "done" };

        const results = await Promise.allSettled(
          targetIds.map((id) =>
            fetch(`${endpoint}/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
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
    },
    [entityType, router, onComplete]
  );

  const handleBulkAction = useCallback(() => {
    bulkUpdate(Array.from(selectedIds));
  }, [selectedIds, bulkUpdate]);

  // ---- Enter/exit bulk mode ----

  function enterBulkMode() {
    setBulkMode(true);
    setSelectedIds(new Set());
  }

  function exitBulkMode() {
    setBulkMode(false);
    setSelectedIds(new Set());
  }

  // ---- Render ----

  if (!bulkMode) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {doneCount} done
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {pendingCount} pending
          </Badge>
        </div>
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

  return (
    <div
      className={cn(
        "sticky top-0 z-30 -mx-4 px-4 py-2",
        "bg-background/95 backdrop-blur-sm border-b border-border",
        "flex items-center gap-2 flex-wrap"
      )}
    >
      {/* Count */}
      <span className="text-xs font-medium tabular-nums shrink-0">
        {selectedCount} selected
      </span>

      {/* Select / Deselect all */}
      <div className="flex items-center gap-1">
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
      </div>

      {/* Primary action */}
      <Button
        variant="default"
        size="sm"
        onClick={handleBulkAction}
        disabled={loading || selectedCount === 0}
        className="text-[11px] h-7 px-2.5 gap-1 ml-auto"
      >
        {loading ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <CheckCheck className="size-3" />
        )}
        {entityType === "packing" ? "Check Selected" : "Mark Done"}
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
  );
}

// ---------------------------------------------------------------------------
// Hook for parent components to integrate with bulk mode
// ---------------------------------------------------------------------------

export type { BulkActionsProps };
