# Week 07 — Lab report

**Name:** Saltanat Sultanakhmet
**Group:** Monday 16:00-19:00
**Date:** 2026-11-08

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72156204 |
| Assistant that generated the tests (tool) | Claude (claude.ai) |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows, Node.js, `npx vitest run` in `week-07/app`) |
| Vitest version (the `RUN  v…` line of a run) | v2.1.9 |
| Test command | `npx vitest run` (in `app/`) |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `src/lib/validation.ts`, `evaluateAvailability(room, start, end, currentTime)` |
| Its inputs | the selected `Room` object (with `blocked` and `bookings`), start and end in minutes, and the current time in minutes from the page's "Current time baseline" input |
| What it returned | an object: `{ status: 'available' }` or `{ status: 'unavailable', reasons: [...] }` with the messages |
| How the page used it | `src/components/RoomChecker.tsx` called it in a `useMemo` and showed the green Available or red Unavailable banner with the reasons |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->

`canBook` now lives in `app/src/booking.ts`. I copied the decision conditions from `evaluateAvailability` in `src/lib/validation.ts` unchanged (finite times, 0 <= start < 1440, 0 <= end <= 1440, start < end, start > now, at most 120 minutes, not blocked, `start < b.end && b.start < end` for every booking), so the behaviour is the same. `src/components/RoomChecker.tsx` imports `canBook` from `../booking` and uses it for the Available / Unavailable decision; `evaluateAvailability` now only supplies the reasons shown under Unavailable. I checked in the browser that the page gives the same results as before.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | 660 is excluded from the booking 600–660, so 660–720 only touches it and nothing is shared |
| T02 | 540–570 (starts now) | false | AC1 | start 540 is not after now 540; equal to now is not "after" |
| T03 | 720–720 (zero duration) | false | AC1 | start 720 is not smaller than end 720, so the interval is empty |
| T04 | 750–720 (reversed) | false | AC1 | start 750 is after end 720, a reversed interval |
| T05 | 1380–1441 (past day end) | false | AC1 | end 1441 is past 1440 (24:00), outside the day |
| T06 | 720–840 (120 minutes) | true | AC2 | 720 to 840 is exactly 120 minutes, and only longer than 120 is rejected |
| T07 | 720–841 (121 minutes) | false | AC2 | 720 to 841 is 121 minutes, one minute too long |
| T08 | 570–600 (touching before) | true | AC4 | 600 is the start of the booking and the end of the request, so 570–600 only touches it |
| T09 | 630–690 (partial overlap) | false | AC4 | 630–690 shares 630–660 with the booking |
| T10 | 570–690 (contains booking) | false | AC4 | 570–690 covers all of 600–660 |
| T11 | 615–645 (inside booking) | false | AC4 | 615–645 lies completely inside 600–660 |
| T12 | 600–660 (identical interval) | false | AC4 | 600–660 is the same minutes as the booking |
| T13 | 660–720, blocked = true | false | AC3 | 660–720 would be fine, but the room is blocked, and a blocked room rejects every request |
| T14 | 630–690, bookings = [] | true | AC4 | 630–690 overlapped only the booking, which is gone now, and the request is after now and 60 minutes long |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | checking must only read the bookings; an Available call is the one that could add the new slot, so that is the call to watch |
| X1 | 1380–1440, bookings = [] (ends exactly at 24:00) | true | AC1 | end may be 1440; the other end of the day from T05, one hour long and after now |
| X2 | 720–780, bookings = [{600, 660}, {700, 760}] (two bookings) | false | AC4 | it is clear of the first booking but shares 720–760 with the second, so every booking must be checked, not only the first |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Default fixture: now = 540 (09:00), blocked = false, bookings = [{ start: 600, end: 660 }]. Change only what the row says.

| ID | Candidate start–end / changed input | Expected | Requirement |
| --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |
| T02 | 540–570 (starts now) | false | AC1 |
| T03 | 720–720 (zero duration) | false | AC1 |
| T04 | 750–720 (reversed) | false | AC1 |
| T05 | 1380–1441 (past day end) | false | AC1 |
| T06 | 720–840 (120 minutes) | true | AC2 |
| T07 | 720–841 (121 minutes) | false | AC2 |
| T08 | 570–600 (touching before) | true | AC4 |
| T09 | 630–690 (partial overlap) | false | AC4 |
| T10 | 570–690 (contains booking) | false | AC4 |
| T11 | 615–645 (inside booking) | false | AC4 |
| T12 | 600–660 (identical interval) | false | AC4 |
| T13 | 660–720, blocked = true | false | AC3 |
| T14 | 630–690, bookings = [] | true | AC4 |
| AC5 | an Available request; the bookings after the call equal the bookings before | true, data unchanged | AC5 |
| X1 | 1380–1440, bookings = [] (ends exactly at 24:00) | true | AC1 |
| X2 | 720–780, bookings = [{600, 660}, {700, 760}] (two bookings) | false | AC4 |

The function, in src/booking.ts (the test file will be src/booking.test.ts):

```ts
// The booking decision, extracted from src/lib/validation.ts (Practice #07, Task 1).
// Same conditions as the page used before; it only answers true (Available) or false (Unavailable).

export type Interval = { start: number; end: number };

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}): boolean {
  if (!(Number.isFinite(start) && Number.isFinite(end))) return false;
  if (start < 0 || start >= 1440) return false;
  if (end < 0 || end > 1440) return false;
  if (start >= end) return false;
  if (start <= now) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  if (bookings.some((b) => start < b.end && b.start < end)) return false;
  return true;
}
```
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
I'll write `src/booking.test.ts` against the case table, with one fresh fixture per test and a mutation check on every row.

The test file is `booking.test.ts`; save it as `src/booking.test.ts`. I haven't run it, but I traced every row through `canBook` by hand, and each expected value matches what the code returns.

**Run command**
```
npx vitest run src/booking.test.ts
```
If Vitest isn't installed yet, run `npm i -D vitest` first.

**How the requirements are met**
- **Real function:** the test imports `canBook` from `./booking` and doesn't touch its code.
- **Fixed time:** every case uses `now = 540`. The system clock is also frozen at an unrelated moment, so any hidden use of `Date.now()` would show up as a failure.
- **Fresh fixtures:** `makeInput()` builds a new object and new booking objects for every test.
- **Exact decisions:** results are checked with `toBe(true)` or `toBe(false)`, not truthy/falsy checks.
- **Unchanged data:** every row, not just the AC5 row, checks that the bookings array is the same object, holds the same element objects and has the same values after the call.

**AC mapping**

| AC | Covered by |
| --- | --- |
| AC1 | T02, T03, T04, T05, X1 |
| AC2 | T06, T07 |
| AC3 | T13 |
| AC4 | T01, T08, T09, T10, T11, T12, T14, X2 |
| AC5 | the AC5 block (Available and Unavailable cases, repeated calls), plus the data check on every row |
| AC6 | **Not covered.** It's a UI requirement and needs component or end-to-end tests. |

**Unclear requirements to flag**
1. **Which code the page uses:** the comment in `booking.ts` says the function was extracted from `src/lib/validation.ts`. Please confirm the page now imports `src/booking.ts` and not the old copy, or these tests check code the page doesn't run.
2. **AC5 wording vs. what's testable:** AC5 asks the page to "show a clear Available / Unavailable decision." The function only returns a boolean, so the label text and how it's displayed remain untested.
3. **AC6 has no measurable criteria:** "usable at narrow width" and "understandable feedback" need concrete terms before anyone can test them, such as which breakpoints and which messages for which failure.
4. **Validation feedback vs. a boolean:** AC6 implies the user is told *why* a request was rejected (past time, too long, blocked, overlap). `canBook` returns only true or false, so it's unclear where that reason comes from.
5. **Rules the code enforces but no AC states:** non-finite inputs (NaN, Infinity) are rejected, and fractional minutes like 600.5 are accepted. The spec should say whether both are intended.
6. **No minimum length:** only zero-length bookings are rejected, so a 1-minute booking is valid. The spec should confirm that.
7. **Time model:** times are assumed to be minutes on the same day as `now`. Nothing covers bookings that cross midnight, a `now` outside 0–1440, or malformed existing bookings (e.g. reversed ones).
8. **Rule order:** a request that breaks several rules (blocked *and* overlapping, say) gives the same false either way. Order only matters if a reason is shown to the user.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | The whole file: `it.each(rows)` over T01–X2 | Table-driven: one test body for 16 cases, so a single failure hides which ID broke, and the lab needs one named test per ID | revise | Lab rule (one test per case, ID in the title); the expected values themselves match AC1–AC4, so I kept every one of them |
| 2 | `beforeEach`: `vi.useFakeTimers()` and `vi.setSystemTime(new Date(...))` | A fake clock is not needed, because `now` is a parameter; it adds a `Date` to the suite and hides that the decision depends only on the supplied `now` | reject | AC1 "after the supplied current time": fixed time means a fixed `now = 540`, not a faked system clock |
| 3 | AC5 checks after every row on a single booking `[{600, 660}]` | With one booking an in-place `sort()` changes nothing visible, so a mutating `canBook` could still pass (weak test: *expected = current output* of a one-item array) | revise | AC5: I kept the before/after comparison and added N06 (unsorted bookings) and N07 (frozen array) |
| 4 | Expected values of T01–T14, X1, X2 | Checked each against my plan in §3: all equal, none copied from the code | accept | AC1–AC4 decide them, not `canBook` |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
C:\Users\sulta\se-practice\week-07\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-07/app

 ✓ src/booking.test.ts (19)
   ✓ canBook — reviewed case table (16)
     ✓ 'T01' ('AC4'): '660–720 touching after
' → true
     ✓ 'T02' ('AC1'): '540–570 starts now' →
false
     ✓ 'T03' ('AC1'): '720–720 zero duration'
 → false
     ✓ 'T04' ('AC1'): '750–720 reversed' → fa
lse
     ✓ 'T05' ('AC1'): '1380–1441 past day end
' → false
     ✓ 'T06' ('AC2'): '720–840 exactly 120 mi
 ✓ src/booking.test.ts (19)
   ✓ canBook — reviewed case table (16)
     ✓ 'T01' ('AC4'): '660–720 touching after' → true
     ✓ 'T02' ('AC1'): '540–570 starts now' → false
     ✓ 'T03' ('AC1'): '720–720 zero duration' → false
     ✓ 'T04' ('AC1'): '750–720 reversed' → false
     ✓ 'T05' ('AC1'): '1380–1441 past day end' → false
     ✓ 'T06' ('AC2'): '720–840 exactly 120 minutes' → true
     ✓ 'T07' ('AC2'): '720–841 121 minutes' → false
     ✓ 'T08' ('AC4'): '570–600 touching before' → true
     ✓ 'T09' ('AC4'): '630–690 partial overlap' → false
     ✓ 'T10' ('AC4'): '570–690 contains booking' → false
     ✓ 'T11' ('AC4'): '615–645 inside booking' → false
     ✓ 'T12' ('AC4'): '600–660 identical interval' → false
     ✓ 'T13' ('AC3'): '660–720 room blocked' → false
     ✓ 'T14' ('AC4'): '630–690 no bookings' → true
     ✓ 'X1' ('AC1'): '1380–1440 ends exactly at 24:00, no b…' → true
     ✓ 'X2' ('AC4'): '720–780 overlaps second of two bookin…' → false
   ✓ canBook — AC5: decision without changing booking data (3)
     ✓ AC5: an Available request returns true and leaves bookings equal to before
     ✓ AC5: an Unavailable request returns false and leaves bookings equal to before
     ✓ AC5: repeated calls give the same decision (no hidden state)

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  20:54:57
   Duration  2.27s (transform 73ms, setup 0ms, collect 96ms, tests 12ms, environment 0ms, prepare 348ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none (all 19 passed) | My very first attempt did not reach the tests: `npx vitest run` downloaded vitest 5.1.0 and stopped with "Cannot find package 'vite' imported from vite.config.ts" (import / runner error), because I had run `npm install` before adding Vitest to `package.json` | Path, dependency, config | neither (setup fix) | Ran `npm install` again with the new `package.json` (vitest 2.1.9); the run above is the first real run of the suite: 19 passed |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

C:\Users\sulta\se-practice\week-07\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-07/app

 ✓ src/booking.test.ts (19)
   ✓ canBook — reviewed case table (16)
     ✓ 'T01' ('AC4'): '660–720 touching after
' → true
     ✓ 'T02' ('AC1'): '540–570 starts now' →
false
     ✓ 'T03' ('AC1'): '720–720 zero duration'
 → false
     ✓ 'T04' ('AC1'): '750–720 reversed' → fa
lse
     ✓ 'T05' ('AC1'): '1380–1441 past day end
' → false
     ✓ 'T06' ('AC2'): '720–840 exactly 120 mi
 ✓ src/booking.test.ts (19)
   ✓ canBook — reviewed case table (16)
     ✓ 'T01' ('AC4'): '660–720 touching after' → true
     ✓ 'T02' ('AC1'): '540–570 starts now' → false
     ✓ 'T03' ('AC1'): '720–720 zero duration' → false
     ✓ 'T04' ('AC1'): '750–720 reversed' → false
     ✓ 'T05' ('AC1'): '1380–1441 past day end' → false
     ✓ 'T06' ('AC2'): '720–840 exactly 120 minutes' → true
     ✓ 'T07' ('AC2'): '720–841 121 minutes' → false
     ✓ 'T08' ('AC4'): '570–600 touching before' → true
     ✓ 'T09' ('AC4'): '630–690 partial overlap' → false
     ✓ 'T10' ('AC4'): '570–690 contains booking' → false
     ✓ 'T11' ('AC4'): '615–645 inside booking' → false
     ✓ 'T12' ('AC4'): '600–660 identical interval' → false
     ✓ 'T13' ('AC3'): '660–720 room blocked' → false
     ✓ 'T14' ('AC4'): '630–690 no bookings' → true
     ✓ 'X1' ('AC1'): '1380–1440 ends exactly at 24:00, no b…' → true
     ✓ 'X2' ('AC4'): '720–780 overlaps second of two bookin…' → false
   ✓ canBook — AC5: decision without changing booking data (3)
     ✓ AC5: an Available request returns true and leaves bookings equal to before
     ✓ AC5: an Unavailable request returns false and leaves bookings equal to before
     ✓ AC5: repeated calls give the same decision (no hidden state)

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  20:54:57
   Duration  2.27s (transform 73ms, setup 0ms, collect 96ms, tests 12ms, environment 0ms, prepare 348ms)

--- Assistant's answer ---
I'll review the suite against the ACs and the reviewed table, then deliver a revised test file.

The output you pasted has no failures: all 19 tests pass. The top block is the same report printed twice, with the first copy wrapped and cut off by the terminal, so it isn't extra tests. With nothing failing, the output gives no evidence for any implementation change. This review is based on reading the suite against AC1–AC6 and the case table.

## Incorrect expectations
There are none. All 16 table rows and the AC5 row match the ACs, and I left every expectation as it was. I also checked that each "false" row fails for only one reason. T13 has a valid interval apart from the blocked room, and T05 only breaks the end-of-day limit, so each row tests the rule it is labelled with.

## Test repairs

**Weak assertions**

1. **Unspecified default interval:** the old fixture defaulted to 0–0, so a row that forgot `start` or `end` would get "false" for the wrong reason and still pass. The new `Overrides` type requires both. This stops a test from passing silently when it never tested its own case (AC1–AC4).
2. **In-place sorting went unnoticed:** the data check compared values after the call. With one booking, or bookings already in order, an in-place `bookings.sort()` changes nothing visible. The bookings are now frozen, so any write throws, and the new row N06 uses unsorted bookings. This catches a function that changes the booking data while deciding (AC5).
3. **The clock check depended on the time zone:** the old setup froze the clock at 23:30 UTC, and whether hidden clock use showed up depended on the machine's time zone. The new test runs the same request with the clock at local midnight and local noon and expects the same answer. Hidden use of `Date.now()` instead of the supplied `now` would give different answers (AC1).

**Duplicated cases**

4. **Redundant AC5 tests:** the old "Unavailable keeps data" test repeated T09 and the per-row data check. I replaced it with a test that runs an Unavailable call and then an Available call on the same frozen bookings. That catches a function that keeps state between calls, which no other test covers (AC5).
5. **Kept on purpose:** T01 and T13 share an interval, and so do T09 and T14. These are control pairs, where only one input changes, so they aren't duplicates.

**Missing boundaries** (added as N01–N06, outside the reviewed table)

| ID | Case | AC | Defect it detects |
| --- | --- | --- | --- |
| N01 | 541–570 → true | AC1 | Rejecting a start one minute after `now` (an off-by-one; T02 only checks `start = now`) |
| N02 | 480–510 → false | AC1 | Rejecting only `start === now` and accepting starts in the past |
| N03 | 659–720 → false | AC4 | Treating a 1-minute overlap at the booking's end as a touch (the other side of T01) |
| N04 | 570–601 → false | AC4 | The same at the booking's start (the other side of T08) |
| N05 | overlaps the first of two bookings → false | AC4 | Checking only the last booking (X2 only covers an overlap with the last one) |
| N06 | unsorted bookings, free slot → true | AC5 | Sorting or otherwise changing the booking data while deciding |

## Implementation fixes
No fixes are justified. Every test passes, and I found nothing in `canBook` that breaks an AC. `src/booking.ts` stays unchanged.

## Still unclear or untestable
- **AC1 lower bound:** "0 ≤ start" can't be observed while `now` is 0 or more, because a negative start is already rejected as not after `now`. Testing it would need a negative `now`, which the spec doesn't define. I left it untested rather than invent valid input.
- **AC6:** layout and validation messages need component or end-to-end tests with concrete criteria (breakpoints, message text for each failure).
- **Rules no AC states:** inputs that aren't finite numbers (NaN, Infinity) and fractional minutes aren't covered by any AC, so I added no tests for them.

The run command is the same: `npx vitest run src/booking.test.ts`. Expect 25 tests: 16 table rows, 6 added rows, 1 AC5 row, 1 state test and 2 clock tests.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
C:\Users\sulta\se-practice\week-07\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-07/app

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
   Start at  21:11:20
   Duration  887ms (transform 58ms, setup 0ms, collect 82ms, tests 6ms, environment 0ms, prepare 212ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | — |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5, N07 | — |
| M3 | Remove the blocked-room rejection | Detected | T13 | — |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
=== M1: if (end - start >= 120) return false; ===
C:\Users\sulta\se-practice\week-07\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-07/app

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
     ✓ T01 AC4: 660-720 touching after the bo
oking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the
 day
     × T06 AC2: 720-840 exactly 120 minutes i
s allowed
     ✓ T07 AC2: 720-841 is 121 minutes
     ✓ T08 AC4: 570-600 touching before the b
 ❯ src/booking.test.ts (24)
   ❯ canBook - the case plan T01-T14 (14)
     ✓ T01 AC4: 660-720 touching after the booking is allowed
     ✓ T02 AC1: 540-570 starts exactly now
     ✓ T03 AC1: 720-720 zero duration
     ✓ T04 AC1: 750-720 reversed
     ✓ T05 AC1: 1380-1441 past the end of the day
     × T06 AC2: 720-840 exactly 120 minutes is allowed
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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T06 AC2: 720-840 exactly 120 minutes is allowed
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:32:38
     30|   });
     31|   test('T06 AC2: 720-840 exactly 12…
     32|     expect(canBook(input(720, 840))…
       |                                      ^
     33|   });
     34|   test('T07 AC2: 720-841 is 121 min…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 23 passed (24)
   Start at  21:08:37
   Duration  1.42s (transform 59ms, setup 0ms, collect 83ms, tests 14ms, environment 0ms, prepare 261ms)

=== M2: start <= b.end && b.start <= end ===
C:\Users\sulta\se-practice\week-07\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-07/app

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
     ✓ N06 AC5: unsorted bookings stay in their order after an Available request
     × N07 AC5: frozen bookings - an Available call writes nothing (a write would throw)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯

 Test Files  1 failed (1)
      Tests  4 failed | 20 passed (24)
   Start at  21:09:46
   Duration  820ms (transform 58ms, setup 0ms, collect 82ms, tests 15ms, environment 0ms, prepare 232ms)

=== M3: the line 'if (blocked) return false;' removed ===
C:\Users\sulta\se-practice\week-07\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-07/app

 ❯ src/booking.test.ts (24)
   ❯ canBook - the case plan T01-T14 (14)
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
 ❯ src/booking.test.ts (24)
   ❯ canBook - the case plan T01-T14 (14)
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
     × T13 AC3: 660-720 in a blocked room
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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook - the case plan T01-T14 > T13 AC3: 660-720 in a blocked room
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:53:57
     51|   });
     52|   test('T13 AC3: 660-720 in a block…
     53|     expect(canBook(input(660, 720, …
       |                                                         ^
     54|   });
     55|   test('T14 AC4: 630-690 with no bo…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 23 passed (24)
   Start at  21:10:09
   Duration  806ms (transform 58ms, setup 0ms, collect 81ms, tests 14ms, environment 0ms, prepare 248ms)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Room 202 (booking 10:00–11:00), current time 09:00, 11:00–12:00: green "Available — Room 202 is free for 11:00 AM – 12:00 PM (1 hr)"; the list still shows 10:00–11:00 and 3:00–4:00 PM | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Switched the room to Room 303 (Blocked) — the page has no separate blocked toggle, the blocked state belongs to the room: the red "Unavailable · Room is blocked: Under maintenance until 6:00 PM" replaced the green result | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Cleared the End field: the banner disappears and the panel says "Select a start and end time to see the availability decision." — understandable, but it is a hint, not an error message | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At 375 px (`ui-4.png`, portrait): room, Start, End and current-time inputs fit, the timeline labels are readable and the Available banner is visible | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Changed to 10:30–11:30 (Unavailable) and back to 11:00–12:00: Available again, and the bookings list still shows exactly 10:00–11:00 and 3:00–4:00 PM | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The last checker run has no FAIL or ERROR |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 19 / 19 / 0 | 24 / 24 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC4 on the plan's inputs, AC5 only with one booking; no off-by-one around `now`, no overlap of the first of two bookings; AC6 none | AC1–AC4 plus N01–N05 boundaries; AC5 with unsorted (N06) and frozen (N07) bookings; AC6 still none (manual U1–U5) |
| Selected mutants detected | not run on the first suite | 3 of 3 (M1 by T06, M2 by T01/T08/AC5/N07, M3 by T13) |
| Accepted / revised / rejected tests | — | all 17 expected values accepted; the `it.each` structure revised into 17 named tests; fake clock rejected; 7 tests added |
| Remaining limitations | fake system clock, table-driven | `canBook` accepts a reversed existing booking (§9.3); AC6 only checked by hand; fractional minutes untested |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

- I called `canBook({ start: 660, end: 720, now: 540, blocked: false, bookings: [{ start: 700, end: 650 }] })` and it returned **true** (returns-true). The overlap test `start < b.end && b.start < end` becomes `660 < 650 && 700 < 720`, and the first part is false, so the broken booking never counts as a conflict even though it "covers" minutes the request uses. No AC says what to do: AC4 only talks about valid existing bookings. I keep it as is, because the page only uses fictional, valid sample data, but a real system should validate the stored bookings before checking.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->

Claude's first suite passed 19/19, but I could not accept it as it was. It used `it.each`, and it faked the clock with `vi.useFakeTimers` and `new Date`, which the lab rules do not allow. It also checked the bookings only with a single booking, so a `canBook` that sorted the array in place would still pass. I noticed this when I compared the tests with AC5: the array was compared after the call, but with one item a sort changes nothing. The improvement answer added N01–N06 for these cases.

Then I tried the three mutants. All three were caught: M1 by T06, M2 by T01 and T08, and M3 by T13. This shows that the tests really check the AC rules, not just the current output of the code.

My conclusion is that a green suite proves only what it checks. AC6, how the page looks and works, is invisible to unit tests, so I still need manual UI checks like U3 and U4.