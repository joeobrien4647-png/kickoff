import { db } from "@/lib/db";
import { packingItems } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { PACKING_CATEGORIES } from "@/lib/constants";
import { PrintLayout } from "@/components/print/print-layout";
import type { PackingItem } from "@/lib/schema";

export default function PrintPackingPage() {
  const items = db
    .select()
    .from(packingItems)
    .orderBy(asc(packingItems.category), asc(packingItems.name))
    .all();

  // Group items by category, preserving PACKING_CATEGORIES order
  const grouped = new Map<string, PackingItem[]>();
  for (const cat of PACKING_CATEGORIES) {
    const catItems = items.filter((i) => i.category === cat.value);
    if (catItems.length > 0) {
      grouped.set(cat.value, catItems);
    }
  }

  const categoryLabel = (value: string) =>
    PACKING_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  return (
    <PrintLayout title="Packing Checklist">
      {grouped.size === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No packing items yet.
        </p>
      ) : (
        <div className="space-y-6 print:space-y-4">
          {Array.from(grouped.entries()).map(([cat, catItems]) => (
            <section key={cat}>
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-1 mb-3 print:border-black/20">
                {categoryLabel(cat)}
              </h2>
              <ul className="space-y-1.5">
                {catItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    <span className="inline-block size-4 shrink-0 rounded border border-border print:border-black/40" />
                    <span className="flex-1">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-muted-foreground ml-1">
                          (x{item.quantity})
                        </span>
                      )}
                    </span>
                    {item.assignedTo && (
                      <span className="text-xs text-muted-foreground print:text-black/50">
                        {item.assignedTo}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <footer className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground print:border-black/20 print:mt-6">
        <p>
          {items.length} items &middot;{" "}
          {items.filter((i) => i.checked).length} already packed
        </p>
      </footer>
    </PrintLayout>
  );
}
