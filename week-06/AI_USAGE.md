# AI Usage Disclosure — Week 06

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Bolt.new | model not displayed (free plan) | Generating v1 from the initial prompt | `original/project/` |
| Bolt.new | model not displayed (free plan) | Fix prompt 1 (supplied current time), cleanup prompt 2 (timeline labels), cleanup prompt 3 (unused Supabase dependency) | `prototype/project/` (`src/components/RoomChecker.tsx`, `src/components/Timeline.tsx`, `package.json`) |
| Claude (claude.ai, separate helper chat) | Claude Opus 5.5 | preparing this file and `submission.yml` | `AI_USAGE.md`, `submission.yml` |

**Bolt.new was available to me:** yes — no fallback tool was used.

**I ran every case myself in the page, and every screenshot in `evidence/` is an unedited capture:** yes

**`original/` holds Bolt's first version exactly as downloaded, saved before any cleanup prompt:** yes

**Everything I submitted, I can explain and defend in class — including the component in §8:** yes

**Anything I accepted from the AI without fully understanding it:**
The React details of `RoomChecker.tsx` (hooks such as `useMemo`). I understand what the page does
and how `validation.ts` decides, but not every React detail. 

Signed: Saltanat Sultanakhmet
Date: 2026-10-18
