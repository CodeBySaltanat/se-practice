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
| T1 | Touching | 11:00–12:00 | Available | AC4 | Unavailable | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Unavailable | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Unavailable | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Unavailable | Available | final-T9.png |

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
| 3 | Scope / code quality: unused backend dependency | Open `package.json` in the exported project → expected no backend or database (scope: "no login, backend, database, or external API") → observed `"@supabase/supabase-js": "^2.57.4"` in `dependencies`, although no file in `src/` imports it; the checker's P3 flagged it as "backend or database" (`evidence/issue-3.png`) | Low | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, selecting Room 202 and entering Start 11:00 and End 12:00 produces "Unavailable – Start time must be after the current time" because the current time is always the real clock (Current time baseline: 9:58 PM) and cannot be set, but AC1 requires the decision to use a supplied current time: with the current time supplied as 09:00, 11:00–12:00 in Room 202 must be Available. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.

--- Bolt's answer ---
I'll make the current time editable so the decision uses the supplied value instead of being locked to the real clock.I'll replace the read-only baseline block with an editable current-time input plus the refresh button.Build passes.

**What changed and why:** I edited `src/components/RoomChecker.tsx` only. The "Current time baseline" was display-only and locked to the real clock, so the availability decision could never use a user-supplied current time (violating AC1's "supplied current time"). I replaced that read-only block with an editable time input bound to the same `nowMin` state, keeping the "use real current time" button as a convenience. The validation logic in `validation.ts` already compared against the `currentTime` argument, so no other files needed changes — Room 202 with a 09:00 baseline and 11:00–12:00 now evaluates to Available, and all other criteria (120-min max, blocked rooms, overlaps with touching-endpoint allowance, read-only bookings) remain intact.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
Review only the Timeline component (src/components/Timeline.tsx), its hour-axis labels at narrow/mobile width, for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.

--- Bolt's answer ---
The hour-axis labels are cramped at narrow widths: 13 labels (every 2 hours) jam together, and stripping `:00` turns noon into "12 PM" but midnight into "12 AM" with no clear visual anchor. A small cleanup — label every 4 hours instead and keep a consistent `00` suffix off — preserves all acceptance criteria (it's purely decorative scale) and improves mobile readability.Build passes.

**Cleanup:** In `src/components/Timeline.tsx`, the hour axis showed a label every 2 hours (13 labels) with the `:00` stripped, which crowded together on mobile and produced inconsistent-looking values. I switched to a label every 4 hours with the full `H:MM AM/PM` format and `whitespace-nowrap` so they stay legible at narrow widths. This is purely the timeline's decorative scale — it doesn't touch interval validation, the availability decision, or the booking data, so AC1–AC6 are preserved.
```

Add further blocks for further prompts.

**Second cleanup prompt (issue 3), as sent, and Bolt's answer:**

```text
Review only the dependencies in package.json (the "@supabase/supabase-js" entry, which no file in src/ imports) for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.

--- Bolt's answer ---
Confirmed nothing in the project imports `@supabase/supabase-js`. The app is a one-page, in-memory prototype per the original constraints (no backend, no auth, no persistence). The dependency is dead weight. Removing it preserves AC1–AC6 since no code references it.Build passes.

**Cleanup:** No file in `src/` imports `@supabase/supabase-js`, so the dependency was unused. I removed it from `package.json`. This is purely a dependency cleanup — the app was always an in-memory one-page prototype (no backend, auth, or persistence, per the original constraints), so none of the acceptance criteria are affected. AC1–AC6 remain intact.
```

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Prompt 1: replaced the read-only "Current time baseline" text in `src/components/RoomChecker.tsx` with an editable time input bound to `nowMin` | accept | AC1 says "start is after the supplied current time"; now the tester can supply 09:00. The change is in one component, adds no network, storage or backend, so it stays in scope | T1 first (Room 202, now 09:00, 11:00–12:00 → Available), then all nine: see §4 final column |
| 2 | Prompt 1: kept a "Use real current time" button next to the input | accept | It only sets the same `nowMin` value to the real clock, adds no data or scope, and the decision still uses the supplied value (AC1) | T6 with 09:00 set by hand → Unavailable; the button is not used in any case |
| 3 | Prompt 2: in `src/components/Timeline.tsx`, labels every 4 hours instead of every 2, full `H:MM AM/PM` text and `whitespace-nowrap` | accept | AC6 asks for a page usable at narrow/mobile width; at about 375 px the labels no longer run together. It only changes the decorative axis, not the decision or the data (AC1–AC5) | T9 at 375 px → labels readable, Available; T1–T8 unchanged |
| 5 | Prompt 3: removed `"@supabase/supabase-js"` from `package.json` | accept | The scope says no backend or database; the package was never imported, so removing it changes no behaviour (AC1–AC6) and makes the export match the scope | T1 rerun after the change (Room 202, now 09:00, 11:00–12:00) → Available; the other eight results unchanged |
| 4 | Prompt 2: Bolt's claim that the change "preserves all acceptance criteria" | accept after retest, not on Bolt's word | "AI changed it" is not evidence; I accepted only after rerunning T1–T9 on the final version | all nine cases, see §4 |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Issue 1: current time cannot be supplied (AC1) | Fix (prompt 1, accepted) | `src/components/RoomChecker.tsx`: read-only "Current time baseline" text → editable `type="time"` input bound to `nowMin`, plus "Use real current time" button | T1 (Room 202, now 09:00, 11:00–12:00) Unavailable → Available; T6 Not testable → Unavailable; all nine rerun |
| 2 | Issue 2: timeline hour labels overlap at narrow width (AC6) | Fix (prompt 2, accepted) | `src/components/Timeline.tsx`: labels every 2 h (`h % 120`) → every 4 h (`h % 240`), full `minutesToLabel(h)` text, `whitespace-nowrap` | T9 at 375 px: labels readable, decision Available; T1–T8 unchanged |
| 3 | Issue 3: unused `@supabase/supabase-js` dependency (scope) | Fix (prompt 3, accepted) | `package.json`: `"@supabase/supabase-js": "^2.57.4"` removed from `dependencies` | T1 rerun → Available; checker P3 (scope) passes on the final export |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/lib/validation.ts`

<!-- Write your explanation below this line -->

The file has the function `evaluateAvailability(room, start, end, currentTime)`. It gets the selected room, the start and end in minutes after midnight and the current time from the new input. It does not stop at the first problem: it collects every reason in a list. AC1 is checked first: both times must exist, start must be 0–1439, end 0–1440, start must be smaller than end, and start must be greater than the current time (`start <= currentTime` is rejected, so 09:00 with "now" 09:00 is Unavailable). Then AC2 (`end - start > 120`), AC3 (`room.blocked`) and AC4 with `overlapsExisting`, which says two intervals overlap only when `start < b.end && b.start < end`. Because both comparisons are strict, 11:00–12:00 next to 10:00–11:00 does not overlap. If the list is empty the result is Available, otherwise Unavailable with the reasons. The room's bookings are only read with `some`, never changed (AC5).

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The last checker run has 0 FAIL and 0 ERROR |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

- No. The final page still uses an `HH:MM` time input for End, and it stops at 23:59, so 23:00–24:00 cannot be asked for (declared as `not-expressible`). The logic in `validation.ts` would accept end = 1440 (`end > MINUTES_PER_DAY` is the only upper check), but the user cannot type it. I decided this is acceptable for this prototype: the nine cases never need 24:00, the gap only affects the last minute of the day (23:00–23:59 still works), and adding a special "end of day" control would be a new feature I did not want to ask Bolt for in the limited prompts. It stays a known limit of AC1, logged here instead of hidden.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

- v1 used the real clock of my computer: `nowInMinutes()` in `src/lib/timeUtils.ts` read `new Date()`, and the page only showed "Current time baseline: 9:58 PM" with a "Refresh to real current time" link. Because I tested in the evening, every daytime request was rejected with "Start time must be after the current time", and I could not set the current time to 09:00, so T6 was Not testable on v1. After prompt 1 the current time is an input, so with 09:00 supplied, 09:00–09:30 is Unavailable for the right reason ("Start time must be after the current time").

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

My first prediction was right: v1 took the current time from the real clock and gave me no way to type 09:00. I tested at about 22:00, so T1 (Room 202, 11:00–12:00) said "Unavailable – Start time must be after the current time" even though the room is free, and T6 was Not testable. My second prediction was wrong, because v1 already had Room 303 marked as blocked, so T3 worked. I did not reject a Bolt change, but I did not accept the claim "this preserves all acceptance criteria" just because Bolt said it; I accepted both changes only after I reran all nine cases. The difference between looking finished and meeting AC1–AC6 is T1: v1 had a nice timeline, colours and a clear red banner, so it looked complete, but it rejected a valid booking because the "now" was wrong. Only after adding the current-time input did T1 become Available and match AC1.
