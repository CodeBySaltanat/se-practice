# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level D — AI-integrated).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai) | Claude Sonnet 5.5 | the plan (Task 1) | plan pasted into `lab-report.md` §2 |
| Claude (claude.ai) | Claude Sonnet 5.5 | the first version, v1 (Task 2) | `code/original/booking_v1.py`, `code/booking.py` (identical copy) |
| Claude (claude.ai) | Claude Sonnet 5.5, in a new chat | the critique (Task 5). I lost the first chat, so I opened a new one, sent the task block from README §3 first and then the critique prompt unchanged | critique pasted into `lab-report.md` §6 |
| Claude (claude.ai, separate helper chat) | Claude Opus 5.5 | guiding me through the lab steps and git commands; suggesting test cases and helping write `code/test_booking.py`; filling the report tables §4–§8 from my real terminal output; drafting the wording of §9.2, §9.3 and a first draft of §10, which I then edited myself; preparing this file and `submission.yml` | `code/test_booking.py`, `lab-report.md` §4–§10, `AI_USAGE.md`, `submission.yml` |

**The assistant wrote, or helped write, my tests in `code/`:** yes
The tests in code/test_booking.py were checked against AC1–AC5 and the overlap table in README §3, not against what v1 returns. Each test row in lab-report.md §4 names the AC it comes from, and the checker lists no test as contradicting the contract.

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:**
Nothing in the code. I verified the expected values in the tests against the contract. I also checked the facts in the report against my own runs (for example, the 600.5 / “600” results in §9.2). I wrote §10 myself.

Small honest notes: the message of commit `f640ea7` says "25 tests", but at that moment the suite
had 24; the 25th test was added in `5f10934`. Commit `f640ea7` also included `__pycache__` by
mistake, removed in `352a540`.

Signed: Saltanat Sultanakhmet
Date: 2026-10-11
