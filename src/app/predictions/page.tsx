import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { matches, predictions, travelers } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { PredictionsView } from "@/components/predictions/predictions-view";

export default async function PredictionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allMatches = db
    .select()
    .from(matches)
    .orderBy(asc(matches.matchDate))
    .all();
  const allPredictions = db.select().from(predictions).all();
  const allTravelers = db.select().from(travelers).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Predictions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Predict match scores and compete with your travel crew.
        </p>
      </section>
      <PredictionsView
        matches={allMatches}
        predictions={allPredictions}
        travelers={allTravelers}
        currentUser={session.travelerName}
      />
    </div>
  );
}
