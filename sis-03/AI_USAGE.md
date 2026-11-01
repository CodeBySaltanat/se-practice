# AI Usage Disclosure — SIS #03
 
Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.
 
| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Claude (claude.ai) | Claude Opus 5.5 | the plan (stage A) | report.md §11 B1 | this SIS |
| Claude (claude.ai) | Claude Opus 5.5 | Python v1 (stage B) | `code/original/booking_v1.py` (and `code/booking.py`, identical) | this SIS |
| Bolt.new | model not displayed | web prototype v1 (stage B) | `web/original/` | week-06 |
| Claude (claude.ai), new chat | Claude Opus 5.5 | critique (stage C) | report.md §8, §11 B4 | this SIS |
| Bolt.new | model not displayed | repair (stage D): "Until midnight (24:00)" and Room 505 | `web/final/project/src/components/RoomChecker.tsx`, `web/final/project/src/lib/roomsData.ts` | this SIS (on top of my Week 06 final) |
 
**The assistant wrote, or helped write, my tests in `code/`:** no
 
**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes
 
**Every result in report.md section 5 was actually run or seen, not assumed:** yes
Python columns: the files were run (unit tests and the checker's run). Page v1: my run of the Week 06
v1 on 2026-10-18. Page final: my run on 2026-11-01.
 
**Everything I submitted, I can explain and defend in class** yes
 
**Anything I accepted from the AI without fully understanding it:**
The React details of `web/final/project/src/components/RoomChecker.tsx` (`useState`, `useMemo`).
I understand what the page does and how `validation.ts` decides, but not every React detail.
 
Signed: Saltanat Sultanakhmet
Date: 2026-11-01
 
