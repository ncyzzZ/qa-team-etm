# ETM-8392 handover (24 Nov 2026, manual run)

Run: `/Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual` (report: evidence-report-ETM-8392-20261124-220828.html)
Nothing written to QA data, Xray or Jira. Nothing committed.

| Test | Result | Waiting for |
|---|---|---|
| 8679 | 4/4 pass (computed style: colour, 92x48 chip, 2px solid line) | user --confirm |
| 8693 | 4/4 pass (Snap C 10 Jun PDF: one Ramp Down at 1/3 of 11 Jun, no Ramp Up, no fragment) | user --confirm |
| 8690 | 7/8 pass; step 7 needs-human | decision: defect or not |
| 8692 | 5/6 pass; step 4 needs-human | decision: defect or not |
| 8677, 8688, 8797 | not run | own yes (they write QA data; Extension cannot be undone). Run 8797 last |

Possible defect (same cause in 8690 step 7 and 8692 step 4): in Focus Timeframe PDFs, part of a Ramp label whose line is OUTSIDE the window leaks into the Gantt header:
- 14 Jun PDF (window 13-16): faint "Down" left of "13" (evidence/ETM-8690/step-7.png)
- 17 Jun PDF (window 16-19): faint "p Up" at the left edge of "16" (evidence/ETM-8692/step-4.png, step-4-zoom.png)
Lines themselves are correct. Also seen: the last column of the PDF Gantt is cut by the page edge, and in the 11 Jun PDF the Ramp Up label on the last day shows only "R".

After the decision: `node tools/manual/results.mjs /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual --decide ETM-8690 7=pass|fail ...`, `--confirm` each Test, `run-card --build-only`, then the Xray dry run.
Files changed today: manual-steps-8679.md (heading, URL note), manual-steps-pdf-8690-8692.md (8693 section with Snap C 10 Jun), old PDF steps file renamed to old-steps-pdf-8690-8692-8693.md (git mv).

## Update (user, later 24 Nov 2026)
- User exported Snap C 18 Jun PDF (`~/Downloads/ART PSD_QA 8392 Snap C_DailyReport_Day8_20260618.pdf`, scale 01-18 Jun = Full Shutdown Timeframe): labels `Ramp Down` / `Ramp Up` present; the two #009FDA lines are 170 units apart = 2.5 days = 11 Jun 08:00 → 13 Jun 20:00. Correct. Extra evidence for AC-4 default Full Shutdown Timeframe (F-9: no TC).
- **Snap C 18 Jun now shows `Unfreeze` (frozen).** 8797 steps assume 18 Jun is the open last day and E1 = 19 Jun. Check whether an Extend happened (19 Jun exists?) and update 8797 steps before running it.
- Checked in Chrome: Snap C 19 Jun exists, not frozen, last day. 8797 steps shifted to E1 = 20 Jun, E2 = 21 Jun.

## Data-writing manual run (24 Nov 2026, user yes "รันทั้ง 3 ตัว")
| Test | Proposed | Note |
|---|---|---|
| 8677 | 6/6 pass | step 2: badge changed, toast not seen (agent still said pass; treat as needs-human). Restored Snap A to 10 Jun 06:00 - 14 Jun 18:00. Agent clicked the Active toggle by mistake, pressed Cancel: Active plan unchanged |
| 8688 | 4/5 pass, step 2 needs-human | toast "Freeze Success" not caught; modal correct. Snap B now 08-18 Jun frozen, 19 Jun open (last) |
| 8797 | 7/7 pass | toasts caught. Snap C now 10-20 Jun frozen, 21 Jun deleted, all tasks 100% (cannot extend again without new data) |
All 7 Tests await the user's --confirm. 8690 s7 / 8692 s4 wait for BA round 3.
- 24 Nov 2026: user confirmed all ('ยืนยันทั้งหมด'): 8677, 8679, 8688, 8693, 8797 passed (manual-agent). Card now 16 passed / 2 skipped (8690, 8692 wait for BA round 3).

## Xray push (24 Nov 2026, user yes "ใช่ push")
- Pushed PASSED with step pictures, read back OK: 8677, 8679, 8688, 8693 (ETM-8825).
- NOT pushed: 8797. Its Test Run in ETM-8825 still has the OLD 9-step version (before DEC-062 rewrite: "line moves to the new Ramp Up Date"); the Test itself has the new 7 steps. Fix = reset the Test Run to the latest Test version (Xray write, ask first), then push again.
- 8690, 8692 not pushed (BA round 3).
- 8797: Test Run reset to 7 steps (resetTestRun), pushed PASSED + 7 pictures, read back OK. Xray now: 16 PASSED, 8690/8692 TO DO (BA round 3).

## 25 Nov 2026 - BA R3 answers applied, then a correction
- Xray ETM-8825: 8692 FAILED (s4), 8693 FAILED (s2) pushed; 8690 not pushed (its Test Run has the old 5 steps; reset needs the user's yes).
- Evidence check: D1 (badge text outside window) defect-proven. D2 not proven as written: the PDF text geometry shows the 4 day columns FIT the page (page 1191 wide, last column ~1121-1189). What is cut is a Ramp badge drawn right of a line late on D+2 (11 Jun PDF: Ramp Up 13 Jun 20:00, badge shows "R") at the Gantt end. The first manual agent's "column cut" was wrong.
- So 8690 s3 and 8693 s2 should be pass; 8693 FAILED in Xray is wrong and must go back to PASSED (ask first). D2 draft must be rewritten to "badge on D+2 cut".
- 25 Nov 2026 defects logged (user yes "ยืนยันทั้งหมด" + "แก้ตามนี้ทั้งหมด"), assignee thanawich klongsard (jif, from the lead chat), Sprint 26, Epic ETM-8, labels FE/UI, Relates ETM-8392, images embedded, dev brief attached:
  - ETM-10054 (D1, F-12): badge text of an out-of-window line in the Focus PDF. Xray: ETM-8690 s7, ETM-8692 s4 FAILED + linked. [QA] ETM-10056 Done, 20m.
  - ETM-10055 (D2, F-13): Ramp Up badge late on D+2 cut. Xray: ETM-8690 s8 FAILED + linked. [QA] ETM-10057 Done, 15m.
- Xray ETM-8825 now: 16 PASSED, 8690 FAILED, 8692 FAILED. 8693 back to PASSED (the "column cut" was a wrong reading).
- Possible extra point seen by the checker (not logged): in the 11 Jun PDF the Ramp Down badge covers part of the "Jun 2026" header, leaving "26".
