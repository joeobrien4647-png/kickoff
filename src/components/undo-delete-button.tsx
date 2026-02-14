"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUndoableDelete } from "@/hooks/use-undoable-delete";
import { cn } from "@/lib/utils";

type UndoDeleteButtonProps = {
  deleteUrl: string;
  label: string;
  confirmLabel?: string;
  icon?: boolean;
  className?: string;
  onDeleted?: () => void;
};

/**
 * A reusable delete button that uses the undo-toast pattern instead of
 * immediately destroying data. On click it shows a sonner toast with an
 * "Undo" action; the actual DELETE only fires when the toast auto-closes.
 *
 * Two modes:
 *   icon={true}  - compact icon-only button (default)
 *   icon={false} - text button with trash icon
 */
export function UndoDeleteButton({
  deleteUrl,
  label,
  confirmLabel,
  icon = true,
  className,
  onDeleted,
}: UndoDeleteButtonProps) {
  const { deleteWithUndo } = useUndoableDelete();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);

    const deleted = await deleteWithUndo({ deleteUrl, label });

    if (deleted) {
      onDeleted?.();
    }

    setPending(false);
  }

  if (icon) {
    return (
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={handleClick}
        disabled={pending}
        className={cn(
          "text-destructive/70 hover:text-destructive",
          className,
        )}
      >
        <Trash2 className="size-3" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "text-destructive/70 hover:text-destructive",
        className,
      )}
    >
      <Trash2 className="size-3" />
      {confirmLabel ?? "Delete"}
    </Button>
  );
}
