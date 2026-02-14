"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { tripDays, formatDate } from "@/lib/dates";
import { getCityIdentity } from "@/lib/constants";
import { CITY_GUIDES } from "@/lib/city-guides";
import type { ItineraryItem, Stop } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type MealSlot = "breakfast" | "lunch" | "dinner";

const MEAL_SLOTS: {
  key: MealSlot;
  label: string;
  time: string;
  icon: typeof Coffee;
  accent: string;
}[] = [
  { key: "breakfast", label: "Breakfast", time: "08:00", icon: Coffee, accent: "text-amber-400" },
  { key: "lunch", label: "Lunch", time: "12:30", icon: Sun, accent: "text-wc-coral" },
  { key: "dinner", label: "Dinner", time: "19:00", icon: Moon, accent: "text-wc-blue" },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function shortDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return {
    dayOfWeek: DAY_NAMES[d.getDay()],
    dayNum: d.getDate(),
  };
}

/** Map a startTime to a meal slot key */
function timeToSlot(startTime: string | null): MealSlot | null {
  if (!startTime) return null;
  const [h] = startTime.split(":").map(Number);
  if (h < 11) return "breakfast";
  if (h < 16) return "lunch";
  return "dinner";
}

/** Find which stop a date falls within */
function cityForDate(date: string, stops: Stop[]): string | null {
  for (const stop of stops) {
    if (date >= stop.arriveDate && date <= stop.departDate) {
      return stop.city;
    }
  }
  return null;
}

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

export function MealPlanner() {
  const router = useRouter();
  const days = useMemo(() => tripDays(), []);

  // Data
  const [meals, setMeals] = useState<ItineraryItem[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);

  // Sheet form
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [activeDate, setActiveDate] = useState("");
  const [activeSlot, setActiveSlot] = useState<MealSlot>("breakfast");

  // Form fields
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Quick picks panel
  const [showPicks, setShowPicks] = useState(false);

  // ---- Fetch data ----
  const fetchData = useCallback(async () => {
    try {
      const [itineraryRes, settingsRes] = await Promise.all([
        fetch("/api/itinerary"),
        fetch("/api/settings"),
      ]);
      if (itineraryRes.ok) {
        const items: ItineraryItem[] = await itineraryRes.json();
        setMeals(items.filter((i) => i.type === "food"));
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setStops(data.stops ?? []);
      }
    } catch {
      toast.error("Failed to load meal data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---- Derived data ----

  /** Group meals by date+slot for O(1) lookup */
  const mealMap = useMemo(() => {
    const map = new Map<string, ItineraryItem>();
    for (const meal of meals) {
      const slot = timeToSlot(meal.startTime);
      if (slot) {
        map.set(`${meal.date}:${slot}`, meal);
      }
    }
    return map;
  }, [meals]);

  const totalSlots = days.length * 3;
  const plannedCount = mealMap.size;
  const progressPct = Math.round((plannedCount / totalSlots) * 100);

  // ---- Form helpers ----

  function resetForm() {
    setTitle("");
    setTime("");
    setLocation("");
    setCost("");
    setNotes("");
    setShowPicks(false);
    setEditingItem(null);
  }

  function openAddSheet(date: string, slot: MealSlot) {
    resetForm();
    setActiveDate(date);
    setActiveSlot(slot);
    const slotConfig = MEAL_SLOTS.find((s) => s.key === slot)!;
    setTime(slotConfig.time);
    setSheetOpen(true);
  }

  function openEditSheet(item: ItineraryItem, slot: MealSlot) {
    setEditingItem(item);
    setActiveDate(item.date);
    setActiveSlot(slot);
    setTitle(item.title);
    setTime(item.startTime || "");
    setLocation(item.location || "");
    setCost(item.cost != null ? String(item.cost) : "");
    setNotes(item.notes || "");
    setShowPicks(false);
    setSheetOpen(true);
  }

  function handleSheetChange(open: boolean) {
    setSheetOpen(open);
    if (!open) resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      if (editingItem) {
        // PATCH existing
        const res = await fetch(`/api/itinerary/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            startTime: time || null,
            location: location.trim() || null,
            cost: cost ? Number(cost) : null,
            notes: notes.trim() || null,
          }),
        });
        if (!res.ok) throw new Error("Failed to update meal");
        toast.success("Meal updated!");
      } else {
        // POST new
        const res = await fetch("/api/itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            type: "food",
            date: activeDate,
            stopId: stopIdForDate(activeDate, stops) || undefined,
            startTime: time || MEAL_SLOTS.find((s) => s.key === activeSlot)!.time,
            location: location.trim() || undefined,
            cost: cost ? Number(cost) : undefined,
            notes: notes.trim() || undefined,
          }),
        });
        if (!res.ok) throw new Error("Failed to add meal");
        toast.success("Meal added!");
      }

      setSheetOpen(false);
      resetForm();
      router.refresh();
      await fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editingItem) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/itinerary/${editingItem.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove meal");
      toast.success("Meal removed!");
      setSheetOpen(false);
      resetForm();
      router.refresh();
      await fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove meal");
    } finally {
      setSubmitting(false);
    }
  }

  function selectQuickPick(restaurant: { name: string; type: string; priceRange: string; oneLiner: string }) {
    setTitle(restaurant.name);
    setNotes(restaurant.oneLiner);
    setShowPicks(false);
  }

  // ---- Loading state ----

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <UtensilsCrossed className="size-6 text-muted-foreground animate-pulse" />
      </div>
    );
  }

  // ---- Quick picks for active sheet ----
  const activeCity = activeDate ? cityForDate(activeDate, stops) : null;
  const activeCityGuide = activeCity ? CITY_GUIDES[activeCity] : null;

  // ---- Render ----

  return (
    <div className="space-y-5">
      {/* Header + Progress */}
      <section className="pt-4 md:pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="size-6 text-wc-coral" />
              Meal Planner
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Plan breakfast, lunch, and dinner for each day.
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-xs tabular-nums",
              progressPct === 100 && "border-emerald-400/50 text-emerald-400",
            )}
          >
            {plannedCount} of {totalSlots} meals planned
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              progressPct === 100 ? "bg-emerald-400" : "bg-wc-coral",
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </section>

      {/* Day cards */}
      <div className="space-y-3">
        {days.map((date) => {
          const { dayOfWeek, dayNum } = shortDayLabel(date);
          const city = cityForDate(date, stops);
          const identity = city ? getCityIdentity(city) : null;
          const dayMealsPlanned = MEAL_SLOTS.filter(
            (s) => mealMap.has(`${date}:${s.key}`),
          ).length;

          return (
            <Card
              key={date}
              className={cn(
                "py-0 overflow-hidden",
                identity && `border-l-4 ${identity.border}`,
              )}
            >
              <CardContent className="p-0">
                {/* Day header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="text-center leading-tight">
                      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {dayOfWeek}
                      </div>
                      <div className="text-lg font-bold">{dayNum}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{formatDate(date)}</div>
                      {city && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          <span className={identity?.color}>{city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] tabular-nums",
                      dayMealsPlanned === 3
                        ? "border-emerald-400/50 text-emerald-400"
                        : dayMealsPlanned > 0
                          ? "border-wc-coral/50 text-wc-coral"
                          : "",
                    )}
                  >
                    {dayMealsPlanned}/3
                  </Badge>
                </div>

                {/* Meal slots */}
                <div className="divide-y divide-border/30">
                  {MEAL_SLOTS.map((slot) => {
                    const key = `${date}:${slot.key}`;
                    const meal = mealMap.get(key);
                    const Icon = slot.icon;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          meal
                            ? openEditSheet(meal, slot.key)
                            : openAddSheet(date, slot.key)
                        }
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/50 group",
                        )}
                      >
                        {/* Icon */}
                        <div className={cn("shrink-0", slot.accent)}>
                          <Icon className="size-4" />
                        </div>

                        {/* Slot label + content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground w-16 shrink-0">
                              {slot.label}
                            </span>
                            {meal ? (
                              <span className="text-sm font-medium truncate">
                                {meal.title}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground/50 italic">
                                Not planned
                              </span>
                            )}
                          </div>
                          {meal && (meal.location || meal.notes) && (
                            <div className="ml-16 flex items-center gap-2 mt-0.5">
                              {meal.location && (
                                <span className="text-xs text-muted-foreground/70 truncate">
                                  {meal.location}
                                </span>
                              )}
                              {meal.notes && (
                                <span className="text-xs text-muted-foreground/50 truncate hidden sm:inline">
                                  {meal.location ? " \u00b7 " : ""}
                                  {meal.notes}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Cost + action hint */}
                        <div className="flex items-center gap-2 shrink-0">
                          {meal?.cost != null && meal.cost > 0 && (
                            <span className="text-xs font-medium text-muted-foreground tabular-nums">
                              ${meal.cost}/pp
                            </span>
                          )}
                          {meal ? (
                            <Pencil className="size-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                          ) : (
                            <Plus className="size-3.5 text-muted-foreground/30 group-hover:text-wc-coral transition-colors" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ---- Add / Edit Sheet ---- */}
      <Sheet open={sheetOpen} onOpenChange={handleSheetChange}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingItem ? "Edit Meal" : `Add ${MEAL_SLOTS.find((s) => s.key === activeSlot)?.label}`}
            </SheetTitle>
            <SheetDescription>
              {formatDate(activeDate)}
              {activeCity && ` \u00b7 ${activeCity}`}
            </SheetDescription>
          </SheetHeader>

          {/* Quick picks */}
          {!editingItem && activeCityGuide && activeCityGuide.restaurants.length > 0 && (
            <div className="px-4">
              <button
                type="button"
                onClick={() => setShowPicks(!showPicks)}
                className="flex items-center gap-1.5 text-xs font-medium text-wc-coral hover:text-wc-coral/80 transition-colors"
              >
                <Sparkles className="size-3.5" />
                {showPicks ? "Hide suggestions" : `Suggest from ${activeCity} guide`}
              </button>

              {showPicks && (
                <div className="mt-2 space-y-1">
                  {activeCityGuide.restaurants.map((r) => (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => selectQuickPick(r)}
                      className="flex w-full items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-left transition-colors hover:bg-accent/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{r.name}</span>
                          <span className="text-xs text-muted-foreground">{r.type}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {r.priceRange}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {r.oneLiner}
                        </p>
                      </div>
                      <Plus className="size-3.5 shrink-0 text-muted-foreground/50" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Restaurant name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Restaurant / Place</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Joe's Pizza"
                required
              />
            </div>

            {/* Time + Cost side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Est. Cost / Person</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="$"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Location / Address</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={`e.g. "Joe's pick", "need reservation"`}
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {editingItem && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4 mr-1.5" />
                  Remove
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1"
                disabled={submitting || !title.trim()}
              >
                {submitting
                  ? editingItem ? "Saving..." : "Adding..."
                  : editingItem ? "Save Changes" : `Add ${MEAL_SLOTS.find((s) => s.key === activeSlot)?.label}`}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
