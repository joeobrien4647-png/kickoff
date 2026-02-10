"use client";

import { useState } from "react";
import {
  Heart,
  CalendarCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  MapPin,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IDEA_CATEGORIES, IDEA_STATUS } from "@/lib/constants";
import type { Idea } from "@/lib/schema";

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

interface IdeaCardProps {
  idea: Idea;
  currentUser: string | null;
  onMutate: () => void;
}

export function IdeaCard({ idea, currentUser, onMutate }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const votes: string[] = JSON.parse(idea.votes || "[]");
  const hasVoted = currentUser ? votes.includes(currentUser) : false;
  const categoryMeta = IDEA_CATEGORIES.find((c) => c.value === idea.category);
  const statusMeta = IDEA_STATUS[idea.status as keyof typeof IDEA_STATUS];

  async function handleVote() {
    if (!currentUser || loading) return;
    setLoading(true);
    try {
      await fetch(`/api/ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote" }),
      });
      onMutate();
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(status: string) {
    if (loading) return;
    setLoading(true);
    try {
      await fetch(`/api/ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
    <Card
      className={cn(
        "py-3 transition-colors hover:border-muted-foreground/20",
        idea.status === "skipped" && "opacity-60"
      )}
    >
      <CardContent className="space-y-2">
        {/* Header row: title + badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm leading-tight">
                {idea.title}
              </h3>
              {idea.url && (
                <a
                  href={idea.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
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
              {idea.status !== "idea" && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    statusMeta.color,
                    statusMeta.bg
                  )}
                >
                  {statusMeta.label}
                </Badge>
              )}
            </div>
          </div>

          {/* Vote button */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleVote}
            disabled={!currentUser || loading}
            className="shrink-0"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                hasVoted
                  ? "fill-wc-coral text-wc-coral"
                  : "text-muted-foreground"
              )}
            />
          </Button>
        </div>

        {/* Description (always show if short, truncate if long) */}
        {idea.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {idea.description}
          </p>
        )}

        {/* Meta row: cost, duration, votes */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {idea.estimatedCost != null && (
            <span className="flex items-center gap-1">
              <DollarSign className="size-3" />
              ${idea.estimatedCost}/person
            </span>
          )}
          {idea.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {idea.estimatedDuration}
            </span>
          )}
          {votes.length > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="size-3 fill-wc-coral text-wc-coral" />
              {votes.length} &middot; {votes.join(", ")}
            </span>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3" /> Less
            </>
          ) : (
            <>
              <ChevronDown className="size-3" /> More
            </>
          )}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="space-y-3 pt-1 border-t border-border">
            {idea.address && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                {idea.address}
              </p>
            )}
            {idea.notes && (
              <p className="text-xs text-muted-foreground">{idea.notes}</p>
            )}
            {idea.addedBy && (
              <p className="text-[10px] text-muted-foreground/70">
                Added by {idea.addedBy}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {idea.status === "idea" && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleStatusChange("planned")}
                  disabled={loading}
                  className="text-wc-teal border-wc-teal/30 hover:bg-wc-teal/10"
                >
                  <CalendarCheck className="size-3" />
                  Plan it
                </Button>
              )}
              {idea.status === "planned" && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleStatusChange("done")}
                  disabled={loading}
                  className="text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10"
                >
                  Done
                </Button>
              )}
              {(idea.status === "idea" || idea.status === "planned") && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleStatusChange("skipped")}
                  disabled={loading}
                  className="text-muted-foreground"
                >
                  <X className="size-3" />
                  Skip
                </Button>
              )}
              {idea.status === "skipped" && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleStatusChange("idea")}
                  disabled={loading}
                >
                  Restore
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleDelete}
                disabled={loading}
                className="text-destructive/70 hover:text-destructive ml-auto"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
