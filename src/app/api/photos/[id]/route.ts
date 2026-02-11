import { db } from "@/lib/db";
import { photos } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const photo = db.select().from(photos).where(eq(photos.id, id)).get();
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    db.delete(photos).where(eq(photos.id, id)).run();

    logActivity(
      "deleted",
      "photo",
      id,
      `${session.travelerName} deleted a photo${photo.caption ? `: ${photo.caption}` : ""}`,
      session.travelerName
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/photos/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
