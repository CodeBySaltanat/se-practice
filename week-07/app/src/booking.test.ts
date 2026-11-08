// Tests for the booking decision used by the page.
// Covers AC1–AC5 via the reviewed case table (T01–T14, AC5, X1, X2).
// AC6 (layout / validation feedback) is UI-level and is NOT covered here.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canBook, type Interval } from './booking';

type BookingInput = Parameters<typeof canBook>[0];

// Fixed time: the decision must depend only on the supplied `now` (540 = 09:00).
// The system clock is frozen to an unrelated moment so any hidden use of
// Date.now() / new Date() would produce a different result and be noticed.
const FIXED_SYSTEM_TIME = new Date('2026-01-01T23:30:00Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_SYSTEM_TIME);
});

afterEach(() => {
  vi.useRealTimers();
});

// Fresh fixture per call: new object and new booking objects every time,
// so no test can leak state into another.
function makeInput(overrides: Partial<BookingInput> = {}): BookingInput {
  const defaults: BookingInput = {
    start: 0,
    end: 0,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  };
  const merged = { ...defaults, ...overrides };
  return {
    ...merged,
    bookings: merged.bookings.map((b) => ({ ...b })),
  };
}

// Calls canBook and asserts the booking data is untouched:
// same array, same element objects, same values.
function decideAndCheckUnchanged(input: BookingInput): boolean {
  const bookingsRef = input.bookings;
  const elementRefs = [...input.bookings];
  const before: Interval[] = structuredClone(input.bookings);

  const result = canBook(input);

  expect(input.bookings).toBe(bookingsRef);
  expect(input.bookings).toHaveLength(before.length);
  input.bookings.forEach((b, i) => expect(b).toBe(elementRefs[i]));
  expect(input.bookings).toStrictEqual(before);

  return result;
}

type Row = {
  id: string;
  label: string;
  ac: string;
  input: Partial<BookingInput>;
  expected: boolean;
};

const rows: Row[] = [
  { id: 'T01', label: '660–720 touching after', ac: 'AC4', input: { start: 660, end: 720 }, expected: true },
  { id: 'T02', label: '540–570 starts now', ac: 'AC1', input: { start: 540, end: 570 }, expected: false },
  { id: 'T03', label: '720–720 zero duration', ac: 'AC1', input: { start: 720, end: 720 }, expected: false },
  { id: 'T04', label: '750–720 reversed', ac: 'AC1', input: { start: 750, end: 720 }, expected: false },
  { id: 'T05', label: '1380–1441 past day end', ac: 'AC1', input: { start: 1380, end: 1441 }, expected: false },
  { id: 'T06', label: '720–840 exactly 120 minutes', ac: 'AC2', input: { start: 720, end: 840 }, expected: true },
  { id: 'T07', label: '720–841 121 minutes', ac: 'AC2', input: { start: 720, end: 841 }, expected: false },
  { id: 'T08', label: '570–600 touching before', ac: 'AC4', input: { start: 570, end: 600 }, expected: true },
  { id: 'T09', label: '630–690 partial overlap', ac: 'AC4', input: { start: 630, end: 690 }, expected: false },
  { id: 'T10', label: '570–690 contains booking', ac: 'AC4', input: { start: 570, end: 690 }, expected: false },
  { id: 'T11', label: '615–645 inside booking', ac: 'AC4', input: { start: 615, end: 645 }, expected: false },
  { id: 'T12', label: '600–660 identical interval', ac: 'AC4', input: { start: 600, end: 660 }, expected: false },
  { id: 'T13', label: '660–720 room blocked', ac: 'AC3', input: { start: 660, end: 720, blocked: true }, expected: false },
  { id: 'T14', label: '630–690 no bookings', ac: 'AC4', input: { start: 630, end: 690, bookings: [] }, expected: true },
  { id: 'X1', label: '1380–1440 ends exactly at 24:00, no bookings', ac: 'AC1', input: { start: 1380, end: 1440, bookings: [] }, expected: true },
  {
    id: 'X2',
    label: '720–780 overlaps second of two bookings',
    ac: 'AC4',
    input: { start: 720, end: 780, bookings: [{ start: 600, end: 660 }, { start: 700, end: 760 }] },
    expected: false,
  },
];

describe('canBook — reviewed case table', () => {
  it.each(rows)('$id ($ac): $label → $expected', ({ input, expected }) => {
    // Every row also checks that the booking data is unchanged (AC5).
    expect(decideAndCheckUnchanged(makeInput(input))).toBe(expected);
  });
});

describe('canBook — AC5: decision without changing booking data', () => {
  it('AC5: an Available request returns true and leaves bookings equal to before', () => {
    const input = makeInput({ start: 660, end: 720 });
    const before = structuredClone(input.bookings);

    const result = canBook(input);

    expect(result).toBe(true);
    expect(input.bookings).toStrictEqual(before);
    expect(input.bookings).toStrictEqual([{ start: 600, end: 660 }]);
  });

  it('AC5: an Unavailable request returns false and leaves bookings equal to before', () => {
    const input = makeInput({ start: 630, end: 690 });
    const before = structuredClone(input.bookings);

    const result = canBook(input);

    expect(result).toBe(false);
    expect(input.bookings).toStrictEqual(before);
  });

  it('AC5: repeated calls give the same decision (no hidden state)', () => {
    const input = makeInput({ start: 660, end: 720 });
    expect(canBook(input)).toBe(true);
    expect(canBook(input)).toBe(true);
    expect(input.bookings).toStrictEqual([{ start: 600, end: 660 }]);
  });
});
