import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { reservations, stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { ReservationsView } from "@/components/reservations/reservations-view";

export default async function ReservationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allReservations = db.select().from(reservations).all();
  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track restaurant bookings, tours, and activity reservations.
        </p>
      </section>
      <ReservationsView reservations={allReservations} stops={allStops} />
    </div>
  );
}
