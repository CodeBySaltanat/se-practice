# AI Usage Disclosure — Week 11

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai web, a zip of `app/` uploaded) | Claude Opus 5.5 | the feature: mock adapter, explain.ts, the button (Task 3) | `src/booking.ts`, `src/explain.ts`, `src/lib/validation.ts`, `src/lib/timeUtils.ts`, `src/components/RoomChecker.tsx`, `src/explain.test.ts`, `src/availabilityReason.test.ts` (accepted); `AGENTS.md` (rejected) |
| Claude (claude.ai web, three fresh chats) | Claude Opus 5.5 | the three prompts compared (Task 4) | none — a fresh chat per prompt |
| Claude (claude.ai web, a fresh chat with three uploaded files) | Claude Sonnet 5.5 | read-only agentic review (Task 6) | none — "Do not edit files" |

**Every file the assistant changed in Task 3 was reviewed by me before I accepted it (§4.2):** yes
<!-- Name anything you accepted without reading. -->

**No API key, token or provider call is anywhere in `app/src/`:** yes

**The review in Task 6 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->
It only had three uploaded files.

**I labelled every finding in §7.3 after verifying it myself:** yes
Each one was run in a copy of the project (with the helper chat) or read in the cited file; V1 and V2
also by my own failing test runs (`2 failed | 130 passed`).

**I used another assistant as well (to explain an error, to draft text in lab-report.md, …):** no
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
(In 4.1 and 7.2 the answers' own code fences are written as `~~~` and their heading lines are indented
by one space, so they do not break the report's sections.)

**I can explain how explainAvailability handles a timeout and a contradicting answer, without the
assistant:** yes

**Anything I accepted from the AI without fully understanding it:**

Signed: Saltanat Sultanakhmet
Date: 2026-11-26
