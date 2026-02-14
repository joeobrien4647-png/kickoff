"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Car, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import type { DrivingAssignment } from "@/lib/schema";

// ============ ROUTE DATA ============
const LEGS = [
  { from: "Boston", to: "New York", miles: 215, hours: 3, minutes: 50 },
  { from: "New York", to: "Philadelphia", miles: 97, hours: 1, minutes: 50 },
  { from: "Philadelphia", to: "Washington DC", miles: 140, hours: 2, minutes: 30 },
  { from: "Washington DC", to: "Nashville", miles: 670, hours: 9, minutes: 40 },
  { from: "Nashville", to: "Miami", miles: 780, hours: 11, minutes: 30 },
] as const;

interface Traveler {
  name: string;
  emoji: string;
  color: string;
}

interface DrivingTrackerProps {
  assignments: DrivingAssignment[];
  travelers: Traveler[];
  currentUser: string;
}

/** Total decimal hours for a leg */
function legHours(hours: number, minutes: number): number {
  return hours + minutes / 60;
}

/** Format decimal hours as "Xh Ym" */
function formatHours(decimal: number): string {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function DrivingTracker({
  assignments,
  travelers,
  currentUser,
}: DrivingTrackerProps) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  // Build lookup: "from→to" => assignment
  const assignmentMap = new Map<string, DrivingAssignment>();
  for (const a of assignments) {
    assignmentMap.set(`${a.fromCity}→${a.toCity}`, a);
  }

  // Calculate hours per traveler
  const hoursByTraveler = new Map<string, number>();
  for (const t of travelers) {
    hoursByTraveler.set(t.name, 0);
  }
  for (const leg of LEGS) {
    const key = `${leg.from}→${leg.to}`;
    const assignment = assignmentMap.get(key);
    if (assignment) {
      const current = hoursByTraveler.get(assignment.driverName) || 0;
      hoursByTraveler.set(
        assignment.driverName,
        current + legHours(leg.hours, leg.minutes)
      );
    }
  }

  // Fairness indicator
  const assignedHours = Array.from(hoursByTraveler.values()).filter((h) => h > 0);
  const maxDiff =
    assignedHours.length >= 2
      ? Math.max(...assignedHours) - Math.min(...assignedHours)
      : 0;
  const allAssigned = LEGS.every(
    (leg) => assignmentMap.has(`${leg.from}→${leg.to}`)
  );

  function fairnessColor(): string {
    if (!allAssigned) return "text-muted-foreground";
    if (maxDiff <= 2) return "text-emerald-400";
    if (maxDiff <= 4) return "text-amber-400";
    return "text-wc-coral";
  }

  function fairnessLabel(): string {
    if (!allAssigned) return "Assign all legs to check fairness";
    if (maxDiff <= 2) return "Fair split";
    if (maxDiff <= 4) return "Slightly uneven";
    return "Uneven split";
  }

  async function assignDriver(
    from: string,
    to: string,
    driverName: string,
    legHrs: number
  ) {
    const key = `${from}→${to}`;
    setSaving(key);
    try {
      const existing = assignmentMap.get(key);
      if (existing) {
        // Update existing assignment
        const res = await fetch(`/api/driving/${existing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driverName, estimatedHours: legHrs }),
        });
        if (!res.ok) throw new Error("Failed to update assignment");
        toast.success(`${driverName} assigned to ${from} → ${to}`);
      } else {
        // Create new assignment
        const res = await fetch("/api/driving", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromCity: from,
            toCity: to,
            driverName,
            estimatedHours: legHrs,
          }),
        });
        if (!res.ok) throw new Error("Failed to create assignment");
        toast.success(`${driverName} assigned to ${from} → ${to}`);
      }
      router.refresh();
    } catch {
      toast.error("Failed to assign driver");
    } finally {
      setSaving(null);
    }
  }

  async function clearAssignment(from: string, to: string) {
    const key = `${from}→${to}`;
    const existing = assignmentMap.get(key);
    if (!existing) return;

    setSaving(key);
    try {
      const res = await fetch(`/api/driving/${existing.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove assignment");
      toast.success(`Cleared driver for ${from} → ${to}`);
      router.refresh();
    } catch {
      toast.error("Failed to clear assignment");
    } finally {
      setSaving(null);
    }
  }

  // Total hours across all legs
  const totalHours = LEGS.reduce(
    (sum, leg) => sum + legHours(leg.hours, leg.minutes),
    0
  );

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Car className="size-5 text-wc-coral" />
          Who&apos;s Driving
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ---- Hours Tally ---- */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {travelers.map((t) => {
              const hrs = hoursByTraveler.get(t.name) || 0;
              return (
                <div
                  key={t.name}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span>{t.emoji}</span>
                  <span className="font-medium">{t.name}:</span>
                  <span className="text-muted-foreground">
                    {formatHours(hrs)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Visual bar chart */}
          <div className="space-y-1.5">
            {travelers.map((t) => {
              const hrs = hoursByTraveler.get(t.name) || 0;
              const pct = totalHours > 0 ? (hrs / totalHours) * 100 : 0;
              return (
                <div key={t.name} className="flex items-center gap-2">
                  <span className="text-xs w-16 text-right truncate">
                    {t.name}
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(pct, 0)}%`,
                        backgroundColor: t.color,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-10">
                    {formatHours(hrs)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Fairness indicator */}
          <div className="flex items-center gap-2">
            <Users className="size-3.5 text-muted-foreground" />
            <span className={cn("text-xs font-medium", fairnessColor())}>
              {fairnessLabel()}
            </span>
            {allAssigned && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  maxDiff <= 2
                    ? "border-emerald-400/30 text-emerald-400"
                    : maxDiff <= 4
                      ? "border-amber-400/30 text-amber-400"
                      : "border-wc-coral/30 text-wc-coral"
                )}
              >
                {formatHours(maxDiff)} spread
              </Badge>
            )}
          </div>
        </div>

        {/* ---- Leg Cards ---- */}
        <div className="space-y-2">
          {LEGS.map((leg) => {
            const key = `${leg.from}→${leg.to}`;
            const assignment = assignmentMap.get(key);
            const driver = assignment
              ? travelers.find((t) => t.name === assignment.driverName)
              : null;
            const isSaving = saving === key;
            const fromIdentity = getCityIdentity(leg.from);
            const toIdentity = getCityIdentity(leg.to);
            const hrs = legHours(leg.hours, leg.minutes);

            return (
              <div
                key={key}
                className="flex items-center gap-3 rounded-lg border bg-card/50 p-3"
              >
                {/* Route info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className={fromIdentity.color}>{leg.from}</span>
                    <span className="text-muted-foreground">&rarr;</span>
                    <span className={toIdentity.color}>{leg.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{leg.miles} mi</span>
                    <span>&middot;</span>
                    <Clock className="size-3" />
                    <span>{formatHours(hrs)}</span>
                  </div>
                </div>

                {/* Driver select */}
                <div className="flex items-center gap-2 shrink-0">
                  <Select
                    value={assignment?.driverName || ""}
                    onValueChange={(value) =>
                      assignDriver(leg.from, leg.to, value, hrs)
                    }
                    disabled={isSaving}
                  >
                    <SelectTrigger
                      size="sm"
                      className={cn(
                        "w-[130px] text-xs",
                        driver
                          ? "border-border"
                          : "border-dashed border-muted-foreground/30"
                      )}
                    >
                      <SelectValue
                        placeholder="Assign driver"
                      >
                        {driver ? (
                          <span className="flex items-center gap-1.5">
                            <span>{driver.emoji}</span>
                            <span>{driver.name}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Assign driver
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {travelers.map((t) => (
                        <SelectItem key={t.name} value={t.name}>
                          <span className="flex items-center gap-1.5">
                            <span>{t.emoji}</span>
                            {t.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {assignment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => clearAssignment(leg.from, leg.to)}
                      disabled={isSaving}
                    >
                      &times;
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
