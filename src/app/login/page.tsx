"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Traveler {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [tripCode, setTripCode] = useState("");
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [isPending, startTransition] = useTransition();

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-wc-gold/10 p-4">
            <Trophy className="size-10 text-wc-gold" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-wc-gold">
            Kickoff
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            World Cup 2026 Road Trip
          </p>
        </div>

        {/* Step 1: Trip Code */}
        <div
          className={`transition-all duration-300 ${
            step === 1
              ? "translate-y-0 opacity-100"
              : "pointer-events-none absolute -translate-y-4 opacity-0"
          }`}
        >
          <Card className="p-6">
            <form onSubmit={handleTripCode} className="space-y-4">
              <div>
                <label
                  htmlFor="tripCode"
                  className="mb-1.5 block text-sm font-medium text-foreground"
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
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !tripCode.trim()}
              >
                {isPending ? "Checking..." : "Enter"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Step 2: Pick Traveler */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Who are you?
            </p>
            <div className="space-y-3">
              {travelers.map((traveler) => (
                <button
                  key={traveler.id}
                  onClick={() => handlePickTraveler(traveler)}
                  disabled={isPending}
                  className="group w-full rounded-xl border-2 bg-card p-4 text-left transition-all hover:bg-wc-blue/10 disabled:opacity-50"
                  style={{ borderColor: traveler.color }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{traveler.emoji}</span>
                    <span className="text-lg font-semibold text-card-foreground">
                      {traveler.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              disabled={isPending}
            >
              Use a different trip code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
