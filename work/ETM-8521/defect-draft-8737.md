# Defect draft: [ETM-8521] Copy of non-adjacent cells loses the layout on paste (pasted into one column)

**Environment:** QA (https://stms-qa.apps.pttep.com), Turnaround Manager account, build of 24 Nov 2026. Shutdown Logic page (Gantt table), plan in `SHUTDOWN_LOGIC_*` of ep-etm-fe-qa/.env. Draft only, nothing saved.

When the user copies two cells that are not next to each other (Ctrl+click) in the Shutdown Logic Gantt table and pastes them, the app packs the copied values into one column: the second value goes into the Description of the second target row instead of its Duration. BA confirmed on 25 Nov 2026 (R3-1, answer "a") that the layout of the copied cells must be kept.

### Step to Reproduce
1. Log in to QA as Turnaround Manager and open the Shutdown Logic page of a plan. Collapse the Manpower Resource histogram.
2. Collapse the Details column group so Description and Duration are next to each other.
3. Click the Description cell of a Work Breakdown row (in the run: grid row 12), e.g. value `Pump overhaul A`.
4. Ctrl+click the Duration cell of the next Work Breakdown row (grid row 13), e.g. value `12`. Both cells show as selected; they are not next to each other.
5. Press Ctrl+C.
6. Click the Description cell of another Work Breakdown row lower in the table (target row 1 = grid row 19; target row 2 = grid row 20) and press Ctrl+V.

### Actual Result
- The clipboard holds the two values in one column: `Pump overhaul A` (line 1) and `12` (line 2) (read by the test script after Ctrl+C; no picture can show the clipboard).
- Target row 1 Description = `Pump overhaul A` (OK).
- `12` is pasted into the **Description of target row 2** (was `WB-101`). The Duration of target row 2 is not changed (shows `24.00`, expected `12.00`).

Pictures: work/ETM-8521/defect-8737-evidence/step06.png (two separate cells selected and copied), work/ETM-8521/defect-8737-evidence/step07.png (after Ctrl+V).

### Expected Result
The layout of the copied cells is kept: target row 1 Description = `Pump overhaul A`, target row 2 Duration = `12.00`, and the two skipped positions (target row 1 Duration, target row 2 Description) stay blank. (BA R3-1 "a", 25 Nov 2026; Xray Test ETM-8737 step 7.)

---
ภาษาไทย: copy 2 ช่องที่ไม่ติดกัน (Ctrl+click) แล้ว paste ระบบเอาค่าไปเรียงเป็นคอลัมน์เดียว ค่า 12 ไปลงช่อง Description ของแถวที่ 2 แทน Duration ซึ่ง BA ยืนยันว่าต้องคงตำแหน่งเดิม (R3-1 = a)
