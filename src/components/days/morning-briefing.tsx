"use client";

import { useState } from "react";
import { Sun, Copy, Check, Hotel, Trophy, Car, ClipboardList, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
  kickoff: string | null;
  venue: string;
  city: string;
  attending: boolean;
}

interface MorningBriefingProps {
  date: string;
  dayNumber: number;
  city: string | null;
  accommodation: { name: string; address: string | null } | null;
  matches: MatchInfo[];
  driveInfo: { miles: number; hours: number; minutes: number } | null;
  fromCity: string | null;
  toCity: string | null;
  plannedItems: { title: string; time: string | null; type: string }[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Convert "15:00" or "3:00 PM" to BST (ET + 5 hours) */
function toBST(kickoff: string | null): string | null {
  if (!kickoff) return null;
  let hours: number;
  let minutes: number;

  if (kickoff.includes("AM") || kickoff.includes("PM")) {
    const m = kickoff.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    hours = parseInt(m[1]);
    minutes = parseInt(m[2]);
    if (m[3].toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (m[3].toUpperCase() === "AM" && hours === 12) hours = 0;
  } else {
    const parts = kickoff.split(":");
    hours = parseInt(parts[0]);
    minutes = parseInt(parts[1]);
  }

  hours += 5;
  if (hours >= 24) hours -= 24;
  const period = hours >= 12 ? "PM" : "AM";
  const display = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${display}:${minutes.toString().padStart(2, "0")} ${period} BST`;
}

function buildWhatsAppText(props: MorningBriefingProps): string {
  const { date, dayNumber, city, accommodation, matches, driveInfo, fromCity, plannedItems } = props;
  const lines: string[] = [];

  lines.push(`\u2600\uFE0F Day ${dayNumber} \u2014 ${city ?? "Travel Day"}`);
  lines.push(`\uD83D\uDCC5 ${formatDate(date)}`);
  lines.push("");

  if (accommodation) {
    lines.push(`\uD83C\uDFE8 ${accommodation.name}`);
    if (accommodation.address) lines.push(`   ${accommodation.address}`);
    lines.push("");
  }

  if (matches.length > 0) {
    lines.push(`\u26BD MATCH DAY!`);
    for (const m of matches) {
      const bst = toBST(m.kickoff);
      const timeStr = m.kickoff ? `${m.kickoff}${bst ? ` (${bst})` : ""}` : "TBC";
      lines.push(`\u2022 ${m.homeTeam} vs ${m.awayTeam} \u2014 ${timeStr}`);
      lines.push(`  @ ${m.venue}, ${m.city}${m.attending ? " \u2705" : ""}`);
    }
    lines.push("");
  }

  if (plannedItems.length > 0) {
    lines.push(`\uD83D\uDCCB Today's Plan:`);
    for (const item of plannedItems) {
      const time = item.time ? `${item.time} \u2014 ` : "";
      lines.push(`\u2022 ${time}${item.title}`);
    }
    lines.push("");
  }

  if (driveInfo) {
    lines.push(
      `\uD83D\uDE97 Drive: ${driveInfo.hours}h ${driveInfo.minutes}m (${driveInfo.miles} mi) from ${fromCity}`
    );
  } else {
    lines.push(`\uD83D\uDE97 No driving today`);
  }

  lines.push("");
  lines.push("Let's go lads! \uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MorningBriefing(props: MorningBriefingProps) {
  const { date, dayNumber, city, accommodation, matches, driveInfo, fromCity, plannedItems } = props;
  const [copied, setCopied] = useState(false);
  const identity = city ? getCityIdentity(city) : null;
  const isMatchDay = matches.length > 0;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildWhatsAppText(props));
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — try again");
    }
  }

  return (
    <Card className="py-0 overflow-hidden">
      {/* Header */}
      <div className={cn("px-4 py-3 bg-gradient-to-r", identity?.gradient ?? "from-muted/12 via-transparent to-transparent")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="size-5 text-wc-gold" />
            <div>
              <p className="text-sm font-bold">Good Morning</p>
              <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs", identity?.color)}>
            Day {dayNumber}
          </Badge>
        </div>

        {city && (
          <p className={cn("text-lg font-bold mt-2", identity?.color)}>
            {city}
          </p>
        )}
      </div>

      <CardContent className="space-y-3 py-3">
        {/* Info pills */}
        <div className="flex flex-wrap gap-2">
          {accommodation && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-secondary rounded-full px-2.5 py-1">
              <Hotel className="size-3 text-wc-teal" />
              {accommodation.name}
            </span>
          )}
          {isMatchDay && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-wc-gold/10 text-wc-gold rounded-full px-2.5 py-1 font-medium">
              <Trophy className="size-3" />
              {matches.length} match{matches.length > 1 ? "es" : ""}
              {matches[0].kickoff && ` \u2022 ${matches[0].kickoff}`}
            </span>
          )}
          {driveInfo && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-wc-blue/10 text-wc-blue rounded-full px-2.5 py-1">
              <Car className="size-3" />
              {driveInfo.hours}h {driveInfo.minutes}m from {fromCity}
            </span>
          )}
          {plannedItems.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-secondary rounded-full px-2.5 py-1">
              <ClipboardList className="size-3 text-muted-foreground" />
              {plannedItems.length} planned
            </span>
          )}
        </div>

        {/* Match highlight */}
        {isMatchDay && (
          <div className="rounded-lg border border-wc-gold/30 bg-wc-gold/5 p-3 space-y-2">
            {matches.map((m) => {
              const bst = toBST(m.kickoff);
              return (
                <div key={`${m.homeTeam}-${m.awayTeam}`} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold">
                      {m.homeTeam} vs {m.awayTeam}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 shrink-0" />
                      {m.venue}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {m.kickoff && (
                      <p className="text-sm font-bold text-wc-gold">{m.kickoff}</p>
                    )}
                    {bst && (
                      <p className="text-[10px] text-muted-foreground">{bst}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Copy button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="w-full gap-2"
        >
          {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
          {copied ? "Copied!" : "Copy for WhatsApp"}
        </Button>
      </CardContent>
    </Card>
  );
}
