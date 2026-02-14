"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MapPin,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { formatDate } from "@/lib/dates";
import type { Photo, Stop } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PhotoWallProps {
  photos: Photo[];
  stops: Stop[];
  currentUser: string | null;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CityGroup = {
  city: string;
  sortOrder: number;
  photos: Photo[];
};

// ---------------------------------------------------------------------------
// Image compression utility
// ---------------------------------------------------------------------------

function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PhotoWall({
  photos: initialPhotos,
  stops,
  currentUser,
}: PhotoWallProps) {
  const router = useRouter();

  // Upload state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [stopId, setStopId] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Build stop map for lookups
  const stopMap = useMemo(
    () => new Map(stops.map((s) => [s.id, s])),
    [stops]
  );

  // Group photos by city, sorted by stop order
  const cityGroups = useMemo<CityGroup[]>(() => {
    const groups = new Map<string, CityGroup>();

    for (const photo of initialPhotos) {
      const stop = photo.stopId ? stopMap.get(photo.stopId) : null;
      const city = stop?.city ?? "On the Road";
      const sortOrder = stop?.sortOrder ?? 999;

      if (!groups.has(city)) {
        groups.set(city, { city, sortOrder, photos: [] });
      }
      groups.get(city)!.photos.push(photo);
    }

    return Array.from(groups.values()).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }, [initialPhotos, stopMap]);

  // Unique city names for the filter bar
  const cityNames = useMemo(
    () => cityGroups.map((g) => g.city),
    [cityGroups]
  );

  // Filtered groups
  const filteredGroups = useMemo(
    () =>
      activeFilter === "all"
        ? cityGroups
        : cityGroups.filter((g) => g.city === activeFilter),
    [cityGroups, activeFilter]
  );

  // Flat list of filtered photos for lightbox navigation
  const flatPhotos = useMemo(
    () => filteredGroups.flatMap((g) => g.photos),
    [filteredGroups]
  );

  // Current lightbox photo
  const lightboxPhoto =
    lightboxIndex !== null ? flatPhotos[lightboxIndex] ?? null : null;

  // ---------------------------------------------------------------------------
  // Lightbox navigation
  // ---------------------------------------------------------------------------

  const openLightbox = useCallback(
    (photoId: string) => {
      const idx = flatPhotos.findIndex((p) => p.id === photoId);
      if (idx !== -1) setLightboxIndex(idx);
    },
    [flatPhotos]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : prev
    );
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev < flatPhotos.length - 1 ? prev + 1 : prev
    );
  }, [flatPhotos.length]);

  // ---------------------------------------------------------------------------
  // Upload handlers
  // ---------------------------------------------------------------------------

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
    } catch {
      toast.error("Failed to process image");
    }
  }

  function resetForm() {
    setPreview(null);
    setCaption("");
    setStopId("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleUpload() {
    if (!preview) return;
    setUploading(true);

    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: preview,
          caption: caption || null,
          stopId: stopId || null,
        }),
      });

      if (!res.ok) throw new Error();

      setSheetOpen(false);
      resetForm();
      toast.success("Photo added!");
      router.refresh();
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Delete handler
  // ---------------------------------------------------------------------------

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      closeLightbox();
      toast.success("Photo deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete photo");
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Upload button */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(isOpen) => {
          setSheetOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <SheetTrigger asChild>
          <Button className="w-full bg-wc-teal hover:bg-wc-teal/90 text-white">
            <Camera className="size-4 mr-2" />
            Add Photo
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh]">
          <SheetHeader>
            <SheetTitle>Add Photo</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-lg max-h-60 object-cover"
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-lg border-2 border-dashed border-border hover:border-wc-teal/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-wc-teal transition-colors"
              >
                <Plus className="size-8" />
                <span className="text-sm">Tap to choose photo</span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <Select value={stopId} onValueChange={setStopId}>
              <SelectTrigger>
                <SelectValue placeholder="Tag a stop (optional)" />
              </SelectTrigger>
              <SelectContent>
                {stops.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleUpload}
              disabled={!preview || uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Save Photo"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Empty state */}
      {initialPhotos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Camera className="size-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No photos yet</p>
          <p className="text-sm mt-1">
            Start capturing memories!
          </p>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="shrink-0"
            >
              All ({initialPhotos.length})
            </Button>
            {cityNames.map((city) => {
              const group = cityGroups.find((g) => g.city === city)!;
              const identity = getCityIdentity(city);
              return (
                <Button
                  key={city}
                  variant={activeFilter === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(city)}
                  className={cn(
                    "shrink-0",
                    activeFilter !== city && identity.color
                  )}
                >
                  <MapPin className="size-3" />
                  {city} ({group.photos.length})
                </Button>
              );
            })}
          </div>

          {/* City sections */}
          <div className="space-y-8">
            {filteredGroups.map((group) => {
              const identity = getCityIdentity(group.city);
              const photoCount = group.photos.length;

              return (
                <section key={group.city}>
                  {/* City header */}
                  <div
                    className={cn(
                      "flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-gradient-to-r",
                      identity.gradient
                    )}
                  >
                    <MapPin className={cn("size-5", identity.color)} />
                    <div className="flex-1 min-w-0">
                      <h2 className={cn("font-semibold text-lg", identity.color)}>
                        {group.city}
                      </h2>
                      {identity.tagline && (
                        <p className="text-xs text-muted-foreground">
                          {identity.tagline}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {photoCount} {photoCount === 1 ? "photo" : "photos"}
                    </Badge>
                  </div>

                  {/* Photo grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {group.photos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => openLightbox(photo.id)}
                        className="relative aspect-square rounded-lg overflow-hidden shadow-sm group focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <img
                          src={photo.data}
                          alt={photo.caption || "Trip photo"}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        {/* Bottom gradient overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-2 pt-8">
                          {photo.caption && (
                            <p className="text-white text-xs truncate">
                              {photo.caption}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-white/70 text-[10px]">
                              by {photo.addedBy}
                            </span>
                            {photo.takenDate && (
                              <span className="text-white/60 text-[10px]">
                                {formatDate(photo.takenDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {/* Lightbox dialog */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(o) => !o && closeLightbox()}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-2xl p-0 overflow-hidden gap-0"
        >
          {lightboxPhoto && (
            <>
              {/* Image area with nav arrows */}
              <div className="relative bg-black">
                <img
                  src={lightboxPhoto.data}
                  alt={lightboxPhoto.caption || "Trip photo"}
                  className="w-full max-h-[70vh] object-contain"
                />

                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="size-4" />
                </button>

                {/* Previous arrow */}
                {lightboxIndex !== null && lightboxIndex > 0 && (
                  <button
                    onClick={goToPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                )}

                {/* Next arrow */}
                {lightboxIndex !== null &&
                  lightboxIndex < flatPhotos.length - 1 && (
                    <button
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  )}

                {/* Photo counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <span className="text-white/80 text-xs bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {(lightboxIndex ?? 0) + 1} / {flatPhotos.length}
                  </span>
                </div>
              </div>

              {/* Info area */}
              <div className="p-4 space-y-3">
                {lightboxPhoto.caption && (
                  <p className="font-medium">{lightboxPhoto.caption}</p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">
                    by {lightboxPhoto.addedBy}
                  </Badge>

                  {lightboxPhoto.stopId && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="size-3" />
                      {stopMap.get(lightboxPhoto.stopId)?.city ?? "Unknown"}
                    </Badge>
                  )}

                  {lightboxPhoto.takenDate && (
                    <Badge variant="outline">
                      {formatDate(lightboxPhoto.takenDate)}
                    </Badge>
                  )}
                </div>

                {/* Delete button -- only for the photo creator */}
                {currentUser && lightboxPhoto.addedBy === currentUser && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(lightboxPhoto.id)}
                  >
                    <Trash2 className="size-3.5 mr-1.5" />
                    Delete
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
