"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckSquare,
  Square,
  Plane,
  RotateCcw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const OUTBOUND_ITEMS = [
  "Online check-in (24h before)",
  "Boarding passes downloaded",
  "Passport in hand bag",
  "ESTA confirmation saved offline",
  "Travel insurance docs accessible",
  "Bag under 23kg (weigh it!)",
  "Hand luggage under 10kg",
  "Liquids in clear bag (100ml max)",
  "Phone charger in hand luggage",
  "Entertainment downloaded (Netflix/Spotify)",
  "Arrive at airport 3hr before",
  "Notify bank of US travel",
] as const;

const RETURN_ITEMS = [
  "Online check-in done",
  "Boarding passes ready",
  "Souvenirs packed (watch weight limit!)",
  "Return car rental (full tank!)",
  "Leave for airport 3hr early (Miami traffic)",
  "Duty-free shopping done",
  "Customs declaration if needed (\u00A3390 limit)",
  "Phone/devices charged for flight",
] as const;

type Section = "outbound" | "return";

const STORAGE_KEYS: Record<Section, string> = {
  outbound: "flightChecklist_outbound",
  return: "flightChecklist_return",
};

const SECTION_META: Record<
  Section,
  { label: string; route: string; items: readonly string[] }
> = {
  outbound: {
    label: "Outbound",
    route: "Boston \u2192 London",
    items: OUTBOUND_ITEMS,
  },
  return: {
    label: "Return",
    route: "Miami \u2192 London",
    items: RETURN_ITEMS,
  },
};

function loadChecked(section: Section): boolean[] {
  const items = SECTION_META[section].items;
  if (typeof window === "undefined") return Array(items.length).fill(false);

  try {
    const raw = localStorage.getItem(STORAGE_KEYS[section]);
    if (!raw) return Array(items.length).fill(false);
    const indices: number[] = JSON.parse(raw);
    const state = Array(items.length).fill(false) as boolean[];
    for (const i of indices) {
      if (i >= 0 && i < items.length) state[i] = true;
    }
    return state;
  } catch {
    return Array(items.length).fill(false);
  }
}

function saveChecked(section: Section, checked: boolean[]) {
  const indices = checked.reduce<number[]>((acc, val, i) => {
    if (val) acc.push(i);
    return acc;
  }, []);
  localStorage.setItem(STORAGE_KEYS[section], JSON.stringify(indices));
}

function ChecklistSection({ section }: { section: Section }) {
  const { items, route } = SECTION_META[section];
  const total = items.length;

  const [checked, setChecked] = useState<boolean[]>(() =>
    loadChecked(section)
  );

  // Reload if section changes (tab switch)
  useEffect(() => {
    setChecked(loadChecked(section));
  }, [section]);

  const doneCount = checked.filter(Boolean).length;
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const toggle = useCallback(
    (index: number) => {
      setChecked((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        saveChecked(section, next);
        return next;
      });
    },
    [section]
  );

  function reset() {
    const cleared = Array(total).fill(false) as boolean[];
    setChecked(cleared);
    saveChecked(section, cleared);
  }

  return (
    <div className="space-y-3">
      {/* Route label + progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            Virgin Atlantic
          </Badge>
          <span className="text-xs text-muted-foreground">{route}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-wc-blue">
            {doneCount}/{total}
          </span>
          {doneCount > 0 && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={reset}
              aria-label={`Reset ${section} checklist`}
            >
              <RotateCcw className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-wc-blue transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Items */}
      <ul className="space-y-1">
        {items.map((label, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              className={cn(
                "flex items-center gap-2.5 w-full rounded-md px-2 py-2 text-left text-sm transition-colors",
                "hover:bg-muted/50 active:bg-muted",
                "min-h-[44px]"
              )}
            >
              {checked[i] ? (
                <CheckSquare className="size-4.5 shrink-0 text-wc-blue" />
              ) : (
                <Square className="size-4.5 shrink-0 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "leading-snug",
                  checked[i]
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FlightChecklist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Plane className="size-4 text-wc-blue" />
          <span>Flights</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="-mt-2">
        <Tabs defaultValue="outbound">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="outbound">Outbound</TabsTrigger>
            <TabsTrigger value="return">Return</TabsTrigger>
          </TabsList>

          <TabsContent value="outbound" className="pt-4">
            <ChecklistSection section="outbound" />
          </TabsContent>

          <TabsContent value="return" className="pt-4">
            <ChecklistSection section="return" />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Virgin Atlantic allows 1 &times; 23kg checked + 1 &times; 10kg cabin +
          1 small bag
        </p>
      </CardFooter>
    </Card>
  );
}
