# ETM-8042: Xray step updates (approved by the user in chat 2026-11-20: "แก้ step ใน Xray ทั้ง 4 ตัวได้เลย")

Replace ALL steps of each Test with the steps below (Action -> Expected Result; Data empty). Update the summary only where "New summary" is given.
Reason: DEC-062 (AC 8.2 edited in Jira 2026-11-20) for ETM-8842; user decision 2026-11-20 "drop the before-release part" for ETM-8837, ETM-8846, ETM-8849.

## ETM-8842 (TC-014)
New summary: [FE][BE][MT] Verify Extend Daily Report adds days after the last execution day and does not change the Plan Ramp Down/Up Date, the snapshot or the event Planned Date, also after a second Extension and after deleting the extended days (POS/NEG)
Precondition (put in the first step's Data if the Test has no precondition field): `Plan Scenario Ext` has `20 Feb 2026 18:00 - 22 Feb 2026 07:00`; its Daily Report is at its last execution day with a Work Breakdown task below 100%; event Planned Date `08 Feb 2026 08:00 - 22 Feb 2026 08:00`.
1. Freeze the last execution day of the Daily Report. -> The confirmation `Extend Daily Report` appears with `Confirm` and `Cancel`.
2. Click `Cancel`. -> The confirmation closes and no day is added.
3. Freeze the last execution day again and click `Confirm`. -> One or more execution days are added after the old last execution day.
4. Read the last execution day. -> It is later than `22 Feb 2026`.
5. Open `Edit Plan` of `Plan Scenario Ext` and read the dates. -> They are still `20 Feb 2026 18:00 - 22 Feb 2026 07:00`.
6. Read the badge on the Plan Card. -> It shows `Ramp Down/Up Date: 20 Feb 2026 18:00 - 22 Feb 2026 07:00`.
7. Open the Daily Report Gantt and look at the `Ramp Down` and `Ramp Up` lines. -> One `Ramp Down` line on the snapshot Ramp Down date and one `Ramp Up` line on `22 Feb 2026`; the added days are after the `Ramp Up` line.
8. Look at the end of the Planned S-Curve. -> It ends on the new last execution day (snapshot Ramp Up plus the added days).
9. Open Edit Shutdown Event and read the Planned Date. -> It is still `08 Feb 2026 08:00 - 22 Feb 2026 08:00`.
10. Freeze the new last execution day and click `Confirm`. -> More days are added after the last one.
11. Read the badge and the `Ramp Up` line again. -> The badge is unchanged and there is still exactly one `Ramp Up` line on `22 Feb 2026`.
12. Delete the extended days. -> The extended days are removed.
13. Read the badge, `Edit Plan` and the `Ramp Down` / `Ramp Up` lines. -> All are unchanged: `20 Feb 2026 18:00 - 22 Feb 2026 07:00`, one line each on the snapshot dates.

## ETM-8837 (TC-009)
Precondition: `Plan Scenario A` (`15 Feb 2026 09:00 - 25 Feb 2026 18:00`, event Planned Date `08 Feb 2026 08:00 - 22 Feb 2026 08:00`) has a Shutdown Logic, a Manpower Mob Plan and an Equipment Mob Plan. Repeat the steps for each of the three pages.
1. Open the Shutdown Logic, Manpower Mob Plan or Equipment Mob Plan page of `Plan Scenario A`. -> The page opens with the `Export` button.
2. Click `Export` and choose Excel. -> An Excel file is downloaded.
3. Open the file and look for the labels in the metadata part. -> The labels `Ramp Down Date` and `Ramp Up Date` are shown.
4. Look for the old labels. -> The labels `Start Event Date` and `End Event Date` do not appear.
5. Read the values next to the two labels. -> `Ramp Down Date` shows `15 Feb 2026` and `Ramp Up Date` shows `25 Feb 2026` (the Plan values), not the event Planned Date `08 Feb 2026`.
6. For the Shutdown Logic file only, read the date of `Day1` (ETM-5492). -> `Day1` is `15 Feb 2026`.

## ETM-8846 (TC-018)
Precondition: none besides the event; the test creates the Plan.
1. Create a Plan named `Plan Scenario Long Name Plan Scenario Long Name 12` (50 characters) with `15 Feb 2026 08:00 - 15 Feb 2029 20:15` and read the badge. -> The badge shows `Ramp Down/Up Date: 15 Feb 2026 08:00 - 15 Feb 2029 20:15`.
2. Create the Shutdown Logic of that Plan. -> The Shutdown Logic row shows as created.
3. Create the Daily Report for that Plan and open it. -> The Daily Report opens.
4. Note down the first and the last day of the Gantt chart. -> The two days are written down and the Gantt shows no wrong date format.
5. Open the Shutdown Logic of that Plan and export it to Excel. -> An Excel file is downloaded.
6. Read `Ramp Down Date` and `Ramp Up Date` in the metadata. -> They show `15 Feb 2026` and `15 Feb 2029`.
7. Set the browser window width to 600 px and look at the card header. -> The badge stays on one line with its full text.
8. Read the Plan Name in the card header. -> The Plan Name is cut with an ellipsis (`…`).
9. Hover over the Plan Name. -> The full name `Plan Scenario Long Name Plan Scenario Long Name 12` is shown.

## ETM-8849 (TC-021)
New summary: [FE][BE][MT] Verify a Daily Report created before the release still shows the dates of its event Planned Date after the release (BND)
Precondition: a Daily Report created before the release, without a snapshot (QA: Export 5000, event Planned Date `17 Jun 2026 10:00 - 15 Jul 2026 06:00`).
1. Open the old Daily Report. -> The Daily Report opens and the page works without an error.
2. Read the First Execution Date. -> It is `16 Jun 2026` (event Planned start `10:00` is before `18:00`, so the day before).
3. Read the last execution day. -> It is `15 Jul 2026` (event Planned end).
4. Note down the first and the last day of the Gantt chart. -> The two days are written down and the Gantt shows no error.
5. Look at the end of the Planned S-Curve. -> It ends on `15 Jul 2026`.
6. Export the Daily Report to PDF and read the Day numbering. -> Day 1 is `16 Jun 2026`.
7. Reload the old Daily Report and read the First Execution Date and the last execution day. -> They are still `16 Jun 2026` and `15 Jul 2026`.
