import type { Match, Stop } from "@/lib/schema";

// ============ TYPES ============

export interface CalendarEvent {
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  location?: string;
  description?: string;
}

// ============ CONVERTERS ============

export function matchesToCalendarEvents(rows: Match[]): CalendarEvent[] {
  return rows.map((m) => {
    const title = `${m.homeTeam} vs ${m.awayTeam}`;

    // If kickoff is set, match lasts ~2.5 hours
    let endTime: string | undefined;
    if (m.kickoff) {
      const [h, min] = m.kickoff.split(":").map(Number);
      const endMinutes = h * 60 + min + 150; // 2h30m
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;
      endTime = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
    }

    const descParts: string[] = [];
    if (m.round) descParts.push(`Round: ${m.round}`);
    if (m.groupName) descParts.push(`Group ${m.groupName}`);
    if (m.ticketStatus !== "none") descParts.push(`Tickets: ${m.ticketStatus}`);
    if (m.notes) descParts.push(m.notes);

    return {
      title,
      date: m.matchDate,
      startTime: m.kickoff ?? undefined,
      endTime,
      location: `${m.venue}, ${m.city}`,
      description: descParts.length > 0 ? descParts.join(" | ") : undefined,
    };
  });
}

export function stopsToCalendarEvents(rows: Stop[]): CalendarEvent[] {
  return rows.map((s) => {
    const nights = daysBetween(s.arriveDate, s.departDate);
    const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;

    return {
      title: `${s.name} (${nightLabel})`,
      date: s.arriveDate,
      location: `${s.city}, ${s.state}`,
      description: s.notes ?? undefined,
    };
  });
}

// ============ ICAL GENERATION ============

export function generateICalendar(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kickoff//World Cup 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Kickoff - World Cup 2026",
  ];

  for (const event of events) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid(event)}`);
    lines.push(`DTSTAMP:${formatTimestamp(new Date())}`);

    if (event.startTime) {
      lines.push(`DTSTART:${formatDateTime(event.date, event.startTime)}`);
      if (event.endTime) {
        lines.push(`DTEND:${formatDateTime(event.date, event.endTime)}`);
      }
    } else {
      // All-day event
      lines.push(`DTSTART;VALUE=DATE:${formatDateOnly(event.date)}`);
      lines.push(`DTEND;VALUE=DATE:${formatDateOnly(event.date, 1)}`);
    }

    lines.push(`SUMMARY:${escapeIcal(event.title)}`);

    if (event.location) {
      lines.push(`LOCATION:${escapeIcal(event.location)}`);
    }
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeIcal(event.description)}`);
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  // iCal spec requires CRLF line endings
  return lines.join("\r\n") + "\r\n";
}

// ============ HELPERS ============

/** Format YYYY-MM-DD as YYYYMMDD, optionally adding days */
function formatDateOnly(dateStr: string, addDays = 0): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + addDays);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/** Format date + time as YYYYMMDDTHHmmss */
function formatDateTime(dateStr: string, timeStr: string): string {
  const datePart = dateStr.replace(/-/g, "");
  const timePart = timeStr.replace(/:/g, "") + "00";
  return `${datePart}T${timePart}`;
}

/** Format a JS Date as a DTSTAMP value */
function formatTimestamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escape text for iCal property values */
function escapeIcal(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** Generate a deterministic UID for deduplication */
function uid(event: CalendarEvent): string {
  const slug = `${event.date}-${event.title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60);
  return `${slug}@kickoff.app`;
}

/** Count days between two YYYY-MM-DD strings */
function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T12:00:00Z");
  const db = new Date(b + "T12:00:00Z");
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}
