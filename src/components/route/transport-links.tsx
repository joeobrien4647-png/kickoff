"use client";

import { Plane, TrainFront, Car, Smartphone } from "lucide-react";
import {
  googleFlightsUrl,
  amtrakUrl,
  kayakCarsUrl,
  uberUrl,
} from "@/lib/transport-links";

interface TransportLinksProps {
  fromCity: string;
  toCity: string;
  departDate: string;
}

const LINK_STYLES =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors";

export function TransportLinks({
  fromCity,
  toCity,
  departDate,
}: TransportLinksProps) {
  // For rental car, use departDate as pickup and a day later as dropoff
  const dropoff = nextDay(departDate);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
        Book:
      </span>

      <a
        href={googleFlightsUrl(fromCity, toCity, departDate)}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_STYLES}
      >
        <Plane className="size-3.5 text-wc-blue" />
        Flights
      </a>

      <a
        href={amtrakUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_STYLES}
      >
        <TrainFront className="size-3.5 text-wc-teal" />
        Amtrak
      </a>

      <a
        href={kayakCarsUrl(toCity, departDate, dropoff)}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_STYLES}
      >
        <Car className="size-3.5 text-wc-coral" />
        Rental Car
      </a>

      <a
        href={uberUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_STYLES}
      >
        <Smartphone className="size-3.5 text-wc-gold" />
        Uber
      </a>
    </div>
  );
}

/** Compute the next calendar day from a YYYY-MM-DD string */
function nextDay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
