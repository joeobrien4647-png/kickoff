"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Check,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AddAccommodationForm } from "@/components/accommodations/add-accommodation-form";
import type { Accommodation, Stop } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Type badge config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  host: { label: "Staying with friend", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  hotel: { label: "Hotel", color: "bg-purple-500/15 text-purple-700 dark:text-purple-400" },
  airbnb: { label: "Airbnb", color: "bg-pink-500/15 text-pink-700 dark:text-pink-400" },
  hostel: { label: "Hostel", color: "bg-orange-500/15 text-orange-700 dark:text-orange-400" },
  other: { label: "Other", color: "bg-gray-500/15 text-gray-700 dark:text-gray-400" },
};

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AccommodationsViewProps {
  accommodations: Accommodation[];
  stops: Stop[];
}

export function AccommodationsView({
  accommodations,
  stops,
}: AccommodationsViewProps) {
  const router = useRouter();
  const [stopFilter, setStopFilter] = useState("__all__");
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);

  // Filtered list
  const filtered = useMemo(() => {
    if (stopFilter === "__all__") return accommodations;
    return accommodations.filter((a) => a.stopId === stopFilter);
  }, [accommodations, stopFilter]);

  // Group by stop
  const groupedByStop = useMemo(() => {
    const groups = new Map<string, Accommodation[]>();
    // Maintain stop sort order
    for (const stop of stops) {
      const items = filtered.filter((a) => a.stopId === stop.id);
      if (items.length > 0) {
        groups.set(stop.id, items);
      }
    }
    return groups;
  }, [filtered, stops]);

  // Cost per stop
  const costByStop = useMemo(() => {
    const costs = new Map<string, number>();
    for (const [stopId, items] of groupedByStop) {
      const total = items.reduce((sum, a) => {
        return sum + (a.costPerNight ?? 0) * (a.nights ?? 0);
      }, 0);
      costs.set(stopId, total);
    }
    return costs;
  }, [groupedByStop]);

  // Grand total
  const grandTotal = useMemo(() => {
    return accommodations.reduce((sum, a) => {
      return sum + (a.costPerNight ?? 0) * (a.nights ?? 0);
    }, 0);
  }, [accommodations]);

  const confirmedCount = accommodations.filter((a) => a.confirmed).length;

  function getStop(id: string) {
    return stops.find((s) => s.id === id);
  }

  function handleEdit(accommodation: Accommodation) {
    setEditingAccommodation(accommodation);
    setFormOpen(true);
  }

  function handleAdd() {
    setEditingAccommodation(null);
    setFormOpen(true);
  }

  async function toggleConfirmed(accommodation: Accommodation) {
    try {
      const res = await fetch(`/api/accommodations/${accommodation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: !accommodation.confirmed }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(accommodation.confirmed ? "Marked as pending" : "Marked as confirmed");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="size-3.5" />
            <span className="text-xs font-medium">Total Cost</span>
          </div>
          <p className="text-xl font-bold">${fmt(grandTotal)}</p>
        </div>

        <div className="rounded-lg border bg-card p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Check className="size-3.5" />
            <span className="text-xs font-medium">Confirmed</span>
          </div>
          <p className="text-xl font-bold">
            {confirmedCount}
            <span className="text-sm font-normal text-muted-foreground">/{accommodations.length}</span>
          </p>
        </div>

        <div className="rounded-lg border bg-card p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5" />
            <span className="text-xs font-medium">Stops</span>
          </div>
          <p className="text-xl font-bold">{groupedByStop.size}</p>
        </div>
      </div>

      {/* ── Filter ── */}
      <div>
        <Select value={stopFilter} onValueChange={setStopFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by stop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All stops</SelectItem>
            {stops.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} — {s.city}, {s.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Grouped list ── */}
      {groupedByStop.size === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No accommodations yet.</p>
          <p className="text-xs mt-1">Tap the + button to add one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedByStop.entries()).map(([stopId, items]) => {
            const stop = getStop(stopId);
            const stopCost = costByStop.get(stopId) ?? 0;

            return (
              <section key={stopId} className="space-y-2">
                {/* City header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">
                      {stop?.city}, {stop?.state}
                    </h2>
                    <p className="text-xs text-muted-foreground">{stop?.name}</p>
                  </div>
                  {stopCost > 0 && (
                    <span className="text-sm font-medium tabular-nums text-muted-foreground">
                      ${fmt(stopCost)}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {items.map((acc) => {
                    const typeConfig = TYPE_CONFIG[acc.type] ?? TYPE_CONFIG.other;
                    const totalCost = (acc.costPerNight ?? 0) * (acc.nights ?? 0);

                    return (
                      <div
                        key={acc.id}
                        className="rounded-lg border bg-card overflow-hidden"
                      >
                        <button
                          onClick={() => handleEdit(acc)}
                          className="w-full text-left px-3 py-3 hover:bg-muted/30 transition-colors"
                        >
                          {/* Top row: name + type badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-medium truncate">{acc.name}</span>
                              <Badge
                                variant="secondary"
                                className={cn("text-[10px] px-1.5 py-0 shrink-0", typeConfig.color)}
                              >
                                {typeConfig.label}
                              </Badge>
                            </div>

                            {/* Confirmed status */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleConfirmed(acc);
                              }}
                              className={cn(
                                "shrink-0 flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-colors",
                                acc.confirmed
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                              )}
                            >
                              {acc.confirmed ? (
                                <Check className="size-2.5" />
                              ) : (
                                <Clock className="size-2.5" />
                              )}
                              {acc.confirmed ? "Confirmed" : "Pending"}
                            </button>
                          </div>

                          {/* Details row */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                            {acc.address && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="size-3" />
                                <span className="truncate max-w-[200px]">{acc.address}</span>
                              </span>
                            )}
                            {acc.contact && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="size-3" />
                                {acc.contact}
                              </span>
                            )}
                          </div>

                          {/* Cost row */}
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center gap-2">
                              {acc.costPerNight != null && acc.costPerNight > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  ${fmt(acc.costPerNight)}/night
                                  {acc.nights != null && acc.nights > 0 && (
                                    <> x {acc.nights} {acc.nights === 1 ? "night" : "nights"}</>
                                  )}
                                </span>
                              )}
                              {acc.bookingUrl && (
                                <a
                                  href={acc.bookingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-0.5 text-xs text-wc-teal hover:underline"
                                >
                                  <ExternalLink className="size-3" />
                                  Booking
                                </a>
                              )}
                            </div>
                            {totalCost > 0 && (
                              <span className="text-sm font-bold tabular-nums">
                                ${fmt(totalCost)}
                              </span>
                            )}
                          </div>

                          {/* Notes */}
                          {acc.notes && (
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                              {acc.notes}
                            </p>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ── Grand total ── */}
      {grandTotal > 0 && accommodations.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5">
          <span className="text-sm font-medium text-muted-foreground">Total accommodation cost</span>
          <span className="text-lg font-bold tabular-nums">${fmt(grandTotal)}</span>
        </div>
      )}

      {/* ── Floating add button ── */}
      <Button
        onClick={handleAdd}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
      >
        <Plus className="size-5" />
      </Button>

      {/* ── Add/Edit form sheet ── */}
      <AddAccommodationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        accommodation={editingAccommodation}
        stops={stops}
      />
    </div>
  );
}
