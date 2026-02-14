import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import {
  logistics,
  packingItems,
  accommodations,
  matches,
  transports,
  decisions,
} from "@/lib/schema";
import { sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Category weights for overall readiness calculation
// ---------------------------------------------------------------------------
const CATEGORY_WEIGHTS = {
  checklist: 20,
  packing: 15,
  accommodation: 20,
  tickets: 20,
  transport: 15,
  decisions: 10,
} as const;

const TOTAL_WEIGHT = Object.values(CATEGORY_WEIGHTS).reduce((a, b) => a + b, 0);

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------
function statusColor(pct: number): {
  text: string;
  bar: string;
  ring: string;
  label: string;
} {
  if (pct < 33)
    return {
      text: "text-wc-coral",
      bar: "bg-wc-coral",
      ring: "stroke-wc-coral",
      label: "Behind",
    };
  if (pct < 67)
    return {
      text: "text-wc-gold",
      bar: "bg-wc-gold",
      ring: "stroke-wc-gold",
      label: "In progress",
    };
  return {
    text: "text-wc-teal",
    bar: "bg-wc-teal",
    ring: "stroke-wc-teal",
    label: "On track",
  };
}

function encouragingMessage(pct: number): string {
  if (pct < 25) return "Time to get cracking, lads";
  if (pct <= 50) return "Making progress...";
  if (pct <= 75) return "Looking good!";
  if (pct <= 90) return "Nearly there!";
  return "Ready to go! \u{1F1EC}\u{1F1E7}";
}

// ---------------------------------------------------------------------------
// SVG circular progress ring (large, centered percentage)
// ---------------------------------------------------------------------------
const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;

function ReadinessRing({ pct }: { pct: number }) {
  const offset = RING_C * (1 - pct / 100);
  const { ring, text } = statusColor(pct);

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="size-28" aria-hidden>
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={RING_R}
          fill="none"
          className="stroke-muted"
          strokeWidth={6}
        />
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r={RING_R}
          fill="none"
          className={ring}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* Centered percentage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold tabular-nums", text)}>
          {pct}%
        </span>
        <span className="text-[10px] text-muted-foreground">ready</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini progress bar row
// ---------------------------------------------------------------------------
function CategoryRow({
  label,
  pct,
  detail,
}: {
  label: string;
  pct: number;
  detail: string;
}) {
  const { text, bar } = statusColor(pct);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-xs font-semibold tabular-nums", text)}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", bar)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground/70">{detail}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Safe percentage: avoid NaN / division-by-zero, round to integer
// ---------------------------------------------------------------------------
function safePct(done: number, total: number): number {
  if (total === 0) return 100; // nothing to do = 100% complete
  return Math.round((done / total) * 100);
}

// ===========================================================================
// Main server component
// ===========================================================================
export function TripReadiness() {
  // ── Query each category ────────────────────────────────────────────────

  // 1. Checklist (logistics): done vs total
  const checklistStats = db
    .select({
      total: sql<number>`count(*)`,
      done: sql<number>`sum(case when status = 'done' then 1 else 0 end)`,
    })
    .from(logistics)
    .get()!;

  // 2. Packing: checked vs total
  const packingStats = db
    .select({
      total: sql<number>`count(*)`,
      packed: sql<number>`sum(case when checked = 1 then 1 else 0 end)`,
    })
    .from(packingItems)
    .get()!;

  // 3. Accommodations: confirmed vs total
  const accommodationStats = db
    .select({
      total: sql<number>`count(*)`,
      confirmed: sql<number>`sum(case when confirmed = 1 then 1 else 0 end)`,
    })
    .from(accommodations)
    .get()!;

  // 4. Tickets: purchased vs attending
  const ticketStats = db
    .select({
      attending: sql<number>`sum(case when attending = 1 then 1 else 0 end)`,
      purchased: sql<number>`sum(case when ticket_status = 'purchased' then 1 else 0 end)`,
    })
    .from(matches)
    .get()!;

  // 5. Transport: booked (has confirmation ref) vs total
  const transportStats = db
    .select({
      total: sql<number>`count(*)`,
      booked: sql<number>`sum(case when confirmation_ref is not null and confirmation_ref != '' then 1 else 0 end)`,
    })
    .from(transports)
    .get()!;

  // 6. Decisions: decided vs total
  const decisionStats = db
    .select({
      total: sql<number>`count(*)`,
      decided: sql<number>`sum(case when status = 'decided' then 1 else 0 end)`,
    })
    .from(decisions)
    .get()!;

  // ── Compute percentages ────────────────────────────────────────────────

  const checklistPct = safePct(checklistStats.done ?? 0, checklistStats.total);
  const packingPct = safePct(packingStats.packed ?? 0, packingStats.total);
  const accommodationPct = safePct(
    accommodationStats.confirmed ?? 0,
    accommodationStats.total
  );
  const ticketPct = safePct(
    ticketStats.purchased ?? 0,
    ticketStats.attending ?? 0
  );
  const transportPct = safePct(
    transportStats.booked ?? 0,
    transportStats.total
  );
  const decisionPct = safePct(
    decisionStats.decided ?? 0,
    decisionStats.total
  );

  // ── Weighted overall readiness ─────────────────────────────────────────

  const overall = Math.round(
    (checklistPct * CATEGORY_WEIGHTS.checklist +
      packingPct * CATEGORY_WEIGHTS.packing +
      accommodationPct * CATEGORY_WEIGHTS.accommodation +
      ticketPct * CATEGORY_WEIGHTS.tickets +
      transportPct * CATEGORY_WEIGHTS.transport +
      decisionPct * CATEGORY_WEIGHTS.decisions) /
      TOTAL_WEIGHT
  );

  const overallStatus = statusColor(overall);
  const message = encouragingMessage(overall);

  // ── Category detail strings ────────────────────────────────────────────

  const categories = [
    {
      label: "Checklist",
      pct: checklistPct,
      detail: `${checklistStats.done ?? 0} of ${checklistStats.total} tasks done`,
    },
    {
      label: "Packing",
      pct: packingPct,
      detail: `${packingStats.packed ?? 0} of ${packingStats.total} items packed`,
    },
    {
      label: "Accommodation",
      pct: accommodationPct,
      detail: `${accommodationStats.confirmed ?? 0} of ${accommodationStats.total} confirmed`,
    },
    {
      label: "Tickets",
      pct: ticketPct,
      detail: `${ticketStats.purchased ?? 0} of ${ticketStats.attending ?? 0} purchased`,
    },
    {
      label: "Transport",
      pct: transportPct,
      detail: `${transportStats.booked ?? 0} of ${transportStats.total} booked`,
    },
    {
      label: "Decisions",
      pct: decisionPct,
      detail: `${decisionStats.decided ?? 0} of ${decisionStats.total} decided`,
    },
  ];

  return (
    <Card className="py-4">
      <CardContent className="space-y-4">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className={cn("size-4", overallStatus.text)} />
            <h3 className="text-sm font-bold">Trip Readiness</h3>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0",
              overallStatus.text,
              overall >= 67
                ? "border-wc-teal/30"
                : overall >= 33
                  ? "border-wc-gold/30"
                  : "border-wc-coral/30"
            )}
          >
            {overallStatus.label}
          </Badge>
        </div>

        {/* ── Circular progress ring ─────────────────────────────────── */}
        <div className="flex flex-col items-center gap-1">
          <ReadinessRing pct={overall} />
          <p className="text-xs text-muted-foreground italic mt-1">{message}</p>
        </div>

        {/* ── Category breakdown ──────────────────────────────────────── */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryRow
              key={cat.label}
              label={cat.label}
              pct={cat.pct}
              detail={cat.detail}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
