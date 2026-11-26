# ETM-8521 live check (paste steps, Shutdown Logic Gantt table)

Facts seen on QA in this card's runs (read only, nothing saved except ETM-8752), 24-25 Nov 2026. Run folders in ep-etm-fe-qa/output/runs/*_ETM-8521.

| Test | Action | Fact | Source | Module |
|---|---|---|---|---|
| ETM-8736 | paste | A 5 x 2 Excel block (Description, Duration) anchors at the focused cell and replaces the range; a Start in the block can trigger M-SCHED and revert the whole block (run 151746, BA R3-5.2) | live 2026-11-25 | shutdown-logic.md |
| ETM-8737 | paste | Ctrl+click copy of two separate cells puts `A\t\n\t12` on the clipboard after ETM-10058; paste fills A and 12, the skipped Duration keeps its old value (run 192301) | live 2026-11-25 | shutdown-logic.md |
| ETM-8739 | paste | One copied value pasted into a multi-cell selection fills every selected cell (run 213405) | live 2026-11-24 | shutdown-logic.md |
| ETM-8740 | paste | A block longer than the grid stops at the last row; parent rows in the range keep their computed Duration (run 190145) | live 2026-11-25 | shutdown-logic.md |
| ETM-8741 | paste | Ctrl+V while a cell is in edit mode closes the editor and replaces the whole range (run 112349) | live 2026-11-25 | shutdown-logic.md |
| ETM-8743 | paste | Pasting Duration / Start / End moves the bars and dependency lines; B starts at or after A's end (gap allowed, BA R3-2) (run 150205) | live 2026-11-25 | shutdown-logic.md |
| ETM-8748 | paste | Pasted Manpower Resource changes POB / Man-hrs in the Edit modal and the histogram; may open "No Working Time Available" (R2-5) (run 185726) | live 2026-11-25 | shutdown-logic.md |
| ETM-8749 | paste | Duration and Manpower Resource are not adjacent: pasted as two blocks; Work Manpower = peak concurrent demand (run 190648) | live 2026-11-25 | shutdown-logic.md |
| ETM-8750 | paste | `ecm fitter` becomes `ECM Fitter[1]`, Working Location takes Master Data casing (run 185726) | live 2026-11-25 | shutdown-logic.md |
| ETM-8751 | paste | An over-long Description paste is cut, not rejected; the limit value is open (BA R2-8) (run 213405) | live 2026-11-24 | shutdown-logic.md |
| ETM-8752 | paste | Pasted values stay as draft until the page Save; Save persists them (run 213405) | live 2026-11-24 | shutdown-logic.md |
| ETM-8753 | paste | Working Location / Manpower / Remark are adjacent; a repeated Deck / type is kept once, Remark proceeds (run 192044) | live 2026-11-25 | shutdown-logic.md |
| ETM-8759 | paste | `[0]` / `[100]` / `[1.5]` become `[1]`; a repeated type is kept once; 6 resources shows `ECM Fitter[1],ECM Fitter2[1],+4` (run 192044) | live 2026-11-25 | shutdown-logic.md |
| ETM-8760 | paste | Equipment Number / Functional Location not in master data are rejected, valid cells proceed (run 213405) | live 2026-11-24 | shutdown-logic.md |
| ETM-8761 | paste | Paste of 99 into Duration of Work / Work Header / Platform rows leaves Duration, Start, End unchanged (read-only, BA R2-3) | live 2026-11-24 | shutdown-logic.md |
| ETM-8762 | paste | 100 x 2 block (Manpower + Remark) follows grid rows incl. parent rows; `[0]` becomes `[1]` (run 192044) | live 2026-11-25 | shutdown-logic.md |
| ETM-8763 | paste | A Predecessor paste that makes a cycle shows M-DEP-CYCLE pop-up, cell stays "-", Save enabled (run 150205) | live 2026-11-25 | shutdown-logic.md |
| ETM-8764 | paste | Job Owner (no Edit permission): Ctrl+V leaves the Description unchanged, no message (run 192044) | live 2026-11-25 | shutdown-logic.md |
