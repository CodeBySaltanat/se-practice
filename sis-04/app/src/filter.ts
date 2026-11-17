import type { Room } from './rooms';

// F1: capacity >= attendees. F2: the room has ALL selected items (none selected = no equipment rule).
// Returns a new array; the rooms themselves are not changed.
export function filterRooms(rooms: Room[], criteria: { attendees: number; equipment: string[] }): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every((item) => room.equipment.includes(item)),
  );
}
