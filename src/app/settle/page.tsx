import { SettlementWizard } from "@/components/budget/settlement-wizard";

export default function SettlePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Final Settlement</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Work out who owes whom and settle up.
        </p>
      </section>
      <SettlementWizard />
    </div>
  );
}
