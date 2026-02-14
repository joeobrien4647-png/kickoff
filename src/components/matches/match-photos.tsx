"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Image compression (reuses same approach as photo-wall)
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
// Props
// ---------------------------------------------------------------------------

interface MatchPhotosProps {
  matchId: string;
  /** Photos filtered for this match's date */
  photos: Photo[];
  /** The match date (YYYY-MM-DD) -- used as takenDate for uploads */
  matchDate: string;
  /** Optional stop ID to tag uploaded photos */
  stopId?: string | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MatchPhotos({
  matchId,
  photos,
  matchDate,
  stopId,
}: MatchPhotosProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // -----------------------------------------------------------------------
  // Upload handler
  // -----------------------------------------------------------------------

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const compressed = await compressImage(file);

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: compressed,
          caption: null,
          stopId: stopId || null,
          takenDate: matchDate,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Photo added!");
      router.refresh();
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-1.5">
          <Camera className="size-3.5 text-wc-teal" />
          Match Photos
          {photos.length > 0 && (
            <span className="text-muted-foreground font-normal">
              ({photos.length})
            </span>
          )}
        </h4>
        <Button
          variant="outline"
          size="xs"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <Plus className="size-3" />
          {uploading ? "Uploading..." : "Add photo"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-8 rounded-lg border-2 border-dashed border-border hover:border-wc-teal/50 flex flex-col items-center gap-2 text-muted-foreground hover:text-wc-teal transition-colors"
        >
          <Camera className="size-8 opacity-40" />
          <span className="text-xs">No match-day photos yet</span>
        </button>
      ) : (
        <div className="columns-3 gap-2 space-y-2">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="w-full rounded-lg overflow-hidden group break-inside-avoid focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={photo.data}
                alt={photo.caption || "Match photo"}
                className="w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-size lightbox */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-lg p-0 overflow-hidden gap-0"
        >
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.data}
                alt={selectedPhoto.caption || "Match photo"}
                className="w-full max-h-[75vh] object-contain bg-black"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="size-4" />
              </button>
              {selectedPhoto.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm">{selectedPhoto.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
