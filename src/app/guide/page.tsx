import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { CITY_PROFILES } from "@/lib/city-profiles";
import { GuideIndexView } from "@/components/guide/guide-index-view";
import { PriceIndexCard } from "@/components/price-index-card";
import { LaundromatFinder } from "@/components/service-finders/laundromat-finder";
import { LAUNDROMATS } from "@/lib/laundromats";
import { EssentialStoresFinder } from "@/components/service-finders/essential-stores";
import { ESSENTIAL_STORES } from "@/lib/essential-stores";
import { HappyHourFinder } from "@/components/guides/happy-hour-finder";
import { HAPPY_HOURS } from "@/lib/happy-hours";
import { TippingGuide } from "@/components/guides/tipping-guide";
import { DrivingRules } from "@/components/guides/driving-rules";
import { CultureGuideUK } from "@/components/guides/culture-guide-uk";
import { MobileGuide } from "@/components/guides/mobile-guide";

export default async function GuidePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();

  // Build city list in route order from the profiles data
  const SLUG_TO_KEY: Record<string, string> = {
    boston: "Boston",
    nyc: "New York",
    philadelphia: "Philadelphia",
    "washington-dc": "Washington DC",
    atlanta: "Atlanta",
    nashville: "Nashville",
    miami: "Miami",
  };

  const cities = Object.entries(SLUG_TO_KEY).map(([slug, key]) => ({
    slug,
    name: key,
    profile: CITY_PROFILES[key],
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">City Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Insider tips for every stop on the road trip &mdash; where to eat, what to see, and how to make match day unforgettable.
        </p>
      </section>
      <GuideIndexView cities={cities} stops={allStops} />

      <PriceIndexCard />

      <LaundromatFinder laundromats={LAUNDROMATS} />

      <EssentialStoresFinder stores={ESSENTIAL_STORES} />

      <HappyHourFinder spots={HAPPY_HOURS} />

      <TippingGuide />

      <DrivingRules />

      <CultureGuideUK />

      <MobileGuide />
    </div>
  );
}
