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
  Menu,
  ChevronDown,
  Compass,
  Target,
  Shield,
  Zap,
  Gamepad2,
  DollarSign,
  Lock,
  HelpCircle,
  Scissors,
  UtensilsCrossed,
  BookOpen,
  Vote,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SearchTrigger } from "@/components/search-trigger";

// ---------------------------------------------------------------------------
// Nav data
// ---------------------------------------------------------------------------

const DIRECT_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/days", label: "Days", icon: Calendar },
  { href: "/matches", label: "Matches", icon: Trophy },
  { href: "/route", label: "Route", icon: Route },
  { href: "/guide", label: "Guide", icon: Compass },
] as const;

const PLANNING_ITEMS = [
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/split", label: "Split & Tip", icon: Scissors },
  { href: "/accommodations", label: "Accommodations", icon: Bed },
  { href: "/transport", label: "Transport", icon: Plane },
  { href: "/itinerary", label: "Itinerary", icon: CalendarDays },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/packing", label: "Packing", icon: Backpack },
  { href: "/reservations", label: "Reservations", icon: UtensilsCrossed },
  { href: "/predictions", label: "Predictions", icon: Target },
  { href: "/polls", label: "Polls", icon: Vote },
] as const;

const FUN_ITEMS = [
  { href: "/trivia", label: "Trivia Quiz", icon: Trophy },
  { href: "/games", label: "Car Games", icon: Gamepad2 },
  { href: "/challenges", label: "Challenges", icon: Zap },
  { href: "/bets", label: "Side Bets", icon: DollarSign },
] as const;

const MORE_ITEMS = [
  { href: "/vault", label: "Travel Vault", icon: Lock },
  { href: "/emergency", label: "Emergency Info", icon: Shield },
  { href: "/playlist", label: "Playlist", icon: Music },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/blog", label: "Trip Blog", icon: BookOpen },
  { href: "/souvenirs", label: "Souvenirs", icon: Gift },
  { href: "/print", label: "Print Itinerary", icon: Printer },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TopNavbarProps {
  travelerName: string | null;
}

export function TopNavbar({ travelerName }: TopNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const planningIsActive = PLANNING_ITEMS.some((item) =>
    isActive(pathname, item.href),
  );
  const funIsActive = FUN_ITEMS.some((item) =>
    isActive(pathname, item.href),
  );
  const moreIsActive = MORE_ITEMS.some((item) =>
    isActive(pathname, item.href),
  );

  return (
    <nav className="sticky top-0 z-50 w-full h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* ---- Left: Brand ---- */}
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="size-5 text-wc-gold" />
          <span className="text-lg font-semibold tracking-tight">Kickoff</span>
        </Link>

        {/* ---- Center: Desktop links ---- */}
        <div className="hidden md:flex items-center gap-1">
          {DIRECT_LINKS.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-wc-teal" />
                )}
              </Link>
            );
          })}

          {/* Planning dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors outline-none",
                planningIsActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Planning
              <ChevronDown className="size-3.5" />
              {planningIsActive && (
                <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-wc-teal" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={12}>
              {PLANNING_ITEMS.map(({ href, label, icon: Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2",
                      isActive(pathname, href) &&
                        "text-foreground font-medium",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fun dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors outline-none",
                funIsActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Fun
              <ChevronDown className="size-3.5" />
              {funIsActive && (
                <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-wc-teal" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={12}>
              {FUN_ITEMS.map(({ href, label, icon: Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2",
                      isActive(pathname, href) &&
                        "text-foreground font-medium",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors outline-none",
                moreIsActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              More
              <ChevronDown className="size-3.5" />
              {moreIsActive && (
                <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-wc-teal" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={12}>
              {MORE_ITEMS.map(({ href, label, icon: Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2",
                      isActive(pathname, href) &&
                        "text-foreground font-medium",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ---- Right: Search + Avatar (desktop) / Hamburger (mobile) ---- */}
        <div className="flex items-center gap-3">
          <SearchTrigger />

          {/* Desktop avatar */}
          {travelerName && (
            <div className="hidden md:flex items-center gap-2">
              <span className="hidden lg:inline text-sm text-muted-foreground">
                {travelerName}
              </span>
              <Avatar size="sm">
                <AvatarFallback>{getInitials(travelerName)}</AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-4 pt-4 pb-2">
                <SheetTitle className="flex items-center gap-2">
                  <Trophy className="size-5 text-wc-gold" />
                  Kickoff
                </SheetTitle>
              </SheetHeader>

              <Separator />

              <div className="flex flex-1 flex-col overflow-y-auto">
                {/* Main section */}
                <div className="px-2 py-3">
                  <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Main
                  </p>
                  {DIRECT_LINKS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        isActive(pathname, href)
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Link>
                  ))}
                </div>

                <Separator className="mx-2" />

                {/* Planning section */}
                <div className="px-2 py-3">
                  <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Planning
                  </p>
                  {PLANNING_ITEMS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        isActive(pathname, href)
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Link>
                  ))}
                </div>

                <Separator className="mx-2" />

                {/* Fun section */}
                <div className="px-2 py-3">
                  <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Fun
                  </p>
                  {FUN_ITEMS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        isActive(pathname, href)
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Link>
                  ))}
                </div>

                <Separator className="mx-2" />

                {/* More section */}
                <div className="px-2 py-3">
                  <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    More
                  </p>
                  {MORE_ITEMS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        isActive(pathname, href)
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Footer: traveler info */}
              {travelerName && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 p-4">
                    <Avatar size="sm">
                      <AvatarFallback>
                        {getInitials(travelerName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground truncate">
                      {travelerName}
                    </span>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
