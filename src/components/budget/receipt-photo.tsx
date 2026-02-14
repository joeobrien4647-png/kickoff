"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_WIDTH = 800;

/** Compress an image file to a max-width JPEG and return as base64 data URL. */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
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

interface ReceiptPhotoProps {
  expenseId: string;
  receiptPhoto: string | null;
  className?: string;
}

export function ReceiptPhoto({
  expenseId,
  receiptPhoto,
  className,
}: ReceiptPhotoProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setUploading(true);
      try {
        const base64 = await compressImage(file);

        const res = await fetch(`/api/expenses/${expenseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiptPhoto: base64 }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to upload receipt");
        }

        toast.success("Receipt photo saved");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save receipt"
        );
      } finally {
        setUploading(false);
        // Reset input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [expenseId, router]
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className={cn("flex items-center gap-1.5", className)}>
        {/* Upload / replace button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title={receiptPhoto ? "Replace receipt photo" : "Attach receipt photo"}
        >
          <Camera className={cn("size-3.5", uploading && "animate-pulse")} />
        </Button>

        {/* Thumbnail preview if receipt exists */}
        {receiptPhoto && (
          <button
            onClick={() => setViewOpen(true)}
            className="size-7 rounded border border-border overflow-hidden hover:ring-2 hover:ring-wc-teal/50 transition-shadow"
            title="View receipt"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={receiptPhoto}
              alt="Receipt"
              className="size-full object-cover"
            />
          </button>
        )}
      </div>

      {/* Full-size receipt dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
            <DialogDescription>Attached receipt photo</DialogDescription>
          </DialogHeader>
          {receiptPhoto && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={receiptPhoto}
                alt="Receipt full size"
                className="max-h-[60vh] w-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
