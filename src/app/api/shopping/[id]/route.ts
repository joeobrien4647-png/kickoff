import { db } from "@/lib/db";
import { shoppingItems } from "@/lib/schema";
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

    const existing = db.select().from(shoppingItems).where(eq(shoppingItems.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const allowedFields = ["name", "category", "quantity", "checked", "stopId"] as const;

    const updates: Record<string, unknown> = { updatedAt: now() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(shoppingItems).set(updates).where(eq(shoppingItems.id, id)).run();

    const session = await getSession();
    const actorName = session?.travelerName || "Unknown";

    if (body.checked !== undefined) {
      const verb = body.checked ? "checked off" : "unchecked";
      logActivity("updated", "shopping", id, `${actorName} ${verb}: ${existing.name}`, actorName);
    } else {
      logActivity("updated", "shopping", id, `${actorName} updated shopping item: ${existing.name}`, actorName);
    }

    const updated = db.select().from(shoppingItems).where(eq(shoppingItems.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/shopping/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update shopping item" },
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

    const existing = db.select().from(shoppingItems).where(eq(shoppingItems.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    db.delete(shoppingItems).where(eq(shoppingItems.id, id)).run();

    const session = await getSession();
    logActivity(
      "deleted",
      "shopping",
      id,
      `${session?.travelerName || "Unknown"} removed shopping item: ${existing.name}`,
      session?.travelerName || "Unknown"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/shopping/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete shopping item" },
      { status: 500 }
    );
  }
}
