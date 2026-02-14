"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Car,
  Camera,
  Navigation,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Stop, ParkingSpot } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Compress an image file to max 800px wide, JPEG 0.7 quality, return base64 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ParkingSpotSaverProps {
  currentUser: string;
  stops: Stop[];
}

export function ParkingSpotSaver({ currentUser, stops }: ParkingSpotSaverProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const [spot, setSpot] = useState("");
  const [address, setAddress] = useState("");
  const [stopId, setStopId] = useState("none");
  const [photo, setPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // ---- Fetch spots ----
  const fetchSpots = useCallback(async () => {
    try {
      const res = await fetch("/api/parking");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setSpots(data);
    } catch {
      toast.error("Failed to load parking spots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  // ---- Derived data ----
  const currentSpot = spots[0] ?? null; // newest first from API
  const pastSpots = spots.slice(1);

  const stopMap = useMemo(() => {
    const map = new Map<string, Stop>();
    for (const s of stops) map.set(s.id, s);
    return map;
  }, [stops]);

  // ---- Reset form ----
  function resetForm() {
    setLocation("");
    setLevel("");
    setSpot("");
    setAddress("");
    setStopId("none");
    setPhoto(null);
    setNotes("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ---- Handle photo ----
  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
    } catch {
      toast.error("Failed to process photo");
    }
  }

  // ---- Save spot ----
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/parking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopId: stopId !== "none" ? stopId : null,
          location: location.trim(),
          address: address.trim() || null,
          level: level.trim() || null,
          spot: spot.trim() || null,
          photo,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      const created = await res.json();
      setSpots((prev) => [created, ...prev]);
      router.refresh();
      toast.success("Parking spot saved!");
      resetForm();
      setFormOpen(false);
    } catch {
      toast.error("Failed to save parking spot");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Delete spot ----
  async function handleDelete(id: string, locationName: string) {
    setSpots((prev) => prev.filter((s) => s.id !== id));

    try {
      const res = await fetch(`/api/parking/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
      toast.success(`Removed: ${locationName}`);
    } catch {
      fetchSpots();
      toast.error("Failed to remove parking spot");
    }
  }

  // ---- City name helper ----
  function cityName(sid: string | null): string | null {
    if (!sid) return null;
    const s = stopMap.get(sid);
    return s ? s.city : null;
  }

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Car className="size-8 mx-auto mb-2 opacity-50 animate-pulse" />
        <p className="text-sm">Loading parking spots...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Save My Spot Button / Form ─────────────────────────────── */}
      {formOpen ? (
        <Card className="border-wc-teal/30">
          <CardContent className="space-y-4">
            <form onSubmit={handleSave} className="space-y-4">
              {/* Location name — required */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Location name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder='e.g. "Lot 4B", "Garage on 5th St"'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Level + Spot — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">
                    Level / Floor
                  </label>
                  <Input
                    placeholder="e.g. P2, Ground"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">
                    Spot number
                  </label>
                  <Input
                    placeholder="e.g. A-42"
                    value={spot}
                    onChange={(e) => setSpot(e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <Input
                  placeholder="Street address (optional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* City select */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  City
                </label>
                <Select value={stopId} onValueChange={setStopId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No city</SelectItem>
                    {stops.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Photo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Photo
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="size-4" />
                    {photo ? "Change Photo" : "Take Photo"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhoto}
                    className="hidden"
                  />
                  {photo && (
                    <Badge variant="secondary" className="text-xs">
                      Photo attached
                    </Badge>
                  )}
                </div>
                {photo && (
                  <img
                    src={photo}
                    alt="Parking spot preview"
                    className="mt-2 rounded-lg max-h-40 object-cover border"
                  />
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Notes
                </label>
                <Textarea
                  placeholder="Any landmarks, reminders..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-12"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!location.trim() || submitting}
                  className="bg-wc-teal text-white hover:bg-wc-teal/90"
                >
                  <MapPin className="size-4" />
                  {submitting ? "Saving..." : "Save Spot"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    setFormOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setFormOpen(true)}
          size="lg"
          className="w-full bg-wc-teal text-white hover:bg-wc-teal/90"
        >
          <MapPin className="size-5" />
          Save Parking Spot
        </Button>
      )}

      {/* ── Current Spot ───────────────────────────────────────────── */}
      {currentSpot && (
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Car className="size-5 text-wc-teal shrink-0" />
                  <h3 className="text-lg font-semibold truncate">
                    {currentSpot.location}
                  </h3>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentSpot.level && (
                    <Badge variant="secondary">Level {currentSpot.level}</Badge>
                  )}
                  {currentSpot.spot && (
                    <Badge variant="secondary">Spot {currentSpot.spot}</Badge>
                  )}
                  {cityName(currentSpot.stopId) && (
                    <Badge variant="outline">
                      {cityName(currentSpot.stopId)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Relative time */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 pt-1">
                <Clock className="size-3" />
                {relativeTime(currentSpot.createdAt)}
              </div>
            </div>

            {/* Photo thumbnail */}
            {currentSpot.photo && (
              <img
                src={currentSpot.photo}
                alt="Parking spot"
                className="rounded-lg max-h-48 w-full object-cover border"
              />
            )}

            {/* Notes */}
            {currentSpot.notes && (
              <p className="text-sm text-muted-foreground">
                {currentSpot.notes}
              </p>
            )}

            {/* Navigate to car */}
            {currentSpot.address && (
              <a
                href={mapsSearchUrl(currentSpot.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="sm">
                  <Navigation className="size-4" />
                  Navigate to Car
                </Button>
              </a>
            )}

            {currentSpot.addedBy && (
              <p className="text-xs text-muted-foreground">
                Saved by {currentSpot.addedBy}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Empty state ────────────────────────────────────────────── */}
      {!currentSpot && !formOpen && (
        <div className="text-center py-8 text-muted-foreground">
          <Car className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No parking spots saved yet.</p>
          <p className="text-xs mt-1">
            Tap the button above to remember where you parked!
          </p>
        </div>
      )}

      {/* ── History ────────────────────────────────────────────────── */}
      {pastSpots.length > 0 && (
        <div className="rounded-lg bg-muted/30 overflow-hidden">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-muted/50 transition-colors"
          >
            {historyOpen ? (
              <ChevronDown className="size-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm font-medium">Previous Spots</span>
            <Badge
              variant="secondary"
              className="ml-auto text-[10px] px-1.5 py-0"
            >
              {pastSpots.length}
            </Badge>
          </button>

          {historyOpen && (
            <div className="px-2 pb-2 space-y-1">
              {pastSpots.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted/40 transition-colors group"
                >
                  <MapPin className="size-4 text-muted-foreground shrink-0" />

                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium truncate block">
                      {s.location}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {cityName(s.stopId) && (
                        <span className="text-[11px] text-muted-foreground">
                          {cityName(s.stopId)}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {cityName(s.stopId) ? " \u00B7 " : ""}
                        {relativeTime(s.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(s.id, s.location)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${s.location}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
