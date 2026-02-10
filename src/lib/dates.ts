const TRIP_START = "2026-06-11";
const TRIP_END = "2026-06-26";

export function now(): string {
  return new Date().toISOString();
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysUntilTrip(): number {
  const start = new Date(TRIP_START);
  const current = new Date(today());
  const diff = start.getTime() - current.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function dayOfTrip(): number | null {
  const current = today();
  if (current < TRIP_START || current > TRIP_END) return null;
  const start = new Date(TRIP_START);
  const now = new Date(current);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function tripDays(): string[] {
  const days: string[] = [];
  const start = new Date(TRIP_START);
  const end = new Date(TRIP_END);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export { TRIP_START, TRIP_END };
