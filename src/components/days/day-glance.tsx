import {
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
  MapPin,
  Trophy,
  Car,
  CalendarDays,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getCityIdentity } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CITY_ICONS: Record<string, typeof MapPin> = {
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
  MapPin,
};

interface DayGlanceProps {
  city: string | null;
  matchCount: number;
  isTravelDay: boolean;
  plannedCount: number;
  ideaCount: number;
  accommodationConfirmed: boolean | null; // null = no accommodation at all
}

export function DayGlance({
  city,
  matchCount,
  isTravelDay,
  plannedCount,
  ideaCount,
  accommodationConfirmed,
}: DayGlanceProps) {
  const identity = city ? getCityIdentity(city) : null;
  const CityIcon = identity ? (CITY_ICONS[identity.icon] ?? MapPin) : MapPin;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {/* Where am I? */}
      <div
        className={cn(
          "rounded-md px-3 py-2 border flex items-center gap-2",
          identity
            ? cn(identity.bg, identity.border, identity.color)
            : "bg-muted/8 border-border text-muted-foreground"
        )}
      >
        <CityIcon className="size-3.5 shrink-0" />
        <span className="text-xs font-medium truncate">
          {city ?? "In transit"}
        </span>
      </div>

      {/* What's happening? */}
      <div
        className={cn(
          "rounded-md px-3 py-2 border flex items-center gap-2",
          matchCount > 0
            ? "bg-wc-gold/10 border-wc-gold/30 text-wc-gold"
            : isTravelDay
              ? "bg-wc-blue/10 border-wc-blue/30 text-wc-blue"
              : "bg-muted/50 border-border text-muted-foreground"
        )}
      >
        {matchCount > 0 ? (
          <>
            <Trophy className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">
              {matchCount} match{matchCount !== 1 && "es"}
            </span>
          </>
        ) : isTravelDay ? (
          <>
            <Car className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">Travel day</span>
          </>
        ) : (
          <>
            <CalendarDays className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">
              {plannedCount} planned
            </span>
          </>
        )}
      </div>

      {/* Options */}
      <div className="rounded-md px-3 py-2 border flex items-center gap-2 bg-amber-500/8 border-amber-500/25 text-amber-400">
        <Lightbulb className="size-3.5 shrink-0" />
        <span className="text-xs font-medium">
          {ideaCount} idea{ideaCount !== 1 && "s"}
        </span>
      </div>

      {/* Action needed */}
      <div
        className={cn(
          "rounded-md px-3 py-2 border flex items-center gap-2",
          accommodationConfirmed === null
            ? "bg-muted/50 border-border text-muted-foreground"
            : accommodationConfirmed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-wc-coral/10 border-wc-coral/30 text-wc-coral"
        )}
      >
        {accommodationConfirmed === null ? (
          <>
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">No stay</span>
          </>
        ) : accommodationConfirmed ? (
          <>
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">All set</span>
          </>
        ) : (
          <>
            <AlertCircle className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">No booking</span>
          </>
        )}
      </div>
    </div>
  );
}
