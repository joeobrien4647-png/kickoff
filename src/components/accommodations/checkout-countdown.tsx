"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Clock, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/dates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CheckoutCountdownProps {
  accommodation: {
    id: string;
    name: string;
    checkinTime: string | null;
    checkoutTime: string | null;
  };
  /** The date to compare against, ISO format "YYYY-MM-DD" */
  currentDate: string;
  /** The departure date of the stop, ISO format "YYYY-MM-DD" */
  departDate: string;
  /** The arrival date of the stop, ISO format "YYYY-MM-DD" */
  arriveDate: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeCountdown(
  checkoutTime: string,
  departDate: string
): string | null {
  const [hours, minutes] = checkoutTime.split(":").map(Number);
  const target = new Date(departDate + "T00:00:00");
  target.setHours(hours, minutes, 0, 0);

  const nowMs = Date.now();
  const diff = target.getTime() - nowMs;

  if (diff <= 0) return null;

  const totalMinutes = Math.floor(diff / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CheckoutCountdown({
  accommodation,
  currentDate,
  departDate,
  arriveDate,
}: CheckoutCountdownProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [checkinTime, setCheckinTime] = useState(
    accommodation.checkinTime ?? ""
  );
  const [checkoutTime, setCheckoutTime] = useState(
    accommodation.checkoutTime ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);

  const isArrivalDay = currentDate === arriveDate;
  const isDepartureDay = currentDate === departDate;

  // Live countdown ticker
  const updateCountdown = useCallback(() => {
    if (isDepartureDay && accommodation.checkoutTime) {
      setCountdown(computeCountdown(accommodation.checkoutTime, departDate));
    } else {
      setCountdown(null);
    }
  }, [isDepartureDay, accommodation.checkoutTime, departDate]);

  useEffect(() => {
    updateCountdown();
    if (!isDepartureDay || !accommodation.checkoutTime) return;
    const interval = setInterval(updateCountdown, 60_000);
    return () => clearInterval(interval);
  }, [updateCountdown, isDepartureDay, accommodation.checkoutTime]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/accommodations/${accommodation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkinTime: checkinTime || null,
          checkoutTime: checkoutTime || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save times");
      toast.success("Times updated");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Failed to update times");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setCheckinTime(accommodation.checkinTime ?? "");
    setCheckoutTime(accommodation.checkoutTime ?? "");
    setEditing(false);
  }

  const hasAnyTime = accommodation.checkinTime || accommodation.checkoutTime;

  // ── Editing mode ──
  if (editing) {
    return (
      <div className="rounded-lg border bg-card p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3" />
            Set times
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleSave}
              disabled={saving}
            >
              <Check className="size-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Check-in
            </span>
            <Input
              type="time"
              value={checkinTime}
              onChange={(e) => setCheckinTime(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Check-out
            </span>
            <Input
              type="time"
              value={checkoutTime}
              onChange={(e) => setCheckoutTime(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Display mode ──
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="size-3.5 text-muted-foreground" />

          {hasAnyTime ? (
            <div className="flex items-center gap-3 text-xs">
              {accommodation.checkinTime && (
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">In</span>{" "}
                  {formatTime(accommodation.checkinTime)}
                </span>
              )}
              {accommodation.checkoutTime && (
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">Out</span>{" "}
                  {formatTime(accommodation.checkoutTime)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              No times set
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-3" />
        </Button>
      </div>

      {/* Contextual status line */}
      {isDepartureDay && countdown && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              "bg-amber-500/15 text-amber-700 dark:text-amber-400"
            )}
          >
            <Clock className="size-2.5" />
            Check out in {countdown}
          </span>
        </div>
      )}

      {isArrivalDay && !isDepartureDay && accommodation.checkinTime && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
            )}
          >
            <Clock className="size-2.5" />
            Check in at {formatTime(accommodation.checkinTime)}
          </span>
        </div>
      )}
    </div>
  );
}
