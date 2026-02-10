"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, TRIP_START, TRIP_END } from "@/lib/dates";

interface DayNavProps {
  date: string;
  dayNumber: number;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function DayNav({ date, dayNumber }: DayNavProps) {
  const router = useRouter();

  const isFirst = date <= TRIP_START;
  const isLast = date >= TRIP_END;
  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, 1);

  return (
    <>
      {/* Top sticky nav (desktop + mobile) */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 py-3 -mx-1 px-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={isFirst}
          onClick={() => router.push(`/days/${prevDate}`)}
          aria-label="Previous day"
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline text-xs">{!isFirst && formatDate(prevDate)}</span>
        </Button>

        <Link
          href="/days"
          className="flex items-center gap-2 hover:text-foreground/80 transition-colors"
        >
          <CalendarDays className="size-4 text-muted-foreground" />
          <div className="text-center min-w-0">
            <p className="text-sm font-semibold">{formatDate(date)}</p>
            <p className="text-xs text-muted-foreground">Day {dayNumber}</p>
          </div>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          disabled={isLast}
          onClick={() => router.push(`/days/${nextDate}`)}
          aria-label="Next day"
          className="gap-1"
        >
          <span className="hidden sm:inline text-xs">{!isLast && formatDate(nextDate)}</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Bottom sticky nav on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-20 sm:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center justify-between px-4 py-2 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={() => router.push(`/days/${prevDate}`)}
            className="gap-1"
          >
            <ChevronLeft className="size-4" />
            <span className="text-xs">Day {dayNumber - 1}</span>
          </Button>

          <Link href="/days" className="text-xs text-muted-foreground hover:text-foreground">
            All Days
          </Link>

          <Button
            variant="ghost"
            size="sm"
            disabled={isLast}
            onClick={() => router.push(`/days/${nextDate}`)}
            className="gap-1"
          >
            <span className="text-xs">Day {dayNumber + 1}</span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
