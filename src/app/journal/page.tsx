import { db } from "@/lib/db";
import { stops, journalEntries } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JournalView } from "@/components/journal/journal-view";
import { asc, desc } from "drizzle-orm";
import { BookOpen } from "lucide-react";

export default async function JournalPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allStops = db.select().from(stops).orderBy(asc(stops.sortOrder)).all();
  const allEntries = db
    .select()
    .from(journalEntries)
    .orderBy(desc(journalEntries.date))
    .all();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="size-6 text-wc-gold" />
          Trip Journal
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          End-of-day recaps — the highlights, the food, and the moments that
          made us laugh.
        </p>
      </section>

      <JournalView
        entries={allEntries}
        stops={allStops}
        currentUser={session.travelerName}
      />
    </div>
  );
}
