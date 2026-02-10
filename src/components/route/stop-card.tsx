import Link from "next/link";
import {
  Home,
  Trophy,
  Lightbulb,
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dates";
import { TICKET_STATUS, getCityIdentity, countryFlag } from "@/lib/constants";
import type { RouteStop } from "@/app/route/page";

/** Map city identity icon strings to actual Lucide components */
const CITY_ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap,
  Building2,
  Landmark,
  Building,
  TreePine,
  Waves,
  MapPin,
};

interface StopCardProps {
  routeStop: RouteStop;
}

function nightCount(arrive: string, depart: string): number {
  const a = new Date(arrive + "T12:00:00");
  const d = new Date(depart + "T12:00:00");
  return Math.round((d.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/** Accommodation type displayed as a short label */
const ACC_TYPE_LABELS: Record<string, string> = {
  host: "Host",
  hotel: "Hotel",
  airbnb: "Airbnb",
  hostel: "Hostel",
  other: "Other",
};

export function StopCard({ routeStop }: StopCardProps) {
  const { stop, accommodation, matches, ideaCount } = routeStop;
  const nights = nightCount(stop.arriveDate, stop.departDate);
  const confirmed = accommodation?.confirmed ?? false;

  const identity = getCityIdentity(stop.city);
  const CityIcon = CITY_ICON_MAP[identity.icon] ?? MapPin;

  return (
    <Card className={cn("py-4 border-l-4 mb-4", identity.border, `bg-gradient-to-br ${identity.gradient}`)}>
      <CardContent className="space-y-3">
        {/* City + dates */}
        <div>
          <h3 className="text-lg font-bold leading-tight flex items-center gap-2">
            <CityIcon className={cn("size-4 shrink-0", identity.color)} />
            {stop.city}, {stop.state}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(stop.arriveDate)} &ndash; {formatDate(stop.departDate)}{" "}
            &middot;{" "}
            {nights} {nights === 1 ? "night" : "nights"}
          </p>
        </div>

        {/* Accommodation */}
        {accommodation && (
          <div className="flex items-center gap-2 text-sm">
            <Home className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{accommodation.name}</span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 shrink-0"
            >
              {ACC_TYPE_LABELS[accommodation.type] ?? accommodation.type}
            </Badge>
            {confirmed ? (
              <span className="text-[10px] text-emerald-400 font-medium shrink-0">
                confirmed
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 font-medium shrink-0">
                not booked
              </span>
            )}
          </div>
        )}

        {/* Matches */}
        {matches.length > 0 && (
          <div className="space-y-1.5">
            {matches.map((match) => {
              const isMustSee = match.priority >= 3;
              const ticketMeta =
                TICKET_STATUS[
                  match.ticketStatus as keyof typeof TICKET_STATUS
                ] ?? TICKET_STATUS.none;

              return (
                <div key={match.id} className="flex items-center gap-2 text-sm">
                  <Trophy
                    className={cn(
                      "size-3.5 shrink-0",
                      isMustSee ? "text-wc-gold" : "text-muted-foreground"
                    )}
                  />
                  <span className="truncate">
                    {countryFlag(match.homeTeam)} {match.homeTeam} vs {match.awayTeam} {countryFlag(match.awayTeam)}
                  </span>
                  {isMustSee && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-wc-gold/40 text-wc-gold shrink-0"
                    >
                      Must See
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 shrink-0",
                      ticketMeta.color
                    )}
                  >
                    {ticketMeta.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {/* Idea count */}
        {ideaCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="size-3.5 shrink-0" />
            <span>
              {ideaCount} {ideaCount === 1 ? "idea" : "ideas"} saved
            </span>
          </div>
        )}

        {/* Link to first day of this stop */}
        <Link
          href={`/days/${stop.arriveDate}`}
          className="inline-block text-xs text-wc-teal hover:underline mt-1"
        >
          View days &rarr;
        </Link>
      </CardContent>
    </Card>
  );
}
