import {
  MapPin,
  Car,
  ArrowRight,
  Clock,
  Route,
  Trophy,
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCityIdentity } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Stop, Match } from "@/lib/schema";

const CITY_ICONS: Record<string, typeof MapPin> = {
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
  MapPin,
};

interface DayHeaderProps {
  date: string;
  dayNumber: number;
  stop: Stop | null;
  isTravelDay: boolean;
  driveInfo: { miles: number; hours: number; minutes: number } | null;
  fromCity: string | null;
  toCity: string | null;
  matches: Match[];
}

export function DayHeader({
  date,
  dayNumber,
  stop,
  isTravelDay,
  driveInfo,
  fromCity,
  toCity,
  matches,
}: DayHeaderProps) {
  // Format: "Friday, 13 June"
  const d = new Date(date + "T12:00:00");
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const dayMonth = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  const identity = stop ? getCityIdentity(stop.city) : null;
  const CityIcon = identity ? (CITY_ICONS[identity.icon] ?? MapPin) : null;

  return (
    <div className="space-y-3">
      {/* City identity gradient band */}
      {stop && identity && CityIcon && (
        <div
          className={cn(
            "rounded-lg border px-4 py-2.5 flex items-center gap-2",
            identity.border,
            `bg-gradient-to-r ${identity.gradient}`
          )}
        >
          <CityIcon className={cn("size-4", identity.color)} />
          <span className={cn("text-sm font-semibold", identity.color)}>
            {stop.city}
          </span>
          {identity.tagline && (
            <span className="text-xs text-muted-foreground ml-1">
              &mdash; {identity.tagline}
            </span>
          )}
        </div>
      )}

      {/* Day number + formatted date */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Day {dayNumber}{" "}
          <span className="text-muted-foreground font-normal">&mdash;</span>{" "}
          <span className="text-foreground/80 font-semibold">{weekday}, {dayMonth}</span>
        </h1>
      </div>

      {/* Stop badge */}
      {stop && (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="gap-1.5 border-wc-teal/40 text-wc-teal px-3 py-1 text-sm"
          >
            <MapPin className="size-3.5" />
            {stop.city}, {stop.state}
          </Badge>

          {isTravelDay && (
            <Badge
              variant="outline"
              className="gap-1.5 border-wc-blue/40 text-wc-blue px-3 py-1 text-sm"
            >
              <Car className="size-3.5" />
              Travel Day
            </Badge>
          )}
        </div>
      )}

      {/* Match day ribbon */}
      {matches.length > 0 && (
        <div className="bg-gradient-to-r from-wc-gold/15 to-transparent border border-wc-gold/25 rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Trophy className="size-4 text-wc-gold shrink-0" />
            <span className="text-sm font-semibold text-wc-gold">Match Day</span>
            <span className="text-xs text-muted-foreground">
              {matches[0].homeTeam} vs {matches[0].awayTeam}
              {matches.length > 1 && ` +${matches.length - 1} more`}
            </span>
          </div>
        </div>
      )}

      {/* Drive info card */}
      {driveInfo && fromCity && toCity && (
        <div className="rounded-lg border border-dashed border-wc-blue/30 bg-wc-blue/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Route className="size-4 text-wc-blue" />
            <span className="text-sm font-medium text-wc-blue">Driving Today</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">{fromCity}</span>
            <ArrowRight className="size-4 text-muted-foreground" />
            <span className="font-medium">{toCity}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Car className="size-3" />
              {driveInfo.miles} miles
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {driveInfo.hours > 0 && `${driveInfo.hours}h `}
              {driveInfo.minutes}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
