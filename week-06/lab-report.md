# Week 06 — Lab report

**Name:** Saltanat Sultanakhmet
**Group:** Monday 16:00-19:00
**Date:** 2026-10-18

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72156204 |
| Browser and version | Chrome BROWSER_VERSION |
| If you could not use Bolt.new: the tool you used instead, and why | - (Bolt.new was used) |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | v1 will use the computer's real clock instead of a current-time field, so I cannot supply 09:00 and T6 cannot be tested | AC1 | Yes. v1 shows "Current time baseline: 9:58 PM" from the real clock with only a "Refresh to real current time" link, so every daytime request was Unavailable and T6 was Not testable |
| 2 | v1 will have no way to mark the selected room as blocked, so T3 cannot be tested | AC3 | No. v1's sample data has Room 303 marked as blocked ("Under maintenance until 6:00 PM"), so T3 could be set up |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
Built the Smart Campus Room Availability Checker as a single responsive page using sample data only (no backend, auth, or analytics).

**How it works**
- Pick a room, a start time, and an end time. The page shows a clear **Available** or **Unavailable** decision with specific reasons when it's unavailable.
- A visual timeline shows existing bookings and your requested interval side by side so you can see overlaps at a glance.
- All six acceptance criteria are enforced: valid interval bounds, start after current time, max 120-minute bookings, blocked-room rejection, overlap detection (touching endpoints allowed), and read-only checks that never modify existing bookings. Layout adapts to mobile and desktop with inline validation feedback.

**Main files created**
- `src/lib/timeUtils.ts` — minute/label conversion helpers
- `src/lib/roomsData.ts` — fictional rooms and bookings
- `src/lib/validation.ts` — availability decision logic (AC1–AC5)
- `src/components/Timeline.tsx` — day timeline with bookings + request overlay
- `src/components/RoomChecker.tsx` — form, decision banner, bookings list
- `src/App.tsx` — renders the checker

The project builds successfully.
```

**What v1 does — one line per thing that works, or visibly does not:**

- Works: a room dropdown with four fictional rooms; Room 202 has the 10:00–11:00 booking the cases need, Room 303 is marked "(Blocked)".
- Works: Start and End `HH:MM` inputs, a duration label and a timeline that draws the existing bookings and the request.
- Works: a red "Unavailable" banner that lists every reason (e.g. "Start time must be earlier than end time.", "Booking cannot exceed 120 minutes.", "The requested interval overlaps an existing booking.").
- Works: the existing-bookings list is read-only, with the note "Checking availability does not modify these bookings."
- Does not work: the current time is always the real clock ("Current time baseline: 9:58 PM", only a "Refresh to real current time" link), so it cannot be supplied as 09:00 and every daytime request is Unavailable (AC1).
- Does not work well: at narrow width the timeline hour labels run into each other ("12 AM2 AM4 AM6 AM8 AM10 AM…") (AC6).
- The End input is an `HH:MM` time input, so 24:00 cannot be entered although AC1 allows end = 1440.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Unavailable | FINAL_T1 | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | FINAL_T2 | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | FINAL_T3 | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Unavailable | FINAL_T4 | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | FINAL_T5 | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable | FINAL_T6 | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | FINAL_T7 | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Unavailable | FINAL_T8 | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Unavailable | FINAL_T9 | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Functional (AC1): the current time cannot be supplied; v1 always uses the real clock | Room 202, Start 11:00, End 12:00 (case T1) → expected Available with the current time 09:00 → observed "Unavailable · Start time must be after the current time." with "Current time baseline: 9:58 PM" and no input to change it. The same reason blocks T1, T4, T8, T9, and T6 is Not testable (`evidence/issue-1.png`) | High | Fix |
| 2 | Usability (AC6): timeline hour labels overlap at narrow width | Room 202, 11:00–12:00, browser window about 460 px wide (case T9) → expected a readable timeline on a narrow screen → observed the axis labels run together as "12 AM2 AM4 AM6 AM8 AM10 AM2 PM2 PM4 PM…" and cannot be read (`evidence/issue-2.png`) | Medium | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
(paste here)
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
(paste here)
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `(write here, e.g. src/App.tsx)`

<!-- Write your explanation below this line -->

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

-

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
