import { db } from "@/lib/db";
import { tollLogs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = db
      .select()
      .from(tollLogs)
      .where(eq(tollLogs.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Toll log not found" },
        { status: 404 }
      );
    }

    db.delete(tollLogs).where(eq(tollLogs.id, id)).run();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    logActivity(
      "deleted",
      "toll_log",
      id,
      `${actor} deleted a toll log`,
      actor
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/toll-logs/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete toll log" },
      { status: 500 }
    );
  }
}
