"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ReservationCard } from "@/components/reservations/reservation-card";
import { AddReservationForm } from "@/components/reservations/add-reservation-form";
import type { Reservation, Stop } from "@/lib/schema";

interface ReservationsViewProps {
  reservations: Reservation[];
  stops: Stop[];
}

export function ReservationsView({ reservations, stops }: ReservationsViewProps) {
  const router = useRouter();
  const [activeStop, setActiveStop] = useState("all");
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  // Filter by stop
  const filtered = useMemo(() => {
    const list = activeStop === "all"
      ? reservations
      : reservations.filter((r) => r.stopId === activeStop);

    // Sort: upcoming first (by date+time), cancelled at bottom
    return [...list].sort((a, b) => {
      // Cancelled items sink to the bottom
      if (a.status === "cancelled" && b.status !== "cancelled") return 1;
      if (b.status === "cancelled" && a.status !== "cancelled") return -1;

      // Sort by date, then time
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });
  }, [reservations, activeStop]);

  // Count per stop
  const countsPerStop = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of reservations) {
      if (r.stopId) {
        map.set(r.stopId, (map.get(r.stopId) || 0) + 1);
      }
    }
    return map;
  }, [reservations]);

  function handleMutate() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Stop tabs */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
        <Tabs value={activeStop} onValueChange={setActiveStop}>
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {reservations.length}
              </Badge>
            </TabsTrigger>
            {stops.map((stop) => (
              <TabsTrigger key={stop.id} value={stop.id}>
                {stop.city}
                {(countsPerStop.get(stop.id) || 0) > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[10px] px-1.5 py-0"
                  >
                    {countsPerStop.get(stop.id)}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Reservations list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No reservations yet.</p>
          <p className="text-xs mt-1">
            Tap the + button to add a booking.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onMutate={handleMutate}
              onEdit={setEditingReservation}
            />
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      <AddReservationForm
        stops={stops}
        defaultStopId={activeStop !== "all" ? activeStop : undefined}
        editingReservation={editingReservation}
        onClose={() => setEditingReservation(null)}
      />
    </div>
  );
}
