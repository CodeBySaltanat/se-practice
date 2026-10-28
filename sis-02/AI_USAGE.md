# AI Usage Disclosure — SIS #02

Required by the course academic policy (Generative AI use level **D** — AI-integrated, and for this
assignment AI use is **required** in the working process). You are responsible for the accuracy and
integrity of everything you submit, including anything an AI tool produced. The complete exchanges
live in `report.md`, section 11 — this file is the summary, not a second copy.

| Tool | Exact model / plan | Used for | Which sections and files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai) | Claude Opus 5.5 | Prompt A: draft of 3 user stories and 6 criteria | report.md §11 B1; reviewed result in §1, §2 |
| Claude (claude.ai) | Claude Opus 5.5 | Prompt B: first sequence and class diagrams | `models/original/sequence.puml`, `models/original/classes.puml`, §11 B2, §12 |
| Claude (claude.ai), new chat | Claude Opus 5.5 | Prompt C: critique of both models | §11 B3; judged in §7 |
| Claude (claude.ai), same chat as Prompt C | Claude Opus 5.5 | Prompt D: revision with my accepted decisions | §11 B4; `models/sequence.puml`, `models/classes.puml` (I changed guard 3 myself) |
| Claude (claude.ai, separate helper chat) | Claude Opus 5.5 | Building the prompt texts with the material pasted in;  rendering the PlantUML files to PNG; drafting §1, §2 after review; preparing this file and `submission.yml`; |

**Three parts of this assignment are yours alone. All three were written without AI assistance:** yes
Section 10 (scope and initial assumptions) is mine: I wrote it before Prompt A and committed it in
50ae3ec; the helper chat only changed the format (numbered list, "catalog" spelling). 

**The files in `models/original/` are the assistant's Prompt B output, unedited:** yes

**Every source in section 13 is one I opened and read myself:** yes

**Everything I submitted, I can explain and defend without consulting the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
The OCL syntax in the class-diagram notes (`allInstances()->isUnique(...)`): I understand the rule it
states in plain words, but not every detail of the OCL notation.

Signed: Saltanat Sultanakhmet
Date: 2026-10-18
