"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { today, formatDate } from "@/lib/dates";
import { MILESTONES } from "@/lib/milestones";
import {
  FileCheck,
  Shield,
  Bed,
  Car,
  Ticket,
  Home,
  MapPin,
  Smartphone,
  Backpack,
  Printer,
  Plane,
  Check,
  Circle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, LucideIcon> = {
  FileCheck,
  Shield,
  Bed,
  Car,
  Ticket,
  Home,
  MapPin,
  Smartphone,
  Backpack,
  Printer,
  Plane,
};

export function MilestonesCard() {
  const currentDate = today();

  // Find the index of the first upcoming milestone (the "next" one)
  const nextIndex = MILESTONES.findIndex((m) => m.date >= currentDate);

  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Milestones</h3>
          <Link
            href="/checklist"
            className="text-xs text-wc-teal hover:underline"
          >
            View checklist &rarr;
          </Link>
        </div>

        <div className="relative space-y-0">
          {/* Vertical timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

          {MILESTONES.map((milestone, i) => {
            const isPast = milestone.date < currentDate;
            const isNext = i === nextIndex;
            const Icon = ICON_MAP[milestone.icon] ?? Circle;

            return (
              <div
                key={`${milestone.date}-${milestone.label}`}
                className={cn(
                  "relative flex items-start gap-3 py-1.5 pl-0"
                )}
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                    isPast
                      ? "bg-wc-teal/20"
                      : isNext
                        ? "bg-wc-gold/20 ring-2 ring-wc-gold/40"
                        : "bg-muted"
                  )}
                >
                  {isPast ? (
                    <Check className="size-3 text-wc-teal" />
                  ) : (
                    <Icon
                      className={cn(
                        "size-3",
                        isNext ? "text-wc-gold" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-xs",
                      isPast
                        ? "text-muted-foreground line-through"
                        : isNext
                          ? "font-bold text-wc-gold"
                          : "text-muted-foreground"
                    )}
                  >
                    {milestone.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDate(milestone.date)}
                  </p>
                </div>

                {/* Next badge */}
                {isNext && (
                  <Badge
                    variant="outline"
                    className="shrink-0 animate-pulse border-wc-gold/30 px-1.5 py-0 text-[10px] text-wc-gold"
                  >
                    Next
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
