"use client";

import { useState } from "react";
import {
  Flag,
  DollarSign,
  Car,
  UtensilsCrossed,
  Users,
  Wallet,
  Sun,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TIPPING_GUIDE,
  CULTURE_TIPS,
  US_VS_UK,
  type TipCategory,
} from "@/lib/culture-guide";

// ── Icon mapping ─────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Car: <Car className="size-4" />,
  UtensilsCrossed: <UtensilsCrossed className="size-4" />,
  Users: <Users className="size-4" />,
  Wallet: <Wallet className="size-4" />,
  Sun: <Sun className="size-4" />,
};

const CATEGORY_COLOR: Record<string, string> = {
  Driving: "text-wc-coral bg-wc-coral/15",
  "Food & Drink": "text-wc-gold bg-wc-gold/15",
  Social: "text-wc-blue bg-wc-blue/15",
  Money: "text-wc-teal bg-wc-teal/15",
  Weather: "text-wc-coral bg-wc-coral/15",
};

const PRIORITY_STYLE: Record<string, string> = {
  essential: "bg-wc-coral/15 text-wc-coral",
  expected: "bg-wc-gold/15 text-wc-gold",
  optional: "bg-muted text-muted-foreground",
};

// ── Accordion Category Card ──────────────────────────────────────

function CategoryAccordion({ category }: { category: TipCategory }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = CATEGORY_COLOR[category.category] ?? "text-wc-blue bg-wc-blue/15";
  const icon = CATEGORY_ICON[category.icon];

  return (
    <Card className="py-3 gap-2 transition-all hover:bg-accent/30">
      <CardContent className="space-y-3">
        {/* Clickable header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                colorClass
              )}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-bold">{category.category}</h3>
              <p className="text-[11px] text-muted-foreground">
                {category.items.length} tips
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="size-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground shrink-0" />
          )}
        </button>

        {/* Expanded items */}
        {expanded && (
          <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
            {category.items.map((item) => (
              <div key={item.title} className="space-y-1.5 pl-9">
                <p className="text-xs font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.detail}
                </p>
                {item.britishComparison && (
                  <div className="flex items-start gap-2 rounded-md bg-wc-blue/5 px-2.5 py-2 text-xs">
                    <Flag className="size-3.5 shrink-0 text-wc-blue mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed italic">
                      {item.britishComparison}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Component ───────────────────────────────────────────────

export function CultureGuide() {
  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-blue/20 text-wc-blue">
          <Flag className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Brit&apos;s Guide to America</h2>
          <p className="text-xs text-muted-foreground">
            Tipping, culture shocks &amp; survival tips for 3 lads abroad
          </p>
        </div>
      </div>

      {/* ── Tipping Quick Reference ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="size-4 text-wc-gold" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tipping Quick Reference
          </h3>
        </div>

        <Card className="py-0 gap-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {TIPPING_GUIDE.map((item) => (
                <div
                  key={item.situation}
                  className="flex items-start gap-3 px-4 py-2.5"
                >
                  {/* Situation + note */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold truncate">
                        {item.situation}
                      </p>
                      <Badge
                        variant="ghost"
                        className={cn(
                          "text-[9px] px-1.5 py-0 shrink-0",
                          PRIORITY_STYLE[item.priority]
                        )}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                  {/* Amount */}
                  <span className="text-xs font-bold text-wc-gold shrink-0 pt-0.5">
                    {item.tip}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Culture Tips (Accordions) ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Culture Survival Guide
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {CULTURE_TIPS.map((cat) => (
            <CategoryAccordion key={cat.category} category={cat} />
          ))}
        </div>
      </div>

      {/* ── US vs UK ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ArrowRight className="size-4 text-wc-teal" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            UK to US Translation
          </h3>
        </div>

        <Card className="py-0 gap-0 overflow-hidden">
          <CardContent className="p-0">
            {/* Table header */}
            <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex-1">Topic</span>
              <span className="w-28 text-center">UK</span>
              <ArrowRight className="size-3 text-muted-foreground/50 shrink-0" />
              <span className="w-32 text-center">US</span>
            </div>
            {/* Table rows */}
            <div className="divide-y divide-border">
              {US_VS_UK.map((row) => (
                <div
                  key={row.topic}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  <span className="flex-1 text-[11px] text-muted-foreground">
                    {row.topic}
                  </span>
                  <span className="w-28 text-center text-xs font-medium">
                    {row.uk}
                  </span>
                  <ArrowRight className="size-3 text-wc-teal shrink-0" />
                  <span className="w-32 text-center text-xs font-bold text-wc-gold">
                    {row.us}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Footer ── */}
      <div className="rounded-lg bg-wc-gold/10 px-4 py-3">
        <p className="text-xs text-center text-wc-gold font-medium leading-relaxed">
          When in doubt: tip 20%, say &quot;awesome&quot;, and remember to drive
          on the right.
        </p>
      </div>
    </section>
  );
}
