# Automation fit and automation spec

Use in Step 7. Every case gets a decision: **Automate** or **Manual only**,
with a one-line reason.

## How much (TEAM.md "How much E2E")

Team standard: automate almost everything; manual only for `ui:` (a person judges by eye), `job:` (a scheduled job run), `email:` (an email is sent) or `user:` (the user's ruling). Target: every non-manual AC has a `strong` test. Tiers per AC: `regression` = **High** (`@high` at the end of the test title, run by `npm run test:fe:high`, the FE pipeline set): core flow create / save / edit / delete, a calculation or rule the user acts on, role access (roles in the project rules), data kept after save / import / paste / undo; about 1-3 per Story. `card`: every other AC, run in the full run; many values = one data-table test. Prefer Yes over Partial: a step a person checks on a picture becomes an assertion whenever the screen gives text, a number, a state or a colour.

## When to automate

Mark **Automate** when most of these are true:

- It will run again and again (every release, every sprint).
- The result is always the same for the same input.
- The data can be prepared by the test itself, or is fixed and safe.
- A computer can check the result (text, number, status, count).
- It is a High or Medium priority case.
- It is a matrix or a long list of similar checks (loop over a data table).

## When to keep Manual only

Mark **Manual only** only for one of these (team standard, 26 Nov):

- `ui:` a person must judge it by eye (looks right, easy to understand, feels slow).
- `job:` it needs a scheduled or background job run.
- `email:` it checks an email that is sent.
- `user:` the user ruled it manual (write the date).

Data that is hard to prepare, a rule that may still change, or two users at once are not reasons for manual:
the card makes its own data, and two users run as two browser contexts.

Write the reason in simple words, for example: "Automate - runs every release,
result is always the same" or "Manual only - ui: a person judges if the
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

- **Yes:** web UI actions and checks (text, format, enabled/disabled, CSS colour), a chart or grid via its library API (e.g. a Bryntum store), DB via `queryDb`, two users via a second context, roles via the role fixtures (names in the project's script notes, active project rules "Knowledge").
- **Partial:** scriptable, but some steps need a person's eyes: the script captures evidence and the user checks by looking.
- **No (manual):** native browser behaviour (Back, leave-page prompt), controls that kept timing out (e.g. the Filter Panel date range picker), anything outside the web app under test (email, other apps), data that cannot be set up safely in QA, roles with no login in `.env`.
