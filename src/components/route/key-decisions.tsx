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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const openDecisions = decisions.filter((d) => d.status === "open");
  const decidedDecisions = decisions.filter((d) => d.status === "decided");

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
    </div>
  );
}
