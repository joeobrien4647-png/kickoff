"use client";

import { useState } from "react";
import {
  Globe,
  ChevronDown,
  Languages,
  UtensilsCrossed,
  Users,
  Banknote,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Translation {
  british: string;
  american: string;
}

const LANGUAGE_DIFFERENCES: Translation[] = [
  { british: "Football", american: "Soccer" },
  { british: "Trousers", american: "Pants" },
  { british: "Chips", american: "Fries" },
  { british: "Crisps", american: "Chips" },
  { british: "Petrol", american: "Gas" },
  { british: "Boot (car)", american: "Trunk" },
  { british: "Bonnet (car)", american: "Hood" },
  { british: "Motorway", american: "Highway / Interstate" },
  { british: "Queue", american: "Line" },
  { british: "Bill (restaurant)", american: "Check" },
  { british: "Toilet / Loo", american: "Bathroom / Restroom" },
  { british: "Mate", american: "Dude / Bro" },
  { british: "Rubbish", american: "Trash / Garbage" },
];

interface CultureTip {
  title: string;
  detail: string;
}

const FOOD_AND_DRINK: CultureTip[] = [
  {
    title: "Portions are MASSIVE",
    detail:
      "Share a starter or take leftovers. Asking for a doggy bag is completely normal — not embarrassing at all.",
  },
  {
    title: "Free refills on soft drinks",
    detail:
      "Almost everywhere. Order one Coke, drink twelve. This is not a trap. Embrace it.",
  },
  {
    title: "Tax is added AFTER the menu price",
    detail:
      "That $15 burger is actually ~$16.50. Always mentally add 8-10% to everything you see on a menu.",
  },
  {
    title: "Tap water is free",
    detail:
      "At restaurants, just ask. They'll bring it without question. No need to order bottled water.",
  },
  {
    title: '"Regular" coffee = filter/drip coffee',
    detail:
      "Not espresso. If you want a proper coffee, ask for an Americano or specify espresso-based drinks.",
  },
  {
    title: "Biscuits = fluffy bread things",
    detail:
      "Not digestives. American biscuits are savoury, bread-like, and served with gravy (which is white, not brown). It's a different world.",
  },
  {
    title: '"Entr\u00e9e" = main course',
    detail:
      "NOT starter. Yes, it makes no linguistic sense. The appetizer is the starter. Don't order two entr\u00e9es thinking they're small.",
  },
];

const SOCIAL_CUSTOMS: CultureTip[] = [
  {
    title: "Americans are genuinely friendly",
    detail:
      "They WILL talk to you. In lifts, at bars, in the queue at Starbucks. It's not weird — it's how it works here.",
  },
  {
    title: '"How are you?" is a greeting, not a question',
    detail:
      "Say \"Good, thanks!\" and move on. Do NOT actually tell them about your dodgy knee or your flight delay.",
  },
  {
    title: "Personal space is smaller",
    detail:
      "Don't be alarmed by friendliness. Americans stand closer, hug more freely, and will high-five you at football matches.",
  },
  {
    title: "Jaywalking can get you fined",
    detail:
      "In some cities, crossing outside a crosswalk is an offence. Use the pedestrian signals — the walking man means go.",
  },
  {
    title: "Sales tax varies by state",
    detail:
      "0-10% depending on state and city. It's NEVER on the price tag. What you see is not what you pay.",
  },
];

interface CoinInfo {
  name: string;
  value: string;
  note: string;
}

const US_COINS: CoinInfo[] = [
  { name: "Penny", value: "1\u00A2", note: "Copper, nearly worthless" },
  { name: "Nickel", value: "5\u00A2", note: "Bigger than a dime (confusing)" },
  { name: "Dime", value: "10\u00A2", note: "Tiny! Smaller than a penny" },
  { name: "Quarter", value: "25\u00A2", note: "The only useful coin" },
];

const MONEY_TIPS: CultureTip[] = [
  {
    title: "Bills all look similar",
    detail:
      "$1, $5, $10, $20 are all the same size and colour. Check carefully before handing one over. You will mix them up.",
  },
  {
    title: "Cards accepted almost everywhere",
    detail:
      "Contactless is common now. Visa and Mastercard are universal. Your Monzo/Revolut card works brilliantly here.",
  },
  {
    title: "ATMs charge $3-5 fees",
    detail:
      "Out-of-network ATMs are highway robbery. Use your bank's partner ATMs or withdraw larger amounts less often.",
  },
];

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

function TranslationTable() {
  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 bg-muted/60">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          British
        </div>
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          American
        </div>
      </div>
      {/* Rows */}
      {LANGUAGE_DIFFERENCES.map(({ british, american }, i) => (
        <div
          key={british}
          className={cn(
            "grid grid-cols-2 border-t border-border/50",
            i % 2 === 0 && "bg-muted/20"
          )}
        >
          <div className="px-3 py-1.5 text-xs">{british}</div>
          <div className="px-3 py-1.5 text-xs font-medium">{american}</div>
        </div>
      ))}
    </div>
  );
}

function TipList({
  tips,
  icon,
}: {
  tips: CultureTip[];
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-0">
      {tips.map(({ title, detail }) => (
        <div
          key={title}
          className="py-2 border-b border-border/50 last:border-0"
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground shrink-0">
              {icon}
            </span>
            <div>
              <p className="text-xs font-medium">{title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {detail}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface CultureGuideUKProps {
  className?: string;
}

export function CultureGuideUK({ className }: CultureGuideUKProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-wc-gold" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              American Culture Cheat Sheet
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px]"
          >
            Brit&rsquo;s Guide
          </Badge>
        </div>

        {/* Accent superpower callout */}
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2.5">
          <div className="flex items-start gap-2">
            <Info className="size-3.5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <span className="font-medium">Pro tip:</span> Being British is a
              superpower at American bars. The accent gets you free drinks, new
              friends, and an audience. Use this power wisely. Or recklessly.
            </p>
          </div>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-2">
          {/* Language differences */}
          <Section title="Language Differences" defaultOpen>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Languages className="size-3.5 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">
                  Same language, different words. Learn these before you
                  embarrass yourself.
                </p>
              </div>
              <TranslationTable />
            </div>
          </Section>

          {/* Food & drink */}
          <Section title="Food &amp; Drink">
            <TipList
              tips={FOOD_AND_DRINK}
              icon={<UtensilsCrossed className="size-3" />}
            />
          </Section>

          {/* Social customs */}
          <Section title="Social Customs">
            <TipList
              tips={SOCIAL_CUSTOMS}
              icon={<Users className="size-3" />}
            />
          </Section>

          {/* Money */}
          <Section title="Money &amp; Payments">
            <div className="space-y-3">
              {/* Coins reference */}
              <div>
                <p className="text-[11px] text-muted-foreground mb-2">
                  US coins are deliberately confusing. The dime (10 cents) is
                  smaller than the nickel (5 cents). Good luck.
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {US_COINS.map(({ name, value, note }) => (
                    <div
                      key={name}
                      className="rounded-lg bg-muted/50 p-2 text-center"
                    >
                      <p className="text-sm font-semibold tabular-nums">
                        {value}
                      </p>
                      <p className="text-[10px] font-medium mt-0.5">{name}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Money tips */}
              <TipList
                tips={MONEY_TIPS}
                icon={<Banknote className="size-3" />}
              />
            </div>
          </Section>
        </div>
      </CardContent>
    </Card>
  );
}
