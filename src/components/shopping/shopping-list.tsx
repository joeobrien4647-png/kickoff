"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShoppingCart,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Apple,
  Wine,
  Cookie,
  Package,
  MoreHorizontal,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Stop, ShoppingItem } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------
const SHOPPING_CATEGORIES = [
  { value: "groceries", label: "Groceries", icon: Apple },
  { value: "drinks", label: "Drinks", icon: Wine },
  { value: "snacks", label: "Snacks", icon: Cookie },
  { value: "supplies", label: "Supplies", icon: Package },
  { value: "other", label: "Other", icon: MoreHorizontal },
] as const;

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  groceries: Apple,
  drinks: Wine,
  snacks: Cookie,
  supplies: Package,
  other: MoreHorizontal,
};

const CATEGORY_LABEL: Record<string, string> = {
  groceries: "Groceries",
  drinks: "Drinks",
  snacks: "Snacks",
  supplies: "Supplies",
  other: "Other",
};

// ---------------------------------------------------------------------------
// Quick-add presets
// ---------------------------------------------------------------------------
const QUICK_ADDS = [
  { label: "Beer \u{1F37A}", name: "Beer", category: "drinks" },
  { label: "Water \u{1F4A7}", name: "Water", category: "drinks" },
  { label: "Snacks \u{1F37F}", name: "Snacks", category: "snacks" },
  { label: "Sunscreen \u{2600}\u{FE0F}", name: "Sunscreen", category: "supplies" },
  { label: "Ice \u{1F9CA}", name: "Ice", category: "supplies" },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface ShoppingListProps {
  stops: Stop[];
}

export function ShoppingList({ stops }: ShoppingListProps) {
  const router = useRouter();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("all");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // ---- Add-item form state ----
  const [formOpen, setFormOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("other");
  const [newStopId, setNewStopId] = useState("none");
  const [newQuantity, setNewQuantity] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  // ---- Fetch items ----
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/shopping");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Failed to load shopping items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ---- Stop lookup ----
  const stopMap = useMemo(() => {
    const map = new Map<string, Stop>();
    for (const s of stops) map.set(s.id, s);
    return map;
  }, [stops]);

  // ---- Filter by city ----
  const filteredItems = useMemo(() => {
    if (cityFilter === "all") return items;
    return items.filter((i) => i.stopId === cityFilter);
  }, [items, cityFilter]);

  // ---- Count unchecked items ----
  const uncheckedCount = useMemo(
    () => items.filter((i) => !i.checked).length,
    [items]
  );

  // ---- City filter counts ----
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const s of stops) counts[s.id] = 0;
    for (const item of items) {
      if (item.stopId) {
        counts[item.stopId] = (counts[item.stopId] || 0) + 1;
      }
    }
    return counts;
  }, [items, stops]);

  // ---- Group by category, checked items at bottom ----
  const groupedItems = useMemo(() => {
    const groups = new Map<string, ShoppingItem[]>();

    for (const cat of SHOPPING_CATEGORIES) {
      groups.set(cat.value, []);
    }

    const sorted = [...filteredItems].sort((a, b) => {
      // Unchecked first, then alphabetical
      if (a.checked !== b.checked) return a.checked ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

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

    // Remove empty categories
    for (const [key, list] of groups) {
      if (list.length === 0) groups.delete(key);
    }

    return groups;
  }, [filteredItems]);

  // ---- Toggle category collapse ----
  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  // ---- Toggle checked ----
  async function handleToggleChecked(item: ShoppingItem) {
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i))
    );

    try {
      const res = await fetch(`/api/shopping/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked: !item.checked }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch {
      // Revert on failure
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, checked: item.checked } : i))
      );
      toast.error("Failed to update item");
    }
  }

  // ---- Delete item ----
  async function handleDelete(item: ShoppingItem) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    try {
      const res = await fetch(`/api/shopping/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
      toast.success(`Removed ${item.name}`);
    } catch {
      fetchItems();
      toast.error("Failed to remove item");
    }
  }

  // ---- Add item ----
  async function handleAddItem(name: string, category: string, stopId?: string, quantity?: number) {
    if (!name.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          stopId: stopId && stopId !== "none" ? stopId : null,
          quantity: quantity || 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add");
      const created = await res.json();
      setItems((prev) => [...prev, created]);
      router.refresh();
      toast.success(`Added ${name.trim()}`);

      // Reset form
      setNewName("");
      setNewQuantity("1");
    } catch {
      toast.error("Failed to add item");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Quick add ----
  function handleQuickAdd(preset: (typeof QUICK_ADDS)[number]) {
    handleAddItem(preset.name, preset.category);
  }

  // ---- Clear checked ----
  async function handleClearChecked() {
    const checkedItems = items.filter((i) => i.checked);
    if (checkedItems.length === 0) return;

    // Optimistic: remove checked from UI
    setItems((prev) => prev.filter((i) => !i.checked));

    try {
      await Promise.all(
        checkedItems.map((item) =>
          fetch(`/api/shopping/${item.id}`, { method: "DELETE" })
        )
      );
      router.refresh();
      toast.success(`Cleared ${checkedItems.length} item${checkedItems.length > 1 ? "s" : ""}`);
    } catch {
      fetchItems();
      toast.error("Failed to clear checked items");
    }
  }

  // ---- Form submit handler ----
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleAddItem(newName, newCategory, newStopId, Number(newQuantity) || 1);
  }

  const checkedCount = items.filter((i) => i.checked).length;

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ShoppingCart className="size-8 mx-auto mb-2 opacity-50 animate-pulse" />
        <p className="text-sm">Loading shopping list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-5 text-wc-teal" />
          <span className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{uncheckedCount}</span>{" "}
            item{uncheckedCount !== 1 ? "s" : ""} remaining
          </span>
        </div>
        {checkedCount > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={handleClearChecked}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3" />
            Clear checked ({checkedCount})
          </Button>
        )}
      </div>

      {/* City filter tabs */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
        <Tabs
          value={cityFilter}
          onValueChange={setCityFilter}
        >
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {cityCounts.all}
              </Badge>
            </TabsTrigger>
            {stops.map((stop) => (
              <TabsTrigger key={stop.id} value={stop.id}>
                {stop.city}
                {(cityCounts[stop.id] || 0) > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                    {cityCounts[stop.id]}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Inline add form */}
      {formOpen ? (
        <form
          onSubmit={handleFormSubmit}
          className="rounded-lg border bg-muted/20 p-3 space-y-3"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Item name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              className="flex-1"
            />
            <Input
              type="number"
              min={1}
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="w-16"
              placeholder="Qty"
            />
          </div>
          <div className="flex gap-2">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {SHOPPING_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newStopId} onValueChange={setNewStopId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="City (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any city</SelectItem>
                {stops.map((stop) => (
                  <SelectItem key={stop.id} value={stop.id}>
                    {stop.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={!newName.trim() || submitting}
              className="bg-wc-teal text-white hover:bg-wc-teal/90"
            >
              {submitting ? "Adding..." : "Add Item"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFormOpen(true)}
          className="w-full border-dashed"
        >
          <Plus className="size-4" />
          Add Item
        </Button>
      )}

      {/* Quick-add buttons */}
      <div className="flex gap-2 flex-wrap">
        {QUICK_ADDS.map((preset) => (
          <Button
            key={preset.name}
            variant="secondary"
            size="xs"
            onClick={() => handleQuickAdd(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Category sections */}
      {groupedItems.size === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nothing on the list.</p>
          <p className="text-xs mt-1">Add items for your next store run!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from(groupedItems.entries()).map(([cat, catItems]) => {
            const Icon = CATEGORY_ICONS[cat] || MoreHorizontal;
            const label = CATEGORY_LABEL[cat] || cat;
            const isCollapsed = collapsedCategories.has(cat);
            const catUnchecked = catItems.filter((i) => !i.checked).length;

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
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {catUnchecked}/{catItems.length}
                  </span>
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="px-2 pb-2 space-y-1">
                    {catItems.map((item) => {
                      const stop = item.stopId ? stopMap.get(item.stopId) : null;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted/40 transition-colors group"
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => handleToggleChecked(item)}
                            className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label={item.checked ? "Uncheck item" : "Check item"}
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
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {stop && (
                                <span className="text-[11px] text-muted-foreground">
                                  {stop.city}
                                </span>
                              )}
                              {item.addedBy && (
                                <span className="text-[11px] text-muted-foreground">
                                  {stop ? " \u00B7 " : ""}
                                  {item.addedBy}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
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
        onClick={() => setFormOpen(true)}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
