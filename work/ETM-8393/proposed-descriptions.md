# ETM-8393 proposed Test descriptions (not written to Xray yet)

Steps, Summary, Labels untouched. Template: Scenario, Precondition, Navigation Path.

## ETM-8810

Scenario: Hovering a bar shows the tooltip card and moving away hides it.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
The histogram has at least 2 resource rows that each show a bar.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8811

Scenario: The tooltip card shows the right labels, icons and whole numbers, and no list of Works.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
At least one bar is visible. The `Capacity` line icon is expected to be red.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8812

Scenario: The Capacity and Used Resource in the card match the table on the left and the bar height.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One PTTEP crew resource row and one Contractor resource row with different Capacity values, and both rows show a bar.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8813

Scenario: The box icon next to Used Resource is red when Used Resource is above Capacity.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One bar has Used Resource above the Capacity line and is red.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8814

Scenario: The box icon next to Used Resource is green when Used Resource is equal to or below Capacity.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One green bar has Used Resource below Capacity and one green bar has Used Resource equal to Capacity.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8815

Scenario: Every point inside one same-height section shows the same values.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One bar has a continuous section of the same height across several days, and the capacity line does not change inside that section.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8817

Scenario: The section after a height change shows its own values.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One bar changes height at some day, for example a lower section followed by a higher section.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8818

Scenario: No tooltip card appears where there is no bar.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One resource row has a gap with no bar (Used Resource 0), or a row with no bar at all.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8819

Scenario: The tooltip card does not get stuck or show twice after fast moves, scrolling and a toolbar change.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
At least 5 bars are visible, so the mouse can sweep across them.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8820

Scenario: The tooltip values follow the Work Header filter, a change of manpower and the Used Resource toggle.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
The bar of one row changes when one Work Header is selected in the Filter Panel. The `Used Resource` toggle may be missing on the QA build.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8821

Scenario: The tooltip card is shown for a user with View All and for a user with View Active.

Precondition:  
Logged in as a Turnaround Manager user, then as a Job Owner user ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One Turnaround Manager user and one Job Owner user, both able to open the same plan.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8823

Scenario: Capacity shows 0 for a bar outside the shift Working Time.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One resource row has a bar at a time outside the shift Working Time, where the capacity line drops to 0.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8824

Scenario: Two same-height sections with a gap between them are two sections.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One resource row has a bar section, then a gap with no bar, then another section of the same height. The same row also has a section of a different height.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8826

Scenario: A Capacity change inside a bar of the same Used Resource height stays one section.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One resource row has a bar of the same height over several days while the capacity line changes value inside it, for example at the start of a shift.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

## ETM-8827

Scenario: A change of both Capacity and Used Resource height starts a new section with its own values.

Precondition:  
Logged in as a user with the View All Shutdown Logic Item or View Active Shutdown Logic Item permission ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)). The Shutdown Logic page of a plan is open and the Manpower Resource histogram shows resource rows with bars.  
One resource row has a bar where, on one day, the capacity line value and the Used Resource height both change.

Navigation Path: Shutdown Event List > open the plan > Shutdown Logic page (Manpower Resource histogram). No fixed URL, because the plan depends on the QA data.

