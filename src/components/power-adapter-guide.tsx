"use client";

import { useState } from "react";
import { Plug, ChevronDown, ExternalLink, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const AMAZON_LINK = "https://www.amazon.com/s?k=UK+to+US+plug+adapter";

interface CompatItem {
  device: string;
  works: boolean | "maybe";
  note?: string;
}

const COMPATIBILITY: CompatItem[] = [
  { device: "Phone charger", works: true, note: "Dual-voltage (100-240V)" },
  { device: "Laptop", works: true, note: "Dual-voltage (100-240V)" },
  { device: "Camera charger", works: true, note: "Dual-voltage (100-240V)" },
  { device: "Electric toothbrush", works: true, note: "Most are dual-voltage" },
  {
    device: "Hair dryer",
    works: false,
    note: "Usually 230V only \u2014 needs converter",
  },
  {
    device: "Hair straightener",
    works: false,
    note: "Usually 230V only \u2014 needs converter",
  },
  {
    device: "Electric razor",
    works: "maybe",
    note: "Check label for 100-240V",
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

function PlugDiagram() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* UK Plug */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/40 p-3">
        <span className="text-2xl" role="img" aria-label="UK plug">
          {"\uD83C\uDDEC\uD83C\uDDE7"}
        </span>
        <div className="text-center">
          <p className="text-xs font-semibold">UK &mdash; Type G</p>
          <p className="text-[10px] text-muted-foreground">
            3 rectangular pins
          </p>
          {/* ASCII representation */}
          <pre className="mt-1.5 text-[10px] leading-tight text-muted-foreground font-mono">
            {"  [ ]  \n"}
            {"[  |  ]\n"}
            {"  [ ]  "}
          </pre>
        </div>
        <Badge variant="outline" className="text-[10px]">
          230V 50Hz
        </Badge>
      </div>

      {/* US Plug */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/40 p-3">
        <span className="text-2xl" role="img" aria-label="US plug">
          {"\uD83C\uDDFA\uD83C\uDDF8"}
        </span>
        <div className="text-center">
          <p className="text-xs font-semibold">US &mdash; Type A/B</p>
          <p className="text-[10px] text-muted-foreground">
            2 flat pins (+&nbsp;ground)
          </p>
          {/* ASCII representation */}
          <pre className="mt-1.5 text-[10px] leading-tight text-muted-foreground font-mono">
            {"  | |  \n"}
            {"  | |  \n"}
            {"   O   "}
          </pre>
        </div>
        <Badge variant="outline" className="text-[10px]">
          120V 60Hz
        </Badge>
      </div>
    </div>
  );
}

function StatusIcon({ works }: { works: boolean | "maybe" }) {
  if (works === true) return <span className="text-emerald-500">&#10003;</span>;
  if (works === false) return <span className="text-red-400">&#10007;</span>;
  return <span className="text-amber-400">~</span>;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface PowerAdapterGuideProps {
  className?: string;
}

export function PowerAdapterGuide({ className }: PowerAdapterGuideProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plug className="size-4 text-wc-gold" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Power Adapters
            </p>
          </div>
          <Badge className="bg-red-500/15 text-red-500 border-0 text-[10px]">
            Essential
          </Badge>
        </div>

        {/* Key warning */}
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            <Zap className="inline size-3 mr-1 -mt-0.5" />
            UK plugs will NOT fit US sockets. You need an adapter.
          </p>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-2">
          {/* Plug types */}
          <Section title="Plug Types Compared" defaultOpen>
            <PlugDiagram />
          </Section>

          {/* Voltage info */}
          <Section title="Voltage &amp; Frequency">
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">US:</span> 120V at
                60Hz
              </p>
              <p>
                <span className="font-medium text-foreground">UK:</span> 230V at
                50Hz
              </p>
              <p className="pt-1">
                Most modern chargers (phones, laptops, cameras) are{" "}
                <span className="font-medium text-foreground">
                  dual-voltage (100&ndash;240V)
                </span>{" "}
                and only need a plug adapter, not a voltage converter.
              </p>
              <p className="text-[10px] text-muted-foreground/80 italic">
                Check the small print on your charger for
                &ldquo;100&ndash;240V&rdquo;.
              </p>
            </div>
          </Section>

          {/* Compatibility checklist */}
          <Section title="What Works Without a Converter?">
            <div className="space-y-1.5">
              {COMPATIBILITY.map((item) => (
                <div
                  key={item.device}
                  className="flex items-start gap-2 text-xs"
                >
                  <span className="mt-0.5 font-mono text-sm leading-none">
                    <StatusIcon works={item.works} />
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium">{item.device}</span>
                    {item.note && (
                      <span className="text-muted-foreground">
                        {" "}
                        &mdash; {item.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Recommendation */}
          <Section title="What to Buy">
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                Get a{" "}
                <span className="font-medium text-foreground">
                  universal adapter with USB ports
                </span>
                . One adapter with 2&ndash;3 USB slots covers all three lads&rsquo;
                phones and a laptop.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <a
                  href={AMAZON_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-3" />
                  Browse UK to US Adapters on Amazon
                </a>
              </Button>
            </div>
          </Section>
        </div>
      </CardContent>
    </Card>
  );
}
