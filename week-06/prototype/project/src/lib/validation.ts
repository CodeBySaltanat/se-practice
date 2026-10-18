import { MINUTES_PER_DAY } from './timeUtils';
import type { Room } from './roomsData';

export type Decision =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export const MAX_BOOKING_MINUTES = 120;

export function overlapsExisting(start: number, end: number, room: Room): boolean {
  return room.bookings.some((b) => start < b.end && b.start < end);
}

export function evaluateAvailability(
  room: Room | null,
  start: number,
  end: number,
  currentTime: number,
): Decision {
  if (!room) {
    return { status: 'unavailable', reasons: ['Please select a room.'] };
  }

  const reasons: string[] = [];

  // AC1: 0 <= start < end <= 1440, start after current time
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
    if (start <= currentTime) {
      reasons.push('Start time must be after the current time.');
    }
  }

  // AC2: booking longer than 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push(`Booking cannot exceed ${MAX_BOOKING_MINUTES} minutes.`);
  }

  // AC3: room blocked
  if (room.blocked) {
    reasons.push(room.blockedReason ? `Room is blocked: ${room.blockedReason}` : 'Room is blocked.');
  }

  // AC4: overlap (touching endpoints allowed) — only check when interval itself is valid
  if (start < end && start >= 0 && end <= MINUTES_PER_DAY) {
    if (overlapsExisting(start, end, room)) {
      reasons.push('The requested interval overlaps an existing booking.');
    }
  }

  return reasons.length === 0
    ? { status: 'available' }
    : { status: 'unavailable', reasons };
}
