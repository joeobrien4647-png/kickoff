import { db } from "@/lib/db";
import { accommodations, stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { AccommodationsView } from "@/components/accommodations/accommodations-view";
import { WifiVault } from "@/components/accommodations/wifi-vault";

export default async function AccommodationsPage() {
  const allAccommodations = db.select().from(accommodations).all();
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Accommodations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Where you&apos;re staying at each stop along the way.
        </p>
      </section>

      <AccommodationsView
        accommodations={allAccommodations}
        stops={allStops}
      />

      <WifiVault
        accommodations={allAccommodations.map((acc) => {
          const stop = allStops.find((s) => s.id === acc.stopId);
          return {
            id: acc.id,
            name: acc.name,
            wifiPassword: acc.wifiPassword,
            city: stop?.city ?? "Unknown",
          };
        })}
      />
    </div>
  );
}
