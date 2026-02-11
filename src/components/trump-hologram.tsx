"use client";

import { useState, useEffect } from "react";

const QUOTES = [
  "This will be the greatest World Cup ever, believe me! \u{1F3C6}",
  "Nobody does World Cups better than America. Nobody! \u{1F1FA}\u{1F1F8}",
  "We're going to have the best stadiums, the best fans, tremendous! \u{26BD}",
  "Welcome to America, folks! The greatest country in the world! \u{1F985}",
  "This World Cup will be HUGE. Absolutely HUGE! \u{1F389}",
  "We're going to win so much, you'll get tired of winning! \u{1F947}",
  "The food, the cities, the football \u{2014} it's going to be beautiful! \u{1F31F}",
];

export function TrumpHologram({ compact = false }: { compact?: boolean }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        setIsFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      {!compact && (
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Presidential Address
        </h3>
      )}
      <div
        className="relative overflow-hidden rounded-xl border border-cyan-400/30 bg-[oklch(0.15_0.02_220)] p-4"
        style={{
          animation: "hologram-flicker 4s ease-in-out infinite, hologram-glow 3s ease-in-out infinite",
        }}
      >
        {/* Scan line overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.8 0.15 200 / 0.5) 2px, oklch(0.8 0.15 200 / 0.5) 4px)",
            backgroundSize: "100% 4px",
            animation: "hologram-scan 8s linear infinite",
          }}
        />

        {/* Trump character */}
        <div className="relative flex items-start gap-3">
          <div className="flex shrink-0 flex-col items-center">
            <span className="text-3xl" role="img" aria-label="Trump">
              {"👨‍💼"}
            </span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-cyan-400">
              POTUS
            </span>
          </div>

          {/* Quote bubble */}
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm leading-relaxed text-cyan-200 transition-opacity duration-300 ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
            >
              &ldquo;{QUOTES[quoteIndex]}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
