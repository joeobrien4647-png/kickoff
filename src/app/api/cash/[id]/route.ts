import { db } from "@/lib/db";
import { cashLogs } from "@/lib/schema";
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
      .from(cashLogs)
      .where(eq(cashLogs.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Cash log not found" },
        { status: 404 }
      );
    }

    db.delete(cashLogs).where(eq(cashLogs.id, id)).run();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    logActivity(
      "deleted",
      "cash_log",
      id,
      `${actor} deleted a cash log`,
      actor
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/cash/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete cash log" },
      { status: 500 }
    );
  }
}
