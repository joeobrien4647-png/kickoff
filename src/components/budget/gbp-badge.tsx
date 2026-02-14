"use client";

import { cn } from "@/lib/utils";

const USD_TO_GBP = 0.79;

interface GbpBadgeProps {
  amountUsd: number;
  className?: string;
}

export function GbpBadge({ amountUsd, className }: GbpBadgeProps) {
  const gbp = amountUsd * USD_TO_GBP;

  return (
    <span
      className={cn(
        "text-xs text-muted-foreground tabular-nums",
        className
      )}
      title="Approximate GBP equivalent"
    >
      {"\u00A3"}
      {gbp.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
