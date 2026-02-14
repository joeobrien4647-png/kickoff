import { db } from "@/lib/db";
import { fuelLogs } from "@/lib/schema";
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
      .from(fuelLogs)
      .where(eq(fuelLogs.id, id))
      .get();
    if (!existing) {
      return NextResponse.json(
        { error: "Fuel log not found" },
        { status: 404 }
      );
    }

    db.delete(fuelLogs).where(eq(fuelLogs.id, id)).run();

    const session = await getSession();
    const actor = session?.travelerName || "Unknown";
    logActivity(
      "deleted",
      "fuel_log",
      id,
      `${actor} deleted a fuel log`,
      actor
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/fuel-logs/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete fuel log" },
      { status: 500 }
    );
  }
}
