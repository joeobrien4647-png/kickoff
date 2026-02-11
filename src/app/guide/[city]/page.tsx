import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { stops } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { CITY_PROFILES } from "@/lib/city-profiles";
import { CityProfileView } from "@/components/guide/city-profile-view";

const SLUG_TO_KEY: Record<string, string> = {
  boston: "Boston",
  nyc: "New York",
  philadelphia: "Philadelphia",
  "washington-dc": "Washington DC",
  atlanta: "Atlanta",
  miami: "Miami",
};

const SLUG_TO_STATE: Record<string, string> = {
  boston: "MA",
  nyc: "NY",
  philadelphia: "PA",
  "washington-dc": "DC",
  atlanta: "GA",
  miami: "FL",
};

export default async function CityGuidePage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { city: slug } = await params;
  const cityKey = SLUG_TO_KEY[slug];
  if (!cityKey) notFound();

  const profile = CITY_PROFILES[cityKey];
  if (!profile) notFound();

  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <CityProfileView
        cityName={cityKey}
        state={SLUG_TO_STATE[slug]}
        profile={profile}
        stops={allStops}
      />
    </div>
  );
}
