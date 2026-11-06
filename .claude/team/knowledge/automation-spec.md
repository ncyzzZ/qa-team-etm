# Automation fit and automation spec

Use in Step 7. Every case gets a decision: **Automate** or **Manual only**,
with a one-line reason.

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
