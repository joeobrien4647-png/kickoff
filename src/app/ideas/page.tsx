import { db } from "@/lib/db";
import { stops, ideas } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { IdeasView } from "@/components/ideas/ideas-view";
import { asc } from "drizzle-orm";

export default async function IdeasPage() {
  const session = await getSession();

  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();
  const allIdeas = db.select().from(ideas).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Ideas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Things we could do at each stop &mdash; the collaborative wishlist.
        </p>
      </section>

      <IdeasView
        stops={allStops}
        ideas={allIdeas}
        currentUser={session?.travelerName ?? null}
      />
    </div>
  );
}
