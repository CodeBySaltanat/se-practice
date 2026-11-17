// The booking decision, extracted from src/lib/validation.ts (Practice #07, Task 1).
// Same conditions as the page used before; it only answers true (Available) or false (Unavailable).

export type Interval = { start: number; end: number };

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

// The availability check for one room of the catalog (F3, F5): the chosen room's own
// blocked status and bookings go into canBook. An unknown id is not available.
// Nothing is changed (AC5): canBook only reads its input.
export function checkRoom(
  rooms: { id: string; blocked: boolean; bookings: Interval[] }[],
  roomId: string,
  request: { start: number; end: number; now: number },
): boolean {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return false;
  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
}

// The 120-minute limit of AC2, named for the reason text. canBook keeps its own literal 120
// (it is not edited); the B1/B2 tests on both functions keep the two from drifting apart.
export const MAX_BOOKING_MINUTES = 120;

// Why a request is Unavailable, in words for the page (AC6). It does not decide anything:
// the verdict is always checkRoom/canBook. The overlap reason reuses canBook on one booking at a time.
export function unavailableReasons(
  room: { blocked: boolean; bookings: Interval[] },
  request: { start: number; end: number; now: number },
): string[] {
  const { start, end, now } = request;
  const reasons: string[] = [];
  if (!(0 <= start && start < end && end <= 1440)) reasons.push('The start time must be earlier than the end time, within the day.');
  else {
    if (!(start > now)) reasons.push('The start time must be after the current time.');
    if (end - start > MAX_BOOKING_MINUTES) reasons.push(`A booking cannot be longer than ${MAX_BOOKING_MINUTES} minutes.`);
    const clash = room.bookings.filter(
      (b) => !canBook({ start, end, now: start - 1, blocked: false, bookings: [b] }) && end - start <= MAX_BOOKING_MINUTES,
    );
    if (clash.length > 0) reasons.push('The time overlaps an existing booking of this room.');
  }
  if (room.blocked) reasons.push('This room is blocked.');
  return reasons;
}
