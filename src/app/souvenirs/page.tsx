import { db } from "@/lib/db";
import { souvenirs, stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SouvenirTracker } from "@/components/souvenirs/souvenir-tracker";

export default async function SouvenirsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allSouvenirs = db.select().from(souvenirs).all();
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Souvenirs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track gifts and mementos from each stop.
        </p>
      </section>
      <SouvenirTracker souvenirs={allSouvenirs} stops={allStops} />
    </div>
  );
}
