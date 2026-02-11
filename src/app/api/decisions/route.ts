import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decisions } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { now } from "@/lib/dates";
import { logActivity } from "@/lib/activity";
import { asc, eq } from "drizzle-orm";

export function GET() {
  const all = db
    .select()
    .from(decisions)
    .orderBy(asc(decisions.sortOrder))
    .all();
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { decisionId, optionText } = body;

  // Find the decision
  const decision = db
    .select()
    .from(decisions)
    .where(eq(decisions.id, decisionId))
    .get();
  if (!decision)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Parse options, toggle vote
  const options = JSON.parse(decision.options) as {
    text: string;
    votes: string[];
  }[];
  const voterName = session.travelerName;

  for (const opt of options) {
    // Remove voter from all options first (switch vote)
    opt.votes = opt.votes.filter((v) => v !== voterName);
  }

  // Add vote to selected option
  const target = options.find((o) => o.text === optionText);
  if (target) {
    target.votes.push(voterName);
  }

  // Update in DB
  db.update(decisions)
    .set({ options: JSON.stringify(options), updatedAt: now() })
    .where(eq(decisions.id, decisionId))
    .run();

  logActivity(
    "voted",
    "decision",
    decisionId,
    `Voted "${optionText}" on: ${decision.question}`,
    voterName
  );

  return NextResponse.json({ ok: true });
}
