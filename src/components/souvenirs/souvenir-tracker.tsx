"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Gift,
  Trash2,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Souvenir, Stop } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SouvenirTrackerProps {
  souvenirs: Souvenir[];
  stops: Stop[];
}

interface GroupedRecipient {
  name: string;
  items: Souvenir[];
  purchasedCount: number;
  totalEstimated: number;
  totalActual: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SouvenirTracker({ souvenirs, stops }: SouvenirTrackerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [collapsedRecipients, setCollapsedRecipients] = useState<Set<string>>(new Set());

  // Form state
  const [recipientName, setRecipientName] = useState("");
  const [item, setItem] = useState("");
  const [city, setCity] = useState("");
  const [cost, setCost] = useState("");

  // ---- Computed data ----

  const grouped = useMemo(() => {
    const map = new Map<string, Souvenir[]>();

    for (const s of souvenirs) {
      const existing = map.get(s.recipientName) || [];
      existing.push(s);
      map.set(s.recipientName, existing);
    }

    const result: GroupedRecipient[] = [];
    for (const [name, items] of map) {
      const purchasedCount = items.filter((i) => i.purchased).length;
      const totalEstimated = items.reduce((sum, i) => sum + (i.cost || 0), 0);
      const totalActual = items
        .filter((i) => i.purchased)
        .reduce((sum, i) => sum + (i.cost || 0), 0);

      result.push({ name, items, purchasedCount, totalEstimated, totalActual });
    }

    // Sort: unpurchased groups first, then alphabetically
    result.sort((a, b) => {
      const aComplete = a.purchasedCount === a.items.length;
      const bComplete = b.purchasedCount === b.items.length;
      if (aComplete !== bComplete) return aComplete ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [souvenirs]);

  const totalCount = souvenirs.length;
  const purchasedCount = souvenirs.filter((s) => s.purchased).length;
  const totalEstimated = souvenirs.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalActual = souvenirs
    .filter((s) => s.purchased)
    .reduce((sum, s) => sum + (s.cost || 0), 0);

  // ---- Helpers ----

  const stopCityMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of stops) map.set(s.id, s.city);
    return map;
  }, [stops]);

  function toggleRecipient(name: string) {
    setCollapsedRecipients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function resetForm() {
    setRecipientName("");
    setItem("");
    setCity("");
    setCost("");
  }

  // ---- API calls ----

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!recipientName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/souvenirs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          item: item.trim() || undefined,
          city: city.trim() || undefined,
          cost: cost ? Number(cost) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add souvenir");
      }

      toast.success(`Added souvenir for ${recipientName.trim()}!`);
      resetForm();
      setFormOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add souvenir");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePurchased(souvenir: Souvenir) {
    try {
      const res = await fetch(`/api/souvenirs/${souvenir.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchased: !souvenir.purchased }),
      });

      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch {
      toast.error("Failed to update souvenir");
    }
  }

  async function handleDelete(souvenirId: string) {
    try {
      const res = await fetch(`/api/souvenirs/${souvenirId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Souvenir removed");
      router.refresh();
    } catch {
      toast.error("Failed to delete souvenir");
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-wc-teal/10 flex items-center justify-center">
            <Gift className="size-5 text-wc-teal" />
          </div>
          <div>
            <p className="text-sm">
              <span className="font-semibold text-foreground">{purchasedCount}</span>
              <span className="text-muted-foreground"> of </span>
              <span className="font-semibold text-foreground">{totalCount}</span>
              <span className="text-muted-foreground"> purchased</span>
            </p>
            {totalEstimated > 0 && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <DollarSign className="size-3" />
                {totalActual > 0 && (
                  <span className="font-medium text-foreground">
                    ${totalActual.toFixed(0)} spent
                  </span>
                )}
                {totalActual > 0 && totalEstimated > totalActual && " / "}
                ${totalEstimated.toFixed(0)} budget
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grouped by recipient */}
      {grouped.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No souvenirs to track yet.</p>
          <p className="text-xs mt-1">Tap the + button to add someone.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map((group) => {
            const isCollapsed = collapsedRecipients.has(group.name);
            const allPurchased = group.purchasedCount === group.items.length;

            return (
              <Card key={group.name} className={cn("py-3", allPurchased && "opacity-70")}>
                <CardContent className="space-y-2">
                  {/* Recipient header */}
                  <button
                    onClick={() => toggleRecipient(group.name)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm font-semibold flex-1",
                      allPurchased && "line-through text-muted-foreground"
                    )}>
                      {group.name}
                    </span>
                    <Badge
                      variant={allPurchased ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {group.purchasedCount}/{group.items.length}
                    </Badge>
                  </button>

                  {/* Items */}
                  {!isCollapsed && (
                    <div className="space-y-1 ml-6">
                      {group.items.map((souvenir) => (
                        <div
                          key={souvenir.id}
                          className="flex items-center gap-3 py-1.5 group"
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => handleTogglePurchased(souvenir)}
                            className="shrink-0 flex items-center justify-center"
                            aria-label={souvenir.purchased ? "Mark unpurchased" : "Mark purchased"}
                          >
                            <span
                              className={cn(
                                "size-5 rounded-md border-2 flex items-center justify-center transition-all",
                                souvenir.purchased
                                  ? "bg-wc-teal border-wc-teal"
                                  : "border-muted-foreground/40"
                              )}
                            >
                              {souvenir.purchased && (
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

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <p className={cn(
                              "text-sm leading-tight",
                              souvenir.purchased && "line-through text-muted-foreground"
                            )}>
                              {souvenir.item || "TBD"}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {souvenir.city && (
                                <span className="text-[11px] text-muted-foreground">
                                  {souvenir.city}
                                </span>
                              )}
                              {souvenir.stopId && !souvenir.city && (
                                <span className="text-[11px] text-muted-foreground">
                                  {stopCityMap.get(souvenir.stopId) || ""}
                                </span>
                              )}
                              {souvenir.cost != null && souvenir.cost > 0 && (
                                <span className="text-[11px] text-muted-foreground">
                                  ${souvenir.cost.toFixed(0)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={() => handleDelete(souvenir.id)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Group cost summary (when expanded) */}
                  {!isCollapsed && group.totalEstimated > 0 && (
                    <p className="text-[11px] text-muted-foreground ml-6">
                      Budget: ${group.totalEstimated.toFixed(0)}
                      {group.totalActual > 0 && (
                        <span>
                          {" "} / Spent: ${group.totalActual.toFixed(0)}
                        </span>
                      )}
                    </p>
                  )}
                </CardContent>
              </Card>
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

      {/* Add souvenir sheet */}
      <Sheet open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) resetForm(); }}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Souvenir</SheetTitle>
            <SheetDescription>
              Track a gift or souvenir to pick up on the trip.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreate} className="space-y-4 p-4">
            {/* Recipient */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Who is it for?</label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Mom, Sarah, Dave"
                required
              />
            </div>

            {/* Item */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">What to get (optional)</label>
              <Input
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. Lucha libre mask, local coffee"
              />
            </div>

            {/* City + Cost side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">City (optional)</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mexico City"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Budget ($)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !recipientName.trim()}
            >
              {submitting ? "Adding..." : "Add Souvenir"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
