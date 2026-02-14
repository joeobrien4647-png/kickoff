"use client";

import { useState } from "react";
import { Trophy, MapPin, UtensilsCrossed, Car, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCityIdentity, ROUTE_STOPS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ShareableDayCardProps = {
  date: string; // ISO date
  dayNumber: number;
  city: string;
  highlights: string[]; // top things done/planned
  matchInfo?: { homeTeam: string; awayTeam: string; score?: string } | null;
  bestMeal?: string | null;
  miles?: number; // driven today
  photo?: string | null; // base64 photo
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Hex colors for the gradient overlay — keyed to city identity classes */
const CITY_GRADIENT_COLORS: Record<string, [string, string]> = {
  Boston: ["#0d9488", "#064e3b"],       // teal tones
  "New York": ["#3b82f6", "#1e3a5f"],   // blue tones
  Philadelphia: ["#f97316", "#7c2d12"], // coral/orange tones
  "Washington DC": ["#eab308", "#713f12"], // gold tones
  Nashville: ["#fb923c", "#7c2d12"],    // orange tones
  Miami: ["#34d399", "#064e3b"],        // emerald tones
};

function getGradientStyle(city: string) {
  const [from, to] = CITY_GRADIENT_COLORS[city] ?? ["#6366f1", "#1e1b4b"];
  return {
    background: `linear-gradient(160deg, ${from}22 0%, ${to}88 40%, ${to}cc 100%)`,
  };
}

function formatDatePretty(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function buildWhatsAppText(props: ShareableDayCardProps): string {
  const { date, dayNumber, city, highlights, matchInfo, bestMeal, miles } = props;
  const d = new Date(date + "T12:00:00");
  const formattedDate = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const lines: string[] = [
    `\u{1F3C6} KICKOFF 2026 \u2014 Day ${dayNumber}`,
    `\u{1F4CD} ${city}`,
    `\u{1F4C5} ${formattedDate}`,
  ];

  if (matchInfo) {
    const matchLine = matchInfo.score
      ? `${matchInfo.homeTeam} ${matchInfo.score} ${matchInfo.awayTeam}`
      : `${matchInfo.homeTeam} vs ${matchInfo.awayTeam}`;
    lines.push(`\u26BD ${matchLine}`);
  }

  if (highlights.length > 0) {
    lines.push(`\u2B50 Highlights: ${highlights.join(", ")}`);
  }

  if (bestMeal) {
    lines.push(`\u{1F37D}\uFE0F ${bestMeal}`);
  }

  if (miles) {
    lines.push(`\u{1F697} ${miles}mi driven`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Route Progress Dots
// ---------------------------------------------------------------------------
function RouteDots({ currentCity }: { currentCity: string }) {
  const cities: string[] = ROUTE_STOPS.map((s) => s.name);
  const currentIndex = cities.indexOf(currentCity);

  return (
    <div className="flex items-center justify-center gap-1.5">
      {cities.map((city, i) => {
        const isCurrent = i === currentIndex;
        const isPast = currentIndex >= 0 && i < currentIndex;
        return (
          <div key={city} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "rounded-full transition-all",
                isCurrent
                  ? "size-3 bg-white ring-2 ring-white/50"
                  : isPast
                    ? "size-2 bg-white/60"
                    : "size-2 bg-white/25",
              )}
            />
            <span
              className={cn(
                "text-[9px] leading-none",
                isCurrent
                  ? "text-white font-semibold"
                  : isPast
                    ? "text-white/60"
                    : "text-white/30",
              )}
            >
              {city === "Washington DC" ? "DC" : city === "Philadelphia" ? "Philly" : city}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ShareableDayCard(props: ShareableDayCardProps) {
  const {
    date,
    dayNumber,
    city,
    highlights,
    matchInfo,
    bestMeal,
    miles,
    photo,
  } = props;

  const [copied, setCopied] = useState(false);
  const identity = getCityIdentity(city);

  async function copyForWhatsApp() {
    const text = buildWhatsAppText(props);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="space-y-3">
      {/* The visual card — designed for screenshot */}
      <Card className="overflow-hidden border-0 py-0 shadow-xl max-w-[360px] mx-auto">
        <div
          className="relative flex flex-col text-white"
          style={{
            ...getGradientStyle(city),
            aspectRatio: "4 / 5",
          }}
        >
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Photo background if provided */}
          {photo && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${photo})` }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            {/* Top: Branding */}
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-amber-300" />
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-amber-300/90">
                Kickoff 2026
              </span>
            </div>

            {/* Middle: Day info */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {/* Day + City */}
              <div>
                <h2 className="text-3xl font-black tracking-tight leading-tight">
                  Day {dayNumber}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="size-4 text-white/70" />
                  <span className="text-xl font-semibold text-white/90">
                    {city}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1 tracking-wide">
                  {formatDatePretty(date)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20" />

              {/* Match */}
              {matchInfo && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-base">{"\u26BD"}</span>
                  <span className="text-sm font-semibold">
                    {matchInfo.homeTeam} vs {matchInfo.awayTeam}
                  </span>
                  {matchInfo.score && (
                    <span className="ml-auto text-sm font-bold text-amber-300">
                      {matchInfo.score}
                    </span>
                  )}
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="space-y-1.5">
                  {highlights.slice(0, 5).map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-300/80" />
                      <span className="text-sm text-white/85 leading-snug">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Meal + Miles */}
              <div className="space-y-1.5">
                {bestMeal && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <UtensilsCrossed className="size-3.5 shrink-0" />
                    <span>Best bite: {bestMeal}</span>
                  </div>
                )}
                {miles != null && miles > 0 && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Car className="size-3.5 shrink-0" />
                    <span>{miles} miles driven</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: Route dots + footer */}
            <div className="space-y-3">
              <RouteDots currentCity={city} />
              <p className="text-[10px] text-white/30 text-center tracking-wide">
                Made with Kickoff &bull; kickoff-production.up.railway.app
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action buttons — below the card, not inside the screenshot area */}
      <div className="flex gap-2 max-w-[360px] mx-auto">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 gap-1.5 transition-all duration-200",
            copied && "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
          )}
          onClick={copyForWhatsApp}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy for WhatsApp
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
