"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UndoableDeleteOptions = {
  deleteUrl: string;
  label: string;
  undoSeconds?: number;
};

/**
 * Hook for delete-with-undo: shows a toast with an "Undo" button instead of
 * immediately deleting. The actual DELETE request fires only after the toast
 * auto-closes. If the user clicks "Undo" before then, the delete is cancelled
 * and the UI is refreshed back to its previous state.
 *
 * Usage:
 *   const { deleteWithUndo } = useUndoableDelete();
 *   await deleteWithUndo({ deleteUrl: `/api/expenses/${id}`, label: "Expense deleted" });
 */
export function useUndoableDelete() {
  const router = useRouter();

  function deleteWithUndo({
    deleteUrl,
    label,
    undoSeconds = 5,
  }: UndoableDeleteOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let cancelled = false;

      toast(label, {
        description: `Undo within ${undoSeconds} seconds`,
        duration: undoSeconds * 1000,
        action: {
          label: "Undo",
          onClick: () => {
            cancelled = true;
            toast.success("Restored!");
            router.refresh();
            resolve(false);
          },
        },
        onAutoClose: async () => {
          if (!cancelled) {
            await fetch(deleteUrl, { method: "DELETE" });
            router.refresh();
            resolve(true);
          }
        },
      });
    });
  }

  return { deleteWithUndo };
}
