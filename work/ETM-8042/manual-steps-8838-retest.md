# ETM-8042 manual steps: ETM-8838 full re-run after ETM-10140 (26 Nov 2026)

Why: ETM-10140 (Export disabled on Day0) is Deployed to QA. Re-run all 9 steps of ETM-8838 on the card-owned Plan "QA ETM-8042 8836" (event "QA S26 Ramp"), Ramp Down/Up Date `15 Feb 2026 09:00 - 25 Feb 2026 18:00`, Daily Report days 14-24 Feb frozen, 25 Feb open. Plan A is not used (its Daily Report has no frozen day).

Environment: QA only (https://stms-qa.apps.pttep.com). Turnaround Manager.
Shutdown Logic page: collapse the Manpower Resource histogram first (button `aria-label="Hide histogram"` inside `data-testid="sl-splitter-horizontal"`, shown on hover), after every load.
Pictures: full screen, step note box at the bottom. For a PDF step, save the PDF in the run folder and a PNG render of its first page as the picture.
Never Freeze, Unfreeze or Save on the Daily Report. Never touch another Plan, the Active toggle or Optimize. Step 9 must always run (put the Plan back) even if an earlier step fails.

## ETM-8838 - PDF export of Shutdown Logic uses the Plan dates; Daily Report PDF uses the snapshot dates after the Plan was edited (9 steps)
writes data: yes (card-owned Plan "QA ETM-8042 8836": dates edited in step 4, set back in step 9)
role: turnaroundManager
start: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b/planning/384db0ce-b08c-419e-8aec-b83b62baca23/logics/81460f63-12e8-47c5-8a10-87553b0a7d39?tab=planning
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Shutdown Logic page (start URL), collapse the histogram, click Export, choose PDF, click Export | A PDF file is downloaded (save it) | Export panel + render of the PDF |
| 2 | Read the Full Shutdown Timeframe in the PDF | It runs from `15 Feb 2026` to `25 Feb 2026`, not from `08 Feb 2026` to `22 Feb 2026` | PDF render |
| 3 | Read the first day of the Day numbering in the PDF | Day 1 is `15 Feb 2026`, not `08 Feb 2026` | PDF render |
| 4 | Go to the event Planning tab (/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning or the Planning tab). On the Plan Card "QA ETM-8042 8836" open Edit Plan, set Ramp Down/Up Date to `18 Feb 2026 09:00 - 20 Feb 2026 09:00` with the picker, Save | Toast `Edit Success`, the badge shows `18 Feb 2026 09:00 - 20 Feb 2026 09:00` | Plan card with toast and badge |
| 5 | Open the Daily Report (/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b/planning/384db0ce-b08c-419e-8aec-b83b62baca23/daily-report/9eb382d9-85eb-4725-9d30-2f6bc2daae89), go to `15 Feb 2026` (frozen, Unfreeze shown), click Export and choose PDF | A PDF file is downloaded (save it) | Header + PDF render |
| 6 | Read the timeframe / date axis in the Daily Report PDF | It runs from `15 Feb 2026` to `25 Feb 2026` (the snapshot), not `18 Feb 2026` to `20 Feb 2026`. Write down exactly what dates the PDF shows (first and last) | PDF render |
| 7 | Read the Day numbering of the PDF (file name `..._DayN_YYYYMMDD.pdf` and any Day label inside) | Day 1 is `15 Feb 2026` (snapshot Ramp Down), not `18 Feb 2026` | PDF render + file name |
| 8 | Press the previous-day arrow until it is disabled: date `14 Feb 2026`, Unfreeze shown. Read the Export button state from the DOM, then click Export, choose PDF, Export | Export is enabled on `14 Feb 2026` (Day0, no tasks); a PDF of 14 Feb downloads (file name shows Day0 / 20260214) | Header on 14 Feb + PDF render |
| 9 | Back on the Planning tab, Edit Plan "QA ETM-8042 8836" to `15 Feb 2026 09:00 - 25 Feb 2026 18:00`, Save | Toast `Edit Success`, badge shows `15 Feb 2026 09:00 - 25 Feb 2026 18:00` | Plan card with badge |
