import { db } from "@/lib/db";
import { stops, notes } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { NotesView } from "@/components/notes/notes-view";
import { asc, desc } from "drizzle-orm";

export default async function NotesPage() {
  const session = await getSession();

  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();
  const allNotes = db
    .select()
    .from(notes)
    .orderBy(desc(notes.pinned), desc(notes.createdAt))
    .all();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Shared notes, reminders, and things to remember.
        </p>
      </section>

      <NotesView
        stops={allStops}
        notes={allNotes}
        currentUser={session?.travelerName ?? null}
      />
    </div>
  );
}
