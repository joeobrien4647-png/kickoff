import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decisions } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { logActivity } from "@/lib/activity";
import { asc, eq, count } from "drizzle-orm";

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

  // Route: create new decision (has question + options array)
  if (body.question && body.options) {
    return handleCreate(body, session.travelerName);
  }

  // Route: vote on existing decision (has decisionId + optionText)
  if (body.decisionId && body.optionText) {
    return handleVote(body.decisionId, body.optionText, session.travelerName);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

type DecisionCategory = "route" | "transport" | "accommodation" | "activity" | "budget";

function handleCreate(
  body: { question: string; description?: string; category: string; options: string[] },
  actor: string
) {
  const { question, description, category, options } = body;

  if (!question?.trim() || !category || !options || options.length < 2) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const validCategories: DecisionCategory[] = ["route", "transport", "accommodation", "activity", "budget"];
  if (!validCategories.includes(category as DecisionCategory)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const typedCategory = category as DecisionCategory;

  // Determine next sort order
  const result = db
    .select({ total: count() })
    .from(decisions)
    .get();
  const sortOrder = (result?.total ?? 0) + 1;

  const id = generateId();
  const optionsJson = JSON.stringify(
    options.map((text: string) => ({ text: text.trim(), votes: [] }))
  );
  const timestamp = now();

  db.insert(decisions)
    .values({
      id,
      question: question.trim(),
      description: description?.trim() || null,
      category: typedCategory,
      options: optionsJson,
      status: "open",
      sortOrder,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .run();

  logActivity(
    "created",
    "decision",
    id,
    `Created decision: ${question.trim()}`,
    actor
  );

  return NextResponse.json({ ok: true, id });
}

function handleVote(decisionId: string, optionText: string, voterName: string) {
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
