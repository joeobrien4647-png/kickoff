"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Shuffle,
  MessageCircle,
  Grid3x3,
  ChevronRight,
  Check,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  WOULD_YOU_RATHER,
  CONVERSATION_STARTERS,
  CAR_BINGO,
} from "@/lib/car-games";
import type { ConversationStarter } from "@/lib/car-games";

// ── Constants ──────────────────────────────────────────────────────

type Tab = "wyr" | "convo" | "bingo";

const TABS: { id: Tab; label: string; icon: typeof Shuffle }[] = [
  { id: "wyr", label: "Would You Rather", icon: Zap },
  { id: "convo", label: "Conversation", icon: MessageCircle },
  { id: "bingo", label: "Bingo", icon: Grid3x3 },
];

const CATEGORY_STYLE: Record<
  ConversationStarter["category"],
  { label: string; className: string }
> = {
  travel: {
    label: "Travel",
    className: "bg-wc-blue/15 text-wc-blue",
  },
  football: {
    label: "Football",
    className: "bg-wc-gold/15 text-wc-gold",
  },
  funny: {
    label: "Funny",
    className: "bg-wc-coral/15 text-wc-coral",
  },
  deep: {
    label: "Deep",
    className: "bg-wc-teal/15 text-wc-teal",
  },
};

const FREE_SQUARE_INDEX = 12; // center of 5x5 grid

// ── Helpers ────────────────────────────────────────────────────────

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

function pickRandomUnseen(total: number, seen: number[]): number {
  const unseen = Array.from({ length: total }, (_, i) => i).filter(
    (i) => !seen.includes(i),
  );
  if (unseen.length === 0) return Math.floor(Math.random() * total);
  return unseen[Math.floor(Math.random() * unseen.length)];
}

// ── Bingo logic ────────────────────────────────────────────────────

function checkBingo(marked: boolean[]): boolean {
  // Rows
  for (let r = 0; r < 5; r++) {
    if ([0, 1, 2, 3, 4].every((c) => marked[r * 5 + c])) return true;
  }
  // Columns
  for (let c = 0; c < 5; c++) {
    if ([0, 1, 2, 3, 4].every((r) => marked[r * 5 + c])) return true;
  }
  // Diagonals
  if ([0, 6, 12, 18, 24].every((i) => marked[i])) return true;
  if ([4, 8, 12, 16, 20].every((i) => marked[i])) return true;
  return false;
}

// ── Main component ─────────────────────────────────────────────────

export function CarGames() {
  const [activeTab, setActiveTab] = useState<Tab>("wyr");

  return (
    <div className="space-y-4">
      {/* ── Tab bar ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-wc-gold text-black"
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      {activeTab === "wyr" && <WouldYouRatherTab />}
      {activeTab === "convo" && <ConversationTab />}
      {activeTab === "bingo" && <BingoTab />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  Tab 1: Would You Rather
// ════════════════════════════════════════════════════════════════════

function WouldYouRatherTab() {
  const [seen, setSeen] = useState<number[]>(() =>
    loadJson<number[]>("kickoff_wyr_seen", []),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    pickRandomUnseen(WOULD_YOU_RATHER.length, []),
  );
  const [choice, setChoice] = useState<"A" | "B" | null>(null);

  // Persist seen list
  useEffect(() => {
    saveJson("kickoff_wyr_seen", seen);
  }, [seen]);

  const handleNext = useCallback(() => {
    const updated = seen.includes(currentIndex)
      ? seen
      : [...seen, currentIndex];
    setSeen(updated);
    setCurrentIndex(pickRandomUnseen(WOULD_YOU_RATHER.length, updated));
    setChoice(null);
  }, [seen, currentIndex]);

  const current = WOULD_YOU_RATHER[currentIndex];
  if (!current) return null;

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-wc-coral/20 text-wc-coral">
            <Zap className="size-3.5" />
          </div>
          <h2 className="text-sm font-semibold">Would You Rather</h2>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {Math.min(seen.length + (seen.includes(currentIndex) ? 0 : 1), WOULD_YOU_RATHER.length)}{" "}
          of {WOULD_YOU_RATHER.length}
        </Badge>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {(["A", "B"] as const).map((side) => {
          const text =
            side === "A" ? current.optionA : current.optionB;
          const isChosen = choice === side;
          return (
            <button
              key={side}
              onClick={() => setChoice(side)}
              className={cn(
                "relative rounded-xl border p-4 text-left text-sm leading-snug transition-all duration-200",
                "hover:border-wc-gold/40 active:scale-[0.98]",
                isChosen
                  ? "border-wc-gold bg-wc-gold/10 ring-1 ring-wc-gold/30"
                  : "border-border bg-card",
              )}
            >
              {/* Label */}
              <span
                className={cn(
                  "mb-2 inline-block text-[10px] font-bold uppercase tracking-wider",
                  isChosen ? "text-wc-gold" : "text-muted-foreground",
                )}
              >
                {side === "A" ? "Option A" : "Option B"}
              </span>
              <p className={cn("text-xs", isChosen ? "font-medium" : "text-muted-foreground")}>
                {text}
              </p>
              {isChosen && (
                <div className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-wc-gold text-black">
                  <Check className="size-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        className="w-full gap-1.5 border-wc-coral/30 text-wc-coral hover:bg-wc-coral/10 hover:text-wc-coral"
      >
        <Shuffle className="size-3.5" />
        Next
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  Tab 2: Conversation Starters
// ════════════════════════════════════════════════════════════════════

function ConversationTab() {
  const [seen, setSeen] = useState<number[]>(() =>
    loadJson<number[]>("kickoff_convo_seen", []),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    pickRandomUnseen(CONVERSATION_STARTERS.length, []),
  );
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    saveJson("kickoff_convo_seen", seen);
  }, [seen]);

  const handleNext = useCallback(() => {
    const updated = seen.includes(currentIndex)
      ? seen
      : [...seen, currentIndex];
    setSeen(updated);
    setCurrentIndex(
      pickRandomUnseen(CONVERSATION_STARTERS.length, updated),
    );
  }, [seen, currentIndex]);

  const current = CONVERSATION_STARTERS[currentIndex];
  if (!current) return null;

  const catStyle = CATEGORY_STYLE[current.category];

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-wc-blue/20 text-wc-blue">
            <MessageCircle className="size-3.5" />
          </div>
          <h2 className="text-sm font-semibold">Conversation Starters</h2>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {Math.min(seen.length + (seen.includes(currentIndex) ? 0 : 1), CONVERSATION_STARTERS.length)}{" "}
          of {CONVERSATION_STARTERS.length}
        </Badge>
      </div>

      {showAll ? (
        /* ── All topics list ── */
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {CONVERSATION_STARTERS.map((q, i) => {
            const style = CATEGORY_STYLE[q.category];
            return (
              <Card key={i} className="py-2.5 gap-1.5">
                <CardContent className="space-y-1.5">
                  <Badge variant="ghost" className={cn("text-[10px] px-1.5 py-0", style.className)}>
                    {style.label}
                  </Badge>
                  <p className="text-xs leading-relaxed">{q.question}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* ── Single card ── */
        <Card className="py-4 gap-3">
          <CardContent className="flex flex-col items-center text-center space-y-3">
            <Badge variant="ghost" className={cn("text-[10px] px-2 py-0.5", catStyle.className)}>
              {catStyle.label}
            </Badge>
            <p className="text-sm font-medium leading-relaxed px-2">
              {current.question}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!showAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="flex-1 gap-1.5 border-wc-blue/30 text-wc-blue hover:bg-wc-blue/10 hover:text-wc-blue"
          >
            <Shuffle className="size-3.5" />
            Next Topic
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className={cn(
            "gap-1.5",
            showAll ? "flex-1" : "",
          )}
        >
          {showAll ? "Single Card" : "All Topics"}
        </Button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  Tab 3: Road Trip Bingo
// ════════════════════════════════════════════════════════════════════

function BingoTab() {
  const [marked, setMarked] = useState<boolean[]>(() => {
    const saved = loadJson<boolean[]>("kickoff_bingo", Array(25).fill(false));
    // Ensure free square is always marked
    const copy = [...saved];
    copy[FREE_SQUARE_INDEX] = true;
    return copy;
  });

  useEffect(() => {
    saveJson("kickoff_bingo", marked);
  }, [marked]);

  const toggle = useCallback(
    (index: number) => {
      if (index === FREE_SQUARE_INDEX) return; // can't unmark free square
      setMarked((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        return next;
      });
    },
    [],
  );

  const handleReset = useCallback(() => {
    const fresh = Array(25).fill(false) as boolean[];
    fresh[FREE_SQUARE_INDEX] = true;
    setMarked(fresh);
    saveJson("kickoff_bingo", fresh);
  }, []);

  const spottedCount = marked.filter(Boolean).length;
  const hasBingo = useMemo(() => checkBingo(marked), [marked]);

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-wc-teal/20 text-wc-teal">
            <Grid3x3 className="size-3.5" />
          </div>
          <h2 className="text-sm font-semibold">Road Trip Bingo</h2>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {spottedCount} of 25 spotted
        </Badge>
      </div>

      {/* Bingo! celebration */}
      {hasBingo && (
        <div className="rounded-xl bg-wc-gold/15 border border-wc-gold/30 px-4 py-3 text-center">
          <p className="text-lg font-bold text-wc-gold">BINGO!</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            You got a complete line! Drinks are on the loser.
          </p>
        </div>
      )}

      {/* 5x5 grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {CAR_BINGO.map((item, i) => {
          const isFree = i === FREE_SQUARE_INDEX;
          const isMarked = marked[i];

          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-all duration-150",
                "aspect-square",
                "active:scale-95",
                isFree
                  ? "bg-wc-gold/15 border-wc-gold/30 cursor-default"
                  : isMarked
                    ? "bg-wc-teal/15 border-wc-teal/40"
                    : "bg-card border-border hover:border-wc-teal/30",
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span
                className={cn(
                  "mt-0.5 text-[8px] leading-tight",
                  isFree
                    ? "font-bold text-wc-gold"
                    : isMarked
                      ? "font-medium text-wc-teal"
                      : "text-muted-foreground",
                )}
              >
                {isFree ? "FREE" : item.text}
              </span>
              {isMarked && !isFree && (
                <div className="absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-wc-teal text-white">
                  <Check className="size-2" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="w-full gap-1.5 border-muted-foreground/20 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
      >
        <RefreshCw className="size-3.5" />
        Reset Board
      </Button>
    </div>
  );
}
