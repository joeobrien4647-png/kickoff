import { db } from "@/lib/db";
import { tripSettings, travelers } from "@/lib/schema";
import { SettingsView } from "@/components/settings/settings-view";

export default function SettingsPage() {
  const trip = db.select().from(tripSettings).all()[0] ?? null;
  const allTravelers = db.select().from(travelers).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Appearance, trip info, and data export.
        </p>
      </section>
      <SettingsView trip={trip} travelers={allTravelers} />
    </div>
  );
}
