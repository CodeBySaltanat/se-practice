# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude (claude.ai web) | Claude Opus 5.5 | 2026-11-16 | codebase analysis (Task 1), report.md 8.1 | none (answer only) |
| Claude (claude.ai web) | Claude Opus 5.5 | 2026-11-16 | improvement plan, revised steps 1, 7, 9 (8.2) | none (answer only) |
| Claude (claude.ai web) | Claude Opus 5.5 | 2026-11-17 | review of `unavailableReasons` against `canBook` (8.3) | none (answer only); I removed one stale comment in `canBook` after it |
| Claude (a separate helper chat) | Claude Opus 5.5 | 2026-11-16 / 17 | step-by-step guidance; the context message and the prompts of 8.2 and 8.3; feature extension (Task 2): `rooms.ts`, `filter.ts`, `checkRoom`; refactoring (Task 3): `RoomChecker.tsx`, `FilterPanel.tsx`, `Timeline.tsx`, `lib/timeUtils.ts`, `unavailableReasons`, deleting `lib/validation.ts` and `lib/roomsData.ts`; tests (Task 4): `filter.test.ts`, `catalog.test.ts`; `app/README.md`; the two diagrams; drafts of report.md sections 1-9, this file and `submission.yml` | `app/src/*`, `app/README.md`, `diagrams/*.puml`, `report.md` (not section 10), `AI_USAGE.md`, `submission.yml` |

**The assistant wrote, or helped write, tests in `app/`:** yes
The helper chat wrote `src/filter.test.ts` (7 tests) and `src/catalog.test.ts` (13 tests). Each test
uses a small fixed catalog inside the test, so the expected value can be worked out by hand from the
rule: e.g. F1 with capacities 8, 12, 20 and 10 attendees keeps 12 and 20; B5 keeps capacity 8 for 8
people; F5 gives false for room a (booked 600-660) and true for room b (no bookings) for the same
600-660. I checked these against F1-F5 and AC1-AC5, not against what the code returns. The 26 tests
in `booking.test.ts` are from Practices 07-08, unchanged.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
`src/booking.ts` `unavailableReasons`: the overlap reason calls `canBook` with `now: start - 1` and
one booking at a time; I understand what it checks, but this trick was the helper chat's idea.
The Tailwind classes in `src/components/*.tsx` were written by the helper chat; I checked the page
on desktop and at phone width, not every class.

Signed: Saltanat Sultanakhmet
Date: 2026-11-17
