"use client";

import { useState, useEffect } from "react";

const TRIP_START = new Date("2026-06-11T00:00:00").getTime();
const TRIP_END = new Date("2026-06-26T23:59:59").getTime();

export function HeroCountdown() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setMounted((m) => !m || true), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();
  const diff = Math.max(0, TRIP_START - now);
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const isDuringTrip = now >= TRIP_START && now <= TRIP_END;
  const tripDay = isDuringTrip
    ? Math.floor((now - TRIP_START) / (1000 * 60 * 60 * 24)) + 1
    : null;

  // Prevent hydration mismatch — show nothing until mounted
  if (!mounted) {
    return (
      <>
        <p className="text-7xl md:text-9xl font-bold tabular-nums bg-gradient-to-b from-wc-gold to-wc-coral bg-clip-text text-transparent">
          &mdash;
        </p>
        <p className="text-lg text-muted-foreground mt-2">&nbsp;</p>
      </>
    );
  }

  return (
    <>
      <p className="text-7xl md:text-9xl font-bold tabular-nums bg-gradient-to-b from-wc-gold to-wc-coral bg-clip-text text-transparent">
        {isDuringTrip ? tripDay : daysRemaining}
      </p>
      <p className="text-lg text-muted-foreground mt-2">
        {isDuringTrip ? `Day ${tripDay} of the trip` : "days to go"}
      </p>
    </>
  );
}
