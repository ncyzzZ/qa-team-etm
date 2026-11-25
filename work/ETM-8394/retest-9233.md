# ETM-9233 retest plan (Defect of ETM-8394, Xray Test ETM-8755, Test Execution ETM-8774)

> **2026-11-25: OBSOLETE.** QA lead decided ETM-9233 is not a defect (blank `Action` in the export is correct). See `handover.md`.

Wait for: dev moves ETM-9233 to Resolved / Ready for Retest **and** the BA answers `questions-for-BA-round5.md` Q1 (which fix: export fills Revise, or import treats blank Action on a UUID row as Revise).

## Data
- QA, event `NN TEST QA`, Worklist `Wide Plan B - NN` (the one used in the defect; 84 Work / 222 breakdown rows), or the card's own Works of ETM-8755.
- Users: `Somchai Tester` (TM), `Malee Tester` (TM). Only TM can import (JO is view only).
- The export file is made by the app, so the data is UI-reachable.

## Steps (by hand or the Playwright run)
1. Open the Worklist as TM, note Work Status and Breakdown Status of a few Works, including one `Change Requested` and one `Reviewed`.
2. Click `Export Worklist`. Open the file, sheet `Worklist_Data`:
   - fix (a): Column C `Action` = `Revise` on every row;
   - fix (b): `Action` may be blank, `UUID` filled on every row.
3. Open Import Work and Work Breakdown and upload the file **unchanged**.
   - Expected: no error banner, every row valid, `Confirm` enabled.
4. Click `Confirm`. Expected: import completes.
5. Read the statuses again. Expected: all equal step 1; `Change Requested` stays `Change Requested`, `Reviewed` stays `Reviewed`.
6. Upload the same file as `Malee Tester`, confirm, read again: no error, nothing changes.
7. Regression: a file with `Action` blank on a row **without** UUID still gives "This field is mandatory." (new rows still need Action).
8. Only if BA says the export follows the filter (Q2): type a Work Number in the search box, export, and check the file holds only the filtered Works.

## Run
- Script: `PW_REPO/tests/fe/e2e/importWork/verifyImportWorkStatus.spec.ts`, test ETM-8755. Repro: `PW_REPO/tests/fe/explore/etm9233Repro.spec.ts`.
- Check `node tools/run-policy.mjs ETM-8394 <spec> -g "ETM-8755"` first: the import writes data, so ask the user if it prints `ask`.
- If ETM-8755 step 1 wording changes (Q2 answer: whole Worklist), update the Xray step after the user's yes.

## After a pass
- Comment "Retest: Passed" on ETM-9233 with the evidence pictures embedded (full screen, before/after), check the pictures are not blank. Needs the user's yes (Jira write).
- Xray ETM-8755 -> PASSED only from a passed (not skipped) run in `run-results.json`, one push for the card.
