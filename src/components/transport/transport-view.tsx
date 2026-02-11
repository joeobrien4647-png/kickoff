"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plane,
  TrainFront,
  Car,
  Bus,
  Navigation,
  Plus,
  ArrowRight,
  Copy,
  ExternalLink,
  DollarSign,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/dates";
import { AddTransportForm } from "@/components/transport/add-transport-form";
import type { Transport } from "@/lib/schema";

// ── Type icons ───────────────────────────────────────────────────────
const TYPE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  flight: Plane,
  train: TrainFront,
  car_rental: Car,
  bus: Bus,
  rideshare: Navigation,
};

const TYPE_LABELS: Record<string, string> = {
  flight: "Flight",
  train: "Train",
  car_rental: "Car Rental",
  bus: "Bus",
  rideshare: "Rideshare",
};

const TYPE_COLORS: Record<string, string> = {
  flight: "text-sky-400",
  train: "text-emerald-400",
  car_rental: "text-amber-400",
  bus: "text-purple-400",
  rideshare: "text-wc-coral",
};

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ── Props ────────────────────────────────────────────────────────────
interface TransportViewProps {
  transports: Transport[];
  cities: string[];
}

// ── Component ────────────────────────────────────────────────────────
export function TransportView({ transports, cities }: TransportViewProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(
    null
  );

  // Group transports by departure date, sorted chronologically
  const groupedByDate = useMemo(() => {
    const sorted = [...transports].sort((a, b) => {
      const dateCmp = a.departDate.localeCompare(b.departDate);
      if (dateCmp !== 0) return dateCmp;
      return (a.departTime ?? "").localeCompare(b.departTime ?? "");
    });

    const groups = new Map<string, Transport[]>();
    for (const t of sorted) {
      const list = groups.get(t.departDate) ?? [];
      list.push(t);
      groups.set(t.departDate, list);
    }
    return groups;
  }, [transports]);

  // Totals
  const totalCost = useMemo(
    () => transports.reduce((sum, t) => sum + (t.cost ?? 0), 0),
    [transports]
  );

  function handleAdd() {
    setEditingTransport(null);
    setFormOpen(true);
  }

  function handleEdit(transport: Transport) {
    setEditingTransport(transport);
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/transports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Transport deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete transport");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="space-y-6">
      {/* ── Summary ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Navigation className="size-3.5" />
            <span className="text-xs font-medium">Total Legs</span>
          </div>
          <p className="text-xl font-bold">{transports.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="size-3.5" />
            <span className="text-xs font-medium">Total Cost</span>
          </div>
          <p className="text-xl font-bold">${fmt(totalCost)}</p>
        </div>
      </div>

      {/* ── Transport list grouped by date ── */}
      {groupedByDate.size === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No transport bookings yet.</p>
          <p className="text-xs mt-1">Tap the + button to add one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedByDate.entries()).map(([date, dateTransports]) => (
            <section key={date} className="space-y-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {dateTransports.map((transport) => {
                  const Icon = TYPE_ICONS[transport.type] || Navigation;
                  const color = TYPE_COLORS[transport.type] || "text-muted-foreground";

                  return (
                    <div
                      key={transport.id}
                      className="rounded-lg border bg-card overflow-hidden"
                    >
                      {/* ── Header: type + route ── */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div
                          className={cn(
                            "flex items-center justify-center size-9 rounded-lg bg-muted/50 shrink-0",
                            color
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold truncate">
                              {transport.fromCity}
                            </span>
                            <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm font-semibold truncate">
                              {transport.toCity}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {TYPE_LABELS[transport.type] ?? transport.type}
                            </Badge>
                            {transport.carrier && (
                              <span className="text-xs text-muted-foreground">
                                {transport.carrier}
                              </span>
                            )}
                          </div>
                        </div>
                        {transport.cost != null && transport.cost > 0 && (
                          <span className="text-sm font-bold tabular-nums shrink-0">
                            ${fmt(transport.cost)}
                          </span>
                        )}
                      </div>

                      {/* ── Details row ── */}
                      <div className="flex items-center gap-4 px-4 pb-3 text-xs text-muted-foreground flex-wrap">
                        {transport.departTime && (
                          <span>
                            Depart {formatTime(transport.departTime)}
                          </span>
                        )}
                        {transport.arriveTime && (
                          <span>
                            Arrive {formatTime(transport.arriveTime)}
                          </span>
                        )}
                        {transport.confirmationRef && (
                          <button
                            onClick={() =>
                              copyToClipboard(transport.confirmationRef!)
                            }
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                            title="Copy confirmation reference"
                          >
                            <Copy className="size-3" />
                            <span className="font-mono">
                              {transport.confirmationRef}
                            </span>
                          </button>
                        )}
                        {transport.bookingUrl && (
                          <a
                            href={transport.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="size-3" />
                            Booking
                          </a>
                        )}
                      </div>

                      {/* ── Notes + actions ── */}
                      {transport.notes && (
                        <p className="px-4 pb-2 text-xs text-muted-foreground">
                          {transport.notes}
                        </p>
                      )}

                      <div className="flex gap-2 px-4 pb-3 pt-1 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleEdit(transport)}
                        >
                          <Pencil className="size-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleDelete(transport.id)}
                        >
                          <Trash2 className="size-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
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
      <AddTransportForm
        open={formOpen}
        onOpenChange={setFormOpen}
        transport={editingTransport}
        cities={cities}
      />
    </div>
  );
}
