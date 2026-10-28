# Week 05 — Lab report

**Name:** Saltanat Sultanakhmet
**Group:** Monday 16.00-19.00
**Date:** 2026-10-11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Claude |
| **Exact** model name | Claude Sonnet 5.5 |
| Language and version | Python 3.14.3 |
| Path | A |
| My Week 04 declaration for touching bookings | did not submit |

I did not submit a Week 04 model, so there is no declaration about touching bookings to compare with AC4. Nothing changes in my Week 04 diagrams.

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

````text
# Implementation plan for `can_book`

## Checks, in order
Each check returns `False` immediately on failure. If all pass, return `True`.

1. **Time range (AC1):** `0 <= start < end <= 1440`.
2. **Not in the past (AC1):** `start > now` (strict).
3. **Duration (AC2):** `end - start <= 120`.
4. **Room availability (AC3):** `blocked` is `False`.
5. **Overlap (AC4):** loop through `existing`. For each `(s, e)`, treat it as a conflict if `start < e and s < end`. Any conflict returns `False`.
6. **Pass (AC5):** return `True`.

The order doesn't change the result, since AC5 is a plain AND of all the rules. I put the cheap checks first so the loop only runs when it has to.

## Assumptions
- Times are plain integers, and `existing` is an iterable of `(start, end)` tuples with `s < e`, as the contract states. I won't re-validate `existing` or `now`.
- `existing` may be empty, which means no conflict.
- Existing bookings may touch or be adjacent to each other. This doesn't matter, because each one is compared independently against the request.
- Intervals are half-open `[start, end)`, so the overlap test uses strict inequalities. That is what makes touching endpoints legal.
- Nothing is mutated. I only read `existing` and don't sort it or remove items. I'd also return a plain `bool`, not a truthy value.
- A request starting at exactly `now` is rejected, because AC1 says `start > now`. A duration of exactly 120 is accepted.
- Saving, confirmation, and any other room-level logic are out of scope.

## Boundary cases that could expose bugs

| Area | Case | Expected |
|---|---|---|
| Range | `start=0, end=60, now=0` | `False` (start not > now) |
| Range | `start=0, end=60, now=` any valid | depends on now; `start=0` can never pass since `now >= 0` |
| Range | `start=1380, end=1440, now=600` | `True` (end of day allowed) |
| Range | `end=1441` or `start=-1` | `False` |
| Range | `start == end` or `start > end` | `False` |
| Now | `start = now` vs `start = now + 1` | `False` / `True` |
| Duration | 120 min vs 121 min | `True` / `False` |
| Duration | 1 min booking | `True` |
| Blocked | otherwise valid request, `blocked=True` | `False` |
| Overlap | existing `(600, 660)`, request `(540, 600)` | `True` (touches at the end) |
| Overlap | existing `(600, 660)`, request `(660, 720)` | `True` (touches at the start) |
| Overlap | request `(599, 601)` or `(659, 700)` | `False` (1-minute overlap) |
| Overlap | request fully inside existing | `False` |
| Overlap | request fully contains existing | `False` |
| Overlap | identical interval | `False` |
| Overlap | conflict is not the first item in `existing` | `False` (catches bugs that only check the first or last item) |
| Overlap | gap between two existing bookings, request fits exactly | `True` |
| Purity | call with `existing` as a list, check it afterwards | unchanged, same order |
| Empty | `existing = []` | no effect on the result |

Common mistakes to watch for are `<=` where `<` is needed in the overlap test (which would reject touching bookings), `start >= now`, `duration < 120`, and `end < 1440`, which would wrongly reject a booking ending at midnight.
````

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Steps 1-6: range, `start > now`, duration <= 120, not blocked, overlap loop `start < e and s < end`, return True | Steps 1-2 = AC1, step 3 = AC2, step 4 = AC3, step 5 = AC4, step 6 = AC5 | Checked every step against its AC, no invented rule. "Cheap checks first" is a style remark, not a rule, so I kept it |
| 2 | Assumption: "Existing bookings may touch or be adjacent to each other" | The contract only says `existing` holds valid `(start, end)` tuples. It says nothing about them touching | Harmless: each booking is compared on its own and the function does not depend on it. Kept as an observation, no code rule added |
| 3 | Boundary case: request `(540, 600)` against existing `(600, 660)` expects `True` | AC1 requires `start > now`. In the lab's base input `now=540`, so `start=540` is rejected by AC1, not tested by AC4 | The plan did not state `now`. I will test this case with `now=500` so that only AC4 decides |
| 4 | Boundary table row: `start=0, end=60, now=` any valid | `now` is 0-1439 and AC1 needs `start > now`, so `start=0` can never pass | The row is vague (no concrete `now`), but its note is right. I will use it in section 9.3 |

**Boundary cases the assistant suggested that I kept as tests:**

- `start = now` is False, `start = now + 1` is True
- `start == end` and `start > end` are False
- `end = 1440` is True, `end = 1441` is False
- 120 minutes is True, 121 is False
- `blocked=True` with an otherwise valid request is False
- touching on either side is True, one minute of overlap is False
- request inside the existing booking, request containing it, and identical interval are False
- conflict not in the first item of `existing` is False
- an exact gap between two bookings is True
- `existing = []` is True
- `existing` is unchanged after the call

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

I read v1 line by line against AC1-AC5 before running anything. v1 was committed before any change.

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440):` | AC1, first part | Yes: keeps the booking inside the day (`end == 1440` allowed) and rejects zero-length and reversed intervals |
| 2 | `if start <= now:` | AC1, second part | Yes: it is `start > now` turned around, so `start == now` is rejected, as AC1 requires |
| 3 | `if end - start > 120:` | AC2 | Yes: `>` and not `>=`, so exactly 120 minutes is allowed |
| 4 | `if blocked:` | AC3 | Yes: a blocked room returns False whatever the times are |
| 5 | `if start < e and s < end:` | AC4 | Yes: strict comparisons on half-open intervals, so touching endpoints are allowed, while partial overlap, inside, containing and identical intervals are rejected |
| 6 | `return True` and the five `return False` lines | AC5 | Yes: literal booleans, `True` is reached only when AC1-AC4 hold; the loop only reads `existing` |

What I expected before running v1: every comparison in the six rows has the right strictness, so I expect v1 to pass all six table cases. I cannot be sure about the hidden checks until the checker runs.

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- Nothing. There is no extra validation, no buffer, no logging, no saving, and the return type is bool.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | nothing (task table case) | True | AC4 | pass | pass |
| 2 | test_overlap_is_rejected | (630, 690) | nothing (task table case) | False | AC4 | pass | pass |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True (task table case) | False | AC3 | pass | pass |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | nothing (task table case) | True | AC2 | pass | pass |
| 5 | test_over_two_hours_is_rejected | (720, 841) | nothing (task table case) | False | AC2 | pass | pass |
| 6 | test_start_equal_to_now_is_rejected | (540, 570) | nothing (task table case) | False | AC1 | pass | pass |
| 7 | test_zero_length_is_rejected | (700, 700) | existing=[] | False | AC1 | pass | pass |
| 8 | test_reversed_times_are_rejected | (720, 700) | existing=[] | False | AC1 | pass | pass |
| 9 | test_end_after_day_is_rejected | (1380, 1441) | existing=[] (61 min, so AC2 is not the reason) | False | AC1 | pass | pass |
| 10 | test_booking_ending_exactly_at_day_end_is_allowed | (1380, 1440) | existing=[] | True | AC1 | pass | pass |
| 11 | test_last_minute_slot_is_allowed | (1439, 1440) | existing=[] | True | AC1 | pass | pass |
| 12 | test_start_just_after_now_is_allowed | (541, 600) | existing=[] | True | AC1 | pass | pass |
| 13 | test_empty_existing_allows_valid_request | (700, 760) | existing=[] | True | AC4, AC5 | pass | pass |
| 14 | test_conflict_with_last_of_several_bookings | (820, 880) | existing=[(600, 660), (700, 760), (800, 860)] | False | AC4 | pass | pass |
| 15 | test_conflict_with_middle_of_several_bookings | (710, 750) | existing=[(600, 660), (700, 760), (800, 860)] | False | AC4 | pass | pass |
| 16 | test_exact_gap_between_several_bookings_is_allowed | (600, 660) | now=500, existing=[(540, 600), (660, 720)] | True | AC4 | pass | pass |
| 17 | test_new_inside_existing_is_rejected | (615, 645) | nothing | False | AC4 | pass | pass |
| 18 | test_new_contains_existing_is_rejected | (570, 690) | nothing | False | AC4 | pass | pass |
| 19 | test_identical_interval_is_rejected | (600, 660) | nothing | False | AC4 | pass | pass |
| 20 | test_touching_start_is_allowed | (540, 600) | now=500, so AC1 does not decide | True | AC4 | pass | pass |
| 21 | test_one_minute_overlap_at_start_is_rejected | (599, 601) | nothing | False | AC4 | pass | pass |
| 22 | test_one_minute_overlap_at_end_is_rejected | (659, 700) | nothing | False | AC4 | pass | pass |
| 23 | test_existing_unchanged_after_true | (660, 700) | existing=[(700, 760), (600, 660)], list compared with a deep copy after the call | True, list unchanged | AC5 | pass | pass |
| 24 | test_existing_unchanged_after_false | (630, 690) | existing=[(700, 760), (600, 660)], list compared with a deep copy after the call | False, list unchanged | AC5 | pass | pass |
| 25 | test_nothing_can_be_booked_when_now_is_last_minute | (1439, 1440) | now=1439, existing=[] | False | AC1 | pass | pass |

Every test uses `assertIs(..., True/False)`, so a truthy value that is not a real Boolean would fail (AC5).

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(1439, 1440, 1439, False, [])` | False | False | No defect. `if start <= now:` rejects `start == now`, and `if not (0 <= start < end <= 1440):` forces `start <= 1439`, so with `now=1439` nothing can be booked, as AC1 requires | No change needed. Added as test 25 (`test_nothing_can_be_booked_when_now_is_last_minute`) after v1 passed everything | Me (no fix) |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

````text
````

v1 passed all my tests and all F checks, so I did not use the debug prompt (Prompt 3).

---

## 6. Task 5 — the critique

Note: I lost the original chat with the assistant before this step. I opened a new chat with the
same model (Claude Sonnet 5.5), sent the task block from README §3 as the first message, and then
sent the critique prompt unchanged with my final code (identical to v1) below it.

**The assistant's critique, pasted unedited:**

````text
I found no violations of the contract or AC1–AC5 in this implementation.

* AC1: `if not (0 <= start < end <= 1440):` and `if start <= now:` together require `0 <= start < end <= 1440` and `start > now`. Rejecting `start <= now` is the correct inverse of `start > now`.
* AC2: `if end - start > 120:` allows exactly 120 minutes and rejects 121.
* AC3: `if blocked:` rejects blocked rooms. The contract says `blocked` is a Boolean, so a truthiness check is fine.
* AC4: `if start < e and s < end:` is the standard overlap test for intervals that include the start and exclude the end. Bookings that only touch, like `(600, 660)` and `(660, 720)`, are correctly allowed.
* AC5: it returns `True` only after every check passes. `existing` is only iterated, and no inputs are reassigned or changed.

There is one minor point that isn't a violation of the criteria:

* Contract, "Times are integer minutes": `if not (0 <= start < end <= 1440):` doesn't check the type of `start` or `end`. A float such as `start=600.5` would pass. The contract describes times as integers but, unlike `now` and `existing`, doesn't say `start` and `end` are guaranteed valid. Whether this matters depends on whether callers can pass non-integers. If the system guarantees integers, no change is needed.
````

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | AC1 is correct: `start <= now` is the inverse of `start > now` | accept (no change) | AC1 says `start > now`; my tests 6, 12 and 25 check both sides of this bound and pass | no change, 25 tests OK |
| 2 | AC2 is correct: `end - start > 120` allows 120, rejects 121 | accept (no change) | AC2 "at most 120 minutes"; tests 4 and 5 check 120 and 121 | no change, 25 tests OK |
| 3 | AC3 is correct: `if blocked:` is fine because blocked is a Boolean | accept (no change) | Contract: "blocked is a Boolean"; test 3 | no change, 25 tests OK |
| 4 | AC4 is correct: `start < e and s < end` allows touching | accept (no change) | AC4 "Touching endpoints are allowed" and "Intervals include the start and exclude the end"; tests 1, 2, 17-22 | no change, 25 tests OK |
| 5 | AC5 is correct: True only after all checks, `existing` only iterated | accept (no change) | AC5 "never alter existing"; tests 23 and 24 compare the list with a deep copy | no change, 25 tests OK |
| 6 | No type check on `start` / `end`, so `600.5` passes | reject | Contract line "Times are integer minutes after midnight": integers are given by the caller. A type check would be a rule that no AC asks for, and AC5 only allows True/False, so raising an error is not wanted either. My decision is in section 9.2 | no change, 25 tests OK |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | Nothing changed: `code/booking.py` is identical to `code/original/booking_v1.py` | v1 passed all 25 of my tests and F1-F10; the only critique point that asked for something (type check) was rejected in section 6 | Checker: "v1 ... passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes" |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

````text
C:\Users\Saltanat\se-practice\week-05\code>python -m unittest -v
test_blocked_room_is_rejected (test_booking.TestCanBook.test_blocked_room_is_rejected) ... ok
test_booking_ending_exactly_at_day_end_is_allowed (test_booking.TestCanBook.test_booking_ending_exactly_at_day_end_is_allowed) ... ok
test_conflict_with_last_of_several_bookings (test_booking.TestCanBook.test_conflict_with_last_of_several_bookings) ... ok
test_conflict_with_middle_of_several_bookings (test_booking.TestCanBook.test_conflict_with_middle_of_several_bookings) ... ok
test_empty_existing_allows_valid_request (test_booking.TestCanBook.test_empty_existing_allows_valid_request) ... ok
test_end_after_day_is_rejected (test_booking.TestCanBook.test_end_after_day_is_rejected) ... ok
test_exact_gap_between_several_bookings_is_allowed (test_booking.TestCanBook.test_exact_gap_between_several_bookings_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.TestCanBook.test_exactly_two_hours_is_allowed) ... ok
test_existing_unchanged_after_false (test_booking.TestCanBook.test_existing_unchanged_after_false) ... ok
test_existing_unchanged_after_true (test_booking.TestCanBook.test_existing_unchanged_after_true) ... ok
test_identical_interval_is_rejected (test_booking.TestCanBook.test_identical_interval_is_rejected) ... ok
test_last_minute_slot_is_allowed (test_booking.TestCanBook.test_last_minute_slot_is_allowed) ... ok
test_new_contains_existing_is_rejected (test_booking.TestCanBook.test_new_contains_existing_is_rejected) ... ok
test_new_inside_existing_is_rejected (test_booking.TestCanBook.test_new_inside_existing_is_rejected) ... ok
test_nothing_can_be_booked_when_now_is_last_minute (test_booking.TestCanBook.test_nothing_can_be_booked_when_now_is_last_minute) ... ok
test_one_minute_overlap_at_end_is_rejected (test_booking.TestCanBook.test_one_minute_overlap_at_end_is_rejected) ... ok
test_one_minute_overlap_at_start_is_rejected (test_booking.TestCanBook.test_one_minute_overlap_at_start_is_rejected) ... ok
test_over_two_hours_is_rejected (test_booking.TestCanBook.test_over_two_hours_is_rejected) ... ok
test_overlap_is_rejected (test_booking.TestCanBook.test_overlap_is_rejected) ... ok
test_reversed_times_are_rejected (test_booking.TestCanBook.test_reversed_times_are_rejected) ... ok
test_start_equal_to_now_is_rejected (test_booking.TestCanBook.test_start_equal_to_now_is_rejected) ... ok
test_start_just_after_now_is_allowed (test_booking.TestCanBook.test_start_just_after_now_is_allowed) ... ok
test_touching_end_is_allowed (test_booking.TestCanBook.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.TestCanBook.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.TestCanBook.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 25 tests in 0.088s

OK
````

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

````text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (13 lines)
PASS   S1   your suite has at least 11 tests            25 tests
PASS   S2   your suite is green on your own code        25 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_nothing_can_be_booked_when_now_is_last_minute, test_start_equal_to_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_day_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_exact_gap_between_several_bookings_is_allowed, test_existing_unchanged_after_true, test_touching_end_is_allowed and 1 more
PASS   M7   your tests catch a fault in AC4             caught by test_conflict_with_last_of_several_bookings, test_conflict_with_middle_of_several_bookings, test_existing_unchanged_after_false
PASS   M8   your tests catch a fault in AC4             caught by test_new_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_unchanged_after_true
PASS   M10  your tests catch a fault in AC5             caught by test_existing_unchanged_after_false, test_existing_unchanged_after_true
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 23 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              6 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  25 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 6 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      168 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
````

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

````text
````

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The final run has 0 FAIL and 0 ERROR |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- My function does not handle it (`not-handled`). I ran both cases: `can_book(600.5, 660, 540, False, [])` returned `True`, and `can_book('600', 660, 540, False, [])` raised `TypeError: '<=' not supported between instances of 'int' and 'str'` on the line `if not (0 <= start < end <= 1440):`.
- I kept it this way on purpose. The contract says times are integer minutes, so making sure of that is the caller's job. Adding a type check would add a rule that no AC asks for, and raising my own error would go against AC5, which says the result is only True or False. If the system ever has to accept other input, that has to be a new acceptance criterion first, and then a test for it.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- The bound `0 <= start`. The contract says `now` is between 0 and 1439, and AC1 also needs `start > now`, so `start` is always at least 1 when the other rule holds. Any `start` below 0 is already rejected by `start > now`, so `0 <= start` never decides alone. (The plan's boundary table said the same: `start=0` can never pass because `now >= 0`.)

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

The overlap check in my code is `if start < e and s < end`. Two bookings only overlap when the new one starts before the old one ends and the old one starts before the new one ends. Both comparisons are strict, because the end minute isn't part of the booking. So for (660, 720) against (600, 660) the first part is 660 < 660, which is False, so touching bookings are allowed.
None of the ten faults got through my suite and all M checks passed. The weakest spots were M2 and M8, since each of them were caught by only one test: test_end_after_day_is_rejected and test_new_contains_existing_is_rejected. Like my other tests, each one checks a single AC boundary.
I had to decide myself what happens with 600.5 or "600". I left it unhandled, because the contract says times are integers, and I rejected the critique point about a type check since there is no AC that ask for it.