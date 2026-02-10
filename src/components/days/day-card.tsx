import Link from "next/link";
import {
  Trophy,
  Car,
  MapPin,
  CalendarDays,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dates";
import { countryFlag } from "@/lib/constants";
import type { Stop, ItineraryItem, Match } from "@/lib/schema";

interface DayCardProps {
  date: string;
  dayNumber: number;
  stop: Stop | null;
  items: ItineraryItem[];
  matches: Match[];
  driveInfo: { miles: number; hours: number; minutes: number } | null;
}

export function DayCard({
  date,
  dayNumber,
  stop,
  items,
  matches,
  driveInfo,
}: DayCardProps) {
  const hasMatch = matches.length > 0;
  const hasItems = items.length > 0;
  const hasTravelItem = items.some((item) => item.type === "travel");
  const activityCount = items.filter(
    (item) => item.type !== "travel" && item.type !== "match"
  ).length;

  // Gradient background by priority: match > travel > activities > open
  const cardStyle = hasMatch
    ? "bg-gradient-to-br from-wc-gold/10 via-transparent to-transparent border-wc-gold/40"
    : hasTravelItem
      ? "bg-gradient-to-br from-wc-blue/8 via-transparent to-transparent border-wc-blue/30 border-dashed"
      : hasItems
        ? "bg-wc-teal/5 border-wc-teal/30"
        : "bg-wc-coral/5 border-dashed border-wc-coral/20";

  // Weekday short name for context
  const d = new Date(date + "T12:00:00");
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });

  return (
    <Link href={`/days/${date}`}>
      <Card
        className={cn(
          "transition-all hover:bg-accent/50 hover:shadow-md cursor-pointer py-4 h-full",
          cardStyle
        )}
      >
        <CardContent className="space-y-2.5">
          {/* Date and Day Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-foreground">
                Day {dayNumber}
              </span>
              <span className="text-xs text-muted-foreground">
                {weekday}
              </span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatDate(date)}
            </span>
          </div>

          {/* Stop Name */}
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-wc-teal shrink-0" />
            <span className="text-sm font-medium truncate">
              {stop?.city ?? "No stop"}
            </span>
          </div>

          {/* Match info: show team names with flags */}
          {hasMatch && (
            <div className="space-y-1">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center gap-1.5 rounded bg-wc-gold/10 px-2 py-1"
                >
                  <Trophy className="size-3 text-wc-gold shrink-0" />
                  <span className="text-xs font-medium text-wc-gold truncate">
                    {countryFlag(match.homeTeam)} {match.homeTeam} vs {match.awayTeam} {countryFlag(match.awayTeam)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-3 pt-0.5">
            {activityCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-wc-teal">
                <CalendarDays className="size-3.5" />
                {activityCount} item{activityCount !== 1 && "s"}
              </span>
            )}

            {hasTravelItem && (
              <span className="flex items-center gap-1 text-xs text-wc-blue">
                <Car className="size-3.5" />
                Travel
              </span>
            )}

            {driveInfo && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {driveInfo.hours > 0 && `${driveInfo.hours}h`}
                {driveInfo.minutes > 0 && `${driveInfo.minutes}m`}
              </span>
            )}

            {!hasMatch && !hasItems && (
              <span className="text-xs text-muted-foreground/50 italic">
                Nothing planned
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
