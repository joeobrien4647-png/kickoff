import { db } from "@/lib/db";
import { logistics, travelers } from "@/lib/schema";
import { ChecklistView } from "@/components/checklist/checklist-view";

export default async function ChecklistPage() {
  const allItems = db.select().from(logistics).all();
  const allTravelers = db.select().from(travelers).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Checklist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pre-trip logistics &mdash; everything to book, sort, and confirm before
          kickoff.
        </p>
      </section>

      <ChecklistView items={allItems} travelers={allTravelers} />
    </div>
  );
}
