"use client";

import { useState } from "react";
import { BarChart3, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IDEA_CATEGORIES } from "@/lib/constants";
import type { Idea } from "@/lib/schema";

interface PollOption {
  text: string;
  votes: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  drinks: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  sightseeing: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  activity: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  nightlife: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  shopping: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  sports_bar: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  other: "bg-muted text-muted-foreground border-muted",
};

interface PollCardProps {
  idea: Idea;
  currentUser: string | null;
  onMutate: () => void;
}

export function PollCard({ idea, currentUser, onMutate }: PollCardProps) {
  const [loading, setLoading] = useState(false);

  const options: PollOption[] = (() => {
    try {
      return JSON.parse(idea.options || "[]");
    } catch {
      return [];
    }
  })();

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes.length, 0);
  const userVotedIndex = currentUser
    ? options.findIndex((opt) => opt.votes.includes(currentUser))
    : -1;

  const categoryMeta = IDEA_CATEGORIES.find((c) => c.value === idea.category);

  async function handleVote(optionIndex: number) {
    if (!currentUser || loading) return;
    setLoading(true);
    try {
      await fetch(`/api/ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "poll_vote", optionIndex }),
      });
      onMutate();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch(`/api/ideas/${idea.id}`, { method: "DELETE" });
      onMutate();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="py-3 transition-colors hover:border-muted-foreground/20">
      <CardContent className="space-y-3">
        {/* Header: question + icon */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 shrink-0 text-wc-coral" />
              <h3 className="font-semibold text-sm leading-tight">
                {idea.title}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  CATEGORY_COLORS[idea.category]
                )}
              >
                {categoryMeta?.label || idea.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 bg-wc-coral/10 text-wc-coral border-wc-coral/20"
              >
                Poll
              </Badge>
            </div>
          </div>
        </div>

        {/* Options list */}
        <div className="space-y-1.5">
          {options.map((option, idx) => {
            const pct = totalVotes > 0
              ? Math.round((option.votes.length / totalVotes) * 100)
              : 0;
            const isUserVote = idx === userVotedIndex;

            return (
              <button
                key={idx}
                onClick={() => handleVote(idx)}
                disabled={!currentUser || loading}
                className={cn(
                  "relative w-full text-left rounded-md border px-3 py-2 transition-all overflow-hidden",
                  "hover:border-wc-teal/40 disabled:cursor-default",
                  isUserVote
                    ? "border-wc-teal/50 bg-wc-teal/5"
                    : "border-border"
                )}
              >
                {/* Vote bar background */}
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-300",
                    isUserVote ? "bg-wc-teal/15" : "bg-muted/50"
                  )}
                  style={{ width: `${pct}%` }}
                />

                {/* Content */}
                <div className="relative flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "text-sm",
                      isUserVote && "font-medium"
                    )}
                  >
                    {option.text}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {option.votes.length}
                    {totalVotes > 0 && (
                      <span className="ml-1">({pct}%)</span>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer: total votes, added by, delete */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
            </span>
            {idea.addedBy && (
              <span>by {idea.addedBy}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            disabled={loading}
            className="text-destructive/70 hover:text-destructive"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
