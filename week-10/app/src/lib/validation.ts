import type { Room } from './roomsData';
import { overlaps, unavailableReasons } from '@/booking';

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
