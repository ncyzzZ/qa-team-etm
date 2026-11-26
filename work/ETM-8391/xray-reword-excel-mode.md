# ETM-8391 - Xray rewording for the Excel-mode filter (WRITTEN 26 Nov 2026 10:00, user yes in chat "ได้ทำเลย"; 8655 step 3/22 written without the table clause, 8655 step 16/22 action now "Look at the Apply button")

Decision: QA lead, 26 Nov 2026, answer A (by design; stms-fe commit 6fba9abf `excelMode: 'mac'`). Backup of the current text: `xray-steps-before-8649-8655-8656-2026-11-26.json`. Writing needs the user's yes in this chat.

| Test | Step | Action (new) | Expected (new) |
|---|---|---|---|
| ETM-8656 | 6 | Click `Apply` while `Note` is still in the search box. | Only W05, W06 and W07 are shown. |
| ETM-8656 | 7 | Open the filter on the `Remark` column again. | Only `Note 1`, `Note 2` and `Note 10` are ticked. (A selection made inside a search is not kept if the search is cleared before Apply: by design.) |
| ETM-8655 | 3 | Untick `Note 2`. | No option is ticked and `Apply` is disabled, the same as the Job Description filter with nothing ticked; the table still shows only W06. |
| ETM-8655 | 11 | Untick `Select All` in the `Job Description` filter. | Every option is unticked and `Apply` is disabled (Job Description reference). |
| ETM-8655 | 16 | Look at the `Apply` button and the table. | Same as the Job Description reference: `Apply` is disabled and the table keeps the last applied filter (all works except W05). |
| ETM-8655 | 18 | Tick one option in the `Job Description` filter and untick it again. | No option is ticked and `Apply` is disabled (single-untick reference). |
| ETM-8655 | 21 | Untick `Note 1`. | No option is ticked and `Apply` is disabled. |
| ETM-8655 | 22 | Look at the table. | Same as the single-untick reference: the table still shows only W05. |
| ETM-8649 | 12 | Untick `Note 1`. | No option is ticked and `Apply` is disabled, the same as the Job Description filter with nothing ticked. |
