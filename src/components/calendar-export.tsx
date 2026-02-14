"use client";

import { useState } from "react";
import { CalendarPlus, Download, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateIcs, downloadIcs, type IcsEvent } from "@/lib/ics-generator";
import type { Match, ItineraryItem } from "@/lib/schema";

type ExportType = "all-matches" | "our-matches" | "itinerary";

function matchToIcsEvent(m: Match): IcsEvent {
  // Calculate end time: kickoff + 2h30m
  let endTime: string | undefined;
  if (m.kickoff) {
    const [h, min] = m.kickoff.split(":").map(Number);
    const totalMin = h * 60 + min + 150;
    const eh = Math.floor(totalMin / 60) % 24;
    const em = totalMin % 60;
    endTime = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
  }

  const descParts: string[] = [];
  if (m.round) descParts.push(`Round: ${m.round}`);
  if (m.groupName) descParts.push(`Group ${m.groupName}`);
  if (m.ticketStatus !== "none") descParts.push(`Tickets: ${m.ticketStatus}`);
  if (m.fanZone) descParts.push(`Fan Zone: ${m.fanZone}`);
  if (m.notes) descParts.push(m.notes);

  return {
    title: `\u26BD ${m.homeTeam} vs ${m.awayTeam}`,
    description: descParts.length > 0 ? descParts.join(" | ") : undefined,
    location: `${m.venue}, ${m.city}`,
    startDate: m.matchDate,
    startTime: m.kickoff ?? undefined,
    endTime,
    allDay: !m.kickoff,
    alarm: true,
  };
}

function itineraryToIcsEvent(item: ItineraryItem): IcsEvent {
  const descParts: string[] = [];
  if (item.type) descParts.push(`Type: ${item.type}`);
  if (item.notes) descParts.push(item.notes);

  return {
    title: item.title,
    description: descParts.length > 0 ? descParts.join(" | ") : undefined,
    location: item.location ?? undefined,
    startDate: item.date,
    startTime: item.startTime ?? undefined,
    endTime: item.endTime ?? undefined,
    allDay: !item.startTime,
    alarm: false,
  };
}

export function CalendarExport() {
  const [loading, setLoading] = useState<ExportType | null>(null);

  async function handleExport(type: ExportType) {
    setLoading(type);
    try {
      let events: IcsEvent[] = [];
      let calendarName: string;
      let filename: string;

      if (type === "all-matches" || type === "our-matches") {
        const res = await fetch("/api/matches");
        if (!res.ok) throw new Error("Failed to fetch matches");
        const allMatches: Match[] = await res.json();

        const filtered =
          type === "our-matches"
            ? allMatches.filter((m) => m.attending)
            : allMatches;

        if (filtered.length === 0) {
          toast.error(
            type === "our-matches"
              ? "No matches marked as attending"
              : "No matches found"
          );
          return;
        }

        events = filtered.map(matchToIcsEvent);
        calendarName =
          type === "our-matches"
            ? "Kickoff - Our Matches"
            : "Kickoff - All Matches";
        filename =
          type === "our-matches"
            ? "kickoff-our-matches.ics"
            : "kickoff-all-matches.ics";
      } else {
        const res = await fetch("/api/itinerary");
        if (!res.ok) throw new Error("Failed to fetch itinerary");
        const items: ItineraryItem[] = await res.json();

        if (items.length === 0) {
          toast.error("No itinerary items found");
          return;
        }

        events = items.map(itineraryToIcsEvent);
        calendarName = "Kickoff - Itinerary";
        filename = "kickoff-itinerary.ics";
      }

      // Sort chronologically
      events.sort((a, b) => {
        const dateCmp = a.startDate.localeCompare(b.startDate);
        if (dateCmp !== 0) return dateCmp;
        return (a.startTime ?? "").localeCompare(b.startTime ?? "");
      });

      const icsContent = generateIcs(events, calendarName);
      downloadIcs(icsContent, filename);
      toast.success("Calendar file downloaded");
    } catch (error) {
      console.error("[CalendarExport]", error);
      toast.error("Failed to export calendar");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarPlus className="size-5 text-wc-teal" />
          Calendar Export
        </CardTitle>
        <CardDescription>
          Add matches and events to your phone calendar. Works with Google
          Calendar, Apple Calendar, and Outlook.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <Button
            variant="outline"
            className="justify-start gap-2 border-wc-teal/30 hover:bg-wc-teal/10 hover:text-wc-teal"
            onClick={() => handleExport("all-matches")}
            disabled={loading !== null}
          >
            <Download className="size-4 shrink-0" />
            {loading === "all-matches" ? "Exporting..." : "All Matches"}
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2 border-wc-teal/30 hover:bg-wc-teal/10 hover:text-wc-teal"
            onClick={() => handleExport("our-matches")}
            disabled={loading !== null}
          >
            <Download className="size-4 shrink-0" />
            {loading === "our-matches" ? "Exporting..." : "Our Matches"}
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2 border-wc-teal/30 hover:bg-wc-teal/10 hover:text-wc-teal"
            onClick={() => handleExport("itinerary")}
            disabled={loading !== null}
          >
            <Download className="size-4 shrink-0" />
            {loading === "itinerary" ? "Exporting..." : "Full Itinerary"}
          </Button>
        </div>

        <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2">
          <Clock className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Times are US Eastern &mdash; your calendar app will auto-convert to
            BST
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
