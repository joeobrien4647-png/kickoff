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
import { today } from "@/lib/dates";
import type { Transport } from "@/lib/schema";

// ── Transport types ──────────────────────────────────────────────────
const TRANSPORT_TYPES = [
  { value: "flight", label: "Flight" },
  { value: "train", label: "Train" },
  { value: "car_rental", label: "Car Rental" },
  { value: "bus", label: "Bus" },
  { value: "rideshare", label: "Rideshare" },
] as const;

// ── Props ────────────────────────────────────────────────────────────
interface AddTransportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transport: Transport | null;
  cities: string[];
}

// ── Component ────────────────────────────────────────────────────────
export function AddTransportForm({
  open,
  onOpenChange,
  transport,
  cities,
}: AddTransportFormProps) {
  const router = useRouter();
  const isEditing = transport !== null;

  const [type, setType] = useState("flight");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [departTime, setDepartTime] = useState("");
  const [arriveTime, setArriveTime] = useState("");
  const [carrier, setCarrier] = useState("");
  const [confirmationRef, setConfirmationRef] = useState("");
  const [cost, setCost] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset form when transport changes or sheet opens
  useEffect(() => {
    if (open) {
      if (transport) {
        setType(transport.type);
        setFromCity(transport.fromCity);
        setToCity(transport.toCity);
        setDepartDate(transport.departDate);
        setDepartTime(transport.departTime ?? "");
        setArriveTime(transport.arriveTime ?? "");
        setCarrier(transport.carrier ?? "");
        setConfirmationRef(transport.confirmationRef ?? "");
        setCost(transport.cost != null ? String(transport.cost) : "");
        setBookingUrl(transport.bookingUrl ?? "");
        setNotes(transport.notes ?? "");
      } else {
        setType("flight");
        setFromCity(cities[0] ?? "");
        setToCity(cities[1] ?? "");
        setDepartDate(today());
        setDepartTime("");
        setArriveTime("");
        setCarrier("");
        setConfirmationRef("");
        setCost("");
        setBookingUrl("");
        setNotes("");
      }
    }
  }, [open, transport, cities]);

  async function handleSave() {
    if (!fromCity.trim()) {
      toast.error("From city is required");
      return;
    }
    if (!toCity.trim()) {
      toast.error("To city is required");
      return;
    }
    if (!departDate) {
      toast.error("Departure date is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        type,
        fromCity: fromCity.trim(),
        toCity: toCity.trim(),
        departDate,
        departTime: departTime || null,
        arriveTime: arriveTime || null,
        carrier: carrier.trim() || null,
        confirmationRef: confirmationRef.trim() || null,
        cost: cost ? Number(cost) : null,
        bookingUrl: bookingUrl.trim() || null,
        notes: notes.trim() || null,
      };

      const endpoint = isEditing
        ? `/api/transports/${transport.id}`
        : "/api/transports";
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

      toast.success(isEditing ? "Transport updated" : "Transport added");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!transport) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/transports/${transport.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Transport deleted");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete transport");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Transport" : "Add Transport"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this transport booking"
              : "Add a new travel leg to the trip"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-4">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Type <span className="text-destructive">*</span>
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From / To cities */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                From <span className="text-destructive">*</span>
              </label>
              <Select value={fromCity} onValueChange={setFromCity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                To <span className="text-destructive">*</span>
              </label>
              <Select value={toCity} onValueChange={setToCity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date + Times */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="tp-date" className="text-sm font-medium">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                id="tp-date"
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tp-depart" className="text-sm font-medium">
                Depart
              </label>
              <Input
                id="tp-depart"
                type="time"
                value={departTime}
                onChange={(e) => setDepartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tp-arrive" className="text-sm font-medium">
                Arrive
              </label>
              <Input
                id="tp-arrive"
                type="time"
                value={arriveTime}
                onChange={(e) => setArriveTime(e.target.value)}
              />
            </div>
          </div>

          {/* Carrier + Confirmation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="tp-carrier" className="text-sm font-medium">
                Carrier
              </label>
              <Input
                id="tp-carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. American Airlines"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tp-conf" className="text-sm font-medium">
                Confirmation #
              </label>
              <Input
                id="tp-conf"
                value={confirmationRef}
                onChange={(e) => setConfirmationRef(e.target.value)}
                placeholder="e.g. ABC123"
              />
            </div>
          </div>

          {/* Cost + Booking URL */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="tp-cost" className="text-sm font-medium">
                Cost ($)
              </label>
              <Input
                id="tp-cost"
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tp-url" className="text-sm font-medium">
                Booking URL
              </label>
              <Input
                id="tp-url"
                type="url"
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="tp-notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="tp-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Seat preferences, baggage info, etc."
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
            disabled={saving || !fromCity || !toCity || !departDate}
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Add transport"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
