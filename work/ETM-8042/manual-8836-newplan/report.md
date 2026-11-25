# ETM-8836 on new Plan "QA ETM-8042 8836" (QA, TM) - awaiting confirmation
Plan id: 384db0ce-b08c-419e-8aec-b83b62baca23 (Inactive, left as is)
Logic: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b/planning/384db0ce-b08c-419e-8aec-b83b62baca23/logics/81460f63-12e8-47c5-8a10-87553b0a7d39?tab=planning
Planning tab: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning
Note: Dates picked in the picker (Ramp Down box defaulted to the event 08 Feb 08:00 / 22 Feb 08:00). Worklist (Initial) was created by itself with the Plan.

| # | Verdict | Facts | Picture |
|---|---|---|---|
| 1 | pass | Toast "Create Success / Create Plan Successfully." read; card QA ETM-8042 8836 badge "Ramp Down/Up Date: 15 Feb 2026 09:00 - 25 Feb 2026 18:00", Inactive | step-1.png (toast had gone, card shown) |
| 2 | pass | Create on Logic row (no Worklist needed): toast "Create Shutdown Logic Successfully."; row now has Last update 25 Nov 2026 | step-2.png (toast had gone) |
| 3 | pass | Histogram collapsed. Start Date read: 15 Feb 2026 (Gantt first day header Sun 15/02, Ramp Down at 09:00); not 08 Feb | step-3.png |
| 4 | needs-human | Ramp Down line at the 09:00 column of 15 Feb confirmed. Ramp Up line (25 Feb 18:00) NOT visible: the empty Logic timeline ends at 19:00 on 15 Feb (scrolled to the end, zoom out had no effect). Needs a task in the Logic or a person to look; badge text of Ramp Up not seen | step-4.png |

Result: 3 pass / 1 needs-human. Not pushed to Xray.
Side note: Plan Scenario A is Active and Ext/others unchanged; nothing else touched.
