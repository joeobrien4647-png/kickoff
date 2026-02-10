import {
  Home,
  Hotel,
  Bed,
  Users,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Accommodation } from "@/lib/schema";

interface AccommodationCardProps {
  accommodation: Accommodation;
}

const TYPE_ICONS: Record<string, typeof Home> = {
  host: Users,
  hotel: Hotel,
  airbnb: Home,
  hostel: Bed,
  other: Home,
};

const TYPE_LABELS: Record<string, string> = {
  host: "Staying with Host",
  hotel: "Hotel",
  airbnb: "Airbnb",
  hostel: "Hostel",
  other: "Accommodation",
};

export function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const Icon = TYPE_ICONS[accommodation.type] ?? Home;
  const typeLabel = TYPE_LABELS[accommodation.type] ?? "Accommodation";

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-md bg-muted p-2 shrink-0">
            <Icon className="size-4 text-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">
              {accommodation.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {typeLabel}
            </p>
          </div>
        </div>

        {/* Confirmed badge */}
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 gap-1 text-[10px] uppercase tracking-wide",
            accommodation.confirmed
              ? "border-emerald-500/40 text-emerald-400"
              : "border-amber-500/40 text-amber-400"
          )}
        >
          {accommodation.confirmed ? (
            <CheckCircle2 className="size-3" />
          ) : (
            <AlertCircle className="size-3" />
          )}
          {accommodation.confirmed ? "Confirmed" : "Unconfirmed"}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        {accommodation.address && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0 mt-0.5" />
            <span>{accommodation.address}</span>
          </div>
        )}
        {accommodation.contact && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Phone className="size-3 shrink-0 mt-0.5" />
            <span>{accommodation.contact}</span>
          </div>
        )}
      </div>

      {/* Cost per night */}
      {accommodation.costPerNight != null && accommodation.costPerNight > 0 && (
        <div className="flex items-baseline gap-1 pt-1 border-t border-border">
          <span className="text-sm font-semibold tabular-nums">
            ${accommodation.costPerNight}
          </span>
          <span className="text-xs text-muted-foreground">
            / night
            {accommodation.nights != null && accommodation.nights > 0 && (
              <> &middot; {accommodation.nights} night{accommodation.nights !== 1 && "s"}</>
            )}
          </span>
        </div>
      )}

      {/* Notes */}
      {accommodation.notes && (
        <p className="text-xs text-muted-foreground/80 pt-1 border-t border-border">
          {accommodation.notes}
        </p>
      )}
    </div>
  );
}
