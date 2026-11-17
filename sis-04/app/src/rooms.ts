// The room catalog: data only, no rules. Fictional rooms and bookings.
// Times are minutes after midnight (600 = 10:00).

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[];
};

// Every equipment name the catalog uses, so the page can offer exactly these as filters.
export const EQUIPMENT: string[] = ['projector', 'whiteboard', 'video-call', 'computers'];

export const ROOMS: Room[] = [
  {
    id: 'r101',
    name: 'Room 101',
    capacity: 30,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 540, end: 600 }, { start: 780, end: 870 }],
  },
  {
    id: 'r202',
    name: 'Room 202',
    capacity: 20,
    equipment: ['whiteboard', 'computers'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }, { start: 900, end: 960 }],
  },
  {
    id: 'r303',
    name: 'Room 303',
    capacity: 12,
    equipment: ['whiteboard'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'r404',
    name: 'Room 404',
    capacity: 40,
    equipment: ['projector', 'video-call'],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
  {
    id: 'r505',
    name: 'Room 505',
    capacity: 8,
    equipment: ['projector', 'whiteboard', 'video-call'],
    blocked: false,
    bookings: [],
  },
];
