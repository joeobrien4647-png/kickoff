"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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
import type { Stop, Reservation } from "@/lib/schema";

const RESERVATION_TYPES = [
  { value: "restaurant", label: "\uD83C\uDF7D\uFE0F Restaurant" },
  { value: "bar", label: "\uD83C\uDF7A Bar" },
  { value: "tour", label: "\uD83D\uDDFA\uFE0F Tour" },
  { value: "activity", label: "\uD83C\uDFAF Activity" },
  { value: "other", label: "\uD83D\uDCCC Other" },
] as const;

const RESERVATION_STATUSES = [
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
] as const;

interface AddReservationFormProps {
  stops: Stop[];
  defaultStopId?: string;
  editingReservation: Reservation | null;
  onClose: () => void;
}

export function AddReservationForm({
  stops,
  defaultStopId,
  editingReservation,
  onClose,
}: AddReservationFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = editingReservation !== null;

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState("3");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationRef, setConfirmationRef] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [stopId, setStopId] = useState(defaultStopId || "");
  const [status, setStatus] = useState("pending");

  // Sync stopId when the active tab changes
  useEffect(() => {
    if (!isEditing) {
      setStopId(defaultStopId || "");
    }
  }, [defaultStopId, isEditing]);

  // Open sheet when editing a reservation
  useEffect(() => {
    if (editingReservation) {
      setName(editingReservation.name);
      setType(editingReservation.type);
      setDate(editingReservation.date);
      setTime(editingReservation.time || "");
      setPartySize(editingReservation.partySize?.toString() || "3");
      setAddress(editingReservation.address || "");
      setPhone(editingReservation.phone || "");
      setConfirmationRef(editingReservation.confirmationRef || "");
      setUrl(editingReservation.url || "");
      setNotes(editingReservation.notes || "");
      setStopId(editingReservation.stopId || "");
      setStatus(editingReservation.status);
      setOpen(true);
    }
  }, [editingReservation]);

  function resetForm() {
    setName("");
    setType("");
    setDate("");
    setTime("");
    setPartySize("3");
    setAddress("");
    setPhone("");
    setConfirmationRef("");
    setUrl("");
    setNotes("");
    setStopId(defaultStopId || "");
    setStatus("pending");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
      onClose();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !type || !date) return;

    setSubmitting(true);
    try {
      const payload = {
        name,
        type,
        date,
        time: time || undefined,
        partySize: partySize ? Number(partySize) : undefined,
        address: address || undefined,
        phone: phone || undefined,
        confirmationRef: confirmationRef || undefined,
        url: url || undefined,
        notes: notes || undefined,
        stopId: stopId || undefined,
        status,
      };

      const endpoint = isEditing
        ? `/api/reservations/${editingReservation.id}`
        : "/api/reservations";

      const res = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "add"} reservation`);
      }

      toast.success(isEditing ? "Reservation updated!" : "Reservation added!");
      resetForm();
      setOpen(false);
      onClose();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save reservation"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating add button */}
      <Button
        onClick={() => setOpen(true)}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
      >
        <Plus className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit Reservation" : "Add Reservation"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update the details of this reservation."
                : "Add a restaurant booking, tour, or activity reservation."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Joe's Steakhouse"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  {RESERVATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date + Time side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
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

            {/* Party Size + Status side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Party Size</label>
                <Input
                  type="number"
                  min="1"
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESERVATION_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stop */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">City / Stop</label>
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a stop (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {stops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-123-4567"
              />
            </div>

            {/* Confirmation Ref */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirmation Ref</label>
              <Input
                value={confirmationRef}
                onChange={(e) => setConfirmationRef(e.target.value)}
                placeholder="ABC123"
              />
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL</label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests, dietary notes, etc."
                rows={2}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !name || !type || !date}
            >
              {submitting
                ? isEditing ? "Saving..." : "Adding..."
                : isEditing ? "Save Changes" : "Add Reservation"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
