"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/global-search";

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 text-muted-foreground h-8 px-3"
      >
        <Search className="size-3.5" />
        <span className="text-xs">Search</span>
        <kbd className="pointer-events-none ml-1 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono leading-none text-muted-foreground">
          {isMac ? "\u2318" : "Ctrl+"}K
        </kbd>
      </Button>

      {/* Mobile: icon-only button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden size-8"
        aria-label="Search"
      >
        <Search className="size-4" />
      </Button>

      <GlobalSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
