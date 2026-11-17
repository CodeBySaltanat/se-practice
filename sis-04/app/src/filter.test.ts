// filterRooms: F1, F2, F4 and the capacity boundaries B5, B6.
// A fixed catalog inside the test, not the page's ROOMS. Expected values come from the rules.
import { describe, expect, test } from 'vitest';
import { filterRooms } from './filter';
import type { Room } from './rooms';

function catalog(): Room[] {
  return [
    { id: 'a', name: 'A', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'b', name: 'B', capacity: 12, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'c', name: 'C', capacity: 20, equipment: ['projector'], blocked: true, bookings: [] },
  ];
}
const ids = (rooms: Room[]) => rooms.map((r) => r.id);

describe('filterRooms', () => {
  test('F1: 10 attendees keeps only rooms with capacity >= 10', () => {
    expect(ids(filterRooms(catalog(), { attendees: 10, equipment: [] }))).toEqual(['b', 'c']);
  });
  test('B5 F1: capacity exactly equal to attendees (8 for 8) is included', () => {
    expect(ids(filterRooms(catalog(), { attendees: 8, equipment: [] }))).toEqual(['a', 'b', 'c']);
  });
  test('B6 F1: capacity one below attendees (8 for 9) is excluded', () => {
    expect(ids(filterRooms(catalog(), { attendees: 9, equipment: [] }))).toEqual(['b', 'c']);
  });
  test('F2: projector AND whiteboard keeps only the room that has both', () => {
    expect(ids(filterRooms(catalog(), { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['a']);
  });
  test('F2: a room with only one of the two selected items is excluded', () => {
    expect(ids(filterRooms(catalog(), { attendees: 1, equipment: ['whiteboard', 'projector'] }))).not.toContain('b');
  });
  test('F4: no room matches 25 attendees with a whiteboard - an empty list', () => {
    expect(filterRooms(catalog(), { attendees: 25, equipment: ['whiteboard'] })).toEqual([]);
  });
  test('F1 F2: filtering does not change the catalog', () => {
    const rooms = catalog();
    const before = structuredClone(rooms);
    filterRooms(rooms, { attendees: 10, equipment: ['projector'] });
    expect(rooms).toEqual(before);
  });
});
