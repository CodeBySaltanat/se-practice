# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai web, a zip of `app/` uploaded) | Claude Opus 5.5 | read-only risk review (Task 2) and the read-the-playbook prompt (Task 1) | none — "WITHOUT editing files"; it worked on its own copy of the zip |
| Claude (same chat) | Claude Opus 5.5 | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, only after my approval, and only the modified 7-line version in lab-report.md 6.2-6.3 |
| Claude (same chat) | Claude Opus 5.5 | refactor plan and the minimal patch for R2 (Task 8) | `src/booking.ts`, `src/lib/validation.ts`, `src/components/RoomChecker.tsx` — its diff, applied unchanged after review |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->
It only had an uploaded zip; `git status` showed no change in `week-10/app` afterwards.

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->
Both diffs are in lab-report.md 6.3 and 8.1 as `git diff` showed them before I committed. Rejected
parts are listed in 6.2, 8.1 and 8.2.

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** no
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Saltanat Sultanakhmet
Date: 2026-11-25
