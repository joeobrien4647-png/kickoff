import { db } from "@/lib/db";
import { itineraryItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db
      .select()
      .from(itineraryItems)
      .where(eq(itineraryItems.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Itinerary item not found" },
        { status: 404 }
      );
    }

    const updated = db
      .update(itineraryItems)
      .set({
        ...body,
        cost: body.cost !== undefined ? (body.cost ? Number(body.cost) : null) : undefined,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(itineraryItems.id, id))
      .returning()
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PATCH /api/itinerary/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update itinerary item" },
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

    const existing = db
      .select()
      .from(itineraryItems)
      .where(eq(itineraryItems.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Itinerary item not found" },
        { status: 404 }
      );
    }

    db.delete(itineraryItems).where(eq(itineraryItems.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/itinerary/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete itinerary item" },
      { status: 500 }
    );
  }
}
