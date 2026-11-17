---
name: "etm-evidence-report"
description: "Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). Use after any Playwright run of the ETM (STMS) tests, pass or fail, to build the HTML evidence report (step pictures, card links, failure reasons, spec notes, review verdicts, TC totals) without changing the repo."
---

# ETM Playwright evidence report (generator v5.3)

The report code lives in this repo's `tools/` folder: `evidence-report-v4.mjs` (the generator) and `run-card.mjs` (the run wrapper). Nothing is added to or committed in the Playwright repo `PW_REPO`. Runs go through `tools/run-card.mjs`, which builds the report itself. Everything runs from the repo root; reports go to `Evidence/_reports/` (not committed).

`PW_REPO` is the folder of the Playwright repo `ep-etm-fe-qa` (env variable; default `../ep-etm-fe-qa` next to this repo). Use the normal Bash, Read and Write tools; if a step cannot be done in this app, tell the user.

## 2. Tell the user how to run the tests

The user runs the tests on their own machine (VPN on). This app cannot open the STMS web app (VPN). Never give a bare `npx playwright test`. From the repo root:

```
node tools/run-card.mjs <KEY> <spec> -g "ETM-xxxx|ETM-yyyy"
```

- Each run gets its own result folder (`output/runs/<date_time>_<KEY>` in `PW_REPO`) and its own report (`output/runs/<date_time>_<KEY>/evidence-report-<KEY>-<time>.html`, plus `latest-<KEY>.html` and `latest.html`). The report is built when the run ends, failed tests are printed, and the link goes to the status board.
- Extra Playwright flags can follow (`--workers=2`, `--headed`). Use `--workers=1` when tests share the same plan data.
- Several cards can run at the same time, except cards touching the same QA data (same plan).
- Never use `cp -r test-results ...` and never keep results in `test-results/` (Playwright wipes it each run).
- Run with `--reporter=line` style output only through run-card; do not add `--reporter=list`.

## 3. Build the TC list of each Story (so totals and manual cases show)

Optional. Without it the report counts only the Tests that ran. For every Story key in the run (the key in brackets in the describe title, e.g. `(ETM-6868)`):

1. Read its Tests from Xray: `xray_graphql` with `getTests(jql: "issue in linkedIssues(\"<STORY>\",\"is tested by\")", limit: 100) { total results { jira(fields: ["key","summary"]) steps { action data result } } }`.
2. A Test counts as automated when its key starts a test title in the repo specs: `grep -rhoE "test\('ETM-[0-9]+ - " <PW_REPO>/tests`. Every other Test is manual.
3. Write `<os tmp folder>/tc-manifest-<KEY>.json` (run-card reads exactly this name), summaries short and without the `[FE][MT]` prefix. For manual Tests put the real reason in `reason` (ask the user when not obvious), otherwise `ยังไม่มีสคริปต์ - ต้องเทสเอง`:

```
{"stories": {"ETM-6868": [{"key": "ETM-7028", "summary": "...", "automated": true, "steps": [{"action": "...", "data": "...", "result": "..."}]}, {"key": "ETM-7030", "summary": "...", "automated": false, "reason": "..."}]}}
```

`steps` (from the same query) fill the "Step (Action)", "Test Data" (only shown when some step has data) and "Expected Result" columns; without them the report shows the `test.step` titles and no expected result. If Xray is not reachable, skip the manifest.

## 4. After the run

When the user says the run is done ("รันเสร็จแล้ว"), the report from `run-card.mjs` already exists. Use it. Only if it is missing or the user wants a rebuild:

```
node tools/run-card.mjs <KEY> --build-only <result-folder>
```

By hand (several runs, ONE report) from the repo root:

```
node tools/evidence-report-v4.mjs --input <folderA>/results.json <folderB>/results.json --out <run folder> --manifest <manifest.json> --title "<KEY> run <date>" [--review <review.json>] [--story <KEY>]
```

If the same test appears in two runs, the LAST file wins. A run that died before any test started (login timeout, VPN off) has an empty results.json: leave it out and tell the user to run it again. `--story` is for tests whose title has no card key. Pictures are read from the folder next to each `results.json`.

Old reports are kept. `latest*.html` are copies of the newest. Check the time of `results.json` first: if it is older than the run the user just finished, say so and ask before building.

Then tell the user in 2-3 lines: the report file name (and that it is on the board), the counts (all TCs, pass, fail, skip, manual), and for each failed test the key, the step number that broke and the one-line reason. Never paste HTML or image data into chat. Check the page has steps: `grep -o 'class="no">Step [0-9]*' latest.html`; none means the generator is old or broken, copy the generator from the skill folder again and rebuild.

## 5. Review verdicts (optional, only the user decides)

For each failed step the user decides: script bug, wrong test wording, or real app bug. Never decide alone. Record it in `output/runs/<run folder>/review-<KEY>.json` (in the Playwright repo) (run-card passes it when the file exists):

```
{"ETM-8339": {"steps": {"10": {"verdict": "script", "note": "..."}, "11": {"verdict": "defect", "note": "defect ETM-8501"}}}}
```

`verdict`: `accepted` (not counted as a fail, step yellow, test badge "PASS (ยอมรับ)") / `defect` / `tc-update` / `script` / `ba-pending`. Rebuild after editing. Note: the run-card terminal line "N pass / M fail" counts raw Playwright results, so an accepted test still counts as a fail there.

## What the report shows

Two tabs. **ผลรายขั้น** (default) is described below. **สรุปส่งต่อ dev / BA** groups the failed cases by the same cause (one block per cause: the cases, the step, Test Data and what the TC expected, plus a copy-ready text) and has one button "คัดลอกสรุปทั้งรอบ" with all the causes in one message. Environment problems (VPN / network down) are listed separately and left out of the copied text, because they are not for the dev. A case link jumps back to its table. The tabs are pure CSS (no JavaScript needed), so they also work in a static preview; only the copy buttons need JavaScript, and the full text is shown under "ดูข้อความรวม" for manual copy.

- Top: title, run time, result files, one totals line (all cases, pass, fail, accepted), then a short list of the failed cases (one line each, with a link to the case). No filter buttons.
- One section per Jira card (link) with its own totals: all TCs, pass, fail, skip, manual, not run this time. Failed tests come first and are open; passed tests are collapsed to one line.
- Each test: a PASS / FAIL / SKIP badge, links to its TC and card, then a table: `#` | `Step (Action)` | `Test Data` (only if the Xray steps have data) | `Expected Result` | `ผล` (ผ่าน / ไม่ผ่าน / ยอมรับแล้ว / ไม่ได้รัน / ไม่ได้ตรวจ) | `รูป` (the pictures taken at that step, with file names; click to enlarge).
- Spec notes ("หมายเหตุจากสคริปต์") from test annotations: `app-finding`, `tc-vs-ac`, `ba-confirm`, `partial`, `check-by-eye`, `env`.
- A failed test also has a red box right under the step that broke (inside the table; above the table only when it failed before any step) that a non-tester can read and forward: **ขั้นตอนที่ทำ** (Xray action), **ผลที่ TC คาดหวัง** (Xray expected result), **ผลที่ได้จากการเทส** (what the system gave, in plain Thai: wrong value "got 2, should be 1", button/field not found, no response in N seconds, or "VPN/network down" for environment problems), **ขั้นต่อไป** (not a verdict: look at the picture, the owner decides system bug / test data / TC), and a copy-ready question for the dev or BA with a copy button. The red box collapses (click its title line, which already shows the reason); the forward text collapses too, and its copy button works without opening it. Script details are folded. Review verdicts show under their step.
- The "ผลที่ได้จากการเทส" line is clearer when the spec gives each `expect` a plain-language message, e.g. `expect(value, 'Date stays after Tab').toBe(...)`: the message is shown in front of the values.
- A box listing the manual TCs (link, name, reason).
- If no test ran at all, a red box shows Playwright's own error (for example `No tests found`: the spec name or `-g` text matched nothing).

Pictures are matched to steps by number: `test.step` titles start with `N.` and `evidence()` labels start with `Step N:`. The report is for checking by eye and pushes nothing to Xray.
