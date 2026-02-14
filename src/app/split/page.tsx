import { SplitCalculator } from "@/components/split-calculator";
import { PriceIndexCard } from "@/components/price-index-card";

export default function SplitPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Split & Tip</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Calculate tips and split bills — essential for Brits in America.
        </p>
      </section>
      <SplitCalculator />
      <PriceIndexCard />
    </div>
  );
}
