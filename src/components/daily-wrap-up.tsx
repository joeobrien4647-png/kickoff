"use client";

import { useState, useEffect, useCallback } from "react";
import { Share2, Copy, MessageCircle, Calendar, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MatchResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  city: string;
  homeScore: number | null;
  awayScore: number | null;
  attending: boolean;
}

interface JournalData {
  highlight: string | null;
  bestMeal: string | null;
  funniestMoment: string | null;
  rating: number | null;
}

interface ItineraryItemData {
  id: string;
  title: string;
  type: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
}

interface DailySummaryResponse {
  date: string;
  dayNumber: number;
  city: string | null;
  summary: string;
  stats: {
    spent: number;
    perPerson: number;
    travelerCount: number;
    photoCount: number;
    matchResults: MatchResult[];
    journal: JournalData | null;
    itineraryItems: ItineraryItemData[];
    nextStop: { city: string; driveFromPrev: string | null } | null;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TRIP_START = "2026-06-11";
const TRIP_END = "2026-06-26";

function getTripDays(): string[] {
  const days: string[] = [];
  const start = new Date(TRIP_START + "T12:00:00");
  const end = new Date(TRIP_END + "T12:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getDefaultDate(): string {
  const today = new Date().toISOString().slice(0, 10);
  if (today >= TRIP_START && today <= TRIP_END) return today;
  if (today > TRIP_END) return TRIP_END;
  return TRIP_START;
}

function fmtShort(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DailyWrapUp() {
  const tripDays = getTripDays();
  const [selectedDate, setSelectedDate] = useState(getDefaultDate);
  const [data, setData] = useState<DailySummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [allSummaries, setAllSummaries] = useState<DailySummaryResponse[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);

  // ---- Fetch summary for a given date ------------------------------------
  const fetchSummary = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/daily-summary?date=${date}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to fetch summary");
      }
      const json: DailySummaryResponse = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---- Fetch on date change ----------------------------------------------
  useEffect(() => {
    fetchSummary(selectedDate);
  }, [selectedDate, fetchSummary]);

  // ---- Copy to clipboard -------------------------------------------------
  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  }

  // ---- Share via WhatsApp ------------------------------------------------
  function handleWhatsApp(text: string) {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // ---- Navigate days -----------------------------------------------------
  const currentIndex = tripDays.indexOf(selectedDate);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < tripDays.length - 1;

  function goDay(direction: -1 | 1) {
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < tripDays.length) {
      setSelectedDate(tripDays[nextIndex]);
    }
  }

  // ---- Share All ---------------------------------------------------------
  async function handleShareAll() {
    if (allSummaries.length > 0) {
      setShowAll(!showAll);
      return;
    }
    setLoadingAll(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const pastDays = tripDays.filter((d) => d <= today && d <= TRIP_END);
      const results: DailySummaryResponse[] = [];
      for (const day of pastDays) {
        const res = await fetch(`/api/daily-summary?date=${day}`);
        if (res.ok) {
          results.push(await res.json());
        }
      }
      setAllSummaries(results);
      setShowAll(true);
    } catch {
      toast.error("Failed to load all summaries");
    } finally {
      setLoadingAll(false);
    }
  }

  // ---- Check if this day has any meaningful data -------------------------
  const hasData =
    data &&
    (data.stats.spent > 0 ||
      data.stats.photoCount > 0 ||
      data.stats.matchResults.length > 0 ||
      data.stats.journal !== null ||
      data.stats.itineraryItems.length > 0 ||
      data.city !== null);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-500/15">
            <Share2 className="size-4 text-green-600" />
          </div>
          <CardTitle className="text-base">Daily Wrap-Up</CardTitle>
        </div>

        {/* Date selector */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => goDay(-1)}
            disabled={!canPrev}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tripDays.map((day) => (
                <SelectItem key={day} value={day}>
                  <Calendar className="size-3 opacity-50" />
                  {fmtShort(day)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => goDay(1)}
            disabled={!canNext}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !hasData && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No data for this day yet. Start adding expenses, photos, and
              journal entries!
            </p>
          </div>
        )}

        {/* Summary content */}
        {!loading && !error && hasData && data && (
          <div className="space-y-4">
            {/* WhatsApp-style message bubble */}
            <MessageBubble summary={data.summary} />

            {/* Stats row */}
            <div className="flex flex-wrap gap-1.5">
              {data.stats.spent > 0 && (
                <Badge variant="secondary">
                  ${data.stats.spent}
                </Badge>
              )}
              {data.stats.photoCount > 0 && (
                <Badge variant="secondary">
                  {data.stats.photoCount} photo{data.stats.photoCount !== 1 && "s"}
                </Badge>
              )}
              {data.stats.matchResults.length > 0 && (
                <Badge variant="secondary">
                  {data.stats.matchResults.length} match{data.stats.matchResults.length !== 1 && "es"}
                </Badge>
              )}
              {data.stats.itineraryItems.length > 0 && (
                <Badge variant="secondary">
                  {data.stats.itineraryItems.length} plans
                </Badge>
              )}
              {data.stats.journal?.rating && (
                <Badge variant="secondary">
                  {"\u2B50".repeat(data.stats.journal.rating)}
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(data.summary)}
                className={cn(
                  "transition-all",
                  copied && "border-green-500/50 text-green-600",
                )}
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWhatsApp(data.summary)}
                className="border-green-500/30 text-green-600 hover:bg-green-500/10"
              >
                <MessageCircle className="size-3.5" />
                WhatsApp
              </Button>
            </div>

            {/* Share All toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={handleShareAll}
              disabled={loadingAll}
            >
              <Share2 className="size-3" />
              {loadingAll
                ? "Loading all days..."
                : showAll
                  ? "Hide all days"
                  : "Share All Days"}
            </Button>

            {/* All summaries */}
            {showAll && allSummaries.length > 0 && (
              <div className="space-y-3 border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  All Days
                </p>
                {allSummaries.map((s) => (
                  <div key={s.date} className="space-y-2">
                    <MessageBubble summary={s.summary} compact />
                    <div className="flex gap-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopy(s.summary)}
                        className="text-muted-foreground"
                      >
                        <Copy className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleWhatsApp(s.summary)}
                        className="text-green-600"
                      >
                        <MessageCircle className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// WhatsApp-style message bubble
// ---------------------------------------------------------------------------

function MessageBubble({
  summary,
  compact = false,
}: {
  summary: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-[#dcf8c6] dark:bg-[#1b3a1b] px-3 py-2 shadow-sm",
        "before:absolute before:top-0 before:-left-1.5 before:size-3",
        "before:bg-[#dcf8c6] dark:before:bg-[#1b3a1b]",
        "before:[clip-path:polygon(100%_0,100%_100%,0_0)]",
        compact && "text-[11px] leading-relaxed",
        !compact && "text-xs leading-relaxed",
      )}
    >
      <pre
        className={cn(
          "whitespace-pre-wrap font-[inherit] m-0",
          "text-[#111b21] dark:text-[#e9edef]",
        )}
      >
        {summary}
      </pre>
      <span className="block text-right text-[10px] text-[#667781] dark:text-[#8696a0] mt-1">
        {new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
