export interface Booking {
  id: string;
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
  bookedBy: string;
  purpose: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Room 101',
    building: 'Engineering Block',
    capacity: 30,
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, bookedBy: 'Dr. Patel', purpose: 'CS101 Lecture' },
      { id: 'b2', start: 780, end: 870, bookedBy: 'Ms. Rivera', purpose: 'Workshop' },
    ],
  },
  {
    id: 'r2',
    name: 'Room 202',
    building: 'Science Wing',
    capacity: 20,
    blocked: false,
    bookings: [
      { id: 'b3', start: 600, end: 660, bookedBy: 'Prof. Lee', purpose: 'Lab Review' },
      { id: 'b4', start: 900, end: 960, bookedBy: 'Study Group A', purpose: 'Group Study' },
    ],
  },
  {
    id: 'r3',
    name: 'Room 303',
    building: 'Library Tower',
    capacity: 12,
    blocked: true,
    blockedReason: 'Under maintenance until 6:00 PM',
    bookings: [],
  },
  {
    id: 'r4',
    name: 'Room 404',
    building: 'Business Center',
    capacity: 40,
    blocked: false,
    bookings: [
      { id: 'b5', start: 720, end: 780, bookedBy: 'Mr. Chen', purpose: 'Seminar' },
    ],
  },
];
