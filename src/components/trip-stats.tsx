"use client";

import {
  Car,
  MapPin,
  Trophy,
  DollarSign,
  Lightbulb,
  Luggage,
  Timer,
  Pizza,
} from "lucide-react";

export interface TripStatsProps {
  totalMiles: number;
  totalStops: number;
  totalMatches: number;
  attendingMatches: number;
  totalExpenses: number;
  totalIdeas: number;
  packingProgress: number; // percentage
  daysUntil: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}

function StatItem({ icon, label, value, colorClass }: StatItemProps) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className={`shrink-0 ${colorClass}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export function TripStats({
  totalMiles,
  totalStops,
  totalMatches,
  attendingMatches,
  totalExpenses,
  totalIdeas,
  packingProgress,
  daysUntil,
}: TripStatsProps) {
  const hoursOfFootball = attendingMatches * 2;
  const estimatedPizzas = Math.max(1, Math.round(totalStops * 2.5));

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Trip Stats
        </h3>
      </div>

      {/* Stats grid */}
      <div className="px-4 pb-4 grid grid-cols-1 gap-0.5 divide-y divide-border">
        <StatItem
          icon={<Car className="size-4" />}
          label="Total driving distance"
          value={`${Math.round(totalMiles).toLocaleString()} miles`}
          colorClass="text-wc-blue"
        />
        <StatItem
          icon={<MapPin className="size-4" />}
          label="Cities on the route"
          value={`${totalStops} cities`}
          colorClass="text-wc-teal"
        />
        <StatItem
          icon={<Trophy className="size-4" />}
          label="Matches attending"
          value={`${attendingMatches} of ${totalMatches}`}
          colorClass="text-wc-gold"
        />
        <StatItem
          icon={<DollarSign className="size-4" />}
          label="Budget spent so far"
          value={`$${Math.round(totalExpenses).toLocaleString()}`}
          colorClass="text-wc-coral"
        />
        <StatItem
          icon={<Luggage className="size-4" />}
          label="Packing progress"
          value={`${packingProgress}% packed`}
          colorClass="text-wc-teal"
        />
        <StatItem
          icon={<Lightbulb className="size-4" />}
          label="Trip ideas saved"
          value={`${totalIdeas} ideas`}
          colorClass="text-wc-gold"
        />

        {/* Fun stats divider */}
        <div className="pt-2">
          <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest mb-1">
            Fun numbers
          </p>
        </div>
        <StatItem
          icon={<Timer className="size-4" />}
          label="Hours of live football"
          value={`~${hoursOfFootball} hours`}
          colorClass="text-wc-blue"
        />
        <StatItem
          icon={<Pizza className="size-4" />}
          label="Estimated pizzas consumed"
          value={`~${estimatedPizzas} slices (at least)`}
          colorClass="text-wc-coral"
        />
      </div>
    </div>
  );
}
