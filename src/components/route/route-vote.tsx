"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RouteScenario } from "@/lib/route-scenarios";

// ── Constants ────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = "kickoff_route_pref_";
const ALL_TRAVELERS = ["Joe", "Jonny", "Mike"] as const;

// ── Types ────────────────────────────────────────────────────────────────────

interface RouteVoteProps {
  scenarios: RouteScenario[];
  currentUser: string;
}

type VoteSummary = { traveler: string; scenarioId: string; scenarioName: string };

// ── Helpers ──────────────────────────────────────────────────────────────────

function storageKey(userName: string) {
  return `${STORAGE_PREFIX}${userName}`;
}

function readVote(userName: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(storageKey(userName));
  } catch {
    return null;
  }
}

function writeVote(userName: string, scenarioId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userName), scenarioId);
  } catch {
    // localStorage may be unavailable
  }
}

function clearVote(userName: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(storageKey(userName));
  } catch {
    // noop
  }
}

// ── Hook: useRouteVote ───────────────────────────────────────────────────────

export function useRouteVote(currentUser: string) {
  const [myVote, setMyVote] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMyVote(readVote(currentUser));
  }, [currentUser]);

  const toggleVote = useCallback(
    (scenarioId: string) => {
      setMyVote((prev) => {
        if (prev === scenarioId) {
          clearVote(currentUser);
          return null;
        }
        writeVote(currentUser, scenarioId);
        return scenarioId;
      });
    },
    [currentUser]
  );

  return { myVote, toggleVote };
}

// ── FavoriteButton — for embedding in scenario cards ─────────────────────────

export function FavoriteButton({
  scenarioId,
  isActive,
  onToggle,
}: {
  scenarioId: string;
  isActive: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle(scenarioId);
      }}
      className={cn(
        "size-7 rounded-full flex items-center justify-center transition-all",
        isActive
          ? "bg-wc-coral/15 text-wc-coral scale-110"
          : "bg-muted/50 text-muted-foreground hover:bg-wc-coral/10 hover:text-wc-coral"
      )}
      aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn("size-3.5 transition-all", isActive && "fill-current")}
      />
    </button>
  );
}

// ── VoteSummary — standalone summary of all votes ────────────────────────────

export function RouteVoteSummary({
  scenarios,
  currentUser,
}: RouteVoteProps) {
  const [votes, setVotes] = useState<VoteSummary[]>([]);

  // Poll all travelers' votes from localStorage
  useEffect(() => {
    function readAllVotes() {
      const result: VoteSummary[] = [];
      for (const traveler of ALL_TRAVELERS) {
        const scenarioId = readVote(traveler);
        if (scenarioId) {
          const scenario = scenarios.find((s) => s.id === scenarioId);
          if (scenario) {
            result.push({
              traveler,
              scenarioId,
              scenarioName: scenario.name,
            });
          }
        }
      }
      return result;
    }

    setVotes(readAllVotes());

    // Listen for storage events from other tabs
    function onStorage(e: StorageEvent) {
      if (e.key?.startsWith(STORAGE_PREFIX)) {
        setVotes(readAllVotes());
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [scenarios, currentUser]);

  // Also refresh when currentUser's vote changes (same tab)
  useEffect(() => {
    const interval = setInterval(() => {
      const result: VoteSummary[] = [];
      for (const traveler of ALL_TRAVELERS) {
        const scenarioId = readVote(traveler);
        if (scenarioId) {
          const scenario = scenarios.find((s) => s.id === scenarioId);
          if (scenario) {
            result.push({
              traveler,
              scenarioId,
              scenarioName: scenario.name,
            });
          }
        }
      }
      setVotes(result);
    }, 1000);
    return () => clearInterval(interval);
  }, [scenarios]);

  if (votes.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <Heart className="size-3 text-wc-coral" />
      {votes.map((v) => (
        <span key={v.traveler}>
          <span className="font-medium text-foreground">{v.traveler}</span>
          {" \u2764\uFE0F "}
          <span className="text-wc-coral font-medium">{v.scenarioName}</span>
        </span>
      ))}
    </div>
  );
}
