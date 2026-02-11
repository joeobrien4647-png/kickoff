"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Car,
  Trophy,
  UtensilsCrossed,
  Camera,
  Zap,
  Moon,
  MoreHorizontal,
  Plus,
  CalendarDays,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { tripDays, formatTime } from "@/lib/dates";
import { countryFlag } from "@/lib/constants";
import { ItineraryItemForm } from "@/components/days/itinerary-item-form";
import type { Stop, ItineraryItem, Match } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Types & config
// ---------------------------------------------------------------------------

interface ItineraryViewProps {
  stops: Stop[];
  items: ItineraryItem[];
  matches: Match[];
}

const TYPE_CONFIG: Record<
  string,
  { icon: typeof Trophy; accent: string; dot: string; border: string }
> = {
  travel: {
    icon: Plane,
    accent: "text-wc-blue",
    dot: "bg-wc-blue",
    border: "border-l-wc-blue/50",
  },
  match: {
    icon: Trophy,
    accent: "text-wc-gold",
    dot: "bg-wc-gold",
    border: "border-l-wc-gold/50",
  },
  food: {
    icon: UtensilsCrossed,
    accent: "text-wc-coral",
    dot: "bg-wc-coral",
    border: "border-l-wc-coral/50",
  },
  sightseeing: {
    icon: Camera,
    accent: "text-wc-teal",
    dot: "bg-wc-teal",
    border: "border-l-wc-teal/50",
  },
  activity: {
    icon: Zap,
    accent: "text-purple-400",
    dot: "bg-purple-400",
    border: "border-l-purple-400/50",
  },
  rest: {
    icon: Moon,
    accent: "text-muted-foreground",
    dot: "bg-muted-foreground",
    border: "border-l-muted-foreground/30",
  },
  other: {
    icon: MoreHorizontal,
    accent: "text-muted-foreground",
    dot: "bg-muted-foreground",
    border: "border-l-muted-foreground/30",
  },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.other;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function shortDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return {
    dayOfWeek: DAY_NAMES[d.getDay()],
    dayNum: d.getDate(),
    month: MONTH_NAMES[d.getMonth()],
  };
}

/** Find which stop a date falls within (arriveDate <= date <= departDate) */
function cityForDate(date: string, stops: Stop[]): string | null {
  for (const stop of stops) {
    if (date >= stop.arriveDate && date <= stop.departDate) {
      return stop.city;
    }
  }
  return null;
}

/** Find the stop ID for a given date */
function stopIdForDate(date: string, stops: Stop[]): string | null {
  for (const stop of stops) {
    if (date >= stop.arriveDate && date <= stop.departDate) {
      return stop.id;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ItineraryView({ stops, items, matches }: ItineraryViewProps) {
  const router = useRouter();
  const days = useMemo(() => tripDays(), []);
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  // Items grouped by date for quick counts
  const itemsByDate = useMemo(() => {
    const map = new Map<string, ItineraryItem[]>();
    for (const item of items) {
      const existing = map.get(item.date) ?? [];
      existing.push(item);
      map.set(item.date, existing);
    }
    return map;
  }, [items]);

  // Matches grouped by date
  const matchesByDate = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const match of matches) {
      const existing = map.get(match.matchDate) ?? [];
      existing.push(match);
      map.set(match.matchDate, existing);
    }
    return map;
  }, [matches]);

  // Items for the selected day, sorted by startTime then sortOrder
  const dayItems = useMemo(() => {
    const raw = itemsByDate.get(selectedDate) ?? [];
    return [...raw].sort((a, b) => {
      if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
      if (a.startTime && !b.startTime) return -1;
      if (!a.startTime && b.startTime) return 1;
      return a.sortOrder - b.sortOrder;
    });
  }, [itemsByDate, selectedDate]);

  // Matches for the selected day
  const dayMatches = useMemo(
    () => matchesByDate.get(selectedDate) ?? [],
    [matchesByDate, selectedDate],
  );

  const currentCity = cityForDate(selectedDate, stops);
  const currentStopId = stopIdForDate(selectedDate, stops);

  // Day cost total
  const dayCost = useMemo(
    () => dayItems.reduce((sum, i) => sum + (i.cost ?? 0), 0),
    [dayItems],
  );

  // Scroll selected chip into view
  useEffect(() => {
    const chip = chipRefs.current.get(selectedDate);
    if (chip && scrollRef.current) {
      const container = scrollRef.current;
      const chipLeft = chip.offsetLeft;
      const chipWidth = chip.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollTarget = chipLeft - containerWidth / 2 + chipWidth / 2;
      container.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }, [selectedDate]);

  function handleAdd() {
    setEditingItem(null);
    setFormOpen(true);
  }

  function handleEdit(item: ItineraryItem) {
    setEditingItem(item);
    setFormOpen(true);
  }

  function handleFormClose(open: boolean) {
    setFormOpen(open);
    if (!open) {
      router.refresh();
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-5">
      {/* Page header */}
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Itinerary</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your day-by-day plan for the trip.
        </p>
      </section>

      {/* ---- Date selector (horizontal scroll) ---- */}
      <div
        ref={scrollRef}
        className="overflow-x-auto -mx-4 px-4 scrollbar-none"
      >
        <div className="flex gap-1.5 pb-1 w-max">
          {days.map((date) => {
            const { dayOfWeek, dayNum, month } = shortDate(date);
            const city = cityForDate(date, stops);
            const count = (itemsByDate.get(date) ?? []).length;
            const hasMatch = matchesByDate.has(date);
            const isSelected = date === selectedDate;

            return (
              <button
                key={date}
                ref={(el) => {
                  if (el) chipRefs.current.set(date, el);
                }}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center rounded-lg px-3 py-2 min-w-[72px] transition-all text-center border",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-background border-border hover:border-muted-foreground/40 hover:bg-accent/50",
                )}
              >
                <span className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  isSelected ? "text-background/70" : "text-muted-foreground",
                )}>
                  {dayOfWeek}
                </span>
                <span className="text-lg font-bold leading-tight">{dayNum}</span>
                <span className={cn(
                  "text-[10px]",
                  isSelected ? "text-background/70" : "text-muted-foreground",
                )}>
                  {month}
                </span>
                {city && (
                  <span className={cn(
                    "text-[9px] font-medium mt-0.5 truncate max-w-[64px]",
                    isSelected ? "text-background/80" : "text-muted-foreground/70",
                  )}>
                    {city}
                  </span>
                )}
                {/* Indicator dots */}
                <div className="flex items-center gap-0.5 mt-1 h-2">
                  {hasMatch && (
                    <span className={cn(
                      "size-1.5 rounded-full",
                      isSelected ? "bg-background/60" : "bg-wc-gold",
                    )} />
                  )}
                  {count > 0 && (
                    <span className={cn(
                      "size-1.5 rounded-full",
                      isSelected ? "bg-background/40" : "bg-wc-teal",
                    )} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Day header ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Day {days.indexOf(selectedDate) + 1}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {currentCity && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {currentCity}
              </span>
            )}
            {dayCost > 0 && (
              <span className="flex items-center gap-1">
                <DollarSign className="size-3" />
                {dayCost.toFixed(0)}
              </span>
            )}
            <span>
              {dayItems.length} {dayItems.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-1.5"
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {/* ---- Match banner (if matches exist for this day) ---- */}
      {dayMatches.map((match) => (
        <div
          key={match.id}
          className="flex items-center gap-3 rounded-lg border border-wc-gold/30 bg-wc-gold/5 p-3"
        >
          <Trophy className="size-5 text-wc-gold shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {countryFlag(match.homeTeam)} {match.homeTeam} vs {match.awayTeam} {countryFlag(match.awayTeam)}
            </p>
            <p className="text-xs text-muted-foreground">
              {match.venue}, {match.city}
              {match.kickoff && ` \u00b7 ${formatTime(match.kickoff)}`}
              {match.groupName && (
                <Badge
                  variant="outline"
                  className="ml-2 text-[10px] px-1.5 py-0 border-wc-gold/30 text-wc-gold"
                >
                  {match.round === "group" ? `Group ${match.groupName}` : match.round}
                </Badge>
              )}
            </p>
          </div>
        </div>
      ))}

      {/* ---- Timeline ---- */}
      {dayItems.length > 0 ? (
        <div className="relative ml-4">
          {/* Vertical line */}
          <div className="absolute left-0 top-3 bottom-3 w-px bg-border" />

          <div className="space-y-2">
            {dayItems.map((item) => {
              const config = getTypeConfig(item.type);
              const Icon =
                item.type === "travel" && item.title.toLowerCase().includes("drive")
                  ? Car
                  : config.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleEdit(item)}
                  className={cn(
                    "group relative flex w-full gap-4 rounded-lg border-l-2 p-3 pl-7 text-left transition-colors hover:bg-accent/50",
                    config.border,
                    item.type === "match" && "border border-wc-gold/20 border-l-2",
                    item.type === "travel" && "border border-dashed border-border border-l-2",
                  )}
                >
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-[-5px] top-4 size-2.5 rounded-full ring-2 ring-background",
                      config.dot,
                    )}
                  />

                  {/* Time column */}
                  {item.startTime ? (
                    <div className="shrink-0 w-16 pt-0.5">
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {formatTime(item.startTime)}
                      </span>
                    </div>
                  ) : (
                    <div className="shrink-0 w-16 pt-0.5">
                      <span className="text-[10px] text-muted-foreground/50 uppercase">
                        Anytime
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("shrink-0", config.accent)}>
                        <Icon className="size-4" />
                      </div>
                      <span className="text-sm font-medium truncate">
                        {item.title}
                      </span>
                      {!item.confirmed && (
                        <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wide shrink-0">
                          tentative
                        </span>
                      )}
                    </div>

                    {/* Time range + location */}
                    <div className="flex items-center gap-2 mt-1">
                      {item.startTime && item.endTime && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(item.startTime)} &ndash; {formatTime(item.endTime)}
                        </span>
                      )}
                      {item.location && (
                        <span className="text-xs text-muted-foreground/70 truncate">
                          {item.startTime && item.endTime ? "\u00b7 " : ""}
                          {item.location}
                        </span>
                      )}
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground/60 mt-1.5 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Cost */}
                  {item.cost != null && item.cost > 0 && (
                    <span className="text-xs font-medium text-muted-foreground tabular-nums shrink-0 pt-0.5">
                      ${item.cost}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ---- Empty state ---- */
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
          <CalendarDays className="size-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground mb-1">
            No plans yet for this day
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4">
            Add an activity, meal, or sightseeing stop.
          </p>
          <Button variant="outline" size="sm" onClick={handleAdd} className="gap-1.5">
            <Plus className="size-3.5" />
            Add to plan
          </Button>
        </div>
      )}

      {/* ---- Floating add button (mobile) ---- */}
      <Button
        onClick={handleAdd}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90 md:hidden"
      >
        <Plus className="size-5" />
      </Button>

      {/* ---- Form Sheet (reuses existing component) ---- */}
      <ItineraryItemForm
        open={formOpen}
        onOpenChange={handleFormClose}
        date={selectedDate}
        stopId={currentStopId}
        item={editingItem}
      />
    </div>
  );
}
