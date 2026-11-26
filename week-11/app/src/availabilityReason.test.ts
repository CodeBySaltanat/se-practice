// availabilityReason: the deterministic reason code behind canBook (lab section 3.1).
// Same fixture style as booking.test.ts: fixed now 09:00, one booking 10:00-11:00, fresh per test.
import { describe, expect, test } from 'vitest';
import { availabilityReason, canBook, unavailableReasons, REASON_CODES, type Interval, type ReasonCode } from './booking';

const NOW = 540; // 09:00

function input(start: number, end: number, extra: { blocked?: boolean; bookings?: Interval[]; now?: number } = {}) {
  const bookings = (extra.bookings ?? [{ start: 600, end: 660 }]).map((b) => ({ ...b }));
  return { start, end, now: extra.now ?? NOW, blocked: extra.blocked ?? false, bookings };
}

describe('availabilityReason - one code per rule', () => {
  test('the six codes are spelled exactly as the contract says', () => {
    expect([...REASON_CODES]).toEqual(['invalid_time', 'past_time', 'too_long', 'room_blocked', 'overlap', 'available']);
  });
  type Extra = { blocked?: boolean; bookings?: Interval[] };
  test('every row: availabilityReason returns the expected code', () => {
    for (const [code, start, end, extra] of ([
    ['available', 660, 720, {}],
    ['invalid_time', 750, 720, {}], // reversed
    ['invalid_time', 720, 720, {}], // zero length
    ['invalid_time', 1380, 1441, {}], // past the end of the day
    ['invalid_time', NaN, 720, {}], // missing
    ['past_time', 540, 570, {}], // starts exactly now
    ['past_time', 480, 510, {}], // starts before now
    ['too_long', 720, 841, {}], // 121 minutes
    ['room_blocked', 660, 720, { blocked: true }],
    ['overlap', 630, 690, {}],
    ['overlap', 620, 680, { bookings: [{ start: 700, end: 600 }] }], // malformed schedule (R2)
  ] as [ReasonCode, number, number, Extra][])) {
    expect(availabilityReason(input(start, end, extra))).toBe(code);
  }
  });
  test('touching endpoints stay available (AC4)', () => {
    expect(availabilityReason(input(570, 600))).toBe('available');
    expect(availabilityReason(input(660, 720))).toBe('available');
  });
  test('120 minutes exactly is available (AC2)', () => {
    expect(availabilityReason(input(720, 840))).toBe('available');
  });
});

describe('availabilityReason - first failing rule wins, in canBook order', () => {
  test('invalid_time before past_time: 500-480 is reversed and in the past', () => {
    expect(availabilityReason(input(500, 480))).toBe('invalid_time');
  });
  test('past_time before too_long: 480-700 is past and 220 minutes', () => {
    expect(availabilityReason(input(480, 700))).toBe('past_time');
  });
  test('too_long before room_blocked', () => {
    expect(availabilityReason(input(720, 900, { blocked: true }))).toBe('too_long');
  });
  test('room_blocked before overlap', () => {
    expect(availabilityReason(input(630, 690, { blocked: true }))).toBe('room_blocked');
  });
});

describe('availabilityReason - agrees with canBook and the page messages (F1)', () => {
  const times = [NaN, -1, 0, 539, 540, 541, 570, 600, 601, 630, 659, 660, 700, 720, 840, 841, 1439, 1440, 1441];
  const schedules: Interval[][] = [[], [{ start: 600, end: 660 }], [{ start: 600, end: 660 }, { start: 700, end: 760 }], [{ start: 700, end: 600 }]];
  test('for every request in the grid: canBook === (code is available) === (no messages)', () => {
    for (const start of times)
      for (const end of times)
        for (const blocked of [false, true])
          for (const bookings of schedules) {
            const req = input(start, end, { blocked, bookings });
            const code = availabilityReason(req);
            expect(canBook(req)).toBe(code === 'available');
            expect(unavailableReasons(req).length === 0).toBe(code === 'available');
          }
  });
  test('availabilityReason does not change the bookings (AC5)', () => {
    const bookings: Interval[] = [{ start: 600, end: 660 }];
    bookings.forEach((b) => Object.freeze(b));
    Object.freeze(bookings);
    expect(availabilityReason({ start: 630, end: 690, now: NOW, blocked: false, bookings })).toBe('overlap');
    expect(bookings).toEqual([{ start: 600, end: 660 }]);
  });
});
