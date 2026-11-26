# ETM-8781 (TC-008): Xray steps 9-12 to match the app (draft, NOT written yet)

Reason: user verdict 25 Nov 2026 "1=tc". FE build of 25 Nov evening: with a search text the row is "(Select All Search Results)", and Apply is disabled while nothing is ticked (every column filter). The old steps 9-12 told the tester to Apply with nothing ticked, which is no longer possible.
Backup before the write: `xray-steps-8781-before-<date>.json` (to be made by the logger).
Steps 1-8 unchanged.

| # | Action (new) | Expected Result (new) |
|---|---|---|
| 9 | In the Job Description filter (search text from step 8 still typed), click `(Select All Search Results)`. | Write down as reference A: which listed options are checked, and whether `Apply` is enabled. |
| 10 | Click `(Select All Search Results)` again, then click `Apply` if it is enabled. | Write down as reference B: which listed options are checked, whether `Apply` is enabled, and which rows are shown. |
| 11 | Open the Deck filter, type `deck` in the search box and click `(Select All Search Results)`. | The five listed options (`Main Deck`, `Cellar Deck`, `Deck 2`, `Deck 10`, `Helideck`) are checked or unchecked the same way as reference A, and `Apply` is enabled or disabled the same way as reference A. |
| 12 | Click `(Select All Search Results)` again and click `Apply`. | The listed options are checked the same way as reference B, `Apply` is enabled, and the table shows the works whose Deck holds one of the checked values (`WK-1`, `WK-2`, `WK-3` of Plan "QA ETM-8049 Sort"). |

Note: whether the hidden option `Zone B` (not in the search result) stays checked after step 11 is not part of the Expected Result any more (user chose tc). If the BA later says it must stay checked, that is a separate question.
