"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  PartyPopper,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ============ TYPES ============

interface TravelerData {
  name: string;
  emoji: string;
  color: string;
  totalPaid: number;
  totalOwes: number;
  balance: number;
  byCategory: Record<string, { paid: number; owes: number }>;
}

interface SettlementTxn {
  from: string;
  to: string;
  amount: number;
  settled: boolean;
}

interface SettlementData {
  travelers: TravelerData[];
  settlements: SettlementTxn[];
  totalGroupSpend: number;
  perPersonAverage: number;
}

// ============ CONSTANTS ============

const USD_TO_GBP = 0.79;
const STEPS = ["Overview", "Who Owes Whom", "Pay Up", "Confirmation"] as const;

const PAYMENT_LINKS = [
  {
    label: "Wise",
    buildUrl: (amount: number) =>
      `https://wise.com/pay#amount=${(amount * USD_TO_GBP).toFixed(2)}&currency=GBP&email=`,
  },
  {
    label: "PayPal",
    buildUrl: () => "https://paypal.me/",
  },
  {
    label: "Revolut",
    buildUrl: () => "https://revolut.me/",
  },
] as const;

// ============ HELPERS ============

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtGbp(usd: number): string {
  return (usd * USD_TO_GBP).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ============ MAIN COMPONENT ============

export function SettlementWizard() {
  const [data, setData] = useState<SettlementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [settlingPair, setSettlingPair] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/settlement");
      if (!res.ok) throw new Error("Failed to fetch");
      const json: SettlementData = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("Could not load settlement data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSettle(from: string, to: string) {
    setSettlingPair(`${from}->${to}`);
    try {
      const res = await fetch("/api/settlement/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      if (!res.ok) throw new Error("Failed to settle");
      toast.success(`Marked ${from} -> ${to} as settled`);
      await fetchData();
    } catch {
      toast.error("Failed to mark as settled");
    } finally {
      setSettlingPair(null);
    }
  }

  function copyAmount(amount: number, idx: number) {
    const gbp = (amount * USD_TO_GBP).toFixed(2);
    navigator.clipboard.writeText(gbp);
    setCopiedIdx(idx);
    toast.success(`Copied \u00A3${gbp}`);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function buildWhatsAppMessage(from: string, to: string, amount: number) {
    const gbp = (amount * USD_TO_GBP).toFixed(2);
    const wiseLink = `https://wise.com/pay#amount=${gbp}&currency=GBP&email=`;
    const msg = `Hey ${from}, you owe me \u00A3${gbp} for Kickoff 2026! \u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F} Pay via Wise: ${wiseLink}`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

  // Derived state
  const allSettled = data?.settlements.every((s) => s.settled) ?? false;
  const noDebts = (data?.settlements.length ?? 0) === 0;

  // Auto-advance to confirmation when all settled
  useEffect(() => {
    if (data && (allSettled || noDebts) && step === 2) {
      setStep(3);
      setShowConfetti(true);
    }
  }, [allSettled, noDebts, data, step]);

  // Confetti timer
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // ============ RENDER ============

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Computing settlement...
          </span>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-destructive">{error ?? "No data"}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchData}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={cn(
              "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full transition-colors",
              i === step
                ? "bg-wc-teal text-white font-medium"
                : i < step
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {i < step ? (
              <Check className="size-3" />
            ) : (
              <span className="size-4 text-center font-medium">{i + 1}</span>
            )}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && <StepOverview data={data} />}
      {step === 1 && <StepWhoOwes data={data} />}
      {step === 2 && (
        <StepPayUp
          data={data}
          onSettle={handleSettle}
          settlingPair={settlingPair}
          copiedIdx={copiedIdx}
          onCopyAmount={copyAmount}
          buildWhatsAppMessage={buildWhatsAppMessage}
        />
      )}
      {step === 3 && (
        <StepConfirmation
          data={data}
          showConfetti={showConfetti}
          onTriggerConfetti={() => setShowConfetti(true)}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="gap-1"
        >
          <ChevronLeft className="size-3.5" />
          Back
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="gap-1 bg-wc-teal hover:bg-wc-teal/90"
        >
          Next
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ============ STEP 1: OVERVIEW ============

function StepOverview({ data }: { data: SettlementData }) {
  const maxPaid = Math.max(...data.travelers.map((t) => t.totalPaid), 1);
  const maxOwes = Math.max(...data.travelers.map((t) => t.totalOwes), 1);
  const barMax = Math.max(maxPaid, maxOwes);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Trip Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Top-line stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/40 p-3 space-y-0.5">
            <p className="text-xs text-muted-foreground">Total Group Spend</p>
            <p className="text-xl font-bold">${fmt(data.totalGroupSpend)}</p>
            <p className="text-[10px] text-muted-foreground">
              {"\u00A3"}{fmtGbp(data.totalGroupSpend)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 space-y-0.5">
            <p className="text-xs text-muted-foreground">Per Person Average</p>
            <p className="text-xl font-bold">${fmt(data.perPersonAverage)}</p>
            <p className="text-[10px] text-muted-foreground">
              {"\u00A3"}{fmtGbp(data.perPersonAverage)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Per-person bar chart: paid vs share */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Paid vs Fair Share
          </p>
          {data.travelers.map((t) => {
            const overpaid = t.balance > 0.01;
            const underpaid = t.balance < -0.01;
            const paidPct = (t.totalPaid / barMax) * 100;
            const owesPct = (t.totalOwes / barMax) * 100;

            return (
              <div key={t.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{t.emoji}</span>
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] font-semibold tabular-nums",
                      overpaid && "bg-emerald-500/10 text-emerald-500",
                      underpaid && "bg-destructive/10 text-destructive"
                    )}
                  >
                    {overpaid ? "+" : ""}${fmt(t.balance)}
                  </Badge>
                </div>

                {/* Paid bar */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-8">Paid</span>
                    <div className="flex-1 h-4 rounded bg-muted/40 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded transition-all duration-500",
                          overpaid ? "bg-emerald-500/70" : "bg-destructive/50"
                        )}
                        style={{ width: `${paidPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums w-16 text-right font-medium">
                      ${fmt(t.totalPaid)}
                    </span>
                  </div>

                  {/* Share bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-8">Share</span>
                    <div className="flex-1 h-4 rounded bg-muted/40 overflow-hidden">
                      <div
                        className="h-full rounded bg-wc-blue/40 transition-all duration-500"
                        style={{ width: `${owesPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums w-16 text-right font-medium">
                      ${fmt(t.totalOwes)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ STEP 2: WHO OWES WHOM ============

function StepWhoOwes({ data }: { data: SettlementData }) {
  if (data.settlements.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-2 py-12">
          <CheckCircle2 className="size-5 text-emerald-500" />
          <span className="text-sm text-muted-foreground">
            Everyone is square -- no debts!
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Settlement Plan</CardTitle>
        <p className="text-xs text-muted-foreground">
          Simplified to {data.settlements.length} transaction{data.settlements.length !== 1 ? "s" : ""}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.settlements.map((txn, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors",
              txn.settled
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-muted/30 border-border"
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm font-medium truncate">{txn.from}</span>
              <ArrowRight
                className={cn(
                  "size-4 shrink-0",
                  txn.settled ? "text-emerald-500" : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium truncate">{txn.to}</span>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-bold tabular-nums">${fmt(txn.amount)}</p>
              <p className="text-[10px] text-muted-foreground tabular-nums">
                {"\u00A3"}{fmtGbp(txn.amount)}
              </p>
            </div>

            {txn.settled && (
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============ STEP 3: PAY UP ============

interface StepPayUpProps {
  data: SettlementData;
  onSettle: (from: string, to: string) => void;
  settlingPair: string | null;
  copiedIdx: number | null;
  onCopyAmount: (amount: number, idx: number) => void;
  buildWhatsAppMessage: (from: string, to: string, amount: number) => string;
}

function StepPayUp({
  data,
  onSettle,
  settlingPair,
  copiedIdx,
  onCopyAmount,
  buildWhatsAppMessage,
}: StepPayUpProps) {
  if (data.settlements.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-2 py-12">
          <CheckCircle2 className="size-5 text-emerald-500" />
          <span className="text-sm text-muted-foreground">Nothing to pay!</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {data.settlements.map((txn, i) => {
        const isSettling = settlingPair === `${txn.from}->${txn.to}`;

        return (
          <Card
            key={i}
            className={cn(
              "overflow-hidden transition-colors",
              txn.settled && "border-emerald-500/30"
            )}
          >
            <CardContent className="p-4 space-y-3">
              {/* Transaction header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{txn.from}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold">{txn.to}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular-nums">${fmt(txn.amount)}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">
                    {"\u00A3"}{fmtGbp(txn.amount)}
                  </p>
                </div>
              </div>

              {!txn.settled ? (
                <>
                  <Separator />

                  {/* Payment links */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      Payment Options
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PAYMENT_LINKS.map(({ label, buildUrl }) => (
                        <a
                          key={label}
                          href={buildUrl(txn.amount)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                        >
                          {label}
                          <ExternalLink className="size-3" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                      onClick={() => onCopyAmount(txn.amount, i)}
                    >
                      {copiedIdx === i ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      Copy {"\u00A3"}{fmtGbp(txn.amount)}
                    </Button>

                    <a
                      href={buildWhatsAppMessage(txn.from, txn.to, txn.amount)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <MessageCircle className="size-3" />
                        WhatsApp
                      </Button>
                    </a>

                    <Button
                      size="sm"
                      className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white ml-auto"
                      onClick={() => onSettle(txn.from, txn.to)}
                      disabled={isSettling}
                    >
                      {isSettling ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-3" />
                      )}
                      Mark as Settled
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">Settled</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ============ STEP 4: CONFIRMATION ============

function StepConfirmation({
  data,
  showConfetti,
  onTriggerConfetti,
}: {
  data: SettlementData;
  showConfetti: boolean;
  onTriggerConfetti: () => void;
}) {
  const allSettled = data.settlements.every((s) => s.settled);
  const noDebts = data.settlements.length === 0;
  const isDone = allSettled || noDebts;

  return (
    <Card className="relative overflow-hidden">
      {/* Confetti overlay */}
      {showConfetti && <ConfettiOverlay />}

      <CardContent className="py-10 text-center space-y-4">
        {isDone ? (
          <>
            <div className="flex justify-center">
              <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <PartyPopper className="size-8 text-emerald-500" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold">All Settled!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {noDebts
                  ? "No debts to settle -- everyone paid their fair share."
                  : "Every transaction has been marked as paid. Kickoff 2026 is officially in the books."}
              </p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Total trip cost: ${fmt(data.totalGroupSpend)} ({"\u00A3"}{fmtGbp(data.totalGroupSpend)})
              </p>
              <p className="text-xs text-muted-foreground">
                Per person: ${fmt(data.perPersonAverage)} ({"\u00A3"}{fmtGbp(data.perPersonAverage)})
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={onTriggerConfetti}
            >
              <PartyPopper className="size-3 mr-1.5" />
              More confetti
            </Button>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="size-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                <span className="text-3xl">{"\u{1F4B8}"}</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold">Not Quite Done</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {data.settlements.filter((s) => !s.settled).length} payment{data.settlements.filter((s) => !s.settled).length !== 1 ? "s" : ""} still outstanding.
                Go back to Pay Up to settle them.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============ CONFETTI ============

function ConfettiOverlay() {
  // Generate confetti pieces with deterministic-ish positions
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 3) % 100}%`,
    delay: `${(i * 73) % 2000}ms`,
    duration: `${2000 + (i * 131) % 2000}ms`,
    color: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"][i % 6],
    size: 4 + (i % 4) * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: p.left,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.size > 6 ? "50%" : "1px",
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation-name: confetti-fall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
