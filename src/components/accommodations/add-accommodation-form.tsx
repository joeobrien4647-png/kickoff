"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Accommodation, Stop } from "@/lib/schema";

const ACCOMMODATION_TYPES = [
  { value: "host", label: "Staying with friend" },
  { value: "hotel", label: "Hotel" },
  { value: "airbnb", label: "Airbnb" },
  { value: "hostel", label: "Hostel" },
  { value: "other", label: "Other" },
] as const;

interface AddAccommodationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accommodation: Accommodation | null;
  stops: Stop[];
}

export function AddAccommodationForm({
  open,
  onOpenChange,
  accommodation,
  stops,
}: AddAccommodationFormProps) {
  const router = useRouter();
  const isEditing = accommodation !== null;

  const [name, setName] = useState("");
  const [type, setType] = useState("hotel");
  const [stopId, setStopId] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [costPerNight, setCostPerNight] = useState("");
  const [nights, setNights] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset form when accommodation changes or sheet opens
  useEffect(() => {
    if (open) {
      if (accommodation) {
        setName(accommodation.name);
        setType(accommodation.type);
        setStopId(accommodation.stopId);
        setAddress(accommodation.address ?? "");
        setContact(accommodation.contact ?? "");
        setCostPerNight(accommodation.costPerNight != null ? String(accommodation.costPerNight) : "");
        setNights(accommodation.nights != null ? String(accommodation.nights) : "");
        setBookingUrl(accommodation.bookingUrl ?? "");
        setNotes(accommodation.notes ?? "");
        setConfirmed(accommodation.confirmed);
      } else {
        setName("");
        setType("hotel");
        setStopId(stops[0]?.id ?? "");
        setAddress("");
        setContact("");
        setCostPerNight("");
        setNights("");
        setBookingUrl("");
        setNotes("");
        setConfirmed(false);
      }
    }
  }, [open, accommodation, stops]);

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!stopId) {
      toast.error("Select a stop");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        stopId,
        address: address.trim() || null,
        contact: contact.trim() || null,
        costPerNight: costPerNight ? Number(costPerNight) : null,
        nights: nights ? Number(nights) : null,
        bookingUrl: bookingUrl.trim() || null,
        notes: notes.trim() || null,
        confirmed,
      };

      const endpoint = isEditing
        ? `/api/accommodations/${accommodation.id}`
        : "/api/accommodations";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success(isEditing ? "Accommodation updated" : "Accommodation added");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!accommodation) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/accommodations/${accommodation.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Accommodation deleted");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete accommodation");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Accommodation" : "Add Accommodation"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update this accommodation" : "Add where you're staying"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="acc-name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="acc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marriott Downtown, Jake's apartment"
            />
          </div>

          {/* Type + Stop */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Type <span className="text-destructive">*</span>
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Stop <span className="text-destructive">*</span>
              </label>
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select stop" />
                </SelectTrigger>
                <SelectContent>
                  {stops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label htmlFor="acc-address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="acc-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
            />
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <label htmlFor="acc-contact" className="text-sm font-medium">
              Contact
            </label>
            <Input
              id="acc-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone number or email"
            />
          </div>

          {/* Cost per night + Nights */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="acc-cost" className="text-sm font-medium">
                Cost per night ($)
              </label>
              <Input
                id="acc-cost"
                type="number"
                min="0"
                step="0.01"
                value={costPerNight}
                onChange={(e) => setCostPerNight(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="acc-nights" className="text-sm font-medium">
                Nights
              </label>
              <Input
                id="acc-nights"
                type="number"
                min="0"
                step="1"
                value={nights}
                onChange={(e) => setNights(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Booking URL */}
          <div className="space-y-1.5">
            <label htmlFor="acc-url" className="text-sm font-medium">
              Booking URL
            </label>
            <Input
              id="acc-url"
              type="url"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Confirmed toggle */}
          <label
            htmlFor="acc-confirmed"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              id="acc-confirmed"
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="size-4 accent-wc-teal rounded"
            />
            <span className="text-sm font-medium">Booking confirmed</span>
          </label>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="acc-notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="acc-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Check-in instructions, door codes, etc."
              rows={3}
            />
          </div>
        </div>

        <SheetFooter>
          {isEditing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="size-4 mr-1.5" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim() || !stopId}
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add accommodation"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
