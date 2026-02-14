"use client";

import { useState } from "react";
import {
  Car,
  ChevronDown,
  AlertTriangle,
  Info,
  OctagonAlert,
  ArrowRight,
  Fuel,
  Route,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface DrivingRule {
  title: string;
  detail: string;
  severity: "critical" | "important" | "info";
}

const BIG_DIFFERENCES: DrivingRule[] = [
  {
    title: "Drive on the RIGHT side of the road",
    detail:
      "Opposite to the UK. Your instinct will betray you at every junction, especially on quiet roads and after the third pint.",
    severity: "critical",
  },
  {
    title: "Overtake on the LEFT",
    detail:
      "Mirror image of home. Pass slower traffic on their left side, not their right.",
    severity: "critical",
  },
  {
    title: "Steering wheel is on the LEFT",
    detail:
      "Your passenger now sits where the steering wheel should be. Give yourself 10 minutes in a car park to adjust.",
    severity: "critical",
  },
  {
    title: "Speed limits are in MPH",
    detail:
      "Same unit as UK, no conversion needed. But limits are different: 25-35 mph in towns, 55-70 mph on highways.",
    severity: "info",
  },
  {
    title: "Distances in miles",
    detail:
      "Same as the UK. One of the few things that won't confuse you.",
    severity: "info",
  },
];

const RULES_YOU_WONT_KNOW: DrivingRule[] = [
  {
    title: "Right on red",
    detail:
      "You CAN turn right at a red light after stopping completely, unless a sign says \"No Turn On Red\". Brits always forget this and get honked at.",
    severity: "important",
  },
  {
    title: "4-way stops",
    detail:
      "First to arrive = first to go. If two cars arrive simultaneously, yield to the car on your right. Take your turn, don't be too polite.",
    severity: "important",
  },
  {
    title: "School buses — MUST STOP",
    detail:
      "When a school bus flashes red lights, ALL traffic in BOTH directions must stop. It's ILLEGAL to pass. Fine is $500+. They take this deadly seriously.",
    severity: "critical",
  },
  {
    title: "HOV / carpool lanes",
    detail:
      "Diamond-marked lanes on highways are for 2+ passengers only during rush hour. With 3 lads in the car, you qualify. Use them.",
    severity: "info",
  },
  {
    title: "Speed limits are strictly enforced",
    detail:
      "10 mph over = ticket. American cops are less forgiving than UK speed cameras. Stick to the limit, especially in small towns.",
    severity: "important",
  },
  {
    title: "Highway merging",
    detail:
      "Americans merge aggressively. Match the highway speed on the on-ramp BEFORE joining. Don't creep in at 30 mph — that's how accidents happen.",
    severity: "important",
  },
  {
    title: "No roundabouts (mostly)",
    detail:
      "Traffic lights everywhere instead. Wait for a green arrow for protected left turns. Unprotected lefts = yield to oncoming traffic.",
    severity: "info",
  },
  {
    title: "Pedestrians ALWAYS have right of way",
    detail:
      "At crosswalks, pedestrians always have priority. Always. Even if they're crossing on red. Hitting a pedestrian = life-ruining consequences.",
    severity: "critical",
  },
];

const PRACTICAL_TIPS: { tip: string; detail: string }[] = [
  {
    tip: "Practice in a car park first",
    detail:
      "Get comfortable with the left-hand driving position before hitting actual roads.",
  },
  {
    tip: "Use Google Maps voice navigation",
    detail:
      "Constantly. Let it do the thinking while you focus on staying on the right side of the road.",
  },
  {
    tip: "Fill up at half tank",
    detail:
      "Gas stations can be far apart on long stretches. Don't push your luck in rural areas.",
  },
  {
    tip: "Keep right except to pass",
    detail:
      "On highways, the left lane is for overtaking only. Cruising in the left lane annoys everyone.",
  },
  {
    tip: "Interstate numbering system",
    detail:
      "Odd numbers = north/south routes. Even numbers = east/west routes. Helpful for navigation.",
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

const SEVERITY_CONFIG = {
  critical: {
    icon: <OctagonAlert className="size-3 shrink-0" />,
    className: "bg-red-500/15 text-red-500 border-0",
  },
  important: {
    icon: <AlertTriangle className="size-3 shrink-0" />,
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0",
  },
  info: {
    icon: <Info className="size-3 shrink-0" />,
    className: "bg-blue-500/15 text-blue-500 border-0",
  },
} as const;

function RuleRow({ rule }: { rule: DrivingRule }) {
  const config = SEVERITY_CONFIG[rule.severity];

  return (
    <div className="py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={cn("text-[10px] gap-1", config.className)}>
          {config.icon}
          {rule.severity === "critical"
            ? "Critical"
            : rule.severity === "important"
              ? "Important"
              : "Good to Know"}
        </Badge>
      </div>
      <p className="text-xs font-medium mt-1">{rule.title}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">
        {rule.detail}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface DrivingRulesProps {
  className?: string;
}

export function DrivingRules({ className }: DrivingRulesProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="size-4 text-wc-gold" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              US Driving Rules
            </p>
          </div>
          <Badge className="bg-red-500/15 text-red-500 border-0 text-[10px]">
            Essential
          </Badge>
        </div>

        {/* Licence warning */}
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Your UK licence is valid for driving in the US for up to 90 days.
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                Carry your passport as backup ID. An International Driving Permit
                is recommended but not required.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-2">
          {/* Big differences */}
          <Section title="The Big Differences" defaultOpen>
            <div className="divide-y-0">
              {BIG_DIFFERENCES.map((rule) => (
                <RuleRow key={rule.title} rule={rule} />
              ))}
            </div>
          </Section>

          {/* Rules you won't know */}
          <Section title="Rules You Won't Know">
            <div className="divide-y-0">
              {RULES_YOU_WONT_KNOW.map((rule) => (
                <RuleRow key={rule.title} rule={rule} />
              ))}
            </div>
          </Section>

          {/* Practical tips */}
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

          {/* Quick reference: fuel */}
          <Section title="Fuel Quick Reference">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <Fuel className="size-3.5 mt-0.5 shrink-0" />
                <div>
                  <p>
                    <span className="font-medium text-foreground">
                      It&rsquo;s called &ldquo;gas&rdquo;
                    </span>{" "}
                    not petrol. Fuel is priced per gallon (3.78 litres).
                  </p>
                  <p className="mt-1">
                    Roughly half the price of UK petrol. Fill up and enjoy the
                    feeling.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Route className="size-3.5 mt-0.5 shrink-0" />
                <p>
                  <span className="font-medium text-foreground">
                    Use &ldquo;Regular&rdquo; unleaded
                  </span>{" "}
                  (87 octane). No need for premium unless the rental agreement
                  says otherwise.
                </p>
              </div>
            </div>
          </Section>
        </div>
      </CardContent>
    </Card>
  );
}
