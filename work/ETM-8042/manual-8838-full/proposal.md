# ETM-8838 proposal (not confirmed)

- step 1: **pass** - Export panel: PDF File enabled (Excel disabled), Overall mode. Downloaded 'QA S26 Ramp_QA ETM-8042 8836_Overall_20261126.pdf' (1 page).
- step 2: **needs-human** - The Overall PDF has no text label 'Full Shutdown Timeframe'. Read from the render: Gantt axis first column 15 (week header 'Sun 15/02', next 'Sun 22/02'), Ramp Down marker at 15, Ramp Up marker between 25 and 26; axis runs on to 28. No 08 Feb anywhere. Consistent with 15-25 Feb but a person should confirm the axis reading counts as the timeframe.
- step 3: **needs-human** - The Overall PDF has no 'Day N' numbering (text layer and render show only date columns 15..28 with Ramp Down at 15). Cannot read Day 1 from this file; the first date column is 15 Feb, Ramp Down at 15 Feb.
- step 4: **pass** - Toast 'Edit Success / Edit Plan Successfully.' read; badge text 'Ramp Down/Up Date: 18 Feb 2026 09:00 - 20 Feb 2026 09:00'.
- step 5: **pass** - Header date 15 Feb 2026, DOM buttons: Export, Unfreeze, Save[disabled]. Export dialog (File Type PDF, Mode Only Current Date default, Timeframe Full Shutdown Timeframe). Downloaded 'QA S26 Ramp_QA ETM-8042 8836_DailyReport_Day1_20260215.pdf' (2 pages).
- step 6: **pass** - PDF page 2 axis 'Feb 2026' columns 15,16,...,25; Ramp Down marker at 15, Ramp Up marker at right edge after 25. First 15 Feb, last 25 Feb. 18-20 Feb not used as range. PDF title: 'Daily Report: QA ETM-8042 8836 15 Feb 2026 (Daily report cut-off: 22:00.)'.
- step 7: **pass** - File name '..._DailyReport_Day1_20260215.pdf' = Day1 / 20260215. No other 'Day N' label inside the PDF (only the title date 15 Feb 2026). Plan at that time was 18-20 Feb, but the file says Day1 for 15 Feb.
- step 8: **pass** - Arrow disabled at header date 14 Feb 2026. DOM: Export enabled (no disabled attribute), Unfreeze shown, Save[disabled]. Downloaded 'QA S26 Ramp_QA ETM-8042 8836_DailyReport_Day0_20260214.pdf'; title 'Daily Report: QA ETM-8042 8836 14 Feb 2026', no tasks, axis Jan-Mar 2026.
- step 9: **pass** - Toast 'Edit Success' read; badge 'Ramp Down/Up Date: 15 Feb 2026 09:00 - 25 Feb 2026 18:00'.

PDFs: Overall_20261126.pdf, DailyReport_Day1_20260215.pdf, DailyReport_Day0_20260214.pdf. Plan restored to 15 Feb 2026 09:00 - 25 Feb 2026 18:00.
Steps 2 and 3 need a person: the Overall PDF has no Full Shutdown Timeframe label or Day numbering.
