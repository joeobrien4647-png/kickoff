"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  ChevronDown,
  AlertTriangle,
  Calculator,
  Coffee,
  UtensilsCrossed,
  Beer,
  Car,
  Hotel,
  Scissors,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface TipScenario {
  situation: string;
  amount: string;
  detail: string;
  icon: React.ReactNode;
  priority: "essential" | "expected" | "optional";
}

const TIP_SCENARIOS: TipScenario[] = [
  {
    situation: "Restaurants (sit-down)",
    amount: "18-20%",
    detail:
      "Of the pre-tax bill. 15% is the bare minimum and signals poor service. Check if gratuity is auto-added for groups of 6+.",
    icon: <UtensilsCrossed className="size-3.5" />,
    priority: "essential",
  },
  {
    situation: "Bars",
    amount: "$1-2 per drink",
    detail:
      "$1 per beer or simple drink, $2 per cocktail. Open a tab and tip at the end.",
    icon: <Beer className="size-3.5" />,
    priority: "essential",
  },
  {
    situation: "Coffee shops",
    amount: "$1 or round up",
    detail:
      "Not required but appreciated. The iPad screen will guilt-trip you with 25% options.",
    icon: <Coffee className="size-3.5" />,
    priority: "optional",
  },
  {
    situation: "Fast food / counter service",
    amount: "Not expected",
    detail: "Tip jar is optional. $1 if you feel generous. No one will judge.",
    icon: <ShoppingBag className="size-3.5" />,
    priority: "optional",
  },
  {
    situation: "Uber / Lyft",
    amount: "15-20%",
    detail:
      "Add it in the app after the ride. $2 minimum. The driver WILL see if you don't tip.",
    icon: <Car className="size-3.5" />,
    priority: "essential",
  },
  {
    situation: "Taxi",
    amount: "15-20%",
    detail: "Of the fare. Round up for short trips. Cash tips are welcome.",
    icon: <Car className="size-3.5" />,
    priority: "essential",
  },
  {
    situation: "Hotel housekeeping",
    amount: "$2-5 per night",
    detail:
      "Left on the pillow with a note saying \"Thank you\". Leave it each morning, not just at checkout.",
    icon: <Hotel className="size-3.5" />,
    priority: "expected",
  },
  {
    situation: "Hotel valet",
    amount: "$2-5",
    detail:
      "When the car is returned to you. Even if the car park was right there.",
    icon: <Hotel className="size-3.5" />,
    priority: "expected",
  },
  {
    situation: "Bellhop",
    amount: "$1-2 per bag",
    detail: "Per bag carried. More if they go above and beyond.",
    icon: <Hotel className="size-3.5" />,
    priority: "expected",
  },
  {
    situation: "Food delivery",
    amount: "15-20%, min $3",
    detail:
      "More in bad weather. These folks are bringing you food in a Miami thunderstorm.",
    icon: <ShoppingBag className="size-3.5" />,
    priority: "essential",
  },
  {
    situation: "Barber / hairdresser",
    amount: "15-20%",
    detail: "Even if they just buzzed it. You sat in the chair, you tip.",
    icon: <Scissors className="size-3.5" />,
    priority: "expected",
  },
];

const PRIORITY_CONFIG = {
  essential: {
    label: "Must Tip",
    className: "bg-red-500/15 text-red-500 border-0",
  },
  expected: {
    label: "Expected",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0",
  },
  optional: {
    label: "Optional",
    className: "bg-muted text-muted-foreground border-0",
  },
} as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors rounded-lg"
      >
        {title}
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="px-3 pb-3 pt-0">{children}</div>}
    </div>
  );
}

function TipRow({ scenario }: { scenario: TipScenario }) {
  const config = PRIORITY_CONFIG[scenario.priority];

  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-border/50 last:border-0">
      <span className="mt-0.5 text-muted-foreground">{scenario.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium">{scenario.situation}</span>
          <Badge className={cn("text-[10px]", config.className)}>
            {config.label}
          </Badge>
        </div>
        <p className="text-xs font-semibold text-wc-gold mt-0.5">
          {scenario.amount}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {scenario.detail}
        </p>
      </div>
    </div>
  );
}

function TipCalculator() {
  const [billAmount, setBillAmount] = useState("");

  const bill = parseFloat(billAmount) || 0;

  const calculations = useMemo(() => {
    if (bill <= 0) return null;
    return [
      { pct: 15, tip: bill * 0.15, total: bill * 1.15 },
      { pct: 18, tip: bill * 0.18, total: bill * 1.18 },
      { pct: 20, tip: bill * 0.2, total: bill * 1.2 },
    ];
  }, [bill]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calculator className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-medium">Quick Calculator</p>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          placeholder="Enter bill amount"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
          className="pl-7 tabular-nums"
        />
      </div>

      {calculations && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {calculations.map(({ pct, tip, total }) => (
              <div
                key={pct}
                className={cn(
                  "rounded-lg p-2.5 text-center",
                  pct === 20
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-muted/50"
                )}
              >
                <p className="text-[10px] text-muted-foreground font-medium uppercase">
                  {pct}%{pct === 20 ? " (Good)" : pct === 18 ? " (Standard)" : " (Min)"}
                </p>
                <p className="text-sm font-semibold tabular-nums mt-0.5">
                  ${tip.toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground tabular-nums">
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Split 3 ways */}
          <div className="rounded-lg bg-muted/50 p-2.5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase text-center">
              Split 3 ways (at 20%)
            </p>
            <p className="text-lg font-semibold tabular-nums text-center mt-0.5">
              ${(calculations[2].total / 3).toFixed(2)}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                each
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface TippingGuideProps {
  className?: string;
}

export function TippingGuide({ className }: TippingGuideProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-wc-gold" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              US Tipping Guide
            </p>
          </div>
          <Badge className="bg-red-500/15 text-red-500 border-0 text-[10px]">
            Essential
          </Badge>
        </div>

        {/* Key warnings */}
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 space-y-1.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Critical for Brits
            </p>
          </div>
          <ul className="space-y-1 ml-5.5">
            <li className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              In the US, servers earn $2.13/hr base — tips ARE their income
            </li>
            <li className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              Not tipping at a restaurant is considered extremely rude
            </li>
            <li className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              Tax is NOT included in menu prices (add ~8-10%)
            </li>
            <li className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              The bill = &ldquo;the check&rdquo;. Ask for &ldquo;the check please&rdquo;
            </li>
          </ul>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-2">
          {/* All tipping scenarios */}
          <Section title="What to Tip &amp; Where" defaultOpen>
            <div className="divide-y-0">
              {TIP_SCENARIOS.map((scenario) => (
                <TipRow key={scenario.situation} scenario={scenario} />
              ))}
            </div>
          </Section>

          {/* Quick calculator */}
          <Section title="Tip Calculator (Split 3 Ways)" defaultOpen>
            <TipCalculator />
          </Section>
        </div>
      </CardContent>
    </Card>
  );
}
