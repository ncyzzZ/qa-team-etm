# Retest plan: ETM-9219 (ETM-8034)

Defect: the `Highlight Row` / `Change Text Color` palette does not put a blue frame on the colour the row already has. The frame shows only on hover/focus.
Rule: BA round 1, Q3 (`ba-answers.md` row 3): blue frame = the colour currently selected.
Found by: Xray ETM-8856 steps 12-13 and ETM-8859 step 14 (Test Execution ETM-8875), run `2026-11-24_215258_ETM-8034` (both `failed`). Assignee: thanawich.

## When to start
Only after the dev moves ETM-9219 to a fixed/ready-for-retest status and the new FE build is on QA (check the build name in the page source).

## Automated retest (run-policy: `auto`, re-run of tests that ran before)

```bash
node tools/run-card.mjs ETM-8034 shutdownLogic/verifyShutdownLogicRowColour.spec -g "ETM-8856|ETM-8859"
```

Pass means: 8856 step 12 (`B9E0FF` framed), step 13 (no other cell framed), step 16 (no frame on a clean row's colour cells) and 8859 step 14 (only `FFE7BA` framed) all pass.

## Manual check (for the defect comment pictures, full viewport)

Shutdown Logic `S26 Row Colour` (event NN TEST QA), Turnaround Manager.

1. Open the page. Collapse the Manpower Resource histogram first (hover `sl-splitter-horizontal`, click `Hide histogram`).
2. Double-click the No. cell of a Work row, right-click it, `Highlight Row` > `B9E0FF`.
3. Select the row again, right-click, open `Highlight Row`. Do not move the mouse over the swatches.
   - Expect: `B9E0FF` has a blue frame; the other 12 swatches (incl. No Color) do not.
4. Same with `Change Text Color` > `FA8B16`, then reopen.
   - Expect: only `FA8B16` framed.
5. On a row with no colour, open both palettes.
   - Expect: only No Color framed (per defect expected result), no colour swatch framed.
6. Picture before (palette open, mouse away) and after for each case.

## After the retest
- Passed: ask the user once, then (jira-xray-logger) set 8856 / 8859 steps back to PASSED in ETM-8875 and add "Retest: Passed" comment with the pictures embedded on ETM-9219 itself.
- Failed: comment on ETM-9219 with the new build and pictures, keep it open. Ask first.
- Open point to raise with BA if seen: does No Color show a frame on a clean row (step 5)? The defect expects yes; 8856 step 16 only checks the 12 colour cells.
