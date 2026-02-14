"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Car,
  MapPin,
  DollarSign,
  Camera,
  Trophy,
  Calendar,
  Fuel,
  CircleDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TripStats {
  totalMiles: number;
  statesCount: number;
  totalSpent: number;
  photoCount: number;
  matchesAttended: number;
  tripDays: number;
  fuelCost: number;
  tollCost: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  colorClass: string;
}

function StatCard({ icon, value, label, colorClass }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card/50 p-3">
      <div className={cn("shrink-0", colorClass)}>{icon}</div>
      <div className="min-w-0">
        <p className="text-lg font-bold tabular-nums leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground truncate">{label}</p>
      </div>
    </div>
  );
}

export function TripStatsSummary() {
  const [stats, setStats] = useState<TripStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/trip-stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return null;
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
            Trip by the Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[72px] rounded-lg border bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems: StatCardProps[] = [
    {
      icon: <Car className="size-5" />,
      value: `${stats.totalMiles.toLocaleString()}`,
      label: "Miles driven",
      colorClass: "text-wc-blue",
    },
    {
      icon: <MapPin className="size-5" />,
      value: `${stats.statesCount}`,
      label: "States visited",
      colorClass: "text-wc-teal",
    },
    {
      icon: <DollarSign className="size-5" />,
      value: `$${stats.totalSpent.toLocaleString()}`,
      label: "Total spent",
      colorClass: "text-wc-coral",
    },
    {
      icon: <Camera className="size-5" />,
      value: `${stats.photoCount}`,
      label: "Photos taken",
      colorClass: "text-wc-gold",
    },
    {
      icon: <Trophy className="size-5" />,
      value: `${stats.matchesAttended}`,
      label: "Matches attended",
      colorClass: "text-wc-blue",
    },
    {
      icon: <Calendar className="size-5" />,
      value: `${stats.tripDays}`,
      label: "Days on the road",
      colorClass: "text-wc-teal",
    },
    {
      icon: <Fuel className="size-5" />,
      value: `$${stats.fuelCost.toLocaleString()}`,
      label: "Fuel cost",
      colorClass: "text-wc-coral",
    },
    {
      icon: <CircleDollarSign className="size-5" />,
      value: `$${stats.tollCost.toLocaleString()}`,
      label: "Toll cost",
      colorClass: "text-wc-gold",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
          Trip by the Numbers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statItems.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
