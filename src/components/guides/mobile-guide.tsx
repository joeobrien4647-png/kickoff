"use client";

import { useState } from "react";
import {
  Smartphone,
  ChevronDown,
  AlertTriangle,
  Wifi,
  Globe,
  CardSim,
  Signal,
  MapPin,
  MessageCircle,
  Star,
  ArrowRight,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface RoamingOption {
  carrier: string;
  plan: string;
  detail: string;
  cost: string;
}

interface SimOption {
  carrier: string;
  plan: string;
  cost: string;
  data: string;
  detail: string;
}

interface EsimOption {
  provider: string;
  cost: string;
  data: string;
  detail: string;
}

const ROAMING_OPTIONS: RoamingOption[] = [
  {
    carrier: "Three UK",
    plan: "Go Roam",
    detail: "Use your UK plan in the US at no extra cost. Best deal if you're on Three.",
    cost: "Free",
  },
  {
    carrier: "EE",
    plan: "Roam Abroad",
    detail: "Use your UK allowance in the US for a daily fee.",
    cost: "\u00a32/day",
  },
  {
    carrier: "Vodafone",
    plan: "Roam Further",
    detail: "Check your specific plan \u2014 may be included or available as an add-on.",
    cost: "Varies",
  },
  {
    carrier: "O2",
    plan: "O2 Travel",
    detail: "Check your plan. Some include US roaming, others need a bolt-on.",
    cost: "Varies",
  },
];

const SIM_OPTIONS: SimOption[] = [
  {
    carrier: "T-Mobile",
    plan: "Tourist Plan",
    cost: "$50",
    data: "50GB",
    detail: "30 days, unlimited talk/text, 50GB data. Best coverage nationwide.",
  },
  {
    carrier: "AT&T",
    plan: "Prepaid",
    cost: "$40",
    data: "15GB",
    detail: "30 days, unlimited talk/text, 15GB data. Strong urban coverage.",
  },
  {
    carrier: "Mint Mobile",
    plan: "Starter",
    cost: "$15",
    data: "5GB",
    detail: "Monthly, 5GB data. Budget option \u2014 runs on T-Mobile's network.",
  },
];

const ESIM_OPTIONS: EsimOption[] = [
  {
    provider: "Airalo",
    cost: "$10\u2013$25",
    data: "5\u201320GB",
    detail: "Buy online before you leave, activate on arrival. Data only \u2014 no calls/texts.",
  },
];

const PRACTICAL_TIPS: { tip: string; detail: string }[] = [
  {
    tip: "Download offline Google Maps for every city BEFORE you leave",
    detail: "Works without data. Essential for navigation if your signal drops.",
  },
  {
    tip: "WhatsApp works on WiFi \u2014 free calls home",
    detail: "Video calls to family and mates without using any mobile data.",
  },
  {
    tip: "Most hotels, cafes, and restaurants have free WiFi",
    detail: "Connect and save your data for when you actually need it outdoors.",
  },
  {
    tip: "Starbucks has reliable free WiFi nationwide",
    detail: "Your emergency WiFi backup. There's one on literally every corner.",
  },
  {
    tip: "Save key numbers offline",
    detail: "Accommodation addresses, rental car number, emergency contacts \u2014 screenshot them or write them down.",
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

function PlanCard({
  name,
  badge,
  cost,
  detail,
  highlight,
}: {
  name: string;
  badge?: string;
  cost: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "py-2 border-b border-border/50 last:border-0",
        highlight && "bg-emerald-500/5 -mx-1 px-1 rounded"
      )}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium">{name}</span>
        {badge && (
          <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">
            {badge}
          </Badge>
        )}
        <span className="text-xs font-semibold text-wc-gold ml-auto">{cost}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface MobileGuideProps {
  className?: string;
}

export function MobileGuide({ className }: MobileGuideProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="size-4 text-wc-teal" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              US Mobile &amp; Data Guide
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            <Wifi className="size-2.5" />
            Connectivity
          </Badge>
        </div>

        {/* Key warning */}
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Sort this BEFORE you fly
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                Don&rsquo;t arrive in the US without a data plan. You&rsquo;ll need maps, Uber, and WhatsApp from the moment you land.
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {/* Option 1: International Roaming */}
          <Section title="Option 1: International Roaming (Easiest)" defaultOpen>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Globe className="size-3 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">
                  Keep your UK number. Just turn on roaming.
                </p>
              </div>

              {ROAMING_OPTIONS.map((opt) => (
                <PlanCard
                  key={opt.carrier}
                  name={opt.carrier}
                  badge={opt.plan}
                  cost={opt.cost}
                  detail={opt.detail}
                  highlight={opt.carrier === "Three UK"}
                />
              ))}

              {/* Speed warning */}
              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-border/50">
                <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80">
                  Check data speeds &mdash; many UK plans cap roaming at 2G speeds in the US. Fine for WhatsApp, useless for maps.
                </p>
              </div>
            </div>
          </Section>

          {/* Option 2: US SIM Card */}
          <Section title="Option 2: US SIM Card (Best Value for 16 Days)">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-2">
                <CardSim className="size-3 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">
                  Swap your SIM for a US one. Full speed, local number.
                </p>
              </div>

              {SIM_OPTIONS.map((opt) => (
                <PlanCard
                  key={opt.carrier}
                  name={opt.carrier}
                  badge={`${opt.plan} \u2022 ${opt.data}`}
                  cost={`${opt.cost}/mo`}
                  detail={opt.detail}
                  highlight={opt.carrier === "T-Mobile"}
                />
              ))}

              <div className="mt-2 pt-2 border-t border-border/50 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="size-3 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground">Where to buy:</span>{" "}
                    Any T-Mobile store, AT&T store, or Walmart
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 font-medium">
                    Your UK phone must be UNLOCKED to use a US SIM
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Option 3: eSIM */}
          <Section title="Option 3: eSIM (Most Convenient)">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Signal className="size-3 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">
                  Digital SIM &mdash; no store visit, no SIM swap.
                </p>
              </div>

              {ESIM_OPTIONS.map((opt) => (
                <PlanCard
                  key={opt.provider}
                  name={opt.provider}
                  badge={opt.data}
                  cost={opt.cost}
                  detail={opt.detail}
                />
              ))}

              <div className="mt-2 pt-2 border-t border-border/50 space-y-1.5">
                <div className="flex items-start gap-2">
                  <Star className="size-3 text-wc-gold mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground">Key advantage:</span>{" "}
                    Works alongside your UK SIM on dual-SIM phones. Keep your UK number active.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="size-3 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground">
                    No store visit needed &mdash; buy online before you leave, activate on arrival.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Practical Tips */}
          <Section title="Practical Tips">
            <div className="space-y-2.5">
              {PRACTICAL_TIPS.map(({ tip, detail }) => (
                <div key={tip} className="flex items-start gap-2">
                  <ArrowRight className="size-3 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium">{tip}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Quick comparison */}
          <Section title="Quick Comparison">
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-1.5 pr-2 font-medium text-muted-foreground">Option</th>
                    <th className="text-left py-1.5 pr-2 font-medium text-muted-foreground">Cost</th>
                    <th className="text-left py-1.5 pr-2 font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-1.5 font-medium text-muted-foreground">Effort</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-1.5 pr-2 font-medium">UK Roaming</td>
                    <td className="py-1.5 pr-2 text-muted-foreground">Free&ndash;\u00a332/16d</td>
                    <td className="py-1.5 pr-2 text-muted-foreground">Varies (slow)</td>
                    <td className="py-1.5">
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[9px]">
                        None
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50 bg-emerald-500/5">
                    <td className="py-1.5 pr-2 font-medium">US SIM (T-Mobile)</td>
                    <td className="py-1.5 pr-2 text-muted-foreground">$50</td>
                    <td className="py-1.5 pr-2 text-muted-foreground">50GB (fast)</td>
                    <td className="py-1.5">
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0 text-[9px]">
                        Store visit
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-2 font-medium">eSIM (Airalo)</td>
                    <td className="py-1.5 pr-2 text-muted-foreground">$10\u2013$25</td>
                    <td className="py-1.5 pr-2 text-muted-foreground">5\u201320GB</td>
                    <td className="py-1.5">
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[9px]">
                        Online
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommendation */}
            <div className="rounded-lg bg-wc-teal/10 border border-wc-teal/20 px-3 py-2.5 mt-2">
              <div className="flex items-start gap-2">
                <Star className="size-3.5 text-wc-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-wc-teal">
                    Our recommendation
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Get eSIMs via Airalo before you fly (data), and keep your UK SIMs active for WhatsApp calls home. If you need a proper US number, grab a T-Mobile Tourist Plan at the airport.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </CardContent>
    </Card>
  );
}
