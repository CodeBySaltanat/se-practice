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

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes / no

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

-

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

````text
````

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

````text
(paste here)
````

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

````text
(paste here)
````

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

````text
(paste here)
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
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

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

<!-- Write your conclusion below this line -->