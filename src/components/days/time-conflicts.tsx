"use client";

import { useMemo } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/dates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TimeConflictProps = {
  items: Array<{
    title: string;
    startTime: string | null; // "14:00"
    endTime: string | null; // "16:00"
    type: string;
  }>;
  matches: Array<{
    homeTeam: string;
    awayTeam: string;
    kickoff: string; // "15:00"
  }>;
};

type TimeSlot = {
  label: string;
  start: number; // minutes since midnight
  end: number; // minutes since midnight
};

type Conflict = {
  a: TimeSlot;
  b: TimeSlot;
  overlapStart: number;
  overlapEnd: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse "HH:MM" to minutes since midnight */
function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Format minutes back to "HH:MM" for display */
function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Build unified time slots from itinerary items and matches */
function buildTimeSlots(
  items: TimeConflictProps["items"],
  matches: TimeConflictProps["matches"]
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (const item of items) {
    if (!item.startTime) continue;

    const start = parseTime(item.startTime);
    const end = item.endTime ? parseTime(item.endTime) : start + 60; // default 1h

    slots.push({ label: item.title, start, end });
  }

  for (const match of matches) {
    if (!match.kickoff) continue;

    const start = parseTime(match.kickoff);
    const end = start + 120; // 2h duration

    slots.push({
      label: `${match.homeTeam} vs ${match.awayTeam}`,
      start,
      end,
    });
  }

  return slots;
}

/** Find all overlapping pairs */
function findConflicts(slots: TimeSlot[]): Conflict[] {
  const conflicts: Conflict[] = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];

      // Overlap exists when one starts before the other ends
      const overlapStart = Math.max(a.start, b.start);
      const overlapEnd = Math.min(a.end, b.end);

      if (overlapStart < overlapEnd) {
        conflicts.push({ a, b, overlapStart, overlapEnd });
      }
    }
  }

  return conflicts;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TimeConflicts({ items, matches }: TimeConflictProps) {
  const conflicts = useMemo(() => {
    const slots = buildTimeSlots(items, matches);
    return findConflicts(slots);
  }, [items, matches]);

  if (conflicts.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border p-3 space-y-2",
        "bg-amber-50 dark:bg-amber-950/20",
        "border-amber-200 dark:border-amber-900/30"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-500 shrink-0" />
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
          Time Conflict{conflicts.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Conflict list */}
      <ul className="space-y-1.5">
        {conflicts.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <Clock className="size-3 text-amber-500/70 mt-0.5 shrink-0" />
            <span className="text-amber-800 dark:text-amber-300/90">
              <span className="font-medium">{c.a.label}</span>
              {" overlaps with "}
              <span className="font-medium">{c.b.label}</span>
              {" "}
              <span className="text-amber-600 dark:text-amber-400/70">
                ({formatTime(minutesToTime(c.overlapStart))}
                {" \u2013 "}
                {formatTime(minutesToTime(c.overlapEnd))})
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Suggestion */}
      <p className="text-[11px] text-amber-600/80 dark:text-amber-400/60">
        Consider rescheduling one of these
      </p>
    </div>
  );
}
