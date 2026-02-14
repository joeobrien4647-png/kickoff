// ============ ICS CALENDAR GENERATOR ============
// Generates valid iCalendar (.ics) files with VTIMEZONE support
// All timed events use America/New_York (US Eastern)

const TIMEZONE_ID = "America/New_York";
const PRODID = "-//Kickoff//World Cup 2026//EN";

// ============ TYPES ============

export type IcsEvent = {
  title: string;
  description?: string;
  location?: string;
  startDate: string; // ISO date "2026-06-14"
  startTime?: string; // "15:00" (US Eastern)
  endTime?: string; // "17:00"
  allDay?: boolean;
  alarm?: boolean; // Add a 1-hour reminder
};

// ============ PUBLIC API ============

/**
 * Generate a valid .ics file string from an array of events.
 * Uses America/New_York VTIMEZONE for all timed events.
 */
export function generateIcs(events: IcsEvent[], calendarName: string): string {
  const hasTimed = events.some((e) => e.startTime && !e.allDay);
  const stamp = formatTimestamp(new Date());

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    `X-WR-TIMEZONE:${TIMEZONE_ID}`,
  ];

  // Include VTIMEZONE block when any event has a specific time
  if (hasTimed) {
    lines.push(...vtimezoneBlock());
  }

  for (const event of events) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${generateUid(event)}`);
    lines.push(`DTSTAMP:${stamp}`);

    if (event.startTime && !event.allDay) {
      // Timed event — use TZID parameter
      lines.push(
        `DTSTART;TZID=${TIMEZONE_ID}:${formatLocalDateTime(event.startDate, event.startTime)}`
      );
      if (event.endTime) {
        lines.push(
          `DTEND;TZID=${TIMEZONE_ID}:${formatLocalDateTime(event.startDate, event.endTime)}`
        );
      }
    } else {
      // All-day event
      lines.push(`DTSTART;VALUE=DATE:${formatDateOnly(event.startDate)}`);
      lines.push(`DTEND;VALUE=DATE:${formatDateOnly(event.startDate, 1)}`);
    }

    lines.push(`SUMMARY:${escapeText(event.title)}`);

    if (event.location) {
      lines.push(`LOCATION:${escapeText(event.location)}`);
    }
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    }

    // 1-hour reminder alarm
    if (event.alarm && event.startTime && !event.allDay) {
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-PT1H");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:${escapeText(event.title)} starts in 1 hour`);
      lines.push("END:VALARM");
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  // iCal spec requires CRLF line endings
  return foldLines(lines).join("\r\n") + "\r\n";
}

/**
 * Trigger a browser download of the .ics content.
 */
export function downloadIcs(content: string, filename: string): void {
  const blob = new Blob([content], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// ============ VTIMEZONE ============

/**
 * US Eastern VTIMEZONE definition covering the 2026 World Cup period.
 * EDT: second Sunday in March to first Sunday in November.
 */
function vtimezoneBlock(): string[] {
  return [
    "BEGIN:VTIMEZONE",
    `TZID:${TIMEZONE_ID}`,
    "X-LIC-LOCATION:America/New_York",
    // Eastern Daylight Time (summer — covers the World Cup)
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0400",
    "TZNAME:EDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    // Eastern Standard Time (winter)
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0500",
    "TZNAME:EST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];
}

// ============ FORMATTING HELPERS ============

/** Format YYYY-MM-DD as YYYYMMDD, optionally adding days. */
function formatDateOnly(dateStr: string, addDays = 0): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + addDays);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/** Format date + time as YYYYMMDDTHHmmss (local, no trailing Z). */
function formatLocalDateTime(dateStr: string, timeStr: string): string {
  const datePart = dateStr.replace(/-/g, "");
  const timePart = timeStr.replace(/:/g, "") + "00";
  return `${datePart}T${timePart}`;
}

/** Format a JS Date as a UTC DTSTAMP value. */
function formatTimestamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escape text for iCal property values (RFC 5545 section 3.3.11). */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Fold lines longer than 75 octets (RFC 5545 section 3.1).
 * Continuation lines start with a single space.
 */
function foldLines(lines: string[]): string[] {
  const folded: string[] = [];
  for (const line of lines) {
    if (line.length <= 75) {
      folded.push(line);
    } else {
      folded.push(line.slice(0, 75));
      let rest = line.slice(75);
      while (rest.length > 0) {
        // 74 chars + leading space = 75 octets
        folded.push(" " + rest.slice(0, 74));
        rest = rest.slice(74);
      }
    }
  }
  return folded;
}

/** Generate a deterministic UID for deduplication across imports. */
function generateUid(event: IcsEvent): string {
  const slug = `${event.startDate}-${event.title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60);
  return `${slug}@kickoff.app`;
}
