# Questions for BA: Manpower Mob Plan (QA check, 25 Nov 2026)

1. **ETM-5615 AC 3.4.2, Onboard Date filter (From / To).** The `To` calendar now disables every date before the selected `From` date, so the "From after To" state cannot be reached by picking and the red validation border never appears. Is this the intended behaviour now, replacing the red border in AC 3.4.2? If yes, what should happen when `From` is changed to a date after an existing `To` (red border, or `To` cleared)? Please update AC 3.4.2 either way.

2. **ETM-5615 AC 2.1, Save button for Job Owner.** Does the Job Owner role hold the "Edit Manpower Mob Plan" permission in Role & Permission V.2? On QA a Job Owner on an Active plan sees the page Save button (enabled after a filter change) and can also add and delete Resources. AC 2.1 says Save is hidden for users without that permission. Please confirm whether a Job Owner may save the global filter, or whether Save (and the edit actions) should be hidden for Job Owner.
