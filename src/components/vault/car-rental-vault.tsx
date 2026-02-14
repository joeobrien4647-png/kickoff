"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import {
  Car,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  ExternalLink,
  Phone,
  Fuel,
  Shield,
  CalendarDays,
  MapPin,
  CreditCard,
  StickyNote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CarRentalData {
  company: string;
  confirmationNumber: string;
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  returnDate: string;
  returnTime: string;
  returnLocation: string;
  dailyRate: string;
  totalEstimate: string;
  insuranceType: string;
  roadsideNumber: string;
  fuelPolicy: string;
  notes: string;
}

const EMPTY_RENTAL: CarRentalData = {
  company: "",
  confirmationNumber: "",
  vehicleType: "",
  pickupDate: "",
  pickupTime: "",
  pickupLocation: "",
  returnDate: "",
  returnTime: "",
  returnLocation: "",
  dailyRate: "",
  totalEstimate: "",
  insuranceType: "",
  roadsideNumber: "",
  fuelPolicy: "full-to-full",
  notes: "",
};

const FUEL_POLICIES = [
  { value: "full-to-full", label: "Full-to-Full" },
  { value: "prepaid", label: "Prepaid Fuel" },
  { value: "pay-on-return", label: "Pay on Return" },
] as const;

const INSURANCE_OPTIONS = [
  { value: "cdw", label: "CDW (Collision Damage Waiver)" },
  { value: "ldw", label: "LDW (Loss Damage Waiver)" },
  { value: "liability", label: "Liability Only" },
  { value: "full", label: "Full Coverage" },
  { value: "credit-card", label: "Credit Card Coverage" },
  { value: "none", label: "None / Declined" },
  { value: "other", label: "Other" },
] as const;

const STORAGE_KEY = "kickoff_car_rental";

// ---------------------------------------------------------------------------
// localStorage store (hydration-safe via useSyncExternalStore)
// ---------------------------------------------------------------------------

type Listener = () => void;

const rentalStore = {
  listeners: new Set<Listener>(),

  getSnapshot(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "null";
    } catch {
      return "null";
    }
  },

  getServerSnapshot(): string {
    return "null";
  },

  subscribe(listener: Listener): () => void {
    rentalStore.listeners.add(listener);

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) listener();
    }
    window.addEventListener("storage", onStorage);

    return () => {
      rentalStore.listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  write(data: CarRentalData | null) {
    try {
      if (data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage full or unavailable
    }
    for (const listener of rentalStore.listeners) {
      listener();
    }
  },
};

function useCarRental(): [CarRentalData | null, (next: CarRentalData | null) => void] {
  const raw = useSyncExternalStore(
    rentalStore.subscribe,
    rentalStore.getSnapshot,
    rentalStore.getServerSnapshot,
  );

  let data: CarRentalData | null;
  try {
    data = JSON.parse(raw);
  } catch {
    data = null;
  }

  const setData = useCallback((next: CarRentalData | null) => {
    rentalStore.write(next);
  }, []);

  return [data, setData];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function googleMapsUrl(location: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
}

function formatDate(dateStr: string, timeStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T00:00:00");
    const formatted = date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (timeStr) return `${formatted} at ${timeStr}`;
    return formatted;
  } catch {
    return dateStr;
  }
}

function getFuelPolicyLabel(value: string): string {
  return FUEL_POLICIES.find((p) => p.value === value)?.label ?? value;
}

function getInsuranceLabel(value: string): string {
  return INSURANCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// ---------------------------------------------------------------------------
// Display Mode
// ---------------------------------------------------------------------------

function DisplayField({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  if (!value) return null;

  return (
    <div className={cn("flex items-start gap-2.5 py-2 border-b border-border/50 last:border-0", className)}>
      <Icon className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-sm font-medium mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

function RentalDisplay({
  data,
  onEdit,
}: {
  data: CarRentalData;
  onEdit: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyConfirmation() {
    if (!data.confirmationNumber) return;
    try {
      await navigator.clipboard.writeText(data.confirmationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div className="space-y-3">
      {/* Company + vehicle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="size-4 text-wc-gold" />
          <span className="text-sm font-semibold">{data.company || "Car Rental"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {data.vehicleType && (
            <Badge variant="secondary" className="text-[10px]">
              {data.vehicleType}
            </Badge>
          )}
          <Button variant="ghost" size="icon-xs" onClick={onEdit} aria-label="Edit rental">
            <Edit3 className="size-3" />
          </Button>
        </div>
      </div>

      {/* Confirmation number with copy */}
      {data.confirmationNumber && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Confirmation #
            </p>
            <p className="text-sm font-mono font-semibold tracking-wide mt-0.5">
              {data.confirmationNumber}
            </p>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={copyConfirmation}
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="size-3" />
                <span className="text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Pickup & return */}
      <div className="grid gap-2 sm:grid-cols-2">
        {(data.pickupDate || data.pickupLocation) && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px]">
                Pickup
              </Badge>
            </div>
            {data.pickupDate && (
              <p className="text-xs font-medium">
                {formatDate(data.pickupDate, data.pickupTime)}
              </p>
            )}
            {data.pickupLocation && (
              <p className="text-[11px] text-muted-foreground">{data.pickupLocation}</p>
            )}
            {data.pickupLocation && (
              <a
                href={googleMapsUrl(data.pickupLocation)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-wc-blue hover:underline mt-1"
              >
                <ExternalLink className="size-2.5" />
                Get Directions
              </a>
            )}
          </div>
        )}

        {(data.returnDate || data.returnLocation) && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-red-500/15 text-red-500 border-0 text-[10px]">
                Return
              </Badge>
            </div>
            {data.returnDate && (
              <p className="text-xs font-medium">
                {formatDate(data.returnDate, data.returnTime)}
              </p>
            )}
            {data.returnLocation && (
              <p className="text-[11px] text-muted-foreground">{data.returnLocation}</p>
            )}
            {data.returnLocation && (
              <a
                href={googleMapsUrl(data.returnLocation)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-wc-blue hover:underline mt-1"
              >
                <ExternalLink className="size-2.5" />
                Get Directions
              </a>
            )}
          </div>
        )}
      </div>

      {/* Details grid */}
      <div className="divide-y-0">
        <DisplayField icon={CreditCard} label="Daily Rate" value={data.dailyRate ? `$${data.dailyRate}/day` : ""} />
        <DisplayField icon={CreditCard} label="Total Estimate" value={data.totalEstimate ? `$${data.totalEstimate}` : ""} />
        <DisplayField icon={Shield} label="Insurance" value={getInsuranceLabel(data.insuranceType)} />
        <DisplayField icon={Phone} label="Emergency Roadside" value={data.roadsideNumber} />
        <DisplayField icon={Fuel} label="Fuel Policy" value={getFuelPolicyLabel(data.fuelPolicy)} />
        <DisplayField icon={StickyNote} label="Notes" value={data.notes} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit Mode
// ---------------------------------------------------------------------------

function RentalForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: CarRentalData;
  onSave: (data: CarRentalData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CarRentalData>(initial);

  function update(field: keyof CarRentalData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company + Vehicle */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="cr-company" className="text-xs font-medium">
            Company
          </label>
          <Input
            id="cr-company"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="e.g. Hertz, Enterprise"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cr-vehicle" className="text-xs font-medium">
            Vehicle Type
          </label>
          <Input
            id="cr-vehicle"
            value={form.vehicleType}
            onChange={(e) => update("vehicleType", e.target.value)}
            placeholder="e.g. SUV, Midsize"
          />
        </div>
      </div>

      {/* Confirmation # */}
      <div className="space-y-1.5">
        <label htmlFor="cr-confirmation" className="text-xs font-medium">
          Confirmation Number
        </label>
        <Input
          id="cr-confirmation"
          value={form.confirmationNumber}
          onChange={(e) => update("confirmationNumber", e.target.value)}
          placeholder="e.g. H12345678"
          className="font-mono"
        />
      </div>

      {/* Pickup */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="size-3" />
          Pickup
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="cr-pickup-date" className="text-xs font-medium">
              Date
            </label>
            <Input
              id="cr-pickup-date"
              type="date"
              value={form.pickupDate}
              onChange={(e) => update("pickupDate", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cr-pickup-time" className="text-xs font-medium">
              Time
            </label>
            <Input
              id="cr-pickup-time"
              type="time"
              value={form.pickupTime}
              onChange={(e) => update("pickupTime", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cr-pickup-location" className="text-xs font-medium">
            Location
          </label>
          <Input
            id="cr-pickup-location"
            value={form.pickupLocation}
            onChange={(e) => update("pickupLocation", e.target.value)}
            placeholder="e.g. LAX Airport, Terminal 1"
          />
        </div>
      </div>

      {/* Return */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="size-3" />
          Return
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="cr-return-date" className="text-xs font-medium">
              Date
            </label>
            <Input
              id="cr-return-date"
              type="date"
              value={form.returnDate}
              onChange={(e) => update("returnDate", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cr-return-time" className="text-xs font-medium">
              Time
            </label>
            <Input
              id="cr-return-time"
              type="time"
              value={form.returnTime}
              onChange={(e) => update("returnTime", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cr-return-location" className="text-xs font-medium">
            Location
          </label>
          <Input
            id="cr-return-location"
            value={form.returnLocation}
            onChange={(e) => update("returnLocation", e.target.value)}
            placeholder="e.g. Miami Airport"
          />
        </div>
      </div>

      {/* Cost */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="cr-daily-rate" className="text-xs font-medium">
            Daily Rate ($)
          </label>
          <Input
            id="cr-daily-rate"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={form.dailyRate}
            onChange={(e) => update("dailyRate", e.target.value)}
            placeholder="e.g. 65"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cr-total" className="text-xs font-medium">
            Total Estimate ($)
          </label>
          <Input
            id="cr-total"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={form.totalEstimate}
            onChange={(e) => update("totalEstimate", e.target.value)}
            placeholder="e.g. 1040"
          />
        </div>
      </div>

      {/* Insurance */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Insurance Type</label>
        <Select value={form.insuranceType} onValueChange={(v) => update("insuranceType", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select insurance type" />
          </SelectTrigger>
          <SelectContent>
            {INSURANCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Roadside */}
      <div className="space-y-1.5">
        <label htmlFor="cr-roadside" className="text-xs font-medium">
          Emergency Roadside Number
        </label>
        <Input
          id="cr-roadside"
          type="tel"
          value={form.roadsideNumber}
          onChange={(e) => update("roadsideNumber", e.target.value)}
          placeholder="e.g. 1-800-654-3131"
        />
      </div>

      {/* Fuel policy */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Fuel Policy</label>
        <Select value={form.fuelPolicy} onValueChange={(v) => update("fuelPolicy", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FUEL_POLICIES.map((policy) => (
              <SelectItem key={policy.value} value={policy.value}>
                {policy.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label htmlFor="cr-notes" className="text-xs font-medium">
          Notes
        </label>
        <Textarea
          id="cr-notes"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Any additional details..."
          className="min-h-12"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" size="sm" className="flex-1">
          <Save className="size-3.5" />
          Save Details
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="size-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center">
        <Car className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold">No rental details yet</p>
        <p className="text-xs text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
          Add your car rental confirmation, pickup/return details, and insurance info so it&rsquo;s all in one place.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Car className="size-3.5" />
        Add Rental Details
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface CarRentalVaultProps {
  className?: string;
}

export function CarRentalVault({ className }: CarRentalVaultProps) {
  const [rental, setRental] = useCarRental();
  const [editing, setEditing] = useState(false);

  function handleSave(data: CarRentalData) {
    setRental(data);
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  const hasData = rental !== null;

  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="size-4 text-wc-gold" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Car Rental
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            <CalendarDays className="size-2.5" />
            16 Days
          </Badge>
        </div>

        {/* Content */}
        {editing ? (
          <RentalForm
            initial={rental ?? EMPTY_RENTAL}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : hasData ? (
          <RentalDisplay data={rental} onEdit={() => setEditing(true)} />
        ) : (
          <EmptyState onAdd={() => setEditing(true)} />
        )}
      </CardContent>
    </Card>
  );
}
