"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TICKET_STATUS, MATCH_PRIORITY } from "@/lib/constants";
import { countryFlag } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Match } from "@/lib/schema";

interface MatchEditFormProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchEditForm({
  match,
  open,
  onOpenChange,
}: MatchEditFormProps) {
  const router = useRouter();

  const [ticketStatus, setTicketStatus] = useState("none");
  const [priority, setPriority] = useState("0");
  const [attending, setAttending] = useState(false);
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketNotes, setTicketNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync form state when match changes or sheet opens
  useEffect(() => {
    if (open && match) {
      setTicketStatus(match.ticketStatus);
      setPriority(String(match.priority));
      setAttending(match.attending);
      setTicketPrice(match.ticketPrice != null ? String(match.ticketPrice) : "");
      setTicketNotes(match.ticketNotes ?? "");
      setNotes(match.notes ?? "");
    }
  }, [open, match]);

  async function handleSave() {
    if (!match) return;

    setSaving(true);
    try {
      const payload = {
        ticketStatus,
        priority: Number(priority),
        attending,
        ticketPrice: ticketPrice ? Number(ticketPrice) : null,
        ticketNotes: ticketNotes.trim() || null,
        notes: notes.trim() || null,
      };

      const res = await fetch(`/api/matches/${match.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update match");
      }

      toast.success("Match updated");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  if (!match) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Match</SheetTitle>
          <SheetDescription>
            Update ticket info and priority for this match.
          </SheetDescription>
        </SheetHeader>

        {/* Match context header */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-center gap-3 py-3">
            <span className="text-xl">{countryFlag(match.homeTeam)}</span>
            <span className="text-sm font-bold">{match.homeTeam}</span>
            <span className="text-xs text-muted-foreground/50">vs</span>
            <span className="text-sm font-bold">{match.awayTeam}</span>
            <span className="text-xl">{countryFlag(match.awayTeam)}</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>{formatDate(match.matchDate)}</span>
            {match.kickoff && (
              <>
                <span>&middot;</span>
                <span>{formatTime(match.kickoff)}</span>
              </>
            )}
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {match.venue}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {/* Ticket Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ticket Status</label>
              <Select value={ticketStatus} onValueChange={setTicketStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TICKET_STATUS).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATCH_PRIORITY.map((p) => (
                    <SelectItem key={p.value} value={String(p.value)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attending toggle */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Attending</label>
            <button
              type="button"
              onClick={() => setAttending(!attending)}
              className={cn(
                "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors",
                attending
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-border bg-transparent text-muted-foreground"
              )}
            >
              <span>{attending ? "Going to this match" : "Not attending"}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  attending
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-border text-muted-foreground"
                )}
              >
                {attending ? "YES" : "NO"}
              </Badge>
            </button>
          </div>

          {/* Ticket Price */}
          <div className="space-y-1.5">
            <label htmlFor="me-price" className="text-sm font-medium">
              Ticket Price ($)
            </label>
            <Input
              id="me-price"
              type="number"
              min="0"
              step="0.01"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Ticket Notes */}
          <div className="space-y-1.5">
            <label htmlFor="me-ticket-notes" className="text-sm font-medium">
              Ticket Notes
            </label>
            <Textarea
              id="me-ticket-notes"
              value={ticketNotes}
              onChange={(e) => setTicketNotes(e.target.value)}
              placeholder="Seller info, section, row..."
              rows={2}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="me-notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="me-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={2}
            />
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
