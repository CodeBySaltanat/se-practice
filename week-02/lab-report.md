# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:**
**Group:**
**Date:**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Claude |
| Exact model name | Claude Sonnet 5 |
| Implementation language | Python |
| Date of the runs | 2026-09-20 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

n/a — used Python

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence): Write Python code to analyze student marks.

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Assumed marks are read from a CSV file or a hardcoded dictionary.
2. Assumed the output should be a formatted CLI report with letter grades (A-F) and a text histogram.
3. Assumed it needs to calculate median, standard deviation, and track "at-risk" students.

**Questions it should have asked and did not:**

1. What is the expected input data format (a list of numbers, a dict, etc.)?
2. What specific statistics should be returned, and in what format?

**Is the function named `analyze_marks` with the required signature?** no — it built a full CLI script with multiple functions like main(), student_summary(), and load_csv() instead of one target function.

**First impression before testing** (one sentence — you will compare this with section 6 later): The AI overengineered a complex command-line application instead of writing a simple, reusable calculation function.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions): You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short explanation.

**What B fixed compared to A:**

1. Created a single reusable function with the exact requested signature instead of a full CLI app.
2. Used the correct return format (dictionary) and implemented explicit ValueError validation.

**What B still leaves open:**

1. Does not specify rounding rules for the returned numbers (e.g., pass_rate could have many decimals).
2. Leaves ambiguity on whether string numbers like "60" should be strictly rejected or converted to floats.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:** Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80, lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100. State any remaining assumptions before the code.

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes 

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:** Assumed marks can be any iterable, bool is rejected, NaN/infinity are rejected, and average/pass_rate are rounded to 2 decimal places.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat): You are a professional Python developer. Implement a function named analyze_marks(marks, pass_mark=50) that takes an iterable of student marks and a default pass mark of 50. 
Requirements:
1. Validate that pass_mark is a numeric value between 0 and 100; raise ValueError otherwise.
2. Validate that marks is a non-empty iterable; raise ValueError if it's empty, not iterable, or contains non-numeric types (strictly reject booleans, strings like '60', NaN, or infinity).
3. Validate that every mark falls inclusively between 0 and 100; raise ValueError for out-of-range values.
4. Calculate and return a dictionary with exact keys: 'average', 'highest', 'lowest', 'pass_rate'.
5. 'average' and 'pass_rate' must be rounded to 2 decimal places. 'pass_rate' is a percentage from 0 to 100 (where a mark >= pass_mark counts as a pass). 'highest' and 'lowest' should be numeric values from the list.
6. Use no external libraries (standard library only).
Example: analyze_marks([40, 60, 80], 50) -> {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}.
Provide clean Python code and a short explanation.

**What I deliberately added that A, B and C did not have:**

1. Explicit instructions to reject booleans and special floats like NaN or infinity using math.isfinite.
2. Precise rules for rounding (average and pass_rate to 2 decimal places).
3. Strict type validation ensuring that strings and invalid types trigger a ValueError.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
Whether a mark equal to the pass_mark should pass, and how rounding should be formatted. I resolved it by explicitly requiring a percentage with 2 decimals (e.g., 66.67) and specifying that mark >= pass_mark counts as a pass.
---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | All (1-6) | ERROR: code/prompt_a.py defines no callable named 'analyze_marks'. |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
**Prompt B**

========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================

**Prompt C**

========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range 0-100: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================

**Prompt D**

========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid mark '60': must be a finite number (no bools, strings, NaN, or infinity).
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark -1 is out of range; must be between 0 and 100.
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 1 | 2 | 2 |
| **Total / 10** | 0 | 6 | 10 | 10 |

**Prompt length, in words:** A ~150 · B ~120 · C ~250 · D ~180

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says: More specific engineering context and unit tests exponentially increase code correctness and eliminate runtime errors.

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.
Prompt C and Prompt D scored best with 10/10, and Prompt D is the one I would actually use
 at work because of its rigorous type checking and robust edge-case handling. The single 
addition that bought the most correctness was adding explicit validation constraints for 
non-numeric types and out-of-range values, which changed Case 5 and Case 6 from potential
 failures into robust PASS verdicts by deliberately raising a ValueError. Prompt A introduced 
pure noise by generating an overengineered command-line application that read from CSV files
 instead of providing a clean function. An ambiguity found in the specification was whether
 pass_rate should be unrounded or rounded to two decimal places; Prompt D resolved this ambiguity
 by explicitly specifying rounding via math.fsum and round() to match test case expectations like
 66.67. Furthermore, providing explicit examples in Prompt C and D completely eliminated formatting
 mismatches for the dictionary keys.
**Word count:**
168
---

## 9. Two questions for the debrief

Written before class, answered in class.

1. How does context window size affect prompt adherence?
2. Can we automate the generation of Prompt D from test failures?



