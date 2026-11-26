# ETM-8042 manual re-check: ETM-8851 (paste an invalid date into the Ramp Down/Up picker)

Why: script run 2026-11-24_220320 failed: after pasting `31 Feb 2026 08:00` into End, End still showed `25 Feb 2026 18:00` (BA Q11 / AC 1.2: the pasted part is cleared and Save is disabled). Re-prove by hand before any defect.

Environment: QA (https://stms-qa.apps.pttep.com), Turnaround Manager. Nothing is saved: always leave with Cancel.
Planning tab: `/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning`, Plan Card **Plan Scenario A** (Ramp Down/Up `15 Feb 2026 09:00 - 25 Feb 2026 18:00`).

## ETM-8851 - invalid pasted or typed date in the Ramp Down/Up picker, re-check (6 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Plan Scenario A → three-dot → Edit Plan | Edit Plan opens, picker `15 Feb 2026 09:00` → `25 Feb 2026 18:00` | Edit Plan modal |
| 2 | Click the Start part, select all, paste `31 Feb 2026 08:00` (clipboard paste, then click outside the picker / press Tab) | Start is cleared, Save disabled | Picker + Save |
| 3 | Cancel, open Edit Plan again. Click the End part, select all, paste `31 Feb 2026 08:00`, click outside / Tab | End is cleared, Save disabled | Picker + Save |
| 4 | Cancel, open Edit Plan again. End part: paste `2026-02-08 08:00`, click outside / Tab | End is cleared, Save disabled | Picker + Save |
| 5 | Cancel, open Edit Plan again. End part: TYPE `31 Feb 2026 08:00` with the keyboard, click outside / Tab | End is cleared, Save disabled | Picker + Save |
| 6 | Cancel | Modal closes, badge unchanged `15 Feb 2026 09:00 - 25 Feb 2026 18:00` | Plan Card badge |

For each step write the exact text shown in Start and End after leaving the field, and whether Save is enabled.
