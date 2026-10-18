# SIS #02 — AI-Assisted UML Modeling: University Course Registration

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the checker and the word counter. Delete them or leave them.
-->

## 1. Scope and assumptions

<!-- Final version after reviewing Prompt A's output. Section 10 keeps the first version. -->

**Scope:** A signed-in student browses the catalog of course offerings for one semester, chooses one offering and requests registration; the system rechecks places, creates one Enrollment or rejects the request with a reason. Payments, prerequisites, timetable clashes, waiting lists and cancellation are out of scope.

**Assumptions:**

1. The student is signed in and the selected offering exists in the catalog.
2. Capacity is a positive whole number, and available places = capacity − current number of enrollments in that offering.
3. The catalog view only shows places; it reserves nothing. Places are checked again when the student registers.
4. The duplicate check, the capacity check and the creation of the Enrollment run as one atomic operation, so two requests can never take the same last place.
5. If a request is both a duplicate and for a full offering, the duplicate check runs first, so the student is told "already enrolled".
6. Offerings with 0 available places are still listed in the catalog, with 0 places shown.
7. R3 is only about the same offering; enrolling in a different offering of the same course is not restricted by these rules.
8. All students and courses are fictional (for example, students Mira Tal and Jonas Weller, course INF-210).

## 2. User stories and acceptance criteria

<!-- Approved requirements: Prompt A's draft after my review. -->

### US-01 — Browse offerings

**US-01:** As a signed-in student, I want to see the course offerings for one semester with their available places, so that I can choose an offering to register for.

- **AC-01** (R1): Given Section A of INF-210 in Autumn 2026 has capacity 30 and 12 enrollments, When Mira views the catalog for Autumn 2026, Then the entry shows the course code "INF-210", the title "Foundations of Data Modelling", the offering "Section A, Autumn 2026" and 18 available places.
- **AC-02** (R1, R2, R5): Given the catalog showed Section B with 1 available place to Mira, and Jonas then registered for that last place, When Mira requests registration for Section B, Then the system rechecks availability at registration time, rejects Mira's request with "course full", creates no Enrollment and the count stays at 2.

### US-02 — Register for an offering

**US-02:** As a signed-in student, I want to register for an offering that has a free place, so that I am enrolled and receive a confirmation.

- **AC-03** (R2, R4): Given Section A has capacity 30 and 12 enrollments and Mira is not enrolled in it, When Mira requests registration for Section A, Then exactly one Enrollment linking Mira and Section A is created, the count becomes 13, available places become 17 and Mira receives a confirmation.
- **AC-04** (R2, R4, R5): Given Section B has capacity 2 and 1 enrollment and neither Mira nor Jonas is enrolled in it, When Mira and Jonas request registration for Section B at the same time, Then exactly one of them gets an Enrollment and a confirmation, the other is rejected with "course full", and Section B ends with 2 enrollments, never more than its capacity.

### US-03 — Receive a clear rejection

**US-03:** As a signed-in student, I want to be told why my registration was rejected, so that I understand that I was not enrolled.

- **AC-05** (R2, R5): Given Section B has capacity 2 and 2 enrollments and Mira is not enrolled in it, When Mira requests registration for Section B, Then the request is rejected with the explanation "course full", no Enrollment is created and the count stays at 2.
- **AC-06** (R3, R5): Given Mira already has an Enrollment in Section A and Section A has 13 enrollments, When Mira requests registration for Section A again, Then the request is rejected with the explanation "already enrolled", no new Enrollment is created and the count stays at 13.

## 3. Sequence diagram

<!-- The FINAL diagram, rendered. Change .png to .svg if that is what you exported. -->

![Final sequence diagram](models/img/sequence.png)

**Participants:** (write here — each lifeline and what it stands for)

**Atomic operation:** (write here — which messages form the one atomic step: the final duplicate check, the capacity check and the creation of the Enrollment, and why a catalog view reserves nothing)

**Where the Enrollment is created:** (write here — which message, which lifeline, and which class in section 4 it produces)

**Technical lifelines:** (write here — every lifeline that is NOT a class in the class diagram, by name, and why the difference in abstraction is fine. "None" if there are none.)

## 4. Class diagram

<!-- The FINAL diagram, rendered. -->

![Final class diagram](models/img/classes.png)

<!-- One row per association in classes.puml, read in both directions. -->

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

**How an Enrollment links a student to an offering:** (write here)

**Capacity constraint:** (write here — and why multiplicity alone cannot express it)

**Uniqueness constraint:** (write here — and why multiplicity alone cannot express it)

## 5. Traceability

<!-- Every rule, including the catalog fields and availability (R1). Column 1: the rule and
     the criteria that cover it, e.g. "R2 + AC-03, AC-04". Column 2: the message, guard,
     class or constraint that shows the rule in YOUR diagrams. Column 3: the T-ID that
     exercises it, or the extra check you did instead (R1 has no T case). -->

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + (write here) | (write here) | (write here) |
| R2 + (write here) | (write here) | (write here) |
| R3 + (write here) | (write here) | (write here) |
| R4 + (write here) | (write here) | (write here) |
| R5 + (write here) | (write here) | (write here) |

## 6. Walkthroughs

<!-- Walk each case through YOUR final sequence diagram, message by message. Column 2: the
     actual steps and the state change (count before → after). Column 3 starts with Pass or
     Fail, then the location: the message, guard or note where you saw it. A Fail you
     report honestly is a finding, not a penalty. -->

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | (write here) | (write here) |
| T2. Last place | (write here) | (write here) |
| T3. Full | (write here) | (write here) |
| T4. Duplicate | (write here) | (write here) |

## 7. Review decisions

<!-- At least three substantive decisions about Prompt C's critique or your own inspection.
     Decision: accepted / rejected / modified — and what you did. Reason: why, in a full
     sentence. Rule: R1–R5. Do not invent an error to fill the table; a justified rejection
     of advice counts. -->

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

## 8. Modeling explanation

<!-- 200–300 words. Your main design choices; how the class diagram and the sequence diagram
     complement each other; why an activity diagram could also help explain the workflow. -->

(write here)

## 9. Reflection

<!-- 150–200 words. Written by you, not by the assistant: where AI helped, one decision you
     made yourself, one remaining limitation. Specific beats flattering. -->

(write here)

## 10. Appendix A — Before AI

**Scope:** The system lets a student browse the catalog of course offerings for one semester, pick one offering, and register for it while places are limited; payments, prerequisites, timetable clashes, waiting lists and cancellation are out of scope.

**Initial assumptions:**

1. The student is already logged in. The offering they choose already exists in the catalog.
2. Each offering has a capacity. It is always a positive whole number.
3. Looking at the catalog does not hold a place. The system checks free places again at the moment of registration.
4. If two students try to take the last place at the same time, only one of them gets it.
5. All students and courses are made up for this example.

## 11. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the ~~~~ block that follows its label: AI responses contain ``` PlantUML blocks, and
     ~~~~ keeps them from breaking this file. Prompts B and C: the prompt text first, then
     the material it refers to ("below", "these two") pasted under it, in the same block.
     You may add B5, B6 … after B4 if you ran more. -->

### B1 — Requirements (Prompt A)

- **Tool:** Claude (claude.ai)
- **Model:** Claude Opus 5.5
- **Date:** 2026-10-18
- **Purpose:** draft 3 user stories and 6 acceptance criteria

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1–R5: A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places. A Course describes a subject. A CourseOffering is one scheduled section in one semester. Registration always targets a specific offering. Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number. Exclude payments, prerequisites, timetable clashes, waiting lists and cancellation. Use fictional students and courses. R1. Catalog: Show the course code, title, offering and available places for one semester. R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity. R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request. R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation. R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged. My initial assumptions are 1. The student is already logged in. The offering they choose already exists in the catalog. 2. Each offering has a capacity. It is always a positive whole number. 3. Looking at the catalog does not hold a place. The system checks free places again at the moment of registration. 4. If two students try to take the last place at the same time, only one of them gets it. 5. All students and courses are made up for this example.
Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.
Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
# Course Registration: User Stories and Acceptance Criteria

**Fictional example data:**
- Students: Mira Tal, Jonas Weller
- Course: INF-210 "Foundations of Data Modelling"
- Offerings:
  - INF-210 Section A, Autumn 2026, capacity 30
  - INF-210 Section B, Autumn 2026, capacity 2

---

## US-01: Browse the course catalog

**As a** signed-in student, **I want to** see the course offerings for a semester with their available places, **so that** I can choose an offering to register for.

**AC-01: Catalog shows required details** (R1)
- **Given** Section A of INF-210 in Autumn 2026 has capacity 30 and 12 enrollments
- **When** Mira views the catalog for Autumn 2026
- **Then** the entry shows course code "INF-210", title "Foundations of Data Modelling", offering "Section A, Autumn 2026" and 18 available places

**AC-02: Viewing does not hold a place** (R1, R2)
- **Given** Section B has 1 available place and Mira is viewing it in the catalog
- **When** Jonas registers for Section B before Mira submits her request
- **And** Mira then requests registration for Section B
- **Then** the system rechecks availability at registration time
- **And** Mira's request is rejected with "course full"

---

## US-02: Register for an offering with free places

**As a** signed-in student, **I want to** register for an offering that has a free place, **so that** I am enrolled and receive confirmation.

**AC-03: Successful registration** (R2, R4)
- **Given** Section A has capacity 30, 12 enrollments, and Mira is not enrolled in it
- **When** Mira requests registration for Section A
- **Then** exactly one Enrollment linking Mira and Section A is created
- **And** available places for Section A become 17
- **And** Mira receives a confirmation

**AC-04: Simultaneous requests for the last place** (R2, R4, R5)
- **Given** Section B has capacity 2 and 1 enrollment, and neither Mira nor Jonas is enrolled in it
- **When** Mira and Jonas request registration for Section B at the same time
- **Then** exactly one of them gets an Enrollment and a confirmation
- **And** the other is rejected with "course full" and no Enrollment is created for them
- **And** Section B has 2 enrollments, never more than its capacity

---

## US-03: Receive a clear rejection

**As a** signed-in student, **I want to** be told why my registration was rejected, **so that** I understand that I was not enrolled.

**AC-05: Offering is full** (R2, R5)
- **Given** Section B has capacity 2 and 2 enrollments, and Mira is not enrolled in it
- **When** Mira requests registration for Section B
- **Then** the request is rejected with the explanation "course full"
- **And** no Enrollment is created
- **And** Section B's enrollment count stays at 2

**AC-06: Student is already enrolled** (R3, R5)
- **Given** Mira already has an Enrollment in Section A, and Section A has 13 enrollments
- **When** Mira requests registration for Section A again
- **Then** the request is rejected with the explanation "already enrolled"
- **And** no new Enrollment is created
- **And** Section A's enrollment count stays at 13

---

## Rule coverage

| Rule | Criteria |
|---|---|
| R1 Catalog | AC-01, AC-02 |
| R2 Capacity | AC-02, AC-03, AC-04, AC-05 |
| R3 Duplicates | AC-06 |
| R4 Success | AC-03, AC-04 |
| R5 Rejection | AC-04, AC-05, AC-06 |

---

## Uncertainties (to confirm with stakeholders)

1. **Which rejection message wins?** If a student is already enrolled and the offering is also full, R5 does not say whether to show "course full" or "already enrolled".
2. **Duplicate requests at the same time.** R3 says to reject a repeat request. It does not say how two near-simultaneous requests from the same student (for example, a double submit) should be handled. AC-06 only covers a request made after the first one succeeded.
3. **Meaning of "available places."** The criteria assume available places = capacity − current enrollments. The rules do not define this.
4. **Contents of the confirmation.** R4 requires a confirmation but does not say what it must contain.
5. **Choosing the semester.** R1 says the catalog shows one semester. It does not say how that semester is chosen (by the student or by the system).
6. **Full offerings in the catalog.** It is not stated whether offerings with 0 available places are still listed, or how they are marked.
7. **Source of assumption 4.** The "only one gets the last place" behavior is your assumption. AC-04 treats it as following from R2 ("never exceed capacity"), but the rules do not state it directly.
8. **Same course, different offering.** R3 covers only the same offering. Whether a student may enroll in two offerings of the same Course is not addressed. I have deliberately not specified it.

I can put this into a shareable document if you'd like to circulate it for review.
~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** apply my accepted review decisions

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix C — Original diagrams

<!-- The AI's first output from Prompt B, rendered unedited from models/original/. -->

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the source checks must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5. -->

- (write here)

### Source checks

<!-- At least two modeling decisions you verified. Source and locator: title + slide, page,
     section, chapter or figure — or title + URL + access date (YYYY-MM-DD). Slide numbers
     refer to the decks posted in our Teams. -->

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
