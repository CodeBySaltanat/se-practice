# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai) | Claude Opus 5.5 | the first test suite (Task 3) | `suites/first/booking.test.ts` (as generated) |
| Claude (claude.ai), same chat | Claude Opus 5.5 | the improvement prompt (Task 5) | its N01–N06 cases went into `app/src/booking.test.ts` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes
The helper chat moved the conditions of `evaluateAvailability` (`src/lib/validation.ts`) into
`canBook` in `src/booking.ts` without changing them, and made `RoomChecker.tsx` call it. I checked
that the page still gives the same results (U1–U5) and that all plan cases pass. No defect was fixed.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** no

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
All runs in §6.1, §6.3 and §7 are from `npx vitest run` on my computer.

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**

Signed: Saltanat Sultanakhmet
Date: 2026-11-08
