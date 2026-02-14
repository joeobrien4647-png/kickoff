"use client";

import { useState } from "react";
import {
  Beer,
  Car,
  Coffee,
  ConciergeBell,
  HandCoins,
  Minus,
  Plus,
  Receipt,
  Scissors,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Preset tip percentages
// ---------------------------------------------------------------------------

const TIP_PRESETS = [
  { value: 15, label: "15%" },
  { value: 18, label: "18%" },
  { value: 20, label: "20%", recommended: true },
  { value: 25, label: "25%" },
] as const;

// ---------------------------------------------------------------------------
// Tipping guide data
// ---------------------------------------------------------------------------

const TIPPING_GUIDE = [
  {
    icon: UtensilsCrossed,
    label: "Restaurant",
    tip: "18-20%",
    note: "20% is standard for good service. Pre-tax amount.",
  },
  {
    icon: Beer,
    label: "Bar",
    tip: "$1-2/drink",
    note: "Or 15-20% of your tab if running one.",
  },
  {
    icon: Car,
    label: "Uber / Lyft",
    tip: "$2-5",
    note: "Or 15-20%. Tip in app after the ride.",
  },
  {
    icon: ConciergeBell,
    label: "Hotel",
    tip: "$2-5/night",
    note: "Housekeeping. $1-2/bag for bellhop.",
  },
  {
    icon: Coffee,
    label: "Coffee shop",
    tip: "$1",
    note: "Or just round up. No shame in skipping for drip coffee.",
  },
  {
    icon: HandCoins,
    label: "Takeout",
    tip: "10% or $0",
    note: "Optional but appreciated. No guilt either way.",
  },
  {
    icon: Car,
    label: "Valet",
    tip: "$3-5",
    note: "When they bring the car back. Cash preferred.",
  },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SplitCalculator() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState(20);
  const [customTip, setCustomTip] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [people, setPeople] = useState(3);

  // Derived values
  const bill = parseFloat(billAmount) || 0;
  const activeTip = isCustom ? parseFloat(customTip) || 0 : tipPercent;
  const tipAmount = bill * (activeTip / 100);
  const total = bill + tipAmount;
  const perPerson = people > 0 ? total / people : 0;

  function selectPreset(value: number) {
    setTipPercent(value);
    setIsCustom(false);
    setCustomTip("");
  }

  function enableCustom() {
    setIsCustom(true);
  }

  return (
    <div className="space-y-4">
      {/* ---- Calculator ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="size-4 text-wc-gold" />
            Bill Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Bill amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Bill Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0.00"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="pl-7 text-lg tabular-nums"
              />
            </div>
          </div>

          {/* Tip percentage */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tip
            </label>
            <div className="flex flex-wrap gap-2">
              {TIP_PRESETS.map(({ value, label, ...rest }) => {
                const recommended = "recommended" in rest && rest.recommended;
                const active = !isCustom && tipPercent === value;
                return (
                  <Button
                    key={value}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectPreset(value)}
                    className={cn(
                      "relative",
                      active && "bg-wc-teal text-white hover:bg-wc-teal/90",
                    )}
                  >
                    {label}
                    {recommended && !active && (
                      <Badge
                        className="absolute -top-2 -right-2 text-[9px] px-1 py-0 h-3.5 bg-wc-gold text-white border-0"
                      >
                        rec
                      </Badge>
                    )}
                  </Button>
                );
              })}
              <Button
                variant={isCustom ? "default" : "outline"}
                size="sm"
                onClick={enableCustom}
                className={cn(
                  isCustom && "bg-wc-teal text-white hover:bg-wc-teal/90",
                )}
              >
                Custom
              </Button>
            </div>
            {isCustom && (
              <div className="relative w-28 mt-2">
                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="pr-7 tabular-nums"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            )}
          </div>

          {/* Number of people */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Split Between
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                disabled={people <= 1}
              >
                <Minus className="size-4" />
              </Button>
              <div className="flex items-center gap-1.5 min-w-[3rem] justify-center">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-lg font-semibold tabular-nums">
                  {people}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPeople((p) => Math.min(20, p + 1))}
                disabled={people >= 20}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          {bill > 0 && (
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <ResultRow label="Subtotal" value={bill} />
              <ResultRow
                label={`Tip (${activeTip}%)`}
                value={tipAmount}
                className="text-wc-teal"
              />
              <div className="border-t border-border pt-2 mt-2">
                <ResultRow label="Total" value={total} bold />
              </div>
              {people > 1 && (
                <div className="border-t border-border pt-2 mt-2">
                  <ResultRow
                    label={
                      <span className="flex items-center gap-1.5">
                        <Scissors className="size-3.5" />
                        Per person
                      </span>
                    }
                    value={perPerson}
                    bold
                    className="text-wc-gold"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Tipping Guide ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HandCoins className="size-4 text-wc-teal" />
            US Tipping Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TIPPING_GUIDE.map(({ icon: Icon, label, tip, note }) => (
              <div
                key={label}
                className="flex items-start gap-3 text-sm"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{label}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-4 text-wc-gold border-wc-gold/30"
                    >
                      {tip}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result row helper
// ---------------------------------------------------------------------------

function ResultRow({
  label,
  value,
  bold,
  className,
}: {
  label: React.ReactNode;
  value: number;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between text-sm",
        bold && "font-semibold text-base",
        className,
      )}
    >
      <span>{label}</span>
      <span className="tabular-nums">${value.toFixed(2)}</span>
    </div>
  );
}
