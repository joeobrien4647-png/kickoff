"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  Shirt,
  Sparkles,
  Smartphone,
  Backpack,
  Flag,
  MoreHorizontal,
  PackageOpen,
  StickyNote,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PACKING_CATEGORIES } from "@/lib/constants";
import { PackingItemForm } from "@/components/packing/packing-item-form";
import type { PackingItem, Traveler } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Category icon mapping
// ---------------------------------------------------------------------------
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  documents: FileText,
  clothing: Shirt,
  toiletries: Sparkles,
  electronics: Smartphone,
  gear: Backpack,
  fan_gear: Flag,
  other: MoreHorizontal,
};

// ---------------------------------------------------------------------------
// SVG progress ring (same pattern as dashboard)
// ---------------------------------------------------------------------------
const RING_R = 15.9;
const RING_C = 2 * Math.PI * RING_R;

function ProgressRing({ pct }: { pct: number }) {
  const offset = RING_C * (1 - pct / 100);
  return (
    <svg viewBox="0 0 36 36" className="size-9 shrink-0" aria-hidden>
      <circle
        cx="18"
        cy="18"
        r={RING_R}
        fill="none"
        className="stroke-muted"
        strokeWidth={3}
      />
      <circle
        cx="18"
        cy="18"
        r={RING_R}
        fill="none"
        className="stroke-wc-teal"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
      />
      <text
        x="18"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-[9px] font-semibold"
      >
        {pct}%
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Person filter type
// ---------------------------------------------------------------------------
type PersonFilter = "all" | "shared" | (string & {});

interface PackingViewProps {
  items: PackingItem[];
  travelers: Traveler[];
}

export function PackingView({ items, travelers }: PackingViewProps) {
  const router = useRouter();
  const [personFilter, setPersonFilter] = useState<PersonFilter>("all");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);

  // ---- Progress ----
  const checkedCount = useMemo(() => items.filter((i) => i.checked).length, [items]);
  const totalCount = items.length;
  const progressPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // ---- Person filter counts ----
  const personCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length, shared: 0 };
    for (const t of travelers) counts[t.id] = 0;
    for (const item of items) {
      if (!item.assignedTo) {
        counts.shared++;
      } else {
        counts[item.assignedTo] = (counts[item.assignedTo] || 0) + 1;
      }
    }
    return counts;
  }, [items, travelers]);

  // ---- Filter by person ----
  const filteredItems = useMemo(() => {
    if (personFilter === "all") return items;
    if (personFilter === "shared") return items.filter((i) => !i.assignedTo);
    return items.filter((i) => i.assignedTo === personFilter);
  }, [items, personFilter]);

  // ---- Group by category (preserve PACKING_CATEGORIES order) ----
  const groupedItems = useMemo(() => {
    const groups = new Map<string, PackingItem[]>();

    for (const cat of PACKING_CATEGORIES) {
      groups.set(cat.value, []);
    }

    const sorted = [...filteredItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    for (const item of sorted) {
      const list = groups.get(item.category);
      if (list) {
        list.push(item);
      } else {
        const otherList = groups.get("other") || [];
        otherList.push(item);
        groups.set("other", otherList);
      }
    }

    for (const [key, list] of groups) {
      if (list.length === 0) groups.delete(key);
    }

    return groups;
  }, [filteredItems]);

  // ---- Category completion counts (from ALL items, not filtered) ----
  const categoryCompletion = useMemo(() => {
    const map = new Map<string, { done: number; total: number }>();
    for (const item of items) {
      const current = map.get(item.category) || { done: 0, total: 0 };
      current.total++;
      if (item.checked) current.done++;
      map.set(item.category, current);
    }
    return map;
  }, [items]);

  // ---- Traveler lookup ----
  const travelerMap = useMemo(() => {
    const map = new Map<string, Traveler>();
    for (const t of travelers) map.set(t.id, t);
    return map;
  }, [travelers]);

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

  async function handleToggleChecked(item: PackingItem) {
    try {
      const res = await fetch(`/api/packing/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked: !item.checked }),
      });

      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch {
      toast.error("Failed to update item");
    }
  }

  function handleEdit(item: PackingItem) {
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
      <div className="flex items-center gap-3">
        <ProgressRing pct={progressPct} />
        <div>
          <span className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{checkedCount}</span> of{" "}
            <span className="text-foreground font-semibold">{totalCount}</span> packed
          </span>
        </div>
      </div>

      {/* Person filter tabs */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
        <Tabs
          value={personFilter}
          onValueChange={(v) => setPersonFilter(v as PersonFilter)}
        >
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {personCounts.all}
              </Badge>
            </TabsTrigger>
            {travelers.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.name}
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                  {personCounts[t.id] || 0}
                </Badge>
              </TabsTrigger>
            ))}
            <TabsTrigger value="shared">
              Shared
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {personCounts.shared}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Category sections */}
      {groupedItems.size === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <PackageOpen className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No items match your filters.</p>
          <p className="text-xs mt-1">Tap the + button to add a packing item.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from(groupedItems.entries()).map(([cat, catItems]) => {
            const catMeta = PACKING_CATEGORIES.find((c) => c.value === cat);
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
                  <div className="px-2 pb-2 space-y-1">
                    {catItems.map((item) => {
                      const traveler = item.assignedTo
                        ? travelerMap.get(item.assignedTo)
                        : null;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted/40 transition-colors cursor-pointer"
                          onClick={() => handleEdit(item)}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleChecked(item);
                            }}
                            className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label={item.checked ? "Unpack item" : "Pack item"}
                          >
                            <span
                              className={cn(
                                "size-5 rounded-md border-2 flex items-center justify-center transition-all",
                                item.checked
                                  ? "bg-wc-teal border-wc-teal"
                                  : "border-muted-foreground/40"
                              )}
                            >
                              {item.checked && (
                                <svg
                                  className="size-3 text-white"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M2 6l3 3 5-5" />
                                </svg>
                              )}
                            </span>
                          </button>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-sm font-medium leading-tight truncate",
                                  item.checked && "line-through text-muted-foreground"
                                )}
                              >
                                {item.name}
                              </span>
                              {item.quantity > 1 && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 shrink-0"
                                >
                                  x{item.quantity}
                                </Badge>
                              )}
                              {item.notes && (
                                <StickyNote className="size-3 text-muted-foreground shrink-0" />
                              )}
                            </div>

                            {/* Assigned badge */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {traveler ? (
                                <span
                                  className="text-[11px] font-medium"
                                  style={{ color: traveler.color }}
                                >
                                  {traveler.name}
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground">
                                  Shared
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
      <PackingItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        travelers={travelers}
      />
    </div>
  );
}
