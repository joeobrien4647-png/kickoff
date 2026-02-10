"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  Car,
  Bed,
  CalendarCheck,
  Banknote,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LOGISTICS_CATEGORIES } from "@/lib/constants";
import { ChecklistItem } from "@/components/checklist/checklist-item";
import { ChecklistItemForm } from "@/components/checklist/checklist-item-form";
import type { Logistics, Traveler } from "@/lib/schema";

type StatusFilter = "all" | "todo" | "in_progress" | "done";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  documents: FileText,
  transport: Car,
  accommodation: Bed,
  booking: CalendarCheck,
  money: Banknote,
  tech: Smartphone,
  other: MoreHorizontal,
};

interface ChecklistViewProps {
  items: Logistics[];
  travelers: Traveler[];
}

export function ChecklistView({ items, travelers }: ChecklistViewProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Logistics | null>(null);

  // Progress computation
  const doneCount = useMemo(() => items.filter((i) => i.status === "done").length, [items]);
  const totalCount = items.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Filter by status
  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((i) => i.status === statusFilter);
  }, [items, statusFilter]);

  // Group by category (preserve the order from LOGISTICS_CATEGORIES)
  const groupedItems = useMemo(() => {
    const groups = new Map<string, Logistics[]>();

    // Initialize in defined order
    for (const cat of LOGISTICS_CATEGORIES) {
      groups.set(cat.value, []);
    }

    // Sort: priority desc, then by due date asc (nulls last)
    const sorted = [...filteredItems].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

    for (const item of sorted) {
      const list = groups.get(item.category);
      if (list) {
        list.push(item);
      } else {
        // Fallback for unknown categories
        const otherList = groups.get("other") || [];
        otherList.push(item);
        groups.set("other", otherList);
      }
    }

    // Remove empty categories
    for (const [key, list] of groups) {
      if (list.length === 0) groups.delete(key);
    }

    return groups;
  }, [filteredItems]);

  // Category completion counts (from ALL items, not filtered)
  const categoryCompletion = useMemo(() => {
    const map = new Map<string, { done: number; total: number }>();
    for (const item of items) {
      const current = map.get(item.category) || { done: 0, total: 0 };
      current.total++;
      if (item.status === "done") current.done++;
      map.set(item.category, current);
    }
    return map;
  }, [items]);

  // Status filter counts
  const statusCounts = useMemo(() => {
    const counts = { all: items.length, todo: 0, in_progress: 0, done: 0 };
    for (const item of items) {
      if (item.status in counts) {
        counts[item.status as keyof typeof counts]++;
      }
    }
    return counts;
  }, [items]);

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await fetch(`/api/checklist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  }

  function handleEdit(item: Logistics) {
    setEditingItem(item);
    setFormOpen(true);
  }

  function handleAdd() {
    setEditingItem(null);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{doneCount}</span> of{" "}
            <span className="text-foreground font-semibold">{totalCount}</span> items
            sorted
          </span>
          <span className="text-sm font-medium text-wc-teal">{progressPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-wc-teal transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="todo">
              To Do
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {statusCounts.todo}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {statusCounts.in_progress}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="done">
              Done
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {statusCounts.done}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Category sections */}
      {groupedItems.size === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No items match this filter.</p>
          <p className="text-xs mt-1">Tap the + button to add a checklist item.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from(groupedItems.entries()).map(([cat, catItems]) => {
            const catMeta = LOGISTICS_CATEGORIES.find((c) => c.value === cat);
            const Icon = CATEGORY_ICONS[cat] || MoreHorizontal;
            const completion = categoryCompletion.get(cat);
            const isCollapsed = collapsedCategories.has(cat);

            return (
              <section key={cat} className="rounded-lg bg-muted/30 overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-muted/50 transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <Icon className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">
                    {catMeta?.label || cat}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {completion
                      ? `${completion.done}/${completion.total}`
                      : `0/${catItems.length}`}
                  </span>
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="px-2 pb-2 space-y-1.5">
                    {catItems.map((item) => (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Floating add button */}
      <Button
        onClick={handleAdd}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
      >
        <Plus className="size-5" />
      </Button>

      {/* Add/Edit form sheet */}
      <ChecklistItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        travelers={travelers}
      />
    </div>
  );
}
