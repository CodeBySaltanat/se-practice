// Final suite for canBook (Practice #07).
// Started from the assistant's first suite (suites/first/) and its review; one test per case,
// the ID in every title, exact .toBe(true|false), fixed `now`, fresh fixture per test, no clock.
import { describe, expect, test } from 'vitest';
import { canBook, type Interval } from './booking';

const NOW = 540; // 09:00

// Fresh default fixture for every call: now 09:00, not blocked, one booking 10:00-11:00.
function input(start: number, end: number, extra: { blocked?: boolean; bookings?: Interval[] } = {}) {
  const bookings = (extra.bookings ?? [{ start: 600, end: 660 }]).map((b) => ({ ...b }));
  return { start, end, now: NOW, blocked: extra.blocked ?? false, bookings };
}

describe('canBook - the case plan T01-T14', () => {
  test('T01 AC4: 660-720 touching after the booking is allowed', () => {
    expect(canBook(input(660, 720))).toBe(true);
  });
  test('T02 AC1: 540-570 starts exactly now', () => {
    expect(canBook(input(540, 570))).toBe(false);
  });
  test('T03 AC1: 720-720 zero duration', () => {
    expect(canBook(input(720, 720))).toBe(false);
  });
  test('T04 AC1: 750-720 reversed', () => {
    expect(canBook(input(750, 720))).toBe(false);
  });
  test('T05 AC1: 1380-1441 past the end of the day', () => {
    expect(canBook(input(1380, 1441))).toBe(false);
  });
  test('T06 AC2: 720-840 exactly 120 minutes is allowed', () => {
    expect(canBook(input(720, 840))).toBe(true);
  });
  test('T07 AC2: 720-841 is 121 minutes', () => {
    expect(canBook(input(720, 841))).toBe(false);
  });
  test('T08 AC4: 570-600 touching before the booking is allowed', () => {
    expect(canBook(input(570, 600))).toBe(true);
  });
  test('T09 AC4: 630-690 partial overlap', () => {
    expect(canBook(input(630, 690))).toBe(false);
  });
  test('T10 AC4: 570-690 contains the booking', () => {
    expect(canBook(input(570, 690))).toBe(false);
  });
  test('T11 AC4: 615-645 inside the booking', () => {
    expect(canBook(input(615, 645))).toBe(false);
  });
  test('T12 AC4: 600-660 identical interval', () => {
    expect(canBook(input(600, 660))).toBe(false);
  });
  test('T13 AC3: 660-720 in a blocked room', () => {
    expect(canBook(input(660, 720, { blocked: true }))).toBe(false);
  });
  test('T14 AC4: 630-690 with no bookings', () => {
    expect(canBook(input(630, 690, { bookings: [] }))).toBe(true);
  });
});

describe('canBook - AC5 and my own cases', () => {
  test('AC5: an Available request leaves the bookings equal to before', () => {
    const req = input(660, 720);
    const before = structuredClone(req.bookings);
    expect(canBook(req)).toBe(true);
    expect(req.bookings).toEqual(before);
  });
  test('X1 AC1: 1380-1440 ends exactly at 24:00', () => {
    expect(canBook(input(1380, 1440, { bookings: [] }))).toBe(true);
  });
  test('X2 AC4: 720-780 overlaps the second of two bookings', () => {
    expect(canBook(input(720, 780, { bookings: [{ start: 600, end: 660 }, { start: 700, end: 760 }] }))).toBe(false);
  });
});

describe('canBook - added after the review (from the improvement answer)', () => {
  test('N01 AC1: 541-570 one minute after now is allowed', () => {
    expect(canBook(input(541, 570))).toBe(true);
  });
  test('N02 AC1: 480-510 starts before now', () => {
    expect(canBook(input(480, 510))).toBe(false);
  });
  test('N03 AC4: 659-720 one-minute overlap at the end of the booking', () => {
    expect(canBook(input(659, 720))).toBe(false);
  });
  test('N04 AC4: 570-601 one-minute overlap at the start of the booking', () => {
    expect(canBook(input(570, 601))).toBe(false);
  });
  test('N05 AC4: 630-690 overlaps the first of two bookings', () => {
    expect(canBook(input(630, 690, { bookings: [{ start: 600, end: 660 }, { start: 900, end: 960 }] }))).toBe(false);
  });
  test('N06 AC5: unsorted bookings stay in their order after an Available request', () => {
    const req = input(720, 780, { bookings: [{ start: 900, end: 960 }, { start: 600, end: 660 }] });
    const before = structuredClone(req.bookings);
    expect(canBook(req)).toBe(true);
    expect(req.bookings).toEqual(before);
  });
  test('N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)', () => {
    const bookings: Interval[] = [{ start: 600, end: 660 }];
    bookings.forEach((b) => Object.freeze(b));
    Object.freeze(bookings);
    expect(canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings })).toBe(true);
    expect(bookings).toEqual([{ start: 600, end: 660 }]);
  });
});
