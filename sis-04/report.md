# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude (claude.ai web) |
| Assistant model | Claude Opus 5.5 |
| Starting point | week-08 |
| Baseline commit | 78cb2c0 |
| Language (ts or js) | ts |
| Vitest version | 2.1.9 |
| Where I ran the tests | my computer (Windows 11, cmd, Node + npm) |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
C:\Users\sulta\se-practice\sis-04\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/sis-04/app

     ✓ T01 AC4: 660-720 touching after the bo
oking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the
 day
     ✓ T06 AC2: 720-840 exactly 120 minutes i
s allowed
     ✓ T07 AC2: 720-841 is 121 minutes
     ✓ T08 AC4: 570-600 touching before the b
ooking is allowed
     ✓ T09 AC4: 630-690 partial overlap
     ✓ T10 AC4: 570-690 contains the booking
     ✓ T11 AC4: 615-645 inside the booking
     ✓ T12 AC4: 600-660 identical interval
     ✓ T13 AC3: 660-720 in a blocked room
 ✓ src/booking.test.ts (26)
   ✓ canBook - the case plan T01-T14 (14)
     ✓ T01 AC4: 660-720 touching after the booking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the day
     ✓ T06 AC2: 720-840 exactly 120 minutes is allowed
     ✓ T07 AC2: 720-841 is 121 minutes
     ✓ T08 AC4: 570-600 touching before the booking is allowed
     ✓ T09 AC4: 630-690 partial overlap
     ✓ T10 AC4: 570-690 contains the booking
     ✓ T11 AC4: 615-645 inside the booking
     ✓ T12 AC4: 600-660 identical interval
     ✓ T13 AC3: 660-720 in a blocked room
     ✓ T14 AC4: 630-690 with no bookings
   ✓ canBook - AC5 and my own cases (3)
     ✓ AC5: an Available request leaves the bookings equal to before
     ✓ X1 AC1: 1380-1440 ends exactly at 24:00
     ✓ X2 AC4: 720-780 overlaps the second of two bookings
   ✓ canBook - added after the review (from the improvement answer) (7)
     ✓ N01 AC1: 541-570 one minute after now is allowed
     ✓ N02 AC1: 480-510 starts before now
     ✓ N03 AC4: 659-720 one-minute overlap at the end of the booking
     ✓ N04 AC4: 570-601 one-minute overlap at the start of the booking
     ✓ N05 AC4: 630-690 overlaps the first of two bookings
     ✓ N06 AC5: unsorted bookings stay in their order after an Available request
     ✓ N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)
   ✓ canBook - Practice #08 regression tests (2)
     ✓ BUG-A AC4: 660-700 touches a booking on both sides and is Available
     ✓ BUG-B AC5: 720-780 touches nothing, is Available and leaves the bookings unchanged

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  16:46:58
   Duration  1.30s (transform 36ms, setup 0ms, collect 62ms, tests 3ms, environment 0ms, prepare 135ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app/src
- App.tsx - renders <RoomChecker />, nothing else.
- components/RoomChecker.tsx - the whole page: imports the rooms array, holds the selected room, start/end/now as state, parses "HH:MM" inputs (timeInput, toInputValue), calls canBook for the decision and evaluateAvailability for the reasons, renders the form, the result banner and the list of bookings.
- components/Timeline.tsx - draws the day as a bar with the room's bookings and the requested interval.
- booking.ts - canBook({ start, end, now, blocked, bookings }): boolean. The tested rule function (AC1-AC5). Strict overlap, 120-minute limit, no mutation.
- booking.test.ts - 26 Vitest tests for canBook only (T01-T14, X1, X2, N01-N07, AC5, BUG-A, BUG-B). All pass.
- lib/validation.ts - evaluateAvailability(room, start, end, currentTime) returns available or a list of reason strings; overlapsExisting(); MAX_BOOKING_MINUTES = 120.
- lib/roomsData.ts - Room and Booking interfaces and 4 fictional rooms (id, name, building, capacity, blocked, blockedReason, bookings with id/bookedBy/purpose). No equipment field.
- lib/timeUtils.ts - MINUTES_PER_DAY, minutesToLabel, rangeLabel, durationLabel, nowInMinutes() (reads the real clock).
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending a small React + TypeScript app (Vite, Vitest 2.1.9). Please analyse it before any code is written.

REPOSITORY MAP (sis-04/app/src)
- App.tsx - renders <RoomChecker />, nothing else.
- components/RoomChecker.tsx - the whole page: imports the rooms array, holds the selected room, start/end/now as state, parses "HH:MM" inputs (timeInput, toInputValue), calls canBook for the decision and evaluateAvailability for the reasons, renders the form, the result banner and the list of bookings.
- components/Timeline.tsx - draws the day as a bar with the room's bookings and the requested interval.
- booking.ts - canBook({ start, end, now, blocked, bookings }): boolean. The tested rule function (AC1-AC5). Strict overlap, 120-minute limit, no mutation.
- booking.test.ts - 26 Vitest tests for canBook only (T01-T14, X1, X2, N01-N07, AC5, BUG-A, BUG-B). All pass.
- lib/validation.ts - evaluateAvailability(room, start, end, currentTime) returns available or a list of reason strings; overlapsExisting(); MAX_BOOKING_MINUTES = 120.
- lib/roomsData.ts - Room and Booking interfaces and 4 fictional rooms (id, name, building, capacity, blocked, blockedReason, bookings with id/bookedBy/purpose). No equipment field.
- lib/timeUtils.ts - MINUTES_PER_DAY, minutesToLabel, rangeLabel, durationLabel, nowInMinutes() (reads the real clock).

REQUIREMENTS THAT MUST KEEP HOLDING
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

NEW FEATURE: ROOM SELECTION (a catalog of at least four rooms; each room has id, name, capacity, equipment list, blocked status and its own bookings; show only the rooms that satisfy the user's requirements; the availability check must use the chosen room's bookings, not another room's data)
F1 Capacity filter: room capacity must be greater than or equal to the requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately.

TARGET LAYOUT (fixed by the assignment)
src/rooms.ts - Room type { id, name, capacity, equipment: string[], blocked, bookings: {start, end}[] } and ROOMS (data only)
src/filter.ts - filterRooms(rooms, { attendees, equipment }): Room[]  (F1, F2)
src/booking.ts - canBook (unchanged) + checkRoom(rooms, roomId, { start, end, now }): boolean, which calls canBook with the chosen room's blocked and bookings (F3, F5)
UI components import these rules and hold no room data and no rule of their own.

CONSTRAINTS
No login, no payments, no live APIs, no database, no network calls, no browser storage. Fictional data only. A fixed current time is fine.

WHAT I NEED FROM YOU
1. The maintainability risks you see in this code, each with the file and function it is in, and why it is a risk. At least three.
2. A prioritised plan of small, safe steps (smallest first) to add the feature and reach the target layout while canBook's 26 tests stay green after every step.
Please give a plan, not a full rewrite, and no code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The booking rules exist twice: the verdict comes from one copy, the reasons from another, and only one copy is tested | `src/booking.ts` `canBook()` and `src/lib/validation.ts` `evaluateAvailability()`, `overlapsExisting()` | `canBook` checks `end - start > 120` and `start < b.end && end > b.start`; `validation.ts` repeats them as `MAX_BOOKING_MINUTES = 120` and `start < b.end && b.start < end`. `RoomChecker` has a fallback reason "This time is not available." for when the two disagree. `booking.test.ts` imports only `canBook`. | High |
| 2 | The page holds room data and logic of its own | `src/components/RoomChecker.tsx` (imports `rooms`, `timeInput()`, `toInputValue()`, the decision `useMemo`) | `import { rooms } from '@/lib/roomsData'`; it parses "HH:MM" itself and decides what to show by combining `canBook` and `evaluateAvailability`. None of it is tested. | High |
| 3 | The room model has no equipment, so F2 cannot be built on it | `src/lib/roomsData.ts` `Room`, `Booking` | `Room` has `id, name, building, capacity, blocked, blockedReason?, bookings` - no `equipment`. Bookings carry `id, bookedBy, purpose`, which the target type does not have. | High |
| 4 | The selected room is asserted to exist | `src/components/RoomChecker.tsx` `rooms.find((r) => r.id === roomId)!` | With a filter, the selected id can drop out of the list; the `!` hides `undefined`, and `room.blocked` would then throw. | Medium |
| 5 | The current time comes from the real clock | `src/lib/timeUtils.ts` `nowInMinutes()`, used as the initial state in `RoomChecker` | `useState<number>(nowInMinutes())`, so the same request can be Available in the morning and Unavailable in the afternoon, and screenshots are not repeatable. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Add `src/rooms.ts` with the target `Room` type (`id, name, capacity, equipment, blocked, bookings`) and `ROOMS`: five fictional rooms, one blocked. Nothing imports it yet; the 26 tests stay green.
2. Add `src/filter.ts` `filterRooms()` test-first: F1 (capacity >= attendees, B5, B6), F2 (ALL selected items), F4 (no match gives `[]`).
3. Add `checkRoom()` to `src/booking.ts` below `canBook`, test-first: it finds the room by id and calls `canBook` with that room's own `blocked` and `bookings` (F3, F5); an unknown id is not available; nothing changes (AC5). `canBook` itself is not edited.
4. Wire `RoomChecker` to `ROOMS` and `checkRoom`: keep only the selected id, no `rooms.find(...)!` (a missing room shows "Select a room" and is not checked), and a fixed current time instead of `nowInMinutes()` (risks 4, 5).
5. Add the filter controls (attendees, equipment) and the empty state (F4); if the selected room is filtered out, clear the selection (F5).
6. Remove the duplicated rules: `canBook` gives the only verdict; `validation.ts` keeps only the reason texts, with a test that ties its 120 to `canBook` (119, 120, 121 minutes) (risk 1, modified AI step 9).
7. Move time parsing out of the page into `src/lib/timeUtils.ts`, delete `src/lib/roomsData.ts`, point `Timeline` at the new `Room` type (risks 2, 3).
8. Add the INT test (`filterRooms` then `checkRoom`), the before/after diagrams, the screenshots, and check AC6 at phone width.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Step 9 of the first plan: "Make `evaluateAvailability` import the limit from `booking.ts` rather than defining its own", while the plan also says "`canBook` and its 26 tests are never edited". | Modified | The second version is better, because `canBook` stays the only tested and untouched reference, and a drift between the two copies of 120 is still caught by a test on 119, 120 and 121 minutes - the same safety, without editing code the plan promised not to touch. In `src/booking.ts` the 120 is a literal inside `canBook` (`if (end - start > 120) return false;`), not an exported constant, so the import would have meant editing the tested function. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

`src/rooms.ts` holds five fictional rooms (Room 101, 202, 303, 404, 505; capacity 8 to 40) with the
equipment `projector`, `whiteboard`, `video-call`, `computers`; Room 303 is blocked. On the page the
filter is an "Attendees" number and one checkbox per equipment item (`EQUIPMENT`); the list shows only
`filterRooms(ROOMS, ...)`. A blocked room stays in the list, marked "Blocked", and can never show
Available (F3). When nothing matches, the list says "No rooms match these requirements. Lower the
number of attendees or select less equipment." (F4). The result is not stored: it is computed on every
render from the selected room id and the times, so selecting another room (or filtering the selected
one out) replaces the old result at once (F5). The current time is fixed at 09:00 for the demo and can
be changed in its own field.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 15 and "projector" ticked: the list shows only Room 101 (30, projector, whiteboard) and Room 404 (40, projector, video-call). |
| `evidence/filter-empty.png` | Attendees 50: no room is that big, so the list is empty and shows "No rooms match these requirements..." (F4); the result panel says "No room to check". |
| `evidence/switch-a.png` | No filter, Room 101 selected, 10:00-11:00, now 09:00: Available - Room 101 is booked 9:00-10:00 and 13:00-14:30, and 10:00 only touches the first booking. |
| `evidence/switch-b.png` | The same 10:00-11:00 with Room 202 selected: Unavailable, "The time overlaps an existing booking of this room." - Room 202 is booked 10:00-11:00 (F5). |
| `evidence/narrow.png` | The page at phone width in portrait (Chrome device toolbar, iPhone 12 Pro): the filter, the room list and the result stack in one column with no sideways scrolling (AC6). |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Data only: the `Room` type, the `EQUIPMENT` list and the five `ROOMS`. No functions. |
| `src/booking.ts` | The rules: `canBook` (AC1-AC5, not changed), `checkRoom` (finds the chosen room and passes its own `blocked` and `bookings` to `canBook`; F3, F5), `unavailableReasons` (the text under "Unavailable"; it never decides). |
| `src/filter.ts` | `filterRooms`: F1 capacity >= attendees and F2 ALL selected equipment; returns a new array. |
| `src/components/RoomChecker.tsx` | The page: holds the state (filters, selected id, times, now) and shows what `filterRooms`, `checkRoom` and `unavailableReasons` return. No room data, no rule. |
| `src/components/FilterPanel.tsx` | The attendees field and the equipment checkboxes; only reports changes. |
| `src/components/Timeline.tsx` | Draws the selected room's bookings and the request on a 24-hour bar. |
| `src/lib/timeUtils.ts` | Time text only: labels, and "HH:MM" <-> minutes for the time inputs. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| One verdict: the page asks only `checkRoom`, which calls `canBook` with the chosen room; `unavailableReasons` only explains a `false`. | Keep `evaluateAvailability` as a second decision and compare it with a parity test (the assistant's Step 1 / Step 9). | Two decisions could disagree (risk 1); the old page even had a fallback for that case. With one verdict there is nothing to compare, and the 26 `canBook` tests guard it (AC1-AC5). |
| Blocked rooms stay in the filtered list, marked "Blocked"; `filterRooms` does only F1 and F2. | Hide blocked rooms inside `filterRooms`. | F3 is about availability, so it belongs to `checkRoom`; a user who needs that room should see why it is not offered, and the F3 tests and the INT test check it. |
| `canBook` is not edited; the 120 stays a literal there, and `MAX_BOOKING_MINUTES` in `booking.ts` is only for the reason text, tied by B1/B2 tests. | Export the limit from `canBook` (the assistant's first Step 9). | `canBook` is the tested reference from Practice 07-08; the B1/B2 tests (120 available, 121 rejected) fail if either copy changes (3.3). |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `lib/validation.ts` `evaluateAvailability()`: AC1-AC4 checked a second time to decide available/unavailable | Deleted; the only verdict is `canBook` via `checkRoom` in `src/booking.ts` |
| `lib/validation.ts` `overlapsExisting()`: the overlap test `start < b.end && b.start < end` repeated from `canBook` | Deleted; `unavailableReasons` finds the overlapping booking by calling `canBook` with that one booking |
| `components/RoomChecker.tsx` decision `useMemo`: `canBook` plus `evaluateAvailability` plus a fallback reason when they disagree | One `checkRoom(ROOMS, room.id, request)` call |
| `components/RoomChecker.tsx` `toInputValue()`: the hour/minute split of `minutesToLabel` repeated | `split()` in `src/lib/timeUtils.ts`, used by `minutesToLabel` and `toTimeInput` |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1: in room b, 480-510 starts before now and is rejected` | room b, 480-510, now 540 -> false |
| AC2 | `B2 AC2: in room b, 121 minutes (720-841) is rejected` | 720-841 -> false |
| AC3 | `F3 AC3: a blocked room with no bookings is not available` | blocked room c, 600-660 -> false |
| AC4 | `B3 AC4: in room a, 660-720 only touches its booking 600-660 and is available` | room a (600-660), 660-720 -> true |
| AC5 | `AC5: an Available check leaves every room and its bookings unchanged` | 660-720 in room a -> true, rooms deep-equal before |
| F1 | `F1: 10 attendees keeps only rooms with capacity >= 10` | capacities 8, 12, 20, attendees 10 -> [b, c] |
| F2 | `F2: projector AND whiteboard keeps only the room that has both` | [projector, whiteboard] -> [a] only |
| F3 | `F3 AC3: a blocked room with no bookings is not available` | room c blocked, free times -> false |
| F4 | `F4: no room matches 25 attendees with a whiteboard - an empty list` | 25 + whiteboard -> [] |
| F5 | `F5: the same times 600-660 are Unavailable in room a and Available in room b` | 600-660: room a -> false, room b -> true |
| B1 | `B1 AC2: in room b, exactly 120 minutes (720-840) is available` | 720-840 -> true |
| B2 | `B2 AC2: in room b, 121 minutes (720-841) is rejected` | 720-841 -> false |
| B3 | `B3 AC4: in room a, 660-720 only touches its booking 600-660 and is available` | 660-720 vs 600-660 -> true |
| B4 | `B4 AC4: in room a, 630-690 overlaps its booking 600-660 and is rejected` | 630-690 vs 600-660 -> false |
| B5 | `B5 F1: capacity exactly equal to attendees (8 for 8) is included` | attendees 8, capacity 8 -> included |
| B6 | `B6 F1: capacity one below attendees (8 for 9) is excluded` | attendees 9, capacity 8 -> excluded |
| INT | `INT F1 F2 F3: 15 people with projector and whiteboard leaves b and c; 600-660 is Available in b, not in blocked c` | filterRooms -> [b, c]; checkRoom b -> true, c -> false |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04\app
npm install
npx vitest run
npx vitest run > ..\final-run.txt
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
@@FINALRUN@@
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 26/26 | 46/46 | `npx vitest run` at the baseline commit 78cb2c0 (1.1) and on the final code (6.3) |
| Duplicated logic locations removed | 0 removed (AC1-AC4 decided in two places: `canBook` and `evaluateAvailability`) | 4 removed | Counted in 5.3, one row per location I can point at in the baseline files |
| Code structure: modules and their responsibilities | 7 source files; rules split between `booking.ts` and `lib/validation.ts`, data and types in `lib/roomsData.ts`, the page imports the data and parses time | 9 source files; data `rooms.ts`, filter `filter.ts`, rules `booking.ts`, time text `lib/timeUtils.ts`, UI `components/` with no rule | `git ls-files sis-04/app/src` at 78cb2c0 and at the final commit (tests not counted); 5.1 and the diagrams |
| Remaining limitation | The verdict could come from two different functions | `unavailableReasons` still re-checks the conditions to write its text, and for a request longer than 120 minutes that also overlaps it shows only the duration reason, not the overlap | Exchange 3 (8.3) found the long-overlap case: 600-800 with a booking 650-700 gives only "longer than 120 minutes"; the verdict is still Unavailable |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Claude (claude.ai web), Claude Opus 5.5
**Date:** 2026-11-16
**Purpose:** Task 1 analysis: maintainability risks with file/function references and a plan of small steps (one fresh chat, the context message from 2.2).

**Prompt:**

```text
I am extending a small React + TypeScript app (Vite, Vitest 2.1.9). Please analyse it before any code is written.

REPOSITORY MAP (sis-04/app/src)
- App.tsx - renders <RoomChecker />, nothing else.
- components/RoomChecker.tsx - the whole page: imports the rooms array, holds the selected room, start/end/now as state, parses "HH:MM" inputs (timeInput, toInputValue), calls canBook for the decision and evaluateAvailability for the reasons, renders the form, the result banner and the list of bookings.
- components/Timeline.tsx - draws the day as a bar with the room's bookings and the requested interval.
- booking.ts - canBook({ start, end, now, blocked, bookings }): boolean. The tested rule function (AC1-AC5). Strict overlap, 120-minute limit, no mutation.
- booking.test.ts - 26 Vitest tests for canBook only (T01-T14, X1, X2, N01-N07, AC5, BUG-A, BUG-B). All pass.
- lib/validation.ts - evaluateAvailability(room, start, end, currentTime) returns available or a list of reason strings; overlapsExisting(); MAX_BOOKING_MINUTES = 120.
- lib/roomsData.ts - Room and Booking interfaces and 4 fictional rooms (id, name, building, capacity, blocked, blockedReason, bookings with id/bookedBy/purpose). No equipment field.
- lib/timeUtils.ts - MINUTES_PER_DAY, minutesToLabel, rangeLabel, durationLabel, nowInMinutes() (reads the real clock).

REQUIREMENTS THAT MUST KEEP HOLDING
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

NEW FEATURE: ROOM SELECTION (a catalog of at least four rooms; each room has id, name, capacity, equipment list, blocked status and its own bookings; show only the rooms that satisfy the user's requirements; the availability check must use the chosen room's bookings, not another room's data)
F1 Capacity filter: room capacity must be greater than or equal to the requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately.

TARGET LAYOUT (fixed by the assignment)
src/rooms.ts - Room type { id, name, capacity, equipment: string[], blocked, bookings: {start, end}[] } and ROOMS (data only)
src/filter.ts - filterRooms(rooms, { attendees, equipment }): Room[]  (F1, F2)
src/booking.ts - canBook (unchanged) + checkRoom(rooms, roomId, { start, end, now }): boolean, which calls canBook with the chosen room's blocked and bookings (F3, F5)
UI components import these rules and hold no room data and no rule of their own.

CONSTRAINTS
No login, no payments, no live APIs, no database, no network calls, no browser storage. Fictional data only. A fixed current time is fine.

WHAT I NEED FROM YOU
1. The maintainability risks you see in this code, each with the file and function it is in, and why it is a risk. At least three.
2. A prioritised plan of small, safe steps (smallest first) to add the feature and reach the target layout while canBook's 26 tests stay green after every step.
Please give a plan, not a full rewrite, and no code yet.
```

**Output used:** (unedited; the answer's own code fences are written as `~~~` and its heading lines are indented by one space, so they do not break this report's sections)

```text
This analysis is based on the repository map you gave, not the source files, so a few points are marked **verify** where the risk depends on how a function is actually written.

 ## 1. Maintainability risks

**R1. Two separate implementations of the booking rules.** *(`booking.ts` → `canBook`; `lib/validation.ts` → `evaluateAvailability`, `overlapsExisting`, `MAX_BOOKING_MINUTES`)*
`RoomChecker` gets the verdict from `canBook` and the reasons from `evaluateAvailability`. These are two independent copies of AC1–AC4. Only `canBook` is tested. If the two drift apart, the banner can say "Available" while listing a reason, or the reverse. Boundary rules are the most likely place for drift, such as strict overlap or `>` versus `>=` 120. Your BUG-A and BUG-B tests suggest this has already happened once. The 120 limit probably also exists twice, as a literal in `booking.ts` and as the constant in `validation.ts` (**verify**).

**R2. `RoomChecker.tsx` is a god component that holds data and rules.** *(`RoomChecker` and its inline `timeInput` / `toInputValue`)*
It imports the rooms array directly and parses "HH:MM" itself. It also owns the selection, the times and the result rendering. None of that is tested. The parsing deserves particular care. If an empty or malformed input becomes `NaN`, every comparison in `canBook` is false: `NaN >= end`, `NaN < now`, `NaN > 120` and the overlap test all fail. The function could then return `true` for garbage input (**verify** how `timeInput` handles `""`, `"24:00"` and `"9:5"`). This also directly breaks the target rule that "UI holds no room data and no rule".

**R3. Selection may not be tied to a room id.** *(`RoomChecker` selected-room state)*
The selection might be stored as an array index or as a copied room object. Once filtering changes what is in the list, an index can point to a different room, and a copied object can go stale. Either way you get the failure the brief warns about: checking availability against another room's bookings. This is also the main risk for F5 (**verify** what the state holds).

**R4. A hidden dependency on the real clock.** *(`lib/timeUtils.ts` → `nowInMinutes()`, used to seed `now` in `RoomChecker` and possibly inside `evaluateAvailability`)*
AC1's "in the past" rule then depends on the time of day the app or a test runs. Results become non-reproducible: the same input can be "Available" at 09:00 and "Unavailable" at 15:00, and any future UI tests become flaky. Your constraints already allow a fixed current time, so the clock should be injected at one point.

**R5. The current data model does not match the target model.** *(`lib/roomsData.ts` → `Room`, `Booking`)*
The current `Room` has `building` and `blockedReason` but no `equipment`, and its `Booking` carries `id`, `bookedBy` and `purpose`. The target has `equipment: string[]` and plain `{start, end}` bookings. While both exist there will be two `Room` types. TypeScript's structural typing can hide which one a component is really using. The UI probably renders `blockedReason`, `bookedBy` and `purpose`, so deleting them breaks rendering. Types and data also live in one file, and rules are split between the `src/` root and `lib/`.

**R6. Equipment names are free-form strings.** *(future `rooms.ts` / `filter.ts`)*
With `string[]`, a mismatch like "Projector" versus "projector" makes F2 quietly exclude valid rooms. The UI's checkbox list could also drift from the names used in the data.

**R7. The safety net covers only one function.** *(`booking.test.ts`)*
The 26 tests guard `canBook` and nothing else. `evaluateAvailability`, `overlapsExisting`, time parsing and `timeUtils` are untested, as is everything the refactor will touch. "26 green" alone does not prove the refactor is safe.

 ## 2. Plan: small, safe steps, smallest first

Run `vitest` after every step. `canBook` and its 26 tests are never edited.

**Step 0. Baseline.** Run the suite, confirm 26 passing, and commit. All later steps are additive or local.

**Step 1. Characterisation tests only, no production change.**
- Add a parity test: for a table of cases, `evaluateAvailability(...).available === canBook(...)`. This locks R1 down before anything moves.
- Add tests that capture today's behaviour of `timeInput` and `toInputValue`, including `""`, `"24:00"` and malformed input. If `NaN` does leak through (R2), record it as a known bug to fix in Step 7, not now.

**Step 2. Create `src/rooms.ts`, with nothing importing it yet.**
- Add the target `Room` type, an exported `EQUIPMENT` vocabulary (R6) and `ROOMS`: at least 4 fictional rooms, at least one blocked, varied capacity and equipment.
- Add a data sanity test: unique ids, at least 4 rooms, `start < end` for every booking, no overlapping bookings within a room, and every equipment item drawn from `EQUIPMENT`.

**Step 3. Create `src/filter.ts` with `filterRooms`, tested but not wired.**
- Test the capacity boundary, where `capacity === attendees` must pass (F1).
- Test that a room with only some of the required items is excluded (F2).
- Test that an empty equipment list matches all rooms.
- Test that no matches returns `[]`, which feeds F4.
- Test that the input array is not mutated.
- Decide what `attendees` of 0, negative or `NaN` should do.

**Step 4. Add `checkRoom` to `booking.ts`, appended below `canBook` and tested.**
- Test with two rooms where only room A has a booking at the requested time: room A is rejected and room B is accepted. This is the "not another room's data" test.
- Test that a blocked room returns `false` (F3).
- Test that an unknown `roomId` returns `false`.
- Test that touching endpoints are still allowed.
- Test that `rooms` is unchanged afterwards, using a deep-equal against a clone or a frozen fixture (AC5).

**Step 5. Inject a fixed `now` (R4).**
Define one constant, or an `App`-level prop passed to `RoomChecker`, and stop calling `nowInMinutes()` during render. This is a one-line behaviour change and the easiest point to verify by hand.

**Step 6. Move parsing out of the component (R2).**
Move `timeInput` and `toInputValue` into `lib/timeUtils.ts` unchanged. The Step 1 tests prove nothing changed. If the `NaN` hole exists, fix it now: return `null` and treat `null` as "can't check".

**Step 7. Wire the decision through `checkRoom`, selecting by id (R3).**
`RoomChecker` reads `ROOMS` from `rooms.ts`, stores only `selectedRoomId`, and computes the verdict as `checkRoom(ROOMS, selectedRoomId, {start, end, now})`. The verdict should be derived at render time, not stored in state, so changing room refreshes it automatically (F5). If you keep a "Check" button, clear the stored result whenever the room changes.

**Step 8. Add the filter UI and the empty state.**
- Add an attendees input and equipment checkboxes generated from `EQUIPMENT`.
- Show the list from `filterRooms`.
- Show a clear message when the list is empty (F4).
- Reconcile the selection: if the selected id drops out of the filtered list, clear it and prompt the user to pick a room (F5).

**Step 9. Reduce the reasons to one source of rules (R1).**
Point `evaluateAvailability` at the new `Room` shape. Make it import the limit from `booking.ts` rather than defining its own, and reuse a single overlap predicate. The parity test from Step 1 must stay green.

**Step 10. Update `Timeline`** to take the selected room's `{start, end}[]` bookings from `rooms.ts`.

**Step 11. Delete dead code.**
Remove `lib/roomsData.ts` and any duplicate constants once nothing imports them, checking with a project-wide search.

**Step 12. AC6 pass.**
Check by hand at about 360px and at desktop width. Put the result banner in an `aria-live` region and make the empty state and blocked status readable without relying on colour. If you want automated UI coverage of F5, add `jsdom` and Testing Library here as dev dependencies only.

 ## Decisions to settle before coding

1. **Blocked rooms in the list.** Should `filterRooms` hide blocked rooms, or show them marked "Blocked"? I'd keep `filterRooms` to F1 and F2 only and let `checkRoom` handle F3. That way a blocked room stays visible but can never show "Available".
2. **Extra fields.** Should `building`, `blockedReason`, `bookedBy` and `purpose` survive as optional display fields on the new types? Or should the UI stop showing them, matching the target type exactly?
3. **Check timing.** Should the check run live as inputs change, or only on a button press? This decides how F5 is implemented in Step 7.
```

**Problems found:** It worked from the map only and guessed. (1) Step 1 compares `evaluateAvailability(...).available`, but the function returns `{ status, reasons }`; there is no `.available`. (2) R2 claims `NaN` could make `canBook` return true; in the code the first check `if (!(0 <= start && start < end && end <= 1440)) return false` returns false for `NaN`, and `timeInput` returns `null`, which `RoomChecker` turns into -1. (3) Step 9 says to import the 120 limit from `booking.ts`, which contradicts its own rule that `canBook` is never edited. (4) It did not mention `rooms.find(...)!`.
**Changes made:** I kept its risks R1, R2, R4, R5 after finding them in the code (3.1, risks 1, 2, 5, 3) and added `rooms.find(...)!` (risk 4) myself. I did not keep R3 (selection by index): the state is already `roomId`. I sent the corrections back (Exchange 2).
**Verified by:** Reading `src/booking.ts`, `src/lib/validation.ts`, `src/components/RoomChecker.tsx` and `src/lib/roomsData.ts` at the baseline commit 78cb2c0; the baseline run in 1.1 (26/26).

### 8.2 Exchange 2

**Tool and model:** Claude (claude.ai web), Claude Opus 5.5
**Date:** 2026-11-16
**Purpose:** The plan: revise steps 1, 7 and 9 after my corrections, keeping `canBook` unchanged (same chat as Exchange 1).

**Prompt:**

```text
I checked the code. evaluateAvailability returns { status: 'available' | 'unavailable', reasons }, there is no .available field. In booking.ts the 120 limit is a literal inside canBook, not an exported constant, so step 9 would have to edit booking.ts. RoomChecker uses rooms.find(...)! for the selected room. Please revise steps 1, 7 and 9 only, keeping canBook unchanged. Still no code.
```

**Output used:** (unedited; the answer's own code fences are written as `~~~` and its heading lines are indented by one space, so they do not break this report's sections)

```text
Here are the revised steps. Steps 0, 2–6 and 8, 10–12 stay as they were, and `canBook` is never edited.

**Step 1 (revised). Characterisation tests only, no production change.**
- **Parity test, using the real return shape.** Build one table of cases, each with a fixture room, start, end and a fixed `now`. For each case, check that `evaluateAvailability(room, start, end, now).status === 'available'` matches `canBook({ start, end, now, blocked: room.blocked, bookings: room.bookings })`. Feeding both from the same fixture keeps the comparison honest.
- **Boundary cases.** Include at least these:
  - a duration of exactly 120 minutes and one of 121 minutes
  - start equal to end
  - start one minute before `now`
  - a booking that only touches another at an endpoint
  - a booking that overlaps another by one minute
  - a blocked room that would otherwise be free
- **Consistency of reasons.** Check that `status === 'unavailable'` if and only if `reasons.length > 0`.
- **Time parsing.** The `timeInput` / `toInputValue` tests stay as before.
- **If a case disagrees,** for example because `evaluateAvailability` checks something `canBook` doesn't, like a time past the end of the day, record it as a known gap with a skipped or todo test. Decide it in Step 9, not now.

**Step 7 (revised). Wire the decision through `checkRoom` and remove the `!`.**
- **Where the risk is.** The selection is already looked up by id, but `rooms.find(...)!` asserts that a match always exists. Once filtering is added, the selected id can drop out of the list. The `!` then either crashes on the first property access or passes `undefined` into the rules.
- **7a: narrow the input type.** Change `evaluateAvailability`'s `room` parameter to require only what it actually reads, such as `blocked` and `bookings` as `{start, end}[]`. Then a room from the new `rooms.ts` is accepted. This is a type-only change, and the parity test proves behaviour is unchanged. If it reads `blockedReason`, make that field optional with fallback text.
- **7b: read from `ROOMS` and handle "not found".** Switch `RoomChecker` to `ROOMS` from `rooms.ts` and keep `selectedRoomId` in state. Do one lookup without `!`, and treat a missing room as its own "No room selected" state. In that state, show a prompt and do not call `checkRoom` or `evaluateAvailability`. This matters because `checkRoom` returns `false` for an unknown id (Step 4), which would wrongly show "Unavailable" when the real situation is that nothing is selected.
- **7c: derive the verdict on each render.** Compute it as `checkRoom(ROOMS, selectedRoomId, { start, end, now })` and take the reasons from `evaluateAvailability` on the room you found. Both are computed during render, not stored, so changing the room refreshes the result (F5). Until Step 9, the Step 1 parity test is what keeps the verdict and the reasons in agreement.

**Step 9 (revised). Make `canBook` the only source of the verdict, without touching `booking.ts`.**
- **What changes.** `evaluateAvailability` takes its `status` from a call to `canBook` and keeps its own checks only to build the reason strings. The verdict then has exactly one implementation. `validation.ts` importing from `booking.ts` is safe, because `booking.ts` imports nothing from `validation.ts`.
- **Keep the constant, and tie it to `canBook` with a test.** `MAX_BOOKING_MINUTES = 120` stays in `validation.ts` for the reason text and duration check. A test then asserts that `canBook` accepts a booking of exactly `MAX_BOOKING_MINUTES` and rejects one of `MAX_BOOKING_MINUTES + 1`. If anyone changes either the literal in `canBook` or the constant, the test fails, so the two copies can't drift apart silently.
- **Consistency guard.** Keep the "unavailable ⇔ non-empty reasons" test. Add one asserting that whenever `overlapsExisting` reports an overlap, `canBook` returns `false`, and that bookings touching only at an endpoint produce no overlap reason.
- **Resolving Step 1 gaps.** Any gap recorded in Step 1 gets resolved here. If `evaluateAvailability` had a check that `canBook` lacks, decide whether to drop it or keep it as a reason-only warning. It cannot change the verdict, since `canBook` now owns that.
- **Optional, out of scope.** If you're later allowed to touch `canBook`, replacing its literal with an exported constant is a one-line change that the 26 tests guard. The tie test above makes it unnecessary for now.
```

**Problems found:** The revised step 1 suggests recording a disagreement "with a skipped or todo test"; the assignment forbids `.skip` and `.todo` (README section 9), so I will not do that. Its step 9 keeps 120 in two places and relies on a test to tie them.
**Changes made:** I took the revised step 9 as a modification of the first one (3.3) and put it into my plan as step 6. From step 7 I took the "No room selected" state instead of `!` (my plan step 4). The parity test of step 1 is not in my plan: after step 6 there is only one verdict, so there is nothing left to compare.
**Verified by:** The plan in 3.2 is committed before any change to `app/src` (commit "sis-04: analysis and plan"); the steps are checked as they are done by `npx vitest run` (section 6).

### 8.3 Exchange 3

**Tool and model:** Claude (claude.ai web), Claude Opus 5.5
**Date:** 2026-11-17
**Purpose:** Task 4 tests / refactoring review: can the new `unavailableReasons` text ever disagree with the verdict of `canBook` (a fresh chat).

**Prompt:**

```text
Review this TypeScript function from my room-booking app. The verdict (Available / Unavailable) always comes from checkRoom, which calls canBook below; unavailableReasons only produces the text shown under "Unavailable". 

Question: can unavailableReasons ever disagree with canBook - that is, return an empty list when canBook says false, or return a reason when canBook says true? Give a concrete counterexample input (start, end, now, blocked, bookings) if there is one. Do not rewrite the code, just answer and point at the lines.

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  return true;
}

export const MAX_BOOKING_MINUTES = 120;

// Why a request is Unavailable, in words for the page (AC6). It does not decide anything:
// the verdict is always checkRoom/canBook. The overlap reason reuses canBook on one booking at a time.
export function unavailableReasons(
  room: { blocked: boolean; bookings: Interval[] },
  request: { start: number; end: number; now: number },
): string[] {
  const { start, end, now } = request;
  const reasons: string[] = [];
  if (!(0 <= start && start < end && end <= 1440)) reasons.push('The start time must be earlier than the end time, within the day.');
  else {
    if (!(start > now)) reasons.push('The start time must be after the current time.');
    if (end - start > MAX_BOOKING_MINUTES) reasons.push(`A booking cannot be longer than ${MAX_BOOKING_MINUTES} minutes.`);
    const clash = room.bookings.filter(
      (b) => !canBook({ start, end, now: start - 1, blocked: false, bookings: [b] }) && end - start <= MAX_BOOKING_MINUTES,
    );
    if (clash.length > 0) reasons.push('The time overlaps an existing booking of this room.');
  }
  if (room.blocked) reasons.push('This room is blocked.');
  return reasons;
}
```

**Output used:** (unedited; the answer's own code fences are written as `~~~` and its heading lines are indented by one space, so they do not break this report's sections)

```text
No, they can't disagree. As long as `checkRoom` passes `room.blocked` and `room.bookings` to `canBook` unchanged, `unavailableReasons` returns an empty list exactly when `canBook` returns `true`. There is no counterexample.
Every way `canBook` returns `false` produces at least one reason:

1. Bad range (`!(0 <= start && start < end && end <= 1440)`). This is the same expression as the first `if` in `unavailableReasons`, which pushes the range message. NaN or Infinity inputs also fail it in both functions.
2. `!(start > now)`. This is identical to the first check inside the `else`. A NaN `now` fails it in both.
3. `end - start > 120`. This matches the `MAX_BOOKING_MINUTES` check, and the constant equals the hard-coded 120.
4. `blocked`. This matches `if (room.blocked)`, which sits outside the `if/else`, so it's pushed even when the range is bad.
5. Overlap. The `clash` filter reaches this case. By that point the range is valid (we're in the `else`), `now: start - 1` makes `start > now` true, and `blocked: false` skips the blocked check. The extra `&& end - start <= MAX_BOOKING_MINUTES` guarantees `canBook` didn't fail on duration. So `!canBook(...)` is true only when `start < b.end && end > b.start` holds for that single booking, which is the same test as `canBook`'s loop.

When `canBook` returns `true`, no reason fires: the range, past-time, duration and blocked checks all pass. The `clash` filter's `canBook` calls can then fail only on overlap, and `canBook` already found none.
Things that look suspicious but don't break agreement:

* Long overlapping requests get no overlap reason. For example, `start=600, end=800, now=0, blocked=false, bookings=[{start:650,end:700}]` shows only the "longer than 120 minutes" reason. The `&& end - start <= MAX_BOOKING_MINUTES` guard hides the overlap. The list is incomplete but still non-empty, so the verdict and the text still agree.
* A bad range suppresses the past-time, duration and overlap reasons, because of the `else`. "Blocked" can still appear. Again, this is incomplete rather than contradictory.
* `canBook` lists one failure; `unavailableReasons` lists all applicable ones. This only changes how many reasons appear, not whether any do.
* The comment `// keep the room's list current with the slot that was just found free` doesn't match the code. `canBook` mutates nothing today. If someone later makes it push the slot into `bookings`, the `clash` filter's calls would push into the throwaway `[b]` arrays, which is harmless. But calling `canBook` at all would then have side effects. Delete the comment or decide what it's supposed to mean.

The one assumption I can't check from here is that `checkRoom` passes exactly `room.blocked`, `room.bookings` and the same `start`, `end` and `now` to `canBook`. If it filters bookings (for example, excluding the user's own booking) or computes `now` differently, the two functions could diverge.
```

**Problems found:** It could not see `checkRoom` and said so; I checked it: `checkRoom` passes the chosen room's `blocked` and `bookings` and the same `start`, `end`, `now` unchanged (`src/booking.ts`, and the F5 test with rooms a and b). Its "suspicious" points are right: a request longer than 120 minutes that also overlaps gets only the duration reason.
**Changes made:** I deleted the stale comment `// keep the room's list current with the slot that was just found free` from `canBook` (left from the Practice 08 BUG-B fix; no code changed). I kept the reason text as it is and wrote the long-overlap case down as the remaining limitation (section 7).
**Verified by:** `npx vitest run` after deleting the comment: 46/46 (6.3); the B1/B2/AC4/F3 tests on `unavailableReasons` in `src/catalog.test.ts`.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

**Контекст.** В первом сообщении я дала карту репозитория (восемь файлов, по строке на каждый), AC1–AC6, F1–F5, целевую структуру (`rooms.ts`, `filter.ts`, `checkRoom` в `booking.ts`) и ограничения: без логина, сети и хранилища, только вымышленные данные. Исходный код я не приложила, поэтому ассистент местами угадывал. В третьем чате я, наоборот, дала только `canBook` и `unavailableReasons` и задала один узкий вопрос.

**Полезное и неверное.** Полезными оказались три риска: дублирование правил, зависимость от реальных часов и модель `Room` без `equipment`. Пригодились также идея ограничить `filterRooms` правилами F1/F2, а блокировку проверять в `checkRoom`, и вычисление вердикта при каждом рендере (F5). Ошибок было несколько. Тест сравнивал выдуманное поле `.available`, хотя функция возвращает `{ status, reasons }`. Тревога про `NaN` оказалась ложной: первая проверка `canBook` и так возвращает false, а `timeInput` отдаёт `null`. Шаг 9 предлагал импортировать 120 из `booking.ts`, что противоречило его же правилу не трогать `canBook`. Пересмотренный план советовал `.skip`/todo, хотя задание это запрещает. А `rooms.find(...)!` ассистент вообще не заметил.

**Что я проверила сама.** Я прочитала `booking.ts`, `validation.ts`, `RoomChecker.tsx` и `roomsData.ts` на коммите 78cb2c0 и убедилась, что `checkRoom` передаёт `blocked`, `bookings`, `start`, `end` и `now` без изменений. `npx vitest run` я запускала после каждого шага.

**Роль тестов.** 26 тестов `canBook` стали эталоном, поэтому саму функцию я не меняла. Две копии числа 120 я связала тестами B1/B2: 120 минут доступно, 121 уже нет. Раз вердикт выносит одна функция, тест на совпадение двух вердиктов стал не нужен. Вместо `.skip` я каждое расхождение либо исправляла, либо записывала как ограничение. Итог: 46/46.

**Что я улучшила бы дальше.** Остался случай длинного пересечения: запрос 600–800 при брони 650–700 показывает только причину про длительность. Я бы перевела причины на коды, которые возвращает одна функция правил, добавила UI-тесты для F4/F5 через Testing Library и сразу давала ассистенту исходники, а не одну карту.