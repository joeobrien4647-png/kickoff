"use client";

import dynamic from "next/dynamic";
import type { RouteScenario } from "@/lib/route-scenarios";

const RouteMap = dynamic(() => import("./route-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg bg-card animate-pulse flex items-center justify-center">
      <span className="text-sm text-muted-foreground">Loading map...</span>
    </div>
  ),
});

interface RouteMapWrapperProps {
  scenario: RouteScenario;
  cityColors: Record<string, string>;
}

export function RouteMapWrapper({ scenario, cityColors }: RouteMapWrapperProps) {
  return <RouteMap scenario={scenario} cityColors={cityColors} />;
}
