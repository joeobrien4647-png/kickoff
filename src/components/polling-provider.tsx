"use client";

import { usePolling } from "@/hooks/use-polling";

export function PollingProvider({ children }: { children: React.ReactNode }) {
  usePolling(30000); // 30 seconds
  return <>{children}</>;
}
