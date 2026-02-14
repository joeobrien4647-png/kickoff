import { db } from "@/lib/db";
import { quickPolls } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QuickPollsView } from "@/components/polls/quick-polls-view";

export default async function PollsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allPolls = db.select().from(quickPolls).all();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="pt-4 md:pt-6">
        <h1 className="text-2xl font-bold">Polls</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quick votes to settle debates and plan together.
        </p>
      </section>
      <QuickPollsView polls={allPolls} currentUser={session.travelerName} />
    </div>
  );
}
