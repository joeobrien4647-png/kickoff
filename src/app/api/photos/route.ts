import { db } from "@/lib/db";
import { photos } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";
import { logActivity } from "@/lib/activity";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allPhotos = db
      .select()
      .from(photos)
      .orderBy(desc(photos.createdAt))
      .all();

    // Return metadata only (no data blob) for listing
    const listing = allPhotos.map(({ data, ...rest }) => ({
      ...rest,
      hasImage: true,
    }));

    return NextResponse.json(listing);
  } catch (error) {
    console.error("[API] GET /api/photos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { stopId, caption, data: imageData, takenDate } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data required" },
        { status: 400 }
      );
    }

    const id = generateId();
    db.insert(photos)
      .values({
        id,
        stopId: stopId || null,
        caption: caption || null,
        data: imageData,
        takenDate: takenDate || null,
        addedBy: session.travelerName,
        createdAt: now(),
      })
      .run();

    logActivity(
      "created",
      "photo",
      id,
      `${session.travelerName} added a photo${caption ? `: ${caption}` : ""}`,
      session.travelerName
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/photos error:", error);
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 }
    );
  }
}
