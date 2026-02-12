"use client";

import { useState } from "react";
import { Share2, Check, ClipboardList, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TripShareCardProps {
  stops: { city: string; arriveDate: string; departDate: string }[];
  matches: {
    homeTeam: string;
    awayTeam: string;
    matchDate: string;
    venue: string;
    city: string;
    attending: number;
  }[];
  travelers: { name: string; emoji: string }[];
  totalMiles: number;
  totalSpent: number;
  perPersonSpent: number;
  packingProgress: string; // e.g. "24/40"
  checklistProgress: string; // e.g. "8/12"
  ticketsPurchased: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmtDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Group matches by which stop/city they belong to, based on date overlap */
function matchesForStop(
  stop: { city: string; arriveDate: string; departDate: string },
  allMatches: TripShareCardProps["matches"],
) {
  return allMatches.filter(
    (m) =>
      m.city === stop.city ||
      (m.matchDate >= stop.arriveDate && m.matchDate <= stop.departDate),
  );
}

// ---------------------------------------------------------------------------
// Text builders
// ---------------------------------------------------------------------------
function buildSummaryText(props: TripShareCardProps): string {
  const {
    stops,
    matches,
    travelers,
    totalMiles,
    totalSpent,
    perPersonSpent,
    packingProgress,
    checklistProgress,
    ticketsPurchased,
  } = props;

  const route = stops.map((s) => s.city).join(" \u2192 ");
  const names = travelers.map((t) => t.name).join(", ");
  const attendingCount = matches.filter((m) => m.attending).length;

  const lines = [
    "\u26BD World Cup 2026 Road Trip",
    `\uD83D\uDCC5 ${fmtDate(stops[0].arriveDate)}\u2013${fmtDate(stops[stops.length - 1].departDate)} (${daysBetween(stops[0].arriveDate, stops[stops.length - 1].departDate)} days)`,
    `\uD83D\uDDFA\uFE0F ${route}`,
    `\uD83D\uDE97 ${Math.round(totalMiles).toLocaleString()} miles | ${stops.length} stops`,
    `\uD83C\uDFDF\uFE0F ${attendingCount} matches tracked | ${ticketsPurchased} tickets purchased`,
    `\uD83D\uDC65 ${names}`,
    "",
    `\uD83D\uDCB0 $${Math.round(totalSpent).toLocaleString()} spent so far | $${Math.round(perPersonSpent).toLocaleString()} per person`,
    `\uD83D\uDCCB ${checklistProgress} checklist done | ${packingProgress} packed`,
    "",
    "Let's go! \uD83C\uDFC6",
  ];

  return lines.join("\n");
}

function buildItineraryText(props: TripShareCardProps): string {
  const { stops, matches } = props;

  const lines: string[] = ["\u26BD KICKOFF 2026 \u2014 Day by Day", ""];

  for (const stop of stops) {
    lines.push(
      `\uD83D\uDCCD ${stop.city.toUpperCase()} (${fmtDate(stop.arriveDate)}\u2013${fmtDate(stop.departDate)})`,
    );

    const cityMatches = matchesForStop(stop, matches);
    if (cityMatches.length > 0) {
      for (const m of cityMatches) {
        const marker = m.attending ? "\uD83C\uDFDF\uFE0F" : "\uD83D\uDCFA";
        lines.push(
          `  ${marker} ${m.homeTeam} vs ${m.awayTeam} \u2014 ${fmtDate(m.matchDate)}, ${m.venue}`,
        );
      }
    } else {
      lines.push("  \uD83C\uDF34 Rest / explore");
    }

    lines.push("");
  }

  lines.push("Let's go! \uD83C\uDFC6");
  return lines.join("\n");
}

function daysBetween(a: string, b: string): number {
  const ms =
    new Date(b + "T12:00:00").getTime() - new Date(a + "T12:00:00").getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
type CopiedButton = "summary" | "itinerary" | null;

export function TripShareCard(props: TripShareCardProps) {
  const {
    stops,
    matches,
    travelers,
    totalMiles,
    ticketsPurchased,
  } = props;

  const [copied, setCopied] = useState<CopiedButton>(null);

  const attendingCount = matches.filter((m) => m.attending).length;
  const route = stops.map((s) => s.city).join(" \u2192 ");

  async function copyText(type: "summary" | "itinerary") {
    const text =
      type === "summary"
        ? buildSummaryText(props)
        : buildItineraryText(props);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Share2 className="size-4 text-wc-gold" />
        <h3 className="text-sm font-semibold">Share Trip</h3>
      </div>

      <div className="p-4 space-y-3">
        {/* Quick summary preview */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="font-medium text-foreground text-sm">
            {"\u26BD"} World Cup 2026 Road Trip
          </p>
          <p>
            {"\uD83D\uDDFA\uFE0F"} {route}
          </p>
          <p>
            {"\uD83D\uDE97"} {Math.round(totalMiles).toLocaleString()} miles
            {" \u00B7 "}
            {stops.length} stops
            {" \u00B7 "}
            {attendingCount} matches
            {ticketsPurchased > 0 && ` \u00B7 ${ticketsPurchased} tickets`}
          </p>
          <p>
            {"\uD83D\uDC65"}{" "}
            {travelers.map((t) => `${t.emoji} ${t.name}`).join("  ")}
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => copyText("summary")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200",
              copied === "summary"
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-muted hover:bg-muted/80 text-foreground active:scale-[0.97]",
            )}
          >
            {copied === "summary" ? (
              <Check className="size-3.5" />
            ) : (
              <MessageSquareText className="size-3.5" />
            )}
            {copied === "summary" ? "Copied!" : "Summary"}
          </button>
          <button
            onClick={() => copyText("itinerary")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200",
              copied === "itinerary"
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-muted hover:bg-muted/80 text-foreground active:scale-[0.97]",
            )}
          >
            {copied === "itinerary" ? (
              <Check className="size-3.5" />
            ) : (
              <ClipboardList className="size-3.5" />
            )}
            {copied === "itinerary" ? "Copied!" : "Itinerary"}
          </button>
        </div>
      </div>
    </div>
  );
}
