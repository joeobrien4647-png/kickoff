import { db } from "@/lib/db";
import { photos, stops } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { PhotosView } from "@/components/photos/photos-view";
import { asc, desc } from "drizzle-orm";

export default async function PhotosPage() {
  const session = await getSession();

  const allPhotos = db
    .select()
    .from(photos)
    .orderBy(desc(photos.createdAt))
    .all();
  const allStops = db
    .select()
    .from(stops)
    .orderBy(asc(stops.sortOrder))
    .all();

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Photo Diary</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Capture memories from the road trip.
        </p>
      </section>
      <PhotosView
        photos={allPhotos}
        stops={allStops}
        currentUser={session?.travelerName ?? null}
      />
    </div>
  );
}
