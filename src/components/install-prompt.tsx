"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const STORAGE_KEY = "kickoff_install_dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { timestamp } = JSON.parse(raw);
    return Date.now() - timestamp < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  if ((navigator as unknown as Record<string, unknown>).standalone === true) return true;
  return false;
}

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissedRecently()) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  async function handleInstall() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setPromptEvent(null);
  }

  function handleDismiss() {
    setVisible(false);
    setPromptEvent(null);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }

  if (!visible) return null;

  return (
    <div
      className={
        "fixed bottom-16 md:bottom-4 left-0 right-0 z-40 mx-4 flex justify-center " +
        "animate-in fade-in slide-in-from-bottom-4 duration-300"
      }
    >
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border bg-card p-3 shadow-lg">
        <Download className="size-5 shrink-0 text-wc-teal" />
        <p className="flex-1 text-sm leading-snug">
          Add Kickoff to your home screen for the best experience
        </p>
        <button
          onClick={handleInstall}
          className="shrink-0 rounded-md bg-wc-teal px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Dismiss install prompt"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
