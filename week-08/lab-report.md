# Week 08 — Lab report

**Name:** Saltanat Sultanakhmet
**Group:** Monday 16:00-19:00
**Date:** 2026-11-08

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude (claude.ai web) |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows, cmd) |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
C:\Users\sulta\se-practice\week-08\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-08/app

 ✓ src/booking.test.ts (24)
   ✓ canBook - the case plan T01-T14 (14)
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
 ✓ src/booking.test.ts (24)
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

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  21:37:05
   Duration  2.10s (transform 63ms, setup 0ms, collect 87ms, tests 6ms, environment 0ms, prepare 249ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
C:\Users\sulta\se-practice\week-08\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-08/app

 · src/booking.test.ts (24)
   · canBook - the case plan T01-T14 (14)
     · T01 AC4: 660-720 touching after the bo
oking is allowed
     · T02 AC1: 540-570 starts exactly now
     · T03 AC1: 720-720 zero duration
     · T04 AC1: 750-720 reversed
     · T05 AC1: 1380-1441 past the end of the
 day
     · T06 AC2: 720-840 exactly 120 minutes i
s allowed
     · T07 AC2: 720-841 is 121 minutes
     · T08 AC4: 570-600 touching before the b
 ❯ src/booking.test.ts (24)
   ❯ canBook - the case plan T01-T14 (14)
     × T01 AC4: 660-720 touching after the bo
oking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the
 day
     ✓ T06 AC2: 720-840 exactly 120 minutes i
s allowed
     ✓ T07 AC2: 720-841 is 121 minutes
     × T08 AC4: 570-600 touching before the b
 ❯ src/booking.test.ts (24)
   ❯ canBook - the case plan T01-T14 (14)
     × T01 AC4: 660-720 touching after the booking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the day
     ✓ T06 AC2: 720-840 exactly 120 minutes is allowed
     ✓ T07 AC2: 720-841 is 121 minutes
     × T08 AC4: 570-600 touching before the booking is allowed
     ✓ T09 AC4: 630-690 partial overlap
     ✓ T10 AC4: 570-690 contains the booking
     ✓ T11 AC4: 615-645 inside the booking
     ✓ T12 AC4: 600-660 identical interval
     ✓ T13 AC3: 660-720 in a blocked room
     ✓ T14 AC4: 630-690 with no bookings
   ❯ canBook - AC5 and my own cases (3)
     × AC5: an Available request leaves the bookings equal to before
     ✓ X1 AC1: 1380-1440 ends exactly at 24:00
     ✓ X2 AC4: 720-780 overlaps the second of two bookings
   ❯ canBook - added after the review (from the improvement answer) (7)
     ✓ N01 AC1: 541-570 one minute after now is allowed
     ✓ N02 AC1: 480-510 starts before now
     ✓ N03 AC4: 659-720 one-minute overlap at the end of the booking
     ✓ N04 AC4: 570-601 one-minute overlap at the start of the booking
     ✓ N05 AC4: 630-690 overlaps the first of two bookings
     × N06 AC5: unsorted bookings stay in their order after an Available request
     × N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T01 AC4: 660-720 touching after the booking is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:17:38
     15| describe('canBook - the case plan T…
     16|   test('T01 AC4: 660-720 touching a…
     17|     expect(canBook(input(660, 720))…
       |                                      ^
     18|   });
     19|   test('T02 AC1: 540-570 starts exa…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T08 AC4: 570-600 touching before the booking is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:38:38
     36|   });
     37|   test('T08 AC4: 570-600 touching b…
     38|     expect(canBook(input(570, 600))…
       |                                      ^
     39|   });
     40|   test('T09 AC4: 630-690 partial ov…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  src/booking.test.ts > canBook - AC5 and my own cases > AC5: an Available request leaves the bookings equal to before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:64:26
     62|     const req = input(660, 720);
     63|     const before = structuredClone(…
     64|     expect(canBook(req)).toBe(true);
       |                          ^
     65|     expect(req.bookings).toEqual(be…
     66|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  src/booking.test.ts > canBook - added after the review (from the improvement answer) > N06 AC5: unsorted bookings stay in their order after an Available request
AssertionError: expected [ { start: 900, end: 960 }, …(2) ] to deeply equal [ { start: 900, end: 960 }, …(1) ]

- Expected
+ Received

  Array [
    Object {
      "end": 960,
      "start": 900,
    },
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:95:26
     93|     const before = structuredClone(…
     94|     expect(canBook(req)).toBe(true);
     95|     expect(req.bookings).toEqual(be…
       |                          ^
     96|   });
     97|   test('N07 AC5: frozen bookings - …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  src/booking.test.ts > canBook - added after the review (from the improvement answer) > N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:101:83
     99|     bookings.forEach((b) => Object.…
    100|     Object.freeze(bookings);
    101|     expect(canBook({ start: 660, en…
       |                                                                                   ^
    102|     expect(bookings).toEqual([{ sta…
    103|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯

 Test Files  1 failed (1)
      Tests  5 failed | 19 passed (24)
   Start at  21:44:33
   Duration  2.12s (transform 58ms, setup 0ms, collect 76ms, tests 17ms, environment 0ms, prepare 247ms)
```

Note: the first time I unzipped the regression-test file before the buggy function by mistake (and the
run could not start because `vite` was not found). I removed that commit with `git reset --hard HEAD~1`,
ran `npm install` again and did the steps in the right order. The run above is from the redo.

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
C:\Users\sulta\se-practice\week-08\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-08/app

     · T01 AC4: 660-720 touching after the bo
oking is allowed
     · T02 AC1: 540-570 starts exactly now
     · T03 AC1: 720-720 zero duration
     · T04 AC1: 750-720 reversed
     · T05 AC1: 1380-1441 past the end of the
 day
     · T06 AC2: 720-840 exactly 120 minutes i
s allowed
     · T07 AC2: 720-841 is 121 minutes
     · T08 AC4: 570-600 touching before the b
ooking is allowed
     · T09 AC4: 630-690 partial overlap
     · T10 AC4: 570-690 contains the booking
     · T11 AC4: 615-645 inside the booking
     · T12 AC4: 600-660 identical interval
     · T13 AC3: 660-720 in a blocked room
     × T01 AC4: 660-720 touching after the bo
oking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the
 day
     ✓ T06 AC2: 720-840 exactly 120 minutes i
s allowed
     ✓ T07 AC2: 720-841 is 121 minutes
     × T08 AC4: 570-600 touching before the b
ooking is allowed
     ✓ T09 AC4: 630-690 partial overlap
     ✓ T10 AC4: 570-690 contains the booking
     ✓ T11 AC4: 615-645 inside the booking
     ✓ T12 AC4: 600-660 identical interval
     ✓ T13 AC3: 660-720 in a blocked room
 ❯ src/booking.test.ts (26)
   ❯ canBook - the case plan T01-T14 (14)
     × T01 AC4: 660-720 touching after the booking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the day
     ✓ T06 AC2: 720-840 exactly 120 minutes is allowed
     ✓ T07 AC2: 720-841 is 121 minutes
     × T08 AC4: 570-600 touching before the booking is allowed
     ✓ T09 AC4: 630-690 partial overlap
     ✓ T10 AC4: 570-690 contains the booking
     ✓ T11 AC4: 615-645 inside the booking
     ✓ T12 AC4: 600-660 identical interval
     ✓ T13 AC3: 660-720 in a blocked room
     ✓ T14 AC4: 630-690 with no bookings
   ❯ canBook - AC5 and my own cases (3)
     × AC5: an Available request leaves the bookings equal to before
     ✓ X1 AC1: 1380-1440 ends exactly at 24:00
     ✓ X2 AC4: 720-780 overlaps the second of two bookings
   ❯ canBook - added after the review (from the improvement answer) (7)
     ✓ N01 AC1: 541-570 one minute after now is allowed
     ✓ N02 AC1: 480-510 starts before now
     ✓ N03 AC4: 659-720 one-minute overlap at the end of the booking
     ✓ N04 AC4: 570-601 one-minute overlap at the start of the booking
     ✓ N05 AC4: 630-690 overlaps the first of two bookings
     × N06 AC5: unsorted bookings stay in their order after an Available request
     × N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)
   ❯ canBook - Practice #08 regression tests (2)
     × BUG-A AC4: 660-700 touches a booking on both sides and is Available
     × BUG-B AC5: 720-780 touches nothing, is Available and leaves the bookings unchanged

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 7 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T01 AC4: 660-720 touching after the booking is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:17:38
     15| describe('canBook - the case plan T…
     16|   test('T01 AC4: 660-720 touching a…
     17|     expect(canBook(input(660, 720))…
       |                                      ^
     18|   });
     19|   test('T02 AC1: 540-570 starts exa…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯

 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T08 AC4: 570-600 touching before the booking is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:38:38
     36|   });
     37|   test('T08 AC4: 570-600 touching b…
     38|     expect(canBook(input(570, 600))…
       |                                      ^
     39|   });
     40|   test('T09 AC4: 630-690 partial ov…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯

 FAIL  src/booking.test.ts > canBook - AC5 and my own cases > AC5: an Available request leaves the bookings equal to before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:64:26
     62|     const req = input(660, 720);
     63|     const before = structuredClone(…
     64|     expect(canBook(req)).toBe(true);
       |                          ^
     65|     expect(req.bookings).toEqual(be…
     66|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯

 FAIL  src/booking.test.ts > canBook - added after the review (from the improvement answer) > N06 AC5: unsorted bookings stay in their order after an Available request
AssertionError: expected [ { start: 900, end: 960 }, …(2) ] to deeply equal [ { start: 900, end: 960 }, …(1) ]

- Expected
+ Received

  Array [
    Object {
      "end": 960,
      "start": 900,
    },
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:95:26
     93|     const before = structuredClone(…
     94|     expect(canBook(req)).toBe(true);
     95|     expect(req.bookings).toEqual(be…
       |                          ^
     96|   });
     97|   test('N07 AC5: frozen bookings - …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯

 FAIL  src/booking.test.ts > canBook - added after the review (from the improvement answer) > N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:101:83
     99|     bookings.forEach((b) => Object.…
    100|     Object.freeze(bookings);
    101|     expect(canBook({ start: 660, en…
       |                                                                                   ^
    102|     expect(bookings).toEqual([{ sta…
    103|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯

 FAIL  src/booking.test.ts > canBook - Practice #08 regression tests > BUG-A AC4: 660-700 touches a booking on both sides and is Available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:109:26
    107|   test('BUG-A AC4: 660-700 touches …
    108|     const req = input(660, 700, { b…
    109|     expect(canBook(req)).toBe(true);
       |                          ^
    110|   });
    111|   test('BUG-B AC5: 720-780 touches …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯

 FAIL  src/booking.test.ts > canBook - Practice #08 regression tests > BUG-B AC5: 720-780 touches nothing, is Available and leaves the bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  Array [
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:115:26
    113|     const before = structuredClone(…
    114|     expect(canBook(req)).toBe(true);
    115|     expect(req.bookings).toEqual(be…
       |                          ^
    116|   });
    117| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯

 Test Files  1 failed (1)
      Tests  7 failed | 19 passed (26)
   Start at  21:45:39
   Duration  811ms (transform 57ms, setup 0ms, collect 81ms, tests 19ms, environment 0ms, prepare 217ms)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01 (also T08, BUG-A) | 660-720, now 540, bookings [600-660] | true (Available, touching is allowed by AC4) | false | `if (start <= b.end && end >= b.start) return false;` - the non-strict `<=` / `>=` count a shared endpoint as an overlap, so 660-720 conflicts with 600-660 (660 <= 660), although AC4 allows touching. It needs `<` / `>`. |
| BUG-B | BUG-B (also N06, N07) | 720-780, now 540, bookings [600-660] | true, and bookings still [600-660] | true, but bookings became [600-660, 720-780] | `bookings.push({ start, end });` - the check function changes the input array, which breaks AC5. A second call with the same slot then returns false, and a shared fixture could break other tests depending on their order. |

One bug hides another: the Week 07 AC5 test uses 660-720, a touching request, so on the buggy code it
failed on `expect(canBook(req)).toBe(true)` because BUG-A rejected it before the `push` was reached.
It failed for the wrong reason. After the BUG-A fix it failed for the right reason (the bookings
array got 660-720 added, see 8.1). That is why BUG-B uses 720-780, which touches nothing.

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
C:\Users\sulta\se-practice\week-08\skills>tar -a -cf bug-detector.zip bug-detector

C:\Users\sulta\se-practice\week-08\skills>tar -tf bug-detector.zip
bug-detector/
bug-detector/.gitkeep
bug-detector/SKILL.md
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->
prompt-only simulation. I typed `SKILL.md` in Notepad and made the ZIP with `tar -a -cf`. I did not
upload the ZIP: I was short of time before the deadline, so I used the deck's fallback. In a fresh
Claude chat I pasted the text of `SKILL.md` as the first message and wrote that this is a prompt-only
simulation, not an installed skill. The assistant answered that it would follow the Bug Detector
procedure and asked for the acceptance criteria, the code and the failure. The screenshot of that
answer is `evidence/install.png`. Nothing in the chat showed an installed skill.

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.
Acceptance criteria:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output (Vitest 2.1.9, fixture now = 540, bookings = [{ start: 600, end: 660 }]):
 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T01 AC4: 660-720 touching after the booking is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:17:38
     17|     expect(canBook(input(660, 720))).toBe(true);

Code of canBook as provided:
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
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:** (the only change: the answer's own code fences are written as `~~~`, so this block does not break)

```text
Root cause
The overlap check treats touching intervals as overlapping because it uses inclusive comparisons:

~~~ts
if (start <= b.end && end >= b.start) return false;

~~~

For T01 (new booking 660–720, existing booking 600–660):

* `660 <= 660` is `true`
* `720 >= 600` is `true`

So the function returns `false`. AC4 says a booking may touch another at an endpoint, which means intervals are half-open `[start, end)`. Two intervals overlap only when `start < b.end && end > b.start`.
Second defect: the function changes booking data (AC5)

~~~ts
bookings.push({ start, end });

~~~

AC5 says the check must not change booking data, and this line does. It also makes test results depend on the order tests run in. If the test's `input()` helper reuses one `bookings` array, every earlier passing test adds its slot to it. A later test can then fail because of an earlier test's booking, not because of its own input. The comparison bug alone fully explains T01. The mutation is a second violation, and it can cause misleading failures elsewhere in T01–T14.
Minimal patch (proposed, not applied)

~~~diff
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }

~~~

If the app needs to save a booking, that should be a separate function such as `book()`, called after `canBook` returns `true`.
Regression tests

~~~ts
import { describe, it, expect } from "vitest";
import { canBook } from "./booking";

const fresh = () => [{ start: 600, end: 660 }];
const input = (start: number, end: number, bookings = fresh()) =>
  ({ start, end, now: 540, blocked: false, bookings });

describe("canBook - regression: endpoints and purity", () => {
  it("AC4: touching after the booking is allowed (660-720)", () => {
    expect(canBook(input(660, 720))).toBe(true);
  });
  it("AC4: touching before the booking is allowed (580-600)", () => {
    expect(canBook(input(580, 600))).toBe(true);
  });
  it("AC4: one-minute overlap at the end is rejected (659-720)", () => {
    expect(canBook(input(659, 720))).toBe(false);
  });
  it("AC4: one-minute overlap at the start is rejected (580-601)", () => {
    expect(canBook(input(580, 601))).toBe(false);
  });
  it("AC4: a request that contains the booking is rejected (590-670)", () => {
    expect(canBook(input(590, 670))).toBe(false);
  });
  it("AC5: does not change the bookings array", () => {
    const bookings = fresh();
    const snapshot = structuredClone(bookings);
    canBook(input(660, 720, bookings));
    expect(bookings).toEqual(snapshot);
  });
  it("AC5: the same request gives the same answer when repeated", () => {
    const bookings = fresh();
    expect(canBook(input(660, 720, bookings))).toBe(true);
    expect(canBook(input(660, 720, bookings))).toBe(true);
  });
});

~~~

The last test fails on the current code: the first call adds 660–720 to the array, so the second call returns `false`. That makes it a direct guard against the AC5 bug coming back.
I'd also check that the existing `input()` helper creates a new `bookings` array on each call, so the suite can't hide this kind of bug again.
Other acceptance criteria

* AC1: `start > now` rejects `start === now`. Whether a booking starting at the current minute counts as "in the past" is a product decision. I'd add a test that pins down the intended behaviour, but I haven't changed the code for it.
* AC2: This is correct: exactly 120 minutes is allowed and 121 is rejected. Boundary tests for 120 and 121 would be worth having if T01–T14 don't include them.
* AC3: This is correct.
* AC6: This can't be judged from this function. It depends on the UI layer showing the Available or Unavailable result clearly on desktop and mobile.
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

Before this, as the first message of the same fresh chat, I sent the full text of `skills/bug-detector/SKILL.md`
followed by the line `This is a prompt-only simulation, not an installed skill.` (screenshot: `evidence/install.png`).
The second message, the one below, is the skill question and the same input as in section 5:

```text
Use the bug-detector skill to diagnose the failed room-booking test.
Acceptance criteria:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output (Vitest 2.1.9, fixture now = 540, bookings = [{ start: 600, end: 660 }]):
 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T01 AC4: 660-720 touching after the booking is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:17:38
     17|     expect(canBook(input(660, 720))).toBe(true);

Code of canBook as provided:
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
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:** (the only change: the answer's own code fences are written as `~~~`, so this block does not break)

```text
[Reply to the first message (the SKILL.md text, prompt-only simulation):]
I'll use the Bug Detector procedure for the Smart Campus booking app. I'll diagnose only and won't edit any code.
To start, please send these three things:

1. Acceptance criteria: the user story or rules the booking feature must meet. For example: "A room can't be double-booked for overlapping time slots" or "Bookings must be within opening hours."
2. The code: the relevant files or functions, such as the booking service, validation logic, or the data model. You can paste them or attach them.
3. The observed failure: the failing test output, error message or stack trace, or a description of what happened versus what you expected.

When I have them, I'll reproduce the problem with the smallest input that triggers it. Then I'll report each issue in this format:
Defect | Evidence | Root cause | Fix | Test
I'll mark each finding as either a confirmed defect or a hypothesis. If the code can run here, I'll execute the reproduction and the proposed regression test to confirm them. If you'd like to reuse this procedure in future chats, I can also save it as a real installed skill.

[Reply to the skill question + the input:]
Two confirmed defects. The first is the direct cause of T01. The second breaks AC5 and can make other tests fail depending on the order they run in. I reproduced both by running a copy of `canBook` against your fixture (`now = 540`, `bookings = [{600, 660}]`). I didn't change your code.

### Defect 1: touching bookings are treated as overlaps (AC4). Confirmed, and it causes T01.

**Evidence.** `canBook(660–720)` returns `false`, which matches the failing assertion at `booking.test.ts:17`. A booking that touches from the other side (`545–600`) is also wrongly rejected.

**Root cause.** The overlap check uses inclusive comparisons:
~~~ts
if (start <= b.end && end >= b.start) return false;
~~~
With `start = 660` and `b.end = 660`, the check `660 <= 660` is true, so a shared endpoint counts as a collision. AC4 needs half-open intervals `[start, end)`. Two bookings overlap only if each one starts *strictly before* the other ends.

**Fix.**
~~~ts
if (start < b.end && end > b.start) return false;
~~~
I confirmed the fix: 660–720 → `true`, 545–600 → `true`, and the real overlap 630–690 → still `false`.

### Defect 2: `canBook` changes the caller's bookings array (AC5). Confirmed.

**Evidence.** After a successful check of `700–760`, the array the caller passed in becomes `[{600,660},{700,760}]`. Calling `canBook(700–760)` a second time then returns `false`, so the same question gets a different answer.

**Root cause.** The function runs `bookings.push({ start, end })` before returning `true`. A function that only checks availability ends up creating a booking. The comment says this keeps "the room's list current", which shows the side effect was intentional, but it contradicts AC5 ("without changing booking data").

**Fix.** Delete the `push` and its comment. Saving a booking belongs in a separate function, such as `createBooking`, that calls `canBook` first.

**Hypothesis (not confirmed).** If T01–T14 share a single `bookings` array, then every test that returns `true` adds a booking for every test after it. That can make tests fail or pass depending on order, which hides real defects or invents fake ones. To confirm, check whether the fixture is built fresh in `beforeEach`, or run `vitest --sequence.shuffle`.

### Regression tests to add
| Case | Input | Expected |
|---|---|---|
| T01 touch after | 660–720 | `true` |
| Touch before | 545–600 | `true` |
| Real overlap | 630–690 | `false` |
| Contained | 610–650 | `false` |
| AC5 no mutation | 700–760, then `expect(bookings).toEqual([{start:600,end:660}])` | unchanged |
| AC5 idempotent | call 700–760 twice | `true`, `true` |

For the AC5 tests, freeze the fixture with `Object.freeze(bookings)` so any future `push` throws immediately.

### Not covered
AC1–AC3 look correct for the inputs I tried: the bounds check, past requests, the 120-minute cap, and blocked rooms. AC6 (UI feedback) can't be checked from this function. I'd need the component code and screenshots on desktop and mobile.
```

Did the environment show that the skill was invoked? not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correct for both: the `<=` / `>=` line for BUG-A (T01) and the `push` line for BUG-B (AC5). My fixes on exactly these lines made the suite green (8.2). | Correct for both, the same two lines. Same verdict as without the skill. |
| Reproducible test | Mostly yes: concrete inputs with exact `.toBe(...)`, a fresh fixture, a copy compared after the call. But its AC5 no-mutation test uses 660-720, a touching request, so on the buggy code BUG-A would hide BUG-B, the same trap as my Week 07 AC5 test. | Similar: a table with inputs and expected results (545-600, 630-690, 700-760). Its AC5 test uses 700-760, which touches nothing, so BUG-A cannot hide BUG-B. It is a table, not runnable code. |
| Minimal proposed patch | One combined diff: the strict comparison, plus deleting the `push` and the comment. Correct, but two bugs in one diff, not one change per bug. | Two separate fixes, one per defect, the same lines. It also suggests deleting the comment (I kept it, to change one line). |
| Unsupported claims | Mostly hedged with "if": the shared-fixture order problem is written as a possibility. "AC2/AC3: this is correct" is right for the code I sent. | "I reproduced both by running a copy of canBook" and "Confirmed" for both: it ran its own plain-JS copy in its sandbox (only a collapsed tool call), not my booking.ts with Vitest, so "confirmed" is not proved by the answer itself. |
| Clarity of explanation | Clear, step by step with the numbers (660 <= 660). Long code block for the tests. | Clearer structure: defect / evidence / root cause / fix / test, and the shared-fixture idea is labelled as a hypothesis (skill step 4). |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- No skill: both (BUG-A as the cause of T01, BUG-B as a second AC5 defect).
- With skill: both. Neither answer noticed that my Week 07 AC5 test failed because of BUG-A and not BUG-B.

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
C:\Users\sulta\se-practice\week-08>git diff app/src/booking.ts
warning: in the working copy of 'week-08/app/src/booking.ts', LF will be replaced by CRLF the next time Git touches it
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index c27a06b..9334533 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -15,7 +15,7 @@ export function canBook({ start, end, now, blocked, bookings }: {
   if (end - start > 120) return false;
   if (blocked) return false;
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
   bookings.push({ start, end });

C:\Users\sulta\se-practice\week-08\app>npx vitest run -t "BUG-A"

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-08/app

 ✓ src/booking.test.ts (26)
   ↓ canBook - the case plan T01-T14 (14) [skipped]
     ↓ T01 AC4: 660-720 touching after the booking is allowed [skipped]
     ↓ T02 AC1: 540-570 starts exactly now [skipped]
     ↓ T03 AC1: 720-720 zero duration [skipped]
     ↓ T04 AC1: 750-720 reversed [skipped]
     ↓ T05 AC1: 1380-1441 past the end of the day [skipped]
     ↓ T06 AC2: 720-840 exactly 120 minutes is allowed [skipped]
     ↓ T07 AC2: 720-841 is 121 minutes [skipped]
     ↓ T08 AC4: 570-600 touching before the booking is allowed [skipped]
     ↓ T09 AC4: 630-690 partial overlap [skipped]
     ↓ T10 AC4: 570-690 contains the booking [skipped]
     ↓ T11 AC4: 615-645 inside the booking [skipped]
     ↓ T12 AC4: 600-660 identical interval [skipped]
     ↓ T13 AC3: 660-720 in a blocked room [skipped]
     ↓ T14 AC4: 630-690 with no bookings [skipped]
   ↓ canBook - AC5 and my own cases (3) [skipped]
     ↓ AC5: an Available request leaves the bookings equal to before [skipped]
     ↓ X1 AC1: 1380-1440 ends exactly at 24:00 [skipped]
     ↓ X2 AC4: 720-780 overlaps the second of two bookings [skipped]
   ↓ canBook - added after the review (from the improvement answer) (7) [skipped]
     ↓ N01 AC1: 541-570 one minute after now is allowed [skipped]
     ↓ N02 AC1: 480-510 starts before now [skipped]
     ↓ N03 AC4: 659-720 one-minute overlap at the end of the booking [skipped]
     ↓ N04 AC4: 570-601 one-minute overlap at the start of the booking [skipped]
     ↓ N05 AC4: 630-690 overlaps the first of two bookings [skipped]
     ↓ N06 AC5: unsorted bookings stay in their order after an Available request [skipped]
     ↓ N07 AC5: frozen bookings - an Available call writes nothing (a write would throw) [skipped]
   ✓ canBook - Practice #08 regression tests (2)
     ✓ BUG-A AC4: 660-700 touches a booking on both sides and is Available
     ↓ BUG-B AC5: 720-780 touches nothing, is Available and leaves the bookings unchanged [skipped]

 Test Files  1 passed (1)
      Tests  1 passed | 25 skipped (26)
   Start at  22:11:23
   Duration  840ms (transform 71ms, setup 0ms, collect 91ms, tests 3ms, environment 0ms, prepare 274ms)

(the progress lines Vitest printed before this final tree are left out; they repeat the same test names)
C:\Users\sulta\se-practice\week-08\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-08/app

     · T01 AC4: 660-720 touching after the bo
oking is allowed
     · T02 AC1: 540-570 starts exactly now
     · T03 AC1: 720-720 zero duration
     · T04 AC1: 750-720 reversed
     · T05 AC1: 1380-1441 past the end of the
 day
     · T06 AC2: 720-840 exactly 120 minutes i
s allowed
     · T07 AC2: 720-841 is 121 minutes
     · T08 AC4: 570-600 touching before the b
ooking is allowed
     · T09 AC4: 630-690 partial overlap
     · T10 AC4: 570-690 contains the booking
     · T11 AC4: 615-645 inside the booking
     · T12 AC4: 600-660 identical interval
     · T13 AC3: 660-720 in a blocked room
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
 ❯ src/booking.test.ts (26)
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
   ❯ canBook - AC5 and my own cases (3)
     × AC5: an Available request leaves the bookings equal to before
     ✓ X1 AC1: 1380-1440 ends exactly at 24:00
     ✓ X2 AC4: 720-780 overlaps the second of two bookings
   ❯ canBook - added after the review (from the improvement answer) (7)
     ✓ N01 AC1: 541-570 one minute after now is allowed
     ✓ N02 AC1: 480-510 starts before now
     ✓ N03 AC4: 659-720 one-minute overlap at the end of the booking
     ✓ N04 AC4: 570-601 one-minute overlap at the start of the booking
     ✓ N05 AC4: 630-690 overlaps the first of two bookings
     × N06 AC5: unsorted bookings stay in their order after an Available request
     × N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)
   ❯ canBook - Practice #08 regression tests (2)
     ✓ BUG-A AC4: 660-700 touches a booking on both sides and is Available
     × BUG-B AC5: 720-780 touches nothing, is Available and leaves the bookings unchanged

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook - AC5 and my own cases > AC5: an Available request leaves the bookings equal to before
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  Array [
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 720,
+     "start": 660,
+   },
  ]

 ❯ src/booking.test.ts:65:26
     63|     const before = structuredClone(…
     64|     expect(canBook(req)).toBe(true);
     65|     expect(req.bookings).toEqual(be…
       |                          ^
     66|   });
     67|   test('X1 AC1: 1380-1440 ends exac…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/booking.test.ts > canBook - added after the review (from the improvement answer) > N06 AC5: unsorted bookings stay in their order after an Available request
AssertionError: expected [ { start: 900, end: 960 }, …(2) ] to deeply equal [ { start: 900, end: 960 }, …(1) ]

- Expected
+ Received

  Array [
    Object {
      "end": 960,
      "start": 900,
    },
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:95:26
     93|     const before = structuredClone(…
     94|     expect(canBook(req)).toBe(true);
     95|     expect(req.bookings).toEqual(be…
       |                          ^
     96|   });
     97|   test('N07 AC5: frozen bookings - …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/booking.test.ts > canBook - added after the review (from the improvement answer) > N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:21:12
     19|   }
     20|   // keep the room's list current w…
     21|   bookings.push({ start, end });
       |            ^
     22|   return true;
     23| }
 ❯ src/booking.test.ts:101:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/booking.test.ts > canBook - Practice #08 regression tests > BUG-B AC5: 720-780 touches nothing, is Available and leaves the bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  Array [
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:115:26
    113|     const before = structuredClone(…
    114|     expect(canBook(req)).toBe(true);
    115|     expect(req.bookings).toEqual(be…
       |                          ^
    116|   });
    117| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯

 Test Files  1 failed (1)
      Tests  4 failed | 22 passed (26)
   Start at  22:09:57
   Duration  787ms (transform 58ms, setup 0ms, collect 80ms, tests 18ms, environment 0ms, prepare 228ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
C:\Users\sulta\se-practice\week-08>git diff app/src/booking.ts
warning: in the working copy of 'week-08/app/src/booking.ts', LF will be replaced by CRLF the next time Git touches it
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 9334533..b66fbf8 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -18,6 +18,5 @@ export function canBook({ start, end, now, blocked, bookings }: {
     if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }

C:\Users\sulta\se-practice\week-08>cd app

C:\Users\sulta\se-practice\week-08\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-08/app

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
   Start at  22:14:48
   Duration  820ms (transform 75ms, setup 0ms, collect 101ms, tests 6ms, environment 0ms, prepare 250ms)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
- The skill answer said "I reproduced both" and called both defects confirmed, but it ran its own plain-JS copy of `canBook` in its sandbox, shown only as a collapsed tool call, not my `booking.ts` with my Vitest suite. So that claim cannot be checked from the answer. Only my own terminal runs in 2.3 and 8.2 are evidence that the bugs exist and that the fixes work.

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
Both answers found both bugs from the same input, so the skill did not add a defect: in the "Correct root cause" row both columns name the same two lines. The skill answer was easier to check, because it used the defect / evidence / root cause / fix / test format and labelled the shared-fixture idea as a hypothesis, as step 4 says. My tests proved more than the chats: the BUG-A and BUG-B tests failed on the buggy code (2.3), each one-line fix turned its test green, and the final run is 26 of 26 with T01-T14 kept (8.2). They also showed that the Week 07 AC5 test first failed because of BUG-A, not BUG-B. They do not prove the page itself (AC6), which no test here checks.
