import { db } from "@/lib/db";
import { packingItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
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

    const existing = db.select().from(packingItems).where(eq(packingItems.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const allowedFields = [
      "name",
      "category",
      "assignedTo",
      "checked",
      "quantity",
      "notes",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    db.update(packingItems).set(updates).where(eq(packingItems.id, id)).run();

    const session = await getSession();
    const actorName = session?.travelerName || "Unknown";
    if (body.checked !== undefined) {
      logActivity("updated", "packing", id, `${actorName} checked off a packing item`, actorName);
    } else {
      logActivity("updated", "packing", id, `${actorName} updated a packing item`, actorName);
    }

    const updated = db.select().from(packingItems).where(eq(packingItems.id, id)).get();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/packing/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update packing item" },
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

    const existing = db.select().from(packingItems).where(eq(packingItems.id, id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    db.delete(packingItems).where(eq(packingItems.id, id)).run();

    const session = await getSession();
    logActivity("deleted", "packing", id, `${session?.travelerName || "Unknown"} removed a packing item`, session?.travelerName || "Unknown");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/packing/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete packing item" },
      { status: 500 }
    );
  }
}
