# Evidence check defect-draft-8737 (ETM-8521, defect)

sourceHash: 5a879cdd91b9

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), Turnaround Manager account, build of 24 Nov 2026. Shutdown Logic page (Gantt table), plan in `SHUTDOWN_LOGIC_*` of ep-etm-fe-qa/.env. Draft only, nothing saved.

When the user copies two cells that are not next to each other (Ctrl+click) in the Shutdown Logic Gantt table and pastes them, the app packs the copied values into one column: the second value goes into the Description of the second target row instead of its Duration. BA confirmed on 25 Nov 2026 (R3-1, answer "a") that the layout of the copied cells must be kept.

## Steps
1. Log in to QA as Turnaround Manager and open the Shutdown Logic page of a plan. Collapse the Manpower Resource histogram.
2. Collapse the Details column group so Description and Duration are next to each other.
3. Click the Description cell of a Work Breakdown row (in the run: grid row 12), e.g. value `Pump overhaul A`.
4. Ctrl+click the Duration cell of the next Work Breakdown row (grid row 13), e.g. value `12`. Both cells show as selected; they are not next to each other.
5. Press Ctrl+C.
6. Click the Description cell of another Work Breakdown row lower in the table (target row 1 = grid row 19; target row 2 = grid row 20) and press Ctrl+V.

## Expected Result (as the draft states it: check it has a source)
The layout of the copied cells is kept: target row 1 Description = `Pump overhaul A`, target row 2 Duration = `12.00`, and the two skipped positions (target row 1 Duration, target row 2 Description) stay blank. (BA R3-1 "a", 25 Nov 2026; Xray Test ETM-8737 step 7.)

---
ภาษาไทย: copy 2 ช่องที่ไม่ติดกัน (Ctrl+click) แล้ว paste ระบบเอาค่าไปเรียงเป็นคอลัมน์เดียว ค่า 12 ไปลงช่อง Description ของแถวที่ 2 แทน Duration ซึ่ง BA ยืนยันว่าต้องคงตำแหน่งเดิม (R3-1 = a)

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8521/evidence-check/defect-draft-8737.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8521/evidence-check/defect-draft-8737.pics/pic-2.png
