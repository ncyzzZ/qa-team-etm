# ETM-8042 manual steps: ETM-8837 Mob Plan Excel re-proof with data (26 Nov 2026)

Why: run 140002 exported the Manpower and Equipment Mob Plan Excel of Plan Scenario A, but both Mob Plans are empty ("No personnel assigned." / "No equipment added.") and the files have no `Ramp Down Date` / `Ramp Up Date` labels. AC 8.3 / 8.4 of ETM-8042: Export Excel replaces `Start Event Date` / `End Event Date` with `Ramp Down Date` / `Ramp Up Date`. Re-prove with UI-made data on the card-owned Plan.

Environment: QA only (https://stms-qa.apps.pttep.com). Turnaround Manager. Event "QA S26 Ramp" (/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning), Plan "QA ETM-8042 8836" (Inactive, card-owned, Ramp Down/Up 15 Feb 2026 09:00 - 25 Feb 2026 18:00). Never use Plan Scenario A or any other Plan; never touch the Active toggle.
Data you add is named with "QA 8042 8837" so it can be found later. Leave it in place (card-owned).
For each export: save the .xlsx in the run folder and write down every text cell of the first rows (metadata part) and whether the labels appear.

## ETM-8837 - Manpower and Equipment Mob Plan Excel with data, Plan "QA ETM-8042 8836" (6 steps)
writes data: yes (card-owned Plan "QA ETM-8042 8836": one person in its Manpower Mob Plan, one equipment in its Equipment Mob Plan, both named "QA 8042 8837")
role: turnaroundManager
start: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | On the Plan Card "QA ETM-8042 8836" open the Manpower Mob Plan (create it with the card's Create button if it does not exist). Add one person / resource row named "QA 8042 8837" with the screen's own controls and Save | The row is saved and shown | Manpower Mob Plan with the row |
| 2 | Click Export (Excel) on the Manpower Mob Plan | An .xlsx file is downloaded (save it) | Page + file name |
| 3 | Read the metadata part of the Manpower file | Labels `Ramp Down Date` and `Ramp Up Date` with `15 Feb 2026 09:00` / `25 Feb 2026 18:00`; no `Start Event Date` / `End Event Date`. Write down exactly what the file shows | Render or text dump of the file top |
| 4 | Open the Equipment Mob Plan of the same Plan (create it if needed). Add one equipment row named "QA 8042 8837" with the screen's own controls and Save | The row is saved and shown | Equipment Mob Plan with the row |
| 5 | Click Export (Excel) on the Equipment Mob Plan | An .xlsx file is downloaded (save it) | Page + file name |
| 6 | Read the metadata part of the Equipment file | Same as step 3. Write down exactly what the file shows | Render or text dump |

If a step needs data the screen cannot make (e.g. a person master that does not exist), stop and write needs-human with what is missing. Do not delete anything.
