import { db } from "@/lib/db";
import { packingItems, travelers } from "@/lib/schema";
import { PackingView } from "@/components/packing/packing-view";

export default async function PackingPage() {
  const items = db.select().from(packingItems).all();
  const allTravelers = db.select().from(travelers).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Packing List</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track what everyone needs to bring.
        </p>
      </section>
      <PackingView items={items} travelers={allTravelers} />
    </div>
  );
}
