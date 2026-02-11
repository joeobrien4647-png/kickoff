import { db } from "@/lib/db";
import { logistics } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { now } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.select().from(logistics).where(eq(logistics.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const allowedFields = [
      "title",
      "category",
      "status",
      "priority",
      "dueDate",
      "confirmationRef",
      "url",
      "cost",
      "assignedTo",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(logistics).set(updates).where(eq(logistics.id, id)).run();

    const session = await getSession();
    logActivity("updated", "checklist", id, `${session?.travelerName || "Unknown"} updated a checklist item`, session?.travelerName || "Unknown");

    const updated = db.select().from(logistics).where(eq(logistics.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/checklist/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update checklist item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = db.select().from(logistics).where(eq(logistics.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    db.delete(logistics).where(eq(logistics.id, id)).run();

    const session = await getSession();
    logActivity("deleted", "checklist", id, `${session?.travelerName || "Unknown"} removed a checklist item`, session?.travelerName || "Unknown");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/checklist/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete checklist item" },
      { status: 500 }
    );
  }
}
