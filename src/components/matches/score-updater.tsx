"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { countryFlag } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ScoreUpdaterProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
}

export function ScoreUpdater({
  matchId,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
}: ScoreUpdaterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [home, setHome] = useState(homeScore?.toString() ?? "");
  const [away, setAway] = useState(awayScore?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      // Reset to current values when opening
      setHome(homeScore?.toString() ?? "");
      setAway(awayScore?.toString() ?? "");
    }
  }

  async function handleSave() {
    const h = home.trim() === "" ? null : Number(home);
    const a = away.trim() === "" ? null : Number(away);

    // Validate: both must be set or both null
    if ((h === null) !== (a === null)) {
      toast.error("Enter both scores or leave both empty");
      return;
    }

    // Validate: non-negative integers
    if (h !== null && (isNaN(h) || h < 0 || !Number.isInteger(h))) {
      toast.error("Home score must be a non-negative integer");
      return;
    }
    if (a !== null && (isNaN(a) || a < 0 || !Number.isInteger(a))) {
      toast.error("Away score must be a non-negative integer");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actualHomeScore: h,
          actualAwayScore: a,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update score");
      }

      toast.success("Score updated!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
          title="Update score"
        >
          <Edit2 className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Update Score</DialogTitle>
          <DialogDescription>
            Enter the final or current match score.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 py-2">
          {/* Home team */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-lg leading-none">
              {countryFlag(homeTeam)}
            </span>
            <span className="text-xs font-medium">{homeTeam}</span>
            <Input
              type="number"
              min="0"
              step="1"
              value={home}
              onChange={(e) => setHome(e.target.value)}
              placeholder="0"
              className={cn(
                "h-10 w-16 text-center text-lg font-bold tabular-nums"
              )}
            />
          </div>

          <span className="text-sm font-medium text-muted-foreground/50 pt-6">
            &ndash;
          </span>

          {/* Away team */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-lg leading-none">
              {countryFlag(awayTeam)}
            </span>
            <span className="text-xs font-medium">{awayTeam}</span>
            <Input
              type="number"
              min="0"
              step="1"
              value={away}
              onChange={(e) => setAway(e.target.value)}
              placeholder="0"
              className={cn(
                "h-10 w-16 text-center text-lg font-bold tabular-nums"
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
