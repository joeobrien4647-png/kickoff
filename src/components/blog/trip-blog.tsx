"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Camera,
  Copy,
  Check,
  Star,
  UtensilsCrossed,
  Laugh,
  Trophy,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCityIdentity, countryFlag } from "@/lib/constants";
import { formatDate } from "@/lib/dates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MatchResult = {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
};

type BlogEntry = {
  date: string;
  dayNumber: number;
  city: string;
  title: string;
  highlight: string | null;
  bestMeal: string | null;
  funniestMoment: string | null;
  matchResults: MatchResult[];
  photoCount: number;
  totalSpend: number;
  rating: number | null;
};

// ---------------------------------------------------------------------------
// Star rating display
// ---------------------------------------------------------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating
              ? "fill-wc-gold text-wc-gold"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Share text generator
// ---------------------------------------------------------------------------

function generateShareText(entries: BlogEntry[]): string {
  const lines: string[] = ["*World Cup 2026 Road Trip Blog*", ""];

  for (const entry of entries) {
    lines.push(`*${entry.title}*`);
    lines.push(formatDate(entry.date));
    if (entry.rating) lines.push(`${"*".repeat(entry.rating)} / 5`);
    if (entry.highlight) lines.push(`Highlight: ${entry.highlight}`);
    if (entry.bestMeal) lines.push(`Best meal: ${entry.bestMeal}`);
    if (entry.funniestMoment)
      lines.push(`Funniest moment: ${entry.funniestMoment}`);
    for (const m of entry.matchResults) {
      lines.push(
        `${countryFlag(m.home)} ${m.home} ${m.homeScore} - ${m.awayScore} ${m.away} ${countryFlag(m.away)}`
      );
    }
    if (entry.photoCount > 0)
      lines.push(`Photos: ${entry.photoCount}`);
    if (entry.totalSpend > 0)
      lines.push(`Spent: $${entry.totalSpend.toFixed(2)}`);
    lines.push("");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TripBlog() {
  const [entries, setEntries] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Copy share text to clipboard
  function handleShare() {
    const text = generateShareText(entries);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        Generating your trip blog...
      </div>
    );
  }

  // ---------- Empty state ----------
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <BookOpen className="size-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">No blog entries yet</p>
        <p className="text-xs mt-1 text-center max-w-xs">
          Your trip blog will be generated from journal entries. Start writing!
        </p>
      </div>
    );
  }

  // ---------- Timeline ----------
  return (
    <div className="space-y-5">
      {/* Share button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-1.5"
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Share
            </>
          )}
        </Button>
      </div>

      {/* Timeline spine */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {entries.map((entry) => {
            const identity = getCityIdentity(entry.city);

            return (
              <div key={entry.date} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-[10px] top-5 size-3 rounded-full ring-2 ring-background",
                    entry.rating && entry.rating >= 4
                      ? "bg-wc-gold"
                      : entry.matchResults.length > 0
                        ? "bg-wc-teal"
                        : "bg-muted-foreground/40"
                  )}
                />

                <Card
                  className={cn(
                    "py-4 transition-colors",
                    `bg-gradient-to-br ${identity.gradient} ${identity.border}`
                  )}
                >
                  <CardContent className="space-y-3">
                    {/* Header: day + date + city + rating */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <h3 className="font-semibold leading-snug">
                          {entry.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {entry.rating && <StarRating rating={entry.rating} />}
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            identity.bg,
                            identity.color
                          )}
                        >
                          {entry.city}
                        </span>
                      </div>
                    </div>

                    {/* Highlight — the hero text */}
                    {entry.highlight && (
                      <p className="text-sm font-medium leading-relaxed italic">
                        &ldquo;{entry.highlight}&rdquo;
                      </p>
                    )}

                    {/* Best meal + funniest moment */}
                    {(entry.bestMeal || entry.funniestMoment) && (
                      <div className="space-y-1.5">
                        {entry.bestMeal && (
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <UtensilsCrossed className="size-3.5 mt-0.5 shrink-0 text-wc-coral" />
                            <span>{entry.bestMeal}</span>
                          </div>
                        )}
                        {entry.funniestMoment && (
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Laugh className="size-3.5 mt-0.5 shrink-0 text-wc-gold" />
                            <span>{entry.funniestMoment}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Match results */}
                    {entry.matchResults.length > 0 && (
                      <div className="space-y-1">
                        {entry.matchResults.map((m, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs bg-background/60 rounded-md px-2.5 py-1.5"
                          >
                            <Trophy className="size-3.5 text-wc-gold shrink-0" />
                            <span className="font-medium tabular-nums">
                              {countryFlag(m.home)} {m.home} {m.homeScore} -{" "}
                              {m.awayScore} {m.away} {countryFlag(m.away)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer: photos + spend */}
                    {(entry.photoCount > 0 || entry.totalSpend > 0) && (
                      <div className="flex items-center gap-2 pt-1">
                        {entry.photoCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="gap-1 text-[10px]"
                          >
                            <Camera className="size-3" />
                            {entry.photoCount} photo
                            {entry.photoCount !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        {entry.totalSpend > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <DollarSign className="size-3" />$
                            {entry.totalSpend.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
