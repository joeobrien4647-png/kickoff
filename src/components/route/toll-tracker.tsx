"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDollarSign, Plus, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { TollLog } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Pre-populated route segments
// ---------------------------------------------------------------------------

const ROUTE_SEGMENTS = [
  { from: "Boston", to: "NYC" },
  { from: "NYC", to: "Philly" },
  { from: "Philly", to: "DC" },
  { from: "DC", to: "Nashville" },
  { from: "Nashville", to: "Miami" },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

interface TollTrackerProps {
  logs: TollLog[];
  currentUser: string;
}

export function TollTracker({ logs, currentUser }: TollTrackerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [segment, setSegment] = useState("");
  const [amount, setAmount] = useState("");
  const [road, setRoad] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const totalTolls = logs.reduce((s, l) => s + l.amount, 0);

  function resetForm() {
    setSegment("");
    setAmount("");
    setRoad("");
    setDate(new Date().toISOString().slice(0, 10));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!segment || !amount || !date) {
      toast.error("Select a segment, enter an amount, and pick a date");
      return;
    }

    const [fromCity, toCity] = segment.split("→");
    setSaving(true);
    try {
      const res = await fetch("/api/toll-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromCity, toCity, amount, road, date }),
      });
      if (!res.ok) throw new Error("Failed to add toll");
      toast.success("Toll logged");
      resetForm();
      setShowForm(false);
      router.refresh();
    } catch {
      toast.error("Failed to add toll");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/toll-logs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Toll removed");
      router.refresh();
    } catch {
      toast.error("Failed to delete toll");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleDollarSign className="size-5 text-wc-coral" />
            Toll Tracker
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="size-3.5" />
            Add Toll
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Total */}
        <div className="rounded-lg border bg-card/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Tolls</p>
          <p className="text-xl font-bold text-wc-coral">
            {formatCurrency(totalTolls)}
          </p>
        </div>

        {/* Inline form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-lg border bg-card/50 p-4"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Route Segment</label>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  {ROUTE_SEGMENTS.map((seg) => (
                    <SelectItem
                      key={`${seg.from}→${seg.to}`}
                      value={`${seg.from}→${seg.to}`}
                    >
                      {seg.from} → {seg.to}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Amount ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="6.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Road/Turnpike</label>
                <Input
                  placeholder="e.g. NJ Turnpike"
                  value={road}
                  onChange={(e) => setRoad(e.target.value)}
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
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={saving} className="flex-1">
                {saving ? "Saving..." : "Log Toll"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* List */}
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No tolls logged yet. Enjoy the open road!
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-lg border bg-card/50 p-3"
              >
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span>{log.fromCity}</span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                    <span>{log.toCity}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {log.road && <span>{log.road}</span>}
                    {log.road && <span>&middot;</span>}
                    <span>{formatDate(log.date)}</span>
                    <span>&middot;</span>
                    <span className="font-medium text-wc-coral">
                      {formatCurrency(log.amount)}
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
