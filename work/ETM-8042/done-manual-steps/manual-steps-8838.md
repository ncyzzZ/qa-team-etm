# ETM-8042 manual steps: ETM-8838 (PDF of Shutdown Logic uses the Plan dates; PDF of the Daily Report uses the snapshot after a Plan edit)

Test Execution: ETM-8873. Environment: QA only (https://stms-qa.apps.pttep.com). One picture per step (Xray needs a picture per step).
Log in as Turnaround Manager (Edit Plan, Shutdown Logic export, Daily Report export).

## Data (`ep-etm-fe-qa/.env`, block ETM-8042)
- Event `ETM8042_EVENT_ID` (18bf0408-c725-4e84-b419-22e9a9eef29b), Planned Date **08 Feb 2026 08:00 → 22 Feb 2026 08:00**.
- Plan **Plan Scenario A**, Ramp Down/Up Date **15 Feb 2026 09:00 → 25 Feb 2026 18:00**.
- Shutdown Logic of Plan A: `ETM8042_LOGIC_PATH_A` = `/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b/planning/dd8fda3f-0eb1-4263-bc7c-1976b4ec72bc/logics/10627aa8-d05d-4337-a5cc-2d9ffc84fa81`
- Planning tab: `/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning`
- Daily Report of Plan A: Planning tab → Plan Card **Plan Scenario A** → Daily Report row → View. Its snapshot must be **15 Feb 2026 09:00 → 25 Feb 2026 18:00** (made before step 4).

## Before you start
- The Shutdown Logic of Plan A opens and has tasks.
- Plan A has a Daily Report, and its snapshot is 15 – 25 Feb 2026 (the first execution day is 14 Feb 2026). If Plan A has no Daily Report, steps 5-8 are needs-human (do not create one).
- The Daily Report Export needs the shown day to be frozen (ETM-5277 AC 2.1). If no day is frozen, steps 5-8 are needs-human (do not freeze).
- The Plan badge reads `Ramp Down/Up Date: 15 Feb 2026 09:00 - 25 Feb 2026 18:00`. If not, stop: every step needs-human.

## ETM-8838 - PDF of Shutdown Logic and Daily Report after a Plan edit (9 steps)
writes data: yes
role: turnaroundManager
start: ETM8042_LOGIC_PATH_A
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Shutdown Logic page of `Plan Scenario A`, click Export and choose PDF (Export Shutdown Logic panel → PDF File → Export) | A PDF file is downloaded | Export panel with PDF File chosen |
| 2 | Read the Full Shutdown Timeframe in the PDF (ETM-7900) | It runs from `15 Feb 2026` to `25 Feb 2026`, not from `08 Feb 2026` to `22 Feb 2026` | PDF page with the timeframe |
| 3 | Read the first day of the Day numbering in the PDF (ETM-7900) | Day 1 is `15 Feb 2026`, the Plan's Ramp Down date, not `08 Feb 2026` (AC 8.1). The PDF has no "Day 1" text: read the first day column of the timeline | PDF page with Day 1 |
| 4 | Planning tab → Plan Card `Plan Scenario A` ⋮ → Edit Plan. Set `Ramp Down/Up Date` to `18 Feb 2026 09:00 - 20 Feb 2026 09:00`, Save | The toast `Edit Success` appears and the badge shows `18 Feb 2026 09:00 - 20 Feb 2026 09:00` | Plan Card badge after Save |
| 5 | Open the Daily Report of `Plan Scenario A`, click Export and choose PDF | A PDF file (or a zip of per-day PDFs) is downloaded | Export control |
| 6 | Read the timeframe in the PDF (ETM-7901) | It runs from `15 Feb 2026` to `25 Feb 2026` (the snapshot), not `18 Feb 2026` to `20 Feb 2026` | PDF page with the timeframe |
| 7 | Read the first day of the Day numbering (ETM-5277) | Day 1 is `15 Feb 2026`, the snapshot Ramp Down date, not `18 Feb 2026` | PDF page with Day 1 |
| 8 | Read the day before Day 1 | `14 Feb 2026` is Day0 (the First Execution Date, because the Ramp Down `09:00` is before 18:00) | PDF page with Day0 |
| 9 | Edit Plan of `Plan Scenario A` again: set `Ramp Down/Up Date` back to `15 Feb 2026 09:00 - 25 Feb 2026 18:00`, Save | The badge shows `15 Feb 2026 09:00 - 25 Feb 2026 18:00` again | Plan Card badge |

Pass: steps 2, 6, 7, 8 match. Step 3: Day 1 = 15 Feb 2026 (AC 8.1, Xray updated 24 Nov).
Steps 4 and 9 change QA data on Plan Scenario A only. Step 9 must run even if an earlier step failed (put the Plan back).
