import Link from "next/link";
import {
  Lightbulb,
  ThumbsUp,
  Clock,
  ArrowRight,
  UtensilsCrossed,
  Camera,
  Zap,
  Moon,
  ShoppingBag,
  Tv,
  MoreHorizontal,
  Beer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IDEA_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Idea } from "@/lib/schema";

interface IdeaWithVotes extends Idea {
  voteCount: number;
}

interface IdeasPreviewProps {
  ideas: IdeaWithVotes[];
  stopId: string;
  stopCity: string;
}

const CATEGORY_ICONS: Record<string, typeof Lightbulb> = {
  food: UtensilsCrossed,
  drinks: Beer,
  sightseeing: Camera,
  activity: Zap,
  nightlife: Moon,
  shopping: ShoppingBag,
  sports_bar: Tv,
  other: MoreHorizontal,
};

const CATEGORY_COLORS: Record<string, string> = {
  food: "text-wc-coral",
  drinks: "text-amber-400",
  sightseeing: "text-wc-teal",
  activity: "text-purple-400",
  nightlife: "text-indigo-400",
  shopping: "text-pink-400",
  sports_bar: "text-wc-blue",
  other: "text-muted-foreground",
};

export function IdeasPreview({ ideas, stopId, stopCity }: IdeasPreviewProps) {
  if (ideas.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-amber-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Ideas for {stopCity}
          </h2>
        </div>
        <Link
          href={`/ideas?stop=${stopId}`}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Ideas list */}
      <div className="rounded-lg border border-border bg-muted/10 divide-y divide-border">
        {ideas.map((idea) => {
          const Icon = CATEGORY_ICONS[idea.category] ?? MoreHorizontal;
          const colorClass = CATEGORY_COLORS[idea.category] ?? "text-muted-foreground";
          const categoryLabel = IDEA_CATEGORIES.find(
            (c) => c.value === idea.category
          )?.label ?? idea.category;

          return (
            <div
              key={idea.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              {/* Category icon */}
              <div className={cn("shrink-0", colorClass)}>
                <Icon className="size-4" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{idea.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    {categoryLabel}
                  </Badge>
                  {idea.estimatedDuration && (
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/70">
                      <Clock className="size-2.5" />
                      {idea.estimatedDuration}
                    </span>
                  )}
                </div>
              </div>

              {/* Vote count */}
              {idea.voteCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <ThumbsUp className="size-3" />
                  <span className="tabular-nums">{idea.voteCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
