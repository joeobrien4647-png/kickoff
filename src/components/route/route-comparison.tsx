"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plane,
  Clock,
  DollarSign,
  Trophy,
  MapPin,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RouteScenario } from "@/lib/route-scenarios";

// ── Helpers ──────────────────────────────────────────────────────────────────

const GAS_RATE = 0.15; // $/mile
const TRAVELERS = 3;

/** Total minutes of driving */
function driveMinutes(s: RouteScenario) {
  return s.totalDriveHours * 60 + s.totalDriveMinutes;
}

/** Total minutes of train */
function trainMinutes(s: RouteScenario) {
  return (s.totalTrainHours ?? 0) * 60 + (s.totalTrainMinutes ?? 0);
}

/** Format minutes as "Xh Ym" */
function fmtTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Gas cost for the whole group (shared vehicle) */
function gasCost(s: RouteScenario) {
  return Math.round(s.totalMiles * GAS_RATE);
}

/** Flight cost for the whole group */
function flightCost(s: RouteScenario) {
  return s.estimatedFlightCostPP * TRAVELERS;
}

/** Train cost for the whole group */
function trainCost(s: RouteScenario) {
  return (s.estimatedTrainCostPP ?? 0) * TRAVELERS;
}

/** Total trip cost */
function totalCost(s: RouteScenario) {
  return gasCost(s) + flightCost(s) + trainCost(s);
}

/** Unique cities visited (from + to across all legs, deduplicated) */
function citiesVisited(s: RouteScenario): string[] {
  const set = new Set<string>();
  for (const leg of s.legs) {
    set.add(leg.from.name);
    set.add(leg.to.name);
  }
  return Array.from(set);
}

/**
 * Comfort score 1-10. Fewer drive hours and fewer flights = more comfortable.
 * Uses a weighted inverse: low hours + low flights = high score.
 */
function comfortScore(s: RouteScenario, allScenarios: RouteScenario[]): number {
  const maxDrive = Math.max(...allScenarios.map(driveMinutes));
  const maxFlights = Math.max(...allScenarios.map((x) => x.flightCount));

  // Normalize to 0-1 (lower is better), then invert
  const driveFactor = maxDrive > 0 ? driveMinutes(s) / maxDrive : 0;
  const flightFactor = maxFlights > 0 ? s.flightCount / maxFlights : 0;
  const trainFactor = maxDrive > 0 ? trainMinutes(s) / maxDrive : 0;

  // Weighted: driving fatigue matters most, flights second, train is comfy
  const raw = 1 - (driveFactor * 0.55 + flightFactor * 0.3 + trainFactor * 0.15);
  return Math.max(1, Math.min(10, Math.round(raw * 9 + 1)));
}

// ── Sortable columns ─────────────────────────────────────────────────────────

type SortKey =
  | "driveTime"
  | "miles"
  | "flights"
  | "flightCost"
  | "gasCost"
  | "totalCost"
  | "cities";

const COLUMNS: { key: SortKey; label: string; shortLabel: string }[] = [
  { key: "driveTime", label: "Drive Time", shortLabel: "Drive" },
  { key: "miles", label: "Total Miles", shortLabel: "Miles" },
  { key: "flights", label: "Flights", shortLabel: "Fly" },
  { key: "flightCost", label: "Flight Cost (pp)", shortLabel: "Flights $" },
  { key: "gasCost", label: "Gas Cost", shortLabel: "Gas $" },
  { key: "totalCost", label: "Total Cost", shortLabel: "Total $" },
  { key: "cities", label: "Cities", shortLabel: "Cities" },
];

function sortValue(s: RouteScenario, key: SortKey): number {
  switch (key) {
    case "driveTime":
      return driveMinutes(s);
    case "miles":
      return s.totalMiles;
    case "flights":
      return s.flightCount;
    case "flightCost":
      return s.estimatedFlightCostPP;
    case "gasCost":
      return gasCost(s);
    case "totalCost":
      return totalCost(s);
    case "cities":
      return citiesVisited(s).length;
  }
}

// ── Props ────────────────────────────────────────────────────────────────────

interface RouteComparisonProps {
  scenarios: RouteScenario[];
}

// ── Component ────────────────────────────────────────────────────────────────

export function RouteComparison({ scenarios }: RouteComparisonProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return scenarios;
    return [...scenarios].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [scenarios, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // Precomputed range for inline bar widths
  const maxDrive = Math.max(...scenarios.map(driveMinutes));

  // Quick stats
  const cheapest = [...scenarios].sort(
    (a, b) => totalCost(a) - totalCost(b)
  )[0];
  const fastest = [...scenarios].sort(
    (a, b) => driveMinutes(a) - driveMinutes(b)
  )[0];
  const mostCities = [...scenarios].sort(
    (a, b) => citiesVisited(b).length - citiesVisited(a).length
  )[0];

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <BarChart3 className="size-4 text-wc-teal" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Compare Routes
        </h2>
      </div>

      {/* ── Comparison Table ── */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="sticky left-0 z-10 bg-muted/30 px-3 py-2.5 text-left font-semibold text-muted-foreground min-w-[140px]">
                    Route
                  </th>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="px-3 py-2.5 text-right min-w-[80px]">
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground transition-colors ml-auto"
                      >
                        <span className="hidden sm:inline">{col.label}</span>
                        <span className="sm:hidden">{col.shortLabel}</span>
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3 opacity-30" />
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => {
                  const isNashville = s.id === "nashville-route";
                  const dMins = driveMinutes(s);
                  const driveBarPct =
                    maxDrive > 0 ? (dMins / maxDrive) * 100 : 0;
                  const cities = citiesVisited(s);

                  return (
                    <tr
                      key={s.id}
                      className={cn(
                        "border-b last:border-b-0 transition-colors hover:bg-accent/30",
                        isNashville && "bg-wc-gold/5"
                      )}
                    >
                      {/* Route name — sticky on mobile */}
                      <td
                        className={cn(
                          "sticky left-0 z-10 px-3 py-2.5 font-medium whitespace-nowrap",
                          isNashville
                            ? "border-l-2 border-l-wc-gold bg-wc-gold/5"
                            : "bg-card"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {isNashville && (
                            <Trophy className="size-3 text-wc-gold shrink-0" />
                          )}
                          <span>{s.name}</span>
                        </div>
                      </td>

                      {/* Drive Time — with inline bar */}
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="hidden sm:block w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                driveBarPct < 40
                                  ? "bg-wc-teal"
                                  : driveBarPct < 70
                                    ? "bg-wc-gold"
                                    : "bg-wc-coral"
                              )}
                              style={{ width: `${driveBarPct}%` }}
                            />
                          </div>
                          <span className="tabular-nums whitespace-nowrap">
                            {fmtTime(dMins)}
                          </span>
                        </div>
                      </td>

                      {/* Miles */}
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {s.totalMiles.toLocaleString()}
                      </td>

                      {/* Flights */}
                      <td className="px-3 py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          {s.flightCount > 0 && (
                            <Plane className="size-3 text-wc-blue" />
                          )}
                          {s.flightCount}
                        </span>
                      </td>

                      {/* Flight Cost pp */}
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {s.estimatedFlightCostPP > 0
                          ? `$${s.estimatedFlightCostPP}`
                          : "--"}
                      </td>

                      {/* Gas Cost */}
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {gasCost(s) > 0 ? `$${gasCost(s)}` : "--"}
                      </td>

                      {/* Total Cost */}
                      <td
                        className={cn(
                          "px-3 py-2.5 text-right font-bold tabular-nums",
                          isNashville && "text-wc-gold"
                        )}
                      >
                        ${totalCost(s).toLocaleString()}
                      </td>

                      {/* Cities */}
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className="tabular-nums cursor-default"
                          title={cities.join(", ")}
                        >
                          {cities.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Visual Bar Comparison ── */}
      <Card className="py-4">
        <CardContent className="space-y-5">
          <h3 className="text-sm font-bold">Visual Breakdown</h3>

          {/* Drive Time Bars */}
          <BarSection
            title="Total Drive Time"
            icon={<Clock className="size-3.5 text-muted-foreground" />}
            scenarios={scenarios}
            getValue={driveMinutes}
            formatValue={fmtTime}
            colorFn={(pct) =>
              pct < 0.4
                ? "bg-wc-teal"
                : pct < 0.7
                  ? "bg-wc-gold"
                  : "bg-wc-coral"
            }
          />

          {/* Total Cost Bars */}
          <BarSection
            title="Total Cost"
            icon={<DollarSign className="size-3.5 text-muted-foreground" />}
            scenarios={scenarios}
            getValue={totalCost}
            formatValue={(v) => `$${v.toLocaleString()}`}
            colorFn={(pct) =>
              pct < 0.4
                ? "bg-wc-teal"
                : pct < 0.7
                  ? "bg-wc-gold"
                  : "bg-wc-coral"
            }
          />

          {/* Comfort Score Bars */}
          <BarSection
            title="Comfort Score"
            icon={<Star className="size-3.5 text-muted-foreground" />}
            scenarios={scenarios}
            getValue={(s) => comfortScore(s, scenarios)}
            formatValue={(v) => `${v}/10`}
            maxOverride={10}
            colorFn={(pct) =>
              pct > 0.7
                ? "bg-wc-teal"
                : pct > 0.4
                  ? "bg-wc-gold"
                  : "bg-wc-coral"
            }
          />
        </CardContent>
      </Card>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <QuickStat
          icon={<DollarSign className="size-3.5" />}
          label="Cheapest"
          value={cheapest.name}
          detail={`$${totalCost(cheapest)}`}
          color="text-wc-teal"
        />
        <QuickStat
          icon={<Clock className="size-3.5" />}
          label="Fastest"
          value={fastest.name}
          detail={fmtTime(driveMinutes(fastest))}
          color="text-wc-blue"
        />
        <QuickStat
          icon={<MapPin className="size-3.5" />}
          label="Most cities"
          value={mostCities.name}
          detail={`${citiesVisited(mostCities).length} stops`}
          color="text-wc-coral"
        />
        <QuickStat
          icon={<Trophy className="size-3.5" />}
          label="Group's choice"
          value="Nashville Route"
          detail="Drive it all"
          color="text-wc-gold"
        />
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function BarSection({
  title,
  icon,
  scenarios,
  getValue,
  formatValue,
  colorFn,
  maxOverride,
}: {
  title: string;
  icon: React.ReactNode;
  scenarios: RouteScenario[];
  getValue: (s: RouteScenario) => number;
  formatValue: (v: number) => string;
  colorFn: (pct: number) => string;
  maxOverride?: number;
}) {
  const max = maxOverride ?? Math.max(...scenarios.map(getValue));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="space-y-1">
        {scenarios.map((s) => {
          const val = getValue(s);
          const pct = max > 0 ? val / max : 0;
          const isNashville = s.id === "nashville-route";

          return (
            <div key={s.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-28 truncate text-[11px]",
                  isNashville ? "font-bold text-wc-gold" : "text-muted-foreground"
                )}
              >
                {s.name}
              </span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    colorFn(pct),
                    isNashville && "ring-1 ring-wc-gold/40"
                  )}
                  style={{ width: `${Math.max(pct * 100, 2)}%` }}
                />
              </div>
              <span
                className={cn(
                  "w-14 text-right text-[11px] tabular-nums",
                  isNashville ? "font-bold text-wc-gold" : "text-muted-foreground"
                )}
              >
                {formatValue(val)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  detail,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  color: string;
}) {
  return (
    <Card className="py-3">
      <CardContent className="space-y-1">
        <div className={cn("flex items-center gap-1.5 text-xs font-medium", color)}>
          {icon}
          {label}
        </div>
        <p className="text-sm font-bold truncate">{value}</p>
        <p className="text-[11px] text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
