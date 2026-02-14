"use client";

import { useState, useEffect, useCallback } from "react";
import { Map, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROUTE_STATES, type RouteState } from "@/lib/route-states";

// ---------------------------------------------------------------------------
// localStorage persistence
// ---------------------------------------------------------------------------

const STORAGE_KEY = "kickoff_visited_states";

function loadVisited(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveVisited(visited: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StateTracker() {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount (avoid hydration mismatch)
  useEffect(() => {
    setVisited(loadVisited());
    setMounted(true);
  }, []);

  const toggle = useCallback(
    (abbr: string) => {
      setVisited((prev) => {
        const next = new Set(prev);
        if (next.has(abbr)) {
          next.delete(abbr);
        } else {
          next.add(abbr);
        }
        saveVisited(next);
        return next;
      });
    },
    []
  );

  const visitedCount = visited.size;
  const totalCount = ROUTE_STATES.length;
  const progressPct = (visitedCount / totalCount) * 100;

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="size-5 text-wc-teal" />
          State Border Tracker
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {mounted ? visitedCount : 0} of {totalCount} states visited
            </span>
            <span className="font-medium text-wc-teal">
              {mounted ? Math.round(progressPct) : 0}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-wc-teal to-emerald-400 transition-all duration-500"
              style={{ width: mounted ? `${progressPct}%` : "0%" }}
            />
          </div>
        </div>

        {/* State badges — horizontal wrap */}
        <div className="flex flex-wrap gap-2">
          {ROUTE_STATES.map((state) => {
            const isVisited = mounted && visited.has(state.abbreviation);
            return (
              <button
                key={state.abbreviation}
                type="button"
                onClick={() => toggle(state.abbreviation)}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                  "hover:scale-105 active:scale-95 cursor-pointer",
                  isVisited
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                    : "border-border bg-card/50 text-muted-foreground hover:border-wc-teal/40 hover:text-foreground"
                )}
              >
                {isVisited && <Check className="size-3.5" />}
                <span>{state.abbreviation}</span>
              </button>
            );
          })}
        </div>

        {/* State details list */}
        <div className="space-y-2">
          {ROUTE_STATES.map((state) => {
            const isVisited = mounted && visited.has(state.abbreviation);
            return (
              <div
                key={state.abbreviation}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                  isVisited
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-border bg-card/50"
                )}
              >
                {/* Order badge */}
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isVisited
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isVisited ? (
                    <Check className="size-3.5" />
                  ) : (
                    state.order
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isVisited ? "text-emerald-400" : "text-foreground"
                      )}
                    >
                      {state.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        isVisited
                          ? "border-emerald-500/30 text-emerald-400"
                          : ""
                      )}
                    >
                      {state.abbreviation}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {state.enterCity}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {state.funFact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
