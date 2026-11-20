# Browser agent for manual test cases ("manual runner") (design)

Date: 2026-11-20. Status: draft for the user's approval. Approach chosen by the user: **C** = live browser agent first (A), turn the cases that repeat into Playwright scripts later (B).

## Why

Every sprint leaves test cases that stay manual because a script is hard to write for them: a person must look at a picture (a line drawn at the right place, a PDF page), or the steps change data. Sprint 26 still has: ETM-8392 8677, 8688, 8797 (Ramp lines after data changes), 8690, 8692, 8693 (Export PDF), ETM-8405 8644, 8646, and ETM-8388 8729, 8730 (real Excel). For each, the lead already wrote `work/<KEY>/manual-steps-*.md`: a table of Do / Expected / Picture per step. A person still has to do every step, take a picture per step (Xray needs one per step) and fill Xray by hand.

Goal: an agent does those steps in a browser, takes the pictures in the same style as the automated evidence, and proposes a result per step; the person only checks the pictures and confirms.

## Goals

1. A new agent `manual-runner` that runs one manual Test (Xray key) from its `manual-steps` table in a browser on QA, logged in with the role the steps need.
2. One picture per step, red frame around what the step checks + caption box, like `utils/xrayEvidence.ts`.
3. PDF steps: download the PDF, read it, and make a picture of the PDF page (and a zoom of the part the step checks).
4. A proposed verdict per step: `pass`, `fail` or `needs-human`, each with a one-line reason tied to the Expected text.
5. Output a run folder that the existing tools understand: Playwright-JSON-shaped `results.json` + pictures, so `run-card.mjs --build-only` builds the evidence report and the existing Xray push works.
6. Nothing goes to Xray before the person confirmed each Test's result.

## Non-goals

- Desktop apps (Excel): ETM-8729 / 8730 stay manual. A steps file can say `needs: excel` and the agent skips it with that reason.
- Making test data: data that is missing goes through the card test data tool (`card-data.cjs`, other design) or the person.
- Phase B (turning a case into a script) is only prepared here (the agent records what it did); building it is later work.
- UAT / PROD: never.

## Anti-goals

- A test marked PASSED in Xray that no person confirmed, or a `needs-human` step pushed as passed.
- A step the agent could not do (element not found, page different) shown as pass. It is `fail` or `needs-human` with the reason.
- A QA data write (Save, Update Progress, Extension, delete) done without the person's yes for that Test.
- Pictures from another run mixed into the push.

## Approaches

- **A. Live browser agent** (chosen first): an LLM agent drives a browser step by step from the table. Flexible, fits "look at it" cases; costs tokens on every run.
- **B. Agent writes a Playwright script, run by `run-card`**: cheap to re-run, but these cases are manual because scripts are hard for them.
- **C. A now, B later for cases that repeat** (chosen by the user).

## Design

### 1. Browser and login

The agent uses the `playwright-test` MCP server already in `.mcp.json` (`tools/heal/pw-mcp.mjs`, headless, the Playwright repo's config), not the user's Chrome. **One seed spec per role**, the role fixed inside the file (the MCP server is long-running and shared with the healer, so an environment variable cannot switch roles between Tests): `ep-etm-fe-qa/tests/fe/manual/seed.turnaroundManager.spec.ts` and `seed.jobOwner.spec.ts`, each opening the app logged in with the saved `.auth/*.json` state on `BASE_URL`. The agent starts the page with the MCP setup tool on the seed of the Test's role, then drives it with the `browser_*` tools. *(Builder's call, after review.)* QA guard: the seed refuses a `BASE_URL` matching `/uat|prod/i`.

### 2. Input: the manual steps file

`work/<KEY>/manual-steps-*.md` as today, with a fixed shape the agent and a checker rely on:

- One section per Test: `## ETM-<n> - <title> (<N> steps)`.
- A step table `| # | Do | Expected | Picture |`, one row per Xray step, same count and order as the Xray steps in `.claude/team/work/<KEY>/tests.md`.
- Optional lines under the heading: `role: jobOwner` (default turnaroundManager), `writes data: yes` (some step saves to QA), `needs: excel` (agent skips), `start: <URL path or .env key>`.
- "Before you start" text stays free text; the agent checks it first and stops with `needs-human` when a precondition is not met (for example the day is not frozen).

`qa-check.mjs manual <KEY>` (new) checks the shape: heading, step count equal to Xray, every row has Do and Expected.

### 3. Doing a step and its picture

For each row: do the "Do" part with browser actions; then check the "Expected" part by reading the page (accessibility snapshot / text / element positions), never by guessing from memory. The picture: a small helper run through the MCP code tool draws the red frame around the checked element(s) and a caption box (step number, what was done, what should be seen), takes a full-page PNG, removes the overlay (same look as `xrayEvidence.ts`). File: `<run>/evidence/<TEST>/step-<n>.png`.

A step that needs a look at a drawn thing (a line position, a colour) gets the measured facts in its reason (for example "Ramp Down line at x=412, column 08 Jun spans 380-460, 18:00 = 3/4 → expected x≈440, off by 28 px") and is `needs-human` unless the measurement clearly answers the Expected text.

### 4. PDF steps

The download is saved into the run folder. A small Node script `ep-etm-fe-qa/scripts/manual/pdf-shot.mjs <file.pdf> <page> <out.png> [--clip x,y,w,h]` renders a PDF page to PNG with pdf.js in Playwright's Chromium (new devDependency `pdfjs-dist` in `ep-etm-fe-qa`; works on Windows and Mac, no system tools). The agent reads the PDF itself to find the page and judge the step, and attaches the page picture (plus the zoom when the step asks for one).

### 5. Output and verdicts

Run folder `ep-etm-fe-qa/output/runs/<date_time>_<KEY>_manual/` (own folder, like `run-card`):

- `results.json` in the Playwright JSON reporter shape: one test per Xray key (title `ETM-<n> - <title>`), one `test.step` per row with the picture attached, test status `passed` only when every step is a proposed `pass`, else `failed` (any `fail`) or `skipped` with annotation `needs-manual` (any `needs-human`). This is what `evidence-report-v4.mjs` and the Xray push already read.
- `verdict.json`: `{ key, test, role, steps: [{ n, verdict: 'pass'|'fail'|'needs-human', why, picture }], actions: [...] }`. `actions` is the list of browser actions done per step (for phase B).
- Then `node tools/run-card.mjs <KEY> --build-only <run folder>` builds the evidence report.

### 6. The person's check and the push

The lead shows, per Test Execution: the report link and one line per Test (`8692: 6/6 pass`, `8693: 5 pass, step 4 needs-human: line 12 px left of 18:00`).

- **"ยืนยันผลทั้งหมด" is offered only when no step is `needs-human`.** Each `needs-human` step is listed by itself (Test, step, reason, picture path) and the person answers it (`pass` / `fail`), several in one reply is fine ("8693 step 4 pass"). Nothing turns a `needs-human` step into `pass` in bulk. *(Builder's call, after review.)*
- Options: `ask --approve --options "ยืนยันผลทั้งหมด|แก้บางข้อ|ยังก่อน"` (the first only when allowed above). The person's step answers are written into `verdict.json` (`decidedBy: "user"`, the answer text) and `results.json` is rebuilt from `verdict.json`, then the report is rebuilt (`run-card --build-only`), so `run-results.json` and `qa-check strength` see the confirmed result.
- **Push: per step**, as done on 20 Nov for the automated Tests (Xray GraphQL on the Test Run: a status and the picture of every step, then the Test status). That scratchpad script becomes a repo tool `tools/xray-step-push.mjs` (dry run by default, `--apply`, pictures of that run folder only, reads back what Xray shows). Recorded with `state.mjs approve --kind xray-push`.
- **Status:** all steps `pass` → PASSED; any `fail` → FAILED; a Test with a step still undecided → not pushed (stays TO DO in Xray).

### 6a. Does a confirmed manual Test count as "AC proven"?

Yes, when every step was confirmed by the person: it is a real run with a picture per step. It is marked `source: "manual-agent"` in `run-results.json` / `quality.jsonl`, and the sprint report shows it apart ("proven by the browser agent, confirmed by a person"), so the numbers can be read with and without it. *(Builder's call, after review: change it if you want only scripted runs to count.)*

### 7. Data-writing steps and the card data rules

- `writes data: yes` in the steps file: the lead asks for that Test before the agent starts (`ask --approve`, recorded `--kind run-tests`, text says which step writes and what). Without the yes the agent stops before the first writing step and marks the rest `needs-human: data write not approved`.
- The manual runner follows the same card data rules as `run-card` (card test data design): it holds the card lock (`ep-etm-fe-qa/output/seed/ETM-<n>.lock`) for the whole Test, and when the card has a data file it needs the data gate to pass (reset before the run) before it starts; it uses `tools/data-gate.mjs` for that. A card without a data file runs as today. *(Builder's call, after review.)*

### 8. Where it sits in the team

- New agent file `.claude/agents/manual-runner.md` (tools: Read, Write, Bash for `pdf-shot.mjs` and `run-card --build-only`, the `playwright-test` MCP browser tools). Board updates at start and end like the other agents.
- TEAM.md Phase 6 (run): after the automated run, the lead offers the manual Tests that have a steps file and no `needs: excel`; one agent call per Test, one at a time (they share QA data and the browser).
- automation-engineer: when writing `manual-steps` for a Test, follow the shape in section 2.
- The sprint report counts these Tests apart ("manual, done by agent, confirmed by a person").

### 9. Phase B (later, not built now)

A Test that ran through the agent in two sprints with all steps `pass` is offered to the automation engineer, who uses `verdict.json` `actions` to write a real spec.

## Constraints

- QA only. Logins only from the saved `.auth` states; the agent never types a password.
- Never read screenshots to save tokens (CLAUDE.md rule 6) applies to the lead; the manual runner must look at its pictures only when a step needs a visual check, and say so in the reason.
- Thai replies to the user; files in English.

## Left to the builder

- Exact MCP tool names for starting the seed page (`generator_setup_page` vs `planner_setup_page`) and for running the overlay helper (`browser_run_code_unsafe` or `browser_evaluate` + `browser_take_screenshot`).
- The overlay helper code (copy the look of `xrayEvidence.ts`).
- `qa-check manual` details and its selftest fixtures; converting the existing steps files of 8392 / 8405 / 8388 to the fixed shape.
- First real use: ETM-8392 8692 and 8693 (data ready, export on a frozen day), read-only steps.
