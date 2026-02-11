import { db } from "@/lib/db";
import { stops, itineraryItems, matches } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { ItineraryView } from "@/components/itinerary/itinerary-view";

export default function ItineraryPage() {
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();
  const allItems = db.select().from(itineraryItems).all();
  const allMatches = db.select().from(matches).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <ItineraryView stops={allStops} items={allItems} matches={allMatches} />
    </div>
  );
}
