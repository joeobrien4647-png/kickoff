"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Confetti keyframes — injected once via a <style> tag
// ---------------------------------------------------------------------------
const CONFETTI_CSS = `
@keyframes confetti-fall {
  0% { transform: translateY(-10px) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateY(80px) rotate(720deg) scale(0); opacity: 0; }
}
@keyframes confetti-burst {
  0% { transform: scale(0); opacity: 0; }
  30% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.checkin-confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: confetti-fall 1.2s ease-out forwards;
}
.checkin-burst {
  animation: confetti-burst 0.4s ease-out forwards;
}
`;

const CONFETTI_COLORS = [
  "bg-wc-gold",
  "bg-wc-teal",
  "bg-wc-coral",
  "bg-emerald-400",
  "bg-sky-400",
  "bg-violet-400",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CityCheckinProps {
  stop: {
    id: string;
    city: string;
    checkedInAt: string | null;
    checkedInBy: string | null;
  };
  currentUser: string;
}

export function CityCheckin({ stop, currentUser }: CityCheckinProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isCheckedIn = !!stop.checkedInAt;

  async function handleCheckin() {
    setSaving(true);
    try {
      const res = await fetch(`/api/stops/${stop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkedInAt: new Date().toISOString(),
          checkedInBy: currentUser,
        }),
      });
      if (!res.ok) throw new Error("Failed to check in");

      // Trigger confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);

      toast.success(`Checked in at ${stop.city}!`);
      router.refresh();
    } catch {
      toast.error("Failed to check in");
    } finally {
      setSaving(false);
    }
  }

  // ── Checked-in state ───────────────────────────────────────────────
  if (isCheckedIn) {
    const checkedDate = new Date(stop.checkedInAt!);
    const timeStr = checkedDate.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="size-3.5" />
        </div>
        <span className="font-medium text-emerald-400">Arrived!</span>
        <span className="text-xs text-muted-foreground">
          {timeStr} &middot; {stop.checkedInBy}
        </span>
      </div>
    );
  }

  // ── Not checked in — show big button ───────────────────────────────
  return (
    <div className="relative">
      {/* Inject confetti CSS */}
      <style dangerouslySetInnerHTML={{ __html: CONFETTI_CSS }} />

      {/* Confetti burst */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "checkin-confetti-piece",
                CONFETTI_COLORS[i % CONFETTI_COLORS.length]
              )}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 0.3}s`,
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
              }}
            />
          ))}
        </div>
      )}

      <Button
        onClick={handleCheckin}
        disabled={saving}
        className={cn(
          "w-full gap-2 font-semibold",
          "bg-gradient-to-r from-wc-teal to-emerald-500 hover:from-wc-teal/90 hover:to-emerald-500/90",
          "text-white shadow-md",
          showConfetti && "checkin-burst"
        )}
      >
        <MapPin className="size-4" />
        {saving ? "Checking in..." : "We're Here!"}
      </Button>
    </div>
  );
}
