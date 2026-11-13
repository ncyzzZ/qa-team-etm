# Run, report and Xray notes (from the ETM-7902 run, Nov 2026)

Only what `TEAM.md` and the skills do not already say. Read by automator, reporter and logger.

## Machine setup (once)

- VPN on (QA site). `.env` in the Playwright repo holds the page URLs and the login of each role (TA Manager, Job Owner). **Passwords in `.env` must be in quotes.**
- `../../.secrets/etm-api.env` holds `JIRA_EMAIL`, `JIRA_API_TOKEN`, `XRAY_CLIENT_ID`, `XRAY_CLIENT_SECRET`. Never put them in a committed file, a report, a board text or the chat.
- Same plan data for several tests: `--workers 1`.
- Never keep results in `test-results/`: Playwright wipes it at the start of every run.

## Annotations a spec can put on a test

| annotation | meaning |
|---|---|
| `app-finding` | the system does not match the AC, probably a defect |
| `tc-vs-ac` | the TC and the AC/code disagree: decide whether to fix the TC or the system |
| `ba-confirm` | ask the BA |
| `partial` / `check-by-eye` | the script cannot check everything: look at the picture |
| `env` | environment problem, e.g. account has no permission (Access Denied) |

## Changing Xray test steps (only after the user's go-ahead)

- Put the change in a file with only the fields that change, run `--dry-run` first, then the real run.
- Add steps (`insertAfter`) one step per run. Two in one file once lost a step.
- The existing Test Run keeps the old step count: reset the run before uploading results.
- After a TC changes in Xray, pull the latest TC and fix the script to match, then `npx tsc --noEmit -p .`

## Uploading results to Xray (only after the user's go-ahead)

Dry-run first, upload only the TCs that passed, then open the Test Execution and check the status.

| what you see | meaning | do |
|---|---|---|
| `graphql 429 Too many requests` | Xray rate limit | wait until `nextValidRequestDate` in the message, upload only the TCs still missing |
| a TC is `EXECUTING` | upload incomplete (429 midway) or someone edited it in Xray | upload that TC again |
| `verified: run PASSED; every step status + evidence count matches` | all good | - |

## Report: spec notes and review verdicts (generator v4.5)

- Annotations from the table above show on each test as "หมายเหตุจากสคริปต์".
- Per-step verdicts: write `Evidence/_reports/review-<KEY>.json` (`{"ETM-8339": {"steps": {"10": {"verdict": "script", "note": "..."}}}}`). `tools/run-card.mjs` passes it to the generator when the file exists; by hand use `--review <file>`.
- `verdict`: `accepted` (not counted as a fail, shown yellow, test badge "PASS (ยอมรับ)") / `defect` / `tc-update` / `script` / `ba-pending`.
- Only the user decides a verdict (TEAM.md Phase 7). Rebuild with `node tools/run-card.mjs <KEY> --build-only <folder>`.
- The run-card line "N pass / M fail" counts the raw Playwright result, so an accepted test still counts as a fail there; the HTML report counts it as pass.
