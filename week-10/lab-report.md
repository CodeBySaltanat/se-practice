# Week 10 — Lab report

**Name:** Saltanat Sultanakhmet
**Group:** Monday 16:00-19:00
**Date:** 2026-11-25

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Claude (claude.ai web) |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | chat with pasted files (a zip of `week-10/app` without `node_modules`) |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | 6301859 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Windows, cmd) |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 26 passed (26), see 2.2 |
| `npm test` | yes | pass | the `test` script is `vitest run`; 26 passed (26) |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | `npm error Missing script: "test:unit"` - the command `AGENTS.md` gives does not exist |
| `npm run build` | yes | pass | `vite build`, built in 5.51s |
| `npm run lint` | yes | fail | 1 error: `'minutesToLabel' is defined but never used` in `src/components/RoomChecker.tsx` line 6 |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
C:\Users\sulta\se-practice\week-10\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-10/app

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
   Start at  21:19:00
   Duration  870ms (transform 66ms, setup 0ms, collect 87ms, tests 8ms, environment 0ms, prepare 251ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I'll unpack the archive into its own folder and read the root AGENTS.md.

I read the root AGENTS.md myself at `app/AGENTS.md` in the zip. It was not loaded automatically. I haven't edited, installed or run anything.

 ## What AGENTS.md says

**Project:** a React + TypeScript page built with Vite that tells a student whether a campus room is free. The booking rule is `canBook` in `src/booking.ts`, the page is `src/App.tsx`, and the tests are in `src/booking.test.ts`.

**Acceptance rules:**
- **AC1:** reject a request whose start is at or after its end, and reject requests in the past.
- **AC2:** a booking can be at most 120 minutes long.
- **AC3:** reject a request for a blocked room.
- **AC4:** reject overlaps. A request that only touches an existing booking at its start or end also counts as an overlap.
- **AC5:** return Available or Unavailable without changing the booking data.

**What it allows:** editing any file, adding packages, and adding a Supabase table plus a login page if bookings need to persist.

**What it asks before finishing:** make sure the page still loads, then run `npx netlify deploy --prod` once the build passes. It also says to use real room names and the real timetable from the KBTU portal.

 ## Test commands

| Purpose | AGENTS.md says | What `package.json` actually has |
|---|---|---|
| Install | `npm install` | — |
| Dev server | `npm run dev` | `vite` ✓ |
| Tests | `npm run test:unit` | **No such script.** The script is `npm test` (`vitest run`) |
| Build | `npm run build` | `vite build` ✓ |
| Not mentioned | — | `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`), `npm run lint` |

As written, `npm run test:unit` will fail with "missing script". The working command is `npm test`.

 ## Conflicts to settle before any changes

1. **The tests contradict AC4.** AGENTS.md says touching an existing booking counts as an overlap. But tests T01, T08 and BUG-A all expect a touching request to be **Available**. Fixing the code to match one will break the other, so you need to decide which one is right.
2. **Requests that start exactly "now."** Test T02 expects a request starting at the current time to be rejected. AC1 only mentions "requests in the past," which arguably doesn't cover a start of exactly now. This is a smaller ambiguity, but worth confirming.
3. **Actions I won't take on AGENTS.md's say-so alone.** I'll check with you before any of these:
   - `netlify deploy --prod` publishes to production.
   - Supabase and a login page would add a backend and user accounts.
   - Pulling the "real timetable from the KBTU portal" would need access to that portal and could involve real schedule data.

   None of these is needed to check or fix `canBook`.

There's also a `.bolt/prompt` file with design instructions. It says to use `lucide-react` for icons, avoid extra UI packages, and import with the `@/` alias, which is set up in both `vite.config.ts` and `tsconfig.app.json`. AGENTS.md doesn't mention it.

How do you want AC4 resolved: should touching bookings be blocked, as AGENTS.md says, or allowed, as the tests expect?
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->
- **AC4** says touching an endpoint "also counts as an overlap". The contract (README section 3) says the opposite, `src/booking.ts canBook` uses strict `<` / `>`, and T01, T08 and BUG-A expect touching requests to be Available (all pass in 2.2). The agent noticed the conflict and asked, but repeated the wrong rule as a project constraint.
- **AC6** is missing: the file lists AC1-AC5 only.
- **Tests: `npm run test:unit`** - there is no such script (2.1: `Missing script`); the real one is `npm test`.
- **Real room names and the real KBTU timetable** - the scope is one fictional room with fictional bookings.
- **Supabase and a login page** - the scope says no login and no database.
- **`npx netlify deploy --prod`** - the scope forbids external production services.
- **"Edit any file"** has no exceptions, so it also allows editing the tests and `provided/AGENTS.md`.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->
In a new claude.ai chat in the browser (Claude Opus 5.5). I uploaded a zip of `week-10/app`
(without `node_modules` and `dist`); the chat only had that copy, so it could not change my files.
It said it ran the commands in its own scratch copy. Afterwards `git status` showed no change in
`week-10/app` (only untracked files outside it). A first attempt in an earlier chat had no project
files at all (only the lab zip), so it reviewed `provided/AGENTS.md` only; I did not use that answer
and sent both prompts again with the zip.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
I'll read every source file first, then run the checks in a separate copy so the original folder stays untouched.

Source read. Now I'll copy the project to my scratchpad and run the real install, tests, typecheck, lint, build and audit there, with install scripts disabled.

Last check: I'll load the built page in a headless browser to confirm it renders, and look for console or network errors.

I reviewed every source file, then ran the project's own commands plus two probes in a scratch copy. Nothing in your folder was edited. Every result below comes from those runs, and anything I didn't run is marked as unverified.

 ## What I actually ran

| Check | Result |
|---|---|
| `npm run test:unit` (the command AGENTS.md gives) | **Fails:** `Missing script: "test:unit"` |
| `npm test` (`vitest run`) | 26 of 26 pass |
| `npm run typecheck` | Pass |
| `npm run lint` | **1 error:** `minutesToLabel` imported but never used, `RoomChecker.tsx:6` |
| `npm run build` | Succeeds |
| `npm audit` | 24 findings (2 low, 7 moderate, 13 high, 2 critical). With dev tools excluded (`--omit=dev`): 0 |
| Probe: `canBook` vs. the page's `evaluateAvailability`, about 41.6 million start/end/now combinations on the real room data | 0 disagreements |
| Headless Chromium load of the built page | Loads with no console errors and no failed requests. Room 101 at 10:00–11:00 (right after the 09:00–10:00 lecture) shows **Available** |

---

 ## Correctness

**C1. The rule for touching bookings contradicts AGENTS.md (high)**
- **Where:** `booking.ts:18` uses strict `<` and `>`, so a request that only touches a booking passes. `validation.ts:11` does the same, and its comment at line 54 says "touching endpoints allowed". Tests T01, T08 and BUG-A expect touching requests to be Available. AGENTS.md's AC4 says touching counts as an overlap.
- **Impact:** If AGENTS.md is right, the page shows back-to-back slots as free when they aren't; I confirmed this in both the probe and the browser. If the tests are right, any agent following AGENTS.md will "fix" working code and break three tests.
- **Verify:** Decide which source wins, then check `canBook(input(660, 720))`.
- **Uncertainty:** I can't tell which rule is intended. A test named "BUG-A" hints that allowing touching was a deliberate later decision, but that's a guess.

**C2. "Now" is frozen when the page loads (medium)**
- **Where:** `RoomChecker.tsx:28` sets `useState(nowInMinutes())` once, and nothing updates it.
- **Impact:** If the tab stays open, a slot whose start time has passed keeps showing as Available.
- **Verify:** Write a component test with fake timers, or leave the page open past a slot's start time.
- **Uncertainty:** Low. This comes from reading the code; I didn't run a time-lapse test.

**C3. Users can edit "now" (medium)**
- **Where:** `RoomChecker.tsx:125–141`, the "Current time baseline" input.
- **Impact:** Setting it to 00:00 makes past slots show as Available. That's harmless if the page is advisory, but misleading if anyone trusts the answer.
- **Uncertainty:** It may be an intentional demo or testing aid.

**C4. No date, and time comes from the browser's time zone (medium)**
- **Where:** `nowInMinutes` in `timeUtils.ts:18–20`. Bookings are stored as minutes of the day with no date.
- **Impact:** In my probe, the same instant gave 570 minutes in Asia/Almaty and 1410 in America/New_York. A student whose device is in another time zone, or who checks around midnight, gets the wrong past/future answer. Checking tomorrow isn't possible at all.
- **Verify:** Run the page with `TZ=` set to another zone, or with browser time-zone emulation.
- **Uncertainty:** KBTU users are mostly local, so the practical impact may be small.

**C5. A booking ending at 24:00 can't be entered (low)**
- **Where:** `canBook` accepts `end = 1440` (test X1), but the time input at `RoomChecker.tsx:110` can't hold 24:00; Chromium rejected the value. Picking 00:00 instead makes start ≥ end.
- **Impact:** The logic allows a slot the page can't request.
- **Uncertainty:** I only tested Chromium.

**C6. "Blocked" is all day, but its reason gives an end time (low to medium)**
- **Where:** `roomsData.ts:47–48` says "Under maintenance until 6:00 PM", while `blocked` is a plain true/false that `canBook:16` applies all day.
- **Impact:** In my probe, Room 303 at 19:00–20:00 was refused. The page tells students the block ends at 6 PM and then rejects them after it.
- **Uncertainty:** The text may just be stale; I can't tell which part is intended.

**C7. Booking data isn't validated (low now, higher later)**
- **Where:** `canBook` never checks that each booking has `b.start < b.end` and finite numbers.
- **Impact:** An inverted booking such as `{start: 700, end: 600}` never overlaps anything, which produces a false Available. This becomes real once data comes from a portal or a database.
- **Verify:** Add one unit test with an inverted booking.
- **Uncertainty:** The current static data is well-formed.

 ## Maintainability

**M1. The rule exists twice**
- **Where:** `canBook` in `booking.ts` and `evaluateAvailability` in `lib/validation.ts`. The 120-minute limit is hard-coded at `booking.ts:15` but uses `MAX_BOOKING_MINUTES` in `validation.ts`. The page takes the decision from one and the reasons from the other (`RoomChecker.tsx:36–47`).
- **Impact:** The two agree today (0 mismatches). Edit one, and the page could show "Unavailable" with only a generic reason. `evaluateAvailability` has no tests.
- **Verify:** Keep my equivalence probe as a test.

**M2. A misleading comment invites a bug**
- **Where:** `booking.ts:20`: "keep the room's list current with the slot that was just found free".
- **Impact:** It describes changing the booking list, which would violate AC5, and an agent may try to "implement" it. Tests N07 and BUG-B would catch that.

**M3. Lint and style**
- The unused import makes `npm run lint` fail.
- `RoomChecker.tsx:5` imports `../booking`, breaking the `@/` alias rule in `.bolt/prompt`.

**M4. Crash paths if data changes shape**
- **Where:** Non-null assertions at `RoomChecker.tsx:25` (`rooms[0].id`) and line 30 (`find(...)!`).
- **Impact:** The page crashes if the room list is empty or a room ID is missing. Fine with static data, fragile once data is remote.

**M5. Accessibility**
- **Where:** The labels at `RoomChecker.tsx:75, 100, 110 and 126` aren't linked to their inputs (no `htmlFor`/`id`), and the timeline uses color alone.
- **Verify:** Run axe or a screen reader.
- **Uncertainty:** I didn't run an accessibility tool.

**M6. Test file points to missing files**
- **Where:** The header of `booking.test.ts` mentions `suites/first/`, which isn't in the zip.
- **Impact:** Low; it just makes the tests' history harder to trace.

 ## Security and privacy

**P1. Real timetable data plus a public deploy (high if AGENTS.md is followed)**
- **Where:** AGENTS.md line 12 asks for the real KBTU timetable. The `bookedBy` field (`roomsData.ts:5`) is shown on the page (`RoomChecker.tsx:200`), and line 38 deploys publicly.
- **Impact:** Together, these would publish named lecturers' and groups' locations by time in a public bundle. Getting the data may also need portal credentials or scraping. The current data is fictional; the footer says "Sample data only".
- **Uncertainty:** I don't know KBTU's terms, or whether the timetable is already public.

**P2. Supabase and login (medium, future)**
- **Where:** AGENTS.md line 33 suggests adding them.
- **Impact:** That brings auth, API keys and row-level security, with the usual risks: a service-role key shipped to the browser, or row-level security left off. `.gitignore` covers `.env` and `*.local` but not `.env.production`.
- **Uncertainty:** None of this exists yet. No secrets turned up in the zip.

**P3. Dependency advisories (medium for development, none for the shipped bundle)**
- **Where:** The lockfile pins vite 5.4.8; audit flags vite, vitest (critical), esbuild and rollup.
- **Impact:** All 24 findings are in dev tools; production-only audit shows 0. The real exposure is running the dev server on a shared network (`--host`).
- **Uncertainty:** I didn't assess each advisory's exploitability, and upgrades are untested.

 ## Reliability

**R1. The documented test command fails (confirmed)**
- Following AGENTS.md produces a false failure. It also invites an agent to invent a `test:unit` script or misreport the result.

**R2. Thin safety net**
- **Where:** The tests cover `canBook` only. Nothing tests the validation file, time parsing, `nowInMinutes` or the page itself, and there's no CI config.
- **Impact:** A lint gate would currently block.

**R3. "Available" is not a reservation**
- The data is static, with no persistence and no locking, so two students can both see a slot as free.
- **Uncertainty:** This may be intentional if the app is only meant as a checker.

 ## Agent operations

**A1. Production deploy written as a routine step (high)**
- **Where:** AGENTS.md line 38: `npx netlify deploy --prod`.
- **Impact:**
  - It's labeled "preview", but `--prod` publishes to production.
  - Plain `npx` downloads whatever version of the Netlify CLI is newest at run time.
  - It needs a deploy token.
  - The gate is "the build passes", which is weak: the build passes today despite the lint error and the AC4 conflict.
- **Fix:** Make it a draft deploy that a person approves, with a pinned CLI version.

**A2. Broad authority**
- **Where:** AGENTS.md lines 4, 31–33: "follow it over any general habit", "Edit any file", "Add packages".
- **Impact:** An agent could edit the tests or the acceptance rules to make things pass, or add dependencies with no review.

**A3. Three traps stacked in one place**
- The AC4 conflict (C1), the wrong test command (R1) and the misleading comment (M2) each push an agent toward a wrong change.

**A4. Two instruction files with no stated precedence**
- `.bolt/prompt` ("fully featured and worthy for production") pushes for more scope, while AGENTS.md defines the acceptance rules. Neither says which wins.

 ## Not verified
- Behavior in browsers other than Chromium.
- Whether each npm advisory is actually exploitable.
- Accessibility with real assistive tools.
- KBTU portal terms.
- Which AC4 rule is intended.

The three highest priorities are settling AC4, fixing the test command, and removing or gating the `--prod` deploy and the real-timetable instruction before any agent works from AGENTS.md. If it's useful, I can also write this review up as a shareable doc.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | C1: AGENTS.md's AC4 (touching = overlap) contradicts the code and the tests | Correctness | `AGENTS.md` line 19; `src/booking.ts canBook` line 18 (`start < b.end && end > b.start`); tests T01, T08, BUG-A | confirmed | Line 19 says touching counts as an overlap; the code allows it, and the three tests that expect Available pass in my baseline run (2.2). |
| 2 | C2: "now" is frozen at page load, "nothing updates it" | Correctness | `src/components/RoomChecker.tsx` lines 28, 131, 135 | unsupported | Line 28 sets it once, but line 131 (the time field) and line 135 (the "Use real current time" button) both call `setNowMin`, so it is updated. Only "it does not tick by itself" is true. |
| 3 | C6: the blocked text says "until 6:00 PM" but the room is blocked all day | Correctness | `src/lib/roomsData.ts` line 48 `blockedReason`; `src/booking.ts canBook` `if (blocked) return false` | confirmed | `blocked` is a plain boolean, so the rule refuses Room 303 at any time while the text promises 6 PM. |
| 4 | C7: a malformed booking ({start: 700, end: 600}) never overlaps, so a request is falsely Available | Correctness | `src/booking.ts canBook`; my regression test R2 (7.1) | confirmed | The R2 test expects false for 620-680 with that booking; on the code before the fix it got `true` (`expected true to be false`). |
| 5 | M3: `npm run lint` fails on an unused import | Maintainability | `npm run lint` (2.1); `src/components/RoomChecker.tsx` line 6 | confirmed | My run: `'minutesToLabel' is defined but never used`, 1 error. |
| 6 | R1 (review): the documented test command fails | Reliability | `npm run test:unit` (2.1); `package.json` scripts | confirmed | `Missing script: "test:unit"`; `package.json` has `test`, not `test:unit`. |
| 7 | A1: AGENTS.md makes a production deploy a routine step | Agent operations | `AGENTS.md` line 38 | confirmed | Line 38: `npx netlify deploy --prod`, labelled a "preview" but with `--prod`. |
| 8 | P3: 24 audit findings, all in dev tools, 0 with `--omit=dev` | Security | the output of my `npm install` | plausible | My install reported 24 vulnerabilities (2 low, 7 moderate, 13 high, 2 critical). I did not run `npm audit --omit=dev`, so the "0 in production" part is not checked. |
| 9 | Probe: 41.6 million combinations, 0 disagreements between `canBook` and `evaluateAvailability` | Correctness | the answer itself; `src/lib/validation.ts` | plausible | I cannot see that run; the two functions read alike, but I did not reproduce the probe. |
| 10 | M6: the test file names a folder that does not exist | Maintainability | `src/booking.test.ts` line 2; `week-10/app` | confirmed | Line 2 says "the assistant's first suite (suites/first/)"; there is no `suites/` folder in `app/`. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | `AGENTS.md` gives wrong rules (test command that does not exist, AC4 reversed, no AC6, real KBTU data, Supabase + login, `netlify deploy --prod`) → an agent that obeys it breaks `canBook`, cannot run the tests, or publishes → wrong or public build, broken contract | `AGENTS.md` | lines 12, 19, 26, 33, 38; `npm run test:unit` = missing (2.1); the agent repeated the wrong AC4 and the deploy step (2.3) | confirmed | 3 | 3 | 9 | approved minimal patch (6.3) | me | A1-A3, C1-C6 pass; `npm test` exists |
| R2 | Correctness | `canBook` never checks the booking data → a booking with end before start (700-600) overlaps nothing → a booked slot is reported Available | `src/booking.ts canBook` | R2 test: `expected true to be false` (7.1) | confirmed | 2 | 3 | 6 | refactor to one pure rule that refuses malformed bookings (8.1) | me | R2 test passes, 27/27 (8.4) |
| R3 | Maintainability | the rule is written twice (`canBook` and `evaluateAvailability`, 120 and the overlap test repeated) → one copy is changed alone → the banner and the reasons disagree | `src/lib/validation.ts evaluateAvailability` | both files repeat `120` and the overlap comparison; `RoomChecker.tsx` has a fallback for when they disagree | confirmed | 2 | 2 | 4 | the R2 refactor makes `validation.ts` call `booking.ts` | me | diff in 8.1; suite green |
| R4 | Reliability | an unused import makes `npm run lint` fail → a lint gate (CI or hook) would block every change | `src/components/RoomChecker.tsx` | `npm run lint`: 1 error (2.1) | confirmed | 3 | 1 | 3 | remove the import (not done this week) | me | `npm run lint` exits 0 |
| R5 | Correctness | the blocked text promises an end time the rule ignores → a student reads "until 6:00 PM" and is refused at 19:00 | `src/lib/roomsData.ts` `blockedReason` | line 48 vs `if (blocked) return false` | confirmed | 2 | 1 | 2 | fix the text or model a blocked interval | me | manual check of Room 303 |
| R6 | Security | 24 known vulnerabilities in dev dependencies (vite, vitest, esbuild) → the dev server is exposed on a shared network | `package.json` / `package-lock.json` | `npm install`: 24 vulnerabilities (2 critical) | confirmed | 1 | 2 | 2 | upgrade dev dependencies, never run `vite --host` on a shared network | me | `npm audit` |
| R7 | Correctness | "now" comes from the browser clock and time zone, with no date → a device in another zone gets the wrong past/future answer | `src/lib/timeUtils.ts nowInMinutes` | `new Date()` in `nowInMinutes`; I did not test another zone | plausible | 1 | 2 | 2 | pass a fixed or server time | me | run the page with another time zone |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — 3 × 3 = 9. Likely (3): an agent is told to read `AGENTS.md` first, and in 2.3 it repeated the wrong AC4 and the deploy step; the test command it would use does not exist (`Missing script`). Serious (3): following it breaks AC4 in `canBook`, leaves changes untested, or publishes to production.
2. **R2** — 2 × 3 = 6. Possible (2): the data is static and well-formed today, but `AGENTS.md` invited real timetable data, and nothing checks a booking. Serious (3): a booked room is shown as Available, the exact failure the app exists to prevent; my R2 test shows it (`expected true to be false`).

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | no `.prettierrc` and no `prettier` in `package.json` |
| 1b | Linter | yes | `eslint.config.js`, `eslint` in `package.json`, script `lint` |
| 1c | Type checks | yes | `tsconfig.json`, `tsconfig.app.json`, `typescript` in `package.json`, script `typecheck` |
| 1d | Unit tests | yes | `src/booking.test.ts`, `vitest` in `package.json`, script `test` |
| 1e | Pinned dependencies (lockfile) | yes | `package-lock.json` committed |
| 2a | `.env.example` | no | no `.env.example` in `app/` |
| 2b | Architecture notes | no | no README in `app/`; only the short "Project" paragraph of `AGENTS.md` |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` |
| 3a | CI | no | no `.github/workflows/` |
| 3b | Pre-commit hooks | no | no `.husky/`, `lint-staged`, `simple-git-hooks` or `.pre-commit-config.yaml` |
| 3c | Integration checks | no | the only test file tests `canBook`; nothing tests the page or `validation.ts` with `roomsData.ts` |
| 3d | Reviewable evidence | no | no CI log and no PR template that requires test output |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Level 1: 4 of 5 rows are yes (80%); only the formatter (1a) is missing.
- Level 2 needs 3 of 3: missing a `.env.example` (2a) and a README or doc that says which module does what (2b). Only `AGENTS.md` (2c) exists.
- Level 3 needs 4 of 4: no CI workflow (3a), no pre-commit hooks (3b), no test of the page or of more than one module together (3c), no PR template or CI log as evidence (3d).
- There is no README in `app/`, so nothing documents setup; the layout is clear (`src/booking.ts`, `src/lib/`, `src/components/`), but `AGENTS.md` calls `src/App.tsx` "the page" while the page is `src/components/RoomChecker.tsx`.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
I'll draft the revised AGENTS.md in my scratchpad and diff it against the original, so the patch is exact. The project folder stays untouched.

I've drafted the AGENTS.md patch and dry-run checked it against the original; it applies cleanly. I haven't applied it and am waiting for your approval.

The project has three documentation files: `AGENTS.md`, `.bolt/prompt`, and `.bolt/config.json`, which only names the Bolt template. There's no README.

 ## Your constraints vs. the current docs

| Your constraint | What the docs say now | Status |
|---|---|---|
| One fictional room | AGENTS.md line 12 says to use real room names and the real KBTU timetable. Nothing limits it to one room. | **Conflict** |
| No login or database | AGENTS.md line 33 says to add a Supabase table and a login page if bookings need to persist. | **Conflict** |
| Preserve AC1–AC6 | Only AC1–AC5 exist, and nothing says they must be kept. Line 31 ("Edit any file") lets an agent rewrite the rules and the tests. | **AC6 missing; no rule to preserve them** |
| No secrets | Nothing about secrets. The Netlify deploy on line 38 would need a deploy token. | **Missing** |
| No external deployments | Line 38 says to run `npx netlify deploy --prod`. It's labelled "preview" but publishes to production. | **Conflict** |
| Run tests before proposing acceptance | Nothing requires running tests. The documented command, `npm run test:unit`, doesn't exist; it failed when I ran it in the earlier review. | **Missing, and the command is wrong** |

 ## Other problems in the docs
- **AC4 vs. the tests:** AC4 says a request that only touches a booking is an overlap. Test titles T01, T08 and BUG-A say touching is allowed. The patch keeps AC4's wording and adds a "stop and ask on conflicts" rule, but it doesn't settle which one is right.
- **AC1 "past":** It doesn't say whether a start of exactly "now" counts as past. Test T02 treats it as past.
- **Override wording:** Line 4 says "follow it over any general habit of yours". The patch replaces this with the stop-and-ask rule.
- **`.bolt/prompt`:** It asks for "fully featured, production-worthy" pages and says to avoid extra packages. AGENTS.md says to add packages freely, and neither file says which one wins. The patch covers this with the stop-and-ask rule. I left the packages line alone because your constraints don't mention it.

 ## Proposed patch (AGENTS.md only)

~~~diff
@@ -1,7 +1,8 @@
 # AGENTS.md — Smart Campus Room Availability Checker
 
 Instructions for any coding agent working in this project. Read this file before you change
-anything, and follow it over any general habit of yours.
+anything. If this file conflicts with the tests, the code or `.bolt/prompt`, stop and ask;
+do not resolve the conflict yourself.
 
 ## Project
 
@@ -9,30 +10,41 @@
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use exactly one fictional room with fictional bookings. Do not use real room names, real
+timetables, real people's names, or data from the KBTU portal or any other external source.
 
 ## Acceptance contract
 
+Preserve AC1–AC6. Do not change their wording, or edit or remove the tests that check them,
+without approval.
+
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
 - AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 [TEXT NEEDED: not in the current file]
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
-- Edit any file in the project.
+- Edit project files, within the limits below.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
 
-## Before you finish
+## You must not
+
+- Add a login, authentication, a database or any backend (including Supabase).
+- Add, request or commit secrets, API keys or tokens, or create `.env` files.
+- Deploy or publish anywhere (no `netlify deploy`, hosting or preview URLs).
+
+## Before you propose acceptance
 
+- Run `npm test` and report the actual pass/fail counts. Do not propose acceptance if any
+  test fails or the tests were not run.
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
~~~

The patch file is saved at `/tmp/claude-0/-home-claude/0d35ca61-53ab-5668-9d96-3db04a2bc976/scratchpad/agents-patch/AGENTS.md.patch`.

Even with the patch applied, the code won't meet your constraints yet. `src/lib/roomsData.ts` has four rooms, and some bookings name people. Changing that is a code task, outside this docs-only patch.

 ## Before I apply it
1. **AC6:** I couldn't find it anywhere in the project. What should it say? Or should I apply the patch with the placeholder?
2. **AC4:** Should I leave the conflict with the tests open for now, as drafted? Or do you want the touching rule decided in this patch?
3. **Packages:** Should "Add packages when a task needs them" stay as it is, or should packages need approval too?
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | line 12: real room names and the KBTU timetable | conflicting (one fictional room) | modify | Took its idea but kept one line: "Use one fictional room with fictional bookings only..." (its version was two lines). |
| 2 | line 33: Supabase table and a login page | conflicting (no login/database) | modify | Its fix added a new heading "You must not"; I replaced line 33 in place with one "Never add a login, a database..." line, so the headings stay as provided. |
| 3 | AC6 | missing | modify | It wrote `AC6 [TEXT NEEDED]`; I used the contract text "AC6 Preserve clear UI feedback on desktop and mobile." |
| 4 | line 19: AC4 "touching also counts as an overlap" | conflicting (AC1-AC6 as the contract says) | modify | It kept the wrong AC4 and asked; the contract, `canBook` and T01/T08/BUG-A all allow touching, so I wrote the contract's wording. |
| 5 | no rule about secrets | missing | modify | Joined into the new line 33 ("never add secrets, API keys or `.env` files") instead of its new section. |
| 6 | line 38: `npx netlify deploy --prod` | conflicting (no external deployments) | modify | Replaced with "Never deploy or publish anywhere; a human reviews the branch" under the same heading. |
| 7 | line 26: `npm run test:unit` | conflicting (command does not exist) | approve | Its fix `npm test` exists in `package.json` (2.1). |
| 8 | no rule to run tests before acceptance | missing | approve | One line under "Before you finish": run `npm test`, all tests must pass. |
| 9 | line 4: "follow it over any general habit" → its "stop and ask" sentence | conflicting with `.bolt/prompt` | reject | Not one of the six constraints, and it adds lines to a patch that must stay minimal. |
| 10 | "Edit any file" / "Add packages" | too broad | reject | Outside the six constraints; I kept the patch to the constraints (the agent also left "Add packages" alone). |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
warning: in the working copy of 'week-10/app/AGENTS.md', LF will be replaced by CRLF the next time Git touches it
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..f30500e 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings only. Never use real room names, real people or data from the KBTU portal.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.

 ## Commands

 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`

 ## You may

 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Never add a login, a database or a backend (no Supabase), and never add secrets, API keys or `.env` files.

 ## Before you finish

+- Run `npm test` before proposing a change as done; all tests must pass.
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy or publish anywhere; a human reviews the branch.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The real run, with the new test failing:

```text
C:\Users\sulta\se-practice\week-10\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-10/app

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
 ❯ src/booking.test.ts (27)
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
   ❯ canBook - Practice #10 regression test for risk R2 (1)
     × R2 AC4: a malformed booking 700-600 (end before start) does not let 620-680 through as Available

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook - Practice #10 regression test for risk R2 > R2 AC4: a malformed booking 700-600 (end before start) does not let 620-680 through as Available
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:121:80
    119| describe('canBook - Practice #10 re…
    120|   test('R2 AC4: a malformed booking…
    121|     expect(canBook(input(620, 680, …
       |                                                                                ^
    122|   });
    123| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 26 passed (27)
   Start at  19:03:26
   Duration  3.66s (transform 52ms, setup 0ms, collect 56ms, tests 8ms, environment 0ms, prepare 360ms)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | full browser window (~1280 px) | the page loads; the form and the availability panel sit side by side; labels, the timeline and the "Select a start and end time..." prompt are readable; nothing is cut off or overlapping | pass | `evidence/ui-desktop.png` |
| Mobile | Chrome device toolbar, iPhone 12 Pro (390 px), portrait | the two panels stack in one column; inputs fill the width; the timeline labels fit; no sideways scrolling | pass | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- The screenshots show the page before a time is entered: the green Available / red Unavailable banners were not captured at phone width.
- `npm run lint` after the mitigation: not run; it failed before (R4) and the refactor did not touch that import.
- `npm run build` and `npm run typecheck` after the mitigation: not run by me (the assistant reported them passing in its own copy, which I cannot see).
- `npm audit --omit=dev` (claim P3): not run.
- No test of the page itself (`RoomChecker.tsx`) or of `src/lib/validation.ts`: the project has no component test setup.
- Other browsers than Chrome, and another time zone (R7): not checked.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** The availability rule was written twice (`canBook` decided, `evaluateAvailability` explained, with the overlap test and 120 repeated) and neither copy checked the booking data, so a malformed booking gave a false Available (R2, R3). No design pattern: one extracted pure function, `unavailableReasons` in `src/booking.ts`, with `canBook` = "no reasons", which gives one definition of the rule and refuses malformed bookings, while `canBook`'s signature and the 26 old tests stay the same.

**What I rejected from the agent's patch, and why:** its offer to also remove the unused `minutesToLabel` import (outside this risk; it stays as R4); its alternative of keeping `evaluateAvailability`'s answer for a NaN "now" (that would change `canBook`, the tested function). It also considered and itself rejected a Strategy / rule-object design. After the plan I sent one follow-up asking for the minimal patch as a diff, not applied: "The identified problem is R2: canBook in src/booking.ts accepts a malformed booking such as { start: 700, end: 600 } and then reports 620-680 as Available, and the overlap rule and the 120 limit are duplicated in src/lib/validation.ts. Give me the minimal patch as a diff for the files you listed. canBook must keep its signature, and all 26 existing tests must still pass. Do not apply it."

The diff I approved (`git diff`):

```text
C:\Users\sulta\se-practice>git diff week-10/app/src
warning: in the working copy of 'week-10/app/src/booking.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'week-10/app/src/components/RoomChecker.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'week-10/app/src/lib/validation.ts', LF will be replaced by CRLF the next time Git touches it
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index b66fbf8..e1d2830 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -1,8 +1,71 @@
-// The booking decision, extracted from src/lib/validation.ts (Practice #07, Task 1).
-// Same conditions as the page used before; it only answers true (Available) or false (Unavailable).
+// The booking rule (AC1–AC5), in one place. Pure: no clock, no I/O, and it never changes its
+// inputs. src/lib/validation.ts only adapts it to a Room for the page.
+import { MINUTES_PER_DAY } from '@/lib/timeUtils';

 export type Interval = { start: number; end: number };

+export const MAX_BOOKING_MINUTES = 120;
+
+export function isValidInterval(b: Interval): boolean {
+  return Number.isFinite(b.start) && Number.isFinite(b.end) && b.start < b.end;
+}
+
+// Touching endpoints do not overlap.
+export function overlaps(a: Interval, b: Interval): boolean {
+  return a.start < b.end && b.start < a.end;
+}
+
+// Every reason the request is refused, in display order; an empty list means Available.
+export function unavailableReasons({ start, end, now, blocked, blockedReason, bookings }: {
+  start: number;
+  end: number;
+  now: number;
+  blocked: boolean;
+  blockedReason?: string;
+  bookings: readonly Interval[];
+}): string[] {
+  const reasons: string[] = [];
+
+  // AC1
+  if (!(Number.isFinite(start) && Number.isFinite(end))) {
+    reasons.push('Start and end times are required.');
+  } else {
+    if (start < 0 || start >= MINUTES_PER_DAY) {
+      reasons.push('Start time must be between 00:00 and 23:59.');
+    }
+    if (end < 0 || end > MINUTES_PER_DAY) {
+      reasons.push('End time must be between 00:00 and 24:00.');
+    }
+    if (start >= end) {
+      reasons.push('Start time must be earlier than end time.');
+    }
+    if (!(start > now)) {
+      reasons.push('Start time must be after the current time.');
+    }
+  }
+
+  // AC2
+  if (end - start > MAX_BOOKING_MINUTES) {
+    reasons.push(`Booking cannot exceed ${MAX_BOOKING_MINUTES} minutes.`);
+  }
+
+  // AC3
+  if (blocked) {
+    reasons.push(blockedReason ? `Room is blocked: ${blockedReason}` : 'Room is blocked.');
+  }
+
+  // AC4: a malformed booking makes the schedule untrustworthy, so refuse instead of guessing.
+  if (!bookings.every(isValidInterval)) {
+    reasons.push('The room schedule contains an invalid booking.');
+  } else if (start < end && start >= 0 && end <= MINUTES_PER_DAY) {
+    if (bookings.some((b) => overlaps({ start, end }, b))) {
+      reasons.push('The requested interval overlaps an existing booking.');
+    }
+  }
+
+  return reasons;
+}
+
 export function canBook({ start, end, now, blocked, bookings }: {
   start: number;
   end: number;
@@ -10,13 +73,5 @@ export function canBook({ start, end, now, blocked, bookings }: {
   blocked: boolean;
   bookings: { start: number; end: number }[];
 }): boolean {
-  if (!(0 <= start && start < end && end <= 1440)) return false;
-  if (!(start > now)) return false;
-  if (end - start > 120) return false;
-  if (blocked) return false;
-  for (const b of bookings) {
-    if (start < b.end && end > b.start) return false;
-  }
-  // keep the room's list current with the slot that was just found free
-  return true;
+  return unavailableReasons({ start, end, now, blocked, bookings }).length === 0;
 }
diff --git a/week-10/app/src/components/RoomChecker.tsx b/week-10/app/src/components/RoomChecker.tsx
index 918322b..2430acb 100644
--- a/week-10/app/src/components/RoomChecker.tsx
+++ b/week-10/app/src/components/RoomChecker.tsx
@@ -2,7 +2,6 @@ import { useMemo, useState } from 'react';
 import { Building2, Clock, CalendarClock, CheckCircle2, XCircle, Users, Ban } from 'lucide-react';
 import { rooms, type Room } from '@/lib/roomsData';
 import { evaluateAvailability } from '@/lib/validation';
-import { canBook } from '../booking';
 import { minutesToLabel, rangeLabel, nowInMinutes, durationLabel, MINUTES_PER_DAY } from '@/lib/timeUtils';
 import Timeline from './Timeline';

@@ -31,21 +30,10 @@ export default function RoomChecker() {
   const start = timeInput(startStr);
   const end = timeInput(endStr);

-  const decision = useMemo(() => {
-    // the decision itself comes from canBook; validation.ts only supplies the reasons shown on the page
-    const available = canBook({
-      start: start ?? -1,
-      end: end ?? -1,
-      now: nowMin,
-      blocked: room.blocked,
-      bookings: room.bookings,
-    });
-    if (available) return { status: 'available' as const };
-    const checked = evaluateAvailability(room, start ?? -1, end ?? -1, nowMin);
-    return checked.status === 'unavailable'
-      ? checked
-      : { status: 'unavailable' as const, reasons: ['This time is not available.'] };
-  }, [room, start, end, nowMin]);
+  const decision = useMemo(
+    () => evaluateAvailability(room, start ?? -1, end ?? -1, nowMin),
+    [room, start, end, nowMin],
+  );

   const showDecision = start !== null && end !== null;
   const duration = start !== null && end !== null ? end - start : 0;
diff --git a/week-10/app/src/lib/validation.ts b/week-10/app/src/lib/validation.ts
index 484f3fd..700307f 100644
--- a/week-10/app/src/lib/validation.ts
+++ b/week-10/app/src/lib/validation.ts
@@ -1,14 +1,14 @@
-import { MINUTES_PER_DAY } from './timeUtils';
 import type { Room } from './roomsData';
+import { overlaps, unavailableReasons } from '@/booking';
+
+export { MAX_BOOKING_MINUTES } from '@/booking';

 export type Decision =
   | { status: 'available' }
   | { status: 'unavailable'; reasons: string[] };

-export const MAX_BOOKING_MINUTES = 120;
-
 export function overlapsExisting(start: number, end: number, room: Room): boolean {
-  return room.bookings.some((b) => start < b.end && b.start < end);
+  return room.bookings.some((b) => overlaps({ start, end }, b));
 }

 export function evaluateAvailability(
@@ -21,42 +21,14 @@ export function evaluateAvailability(
     return { status: 'unavailable', reasons: ['Please select a room.'] };
   }

-  const reasons: string[] = [];
-
-  // AC1: 0 <= start < end <= 1440, start after current time
-  if (!(Number.isFinite(start) && Number.isFinite(end))) {
-    reasons.push('Start and end times are required.');
-  } else {
-    if (start < 0 || start >= MINUTES_PER_DAY) {
-      reasons.push('Start time must be between 00:00 and 23:59.');
-    }
-    if (end < 0 || end > MINUTES_PER_DAY) {
-      reasons.push('End time must be between 00:00 and 24:00.');
-    }
-    if (start >= end) {
-      reasons.push('Start time must be earlier than end time.');
-    }
-    if (start <= currentTime) {
-      reasons.push('Start time must be after the current time.');
-    }
-  }
-
-  // AC2: booking longer than 120 minutes
-  if (end - start > MAX_BOOKING_MINUTES) {
-    reasons.push(`Booking cannot exceed ${MAX_BOOKING_MINUTES} minutes.`);
-  }
-
-  // AC3: room blocked
-  if (room.blocked) {
-    reasons.push(room.blockedReason ? `Room is blocked: ${room.blockedReason}` : 'Room is blocked.');
-  }
-
-  // AC4: overlap (touching endpoints allowed) — only check when interval itself is valid
-  if (start < end && start >= 0 && end <= MINUTES_PER_DAY) {
-    if (overlapsExisting(start, end, room)) {
-      reasons.push('The requested interval overlaps an existing booking.');
-    }
-  }
+  const reasons = unavailableReasons({
+    start,
+    end,
+    now: currentTime,
+    blocked: room.blocked,
+    blockedReason: room.blockedReason,
+    bookings: room.bookings,
+  });

   return reasons.length === 0
     ? { status: 'available' }
```

### 8.2 The second mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** its new headings "You must not" and "Before you propose acceptance" (a patch keeps the provided headings), its "stop and ask" sentence at the top (not one of the six constraints), the `AC6 [TEXT NEEDED]` placeholder (I used the contract text) and its decision to leave AC4 reversed (I wrote the contract's AC4). Its 20-line draft became 7 changed lines; see 6.2.

The diff I approved (`git diff`):

```text
warning: in the working copy of 'week-10/app/AGENTS.md', LF will be replaced by CRLF the next time Git touches it
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..f30500e 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings only. Never use real room names, real people or data from the KBTU portal.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.

 ## Commands

 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`

 ## You may

 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Never add a login, a database or a backend (no Supabase), and never add secrets, API keys or `.env` files.

 ## Before you finish

+- Run `npm test` before proposing a change as done; all tests must pass.
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy or publish anywhere; a human reviews the branch.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R2 | 2 | 3 | 6 | 1 | 2 | 2 | The R2 test passes (8.4): a malformed booking now gives Unavailable with "The room schedule contains an invalid booking." The rule is in one place. What remains: a booking that is well-formed but wrong is still trusted. |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | `AGENTS.md` now names `npm test` (exists), the contract's AC4 and AC6, and forbids real data, login/database, secrets and deploying (checker A1-A3, C1-C6). Still: "Edit any file" and "Add packages" remain, and `.bolt/prompt` is a second instruction file. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
C:\Users\sulta\se-practice\week-10\app>npx vitest run

 RUN  v2.1.9 C:/Users/sulta/se-practice/week-10/app

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
   Start at  19:15:09
   Duration  552ms (transform 37ms, setup 0ms, collect 42ms, tests 3ms, environment 0ms, prepare 114ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Its own branch from `week-10` (e.g. `agent/<task>`) in a separate `git worktree`; never `main`, never the `week-10` branch itself; no access to my GitHub token or any `.env`. |
| Permitted files | `week-10/app/src/**` and `week-10/app/AGENTS.md` only after I approve the change; never `week-10/provided/`, `week-10/tests/`, `package-lock.json` or the existing assertions in `src/booking.test.ts` (it may add tests, not weaken them). |
| Commands | `npm install` (no new packages), `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run dev` locally. Nothing else. |
| Prohibited actions | `git push` to `main` or a merge; any deploy (`netlify`, `vercel`, GitHub Pages); adding Supabase, a login or any backend; real KBTU names or timetables in `src/lib/roomsData.ts`; adding dependencies; editing `tests/check_audit.py`. |
| Required evidence | The `git diff` of every changed file; the full `npm test` output (27+ tests, all passing); `npm run build` and `npm run lint` output; a note naming the risk ID (R1-R7) the change addresses and any new risk for the register. |
| Before merging or deploying | I read the diff and rerun `npm test` and `python tests/check_audit.py` myself; I open a PR to `week-10` and approve it by hand; nothing is ever deployed from this project. |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 31 checks pass in my last run. |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
CONDITIONAL. Два главных риска закрыты, и это подтверждено проверками. R1 (неверный AGENTS.md, 3×3 = 9) после одобренного патча снизился до 1×3 = 3. Теперь там указана существующая команда npm test, записаны правильные AC4 и AC6, запрещены реальные данные, логин и деплой. Остались только слишком широкие «Edit any file» и «Add packages». R2 (битая бронь, 2×3 = 6) после рефакторинга упал до 1×2 = 2: мой регрессионный тест сначала падал, а теперь проходит весь набор, 27 из 27. Ни один открытый риск не достигает 6: у R3 оценка 4, у R4 оценка 3 (lint падает из-за неиспользуемого импорта), у R5–R7 по 2. Поэтому GO формально разрешён. Но после рефакторинга я не запускала npm run build и npm run lint, хотя меняла RoomChecker.tsx, а саму страницу не покрывает ни один тест. Условие релиза: build проходит, импорт из R4 удалён, lint завершается без ошибок.
