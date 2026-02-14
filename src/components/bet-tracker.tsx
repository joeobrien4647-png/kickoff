"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DollarSign,
  Trophy,
  Crown,
  Plus,
  Check,
  Users,
  ChevronDown,
  ChevronUp,
  Handshake,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

type Bet = {
  id: string;
  description: string;
  proposedBy: string;
  acceptedBy: string;
  stakes: string;
  status: "active" | "settled";
  winner?: string;
  createdAt: string;
};

const TRAVELERS = ["Joe", "Jonny", "Gregor"] as const;
type Traveler = (typeof TRAVELERS)[number];

const STORAGE_KEY = "kickoff_bets";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadBets(): Bet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Bet[]) : [];
  } catch {
    return [];
  }
}

function saveBets(bets: Bet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bets));
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BetTracker() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showSettled, setShowSettled] = useState(false);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setBets(loadBets());
  }, []);

  // Persist whenever bets change (skip first render where bets is [])
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!hydrated) {
      setHydrated(true);
      return;
    }
    saveBets(bets);
  }, [bets, hydrated]);

  // Derived data
  const activeBets = useMemo(
    () => bets.filter((b) => b.status === "active"),
    [bets]
  );
  const settledBets = useMemo(
    () => bets.filter((b) => b.status === "settled"),
    [bets]
  );

  const standings = useMemo(() => {
    const wins: Record<string, number> = {};
    const losses: Record<string, number> = {};
    for (const name of TRAVELERS) {
      wins[name] = 0;
      losses[name] = 0;
    }
    for (const bet of settledBets) {
      if (bet.winner) {
        wins[bet.winner]++;
        const loser =
          bet.winner === bet.proposedBy ? bet.acceptedBy : bet.proposedBy;
        losses[loser]++;
      }
    }
    return TRAVELERS.map((name) => ({
      name,
      wins: wins[name],
      losses: losses[name],
    })).sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  }, [settledBets]);

  const leader = standings[0]?.wins > 0 ? standings[0].name : null;

  // Actions
  const addBet = useCallback(
    (bet: Omit<Bet, "id" | "status" | "createdAt">) => {
      const newBet: Bet = {
        ...bet,
        id: crypto.randomUUID(),
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setBets((prev) => [newBet, ...prev]);
      toast.success("Bet's on!");
    },
    []
  );

  const settleBet = useCallback((id: string, winner: string) => {
    setBets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "settled", winner } : b))
    );
    setSettlingId(null);
    toast.success(`${winner} wins! Time to pay up.`);
  }, []);

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="size-5 text-wc-gold" />
            <h2 className="text-lg font-bold">Side Bets</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Because what&apos;s a road trip without a wager?
          </p>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" />
              New Bet
            </Button>
          </SheetTrigger>
          <AddBetSheet
            onSubmit={(bet) => {
              addBet(bet);
              setSheetOpen(false);
            }}
          />
        </Sheet>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Summary bar                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Handshake className="size-3 text-wc-teal" />
          <span className="font-medium text-foreground">
            {activeBets.length}
          </span>{" "}
          active
        </span>
        <span className="flex items-center gap-1">
          <Check className="size-3 text-wc-gold" />
          <span className="font-medium text-foreground">
            {settledBets.length}
          </span>{" "}
          settled
        </span>
        {leader && (
          <span className="flex items-center gap-1 ml-auto">
            <Crown className="size-3 text-wc-gold" />
            <span className="font-medium text-wc-gold">{leader}</span> leads
          </span>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Leaderboard                                                       */}
      {/* ----------------------------------------------------------------- */}
      <Card className="py-4">
        <CardContent className="px-4 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-wc-gold" />
            <h3 className="text-sm font-bold">Standings</h3>
          </div>

          <div className="space-y-1">
            {standings.map((s) => (
              <div
                key={s.name}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  s.name === leader
                    ? "bg-wc-gold/8 ring-1 ring-wc-gold/20"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="shrink-0 w-6 text-center">
                  {s.name === leader ? (
                    <Crown className="size-4 text-wc-gold mx-auto" />
                  ) : (
                    <Users className="size-4 text-muted-foreground mx-auto" />
                  )}
                </div>

                <span
                  className={cn(
                    "text-sm font-medium flex-1 truncate",
                    s.name === leader && "text-wc-gold"
                  )}
                >
                  {s.name}
                </span>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs">
                    <span className="font-bold text-wc-gold tabular-nums">
                      {s.wins}
                    </span>
                    <span className="text-muted-foreground ml-0.5">W</span>
                  </span>
                  <span className="text-xs">
                    <span className="font-bold text-wc-coral tabular-nums">
                      {s.losses}
                    </span>
                    <span className="text-muted-foreground ml-0.5">L</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fun zero-wins message */}
          {standings.some((s) => s.wins === 0 && settledBets.length > 0) && (
            <p className="text-[11px] text-muted-foreground italic text-center pt-1">
              {standings
                .filter((s) => s.wins === 0)
                .map((s) => s.name)
                .join(" & ")}{" "}
              &mdash; still searching for that first W
            </p>
          )}
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Active bets                                                       */}
      {/* ----------------------------------------------------------------- */}
      {activeBets.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active Bets
          </h3>
          <div className="space-y-3">
            {activeBets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                isSettling={settlingId === bet.id}
                onStartSettle={() => setSettlingId(bet.id)}
                onCancelSettle={() => setSettlingId(null)}
                onSettle={(winner) => settleBet(bet.id, winner)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Empty state                                                       */}
      {/* ----------------------------------------------------------------- */}
      {bets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Handshake className="size-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No bets yet.</p>
          <p className="text-xs mt-1">
            Someone make a bet &mdash; you know you want to.
          </p>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Settled bets (collapsible)                                        */}
      {/* ----------------------------------------------------------------- */}
      {settledBets.length > 0 && (
        <section className="space-y-3">
          <button
            onClick={() => setShowSettled((s) => !s)}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors w-full"
          >
            Settled ({settledBets.length})
            {showSettled ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>

          {showSettled && (
            <div className="space-y-3">
              {settledBets.map((bet) => (
                <BetCard key={bet.id} bet={bet} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BetCard
// ---------------------------------------------------------------------------

interface BetCardProps {
  bet: Bet;
  isSettling?: boolean;
  onStartSettle?: () => void;
  onCancelSettle?: () => void;
  onSettle?: (winner: string) => void;
}

function BetCard({
  bet,
  isSettling,
  onStartSettle,
  onCancelSettle,
  onSettle,
}: BetCardProps) {
  const isActive = bet.status === "active";
  const participants = [bet.proposedBy, bet.acceptedBy];

  return (
    <Card
      className={cn(
        "py-3 gap-3",
        isActive
          ? "border-wc-teal/20"
          : "border-wc-gold/20 bg-wc-gold/[0.03]"
      )}
    >
      <CardContent className="px-4 space-y-2.5">
        {/* Description */}
        <p className="text-sm font-bold leading-snug">{bet.description}</p>

        {/* Participants */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-[11px]">
            {bet.proposedBy}
          </Badge>
          <span className="text-[10px] text-muted-foreground">vs</span>
          <Badge variant="secondary" className="text-[11px]">
            {bet.acceptedBy}
          </Badge>
        </div>

        {/* Stakes callout */}
        <div className="flex items-start gap-2 rounded-lg bg-wc-gold/8 border border-wc-gold/15 px-3 py-2">
          <DollarSign className="size-3.5 text-wc-gold shrink-0 mt-0.5" />
          <p className="text-xs text-wc-gold leading-relaxed">{bet.stakes}</p>
        </div>

        {/* Winner badge (settled) */}
        {bet.winner && (
          <div className="flex items-center gap-2">
            <Trophy className="size-3.5 text-wc-gold" />
            <span className="text-xs font-bold text-wc-gold">
              Won by {bet.winner}
            </span>
          </div>
        )}

        {/* Footer: date + settle button */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-muted-foreground">
            {formatShortDate(bet.createdAt)}
          </span>

          {isActive && !isSettling && (
            <Button variant="outline" size="xs" onClick={onStartSettle}>
              <Handshake className="size-3" />
              Settle
            </Button>
          )}
        </div>

        {/* Settle form (inline) */}
        {isActive && isSettling && (
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <span className="text-xs text-muted-foreground shrink-0">
              Winner:
            </span>
            {participants.map((name) => (
              <Button
                key={name}
                size="xs"
                variant="outline"
                className="text-xs"
                onClick={() => onSettle?.(name)}
              >
                <Trophy className="size-3 text-wc-gold" />
                {name}
              </Button>
            ))}
            <Button
              size="xs"
              variant="ghost"
              className="text-xs text-muted-foreground ml-auto"
              onClick={onCancelSettle}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// AddBetSheet (rendered inside <Sheet>)
// ---------------------------------------------------------------------------

interface AddBetSheetProps {
  onSubmit: (bet: Omit<Bet, "id" | "status" | "createdAt">) => void;
}

function AddBetSheet({ onSubmit }: AddBetSheetProps) {
  const [description, setDescription] = useState("");
  const [proposedBy, setProposedBy] = useState<string>("");
  const [acceptedBy, setAcceptedBy] = useState<string>("");
  const [stakes, setStakes] = useState("");

  // Reset acceptedBy if it matches proposedBy
  useEffect(() => {
    if (acceptedBy === proposedBy) {
      setAcceptedBy("");
    }
  }, [proposedBy, acceptedBy]);

  const acceptableBy = TRAVELERS.filter((t) => t !== proposedBy);

  const canSubmit =
    description.trim() && proposedBy && acceptedBy && stakes.trim();

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      description: description.trim(),
      proposedBy,
      acceptedBy,
      stakes: stakes.trim(),
    });
    // Reset
    setDescription("");
    setProposedBy("");
    setAcceptedBy("");
    setStakes("");
  }

  return (
    <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
      <SheetHeader>
        <SheetTitle>New Bet</SheetTitle>
        <SheetDescription>
          Put your money where your mouth is.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4 p-4">
        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="bet-desc" className="text-sm font-medium">
            What&apos;s the bet? <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="bet-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'e.g. "Jonny can\'t finish a Nashville hot chicken"'}
            rows={2}
          />
        </div>

        {/* Proposed by + Accepted by */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Proposed by <span className="text-destructive">*</span>
            </label>
            <Select value={proposedBy} onValueChange={setProposedBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Who's calling it?" />
              </SelectTrigger>
              <SelectContent>
                {TRAVELERS.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Accepted by <span className="text-destructive">*</span>
            </label>
            <Select value={acceptedBy} onValueChange={setAcceptedBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Who's taking it?" />
              </SelectTrigger>
              <SelectContent>
                {acceptableBy.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stakes */}
        <div className="space-y-1.5">
          <label htmlFor="bet-stakes" className="text-sm font-medium">
            Stakes <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="bet-stakes"
            value={stakes}
            onChange={(e) => setStakes(e.target.value)}
            placeholder='e.g. "Loser buys beers in Miami"'
            rows={2}
          />
        </div>
      </div>

      <SheetFooter>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          <Handshake className="size-4" />
          Lock it in
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}
