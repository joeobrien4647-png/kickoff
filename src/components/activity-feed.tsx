"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Lightbulb,
  Backpack,
  CheckSquare,
  StickyNote,
  Trophy,
  Target,
  Activity,
} from "lucide-react";
import type { ActivityLogEntry } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Relative time helper -- no external deps
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  return `${Math.floor(months / 12)}y ago`;
}

// ---------------------------------------------------------------------------
// Icon mapping by entityType
// ---------------------------------------------------------------------------

const ENTITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  expense: DollarSign,
  idea: Lightbulb,
  packing: Backpack,
  checklist: CheckSquare,
  note: StickyNote,
  match: Trophy,
  prediction: Target,
};

// ---------------------------------------------------------------------------
// Border color class by action
// ---------------------------------------------------------------------------

function borderColorClass(action: string): string {
  switch (action) {
    case "created":
      return "border-l-emerald-500";
    case "updated":
      return "border-l-sky-500";
    case "deleted":
      return "border-l-destructive";
    case "voted":
      return "border-l-wc-gold";
    default:
      return "border-l-muted-foreground/40";
  }
}

function dotColorClass(action: string): string {
  switch (action) {
    case "created":
      return "bg-emerald-500";
    case "updated":
      return "bg-sky-500";
    case "deleted":
      return "bg-destructive";
    case "voted":
      return "bg-wc-gold";
    default:
      return "bg-muted-foreground/40";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActivityFeed({ limit = 50 }: { limit?: number }) {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/activity?limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
        Loading activity...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Activity className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm">No activity yet</p>
        <p className="text-xs mt-1">
          Actions across the trip will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-h-[480px] overflow-y-auto pr-1">
      {/* Timeline spine */}
      <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />

      <ul className="space-y-1">
        {entries.map((entry) => {
          const Icon = ENTITY_ICONS[entry.entityType] || Activity;

          return (
            <li
              key={entry.id}
              className={`relative flex items-start gap-3 pl-7 py-1.5 border-l-2 ${borderColorClass(entry.action)}`}
            >
              {/* Dot on the timeline */}
              <span
                className={`absolute left-[7px] top-[10px] h-2.5 w-2.5 rounded-full ring-2 ring-background ${dotColorClass(entry.action)}`}
              />

              {/* Icon */}
              <span className="mt-0.5 shrink-0 text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">
                  <span className="font-semibold">{entry.actor}</span>{" "}
                  <span className="text-muted-foreground">
                    {stripActorPrefix(entry.description, entry.actor)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {timeAgo(entry.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Activity descriptions often start with the actor name (e.g. "Joe added expense: Gas").
 * Since we already render the actor name in bold, strip the leading duplicate to
 * avoid "**Joe** Joe added expense: Gas".
 */
function stripActorPrefix(description: string, actor: string): string {
  if (description.startsWith(actor + " ")) {
    return description.slice(actor.length + 1);
  }
  return description;
}
