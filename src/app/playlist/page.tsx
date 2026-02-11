import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PlaylistView } from "@/components/playlist/playlist-view";

export default async function PlaylistPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Road Trip Playlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Songs for the journey
        </p>
      </section>
      <PlaylistView />
    </div>
  );
}
