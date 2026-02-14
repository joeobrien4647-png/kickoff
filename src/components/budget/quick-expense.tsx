"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Coffee,
  Beer,
  UtensilsCrossed,
  Car,
  Fuel,
  ParkingSquare,
  Wine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { today } from "@/lib/dates";
import type { Traveler } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Preset definitions
// ---------------------------------------------------------------------------

interface Preset {
  label: string;
  amount: number;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRESETS: Preset[] = [
  { label: "Coffee", amount: 5, category: "food", icon: Coffee },
  { label: "Beer", amount: 8, category: "drinks", icon: Beer },
  { label: "Lunch", amount: 15, category: "food", icon: UtensilsCrossed },
  { label: "Dinner", amount: 40, category: "food", icon: Wine },
  { label: "Uber", amount: 20, category: "transport", icon: Car },
  { label: "Gas", amount: 50, category: "transport", icon: Fuel },
  { label: "Parking", amount: 10, category: "transport", icon: ParkingSquare },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the travelerName from the kickoff_session cookie (client-side). */
function getCurrentUser(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("kickoff_session="));
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match.split("=").slice(1).join("="));
    const session = JSON.parse(decoded) as { travelerId?: string };
    return session.travelerId ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface QuickExpenseProps {
  travelers: Traveler[];
  className?: string;
}

export function QuickExpense({ travelers, className }: QuickExpenseProps) {
  const router = useRouter();
  const [pendingPreset, setPendingPreset] = useState<string | null>(null);

  async function handlePreset(preset: Preset) {
    const currentUserId = getCurrentUser();
    const paidBy = currentUserId ?? travelers[0]?.id;

    if (!paidBy) {
      toast.error("No traveler found");
      return;
    }

    setPendingPreset(preset.label);
    try {
      const share = Math.round((preset.amount / travelers.length) * 100) / 100;
      const splits = travelers.map((t) => ({
        travelerId: t.id,
        share,
      }));

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: preset.label,
          amount: preset.amount,
          category: preset.category,
          paidBy,
          date: today(),
          splits,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add expense");
      }

      toast.success(`${preset.label} - $${preset.amount} added`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add expense"
      );
    } finally {
      setPendingPreset(null);
    }
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {PRESETS.map((preset) => {
        const Icon = preset.icon;
        const isPending = pendingPreset === preset.label;

        return (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset)}
            disabled={pendingPreset !== null}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-border",
              "px-3 py-1.5 text-xs font-medium",
              "bg-card hover:bg-muted/60 active:scale-95",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:pointer-events-none",
              isPending && "animate-pulse"
            )}
          >
            <Icon className="size-3.5 text-muted-foreground" />
            <span>{preset.label}</span>
            <span className="text-muted-foreground">${preset.amount}</span>
          </button>
        );
      })}
    </div>
  );
}
