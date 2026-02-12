"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Plane,
  Ticket,
  Settings,
  DollarSign,
  Bed,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category =
  | "documents"
  | "transport"
  | "tickets"
  | "logistics"
  | "money"
  | "accommodation";

interface Milestone {
  daysBefore: number;
  title: string;
  description: string;
  category: Category;
  link?: string;
  critical: boolean;
}

interface PreTripTimelineProps {
  tripStartDate: string; // "2026-06-11"
}

// ---------------------------------------------------------------------------
// Category styling
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; icon: LucideIcon; color: string; bg: string; border: string }
> = {
  documents: {
    label: "Documents",
    icon: FileText,
    color: "text-wc-coral",
    bg: "bg-wc-coral/10",
    border: "border-wc-coral/30",
  },
  transport: {
    label: "Transport",
    icon: Plane,
    color: "text-wc-blue",
    bg: "bg-wc-blue/10",
    border: "border-wc-blue/30",
  },
  tickets: {
    label: "Tickets",
    icon: Ticket,
    color: "text-wc-gold",
    bg: "bg-wc-gold/10",
    border: "border-wc-gold/30",
  },
  logistics: {
    label: "Logistics",
    icon: Settings,
    color: "text-wc-teal",
    bg: "bg-wc-teal/10",
    border: "border-wc-teal/30",
  },
  money: {
    label: "Money",
    icon: DollarSign,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  accommodation: {
    label: "Accommodation",
    icon: Bed,
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
};

// ---------------------------------------------------------------------------
// Hardcoded milestones for British travellers to the US (World Cup 2026)
// ---------------------------------------------------------------------------

const MILESTONES: Milestone[] = [
  {
    daysBefore: 120,
    title: "Apply for ESTA",
    description:
      "US Electronic System for Travel Authorization. $21 per person. Takes up to 72 hours but usually instant.",
    category: "documents",
    link: "https://esta.cbp.dhs.gov",
    critical: true,
  },
  {
    daysBefore: 90,
    title: "Book flights to Boston",
    description:
      "Heathrow \u2192 Boston Logan. Check BA, Virgin Atlantic, and Norse Atlantic for June routes.",
    category: "transport",
    critical: true,
  },
  {
    daysBefore: 90,
    title: "Book return flights from Miami",
    description:
      "Miami \u2192 Heathrow. Consider leaving a buffer day for delays.",
    category: "transport",
    critical: true,
  },
  {
    daysBefore: 75,
    title: "Travel insurance",
    description:
      "US medical costs are insane. Get proper cover \u2014 at least \u00a310M medical. Check if your bank card includes it.",
    category: "documents",
    critical: true,
  },
  {
    daysBefore: 60,
    title: "Book rental car",
    description:
      "Need a comfortable car for 1,900 miles. Enterprise or Hertz from Boston, drop in Miami. Check one-way fees.",
    category: "transport",
    critical: false,
  },
  {
    daysBefore: 60,
    title: "FIFA ticket last-minute sales",
    description:
      "Check FIFA.com daily for resale and last-chance ticket releases. Set phone alerts.",
    category: "tickets",
    critical: true,
  },
  {
    daysBefore: 45,
    title: "Sort phone plans",
    description:
      "UK plans have expensive US roaming. Get a Three plan (free roaming), or buy a US SIM (T-Mobile tourist plan ~$50/30 days).",
    category: "logistics",
    critical: false,
  },
  {
    daysBefore: 30,
    title: "Notify your bank",
    description:
      "Tell Monzo/Starling/bank you\u2019re traveling to the US. Check foreign transaction fees. Revolut is fee-free.",
    category: "money",
    critical: false,
  },
  {
    daysBefore: 30,
    title: "Book Nashville accommodation",
    description:
      "Nashville hotels/Airbnb for Jun 22\u201324. Downtown or The Gulch for walkability to Broadway.",
    category: "accommodation",
    critical: false,
  },
  {
    daysBefore: 21,
    title: "Download offline maps",
    description:
      "Google Maps offline for Boston, NYC, Philly, DC, Nashville, Miami. Cell signal can be patchy on highway drives.",
    category: "logistics",
    critical: false,
  },
  {
    daysBefore: 14,
    title: "Start packing list",
    description:
      "June in the US = hot and humid. Light clothes, sunscreen, comfortable walking shoes. Don\u2019t forget the Scotland shirt.",
    category: "logistics",
    critical: false,
  },
  {
    daysBefore: 7,
    title: "Currency & cards ready",
    description:
      "Get some USD cash ($200 each) for tips and small purchases. US tipping: 18\u201320% at restaurants, $1\u20132 per drink at bars.",
    category: "money",
    critical: false,
  },
  {
    daysBefore: 3,
    title: "Print ESTA confirmations",
    description:
      "Print ESTA approval, flight confirmations, car rental booking, hotel reservations. Belt and braces.",
    category: "documents",
    critical: true,
  },
  {
    daysBefore: 1,
    title: "Final check",
    description:
      "Passports, phone chargers, adapters (US uses Type A/B \u2014 bring a converter), Scotland shirt, lucky pants.",
    category: "logistics",
    critical: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Add days to a date string and return YYYY-MM-DD */
function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

/** Days between two Date objects (positive = future) */
function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((to.getTime() - from.getTime()) / msPerDay);
}

/** Format a Date to "Wed, 11 Mar" style */
function formatMilestoneDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const COLLAPSED_COUNT = 4;

export function PreTripTimeline({ tripStartDate }: PreTripTimelineProps) {
  const [showAll, setShowAll] = useState(false);

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const tripStart = new Date(tripStartDate + "T12:00:00");
  const daysUntil = daysBetween(today, tripStart);

  // Build timeline entries with computed dates
  const entries = MILESTONES.map((m) => {
    const targetDate = addDays(tripStartDate, -m.daysBefore);
    const daysFromNow = daysBetween(today, targetDate);
    const isPast = daysFromNow < 0;
    const isToday = daysFromNow === 0;
    return { ...m, targetDate, daysFromNow, isPast, isToday };
  }).sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());

  // Find the index of the next upcoming milestone (first non-past entry)
  const nextIndex = entries.findIndex((e) => !e.isPast);

  // Determine which entries to show
  const upcomingEntries = entries.filter((e) => !e.isPast);
  const pastEntries = entries.filter((e) => e.isPast);
  const pastCount = pastEntries.length;

  // When collapsed, show the next COLLAPSED_COUNT upcoming items
  const visibleEntries = showAll
    ? entries
    : upcomingEntries.slice(0, COLLAPSED_COUNT);

  const hasHiddenItems =
    !showAll && (pastCount > 0 || upcomingEntries.length > COLLAPSED_COUNT);

  // Trip has started or passed
  if (daysUntil <= 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Pre-Trip Countdown
        </h3>
        <span className="text-xs font-medium text-wc-gold">
          {daysUntil} {daysUntil === 1 ? "day" : "days"} until departure
        </span>
      </div>

      <Card className="py-4">
        <CardContent className="space-y-0">
          {/* Collapsed past summary */}
          {!showAll && pastCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3 w-full"
            >
              <CheckCircle2 className="size-3.5 text-wc-teal" />
              <span>
                {pastCount} {pastCount === 1 ? "task" : "tasks"} completed
              </span>
              <ChevronDown className="size-3 ml-auto" />
            </button>
          )}

          {/* Timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

            {visibleEntries.map((entry, i) => {
              const config = CATEGORY_CONFIG[entry.category];
              const Icon = config.icon;
              const isNext = entries.indexOf(entry) === nextIndex;

              return (
                <div
                  key={`${entry.daysBefore}-${entry.title}`}
                  className={cn(
                    "relative flex items-start gap-3 py-2.5 pl-0",
                    i === 0 && "pt-0",
                    i === visibleEntries.length - 1 && "pb-0"
                  )}
                >
                  {/* Timeline node */}
                  <div
                    className={cn(
                      "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                      entry.isPast
                        ? "bg-wc-teal/20"
                        : isNext
                          ? cn(config.bg, "ring-2", config.border)
                          : "bg-muted"
                    )}
                  >
                    {entry.isPast ? (
                      <CheckCircle2 className="size-3 text-wc-teal" />
                    ) : (
                      <Icon
                        className={cn(
                          "size-3",
                          isNext ? config.color : "text-muted-foreground"
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    {/* Title row */}
                    <div className="flex items-start gap-2">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          entry.isPast
                            ? "text-muted-foreground line-through"
                            : isNext
                              ? "font-semibold text-foreground"
                              : "text-foreground/80"
                        )}
                      >
                        {entry.title}
                      </p>

                      {/* Badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        {entry.critical && !entry.isPast && (
                          <Badge
                            variant="outline"
                            className="border-wc-coral/30 px-1.5 py-0 text-[10px] text-wc-coral gap-0.5"
                          >
                            <AlertCircle className="size-2.5" />
                            Critical
                          </Badge>
                        )}
                        {isNext && (
                          <Badge
                            variant="outline"
                            className="animate-pulse border-wc-gold/30 px-1.5 py-0 text-[10px] text-wc-gold"
                          >
                            Next
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description — only show for next item and expanded view */}
                    {(isNext || showAll) && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {entry.description}
                      </p>
                    )}

                    {/* Date + countdown */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">
                        {formatMilestoneDate(entry.targetDate)}
                      </span>
                      {!entry.isPast && (
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            entry.isToday
                              ? "text-wc-gold"
                              : entry.daysFromNow <= 7
                                ? "text-wc-coral"
                                : "text-muted-foreground/70"
                          )}
                        >
                          {entry.isToday
                            ? "Today!"
                            : entry.daysFromNow === 1
                              ? "Tomorrow"
                              : `in ${entry.daysFromNow} days`}
                        </span>
                      )}
                      {entry.isPast && !entry.isToday && (
                        <span className="text-[10px] text-wc-teal">
                          Done
                        </span>
                      )}

                      {/* Link */}
                      {entry.link && (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex items-center gap-0.5 text-[10px] font-medium hover:underline",
                            config.color
                          )}
                        >
                          <ExternalLink className="size-2.5" />
                          Visit
                        </a>
                      )}
                    </div>

                    {/* Category pill */}
                    <div className="pt-0.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-1.5 py-0 text-[9px] font-medium",
                          config.bg,
                          config.color
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show all / Show upcoming toggle */}
          {hasHiddenItems && (
            <div className="pt-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(true)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                Show all {entries.length} tasks
                <ChevronDown className="size-3" />
              </Button>
            </div>
          )}

          {showAll && (
            <div className="pt-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(false)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                Show upcoming only
                <ChevronUp className="size-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
