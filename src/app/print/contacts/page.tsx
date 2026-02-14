import { db } from "@/lib/db";
import { travelers, stops, accommodations } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { EMERGENCY_INFO, GENERAL_INFO } from "@/lib/emergency-info";
import { PrintLayout } from "@/components/print/print-layout";

export default function PrintContactsPage() {
  const allTravelers = db.select().from(travelers).all();
  const allStops = db
    .select()
    .from(stops)
    .orderBy(asc(stops.sortOrder))
    .all();
  const allAccommodations = db.select().from(accommodations).all();

  return (
    <PrintLayout title="Emergency Contacts &amp; Addresses">
      <div className="space-y-8 print:space-y-6">
        {/* ── Travelers ────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-1 mb-3 print:border-black/20">
            Travelers
          </h2>
          {allTravelers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No travelers added yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {allTravelers.map((t) => (
                <li key={t.id} className="text-sm">
                  {t.emoji} {t.name}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Emergency Numbers ─────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-1 mb-3 print:border-black/20">
            Emergency Numbers
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="font-medium">US Emergency:</span> 911
            </li>
            <li>
              <span className="font-medium">UK FCO (Emergency Abroad):</span>{" "}
              {GENERAL_INFO.ukEmergencyAbroad}
            </li>
          </ul>
        </section>

        {/* ── City Emergency Contacts ──────────────────────── */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-1 mb-3 print:border-black/20">
            City Emergency Contacts
          </h2>
          <div className="space-y-4 print:space-y-3">
            {EMERGENCY_INFO.map((info) => (
              <div
                key={info.city}
                className="print:break-inside-avoid"
              >
                <h3 className="text-sm font-semibold mb-1">
                  {info.city}, {info.state}
                </h3>
                <ul className="space-y-0.5 text-sm text-muted-foreground print:text-black/70">
                  <li>
                    Police (non-emergency): {info.localPolice}
                  </li>
                  <li>
                    Hospital: {info.nearestHospital.name} &mdash;{" "}
                    {info.nearestHospital.phone}
                  </li>
                  <li>
                    Urgent Care: {info.urgentCare.name} &mdash;{" "}
                    {info.urgentCare.phone}
                  </li>
                  <li>
                    UK Consulate: {info.ukConsulate.name} &mdash;{" "}
                    {info.ukConsulate.phone}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Accommodation Addresses ──────────────────────── */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-1 mb-3 print:border-black/20">
            Accommodations
          </h2>
          {allStops.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No stops added yet.
            </p>
          ) : (
            <div className="space-y-4 print:space-y-3">
              {allStops.map((stop) => {
                const accs = allAccommodations.filter(
                  (a) => a.stopId === stop.id
                );
                return (
                  <div
                    key={stop.id}
                    className="print:break-inside-avoid"
                  >
                    <h3 className="text-sm font-semibold mb-1">
                      {stop.city}, {stop.state}
                      <span className="font-normal text-muted-foreground print:text-black/50 ml-2">
                        {stop.arriveDate} &mdash; {stop.departDate}
                      </span>
                    </h3>
                    {accs.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic print:text-black/40">
                        No accommodation booked
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {accs.map((acc) => (
                          <li
                            key={acc.id}
                            className="text-sm text-muted-foreground print:text-black/70"
                          >
                            <span className="font-medium text-foreground print:text-black">
                              {acc.name}
                            </span>{" "}
                            ({acc.type})
                            {acc.address && (
                              <>
                                <br />
                                {acc.address}
                              </>
                            )}
                            {acc.contact && (
                              <>
                                <br />
                                Contact: {acc.contact}
                              </>
                            )}
                            {acc.checkinTime && (
                              <>
                                {" "}
                                &middot; Check-in: {acc.checkinTime}
                              </>
                            )}
                            {acc.checkoutTime && (
                              <>
                                {" "}
                                &middot; Check-out: {acc.checkoutTime}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <footer className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground print:border-black/20 print:mt-6">
        <p>
          Generated from Kickoff &mdash; World Cup 2026 Trip Planner
        </p>
      </footer>
    </PrintLayout>
  );
}
