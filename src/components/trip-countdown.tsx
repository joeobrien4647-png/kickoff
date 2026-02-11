"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const TRIP_START = new Date("2026-06-11T00:00:00").getTime();
const TRIP_END = new Date("2026-06-26T23:59:59").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, TRIP_START - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function getTripDay(): number | null {
  const now = Date.now();
  if (now >= TRIP_START && now <= TRIP_END) {
    return Math.floor((now - TRIP_START) / (1000 * 60 * 60 * 24)) + 1;
  }
  return null;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold tabular-nums bg-gradient-to-b from-wc-gold to-wc-coral bg-clip-text text-transparent">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function TripCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
  const [tripDay, setTripDay] = useState<number | null>(getTripDay);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
      setTripDay(getTripDay());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Trip is over
  if (Date.now() > TRIP_END) return null;

  return (
    <Card className="py-4">
      <CardContent className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Countdown
        </p>

        {tripDay !== null ? (
          <p className="text-center text-lg font-bold bg-gradient-to-b from-wc-gold to-wc-coral bg-clip-text text-transparent">
            Day {tripDay} of the trip!
          </p>
        ) : (
          <div className="flex items-center justify-between px-2">
            <TimeUnit value={timeLeft.days} label="days" />
            <span className="text-lg font-light text-muted-foreground/40 -mt-3">
              :
            </span>
            <TimeUnit value={timeLeft.hours} label="hrs" />
            <span className="text-lg font-light text-muted-foreground/40 -mt-3">
              :
            </span>
            <TimeUnit value={timeLeft.minutes} label="min" />
            <span className="text-lg font-light text-muted-foreground/40 -mt-3">
              :
            </span>
            <TimeUnit value={timeLeft.seconds} label="sec" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
