"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Polls the server for fresh data by calling router.refresh() at a regular interval.
 * Only polls when the tab is visible (uses Page Visibility API).
 */
export function usePolling(intervalMs = 30000) {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    function startPolling() {
      timer = setInterval(() => {
        if (!document.hidden) {
          router.refresh();
        }
      }, intervalMs);
    }

    function handleVisibilityChange() {
      clearInterval(timer);
      if (!document.hidden) {
        startPolling();
      }
    }

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, intervalMs]);
}
