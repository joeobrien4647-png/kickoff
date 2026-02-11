"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  CalendarDays,
  Trophy,
  Wallet,
  Lightbulb,
  ClipboardCheck,
  Backpack,
  Bed,
  Plane,
  Music,
  StickyNote,
  Settings,
  Route,
  Printer,
  Camera,
  Compass,
  Target,
  Shield,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Nav data (mirrored from top-navbar for consistency)
// ---------------------------------------------------------------------------

const MAIN_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/days", label: "Days", icon: Calendar },
  { href: "/matches", label: "Matches", icon: Trophy },
  { href: "/route", label: "Route", icon: Route },
  { href: "/guide", label: "Guide", icon: Compass },
] as const;

const PLANNING_ITEMS = [
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/accommodations", label: "Accommodations", icon: Bed },
  { href: "/transport", label: "Transport", icon: Plane },
  { href: "/itinerary", label: "Itinerary", icon: CalendarDays },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/packing", label: "Packing", icon: Backpack },
  { href: "/predictions", label: "Predictions", icon: Target },
] as const;

const MORE_ITEMS = [
  { href: "/emergency", label: "Emergency Info", icon: Shield },
  { href: "/playlist", label: "Playlist", icon: Music },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/print", label: "Print Itinerary", icon: Printer },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// ---------------------------------------------------------------------------
// Bottom tabs configuration
// ---------------------------------------------------------------------------

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/matches", label: "Matches", icon: Trophy },
  { href: "/route", label: "Route", icon: Route },
  { href: "/budget", label: "Budget", icon: Wallet },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  // The "More" tab is considered active when the current page isn't covered
  // by any of the four primary tabs.
  const moreIsActive =
    !TABS.some((tab) => isActive(pathname, tab.href)) && pathname !== "/";

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-50 h-[60px] border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden pb-[env(safe-area-inset-bottom)]"
        role="tablist"
        aria-label="Main navigation"
      >
        <div className="flex h-full items-center justify-around px-1">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                role="tab"
                aria-selected={active}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
                  active ? "text-wc-teal" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                <span className="text-[10px] leading-tight font-medium">
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More tab -- opens sheet instead of navigating */}
          <button
            type="button"
            role="tab"
            aria-selected={moreIsActive}
            aria-label="More navigation options"
            onClick={() => setSheetOpen(true)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
              moreIsActive ? "text-wc-teal" : "text-muted-foreground",
            )}
          >
            <Menu className="size-5" />
            <span className="text-[10px] leading-tight font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* ---- More sheet ---- */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-xl p-0">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-wc-gold" />
              Kickoff
            </SheetTitle>
          </SheetHeader>

          <Separator />

          <div className="flex-1 overflow-y-auto">
            {/* Main section */}
            <NavSection label="Main" items={MAIN_ITEMS} pathname={pathname} onNavigate={() => setSheetOpen(false)} />

            <Separator className="mx-2" />

            {/* Planning section */}
            <NavSection label="Planning" items={PLANNING_ITEMS} pathname={pathname} onNavigate={() => setSheetOpen(false)} />

            <Separator className="mx-2" />

            {/* More section */}
            <NavSection label="More" items={MORE_ITEMS} pathname={pathname} onNavigate={() => setSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ---------------------------------------------------------------------------
// NavSection -- reusable section renderer for the sheet
// ---------------------------------------------------------------------------

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

interface NavSectionProps {
  label: string;
  items: readonly NavItem[];
  pathname: string;
  onNavigate: () => void;
}

function NavSection({ label, items, pathname, onNavigate }: NavSectionProps) {
  return (
    <div className="px-2 py-3">
      <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      {items.map(({ href, label: itemLabel, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
            isActive(pathname, href)
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <Icon className="size-4" />
          {itemLabel}
        </Link>
      ))}
    </div>
  );
}
