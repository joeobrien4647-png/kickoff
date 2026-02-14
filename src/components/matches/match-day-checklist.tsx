"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckSquare, Square, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STADIUM_ITEMS = [
  "Tickets ready (digital or printed)",
  "Phone fully charged",
  "Portable charger packed",
  "Jersey/fan gear on",
  "Sunscreen applied (if day match)",
  "Water bottle filled",
  "Cash for parking/vendors ($50+)",
  "Meeting point agreed with lads",
  "Transport to stadium sorted",
  "ID/passport on you",
] as const;

const BAR_ITEMS = [
  "Found a good spot (arrive 1hr early)",
  "Phone charged + portable charger",
  "Jersey/fan gear on",
  "Cash + card ready",
  "Know the address + how to get there",
  "Meeting point agreed",
  "Screen visible from your seat",
  "Food/drinks ordered",
] as const;

interface MatchDayChecklistProps {
  matchId: string;
  matchLabel: string;
  isStadium: boolean;
}

function storageKey(matchId: string) {
  return `matchChecklist_${matchId}`;
}

function loadChecked(matchId: string, total: number): boolean[] {
  if (typeof window === "undefined") return Array(total).fill(false);

  try {
    const raw = localStorage.getItem(storageKey(matchId));
    if (!raw) return Array(total).fill(false);
    const indices: number[] = JSON.parse(raw);
    const state = Array(total).fill(false);
    for (const i of indices) {
      if (i >= 0 && i < total) state[i] = true;
    }
    return state;
  } catch {
    return Array(total).fill(false);
  }
}

function saveChecked(matchId: string, checked: boolean[]) {
  const indices = checked.reduce<number[]>((acc, val, i) => {
    if (val) acc.push(i);
    return acc;
  }, []);
  localStorage.setItem(storageKey(matchId), JSON.stringify(indices));
}

export function MatchDayChecklist({
  matchId,
  matchLabel,
  isStadium,
}: MatchDayChecklistProps) {
  const items = isStadium ? STADIUM_ITEMS : BAR_ITEMS;
  const total = items.length;

  const [checked, setChecked] = useState<boolean[]>(() =>
    loadChecked(matchId, total)
  );
  const [expanded, setExpanded] = useState(false);

  // Sync from localStorage when matchId changes
  useEffect(() => {
    setChecked(loadChecked(matchId, total));
  }, [matchId, total]);

  const doneCount = checked.filter(Boolean).length;
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const toggle = useCallback(
    (index: number) => {
      setChecked((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        saveChecked(matchId, next);
        return next;
      });
    },
    [matchId]
  );

  function reset() {
    const cleared = Array(total).fill(false) as boolean[];
    setChecked(cleared);
    saveChecked(matchId, cleared);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span>{isStadium ? "Stadium" : "Bar"} Day Prep</span>
          <span className="text-muted-foreground font-normal text-xs">
            {doneCount}/{total}
          </span>
        </CardTitle>
        <CardAction className="flex items-center gap-1">
          {doneCount > 0 && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={reset}
              aria-label="Reset checklist"
            >
              <RotateCcw className="size-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse checklist" : "Expand checklist"}
          >
            {expanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </Button>
        </CardAction>
      </CardHeader>

      {/* Progress bar - always visible */}
      <CardContent className="-mt-3">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-wc-teal transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {matchLabel}
        </p>
      </CardContent>

      {/* Expanded items */}
      {expanded && (
        <CardContent className="-mt-2">
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
                    <CheckSquare className="size-4.5 shrink-0 text-wc-teal" />
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
        </CardContent>
      )}
    </Card>
  );
}
