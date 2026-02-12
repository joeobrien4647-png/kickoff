"use client";

import { useState } from "react";
import {
  Vote,
  CheckCircle2,
  CircleDot,
  Car,
  Bed,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Decision, Traveler } from "@/lib/schema";

const CATEGORY_CONFIG = {
  route: { label: "Route", icon: MapPin, color: "text-wc-blue" },
  transport: { label: "Transport", icon: Car, color: "text-wc-teal" },
  accommodation: { label: "Accommodation", icon: Bed, color: "text-purple-400" },
  activity: { label: "Activity", icon: MapPin, color: "text-wc-coral" },
  budget: { label: "Budget", icon: DollarSign, color: "text-wc-gold" },
} as const;

interface KeyDecisionsProps {
  decisions: Decision[];
  travelers: Traveler[];
  currentUser: string;
}

export function KeyDecisions({
  decisions,
  travelers,
  currentUser,
}: KeyDecisionsProps) {
  const router = useRouter();
  const [voting, setVoting] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const openDecisions = decisions.filter((d) => d.status === "open");
  const decidedDecisions = decisions.filter((d) => d.status === "decided");

  function resetForm() {
    setQuestion("");
    setDescription("");
    setCategory("");
    setOptions(["", ""]);
  }

  function addOption() {
    if (options.length < 4) setOptions([...options, ""]);
  }

  function removeOption(index: number) {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  }

  function updateOption(index: number, value: string) {
    setOptions(options.map((o, i) => (i === index ? value : o)));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const filledOptions = options.filter((o) => o.trim());
    if (!question.trim() || !category || filledOptions.length < 2) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          description: description.trim() || undefined,
          category,
          options: filledOptions.map((text) => text.trim()),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create decision");
      }
      toast.success("Decision created!");
      resetForm();
      setFormOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create decision"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(decisionId: string, optionText: string) {
    setVoting(`${decisionId}:${optionText}`);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisionId, optionText }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
      toast.success("Vote recorded!");
    } catch {
      toast.error("Failed to vote");
    } finally {
      setVoting(null);
    }
  }

  function renderOption(
    option: { text: string; votes: string[] },
    decisionId: string,
    totalVotes: number,
    isDecided: boolean,
    isWinner: boolean
  ) {
    const hasVoted = option.votes.includes(currentUser);
    const voteCount = option.votes.length;
    const pct =
      totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
    const isVoting = voting === `${decisionId}:${option.text}`;

    return (
      <button
        key={option.text}
        onClick={() => !isDecided && handleVote(decisionId, option.text)}
        disabled={isDecided || isVoting}
        className={cn(
          "relative w-full text-left rounded-lg border p-3 transition-all overflow-hidden",
          isDecided &&
            isWinner &&
            "border-emerald-500/30 bg-emerald-500/5",
          isDecided && !isWinner && "opacity-50",
          !isDecided &&
            hasVoted &&
            "border-wc-teal/40 bg-wc-teal/5",
          !isDecided &&
            !hasVoted &&
            "border-border hover:border-wc-teal/30 hover:bg-accent/30"
        )}
      >
        {/* Progress bar background */}
        {totalVotes > 0 && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-all",
              isWinner ? "bg-emerald-500/10" : "bg-muted/30"
            )}
            style={{ width: `${pct}%` }}
          />
        )}

        <div className="relative flex items-center gap-3">
          {/* Radio/Check indicator */}
          {isDecided && isWinner ? (
            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
          ) : (
            <CircleDot
              className={cn(
                "size-4 shrink-0",
                hasVoted ? "text-wc-teal" : "text-muted-foreground/40"
              )}
            />
          )}

          {/* Option text */}
          <span
            className={cn(
              "text-sm font-medium flex-1",
              hasVoted && "text-wc-teal"
            )}
          >
            {option.text}
          </span>

          {/* Voter avatars */}
          <div className="flex items-center gap-1">
            {option.votes.map((voterName) => {
              const traveler = travelers.find((t) => t.name === voterName);
              return traveler ? (
                <span key={voterName} className="text-sm" title={voterName}>
                  {traveler.emoji}
                </span>
              ) : null;
            })}
          </div>

          {/* Vote count */}
          {voteCount > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums ml-1">
              {voteCount}/{travelers.length}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Vote className="size-4 text-wc-gold" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Key Decisions
        </h2>
        {openDecisions.length > 0 && (
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {openDecisions.length} open
          </Badge>
        )}
        <button
          onClick={() => setFormOpen(true)}
          className={cn(
            "size-6 rounded-full flex items-center justify-center transition-colors",
            "bg-wc-gold/15 text-wc-gold hover:bg-wc-gold/25",
            openDecisions.length === 0 && "ml-auto"
          )}
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* Open decisions */}
      {openDecisions.map((decision) => {
        const options = JSON.parse(decision.options) as {
          text: string;
          votes: string[];
        }[];
        const totalVotes = options.reduce(
          (sum, o) => sum + o.votes.length,
          0
        );
        const cat =
          CATEGORY_CONFIG[
            decision.category as keyof typeof CATEGORY_CONFIG
          ];
        const CatIcon = cat?.icon ?? MapPin;

        return (
          <Card key={decision.id} className="py-4">
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CatIcon
                  className={cn(
                    "size-4 mt-0.5 shrink-0",
                    cat?.color ?? "text-muted-foreground"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{decision.question}</p>
                  {decision.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {decision.description}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-[9px] shrink-0">
                  {cat?.label ?? decision.category}
                </Badge>
              </div>

              <div className="space-y-2">
                {options.map((opt) =>
                  renderOption(opt, decision.id, totalVotes, false, false)
                )}
              </div>

              {/* Consensus indicator */}
              {totalVotes === travelers.length && (
                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  All voted!
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Decided decisions (collapsed) */}
      {decidedDecisions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Decided
          </p>
          {decidedDecisions.map((decision) => {
            const options = JSON.parse(decision.options) as {
              text: string;
              votes: string[];
            }[];
            const totalVotes = options.reduce(
              (sum, o) => sum + o.votes.length,
              0
            );

            return (
              <Card key={decision.id} className="py-3 opacity-80">
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <p className="text-sm font-medium">
                      {decision.question}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {options.map((opt) =>
                      renderOption(
                        opt,
                        decision.id,
                        totalVotes,
                        true,
                        opt.text === decision.decidedOption
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {decisions.length === 0 && (
        <Card className="py-8">
          <CardContent className="text-center text-muted-foreground">
            <Vote className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No decisions yet</p>
          </CardContent>
        </Card>
      )}

      {/* Add Decision Sheet */}
      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add a Decision</SheetTitle>
            <SheetDescription>
              Pose a question for the group to vote on.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreate} className="space-y-4 p-4">
            {/* Question */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question</label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Which route through Virginia?"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Context or why this matters"
                rows={2}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_CONFIG).map(([value, cfg]) => (
                    <SelectItem key={value} value={value}>
                      {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 4 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addOption}
                  className="mt-1 text-xs"
                >
                  <Plus className="size-3 mr-1" />
                  Add Option
                </Button>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                submitting ||
                !question.trim() ||
                !category ||
                options.filter((o) => o.trim()).length < 2
              }
            >
              {submitting ? "Creating..." : "Create Decision"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
