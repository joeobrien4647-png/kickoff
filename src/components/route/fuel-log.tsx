"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Fuel, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { FuelLog } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------

interface FuelLogProps {
  logs: FuelLog[];
  currentUser: string;
}

function formatCurrency(n: number): string {
  return `$${n.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FuelLogTracker({ logs, currentUser }: FuelLogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [station, setStation] = useState("");
  const [gallons, setGallons] = useState("");
  const [pricePerGallon, setPricePerGallon] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Derived total
  const computedTotal =
    gallons && pricePerGallon
      ? Math.round(Number(gallons) * Number(pricePerGallon) * 100) / 100
      : 0;

  // Totals across all logs
  const totalGallons = logs.reduce((s, l) => s + l.gallons, 0);
  const totalCost = logs.reduce((s, l) => s + l.totalCost, 0);

  const resetForm = useCallback(() => {
    setStation("");
    setGallons("");
    setPricePerGallon("");
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gallons || !pricePerGallon || !date) {
      toast.error("Fill in gallons, price per gallon, and date");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/fuel-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallons, pricePerGallon, station, date }),
      });
      if (!res.ok) throw new Error("Failed to add fuel log");
      toast.success("Fill-up logged");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to add fill-up");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/fuel-logs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Fill-up removed");
      router.refresh();
    } catch {
      toast.error("Failed to delete fill-up");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Fuel className="size-5 text-wc-gold" />
            Fuel Log
          </CardTitle>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Plus className="size-3.5" />
                Add Fill-Up
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Log a Fill-Up</SheetTitle>
                <SheetDescription>
                  Record a gas station stop for the road trip.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Station Name</label>
                  <Input
                    placeholder="e.g. Shell, BP, Wawa"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Gallons</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="12.5"
                      value={gallons}
                      onChange={(e) => setGallons(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">$/Gallon</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="3.49"
                      value={pricePerGallon}
                      onChange={(e) => setPricePerGallon(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Live total */}
                {computedTotal > 0 && (
                  <div className="rounded-lg border bg-card/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-wc-gold">
                      {formatCurrency(computedTotal)}
                    </p>
                  </div>
                )}

                <SheetFooter>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? "Saving..." : "Log Fill-Up"}
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Gallons</p>
            <p className="text-lg font-bold text-wc-gold">
              {totalGallons.toFixed(1)}
            </p>
          </div>
          <div className="rounded-lg border bg-card/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="text-lg font-bold text-wc-coral">
              {formatCurrency(totalCost)}
            </p>
          </div>
        </div>

        {/* List */}
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No fill-ups logged yet. Hit the road and fill &apos;er up!
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-lg border bg-card/50 p-3"
              >
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {log.station || "Unknown Station"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(log.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{log.gallons.toFixed(1)} gal</span>
                    <span>&middot;</span>
                    <span>{formatCurrency(log.pricePerGallon)}/gal</span>
                    <span>&middot;</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(log.totalCost)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => handleDelete(log.id)}
                  disabled={deleting === log.id}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
