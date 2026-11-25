// The booking rule (AC1–AC5), in one place. Pure: no clock, no I/O, and it never changes its
// inputs. src/lib/validation.ts only adapts it to a Room for the page.
import { MINUTES_PER_DAY } from '@/lib/timeUtils';

export type Interval = { start: number; end: number };

export const MAX_BOOKING_MINUTES = 120;

export function isValidInterval(b: Interval): boolean {
  return Number.isFinite(b.start) && Number.isFinite(b.end) && b.start < b.end;
}

// Touching endpoints do not overlap.
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

// Every reason the request is refused, in display order; an empty list means Available.
export function unavailableReasons({ start, end, now, blocked, blockedReason, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: readonly Interval[];
}): string[] {
  const reasons: string[] = [];

  // AC1
  if (!(Number.isFinite(start) && Number.isFinite(end))) {
    reasons.push('Start and end times are required.');
  } else {
    if (start < 0 || start >= MINUTES_PER_DAY) {
      reasons.push('Start time must be between 00:00 and 23:59.');
    }
    if (end < 0 || end > MINUTES_PER_DAY) {
      reasons.push('End time must be between 00:00 and 24:00.');
    }
    if (start >= end) {
      reasons.push('Start time must be earlier than end time.');
    }
    if (!(start > now)) {
      reasons.push('Start time must be after the current time.');
    }
  }

  // AC2
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push(`Booking cannot exceed ${MAX_BOOKING_MINUTES} minutes.`);
  }

  // AC3
  if (blocked) {
    reasons.push(blockedReason ? `Room is blocked: ${blockedReason}` : 'Room is blocked.');
  }

  // AC4: a malformed booking makes the schedule untrustworthy, so refuse instead of guessing.
  if (!bookings.every(isValidInterval)) {
    reasons.push('The room schedule contains an invalid booking.');
  } else if (start < end && start >= 0 && end <= MINUTES_PER_DAY) {
    if (bookings.some((b) => overlaps({ start, end }, b))) {
      reasons.push('The requested interval overlaps an existing booking.');
    }
  }

  return reasons;
}

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  return unavailableReasons({ start, end, now, blocked, bookings }).length === 0;
}
