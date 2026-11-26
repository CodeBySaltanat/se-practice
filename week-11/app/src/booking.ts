// The booking rule (AC1–AC5), in one place. Pure: no clock, no I/O, and it never changes its
// inputs. src/lib/validation.ts only adapts it to a Room for the page.
//
// Every rule is one row of RULES, in the order canBook has always applied them. Three views read
// the same table, so they cannot drift apart:
//   availabilityReason  -> the first failing rule's code, or 'available'
//   canBook             -> availabilityReason(...) === 'available'
//   unavailableReasons  -> every failing rule's message, for the page
import { MINUTES_PER_DAY } from '@/lib/timeUtils';

export type Interval = { start: number; end: number };

export const MAX_BOOKING_MINUTES = 120;

export const REASON_CODES = [
  'invalid_time',
  'past_time',
  'too_long',
  'room_blocked',
  'overlap',
  'available',
] as const;

export type ReasonCode = (typeof REASON_CODES)[number];

export type BookingRequest = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: readonly Interval[];
};

export function isValidInterval(b: Interval): boolean {
  return Number.isFinite(b.start) && Number.isFinite(b.end) && b.start < b.end;
}

// Touching endpoints do not overlap.
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

type Rule = {
  code: Exclude<ReasonCode, 'available'>;
  fails: (r: BookingRequest) => boolean;
  message: (r: BookingRequest) => string;
};

const hasTimes = (r: BookingRequest) => Number.isFinite(r.start) && Number.isFinite(r.end);

const RULES: readonly Rule[] = [
  // AC1
  {
    code: 'invalid_time',
    fails: (r) => !hasTimes(r),
    message: () => 'Start and end times are required.',
  },
  {
    code: 'invalid_time',
    fails: (r) => hasTimes(r) && (r.start < 0 || r.start >= MINUTES_PER_DAY),
    message: () => 'Start time must be between 00:00 and 23:59.',
  },
  {
    code: 'invalid_time',
    fails: (r) => hasTimes(r) && (r.end < 0 || r.end > MINUTES_PER_DAY),
    message: () => 'End time must be between 00:00 and 24:00.',
  },
  {
    code: 'invalid_time',
    fails: (r) => hasTimes(r) && r.start >= r.end,
    message: () => 'Start time must be earlier than end time.',
  },
  {
    code: 'past_time',
    fails: (r) => hasTimes(r) && !(r.start > r.now),
    message: () => 'Start time must be after the current time.',
  },
  // AC2
  {
    code: 'too_long',
    fails: (r) => r.end - r.start > MAX_BOOKING_MINUTES,
    message: () => `Booking cannot exceed ${MAX_BOOKING_MINUTES} minutes.`,
  },
  // AC3
  {
    code: 'room_blocked',
    fails: (r) => r.blocked,
    message: (r) => (r.blockedReason ? `Room is blocked: ${r.blockedReason}` : 'Room is blocked.'),
  },
  // AC4: a malformed booking makes the schedule untrustworthy, so refuse instead of guessing.
  // There is no seventh code; 'overlap' is the honest one here: an overlap cannot be ruled out.
  {
    code: 'overlap',
    fails: (r) => !r.bookings.every(isValidInterval),
    message: () => 'The room schedule contains an invalid booking.',
  },
  {
    code: 'overlap',
    fails: (r) =>
      r.bookings.every(isValidInterval) &&
      r.start < r.end &&
      r.start >= 0 &&
      r.end <= MINUTES_PER_DAY &&
      r.bookings.some((b) => overlaps({ start: r.start, end: r.end }, b)),
    message: () => 'The requested interval overlaps an existing booking.',
  },
];

// The deterministic reason for the decision: the first rule that fails, in canBook's order.
export function availabilityReason(request: BookingRequest): ReasonCode {
  return RULES.find((rule) => rule.fails(request))?.code ?? 'available';
}

// Every reason the request is refused, in display order; an empty list means Available.
export function unavailableReasons(request: BookingRequest): string[] {
  return RULES.filter((rule) => rule.fails(request)).map((rule) => rule.message(request));
}

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  return availabilityReason({ start, end, now, blocked, bookings }) === 'available';
}
