# ETM-8042 / ETM-8838 manual run (QA, turnaroundManager) - awaiting confirmation
Run 2026-11-25. Pictures: step-N.png (full viewport, red frame). PDF: sl.pdf (Shutdown Logic of Plan A, Overall, Full Shutdown Timeframe). step-2/3.png = render of that PDF page.

| # | Verdict | What was read |
|---|---|---|
| 1 | pass | Export panel, PDF File chosen, Export downloaded `QA S26 Ramp_Plan Scenario A_Overall_20261125.pdf` (saved as sl.pdf). |
| 2 | pass | Timeline starts at 15 Feb (Ramp Down badge at column 15) and the Ramp Up badge sits at 25 Feb (line at the end of column 25, 18:00). No 08 Feb. Note: the grid is padded to 28 Feb (weeks `Sun 15/02`, `Sun 22/02`), so the last column is 28, not 25; the Ramp Up marker is at 25. Please judge if this padding is acceptable. Looked at the picture. |
| 3 | pass | First day column is 15 (under "Sun 15/02"), Ramp Down at the start of it; no 08 Feb. Same page as step 2 (step-3.png is a copy). |
| 4 | pass | Edit Plan of Plan Scenario A set to 18 Feb 2026 09:00 - 20 Feb 2026 09:00, Save: toast `Edit Success / Edit Plan Successfully.` read, badge `Ramp Down/Up Date: 18 Feb 2026 09:00 - 20 Feb 2026 09:00`. |
| 5 | needs-human | Daily Report of Plan A opens on 14 Feb 2026; button reads `Freeze` (not frozen) and `Export` is disabled. No day frozen (14 Feb is the first day and the page opens on the first unfrozen day). Not frozen by me. Step-5 picture = Export (disabled) and Freeze. |
| 6 | needs-human | Same reason, no PDF. Picture = same page. |
| 7 | needs-human | Same reason. |
| 8 | needs-human | Same reason. |
| 9 | pass | Plan Scenario A edited back to 15 Feb 2026 09:00 - 25 Feb 2026 18:00, toast `Edit Success`, badge confirmed `15 Feb 2026 09:00 - 25 Feb 2026 18:00`. (Plan Scenario F has the same text, so the step-9 picture frames two badges.) |

Notes: steps 5-8 pictures are of the Daily Report page (not a PDF). The Daily Report "Last update 20 Nov 2026" snapshot was not touched. Plan A is back to its original dates. No other Plan, Active toggle, Optimize or delete used. qa-check printed errors for the other two steps files (8836, 8851) only; the 8838 file had only a warning (not in tests.md).
