import type { Room } from './roomsData';
import { availabilityReason, canBook, overlaps, unavailableReasons } from '@/booking';
import type { ExplainInput } from '@/explain';
import { minutesToHHMM } from './timeUtils';

export { MAX_BOOKING_MINUTES } from '@/booking';

export type Decision =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export function overlapsExisting(start: number, end: number, room: Room): boolean {
  return room.bookings.some((b) => overlaps({ start, end }, b));
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

  const reasons = unavailableReasons({
    start,
    end,
    now: currentTime,
    blocked: room.blocked,
    blockedReason: room.blockedReason,
    bookings: room.bookings,
  });

  return reasons.length === 0
    ? { status: 'available' }
    : { status: 'unavailable', reasons };
}

// The explanation contract's input, built only from the deterministic rules: isAvailable from
// canBook and reasonCode from availabilityReason. Only the room's display name goes in; booking
// details (who booked, what for) never reach the explainer. Null when the times cannot be shown
// as "HH:MM" (nothing to explain yet).
export function explanationInputFor(
  room: Room,
  start: number,
  end: number,
  currentTime: number,
): ExplainInput | null {
  const startHHMM = minutesToHHMM(start);
  const endHHMM = minutesToHHMM(end);
  if (startHHMM === null || endHHMM === null) return null;

  const request = { start, end, now: currentTime, blocked: room.blocked, bookings: room.bookings };
  return {
    roomLabel: room.name,
    start: startHHMM,
    end: endHHMM,
    isAvailable: canBook(request),
    reasonCode: availabilityReason(request),
  };
}
