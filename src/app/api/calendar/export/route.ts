import { db } from "@/lib/db";
import { matches, itineraryItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateIcs, type IcsEvent } from "@/lib/ics-generator";
import { NextRequest, NextResponse } from "next/server";

// GET /api/calendar/export?type=matches|itinerary|attending|all
export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type") ?? "all";
    const events: IcsEvent[] = [];
    let filename = "kickoff-2026";

    // ---- Matches ----
    if (type === "matches" || type === "attending" || type === "all") {
      let rows;
      if (type === "attending") {
        rows = db
          .select()
          .from(matches)
          .where(eq(matches.attending, true))
          .all();
        filename = "kickoff-our-matches";
      } else {
        rows = db.select().from(matches).all();
        if (type === "matches") filename = "kickoff-matches";
      }

      for (const m of rows) {
        // Calculate end time: kickoff + 2h30m
        let endTime: string | undefined;
        if (m.kickoff) {
          const [h, min] = m.kickoff.split(":").map(Number);
          const totalMin = h * 60 + min + 150;
          const eh = Math.floor(totalMin / 60) % 24;
          const em = totalMin % 60;
          endTime = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
        }

        const descParts: string[] = [];
        if (m.round) descParts.push(`Round: ${m.round}`);
        if (m.groupName) descParts.push(`Group ${m.groupName}`);
        if (m.ticketStatus !== "none")
          descParts.push(`Tickets: ${m.ticketStatus}`);
        if (m.fanZone) descParts.push(`Fan Zone: ${m.fanZone}`);
        if (m.notes) descParts.push(m.notes);

        events.push({
          title: `\u26BD ${m.homeTeam} vs ${m.awayTeam}`,
          description: descParts.length > 0 ? descParts.join(" | ") : undefined,
          location: `${m.venue}, ${m.city}`,
          startDate: m.matchDate,
          startTime: m.kickoff ?? undefined,
          endTime,
          allDay: !m.kickoff,
          alarm: true, // 1-hour reminder for matches
        });
      }
    }

    // ---- Itinerary Items ----
    if (type === "itinerary" || type === "all") {
      const items = db.select().from(itineraryItems).all();
      if (type === "itinerary") filename = "kickoff-itinerary";

      for (const item of items) {
        const descParts: string[] = [];
        if (item.type) descParts.push(`Type: ${item.type}`);
        if (item.notes) descParts.push(item.notes);

        events.push({
          title: item.title,
          description:
            descParts.length > 0 ? descParts.join(" | ") : undefined,
          location: item.location ?? undefined,
          startDate: item.date,
          startTime: item.startTime ?? undefined,
          endTime: item.endTime ?? undefined,
          allDay: !item.startTime,
          alarm: false,
        });
      }
    }

    // Sort chronologically by date, then by start time
    events.sort((a, b) => {
      const dateCmp = a.startDate.localeCompare(b.startDate);
      if (dateCmp !== 0) return dateCmp;
      return (a.startTime ?? "").localeCompare(b.startTime ?? "");
    });

    const calendarName =
      type === "attending"
        ? "Kickoff - Our Matches"
        : type === "matches"
          ? "Kickoff - All Matches"
          : type === "itinerary"
            ? "Kickoff - Itinerary"
            : "Kickoff - World Cup 2026";

    const ics = generateIcs(events, calendarName);

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.ics"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[API] GET /api/calendar/export error:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar export" },
      { status: 500 }
    );
  }
}
