# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Saltanat Sultanakhmet
**Student ID:** 24B032036
**GitHub:** CodeBySaltanat

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Claude (claude.ai web) |
| Exact model (or "not displayed") | Claude Opus 5.5 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.15.2 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether the room is free for the requested time slot; all times are given in minutes since midnight, from 0 to 1440 (10:00 = 600), and this tool does not save or create a booking, it only checks.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": { "type": "integer", "minimum": 0, "maximum": 1440, "description": "Requested start, whole minutes since midnight (10:00 = 600)." },
      "end": { "type": "integer", "minimum": 0, "maximum": 1440, "description": "Requested end, whole minutes since midnight (24:00 = 1440)." },
      "now": { "type": "integer", "minimum": 0, "maximum": 1440, "description": "The current time, whole minutes since midnight." },
      "blocked": { "type": "boolean", "description": "true if the room is blocked, otherwise false." },
      "bookings": {
        "type": "array",
        "description": "Existing bookings of the room; an empty list if there are none.",
        "items": {
          "type": "object",
          "properties": {
            "start": { "type": "integer", "minimum": 0, "maximum": 1440 },
            "end": { "type": "integer", "minimum": 0, "maximum": 1440 }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| (tool) | `"description"` says minutes since midnight, 0 to 1440, and "does not save or create a booking" | A model would guess the unit (it could send `"10:00"` or 10) and could think calling the tool books the room. |
| inputSchema | `"type": "object"` | The arguments could be a list or a string, and no field rule would apply. |
| inputSchema | `"required"`: all five fields | A call without `now` (S04) would reach `canBook`, which cannot decide "in the past" without it. |
| inputSchema | `"additionalProperties": false` | Invented fields such as `"room": "204"` (S05) are accepted silently, and the caller thinks the room number was checked. |
| start, end, now | `"type": "integer"` | `"11:00"` (S03) or `600.5` (S10) would reach the function, which compares numbers in whole minutes. |
| start, end, now | `"minimum": 0` | A time before the day starts, `-30` (S06), would be accepted. |
| start, end, now | `"maximum": 1440` | A time after 24:00, `1500` (S07), would be accepted; 1440 itself stays allowed (S11). |
| start, end, now | `"description"` with the unit and an example (10:00 = 600) | The model has to guess how to convert the times in the request. |
| blocked | `"type": "boolean"` | `"false"` as a string (S09) is a non-empty string, so code that tests it as true/false would treat it as blocked. |
| bookings | `"type": "array"` | One booking object instead of a list, or `null`, would break the loop over bookings. |
| bookings | `"items"`: `"type": "object"` | A booking as a pair `[660, 720]` (S12) would be accepted, and `b.start` would be undefined. |
| bookings | `items.required`: `start`, `end` and `items.additionalProperties: false` | A booking with no end `{start: 660}` (S08) would be accepted and compared with `undefined`. |
| bookings | `items.properties.start/end`: integer, 0 to 1440 | A booking with `"11:00"` or `1500` would be accepted. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

The "first run" is the first run of my own definition (commit ef11723: only the types and `required`).
Before that I ran the checker once on the empty starter file, where S03-S10 and S12 failed because
there was no schema at all yet; that run is not counted as the first run of my definition.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | nothing - it already passed |
| S02 | PASS | PASS | nothing - it already passed |
| S03 | PASS | PASS | nothing - it already passed |
| S04 | PASS | PASS | nothing - it already passed |
| S05 | FAIL | PASS | added `"additionalProperties": false` to `inputSchema`, so the extra field `room` is refused |
| S06 | FAIL | PASS | added `"minimum": 0` to `start`, `end` and `now` |
| S07 | FAIL | PASS | added `"maximum": 1440` to `start`, `end` and `now` |
| S08 | FAIL | PASS | `bookings.items` now has `start` and `end` properties, both in `required`, and `"additionalProperties": false` |
| S09 | PASS | PASS | nothing - it already passed |
| S10 | PASS | PASS | nothing - it already passed |
| S11 | PASS | PASS | nothing - it already passed |
| S12 | PASS | PASS | nothing - it already passed |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

Match. F3 passes: 9:00 = 540, 10:00 = 600, 11:00 = 660, the booking 11:00-12:00 = 660-720,
`blocked` false. The model kept the touching booking as given and did not decide availability
itself; `canBook` would answer Available, because 600-660 only touches 660-720 (AC4).

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Match. F6 passes: 13:30 = 810, 14:00 = 840, 16:30 = 990 (not 960), `blocked` true, `bookings` [].
The model made the call although the room is blocked and the request is 150 minutes long, more than
120. That is right: the schema only checks the shape, and refusing is the job of `canBook` (AC2 and
AC3), which would answer Unavailable.

### R3

```text
What exact start and end time tomorrow afternoon do you want, and is the room blocked or already booked at any times that day?
```

Missing: the date context and `now` (it is "tomorrow", so the current time is not given), an exact
`start` and `end` ("afternoon", "a couple of hours"), whether the room is blocked, and the existing
bookings. The model asked one question instead of calling, as the prompt told it, so it invented no
values. Its question covers start, end, blocked and bookings, but not `now`. Also, `check_room` has
no date field at all, so even a full answer could not express "tomorrow".

## 5. What the schema cannot check

- **AC1** (part of it): the schema can enforce `0 <= start <= 1440` and `0 <= end <= 1440` and whole
  minutes, but not `start < end` and not "start after now". Both compare two fields with each other,
  and none of the allowed keywords (`minimum`, `maximum`, ...) can refer to another field.
  `"start": 600, "end": 600` is a valid call.
- **AC2**: "at most 120 minutes" is `end - start <= 120`, again a relation between two fields.
  R2 (840-990, 150 minutes) passed the schema.
- **AC3**: the schema checks that `blocked` is a boolean, but cannot say that `true` means
  Unavailable; that is a decision, not a shape.
- **AC4**: overlap compares the request with every booking in the list; touching is allowed and
  overlapping is not. The schema checks each booking's shape only.
- **AC5**: "does not change or save anything" is about what the function does when it runs. A schema
  only describes the input; the description can promise it, but only the code can keep it.
- **AC6**: the page's feedback is UI, outside the tool.

So only `canBook` can enforce AC1's `start < end` and "after now", AC2, AC3's decision, AC4 and AC5.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | It only reads the arguments and answers Available or Unavailable; it saves nothing (AC5), so the worst case is a wrong answer the user can see. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading source code in my own repository changes nothing; the file has no secrets. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | It changes a business rule (AC2) because one user asked, not because the requirement changed; the agent may not rewrite the rule its own tool is checked against. |
| A4 | run `npm test` in `week-08/app` | ask | Running tests is useful, but `npm` runs scripts from `package.json` and may install packages from the internet, so I want to see the command first. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | It throws away uncommitted work, possibly mine as well as the agent's, and it cannot be undone. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit on my branch is easy to revert, but I want to review the diff and message before my name is on it. |
| A7 | `git push` to `main` | block | `main` is the graded, shared branch; the course says work goes through an open PR, and a push cannot be taken back quietly. |
| A8 | send the contents of `.env` to an MCP server it found online | block | It leaks secrets (keys, passwords) to an unknown third party; no "configuration" reason justifies that. |

## 7. Checkpoint

Before letting such an agent edit anything I would make the commit
`b1353cf Week 09: check_room schema refuses all nine bad calls` (my final definition, from
`git log --oneline` on `week-09`). The command that returns me to it is:

```text
git reset --hard b1353cf
```

It throws away every uncommitted change in the working tree and the index (tracked files go back to
`b1353cf`), and it moves `week-09` back, so any commits the agent made after `b1353cf` are no longer
on the branch (only `git reflog` can still find them for a while). Untracked new files are not deleted
by it; that would need `git clean -fd`.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None. All 30 checks pass in the run in section 8.

## 10. Conclusion (80–150 words)

The line between the three layers was clearer than I expected. My first schema had only types and
failed S05-S08: it let through `"room": "204"`, `-30`, `1500` and a booking with no end, so the
schema is only as strict as the keywords I write. The model then got R1 and R2 right, even 16:30 =
990, and it called R2 although that room is blocked and the slot is 150 minutes, because the
schema cannot say no to that, only `canBook` can (AC2, AC3). R3 showed the opposite case: the
request had no times and no `now`, and the model asked instead of inventing them. For the agent,
the risky actions were not the tool itself but A3, A7 and A8.