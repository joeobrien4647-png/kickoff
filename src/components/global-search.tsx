"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Loader2,
  Trophy,
  Lightbulb,
  StickyNote,
  Bed,
  CalendarDays,
  Wallet,
  ClipboardCheck,
  MapPin,
  Home,
  Route,
  Compass,
  Backpack,
  Plane,
  Camera,
  Music,
  Target,
  BookOpen,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Type metadata: icons and labels
// ---------------------------------------------------------------------------

const TYPE_META: Record<string, { icon: React.ElementType; label: string }> = {
  match: { icon: Trophy, label: "Match" },
  idea: { icon: Lightbulb, label: "Idea" },
  note: { icon: StickyNote, label: "Note" },
  accommodation: { icon: Bed, label: "Accommodation" },
  itinerary: { icon: CalendarDays, label: "Itinerary" },
  expense: { icon: Wallet, label: "Expense" },
  checklist: { icon: ClipboardCheck, label: "Checklist" },
  stop: { icon: MapPin, label: "City" },
};

// ---------------------------------------------------------------------------
// Quick links shown when search is empty
// ---------------------------------------------------------------------------

const QUICK_LINKS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/matches", label: "Matches", icon: Trophy },
  { href: "/route", label: "Route", icon: Route },
  { href: "/guide", label: "City Guide", icon: Compass },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/itinerary", label: "Itinerary", icon: CalendarDays },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/accommodations", label: "Accommodations", icon: Bed },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/transport", label: "Transport", icon: Plane },
  { href: "/packing", label: "Packing", icon: Backpack },
  { href: "/predictions", label: "Predictions", icon: Target },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/playlist", label: "Playlist", icon: Music },
  { href: "/journal", label: "Journal", icon: BookOpen },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ---- Keyboard shortcut: Cmd+K / Ctrl+K ----
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // ---- Reset state when dialog opens/closes ----
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      // Auto-focus the input after a tick (dialog animation)
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // ---- Debounced search ----
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
          setSelectedIndex(0);
        }
      } catch {
        // Silently fail — user can retry
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ---- Navigate to a result ----
  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange],
  );

  // ---- Determine the items list (results or quick links) ----
  const showQuickLinks = !query.trim();
  const items = showQuickLinks
    ? QUICK_LINKS.map((l) => ({
        type: "link",
        id: l.href,
        title: l.label,
        subtitle: "",
        href: l.href,
      }))
    : results;

  // ---- Keyboard navigation inside the dialog ----
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(items.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1),
      );
    } else if (e.key === "Enter" && items[selectedIndex]) {
      e.preventDefault();
      navigate(items[selectedIndex].href);
    }
  }

  // ---- Scroll selected item into view ----
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 p-0 sm:max-w-lg overflow-hidden top-[30%] translate-y-[-30%]"
        onKeyDown={handleKeyDown}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden.Root>

        {/* ---- Search input ---- */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading && (
            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* ---- Results / Quick Links ---- */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto overscroll-contain"
        >
          {showQuickLinks && (
            <div className="px-3 pt-3 pb-1.5">
              <p className="px-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick Links
              </p>
            </div>
          )}

          {!showQuickLinks && results.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="size-8 mb-2 opacity-40" />
              <p className="text-sm">No results found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}

          {items.map((item, index) => {
            const meta = showQuickLinks
              ? {
                  icon: QUICK_LINKS.find((l) => l.href === item.href)?.icon ?? Search,
                  label: "",
                }
              : TYPE_META[item.type] ?? { icon: Search, label: item.type };

            const Icon = meta.icon;

            return (
              <button
                key={`${item.type}-${item.id}`}
                data-index={index}
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50",
                )}
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  {item.subtitle && !showQuickLinks && (
                    <p className="truncate text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                {!showQuickLinks && meta.label && (
                  <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {meta.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ---- Footer with keyboard hints ---- */}
        <div className="flex items-center gap-4 border-t px-4 py-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="size-3" />
            <ArrowDown className="size-3" />
            <span>Navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" />
            <span>Open</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border px-1 py-0.5 text-[10px] font-mono leading-none">
              Esc
            </kbd>
            <span>Close</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
