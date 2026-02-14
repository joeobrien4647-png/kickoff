"use client";

import { useState, useEffect, useCallback } from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  const handleReconnect = useCallback(() => {
    if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline]);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else {
      handleReconnect();
    }
  }, [isOnline, handleReconnect]);

  // Nothing to show: online and no reconnect message
  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 print:hidden",
        "animate-in slide-in-from-top duration-300 fill-mode-forwards"
      )}
    >
      {!isOnline ? (
        <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950">
          <WifiOff className="size-4 shrink-0" />
          <span>You&apos;re offline &mdash; some features may not work</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950">
          <span>Back online!</span>
        </div>
      )}
    </div>
  );
}
