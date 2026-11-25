# Week 11 — Lab report

**Name:** Saltanat Sultanakhmet
**Group:** Monday 16:00-19:00
**Date:** 2026-11-25

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I built the feature with (tool) | Claude (claude.ai web, a zip of `app/` uploaded) |
| Its exact model (with its version, or `not displayed`) | Claude Opus 5.5 |
| Assistant I reviewed with (tool) | Claude (claude.ai web, a fresh chat with pasted files, no edit access) |
| Its exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 |
| Starting point (`week-10` or `week-08`) | week-10 |
| Baseline commit — the checkpoint of Part 0 | 4a47a66 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows, cmd) |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-11/app/` before any change. **Exists:** `yes` or `no`. **Result:**
`pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 27 passed (27), see 2.2 |
| `npm run build` | yes | pass | `vite build`, built in 2.21s |
| `npm run lint` | yes | fail | 1 error: `'minutesToLabel' is defined but never used` in `src/components/RoomChecker.tsx` line 5 (Week 10 risk R4, not fixed) |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-11/app/`, before any change:

```text
C:\Users\sulta\se-practice\week-11\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-11/app

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
     ✓ T14 AC4: 630-690 with no bookings
   ✓ canBook - AC5 and my own cases (3)
     ✓ AC5: an Available request leaves the b
ookings equal to before
     ✓ X1 AC1: 1380-1440 ends exactly at 24:0
 ✓ src/booking.test.ts (27)
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
   ✓ canBook - Practice #10 regression test for risk R2 (1)
     ✓ R2 AC4: a malformed booking 700-600 (end before start) does not let 620-680 through as Available

 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  20:43:24
   Duration  1.04s (transform 41ms, setup 0ms, collect 46ms, tests 3ms, environment 0ms, prepare 153ms)
```

### 2.3 What I located

| What | Where (file, and the function or component name) |
| --- | --- |
| The availability function | `src/booking.ts` - `canBook` (with `unavailableReasons` behind it since Week 10); `src/lib/validation.ts` `evaluateAvailability` gives the page its reasons |
| The UI component | `src/components/RoomChecker.tsx` - `RoomChecker` (rendered by `src/App.tsx`) |
| The repository instructions | `app/AGENTS.md` (the version patched in Week 10) |

---

## 3. Task 2 — the feature, defined before the code

### 3.1 The user story

<!-- The deck's sentence, exactly. -->
As a student, I want a short explanation of room availability so I understand the decision.

### 3.2 The contract

One row per field. **Validation** is what you reject, and how.

| Field | Direction | Type / format | Validation |
| --- | --- | --- | --- |
| `roomLabel` | input | string | trimmed; rejected if empty or longer than 60 characters, or not a string; treated as data, never as instructions |
| `start` | input | string "HH:MM" | rejected unless it matches `^([01]\d|2[0-3]):[0-5]\d$` (or `24:00` for `end`) |
| `end` | input | string "HH:MM" | same format check as `start`; `24:00` allowed |
| `isAvailable` | input | boolean, from `canBook` | rejected if not a boolean; never changed by the adapter |
| `reasonCode` | input | one of `invalid_time`, `past_time`, `too_long`, `room_blocked`, `overlap`, `available`, from `availabilityReason` | rejected if not one of the six; rejected if it disagrees with `isAvailable` (`available` only with `true`) |
| `explanation` | output | string | shown only if: not empty, at most 280 characters, at most two sentences, says available / unavailable in agreement with `isAvailable`, and every `HH:MM` in it is the request's `start` or `end`; otherwise the fallback is shown |

### 3.3 Acceptance criteria and failure behaviour

F1–F5 (README §3.4), then what the student sees in each failure:

<!-- Write below this line -->
- **F1** Existing availability and overlap rules remain unchanged.
- **F2** The explanation agrees with the deterministic result; no invented booking details.
- **F3** Empty, malformed or overly long input is rejected.
- **F4** API timeout, error or unavailable key produces a safe fallback.
- **F5** A user can distinguish generated explanation from confirmed booking status.

| Failure | What the student sees |
| --- | --- |
| Invalid input (empty, malformed, too long) | The status line (Available / Unavailable from `canBook`) stays as it is; under it: "Explanation unavailable: the request could not be explained." The adapter is not called. |
| The model times out | After the timeout, the fallback sentence built from the reason code (e.g. "Unavailable: the time overlaps an existing booking."), marked as a fallback; the status line is unchanged. |
| The model fails (error, no key) | The same fallback sentence, marked as a fallback; no error text from the adapter is shown. |
| The model's answer contradicts the decision, or invents a detail | The answer is thrown away by the output check and the fallback sentence is shown instead; the status line always comes from `canBook`. |

### 3.4 The flow

A written flow with arrows (`->`), or a diagram in a code block. Name your checker function and the
adapter, and say which one decides availability.

```text
student input (room, start, end, now)
  -> validation (timeInput, room lookup)                          src/components/RoomChecker.tsx
  -> canBook(request)  +  availabilityReason(request)              src/booking.ts   <- DECIDES
       -> { isAvailable, reasonCode }
  -> status line on the page (Available / Unavailable)             shown before any explanation
  -> [button "Explain availability"]
  -> explainAvailability({ roomLabel, start, end, isAvailable, reasonCode }, mockAdapter, timeoutMs)
                                                                   src/explain.ts
       -> validate input      (bad -> fallback, adapter not called)
       -> mockAdapter(input) with a timeout   (timeout / error -> fallback)
       -> validate output     (contradicts or invents -> fallback)
  -> "Generated explanation (mock), not a booking decision"  shown apart from the status line

canBook / availabilityReason decide availability. The adapter only words the decision.
```

---

## 4. Task 3 — build it with an AI assistant

### 4.1 The implementation prompt and the answer

What you sent, exactly (the deck's prompt, and the contract if you sent it):

```text
(paste here)
```

The assistant's answer, pasted unedited (its description of each changed file is enough if the code
is long):

```text
(paste here)
```

### 4.2 Every changed file, decided

**Decision:** `accept`, `modify` or `reject`.

| File | What the assistant changed | Decision | Why |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |

### 4.3 The adapter

| | |
| --- | --- |
| The mock adapter (its name in `explain.ts`) | |
| The timeout (milliseconds) | |
| A real-model adapter too? (`no`, or `yes` and where it runs, and where its key lives) | |

---

## 5. Task 4 — prompt engineering

### 5.1 Three instructions

```text
A: (paste here)
```

```text
B: (paste here)
```

```text
C: (paste here)
```

### 5.2 The three inputs and the answers

The same three JSON inputs (`available`, `overlap`, `room_blocked`), sent after each prompt in a fresh
chat, and the answers, unedited:

```text
(paste here)
```

### 5.3 The comparison

**Clarity** and **consistency:** 1 (poor) to 3 (good). **Agrees with the facts:** `yes` or `no`.
**Invented:** what it made up (a time, a booking, a person), or `nothing`.

| Prompt | Clarity | Consistency | Agrees with the facts | Invented |
| --- | --- | --- | --- | --- |
| A | | | | |
| B | | | | |
| C | | | | |

### 5.4 The one I chose

**Chosen:** A / B / C

<!-- Why, from the table above. Then confirm it is in explain.ts as SYSTEM_INSTRUCTION. -->

---

## 6. Task 5 — tests

### 6.1 The test cases

**Verdict:** `pass`, `fail` or `not run`. **How:** the Vitest test title, or `manual` and what you did.

| ID | Case | Expected | Observed | Verdict | How |
| --- | --- | --- | --- | --- | --- |
| E1 | available | | | | |
| E2 | overlap | | | | |
| E3 | blocked room | | | | |
| E4 | invalid time | | | | |
| E5 | past time | | | | |
| E6 | empty input | | | | |
| E7 | long input | | | | |
| E8 | timeout | | | | |
| E9 | simulated API failure | | | | |
| UI | the UI never changes the deterministic decision | | | | |

### 6.2 The run after the feature

The real output of `npx vitest run` with `explain.test.ts` in place (before the review fixes):

```text
(paste here)
```

### 6.3 Screenshots

| File | What it shows |
| --- | --- |
| `evidence/explain-available.png` | |
| `evidence/explain-fallback.png` | |

---

## 7. Task 6 — the agentic code review

### 7.1 The reviewer and its context

Where it ran, how you made sure it could not edit, and what you gave it (the diff, README,
`AGENTS.md`, the criteria):

<!-- Write below this line -->

### 7.2 The review prompt and the answer

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The reviewer's answer, pasted unedited:

```text
(paste here)
```

### 7.3 The findings, verified

At least **three**; at least **two** `confirmed`. **Category:** `correctness`, `security`,
`maintainability`, `performance` or `tests`. **Severity:** `high`, `medium` or `low`. **Found by:**
`reviewer`, `me` or `both`.

| ID | Finding (short) | Category | Severity | File | How I verified it | Label | Found by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | | | | | | | |
| V2 | | | | | | | |
| V3 | | | | | | | |

### 7.4 My own inspection, and the linter

What you checked by hand that the reviewer did not, and which of these findings a linter would have
caught and which it could not:

<!-- Write below this line -->

---

## 8. Task 7 — repair and regression-test

### 8.1 The first fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.2 The second fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.3 The final run

The real output of the **full** suite after both fixes: the old booking tests and the feature tests
together. Every test must pass.

```text
(paste here)
```

### 8.4 Ready for demonstration?

**Ready:** yes / no

**What remains unresolved:**

<!-- Write below this line -->

---

## 9. Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Reflection

<!-- 80-150 words, in your own words, without the assistant: what the AI generated, what you
     verified, and what you changed. Name at least one finding ID (V1...) and one test ID (E1...).
     Worthless: "AI helped me build the feature faster and the review was useful."
     Worth everything: "Bolt wrote explain.ts and put a fetch to the OpenAI API in App.tsx with a
     VITE_ key; I rejected that file and kept the mock (X4). The reviewer's V3, 'prompt injection
     through roomLabel', was unsupported: the label comes from a fixed list. E8 failed at first
     because the timeout was never armed; V1 was confirmed by a test that failed before the fix." -->

<!-- Write your reflection below this line -->
