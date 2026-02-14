import { db } from "@/lib/db";
import { transports, stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { TransportView } from "@/components/transport/transport-view";
import { FlightChecklist } from "@/components/flight-checklist";
import { ROUTE_STOPS } from "@/lib/constants";

export default function TransportPage() {
  const allTransports = db.select().from(transports).all();
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();

  // Build city list from route stops + any DB stops
  const cityNames = new Set<string>();
  for (const rs of ROUTE_STOPS) cityNames.add(rs.name);
  for (const s of allStops) cityNames.add(s.city);
  const cities = Array.from(cityNames).sort();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Transport</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Flights, trains, rentals &mdash; every leg of the journey.
        </p>
      </section>

      <TransportView transports={allTransports} cities={cities} />

      <FlightChecklist />
    </div>
  );
}
