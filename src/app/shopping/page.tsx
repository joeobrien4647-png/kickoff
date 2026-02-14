import { db } from "@/lib/db";
import { stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { ShoppingList } from "@/components/shopping/shopping-list";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ShoppingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Shopping List</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Shared list for groceries, drinks, and supplies.
        </p>
      </section>
      <ShoppingList stops={allStops} />
    </div>
  );
}
