// checkRoom (F3, F5) and the integration of filterRooms with checkRoom (INT).
// A fixed catalog inside the test, not the page's ROOMS; now = 540 (09:00).
import { describe, expect, test } from 'vitest';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const NOW = 540;

function catalog(): Room[] {
  return [
    { id: 'a', name: 'A', capacity: 10, equipment: ['projector'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'b', name: 'B', capacity: 20, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'c', name: 'C', capacity: 30, equipment: ['projector', 'whiteboard'], blocked: true, bookings: [] },
  ];
}

describe('checkRoom', () => {
  test('F3 AC3: a blocked room with no bookings is not available', () => {
    expect(checkRoom(catalog(), 'c', { start: 600, end: 660, now: NOW })).toBe(false);
  });
  test('F5: the same times 600-660 are Unavailable in room a and Available in room b', () => {
    const rooms = catalog();
    expect(checkRoom(rooms, 'a', { start: 600, end: 660, now: NOW })).toBe(false);
    expect(checkRoom(rooms, 'b', { start: 600, end: 660, now: NOW })).toBe(true);
  });
  test('F5: an unknown room id is not available', () => {
    expect(checkRoom(catalog(), 'zzz', { start: 600, end: 660, now: NOW })).toBe(false);
  });
  test('B3 AC4: in room a, 660-720 only touches its booking 600-660 and is available', () => {
    expect(checkRoom(catalog(), 'a', { start: 660, end: 720, now: NOW })).toBe(true);
  });
  test('B4 AC4: in room a, 630-690 overlaps its booking 600-660 and is rejected', () => {
    expect(checkRoom(catalog(), 'a', { start: 630, end: 690, now: NOW })).toBe(false);
  });
  test('B1 AC2: in room b, exactly 120 minutes (720-840) is available', () => {
    expect(checkRoom(catalog(), 'b', { start: 720, end: 840, now: NOW })).toBe(true);
  });
  test('B2 AC2: in room b, 121 minutes (720-841) is rejected', () => {
    expect(checkRoom(catalog(), 'b', { start: 720, end: 841, now: NOW })).toBe(false);
  });
  test('AC1: in room b, 480-510 starts before now and is rejected', () => {
    expect(checkRoom(catalog(), 'b', { start: 480, end: 510, now: NOW })).toBe(false);
  });
  test('AC5: an Available check leaves every room and its bookings unchanged', () => {
    const rooms = catalog();
    const before = structuredClone(rooms);
    expect(checkRoom(rooms, 'a', { start: 660, end: 720, now: NOW })).toBe(true);
    expect(rooms).toEqual(before);
  });
});

describe('filterRooms then checkRoom', () => {
  test('INT F1 F2 F3: 15 people with projector and whiteboard leaves b and c; 600-660 is Available in b, not in blocked c', () => {
    const rooms = catalog();
    const shown = filterRooms(rooms, { attendees: 15, equipment: ['projector', 'whiteboard'] });
    expect(shown.map((r) => r.id)).toEqual(['b', 'c']);
    expect(checkRoom(rooms, shown[0].id, { start: 600, end: 660, now: NOW })).toBe(true);
    expect(checkRoom(rooms, shown[1].id, { start: 600, end: 660, now: NOW })).toBe(false);
  });
});
