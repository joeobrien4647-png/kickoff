"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  CloudSun,
  CloudRain,
  Snowflake,
  Droplets,
  CloudOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DayForecast } from "@/lib/weather";

interface WeatherWidgetProps {
  city: string;
  lat: number;
  lng: number;
}

/** Pick the right weather icon based on rain probability and temperature */
function WeatherIcon({
  rainPct,
  lowF,
  className = "size-5",
}: {
  rainPct: number;
  lowF: number;
  className?: string;
}) {
  if (lowF < 32) return <Snowflake className={className} />;
  if (rainPct > 50) return <CloudRain className={className} />;
  if (rainPct > 20) return <CloudSun className={className} />;
  return <Sun className={className} />;
}

/** Weather icon color based on conditions */
function weatherIconColor(rainPct: number, lowF: number): string {
  if (lowF < 32) return "text-sky-300";
  if (rainPct > 50) return "text-blue-400";
  if (rainPct > 20) return "text-slate-400";
  return "text-amber-400";
}

/** Format date string (YYYY-MM-DD) to short day name (Mon, Tue, ...) */
function shortDay(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function WeatherSkeleton() {
  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-muted animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-5 w-20 rounded bg-muted animate-pulse" />
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WeatherWidget({ city, lat, lng }: WeatherWidgetProps) {
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then((res) => {
        if (!res.ok) throw new Error("Weather fetch failed");
        return res.json();
      })
      .then((data: DayForecast[]) => {
        if (!cancelled) {
          setForecasts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  if (loading) return <WeatherSkeleton />;

  if (error || forecasts.length === 0) {
    return (
      <Card className="py-4">
        <CardContent className="flex items-center gap-3 text-muted-foreground">
          <CloudOff className="size-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Weather unavailable</p>
            <p className="text-xs">Could not load forecast for {city}.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const today = forecasts[0];
  const upcoming = forecasts.slice(1, 4); // next 3 days

  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        {/* Header */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {city} Forecast
        </p>

        {/* Today's weather — prominent */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted/60">
            <WeatherIcon
              rainPct={today.rainPct}
              lowF={today.lowF}
              className={`size-6 ${weatherIconColor(today.rainPct, today.lowF)}`}
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tabular-nums">
                {today.highF}&deg;
              </span>
              <span className="text-sm text-muted-foreground tabular-nums">
                / {today.lowF}&deg;
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Droplets className="size-3" />
              <span>{today.rainPct}% rain</span>
            </div>
          </div>
        </div>

        {/* 3-day mini forecast */}
        {upcoming.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-1">
            {upcoming.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 py-2 px-1"
              >
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  {shortDay(day.date)}
                </span>
                <WeatherIcon
                  rainPct={day.rainPct}
                  lowF={day.lowF}
                  className={`size-4 ${weatherIconColor(day.rainPct, day.lowF)}`}
                />
                <span className="text-xs font-medium tabular-nums">
                  {day.highF}&deg;/{day.lowF}&deg;
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
