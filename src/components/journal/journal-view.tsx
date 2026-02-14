"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JournalCard } from "@/components/journal/journal-card";
import { AddJournalForm } from "@/components/journal/add-journal-form";
import { today, TRIP_START } from "@/lib/dates";
import type { Stop, JournalEntry } from "@/lib/schema";

interface JournalViewProps {
  entries: JournalEntry[];
  stops: Stop[];
  currentUser: string;
}

export function JournalView({ entries, stops, currentUser }: JournalViewProps) {
  const router = useRouter();

  // Check if today already has an entry
  const todayStr = today();
  const hasTodayEntry = entries.some((e) => e.date === todayStr);

  // Build a lookup: stopId -> city
  const stopCityMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of stops) {
      map.set(s.id, s.city);
    }
    return map;
  }, [stops]);

  // Compute day number from TRIP_START for each entry
  function getDayNumber(dateStr: string): number {
    const start = new Date(TRIP_START);
    const d = new Date(dateStr);
    return Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  function handleMutate() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Add Today's Recap button */}
      {!hasTodayEntry && (
        <AddJournalForm stops={stops} currentUser={currentUser}>
          <Button className="w-full bg-wc-teal text-white hover:bg-wc-teal/90 gap-2">
            <Plus className="size-4" />
            Add Today&apos;s Recap
          </Button>
        </AddJournalForm>
      )}

      {/* Timeline */}
      {entries.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="size-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No journal entries yet.</p>
          <p className="text-xs mt-1">
            Start capturing memories after your first day!
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className="absolute left-[11px] top-5 size-2.5 rounded-full bg-wc-teal ring-2 ring-background" />

                <JournalCard
                  entry={entry}
                  city={entry.stopId ? stopCityMap.get(entry.stopId) ?? null : null}
                  dayNumber={getDayNumber(entry.date)}
                  stops={stops}
                  currentUser={currentUser}
                  onMutate={handleMutate}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating add button (visible when today's entry exists or as secondary action) */}
      {hasTodayEntry && (
        <AddJournalForm stops={stops} currentUser={currentUser} />
      )}
    </div>
  );
}
