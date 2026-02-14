"use client";

import { useState } from "react";
import {
  DollarSign,
  AlertTriangle,
  ChevronDown,
  Info,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Toll data ────────────────────────────────────────────────────────

type TollEntry = {
  road: string;
  cost: string;
  note?: string;
};

const TOLL_BREAKDOWN: TollEntry[] = [
  { road: "MA Turnpike (Boston area)", cost: "$1\u2013$5" },
  { road: "CT tolls", cost: "None", note: "No tolls currently" },
  {
    road: "George Washington Bridge",
    cost: "$16 peak / $13 off-peak",
    note: "EZPass saves ~$4",
  },
  { road: "NJ Turnpike", cost: "$14\u2013$18", note: "Full length" },
  { road: "Delaware Memorial Bridge", cost: "$5" },
  { road: "Maryland tolls (I-95)", cost: "$8\u2013$12" },
  {
    road: "Florida Turnpike (if used)",
    cost: "$10\u2013$20",
  },
];

type AcquisitionOption = {
  label: string;
  description: string;
  pros: string;
  cons: string;
};

const ACQUISITION_OPTIONS: AcquisitionOption[] = [
  {
    label: "Rent with the car",
    description:
      "Most rental companies offer a \"toll pass\" add-on ($5\u201310/day).",
    pros: "Zero effort \u2014 just drive",
    cons: "Adds up over 16 days ($80\u2013160 in fees alone)",
  },
  {
    label: "Buy at a service plaza",
    description:
      "Available at NJ Turnpike rest stops and other travel plazas.",
    pros: "One-time cost, no daily fees",
    cons: "Need to find a plaza that sells them",
  },
  {
    label: "Use plate-pay system",
    description:
      "Rental company's automatic plate-toll billing system.",
    pros: "Convenient \u2014 nothing to set up",
    cons: "Most expensive option (admin fees per toll)",
  },
];

// ── Component ────────────────────────────────────────────────────────

export function EZPassGuide() {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="size-5 text-wc-gold" />
          EZPass &amp; Toll Guide
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* What is EZPass? */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">What is EZPass?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Electronic toll collection &mdash; a small device on your windshield
            that auto-pays tolls. Works in 19 states including{" "}
            <strong className="text-foreground">
              all states on our route
            </strong>
            . Without one, you either pay cash (slower) or get a &ldquo;toll by
            plate&rdquo; bill in the mail (expensive).
          </p>
        </div>

        {/* Do we need one? */}
        <div className="flex items-start gap-2 rounded-md border border-wc-coral/30 bg-wc-coral/5 px-3 py-2.5 text-xs">
          <AlertTriangle className="size-4 shrink-0 text-wc-coral mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-wc-coral">
              Do we need one? YES.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The I-95 corridor is loaded with tolls. Estimated total toll costs
              on this route:{" "}
              <strong className="text-foreground">$80&ndash;$120</strong>.
            </p>
          </div>
        </div>

        {/* Toll breakdown toggle */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-1.5 text-xs text-muted-foreground"
            onClick={() => setShowBreakdown((v) => !v)}
          >
            {showBreakdown ? "Hide" : "Show"} toll breakdown by road
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200",
                showBreakdown && "rotate-180",
              )}
            />
          </Button>

          {showBreakdown && (
            <div className="space-y-1.5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              {TOLL_BREAKDOWN.map((toll) => (
                <div
                  key={toll.road}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card/50 px-3 py-2"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-medium">{toll.road}</p>
                    {toll.note && (
                      <p className="text-[10px] text-muted-foreground">
                        {toll.note}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="ghost"
                    className={cn(
                      "text-[10px] px-1.5 py-0 shrink-0 tabular-nums",
                      toll.cost === "None"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-wc-gold/15 text-wc-gold",
                    )}
                  >
                    <DollarSign className="size-2.5" />
                    {toll.cost}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to get one */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">How to get one</h3>
          <div className="space-y-2">
            {ACQUISITION_OPTIONS.map((opt, i) => (
              <div
                key={opt.label}
                className="rounded-lg border bg-card/50 p-3 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 tabular-nums"
                  >
                    Option {i + 1}
                  </Badge>
                  <p className="text-xs font-semibold">{opt.label}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {opt.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    + {opt.pros}
                  </span>
                  <span className="text-wc-coral">
                    - {opt.cons}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-2 rounded-md bg-wc-teal/5 px-3 py-2.5 text-xs">
          <CheckCircle2 className="size-4 shrink-0 text-wc-teal mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-wc-teal">Recommendation</p>
            <p className="text-muted-foreground leading-relaxed">
              Get the rental company&apos;s toll pass. It&apos;s the easiest
              option for a short trip. Just factor the daily fee into the
              budget.
            </p>
          </div>
        </div>

        {/* Florida note */}
        <div className="flex items-start gap-2 rounded-md bg-wc-blue/5 px-3 py-2.5 text-xs">
          <Info className="size-3.5 shrink-0 text-wc-blue mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">Florida &mdash; SunPass</p>
            <p className="text-muted-foreground leading-relaxed">
              EZPass works on most Florida toll roads now. SunPass is the local
              equivalent &mdash; not needed if you have EZPass.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
