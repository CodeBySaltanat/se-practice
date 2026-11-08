// The booking decision, extracted from src/lib/validation.ts (Practice #07, Task 1).
// Same conditions as the page used before; it only answers true (Available) or false (Unavailable).

export type Interval = { start: number; end: number };

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}): boolean {
  if (!(Number.isFinite(start) && Number.isFinite(end))) return false;
  if (start < 0 || start >= 1440) return false;
  if (end < 0 || end > 1440) return false;
  if (start >= end) return false;
  if (start <= now) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  if (bookings.some((b) => start < b.end && b.start < end)) return false;
  return true;
}
