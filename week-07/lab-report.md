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
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | VITEST_VERSION |
| Test command | npx vitest run |

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
| T01 | 660–720 (touching after) | true | AC4 || 660 is excluded from the booking 600–660, so 660–720 only touches it and nothing is shared |
| T02 | 540–570 (starts now) | false | AC1 || start 540 is not after now 540; equal to now is not "after" |
| T03 | 720–720 (zero duration) | false | AC1 || start 720 is not smaller than end 720, so the interval is empty |
| T04 | 750–720 (reversed) | false | AC1 || start 750 is after end 720, a reversed interval |
| T05 | 1380–1441 (past day end) | false | AC1 || end 1441 is past 1440 (24:00), outside the day |
| T06 | 720–840 (120 minutes) | true | AC2 || 720 to 840 is exactly 120 minutes, and only longer than 120 is rejected |
| T07 | 720–841 (121 minutes) | false | AC2 || 720 to 841 is 121 minutes, one minute too long |
| T08 | 570–600 (touching before) | true | AC4 || 600 is the start of the booking and the end of the request, so 570–600 only touches it |
| T09 | 630–690 (partial overlap) | false | AC4 || 630–690 shares 630–660 with the booking |
| T10 | 570–690 (contains booking) | false | AC4 || 570–690 covers all of 600–660 |
| T11 | 615–645 (inside booking) | false | AC4 || 615–645 lies completely inside 600–660 |
| T12 | 600–660 (identical interval) | false | AC4 || 600–660 is the same minutes as the booking |
| T13 | 660–720, blocked = true | false | AC3 || 660–720 would be fine, but the room is blocked, and a blocked room rejects every request |
| T14 | 630–690, bookings = [] | true | AC4 || 630–690 overlapped only the booking, which is gone now, and the request is after now and 60 minutes long |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 || checking must only read the bookings; an Available call is the one that could add the new slot, so that is the call to watch |
| X1 | 1380–1440, bookings = [] (ends exactly at 24:00) | true | AC1 | end may be 1440; the other end of the day from T05, one hour long and after now |
| X2 | 720–780, bookings = [{600, 660}, {700, 760}] (two bookings) | false | AC4 | it is clear of the first booking but shares 720–760 with the second, so every booking must be checked, not only the first |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
(paste here)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
(paste here)
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

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

