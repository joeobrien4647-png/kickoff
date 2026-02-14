"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Shortcut definitions
// ---------------------------------------------------------------------------

export interface ShortcutDef {
  /** Display keys, e.g. ["g", "h"] or ["?"] or ["Ctrl", "K"] */
  keys: string[];
  /** Human-readable description */
  description: string;
  /** Section header for grouping in the help panel */
  section: "Navigation" | "Actions";
}

export const SHORTCUTS: ShortcutDef[] = [
  // Navigation — "g" prefix combos
  { keys: ["g", "h"], description: "Go to Home", section: "Navigation" },
  { keys: ["g", "d"], description: "Go to Days", section: "Navigation" },
  { keys: ["g", "m"], description: "Go to Matches", section: "Navigation" },
  { keys: ["g", "r"], description: "Go to Route", section: "Navigation" },
  { keys: ["g", "b"], description: "Go to Budget", section: "Navigation" },
  { keys: ["g", "g"], description: "Go to Guide", section: "Navigation" },
  { keys: ["g", "s"], description: "Go to Settings", section: "Navigation" },
  // Actions
  { keys: ["?"], description: "Show keyboard shortcuts", section: "Actions" },
  {
    keys: ["Ctrl/\u2318", "K"],
    description: "Open search",
    section: "Actions",
  },
  { keys: ["Escape"], description: "Close dialogs", section: "Actions" },
];

// Map second key in a "g" combo to its route
const G_ROUTES: Record<string, string> = {
  h: "/",
  d: "/days",
  m: "/matches",
  r: "/route",
  b: "/budget",
  g: "/guide",
  s: "/settings",
};

// How long to wait for the second key after pressing "g" (ms)
const G_TIMEOUT = 1500;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el.isContentEditable;
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const gModeRef = useRef(false);
  const gTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearGMode = useCallback(() => {
    gModeRef.current = false;
    if (gTimerRef.current) {
      clearTimeout(gTimerRef.current);
      gTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Never intercept when user is typing in a form field
      if (isEditableTarget(e.target)) return;

      // Ctrl/Cmd+K is handled by GlobalSearch — skip here
      if ((e.metaKey || e.ctrlKey) && e.key === "k") return;

      // Don't intercept modified keys (except shift for "?")
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;

      // ---- "g" prefix mode ----
      if (gModeRef.current) {
        clearGMode();
        const route = G_ROUTES[key];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
        return;
      }

      // Enter "g" prefix mode
      if (key === "g") {
        gModeRef.current = true;
        gTimerRef.current = setTimeout(clearGMode, G_TIMEOUT);
        return;
      }

      // "?" to toggle help
      if (key === "?") {
        e.preventDefault();
        setHelpOpen((prev) => !prev);
        return;
      }

      // Escape closes help (Dialog handles its own Escape too,
      // but this ensures consistent behavior)
      if (key === "Escape") {
        if (helpOpen) {
          setHelpOpen(false);
        }
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearGMode();
    };
  }, [router, helpOpen, clearGMode]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (gTimerRef.current) clearTimeout(gTimerRef.current);
    };
  }, []);

  return { helpOpen, setHelpOpen };
}
