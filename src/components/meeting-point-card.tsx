"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { formatDate } from "@/lib/dates";
import type { MeetingPoint } from "@/lib/schema";

type MeetingPointCardProps = {
  points: MeetingPoint[];
  stops: { id: string; city: string }[];
  currentUser: string;
};

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function buildShareMessage(point: { name: string; address?: string | null; time?: string | null }) {
  const lines = ["\u{1F4CD} Meeting Point!", point.name];
  if (point.address) lines.push(`\u{1F4CD} ${point.address}`);
  if (point.time) lines.push(`\u{23F0} ${point.time}`);
  if (point.address) lines.push(`\u{1F5FA}\u{FE0F} ${mapsUrl(point.address)}`);
  return lines.join("\n");
}

export function MeetingPointCard({ points, stops, currentUser }: MeetingPointCardProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [stopId, setStopId] = useState("");
  const [notes, setNotes] = useState("");

  // Sort points by date then time
  const sorted = [...points].sort((a, b) => {
    const dateCompare = (a.date ?? "").localeCompare(b.date ?? "");
    if (dateCompare !== 0) return dateCompare;
    return (a.time ?? "").localeCompare(b.time ?? "");
  });

  function resetForm() {
    setName("");
    setAddress("");
    setDate("");
    setTime("");
    setStopId("");
    setNotes("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/meeting-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim() || undefined,
          date: date || undefined,
          time: time || undefined,
          stopId: stopId || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create meeting point");
      }

      const created = await res.json();

      // Copy WhatsApp-friendly message to clipboard
      const msg = buildShareMessage(created);
      await navigator.clipboard.writeText(msg);

      toast.success("Meeting point saved & copied!");
      resetForm();
      setFormOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create meeting point"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (deleting) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/meeting-points/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete meeting point");
      toast.success("Meeting point removed");
      router.refresh();
    } catch {
      toast.error("Failed to delete meeting point");
    } finally {
      setDeleting(null);
    }
  }

  async function handleCopyLocation(point: MeetingPoint) {
    if (!point.address) return;
    const url = mapsUrl(point.address);
    await navigator.clipboard.writeText(url);
    setCopiedId(point.id);
    toast.success("Location link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  function getStopCity(sId: string | null) {
    if (!sId) return null;
    return stops.find((s) => s.id === sId)?.city ?? null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-wc-coral" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Meeting Points
        </h2>
        {sorted.length > 0 && (
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {sorted.length} active
          </Badge>
        )}
        <button
          onClick={() => setFormOpen(true)}
          className={cn(
            "size-6 rounded-full flex items-center justify-center transition-colors",
            "bg-wc-coral/15 text-wc-coral hover:bg-wc-coral/25",
            sorted.length === 0 && "ml-auto"
          )}
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* Meeting point cards */}
      {sorted.map((point) => {
        const city = getStopCity(point.stopId);
        const cityId = city ? getCityIdentity(city) : null;

        return (
          <Card
            key={point.id}
            className="py-3 transition-colors hover:border-muted-foreground/20"
          >
            <CardContent className="space-y-2.5">
              {/* Name + city badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <MapPin className="size-4 text-wc-coral shrink-0 mt-0.5" />
                  <span className="text-sm font-bold leading-tight">
                    {point.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {city && cityId && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        cityId.bg,
                        cityId.color,
                        cityId.border
                      )}
                    >
                      {city}
                    </Badge>
                  )}
                  {point.addedBy && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {point.addedBy}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Address with Google Maps link */}
              {point.address && (
                <a
                  href={mapsUrl(point.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Navigation className="size-3 shrink-0 mt-0.5" />
                  <span className="group-hover:underline">{point.address}</span>
                  <ExternalLink className="size-3 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {/* Date + Time row */}
              {(point.date || point.time) && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {point.date && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDate(point.date)}
                    </span>
                  )}
                  {point.time && (
                    <span className="tabular-nums">{point.time}</span>
                  )}
                </div>
              )}

              {/* Notes */}
              {point.notes && (
                <p className="text-xs text-muted-foreground/80 italic">
                  {point.notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                {point.address && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleCopyLocation(point)}
                    className="text-wc-teal border-wc-teal/30 hover:bg-wc-teal/10"
                  >
                    {copiedId === point.id ? (
                      <Check className="size-3" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copiedId === point.id ? "Copied!" : "Share Location"}
                  </Button>
                )}
                {point.addedBy === currentUser && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(point.id)}
                    disabled={deleting === point.id}
                    className="text-destructive/70 hover:text-destructive ml-auto"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Empty state */}
      {sorted.length === 0 && (
        <Card className="py-8">
          <CardContent className="text-center text-muted-foreground">
            <MapPin className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No meeting points set yet. Tap + to pin a spot!</p>
          </CardContent>
        </Card>
      )}

      {/* Set Meeting Point Sheet */}
      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Set Meeting Point</SheetTitle>
            <SheetDescription>
              Pin a spot for the group to meet up.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreate} className="space-y-4 p-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Outside the stadium, Hotel lobby, Bleacher Bar"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St..."
              />
            </div>

            {/* Date + Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            {/* City/Stop */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">City</label>
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a city" />
                </SelectTrigger>
                <SelectContent>
                  {stops.map((stop) => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Notes{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Look for the England flags"
                rows={2}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !name.trim()}
            >
              {submitting ? "Saving..." : "Save & Share"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
