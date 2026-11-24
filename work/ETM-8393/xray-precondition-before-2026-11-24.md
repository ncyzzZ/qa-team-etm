# ETM-8815 / ETM-8821 description before the pre-condition edit (2026-11-24)

## ETM-8815
Scenario: Every point inside one same-height section shows the same values.

Precondition:
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.
One bar has a continuous section of the same height across several days, and the capacity line does not change inside that section.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8821
Scenario: The tooltip card is shown for a user with View All and for a user with View Active.

Precondition:
Logged in as a Turnaround Manager user, then as a Job Owner user ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.
One Turnaround Manager user and one Job Owner user, both able to open the same plan.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.
