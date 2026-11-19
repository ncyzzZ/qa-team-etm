# ETM-8521 Questions for BA

**Story:** [Improvement] Shutdown Logic - Faster Copy & Paste in Gantt Table
**Status:** In Development. No comments. No Tests linked. Test cases are not drafted yet.
⭐ = affects an Expected Result directly, please answer first.

## Open questions

1. ⭐ What is the target for "faster"? Is there a number (for example, pasting N rows x M columns completes within X seconds), or is it only "noticeably faster than before"? Without a number, a performance test case has no measurable Expected Result.
2. ⭐ What size counts as "large" (rows x columns), and which plan or data set should QA use to test it?
3. While a large paste is being processed, does the screen show a loading or progress indicator, or does it stay as it is today (AC says "No UI change")?
4. Which environment and build contain the change, and does it have a plan with large data?
5. Is the result of a large paste expected to be identical, cell by cell, to what the old behavior produced for the same clipboard (AC 2)?

## Please confirm (written by the QA team lead from the Story, not yet by you)

- All paste rules of ETM-2615 stay unchanged and are the reference for "no regression": anchor at the focused cell, replace the target range, clip at the grid boundary, a single copied value fills a selected block, duplicate entry in one cell rejects the cell, Manpower Resource default `[1]` and limits (max 5, 1-99, no duplicate type), invalid or read-only cells rejected while valid cells proceed, long text truncated.
- Pasted data stays in the Draft State until the page-level Save, and Save stays disabled when a circular dependency exists after the paste.
