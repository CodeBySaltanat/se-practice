# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude (claude.ai) |
| Coding assistant model | Claude Opus 5.5 |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/p/72156204 |
| Language | Python 3 |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | week-06 |

Python v1 is fresh: I no longer have the chat that wrote my Week 05 v1, so I did not reconstruct it and generated a new v1 in this SIS (B1, B2). Web v1 is my Week 06 export (`week-06/original/`), copied unchanged into `web/original/`, with its screenshot as `evidence/web-v1.png`. `web/final/` started from my Week 06 final (current-time input, readable timeline labels, unused Supabase dependency removed) and was improved here with two new repairs (§7).

## 2. Baseline — before any new AI exchange

### 2.1 Scope in my own words

**Scope:** I am making one simple web page for one meeting room. It uses fictional data only. The page only checks if a new booking is possible; it does not save or make the booking. There is no login, no backend and no database.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The times must be inside one day (start from 0, end at most 1440 minutes), and the booking must start later than the current time. A start in the past or exactly at "now" is not allowed. |
| AC2 | The end must be after the start, and the booking can be 120 minutes long at most. |
| AC3 | If the room is blocked, no booking is possible at any time. |
| AC4 | A new booking can touch another one (start when it ends, or end when it starts), but it cannot overlap it. |
| AC5 | The page shows "Available" or "Unavailable", and checking does not change the existing bookings. |
| AC6 | The messages are clear and simple, and the page is easy to use on a phone. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | A booking 11:00–12:00 right after 10:00–11:00 only touches it, but the code may wrongly count it as an overlap. | AC4 | Test case T1: it must show "Available". |
| 2 | A booking that starts exactly at "now" (09:00) may wrongly pass. | AC1 | Test case T6: it must show "Unavailable". |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Start time of the new booking, in minutes after midnight | Integer, 0–1440 |
| `end` | End time of the new booking, in minutes after midnight | Integer, 0–1440 |
| `now` | The current time, in minutes after midnight | Integer, 0–1439 |
| `blocked` | Is the room blocked or not | Boolean: `True` / `False` |
| `existing` | The bookings that already exist | List of `(start, end)` pairs of integers |
| returns | Can the new booking be made | Boolean: `True` = Available, `False` = Unavailable |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The existing bookings are correct by themselves (start is before end, and they do not overlap each other).
2. All times are whole minutes on the same day; I do not handle non-integer times.

**Checked manually:**

- I will go through test cases T1–T12 myself in the browser.
- I will check that the list of existing bookings is the same after a check.
- I will open the page on a phone (or a narrow browser window) and check that the messages are easy to read.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if blocked:` | AC3 | Yes | It is checked first and returns False for every request, so a blocked room accepts nothing (T3 → False) |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | Keeps the interval inside the day and rejects zero-length and reversed requests (T7 → False); `end == 1440` is allowed (T8 → True), 1441 is not (T9 → False) |
| `if not start > now:` | AC1 | Yes | Strict comparison: a start equal to now is rejected (T6 → False), now + 1 is accepted |
| `if end - start > 120:` | AC2 | Yes | `>` and not `>=`, so exactly 120 minutes passes (T4 → True) and 121 fails (T5 → False) |
| `for s, e in existing:` / `if start < e and s < end:` | AC4 | Yes | Half-open overlap test with strict comparisons on both sides: touching (T1 → True) passes, partial overlap (T2) and overlap with the second booking (T10) are rejected; the loop checks every booking |
| `return True` / the five `return False` | AC5 (contract) | Yes | Plain booleans only; `existing` is only iterated, never sorted or changed (T11: same result twice, list unchanged) |

v1 was already correct, so my final `code/booking.py` is the same code as `code/original/booking_v1.py`. I checked this with my 17 tests and with the checker's ten faulty versions (M1–M10 all caught).

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

This is my Week 06 prompt (reused, sent on 2026-10-18); it forbids "authentication, backend services, analytics, or unrelated features".

| Generated file or component | Path | Its role |
| --- | --- | --- |
| `validation.ts` | `src/lib/validation.ts` | `evaluateAvailability(room, start, end, currentTime)` collects every reason (AC1 range and `start <= currentTime`, AC2 `> 120`, AC3 `room.blocked`, AC4 `overlapsExisting`) and returns Available only when the list is empty |
| `RoomChecker.tsx` | `src/components/RoomChecker.tsx` | The form (room, Start, End), the "Current time baseline", the decision banner and the read-only bookings list |
| `roomsData.ts` | `src/lib/roomsData.ts` | Four fictional rooms with their bookings; Room 303 is blocked |
| `Timeline.tsx` | `src/components/Timeline.tsx` | Draws the day with the existing bookings and the requested interval |

**What v1 does:**

- Shows a room dropdown, Start and End `HH:MM` inputs, a timeline and a green Available / red Unavailable banner with all reasons listed.
- Uses the real clock as "now" ("Current time baseline: 9:58 PM") with no way to supply 09:00, so in my evening run every daytime request was Unavailable and T6 could not be set up.
- The End input stops at 23:59, so 24:00 (T8, T9) cannot be entered; no sample room has the two bookings of T10.
- At narrow width the timeline hour labels ran together; `package.json` listed an unused `@supabase/supabase-js` (both fixed in Week 06, kept in my final).

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Unavailable | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Unavailable | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Not testable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Unavailable | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Unavailable | Available |

Python results: what both files returned when called (the checker runs them too). Page v1: my run of the Week 06 v1 page on 2026-10-18 (Room 202 has the 10:00–11:00 booking, Room 303 is blocked); "now" was the real clock (about 21:58) and could not be set, so the daytime cases were Unavailable for "Start time must be after the current time"; T8/T9 could not be entered (End stops at 23:59) and no v1 room has the T10 bookings. Page final: my run on 2026-11-01 with the current time set to 09:00 (Room 202; T3 Room 303; T10 Room 505; T8 with "Until midnight (24:00)"); T11 = second check after changing End to 12:30 and back; T12 = `evidence/final-narrow.png`.

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `booking.py` lines 4–7 (`0 <= start < end <= 1440`, `start > now`); page `validation.ts` range checks and `start <= currentTime`, `RoomChecker.tsx` current-time input and "Until midnight (24:00)" | T6, T7, T8, T9 | Unavailable, Unavailable, Available, Unavailable | Python False, False, True, False; page Not testable, Unavailable, Not testable, Not testable | Python False, False, True, False; page Unavailable, Unavailable, Available, Not testable |
| AC2 | `booking.py` line 8 (`end - start > 120`); page `validation.ts` `end - start > MAX_BOOKING_MINUTES` | T4, T5 | Available, Unavailable | Python True, False; page Unavailable, Unavailable | Python True, False; page Available, Unavailable |
| AC3 | `booking.py` line 2 (`if blocked`); page `validation.ts` `room.blocked`, Room 303 in `roomsData.ts` | T3 | Unavailable | Python False; page Unavailable | Python False; page Unavailable |
| AC4 | `booking.py` lines 10–12 (`start < e and s < end`); page `overlapsExisting` in `validation.ts`, Room 505 in `roomsData.ts` | T1, T2, T10 | Available, Unavailable, Unavailable | Python True, False, False; page Unavailable, Unavailable, Not testable | Python True, False, False; page Available, Unavailable, Unavailable |
| AC5 | `booking.py` only iterates `existing`; page banner in `RoomChecker.tsx`, bookings only read with `some` | T11 | Available twice, data unchanged | Python True; page Unavailable | Python True; page Available, bookings list unchanged |
| AC6 | `RoomChecker.tsx` reasons list in the red banner; responsive grid; `Timeline.tsx` labels every 4 h | T7 (reason shown), T12 | Unavailable with a reason; Available at ~375 px | page Unavailable with "Start time must be earlier than end time"; T12 Unavailable (labels overlapped) | page Unavailable with the same reason; T12 Available, readable (`final-narrow.png`) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | Functional (AC1): the page cannot express an end of 24:00 | T8: current time 09:00, Room 202, Start 23:00, End — the `HH:MM` input stops at 23:59, so 23:00–24:00 cannot be entered although AC1 allows `end <= 1440` (`evidence/before-1.png` shows 23:00–23:59) | High | Prompt B5 (names T8 and AC1, asks for the smallest change). Bolt added an "Until midnight (24:00)" checkbox in `src/components/RoomChecker.tsx` that sets `end` to `MINUTES_PER_DAY` (1440) and disables the time picker | T8 → Available ("Room 202 is free for 11:00 PM – 12:00 AM (1 hr)", `evidence/after-1.png`); all twelve cases rerun, T1–T12 as in §5 |
| 2 | Testability / code (AC4): no sample room for case T10 | T10: request 12:00–13:00 against bookings 10:00–11:00 and 11:40–12:40 — none of the four v1 rooms has these bookings, so the case could not be set up | Medium | Prompt B6 (names T10 and AC4). Bolt added one fictional, not blocked "Room 505 — Arts Annex" with bookings 600–660 and 700–760 to `src/lib/roomsData.ts` | T10 → Unavailable, "The requested interval overlaps an existing booking."; other cases unchanged |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1 (T8: End stopped at 23:59 → "Until midnight (24:00)" gives Available for 23:00–24:00).

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | `booking.py` does not check that times are integers; add `isinstance(x, int)` and reject floats/bools | I called `can_book(600.5, 630, 540, False, [])` and it returned True, so the claim is true | reject | The contract says times are integer minutes and README §1 says to treat AC1–AC6 as fixed; a type check adds a rule no AC asks for. My 17 tests and T1–T11 all give the expected result without it |
| 2 | With "Until midnight" checked, the disabled End field still shows the old time while the real end is 24:00 | I looked at `after-1.png` and my T8 run: the grey field shows "23:--" / "23:00" while the banner says 11:00 PM – 12:00 AM | modify | The decision is correct (T8 Available, AC1), so I keep the change, but the stale grey value is confusing feedback (AC6); I log it as a limitation in §13 instead of spending another prompt |
| 3 | The editable "Current time baseline" lets anyone set now to 00:00; remove it or refresh it from the clock every 30–60 s | I checked the code (`useState(nowInMinutes())`) and reran T6 with 09:00 set by hand → Unavailable | reject | AC1 says "after the supplied current time"; without the input T6 cannot be tested at all (v1 showed this). The page only checks, it saves nothing, so a simulated "now" cannot harm data (AC5) |
| 4 | `grid-cols-2` is too tight at 320 px; Start/End inputs get clipped | I opened the page at about 375 px (`final-narrow.png`): both inputs show "11:00" and "12:00" fully and the checkbox fits | reject | AC6 is met at the phone width the brief asks for (T12 Available, readable); 320 px was not tested and I did not change the layout on an unverified claim |
| 5 | The blocked reason should be listed first and messages should name the conflicting booking | I ran T3 and T10: each shows one clear reason ("Room is blocked: …", "The requested interval overlaps an existing booking.") | reject | The result is already unambiguous (AC5) and the reason is understandable (AC6); listing the booking would be a new feature outside the two issues I logged |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Make the page accept an end of 24:00 so that case T8 (23:00–24:00) can be checked and gives Available (AC1) |
| Model / plan | Bolt said it would read `RoomChecker.tsx`, `timeUtils` and `validation.ts`, found that the native time input cannot hold 24:00 while validation already accepts 1440, and planned an "Until midnight (24:00)" checkbox |
| Tool call | It edited `src/components/RoomChecker.tsx`, noticed it had removed an unused import, restored it, re-read the file after a "changed on disk" warning, and ran the build |
| Observation | "The build passes", but Bolt itself said it had not tested in a browser and asked me to check that 23:00–24:00 shows Available |
| Next step | I downloaded the export, compared it with the previous version (only `RoomChecker.tsx` changed for this issue) and reran T8 with the current time 09:00 |
| Human review | T8 showed Available (`after-1.png`); I reran all twelve cases, accepted the change, and noted the stale grey End value as a limitation (§8 row 2, §13) |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude (Opus 5.5), Generate | My prompt with AC1–AC4 and its own approved plan | It created files (`can_book.py`, `test_can_book.py`) and ran them with `unittest` ("all 25 boundary tests from the plan pass"); I downloaded both files | Observed |
| Bolt.new, repair prompts | The project files of my Bolt project (it named `RoomChecker.tsx`, `timeUtils`, `validation.ts`, `roomsData.ts`) and the chat history | It read and edited files in the project and ran the build ("Build passes"); its terminal showed `[vite] page reload src/lib/validation.ts` | Observed |
| Bolt.new, environment | All project files and the npm packages from `package.json` | It runs npm and Vite in a sandbox in my browser tab and can install any package it adds to `package.json` (it did add Supabase in v1) | Assumed |
| Claude (Opus 5.5), sandbox | Only what I pasted into the chat | It runs code in an isolated container with no access to my laptop or my GitHub repository; it cannot push or change my files | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before I accept any AI change I download the project, diff it against the previous version, and check that only the expected file changed and that no network call, storage, login or new dependency appeared; then I rerun all twelve cases and the unit tests before committing.

**Reliability, security, responsibility:** Both tools said "build passes" or "tests pass", but Bolt admitted it never opened the page, so passing a build is not evidence that T8 works; only my rerun was. Security matters because Bolt can add packages such as Supabase without being asked, which would bring a backend into a scope that forbids it. The AI cannot be responsible for the result: I choose what to accept, I run the tests, and I sign the declaration.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

With Claude, the Python part was AI-assisted coding: I asked for a plan first, read every line of the function and checked it with my 17 tests. With Bolt, the page was vibe coding: I got a whole working page in one minute, but I almost did not read its code and checked it only by clicking. I saw three risks. Reliability: Bolt wrote "build passes", but it said itself that it had not opened the page, so a build is not proof that T8 works. Usability: v1 used the real clock as "now", so in the evening every daytime request was Unavailable, and 24:00 could not be entered. Security: in v1 Bolt added Supabase, a backend package, although my prompt said no backend. The AI does not know if the result is correct, so running the tests, reading the diff and deciding what to accept stay my job. I rejected Claude's advice to add an isinstance type check, because the contract already says times are integer minutes. Next, without expanding the scope, I would make the grey End field show "24:00" when "Until midnight" is ticked.

## 11. Appendix A — AI exchanges

### B1

- **Tool:** Claude (claude.ai)
- **Model:** Claude Opus 5.5
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
I need a Python 3 function can_book(start, end, now, blocked, existing) for a Smart Campus room availability checker. Times are integer minutes after midnight on one day. now is valid (0-1439), blocked is a Boolean, existing is a list of (start, end) tuples of valid existing bookings. Return True only when all of these hold, otherwise False, and never modify existing:
AC1: 0 <= start < end <= 1440, and start must be strictly after now.
AC2: duration must not exceed 120 minutes; exactly 120 is allowed.
AC3: reject every request when the room is blocked.
AC4: reject overlap with any existing booking; intervals touching at an endpoint do not overlap. Intervals include the start and exclude the end.
Before writing any code, give me a short plan: the checks in order, your assumptions, and the boundary tests you would use. Do not write the function yet. Use only the standard library.
~~~~

**Response:**

~~~~text
## Plan for `can_book`

**Checks in order** (first failure returns `False`):

1. **Blocked (AC3):** if `blocked` is true, return `False`. It's the cheapest check and rejects everything.
2. **Range (AC1):** require `0 <= start < end <= 1440`.
3. **Future start (AC1):** require `start > now`.
4. **Duration (AC2):** require `end - start <= 120`.
5. **Overlap (AC4):** for each `(s, e)` in `existing`, reject if `start < e and s < end`. This is the half-open interval test, so touching endpoints (`end == s` or `start == e`) pass.

Every rule must hold, so the order doesn't change the result. It only affects speed and readability.

**Assumptions**

- All times are plain integers. I won't type-check beyond what you specified, and inputs like floats, strings, or `True`/`False` are out of scope.
- `end == 1440` is allowed. With a half-open interval, that means "until midnight."
- Because `now >= 0` and `start > now`, a `start` of 0 can never succeed. If `now == 1439`, no booking is possible.
- `start < end` already rules out zero-length requests, so the shortest valid booking is 1 minute.
- "Valid existing bookings" means each one has `0 <= s < e <= 1440`. The list may be empty, unsorted, or contain bookings that overlap each other. None of that matters, because I check every entry.
- `existing` is only iterated. Nothing sorts, appends to, or reassigns it.
- The function has no side effects. It returns `True` or `False` and never raises an exception for in-spec input.

**Boundary tests** (defaults: `now=480`, `blocked=False`, `existing=[(600, 660)]` unless noted)

| Area | Case | Expected |
|---|---|---|
| AC1 future | `start == now` (480, 540) | False |
| | `start == now + 1` (481, 541) | True |
| AC1 range | `start = -1` (with `now=0`) | False |
| | `now=0`, `start=0` | False |
| | `end = 1440` (1380, 1440) | True |
| | `end = 1441` (1380, 1441) | False |
| | `start == end` (500, 500) | False |
| | `start > end` (540, 500) | False |
| | `now=1439`, any request | False |
| AC2 | duration 120 (700, 820) | True |
| | duration 121 (700, 821) | False |
| | duration 1 (700, 701) | True |
| AC3 | Otherwise valid request, `blocked=True` | False |
| | Same request, `blocked=False` | True |
| AC4 | Touches start of booking (540, 600) | True |
| | Touches end of booking (660, 720) | True |
| | Overlaps by 1 minute at start (540, 601) | False |
| | Overlaps by 1 minute at end (659, 720) | False |
| | Inside booking (610, 650) | False |
| | Encloses booking (590, 670) | False |
| | Exact match (600, 660) | False |
| | Empty `existing` | True |
| | Fits exactly in a gap: `existing=[(720,780),(600,660)]`, request (660, 720) | True |
| Immutability | Copy `existing` before the call, compare after; also pass a tuple of tuples to prove no mutation is attempted | Unchanged |

Once you approve the plan, I'll write the function and run these tests with `unittest`.
~~~~

### B2

- **Tool:** Claude (claude.ai)
- **Model:** Claude Opus 5.5
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
I approve the plan. Now write can_book in Python 3 exactly as planned, standard library only, signature can_book(start, end, now, blocked, existing). Return only True or False. Do not add any rule that is not in AC1-AC4.
~~~~

**Response:**

~~~~text
I'll write the function and run the boundary tests from the plan against it.
I wrote `can_book` exactly as planned, and all 25 boundary tests from the plan pass.

```python
def can_book(start, end, now, blocked, existing):
    if blocked:                              # AC3
        return False
    if not (0 <= start < end <= 1440):       # AC1 range
        return False
    if not start > now:                      # AC1 future start
        return False
    if end - start > 120:                    # AC2
        return False
    for s, e in existing:                    # AC4, half-open overlap
        if start < e and s < end:
            return False
    return True

```

It always returns a plain `True` or `False`, uses no imports, and only reads `existing`. A tuple input works too, which shows nothing tries to modify it. It has no rules beyond AC1–AC4: it doesn't validate `now` or the existing bookings, and it doesn't check types. Run the tests with `python3 -m unittest -v test_can_book`.
~~~~

### B3

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-18
- **Stage:** Generate
- **Source:** week-06

**Prompt:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

**Response:**

~~~~text
I'll build a one-page Smart Campus Room Availability Checker with in-memory sample data (no backend, per your constraints). Let me plan the structure and create the files.Build passes.Built the Smart Campus Room Availability Checker as a single responsive page using sample data only (no backend, auth, or analytics).

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
~~~~

### B4

- **Tool:** Claude (claude.ai), new chat
- **Model:** Claude Opus 5.5
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review my Python function and my web page against the acceptance criteria AC1-AC6 below. For each problem you find, name the AC, quote the line or component, and say what should change. Do not rewrite the whole code. Keep the criteria fixed: do not suggest rules that change their meaning.

AC1: Candidate times are integer minutes after midnight: 0 <= start < end <= 1440; start must be strictly after now.
AC2: Duration must not exceed 120 minutes. Exactly 120 minutes is permitted.
AC3: Reject every request when the selected room is blocked.
AC4: Reject overlap with any existing booking. Intervals touching at an endpoint do not overlap.
AC5: Display an unambiguous Available / Unavailable result; do not mutate existing bookings.
AC6: Provide understandable validation feedback and a usable narrow/mobile layout.
Scope: one page, one selected room, fictional data, checks availability only; no login, backend, database or external API.

1) Python function code/booking.py:
```python
def can_book(start, end, now, blocked, existing):
    if blocked:                              # AC3
        return False
    if not (0 <= start < end <= 1440):       # AC1 range
        return False
    if not start > now:                      # AC1 future start
        return False
    if end - start > 120:                    # AC2
        return False
    for s, e in existing:                    # AC4, half-open overlap
        if start < e and s < end:
            return False
    return True
```

2) The page's decision logic, src/lib/validation.ts:
```ts
import { MINUTES_PER_DAY } from './timeUtils';
import type { Room } from './roomsData';

export type Decision =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export const MAX_BOOKING_MINUTES = 120;

export function overlapsExisting(start: number, end: number, room: Room): boolean {
  return room.bookings.some((b) => start < b.end && b.start < end);
}

export function evaluateAvailability(
  room: Room | null,
  start: number,
  end: number,
  currentTime: number,
): Decision {
  if (!room) {
    return { status: 'unavailable', reasons: ['Please select a room.'] };
  }

  const reasons: string[] = [];

  // AC1: 0 <= start < end <= 1440, start after current time
  if (!(Number.isFinite(start) && Number.isFinite(end))) {
    reasons.push('Start and end times are required.');
  } else {
    if (start < 0 || start >= MINUTES_PER_DAY) {
      reasons.push('Start time must be between 00:00 and 23:59.');
    }
    if (end < 0 || end > MINUTES_PER_DAY) {
      reasons.push('End time must be between 00:00 and 24:00.');
    }
    if (start >= end) {
      reasons.push('Start time must be earlier than end time.');
    }
    if (start <= currentTime) {
      reasons.push('Start time must be after the current time.');
    }
  }

  // AC2: booking longer than 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push(`Booking cannot exceed ${MAX_BOOKING_MINUTES} minutes.`);
  }

  // AC3: room blocked
  if (room.blocked) {
    reasons.push(room.blockedReason ? `Room is blocked: ${room.blockedReason}` : 'Room is blocked.');
  }

  // AC4: overlap (touching endpoints allowed) — only check when interval itself is valid
  if (start < end && start >= 0 && end <= MINUTES_PER_DAY) {
    if (overlapsExisting(start, end, room)) {
      reasons.push('The requested interval overlaps an existing booking.');
    }
  }

  return reasons.length === 0
    ? { status: 'available' }
    : { status: 'unavailable', reasons };
}
```

3) The page's form, src/components/RoomChecker.tsx:
```tsx
import { useMemo, useState } from 'react';
import { Building2, Clock, CalendarClock, CheckCircle2, XCircle, Users, Ban } from 'lucide-react';
import { rooms, type Room } from '@/lib/roomsData';
import { evaluateAvailability } from '@/lib/validation';
import { minutesToLabel, rangeLabel, nowInMinutes, durationLabel, MINUTES_PER_DAY } from '@/lib/timeUtils';
import Timeline from './Timeline';

function timeInput(value: string): number | null {
  if (!value) return null;
  const [h, m] = value.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function toInputValue(min: number | null): string {
  if (min === null) return '';
  const m = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

export default function RoomChecker() {
  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [endAtMidnight, setEndAtMidnight] = useState(false);
  const [nowMin, setNowMin] = useState<number>(nowInMinutes());

  const room: Room = useMemo(() => rooms.find((r) => r.id === roomId)!, [roomId]);
  const start = timeInput(startStr);
  const endInput = timeInput(endStr);
  const end = endAtMidnight ? MINUTES_PER_DAY : endInput;

  const decision = useMemo(
    () => evaluateAvailability(room, start ?? -1, end ?? -1, nowMin),
    [room, start, end, nowMin],
  );

  const showDecision = start !== null && end !== null;
  const duration = start !== null && end !== null ? end - start : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white">
            <CalendarClock size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Smart Campus Room Availability</h1>
            <p className="text-sm text-slate-500">Check whether a campus room is free for your requested time slot.</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid gap-6 lg:grid-cols-5">
        {/* Form panel */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600" /> Booking Request
          </h2>

          <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.building}
                {r.blocked ? ' (Blocked)' : ''}
              </option>
            ))}
          </select>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Users size={14} /> Capacity: {room.capacity}
            {room.blocked && (
              <span className="inline-flex items-center gap-1 text-red-600 font-medium ml-2">
                <Ban size={14} /> {room.blockedReason}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
              <input
                type="time"
                value={toInputValue(start)}
                onChange={(e) => setStartStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
              <input
                type="time"
                value={toInputValue(endInput)}
                disabled={endAtMidnight}
                onChange={(e) => setEndStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={endAtMidnight}
                  onChange={(e) => setEndAtMidnight(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Until midnight (24:00)
              </label>
            </div>
          </div>

          {duration > 0 && (
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <Clock size={14} /> Duration: {durationLabel(duration)}
            </p>
          )}

          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <label className="block text-xs font-medium text-slate-500 mb-1">Current time baseline</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={toInputValue(nowMin)}
                onChange={(e) => setNowMin(timeInput(e.target.value) ?? nowMin)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setNowMin(nowInMinutes())}
                className="text-xs text-emerald-700 hover:underline whitespace-nowrap"
              >
                Use real current time
              </button>
            </div>
          </div>
        </section>

        {/* Result panel */}
        <section className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-emerald-600" /> Availability for {room.name}
          </h2>

          <Timeline
            room={room}
            candidateStart={start}
            candidateEnd={end}
          />

          {/* Decision banner */}
          {showDecision ? (
            decision.status === 'available' ? (
              <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={22} />
                <div>
                  <p className="font-semibold text-emerald-800">Available</p>
                  <p className="text-sm text-emerald-700">
                    {room.name} is free for {rangeLabel(start!, end!)} ({durationLabel(duration)}).
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <XCircle className="text-red-600 mt-0.5 shrink-0" size={22} />
                <div>
                  <p className="font-semibold text-red-800">Unavailable</p>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-1 space-y-0.5">
                    {decision.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          ) : (
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
              Select a start and end time to see the availability decision.
            </div>
          )}

          {/* Existing bookings list (read-only — AC5) */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Existing bookings (today)</h3>
            {room.bookings.length === 0 ? (
              <p className="text-sm text-slate-400">No existing bookings.</p>
            ) : (
              <ul className="space-y-2">
                {room.bookings
                  .slice()
                  .sort((a, b) => a.start - b.start)
                  .map((b) => (
                    <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 text-sm border border-slate-200 rounded-lg px-3 py-2">
                      <span className="font-medium text-slate-700">{rangeLabel(b.start, b.end)}</span>
                      <span className="text-slate-500">{b.purpose} · {b.bookedBy}</span>
                    </li>
                  ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-slate-400">Checking availability does not modify these bookings.</p>
          </div>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 text-center text-xs text-slate-400">
        Sample data only · Times are in 24-hour format within a single day (00:00–24:00)
      </footer>
    </div>
  );
}
```
~~~~

**Response:**

~~~~text
The decision logic is mostly sound. Two gaps can produce a wrong result: neither function enforces *integer* minutes, and the page's "now" stops advancing after the page loads. The rest are feedback and layout problems under AC6.

## code/booking.py

1. **AC1:** `if not (0 <= start < end <= 1440):` checks the range but not the type. `can_book(600.5, 630, ...)` returns `True`, `True`/`False` pass as integers, and a string raises `TypeError` instead of returning `False`. Add a type check right after the `blocked` check, so AC3 still rejects first. For example, reject unless `isinstance(x, int) and not isinstance(x, bool)` holds for `start` and `end`.

The rest of the function matches the criteria. The blocked check comes first (AC3), `start > now` is strict, `> 120` allows exactly 120 (AC2), `start < e and s < end` lets touching endpoints through (AC4), and `existing` is never modified (AC5).

## src/lib/validation.ts

2. **AC1:** `Number.isFinite(start) && Number.isFinite(end)` accepts 600.5. Use `Number.isInteger` and add a reason such as "Times must be whole minutes."
3. **AC6:** `if (end - start > MAX_BOOKING_MINUTES)` runs even when the interval is already invalid. For example, `end = Infinity` reports both "required" and "cannot exceed 120 minutes". Put it behind the same valid-interval guard you already use for AC4. The result stays Unavailable; only the reasons become accurate.
4. **AC6:** Some messages aren't specific enough to act on:
   - `'Start time must be after the current time.'` should name the baseline time, e.g. "…after 14:05".
   - `'The requested interval overlaps an existing booking.'` should name the conflicting range. Have `overlapsExisting` return the conflicting bookings (`filter` instead of `some`) so the message can list them.
   - The blocked reason is pushed last. It decides the result regardless of the times, so list it first.

## src/components/RoomChecker.tsx

5. **AC1 / AC5:** `useState<number>(nowInMinutes())` reads the clock once at mount. If the page is opened at 09:00 and used at 11:00, a 10:00 start still shows **Available**. Refresh `nowMin` on an interval (every 30–60 s in a `useEffect`) while it is following the real clock.
6. **AC1 / AC5:** The editable "Current time baseline" lets anyone set "now" to 00:00 and get Available for a slot that has already passed.
   - If it's a deliberate demo control, keep `start > now` as is but make the banner say so, e.g. "Available (relative to simulated time 08:00)".
   - Track whether the baseline was overridden, so the refresh from item 5 doesn't overwrite it.
   - Otherwise, remove it.
7. **AC6, narrow layout:** `<div className="mt-4 grid grid-cols-2 gap-3">` is too tight at 320 px. The card's content area is about 246 px, so each time input gets about 117 px. Native time inputs, especially "10:30 AM" with a picker icon, get clipped, and "Until midnight (24:00)" wraps over several lines. Use `grid-cols-1 sm:grid-cols-2`.
8. **AC6, narrow layout:** The baseline row `<div className="flex items-center gap-2">` has an unconstrained time input and a `whitespace-nowrap` button in about 220 px, so it will likely overflow sideways. Add `flex-wrap`. The "Use real current time" button also has no padding, which leaves a tap target about 16 px tall. Give it padding and a minimum height of about 44 px.
9. **AC6, narrow layout:** On mobile the result section stacks below the form, and inside it `<Timeline … />` comes before the banner. After entering times, the user has to scroll past the timeline to see Available/Unavailable. Move the banner above the Timeline.
10. **AC6:** The `Room`, `Start`, `End` and `Current time baseline` labels have no `htmlFor`, and the inputs have no `id`. Tapping a label doesn't focus its field, and screen readers announce unnamed inputs. Add `id`/`htmlFor` pairs.
11. **AC6:** The decision banner isn't announced when it changes. Add `role="status"` (or `aria-live="polite"`) to its container.
12. **AC6:** With "Until midnight" checked, `value={toInputValue(endInput)} disabled={endAtMidnight}` keeps showing the old end time (e.g. 11:00) greyed out while the real end is 24:00. Clear it, or show 24:00 instead.
13. **AC3 / AC6:** For a blocked room with no times entered, the panel says "Select a start and end time to see the availability decision." That implies the room might still be available. Show Unavailable as soon as `room.blocked` is true. Also, `<Ban size={14} /> {room.blockedReason}` shows a bare icon when there's no reason text; reuse the "Room is blocked." fallback from validation.ts.

Minor (AC6):
- `start ?? -1` passes a finite sentinel, so "Start and end times are required." can never appear. If the banner gating ever changes, a missing field would be reported as an out-of-range time. Pass `NaN` or `null` instead.
- The footer says "Times are in 24-hour format", but native time inputs show AM/PM in 12-hour locales. Reword the footer so the screen doesn't contradict itself.

I couldn't check `Timeline`, `timeUtils` or `roomsData`. `Timeline` in particular needs its own look, for its narrow layout (AC6) and to confirm it doesn't sort `room.bookings` in place (AC5).
~~~~

### B5

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
In the current prototype, the End field is an HH:MM time input that stops at 23:59, so case T8 (23:00–24:00, minutes 1380–1440) cannot be entered, but AC1 allows end <= 1440 and T8 must give Available. Make the smallest change that lets the user choose 24:00 as the end time. Preserve the other acceptance criteria. Explain which file/component you changed and why.
~~~~

**Response:**

~~~~text
I'll read the room checker, time utilities, and validation code to see how the End field is wired.The End input is a native time field, which can't hold 24:00, and the validation already accepts 1440. I'll check how the timeline draws an end of 1440 before choosing the change.The timeline already draws an end of 1440 correctly, so the only blocker is the End input. I'll add a "Until midnight (24:00)" checkbox beside the End field that sets the end to 1440 and disables the time picker while checked.I removed an import that was already unused, which is outside this task, so I'm restoring it to keep the diff minimal.The file reports it changed on disk during my edits, so I'll re-read it to confirm the current state before building.You can now pick 24:00 as the end time. In the booking form, there's a new "Until midnight (24:00)" checkbox under the End field. Checking it sets the end to midnight and greys out the time picker; unchecking it returns you to the normal time picker. The change is in `src/components/RoomChecker.tsx`.

I chose a checkbox over a typed "24:00" because the native time picker can't represent 24:00, and this keeps the picker for every other time. The existing rules in `src/lib/validation.ts` already accept an end of 1440, and the timeline already draws it correctly, so I didn't change either. The build passes. I haven't tested it in a browser, so please check that a 23:00–24:00 request shows Available.
~~~~

### B6

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
In the current prototype, no sample room has the bookings 10:00–11:00 and 11:40–12:40, so case T10 (request 12:00–13:00 against existing (600–660) and (700–760)) cannot be set up, but AC4 requires that this request gives Unavailable because it overlaps the second booking. Make the smallest change: add one fictional, not blocked room with exactly these two bookings to the sample data. Preserve the other acceptance criteria. Explain which file/component you changed and why.
~~~~

**Response:**

~~~~text
The sample data is a plain list of rooms, so I'll append one unblocked room with exactly the two bookings from T10.I added a new sample room, "Room 505" in the Arts Annex, to `src/lib/roomsData.ts`. It is not blocked and has exactly the two bookings from T10: 10:00–11:00 and 11:40–12:40. A 12:00–13:00 request against it should now show Unavailable because it overlaps the second booking. The build passes, but I haven't checked this in a browser, so please confirm the result in the app.

Room 505 is the only sample room with those bookings, so no other test case changes.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
C:\Users\sulta\se-practice\sis-03\code>python -m unittest -v
test_t1_touching_end_is_available (test_booking.TestBriefCases.test_t1_touching_end_is_available) ... ok
test_t2_overlap_is_unavailable (test_booking.TestBriefCases.test_t2_overlap_is_unavailable) ... ok
test_t3_blocked_room_is_unavailable (test_booking.TestBriefCases.test_t3_blocked_room_is_unavailable) ... ok
test_t4_exactly_120_minutes_is_available (test_booking.TestBriefCases.test_t4_exactly_120_minutes_is_available) ... ok
test_t5_121_minutes_is_unavailable (test_booking.TestBriefCases.test_t5_121_minutes_is_unavailable) ... ok
test_t6_start_equal_to_now_is_unavailable (test_booking.TestBriefCases.test_t6_start_equal_to_now_is_unavailable) ... ok
test_exact_gap_between_two_bookings_is_available (test_booking.TestFurtherKinds.test_exact_gap_between_two_bookings_is_available) ... ok
test_list_unchanged_after_rejection (test_booking.TestFurtherKinds.test_list_unchanged_after_rejection) ... ok
test_new_booking_containing_existing_is_unavailable (test_booking.TestFurtherKinds.test_new_booking_containing_existing_is_unavailable) ... ok
test_start_one_minute_after_now_is_available (test_booking.TestFurtherKinds.test_start_one_minute_after_now_is_available) ... ok
test_t10_conflict_with_second_booking (test_booking.TestFurtherKinds.test_t10_conflict_with_second_booking) ... ok
test_t11_same_check_twice_and_list_unchanged (test_booking.TestFurtherKinds.test_t11_same_check_twice_and_list_unchanged) ... ok
test_t7_reversed_times_are_unavailable (test_booking.TestFurtherKinds.test_t7_reversed_times_are_unavailable) ... ok
test_t8_ending_at_midnight_is_available (test_booking.TestFurtherKinds.test_t8_ending_at_midnight_is_available) ... ok
test_t9_ending_after_midnight_is_unavailable (test_booking.TestFurtherKinds.test_t9_ending_after_midnight_is_unavailable) ... ok
test_touching_start_of_booking_is_available (test_booking.TestFurtherKinds.test_touching_start_of_booking_is_available) ... ok
test_zero_length_is_unavailable (test_booking.TestFurtherKinds.test_zero_length_is_unavailable) ... ok

----------------------------------------------------------------------
Ran 17 tests in 0.005s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| none (checker clean) | The last checker run has no FAIL or ERROR | — |
| T9 on the page is Not testable | The End input plus the "Until midnight" option can express 24:00 but nothing later, so 23:00–24:01 cannot be entered; the README accepts Not testable for T8/T9. The Python function rejects 1441 (T9 → False) | Nothing needed: a value after 24:00 is outside the day by definition |
| With "Until midnight" checked, the grey End field still shows the old time | Found in the critique (§8 row 2); the decision is correct, only the display is confusing | One focused prompt: show "24:00" or clear the field while the checkbox is ticked |
| "Current time baseline" can be set by hand | Kept on purpose for AC1 "supplied current time" and testing T6 (§8 row 3) | Label it as a simulated time in the banner |
