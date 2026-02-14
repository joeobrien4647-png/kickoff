"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useKeyboardShortcuts,
  SHORTCUTS,
  type ShortcutDef,
} from "@/hooks/use-keyboard-shortcuts";

// ---------------------------------------------------------------------------
// Kbd — a single keyboard key badge
// ---------------------------------------------------------------------------

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded border",
        "bg-muted px-2 py-0.5 text-xs font-mono leading-none",
        "text-muted-foreground min-w-[1.5rem]",
      )}
    >
      {children}
    </kbd>
  );
}

// ---------------------------------------------------------------------------
// ShortcutRow — single shortcut entry
// ---------------------------------------------------------------------------

function ShortcutRow({ shortcut }: { shortcut: ShortcutDef }) {
  const isSequence = shortcut.keys.length > 1 && shortcut.keys[0] === "g";

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-foreground">{shortcut.description}</span>
      <span className="flex items-center gap-1 shrink-0 ml-4">
        {shortcut.keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-xs text-muted-foreground">
                {isSequence ? "then" : "+"}
              </span>
            )}
            <Kbd>{key}</Kbd>
          </span>
        ))}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ShortcutSection — grouped section with header
// ---------------------------------------------------------------------------

function ShortcutSection({
  title,
  shortcuts,
}: {
  title: string;
  shortcuts: ShortcutDef[];
}) {
  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="divide-y divide-border">
        {shortcuts.map((s, i) => (
          <ShortcutRow key={i} shortcut={s} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KeyboardShortcuts — main exported component
// ---------------------------------------------------------------------------

export function KeyboardShortcuts() {
  const { helpOpen, setHelpOpen } = useKeyboardShortcuts();

  const navigation = SHORTCUTS.filter((s) => s.section === "Navigation");
  const actions = SHORTCUTS.filter((s) => s.section === "Actions");

  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          aria-label="Keyboard shortcuts"
        >
          <HelpCircle className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          <ShortcutSection title="Navigation" shortcuts={navigation} />
          <ShortcutSection title="Actions" shortcuts={actions} />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Press <Kbd>g</Kbd> then a letter to navigate. Two-key combos timeout
          after 1.5 seconds.
        </p>
      </DialogContent>
    </Dialog>
  );
}
