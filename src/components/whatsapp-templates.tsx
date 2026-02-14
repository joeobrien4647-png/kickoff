"use client";

import { useState } from "react";
import { MessageSquare, Copy, Check, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TemplateProps = {
  /** ISO date string (e.g. "2026-06-15") */
  date: string;
  /** Sequential trip day number */
  dayNumber: number;
  /** Current city, or null if in transit */
  city: string | null;
  /** Where they're staying */
  accommodation?: { name: string; address: string | null } | null;
  /** Matches scheduled for today */
  matches?: {
    homeTeam: string;
    awayTeam: string;
    kickoff: string;
    venue: string;
  }[];
  /** Dinner reservation */
  restaurant?: { name: string; time: string; address: string } | null;
  /** Upcoming drive segment */
  driveInfo?: {
    from: string;
    to: string;
    miles: number;
    hours: number;
    minutes: number;
  } | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a US Eastern time string ("HH:MM") to BST (ET + 5 hours). */
function toBST(kickoff: string): string {
  const [h, m] = kickoff.split(":").map(Number);
  const bstH = (h + 5) % 24;
  return `${bstH}:${m.toString().padStart(2, "0")} BST`;
}

/** Format matches into a compact multi-line string. */
function formatMatches(
  matches: NonNullable<TemplateProps["matches"]>,
): string {
  return matches
    .map(
      (m) =>
        `  ${m.homeTeam} vs ${m.awayTeam} - ${m.kickoff} (${toBST(m.kickoff)}) @ ${m.venue}`,
    )
    .join("\n");
}

// ---------------------------------------------------------------------------
// Template definitions
// ---------------------------------------------------------------------------

interface Template {
  id: string;
  icon: string;
  title: string;
  /** Build the preview line (shown on the card). */
  preview: (p: TemplateProps) => string;
  /** Build the full message text for clipboard. */
  build: (p: TemplateProps) => string;
}

const TEMPLATES: Template[] = [
  {
    id: "morning",
    icon: "\u2600\uFE0F",
    title: "Morning Update",
    preview: (p) =>
      `\u2600\uFE0F Day ${p.dayNumber} \u2014 ${p.city ?? "Travel Day"}`,
    build: (p) => {
      const lines: string[] = [];
      lines.push(
        `\u2600\uFE0F Day ${p.dayNumber} \u2014 ${p.city ?? "Travel Day"}`,
      );
      if (p.accommodation) {
        lines.push(`\uD83C\uDFE8 ${p.accommodation.name}`);
        if (p.accommodation.address) lines.push(`  ${p.accommodation.address}`);
      }
      if (p.matches && p.matches.length > 0) {
        lines.push(`\u26BD Matches today:`);
        lines.push(formatMatches(p.matches));
      } else {
        lines.push(`\u26BD No matches today`);
      }
      lines.push(`\uD83D\uDCCD Plans: ...`);
      lines.push("");
      lines.push(
        "Let's have it lads \uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F",
      );
      return lines.join("\n");
    },
  },
  {
    id: "matchday",
    icon: "\u26BD",
    title: "Match Day Plan",
    preview: (p) => {
      const m = p.matches?.[0];
      return m
        ? `\u26BD MATCH DAY! ${m.homeTeam} vs ${m.awayTeam}`
        : "\u26BD MATCH DAY!";
    },
    build: (p) => {
      const m = p.matches?.[0];
      const lines: string[] = [];
      lines.push(`\u26BD MATCH DAY!`);
      if (m) {
        lines.push(`${m.homeTeam} vs ${m.awayTeam}`);
        lines.push(`\u23F0 Kickoff: ${m.kickoff} (${toBST(m.kickoff)})`);
        lines.push(`\uD83D\uDCCD ${m.venue}`);
      } else {
        lines.push(`\u23F0 Kickoff: TBC`);
        lines.push(`\uD83D\uDCCD Venue: TBC`);
      }
      lines.push(`\uD83C\uDF7A Pre-match: Meet at...`);
      lines.push(`\uD83D\uDE97 Getting there: ...`);
      return lines.join("\n");
    },
  },
  {
    id: "dinner",
    icon: "\uD83C\uDF7D\uFE0F",
    title: "Tonight's Dinner",
    preview: (p) =>
      p.restaurant
        ? `\uD83C\uDF7D\uFE0F Tonight: ${p.restaurant.name}`
        : "\uD83C\uDF7D\uFE0F Tonight's dinner plans",
    build: (p) => {
      const lines: string[] = [];
      if (p.restaurant) {
        lines.push(`\uD83C\uDF7D\uFE0F Tonight: ${p.restaurant.name}`);
        lines.push(`\u23F0 ${p.restaurant.time}`);
        lines.push(`\uD83D\uDCCD ${p.restaurant.address}`);
      } else {
        lines.push(`\uD83C\uDF7D\uFE0F Tonight: ...`);
        lines.push(`\u23F0 Time: ...`);
        lines.push(`\uD83D\uDCCD Address: ...`);
      }
      lines.push(`\uD83D\uDC65 Party of 3`);
      lines.push(`\uD83D\uDCB0 Rough budget: ...`);
      return lines.join("\n");
    },
  },
  {
    id: "drive",
    icon: "\uD83D\uDE97",
    title: "Tomorrow's Drive",
    preview: (p) =>
      p.driveInfo
        ? `\uD83D\uDE97 ${p.driveInfo.from} \u2192 ${p.driveInfo.to}`
        : "\uD83D\uDE97 Tomorrow's drive",
    build: (p) => {
      const lines: string[] = [];
      if (p.driveInfo) {
        lines.push(
          `\uD83D\uDE97 Tomorrow: ${p.driveInfo.from} \u2192 ${p.driveInfo.to}`,
        );
        lines.push(
          `\uD83D\uDCCF ${p.driveInfo.miles} miles (${p.driveInfo.hours}h ${p.driveInfo.minutes}m)`,
        );
      } else {
        lines.push(`\uD83D\uDE97 Tomorrow: ... \u2192 ...`);
        lines.push(`\uD83D\uDCCF Distance: ...`);
      }
      lines.push(`\u23F0 Leaving at: ...`);
      lines.push(`\u26FD Fuel stop: ...`);
      lines.push(`\uD83C\uDFB5 Playlist: ...`);
      return lines.join("\n");
    },
  },
  {
    id: "checkin",
    icon: "\uD83D\uDCCD",
    title: "Quick Check-in",
    preview: (p) =>
      `\uD83D\uDCCD Currently: ${p.city ?? "On the road"}`,
    build: (p) => {
      const lines: string[] = [];
      lines.push(`\uD83D\uDCCD Currently: ${p.city ?? "On the road"}`);
      lines.push(`\u2705 All good`);
      lines.push(`\uD83D\uDD0B Phone: X%`);
      lines.push(`\uD83D\uDCF6 We have signal`);
      lines.push(`\uD83C\uDF7A At: ...`);
      return lines.join("\n");
    },
  },
  {
    id: "emergency",
    icon: "\uD83C\uDD98",
    title: "Emergency / Lost",
    preview: (p) =>
      `\uD83C\uDD98 HELP \u2014 ${p.city ?? "Unknown location"}`,
    build: (p) => {
      const lines: string[] = [];
      lines.push(`\uD83C\uDD98 HELP`);
      lines.push(`\uD83D\uDCCD I'm at: ${p.city ?? "Unknown location"}`);
      lines.push(`\uD83D\uDCDE Local emergency: 911`);
      lines.push(`\uD83C\uDFE5 Nearest hospital: ...`);
      lines.push(`\uD83D\uDCF1 My phone: ...`);
      return lines.join("\n");
    },
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WhatsAppTemplates(props: TemplateProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(template: Template) {
    const text = template.build(props);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(template.id);
      toast.success("Copied! Paste into WhatsApp \uD83D\uDCF1");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Couldn't copy \u2014 try again");
    }
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card className="border-green-500/20 bg-green-500/5 py-4">
        <CardContent className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/15">
            <MessageSquare className="size-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">WhatsApp Templates</p>
            <p className="text-xs text-muted-foreground">
              Quick messages for the group chat &mdash; tap to copy, paste into
              WhatsApp.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Template grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TEMPLATES.map((template) => {
          const isCopied = copiedId === template.id;
          const isEmergency = template.id === "emergency";

          return (
            <Card
              key={template.id}
              className={cn(
                "py-0 overflow-hidden transition-colors",
                isEmergency && "border-red-500/30",
              )}
            >
              <CardContent className="flex items-start gap-3 py-3">
                {/* Icon */}
                <span
                  className="mt-0.5 text-lg leading-none shrink-0"
                  role="img"
                  aria-label={template.title}
                >
                  {template.icon}
                </span>

                {/* Text */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">
                      {template.title}
                    </p>
                    {isEmergency && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-1.5 py-0"
                      >
                        SOS
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {template.preview(props)}
                  </p>
                </div>

                {/* Copy button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(template)}
                  className={cn(
                    "shrink-0 gap-1.5 transition-all duration-200",
                    isCopied
                      ? "border-green-500/40 bg-green-500/10 text-green-600 hover:bg-green-500/15 hover:text-green-600"
                      : "border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-600",
                  )}
                >
                  {isCopied ? (
                    <>
                      <Check className="size-3.5" />
                      <span className="hidden xs:inline">Done</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span className="hidden xs:inline">Copy</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/60">
        <Send className="size-3" />
        Fill in the &ldquo;...&rdquo; bits after pasting
      </p>
    </div>
  );
}
