import { TravelVault } from "@/components/travel-vault";

export default function VaultPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Travel Vault</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Keep all your important travel documents and numbers in one place.
        </p>
      </section>

      <TravelVault />
    </div>
  );
}
