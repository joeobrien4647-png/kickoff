"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { daysUntilTrip } from "@/lib/dates";
import { TrumpHologram } from "@/components/trump-hologram";

interface Traveler {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

const ROUTE_CITIES = [
  "Boston",
  "NYC",
  "Philly",
  "DC",
  "Atlanta",
  "Miami",
];

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [tripCode, setTripCode] = useState("");
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [isPending, startTransition] = useTransition();

  const remaining = daysUntilTrip();

  async function handleTripCode(e: React.FormEvent) {
    e.preventDefault();
    const code = tripCode.trim();
    if (!code) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripCode: code }),
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Invalid trip code");
          return;
        }

        const data = await res.json();
        setTravelers(data.travelers);
        setStep(2);
      } catch {
        toast.error("Something went wrong. Try again.");
      }
    });
  }

  async function handlePickTraveler(traveler: Traveler) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tripCode: tripCode.trim(),
            travelerId: traveler.id,
            travelerName: traveler.name,
          }),
        });

        if (!res.ok) {
          toast.error("Failed to sign in. Try again.");
          return;
        }

        router.push("/");
        router.refresh();
      } catch {
        toast.error("Something went wrong. Try again.");
      }
    });
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[oklch(0.12_0.01_260)] px-4">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-wc-gold/8 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-wc-coral/8 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-wc-teal/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Floating trophy */}
        <div
          className="mb-6"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <div className="inline-flex items-center justify-center rounded-2xl border border-wc-gold/20 bg-wc-gold/10 p-5 backdrop-blur-sm">
            <Trophy className="size-12 text-wc-gold" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-1 bg-gradient-to-r from-wc-gold to-wc-coral bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-7xl">
          KICKOFF
        </h1>
        <p className="mb-8 text-sm tracking-widest text-white/50 uppercase">
          World Cup 2026 &middot; East Coast Road Trip
        </p>

        {/* Countdown */}
        <div className="mb-8 text-center">
          <p className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-8xl font-bold tabular-nums text-transparent md:text-9xl">
            {remaining}
          </p>
          <p className="mt-1 text-lg text-white/40">days to go</p>
        </div>

        {/* Route preview */}
        <div className="mb-10 flex items-center gap-2">
          {ROUTE_CITIES.map((city, i) => (
            <div key={city} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="size-2.5 rounded-full bg-wc-gold/70"
                  style={{
                    animation: `dot-pulse 2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
                <span className="text-[10px] text-white/50">{city}</span>
              </div>
              {i < ROUTE_CITIES.length - 1 && (
                <div className="mb-4 h-px w-4 bg-white/15 sm:w-6" />
              )}
            </div>
          ))}
        </div>

        {/* Trump Hologram */}
        <div className="mb-8 w-full max-w-sm">
          <TrumpHologram compact />
        </div>

        {/* Login form — glass morphism card */}
        <div className="w-full max-w-sm">
          {/* Step 1: Trip Code */}
          <div
            className={`transition-all duration-300 ${
              step === 1
                ? "translate-y-0 opacity-100"
                : "pointer-events-none absolute -translate-y-4 opacity-0"
            }`}
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <form onSubmit={handleTripCode} className="space-y-4">
                <div>
                  <label
                    htmlFor="tripCode"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Trip Code
                  </label>
                  <Input
                    id="tripCode"
                    type="text"
                    placeholder="Enter your trip code"
                    value={tripCode}
                    onChange={(e) => setTripCode(e.target.value)}
                    autoFocus
                    autoComplete="off"
                    disabled={isPending}
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-wc-gold/50"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-wc-gold to-wc-coral text-white hover:opacity-90"
                  disabled={isPending || !tripCode.trim()}
                >
                  {isPending ? "Checking..." : "Enter"}
                </Button>
              </form>
            </div>
          </div>

          {/* Step 2: Pick Traveler */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="mb-3 text-center text-sm font-medium text-white/50">
                Who are you?
              </p>
              <div className="space-y-3">
                {travelers.map((traveler) => (
                  <button
                    key={traveler.id}
                    onClick={() => handlePickTraveler(traveler)}
                    disabled={isPending}
                    className="group w-full rounded-xl border-2 bg-white/5 p-4 text-left backdrop-blur-xl transition-all hover:bg-white/10 disabled:opacity-50"
                    style={{ borderColor: `${traveler.color}66` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{traveler.emoji}</span>
                      <span className="text-lg font-semibold text-white">
                        {traveler.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-4 w-full text-center text-xs text-white/30 transition-colors hover:text-white/60"
                disabled={isPending}
              >
                Use a different trip code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
