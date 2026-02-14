"use client";

import { useMemo } from "react";
import {
  Award,
  Car,
  MapPin,
  Plane,
  Moon,
  Mountain,
  Trophy,
  Ticket,
  Target,
  Users,
  Flame,
  UtensilsCrossed,
  Cookie,
  Heart,
  ThumbsUp,
  Lightbulb,
  Camera,
  Package,
  CheckCircle,
  DollarSign,
  Clock,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";

// ---------------------------------------------------------------------------
// Icon map -- avoids dynamic imports, maps string names to Lucide components
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, LucideIcon> = {
  Car,
  MapPin,
  Plane,
  Moon,
  Mountain,
  Trophy,
  Ticket,
  Target,
  Users,
  Flame,
  UtensilsCrossed,
  Cookie,
  Heart,
  ThumbsUp,
  Lightbulb,
  Camera,
  Package,
  CheckCircle,
  DollarSign,
  Clock,
};

// ---------------------------------------------------------------------------
// Category -> WC color tokens (full class strings for Tailwind safety)
// ---------------------------------------------------------------------------
type CategoryStyle = {
  iconText: string;
  iconBg: string;
  cardBorder: string;
  cardShadow: string;
  cardHoverShadow: string;
  badgeBorder: string;
  badgeText: string;
};

const CATEGORY_STYLE: Record<Achievement["category"], CategoryStyle> = {
  travel: {
    iconText: "text-wc-blue",
    iconBg: "bg-wc-blue/15",
    cardBorder: "border-wc-blue/40",
    cardShadow: "shadow-wc-blue/20",
    cardHoverShadow: "hover:shadow-wc-blue/30",
    badgeBorder: "border-wc-blue/30",
    badgeText: "text-wc-blue",
  },
  matches: {
    iconText: "text-wc-gold",
    iconBg: "bg-wc-gold/15",
    cardBorder: "border-wc-gold/40",
    cardShadow: "shadow-wc-gold/20",
    cardHoverShadow: "hover:shadow-wc-gold/30",
    badgeBorder: "border-wc-gold/30",
    badgeText: "text-wc-gold",
  },
  food: {
    iconText: "text-wc-coral",
    iconBg: "bg-wc-coral/15",
    cardBorder: "border-wc-coral/40",
    cardShadow: "shadow-wc-coral/20",
    cardHoverShadow: "hover:shadow-wc-coral/30",
    badgeBorder: "border-wc-coral/30",
    badgeText: "text-wc-coral",
  },
  social: {
    iconText: "text-wc-teal",
    iconBg: "bg-wc-teal/15",
    cardBorder: "border-wc-teal/40",
    cardShadow: "shadow-wc-teal/20",
    cardHoverShadow: "hover:shadow-wc-teal/30",
    badgeBorder: "border-wc-teal/30",
    badgeText: "text-wc-teal",
  },
  planning: {
    iconText: "text-wc-gold",
    iconBg: "bg-wc-gold/15",
    cardBorder: "border-wc-gold/40",
    cardShadow: "shadow-wc-gold/20",
    cardHoverShadow: "hover:shadow-wc-gold/30",
    badgeBorder: "border-wc-gold/30",
    badgeText: "text-wc-gold",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface AchievementsProps {
  stats: {
    totalMiles: number;
    statesVisited: number;
    flightsPlanned: number;
    matchesAttending: number;
    ticketsPurchased: number;
    predictionsCorrect: number;
    decisionsVoted: number;
    ideasCreated: number;
    photosUploaded: number;
    packingProgress: number; // 0-100
    checklistProgress: number; // 0-100
    expensesLogged: number;
    activeTravelers: number;
    daysUntilTrip: number;
  };
}

// ---------------------------------------------------------------------------
// Unlock logic
// ---------------------------------------------------------------------------
function isUnlocked(
  achievement: Achievement,
  stats: AchievementsProps["stats"]
): boolean {
  switch (achievement.id) {
    case "road-warrior":
      return stats.totalMiles >= 500;
    case "state-hopper":
      return stats.statesVisited >= 6;
    case "mile-high-club":
      return stats.flightsPlanned >= 1;
    case "night-owl":
      return stats.totalMiles >= 200; // proxy: planned enough driving for a late leg
    case "scenic-route":
      return stats.totalMiles >= 1500;
    case "super-fan":
      return stats.matchesAttending >= 3;
    case "ticket-master":
      return stats.ticketsPurchased >= 5;
    case "oracle":
      return stats.predictionsCorrect >= 3;
    case "full-house":
      return stats.activeTravelers >= 3 && stats.matchesAttending >= 1;
    case "hot-chicken-survivor":
      return stats.statesVisited >= 5;
    case "philly-special":
      return stats.statesVisited >= 3;
    case "biscuit-boss":
      return stats.statesVisited >= 5;
    case "squad-goals":
      return stats.activeTravelers >= 3;
    case "decision-maker":
      return stats.decisionsVoted >= 5;
    case "idea-machine":
      return stats.ideasCreated >= 10;
    case "shutterbug":
      return stats.photosUploaded >= 10;
    case "fully-packed":
      return stats.packingProgress >= 100;
    case "all-checked":
      return stats.checklistProgress >= 100;
    case "budget-boss":
      return stats.expensesLogged >= 20;
    case "early-bird":
      return stats.daysUntilTrip >= 7 && stats.checklistProgress >= 80;
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Completion message
// ---------------------------------------------------------------------------
function getCompletionMessage(unlocked: number): string {
  if (unlocked >= 16) return "Absolute legends. 100% completion!";
  if (unlocked >= 11) return "Achievement hunters!";
  if (unlocked >= 6) return "The lads are committed!";
  return "Just getting started...";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Achievements({ stats }: AchievementsProps) {
  const sorted = useMemo(() => {
    const withStatus = ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: isUnlocked(a, stats),
    }));
    // Unlocked first, preserve original order within each group
    return withStatus.sort((a, b) => {
      if (a.unlocked === b.unlocked) return 0;
      return a.unlocked ? -1 : 1;
    });
  }, [stats]);

  const unlockedCount = sorted.filter((a) => a.unlocked).length;
  const totalCount = sorted.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Award className="size-5 text-wc-gold" />
        <div>
          <h2 className="text-base font-bold leading-tight">Achievements</h2>
          <p className="text-xs text-muted-foreground">
            Unlock badges as you plan your trip
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {unlockedCount}
            </span>{" "}
            of {totalCount} unlocked
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {progressPct}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-wc-teal to-wc-gold transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {sorted.map((achievement) => {
          const Icon = ICON_MAP[achievement.icon] ?? Award;
          const style = CATEGORY_STYLE[achievement.category];
          const unlocked = achievement.unlocked;

          return (
            <Card
              key={achievement.id}
              className={cn(
                "relative py-3 transition-all duration-300",
                unlocked
                  ? [
                      style.cardBorder,
                      "shadow-[0_0_12px_-3px]",
                      style.cardShadow,
                      "hover:scale-[1.03]",
                      style.cardHoverShadow,
                    ]
                  : "border-border/50 opacity-60 grayscale"
              )}
            >
              <CardContent className="px-3 flex flex-col items-center text-center gap-2">
                {/* Icon container */}
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full transition-colors",
                    unlocked ? style.iconBg : "bg-muted"
                  )}
                >
                  {unlocked ? (
                    <Icon className={cn("size-5", style.iconText)} />
                  ) : (
                    <>
                      <Icon className="size-5 text-muted-foreground/40" />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3.5 text-muted-foreground bg-card rounded-full p-0.5" />
                    </>
                  )}
                </div>

                {/* Name */}
                <p
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    unlocked ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {achievement.name}
                </p>

                {/* Description */}
                <p className="text-[10px] leading-snug text-muted-foreground line-clamp-2">
                  {achievement.description}
                </p>

                {/* Status badge */}
                {unlocked ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-auto text-[10px] px-1.5 py-0",
                      style.badgeBorder,
                      style.badgeText
                    )}
                  >
                    Unlocked!
                  </Badge>
                ) : (
                  <span className="mt-auto text-[10px] text-muted-foreground/50 font-medium">
                    Locked
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion message */}
      <p className="text-center text-xs text-muted-foreground italic">
        {getCompletionMessage(unlockedCount)}
      </p>
    </div>
  );
}
