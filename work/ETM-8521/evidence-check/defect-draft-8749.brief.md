# Evidence check defect-draft-8749 (ETM-8521, defect)

sourceHash: 481093e60d5d

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), Turnaround Manager account, build of 25 Nov 2026. Shutdown Logic page (Gantt table), plan in `SHUTDOWN_LOGIC_*` of ep-etm-fe-qa/.env. Draft only, nothing saved.

After a paste into the Manpower Resource cells of Work Breakdown (Lv4) rows, the Lv3 Work row does not show the sum of its rows' Manpower Resource per type. Story ETM-8521 AC 1.3 says the roll-up to the Work row is "Start / End span and Manpower sum" (BA answer R2-2, 24 Nov 2026).

## Steps
1. Log in to QA as Turnaround Manager and open the Shutdown Logic page of a plan. Collapse the Manpower Resource histogram.
2. Pick a Work (Lv3) row with 5 Work Breakdown (Lv4) rows. Write down the Manpower Resource of each Lv4 row and of the Work row.
3. In Excel copy `16` / `20` and paste it at the Duration cell of the first Lv4 row.
4. In Excel copy `ECM Fitter[2]` / `ECM Fitter[3]` and paste it at the Manpower Resource cell of the first Lv4 row.
5. Look at the Manpower Resource cell of the Work row.

## Expected Result (as the draft states it: check it has a source)
The Work row shows the Manpower sum of its Work Breakdown rows per type: **`ECM Fitter[13]`, `DRT[2]`** (Story ETM-8521 AC 1.3, BA R2-2; Xray Test ETM-8749 step 3).

---
ภาษาไทย: หลัง paste Manpower ลงแถว Lv4 แถว Work แสดง ECM Fitter[4] แต่ผลรวมของ 5 แถวลูกคือ ECM Fitter[13] ส่วน AC 1.3 และ BA R2-2 บอกว่าแถว Work ต้องเป็นผลรวม (sum)

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8521/evidence-check/defect-draft-8749.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8521/evidence-check/defect-draft-8749.pics/pic-2.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8521/evidence-check/defect-draft-8749.pics/pic-3.png
