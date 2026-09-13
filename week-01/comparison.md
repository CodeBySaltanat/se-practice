# Week 01 — Manual vs AI: Comparison

**Name:** Saltanat
**Group:** KBTU
**Date:** 2026-09-13

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Next.js / TypeScript |
| Time to first version that ran | 15 min | 3 min |
| Time to all 4 test cases passing | 20 min | 5 min |
| Number of attempts / prompts needed | 1 | 2 |
| Lines of code you actually wrote | 41 | 0 (generated) |
| Did it handle invalid marks (case B)? | yes | yes |
| Did it handle an empty list (case D)? | yes | yes |
| Did it use the ≥ 50 pass threshold? | yes | yes |
| Output format matches the spec? | yes | yes |
| Can you explain every line of it? | yes | no |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | match | match | avg 67.00 · high 92 · low 23 · pass 60.0% | yes |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | match | match | avg 71.60 · high 100 · low 47 · pass 80.0% | yes |
| C | `10, 20, 30` | match | match | avg 20.00 · high 30 · low 10 · pass 0.0% | yes |
| D | `abc, , xyz` | match | match | clear message, no crash | yes |

## 3. What the AI added that I never asked for
- Full web UI with Tailwind CSS
- Additional statistics cards and visual charts

## 4. What the AI got wrong or silently skipped
- Initially asked clarifying questions instead of raw execution, which required requirements elicitation steps.

## 5. The defect I asked Rocket to fix
**Prompt I used:** Make sure invalid marks like -5 and 101 are strictly filtered out.
**Result:** fixed
**What this tells me:** AI tools need explicit constraints to match strict edge cases.

## 6. Reflection
1. AI genuinely speeded up the UI layout and boilerplate code generation.
2. AI cost time during requirements clarification and verifying edge cases.
3. I would put my name on the manual artifact because I wrote and tested every line.
4. A human engineer must remain responsible for validation, correctness, and security.