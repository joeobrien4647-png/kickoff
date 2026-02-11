"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Plus, Trash2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Photo, Stop } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PhotosViewProps {
  photos: Photo[];
  stops: Stop[];
  currentUser: string | null;
}

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

export function PhotosView({ photos: initialPhotos, stops, currentUser }: PhotosViewProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [stopId, setStopId] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Build a map for quick stop lookups
  const stopMap = new Map(stops.map((s) => [s.id, s]));

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

      setOpen(false);
      resetForm();
      toast.success("Photo added!");
      router.refresh();
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setSelectedPhoto(null);
      toast.success("Photo deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete photo");
    }
  }

  return (
    <div className="space-y-4">
      {/* Add photo button */}
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
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

      {/* Photo grid */}
      {initialPhotos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Camera className="size-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No photos yet</p>
          <p className="text-xs mt-1">
            Start capturing memories from the trip!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {initialPhotos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <img
                src={photo.data}
                alt={photo.caption || "Trip photo"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">
                    {photo.caption}
                  </p>
                </div>
              )}
              {photo.stopId && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="flex items-center gap-0.5 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    <MapPin className="size-2.5" />
                    {stopMap.get(photo.stopId)?.city ?? ""}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox dialog */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={(o) => !o && setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {selectedPhoto && (
            <div>
              <img
                src={selectedPhoto.data}
                alt={selectedPhoto.caption || "Trip photo"}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <div className="p-4 space-y-2">
                {selectedPhoto.caption && (
                  <p className="font-medium">{selectedPhoto.caption}</p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>by {selectedPhoto.addedBy}</span>
                  {selectedPhoto.stopId && (
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {stopMap.get(selectedPhoto.stopId)?.city}
                    </span>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="mt-2"
                >
                  <Trash2 className="size-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
