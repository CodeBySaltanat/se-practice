# Smart Campus Room Availability Checker (SIS #04)

A React + TypeScript page: filter a fictional room catalog by attendees and equipment, pick a room,
and check whether a time slot is available. Fictional data only, a fixed demo time (09:00).

## Setup

```
npm install
```

## Run

```
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Test

```
npx vitest run
```

## Where things are

- `src/rooms.ts` - the `Room` type, `EQUIPMENT` and `ROOMS` (data only)
- `src/filter.ts` - `filterRooms` (F1 capacity, F2 all selected equipment)
- `src/booking.ts` - `canBook` (AC1-AC5), `checkRoom` (the chosen room), `unavailableReasons` (text only)
- `src/components/` - the page: `RoomChecker`, `FilterPanel`, `Timeline`; no rules of their own
- `src/*.test.ts` - the Vitest tests
