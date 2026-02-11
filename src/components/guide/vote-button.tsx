"use client";

import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { VenueVote } from "@/lib/schema";

// Traveler colors — matches seed data hex values
const VOTER_COLORS: Record<string, string> = {
  Joe: "#3b82f6",
  Jonny: "#22c55e",
  Greg: "#f59e0b",
};

interface VoteButtonProps {
  venueName: string;
  city: string;
  category: "restaurant" | "attraction" | "nightlife" | "shopping";
  votes: VenueVote[];
  currentUser: string | null;
  onVoteChange: (venueName: string, newVotes: VenueVote[]) => void;
}

export function VoteButton({
  venueName,
  city,
  category,
  votes,
  currentUser,
  onVoteChange,
}: VoteButtonProps) {
  const [pending, setPending] = useState(false);

  const hasVoted = currentUser
    ? votes.some((v) => v.voterName === currentUser)
    : false;

  const handleToggle = useCallback(async () => {
    if (!currentUser || pending) return;
    setPending(true);

    // Optimistic update
    const optimistic = hasVoted
      ? votes.filter((v) => v.voterName !== currentUser)
      : [
          ...votes,
          {
            id: "temp",
            venueName,
            city,
            category,
            voterName: currentUser,
            vote: 1,
            createdAt: new Date().toISOString(),
          } satisfies VenueVote,
        ];
    onVoteChange(venueName, optimistic);

    try {
      const res = await fetch("/api/venue-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueName, city, category, voterName: currentUser }),
      });

      if (!res.ok) throw new Error("Vote failed");
    } catch {
      // Revert optimistic update
      onVoteChange(venueName, votes);
      toast.error("Failed to save vote");
    } finally {
      setPending(false);
    }
  }, [currentUser, pending, hasVoted, votes, venueName, city, category, onVoteChange]);

  return (
    <button
      onClick={handleToggle}
      disabled={!currentUser || pending}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all",
        "border hover:shadow-sm",
        hasVoted
          ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
          : "bg-secondary border-border text-muted-foreground hover:bg-accent",
        (!currentUser || pending) && "opacity-50 cursor-not-allowed"
      )}
      title={
        !currentUser
          ? "Log in to vote"
          : hasVoted
            ? "Remove vote"
            : "Vote for this spot"
      }
    >
      <Heart
        className={cn("size-3", hasVoted && "fill-rose-500 text-rose-500")}
      />
      {votes.length > 0 && <span>{votes.length}</span>}
      {/* Voter dots */}
      {votes.length > 0 && (
        <span className="inline-flex items-center gap-0.5 ml-0.5">
          {votes.map((v) => (
            <span
              key={v.voterName}
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: VOTER_COLORS[v.voterName] ?? "#94a3b8" }}
              title={v.voterName}
            />
          ))}
        </span>
      )}
    </button>
  );
}
