import { EmergencyView } from "@/components/emergency/emergency-view";
import { CityQuickRef } from "@/components/city-quick-ref";

export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <EmergencyView />

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Offline-friendly city quick reference cards */}
      <CityQuickRef />
    </div>
  );
}
