# Automation fit and automation spec

Use in Step 7. Every case gets a decision: **Automate** or **Manual only**,
with a one-line reason.

## How much (TEAM.md "How much E2E")

Three tiers per AC: `regression` (core flow, every build, few and exact), `card` (each AC of the Story asserted by at least one test; many values = one data-table test), `manual` (eye judgement, runs once, outside systems, the user's ruling). Target: at least 80% of the non-manual AC have a `strong` test. Field validation detail belongs to the developers' unit / API tests, not UI E2E. Prefer Yes over Partial: a step a person checks on a picture is turned into an assertion whenever the screen gives text, a number, a state or a colour.

## When to automate

Mark **Automate** when most of these are true:

- It will run again and again (every release, every sprint).
- The result is always the same for the same input.
- The data can be prepared by the test itself, or is fixed and safe.
- A computer can check the result (text, number, status, count).
- It is a High or Medium priority case.
- It is a matrix or a long list of similar checks (loop over a data table).

## When to keep Manual only

Mark **Manual only** when any of these is true:

- A person must judge it (looks right, easy to understand, feels slow).
- It needs real data that cannot be prepared or reset safely.
- It runs once or very rarely.
- The screen or rule is still changing.
- It depends on outside systems the test cannot control.
- Two real people or devices must act at the same time and the setup is too
  costly to build.

Write the reason in simple words, for example: "Automate - runs every release,
result is always the same" or "Manual only - needs a person to judge if the
message is easy to understand".

## Automation spec for each Automate case

Add these lines under the case:

- **Starting data:** what must exist before the test (and how it is made).
- **Steps (short):** the same steps as the manual version.
- **What to check:** the exact text, number, count or status to compare.
- **Test data set:** name of the data table if the test loops (see below).
- **Clean up:** what must be removed or reset after the test.
- **Independent:** yes. The test must not depend on another test.

## Matrix and many-value cases

Do not write one case per cell. Write:

1. One case that explains the rule.
2. A separate **expected table** (inputs and expected result for every row).
3. A note: "The test loops over every row of the table."

Example table columns: Case name | Input A | Input B | Expected result.

Keep the table as data, so adding a row does not need new test code.

Use data tables for: strange input (emoji, other languages, long text, special
characters), filter + sort + search combinations, role and permission checks,
condition matrices.

## Notes for the Automation Engineer

- Prefer stable locators (test ids, roles, labels) over position or styling.
- Wait for something to happen (element, response), not for a fixed time.
- Each test creates its own data and cleans up after itself.
- Two users at the same time: use two separate browser contexts in one test.
- Compare what the screen shows with the expected value, and for data checks
  also compare with the database or API.
- When a test fails twice for the same reason, report the reason with
  evidence (screenshot, step, expected, actual) so the team can decide if it is
  a test problem or a real bug.
- Never hard code values that change over time. Read the current value first,
  then compare against it.


## Sorting existing Xray Tests for Playwright (automator)

Read each Test's steps and sort into Yes / Partial / No. Show one table: Test key | Playwright? | Why | Steps left for manual, plus a Security section (checks from `playwright-script-rules.md` that fit the Story, one row each: what, role/endpoint, Yes / needs info). Wait for the user's OK.

- **Yes:** STMS web UI actions and checks (text, format, enabled/disabled, CSS colour), Gantt via Bryntum API, DB via `queryDb`, two users via a second context, roles via fixtures (`turnaroundManagerPages`, `jobOwnerPages`).
- **Partial:** scriptable, but some steps need a person's eyes: the script captures evidence and the user checks by looking.
- **No (manual):** native browser behaviour (Back, leave-page prompt), controls that kept timing out (e.g. the Filter Panel date range picker), anything outside the STMS web app (email, other apps), data that cannot be set up safely in QA, roles with no login in `.env`.
