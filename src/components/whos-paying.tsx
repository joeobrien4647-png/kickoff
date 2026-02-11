"use client";

import { useState, useCallback, useRef } from "react";

interface Traveler {
  name: string;
  emoji: string;
  color: string;
}

interface WhosPaidProps {
  travelers: Traveler[];
}

type SpinState = "idle" | "spinning" | "done";

export function WhosPaying({ travelers }: WhosPaidProps) {
  const [state, setState] = useState<SpinState>("idle");
  const [displayIndex, setDisplayIndex] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const spin = useCallback(() => {
    if (travelers.length === 0) return;
    cleanup();

    setState("spinning");
    setWinnerIndex(null);

    // Pick winner up front
    const winner = Math.floor(Math.random() * travelers.length);

    // Phase 1: fast cycling (first 2s at 60ms)
    let tick = 0;
    let idx = 0;

    intervalRef.current = setInterval(() => {
      tick++;
      idx = (idx + 1) % travelers.length;
      setDisplayIndex(idx);

      // After ~33 ticks (2s), slow down phase
      if (tick > 33) {
        cleanup();

        // Phase 2: decelerating (8 more ticks, increasing delay)
        let slowTick = 0;
        const slowCycle = () => {
          slowTick++;
          // Walk toward the winner in the final ticks
          if (slowTick < 7) {
            idx = (idx + 1) % travelers.length;
            setDisplayIndex(idx);
            setTimeout(slowCycle, 80 + slowTick * 60);
          } else {
            // Land on winner
            setDisplayIndex(winner);
            setWinnerIndex(winner);
            setState("done");
          }
        };
        setTimeout(slowCycle, 120);
      }
    }, 60);
  }, [travelers, cleanup]);

  if (travelers.length === 0) return null;

  const current = travelers[displayIndex];
  const winner = winnerIndex !== null ? travelers[winnerIndex] : null;

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Who&apos;s Paying?
        </h3>
      </div>

      {/* Display */}
      <div className="px-4 pb-4 flex flex-col items-center gap-3">
        <div
          className={`relative w-full rounded-lg py-6 flex flex-col items-center justify-center transition-colors duration-300 ${
            state === "done" ? "whos-paying-celebrate" : "bg-muted"
          }`}
          style={
            state === "done" && winner
              ? { backgroundColor: winner.color + "22" }
              : undefined
          }
        >
          {/* Emoji */}
          <span
            className={`text-4xl transition-transform duration-300 ${
              state === "done" ? "whos-paying-winner-emoji" : ""
            } ${state === "spinning" ? "whos-paying-shuffle" : ""}`}
          >
            {current?.emoji}
          </span>

          {/* Name */}
          <span
            className={`text-lg font-bold mt-1 transition-all duration-300 ${
              state === "done" ? "whos-paying-winner-name" : ""
            }`}
            style={
              state === "done" && winner
                ? { color: winner.color }
                : undefined
            }
          >
            {current?.name}
          </span>

          {/* Celebration particles (CSS-only) */}
          {state === "done" && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="whos-paying-confetti"
                  style={{
                    left: `${8 + (i * 84) / 12}%`,
                    animationDelay: `${i * 0.08}s`,
                    backgroundColor:
                      ["var(--wc-gold)", "var(--wc-teal)", "var(--wc-coral)", "var(--wc-blue)"][i % 4],
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={spin}
          disabled={state === "spinning"}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            state === "spinning"
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-wc-coral text-white hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          {state === "idle"
            ? "SPIN!"
            : state === "spinning"
              ? "Spinning..."
              : "Spin Again!"}
        </button>
      </div>

    </div>
  );
}
