# AI Usage Disclosure — Week 11

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai web, a zip of `app/` uploaded) | Claude Opus 5.5 | the feature: mock adapter, explain.ts, the button (Task 3) | `src/booking.ts`, `src/explain.ts`, `src/lib/validation.ts`, `src/lib/timeUtils.ts`, `src/components/RoomChecker.tsx`, `src/explain.test.ts`, `src/availabilityReason.test.ts` (accepted); `AGENTS.md` (rejected) |
| Claude (claude.ai web, three fresh chats) | Claude Opus 5.5 | the three prompts compared (Task 4) | none — a fresh chat per prompt |
| Claude (claude.ai web, a fresh chat with three uploaded files) | Claude Sonnet 5.5 | read-only agentic review (Task 6) | none — "Do not edit files" |
| Claude (a separate helper chat) | Claude Opus 5.5 | the two fixes (Task 7) and the rest: step-by-step guidance; wrote prompts A, B and C; wrote the E1-E9 tests and the V1-V2 tests; added the "Simulate API failure" checkbox; put prompt B in `explain.ts` as `SYSTEM_INSTRUCTION`; turned the `test.each` tables into one test per table; ran the reviewer's findings in a copy of the project with me; drafted lab-report.md sections 1-8 and 9, this file and `submission.yml` | `src/explain.ts`, `src/components/RoomChecker.tsx`, `src/explain.test.ts`, `src/availabilityReason.test.ts`, `lab-report.md` (not section 10), `AI_USAGE.md`, `submission.yml` |

**Every file the assistant changed in Task 3 was reviewed by me before I accepted it (§4.2):** yes
<!-- Name anything you accepted without reading. -->
I decided each of the 8 files with the helper chat's summary of what changed in it and the test
run; I did not read every line of `src/explain.ts` (281 lines) and of its 74 tests myself.

**No API key, token or provider call is anywhere in `app/src/`:** yes

**The review in Task 6 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->
It only had three uploaded files.

**I labelled every finding in §7.3 after verifying it myself:** yes
Each one was run in a copy of the project (with the helper chat) or read in the cited file; V1 and V2
also by my own failing test runs (`2 failed | 130 passed`).

**I used another assistant as well (to explain an error, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
A separate Claude Opus 5.5 helper chat (row 4): it drafted lab-report.md sections 1-9. Section 10 is mine.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
(In 4.1 and 7.2 the answers' own code fences are written as `~~~` and their heading lines are indented
by one space, so they do not break the report's sections.)

**I can explain how explainAvailability handles a timeout and a contradicting answer, without the
assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
`src/explain.ts`: the regular expressions in `timesMentioned`, `countSentences` and `agreesWithStatus`,
and the `AbortController` wiring in `callWithTimeout`; I know what each one is for and that the tests
cover them, but I could not write them myself.

Signed: Saltanat Sultanakhmet
Date: 2026-11-26
