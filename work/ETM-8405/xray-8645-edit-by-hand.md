# ETM-8645: DONE 2026-11-24 by API on the 4th try (Xray had a delay after Reopen). Kept as a record of the change.

The Test is **Reopened** now. After the edit, close it again (Close Issue, Resolution Done).
Old text: `xray-steps-before-2026-11-24.json`. Step count and order do not change, so the evidence pictures stay on their steps.

| Step | Field | New text |
|---|---|---|
| 13 | Expected Result | The values `5.0` and `10.0` are on the clipboard. |
| 14 | Expected Result | The Plan cells of week 01 Jun and 08 Jun 2026 show `5.0` and `10.0` (they changed from `1.0` and `2.0`). |
| 15 | Expected Result | It shows `35.0` (5.0 + 10.0 + 20.0). |
| 16 | Expected Result | The Actual cells still show `5.0` and `10.0` and the Plan cells still show `5.0`, `10.0` and `20.0`. |
| 18 | Expected Result | The modal closes, the week 08 Jun 2026 cell is blank and the Plan (%) field shows `25.0` (5.0 + 20.0). |
| 20 | Expected Result | The modal closes, the week 15 Jun 2026 cell is blank and the Plan (%) field shows `5.0`. |

Description (Precondition), last sentence:
- old: `` `Piping Inspection` has Actual (%) saved: week 01 Jun 2026 `7.5`, week 08 Jun 2026 `15.5`. ``
- new: `` `Piping Inspection` has Actual (%) saved: week 01 Jun 2026 `5.0`, week 08 Jun 2026 `10.0`. ``
