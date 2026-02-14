"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Lock,
  Trash2,
  Trophy,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { QuickPoll } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PollOption {
  text: string;
  votes: string[];
}

interface QuickPollsViewProps {
  polls: QuickPoll[];
  currentUser: string;
}

// ---------------------------------------------------------------------------
// Quick-create presets
// ---------------------------------------------------------------------------
const QUICK_PRESETS = [
  { label: "Pizza or Sushi?", icon: "🍕", question: "Pizza or Sushi?", options: ["🍕 Pizza", "🍣 Sushi"] },
  { label: "Beer or Cocktails?", icon: "🍺", question: "Beer or Cocktails?", options: ["🍺 Beer", "🍹 Cocktails"] },
  { label: "Beach or City?", icon: "🏖️", question: "Beach day or City walk?", options: ["🏖️ Beach", "🏙️ City"] },
  { label: "Early or Late?", icon: "🌅", question: "Early start or sleep in?", options: ["🌅 Early bird", "🌙 Sleep in"] },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function QuickPollsView({ polls, currentUser }: QuickPollsViewProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [question, setQuestion] = useState("");
  const [optionInputs, setOptionInputs] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");

  // Split polls into active vs closed
  const { active, closed } = useMemo(() => {
    const active: QuickPoll[] = [];
    const closed: QuickPoll[] = [];
    for (const poll of polls) {
      if (poll.closed) {
        closed.push(poll);
      } else {
        active.push(poll);
      }
    }
    return { active, closed };
  }, [polls]);

  // ---- Form helpers ----

  function resetForm() {
    setQuestion("");
    setOptionInputs(["", ""]);
    setExpiresAt("");
  }

  function addOptionInput() {
    if (optionInputs.length < 4) {
      setOptionInputs([...optionInputs, ""]);
    }
  }

  function removeOptionInput(index: number) {
    if (optionInputs.length <= 2) return;
    setOptionInputs(optionInputs.filter((_, i) => i !== index));
  }

  function updateOption(index: number, value: string) {
    const next = [...optionInputs];
    next[index] = value;
    setOptionInputs(next);
  }

  // ---- API calls ----

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmedOptions = optionInputs.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || trimmedOptions.length < 2) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          options: trimmedOptions,
          expiresAt: expiresAt || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create poll");
      }

      toast.success("Poll created!");
      resetForm();
      setFormOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuickCreate(preset: (typeof QUICK_PRESETS)[number]) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: preset.question,
          options: [...preset.options],
        }),
      });

      if (!res.ok) throw new Error("Failed to create poll");

      toast.success("Poll created!");
      router.refresh();
    } catch {
      toast.error("Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(pollId: string, optionIndex: number) {
    try {
      const res = await fetch(`/api/polls/${pollId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to vote");
      }

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to vote");
    }
  }

  async function handleClose(pollId: string) {
    try {
      const res = await fetch(`/api/polls/${pollId}/close`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to close poll");

      toast.success("Poll closed!");
      router.refresh();
    } catch {
      toast.error("Failed to close poll");
    }
  }

  async function handleDelete(pollId: string) {
    try {
      const res = await fetch(`/api/polls/${pollId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete poll");

      toast.success("Poll deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete poll");
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick-create presets */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PRESETS.map((preset) => (
          <Button
            key={preset.question}
            variant="outline"
            size="sm"
            disabled={submitting}
            onClick={() => handleQuickCreate(preset)}
            className="text-xs"
          >
            {preset.icon} {preset.label}
          </Button>
        ))}
      </div>

      {/* Active polls */}
      {active.length === 0 && closed.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No polls yet.</p>
          <p className="text-xs mt-1">Create one to get the group voting!</p>
        </div>
      ) : (
        <>
          {active.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active polls right now.
            </p>
          )}
          <div className="space-y-3">
            {active.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                currentUser={currentUser}
                onVote={handleVote}
                onClose={handleClose}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Closed polls (collapsed) */}
      {closed.length > 0 && (
        <div>
          <button
            onClick={() => setShowClosed(!showClosed)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            {showClosed ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
            <Lock className="size-3.5" />
            <span>Closed polls ({closed.length})</span>
          </button>

          {showClosed && (
            <div className="space-y-3 mt-2">
              {closed.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  currentUser={currentUser}
                  onVote={handleVote}
                  onClose={handleClose}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating add button */}
      <Button
        onClick={() => setFormOpen(true)}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-teal text-white hover:bg-wc-teal/90"
      >
        <Plus className="size-5" />
      </Button>

      {/* New poll form sheet */}
      <Sheet open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) resetForm(); }}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>New Poll</SheetTitle>
            <SheetDescription>
              Ask the group a question and let them vote.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreate} className="space-y-4 p-4">
            {/* Question */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question</label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What should we do tonight?"
                required
              />
            </div>

            {/* Options */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2">
                {optionInputs.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      required
                    />
                    {optionInputs.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeOptionInput(i)}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {optionInputs.length < 4 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addOptionInput}
                  className="text-xs mt-1"
                >
                  <Plus className="size-3 mr-1" />
                  Add option
                </Button>
              )}
            </div>

            {/* Optional expiry */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Expires at (optional)</label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !question.trim() || optionInputs.filter((o) => o.trim()).length < 2}
            >
              {submitting ? "Creating..." : "Create Poll"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Poll Card
// ---------------------------------------------------------------------------
interface PollCardProps {
  poll: QuickPoll;
  currentUser: string;
  onVote: (pollId: string, optionIndex: number) => void;
  onClose: (pollId: string) => void;
  onDelete: (pollId: string) => void;
}

function PollCard({ poll, currentUser, onVote, onClose, onDelete }: PollCardProps) {
  const options = JSON.parse(poll.options) as PollOption[];
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes.length, 0);

  // Find current user's vote
  const myVoteIndex = options.findIndex((opt) =>
    opt.votes.includes(currentUser)
  );

  // Find winner(s) for closed polls
  const maxVotes = Math.max(...options.map((o) => o.votes.length));
  const isWinner = (opt: PollOption) =>
    poll.closed && opt.votes.length === maxVotes && maxVotes > 0;

  return (
    <Card className={cn("py-4", poll.closed && "opacity-75")}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">
              {poll.question}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              by {poll.createdBy}
              {poll.closed && (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                  Closed
                </Badge>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {!poll.closed && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onClose(poll.id)}
                title="Close poll"
              >
                <Lock className="size-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(poll.id)}
              title="Delete poll"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {options.map((opt, i) => {
            const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
            const isMyVote = i === myVoteIndex;
            const winner = isWinner(opt);

            return (
              <div key={i} className="space-y-1">
                {/* Vote button / result bar */}
                <button
                  onClick={() => !poll.closed && onVote(poll.id, i)}
                  disabled={poll.closed}
                  className={cn(
                    "relative w-full rounded-lg border text-left text-sm transition-all overflow-hidden",
                    poll.closed
                      ? "cursor-default"
                      : "cursor-pointer hover:border-foreground/30",
                    isMyVote && !poll.closed && "border-wc-teal ring-1 ring-wc-teal/30",
                    winner && "border-amber-500 ring-1 ring-amber-500/30"
                  )}
                >
                  {/* Background bar */}
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 transition-all duration-300",
                      winner
                        ? "bg-amber-500/15"
                        : isMyVote
                          ? "bg-wc-teal/10"
                          : "bg-muted/50"
                    )}
                    style={{ width: `${pct}%` }}
                  />

                  {/* Content */}
                  <div className="relative flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {winner && <Trophy className="size-3.5 text-amber-500 shrink-0" />}
                      <span className={cn(
                        "truncate",
                        isMyVote && "font-semibold",
                        winner && "font-semibold"
                      )}>
                        {opt.text}
                      </span>
                      {isMyVote && !poll.closed && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 shrink-0">
                          You
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium shrink-0 ml-2">
                      {opt.votes.length} ({pct}%)
                    </span>
                  </div>
                </button>

                {/* Voter names */}
                {opt.votes.length > 0 && (
                  <p className="text-[11px] text-muted-foreground pl-3">
                    {opt.votes.join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <p className="text-[11px] text-muted-foreground">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          {poll.expiresAt && !poll.closed && (
            <span className="ml-2">
              Expires {new Date(poll.expiresAt).toLocaleString()}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
