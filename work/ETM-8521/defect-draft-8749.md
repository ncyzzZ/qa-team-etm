# Defect draft: [ETM-8521] Work row Manpower Resource is not the sum of its Work Breakdown rows

**Environment:** QA (https://stms-qa.apps.pttep.com), Turnaround Manager account, build of 25 Nov 2026. Shutdown Logic page (Gantt table), plan in `SHUTDOWN_LOGIC_*` of ep-etm-fe-qa/.env. Draft only, nothing saved.

After a paste into the Manpower Resource cells of Work Breakdown (Lv4) rows, the Lv3 Work row does not show the sum of its rows' Manpower Resource per type. Story ETM-8521 AC 1.3 says the roll-up to the Work row is "Start / End span and Manpower sum" (BA answer R2-2, 24 Nov 2026).

### Step to Reproduce
1. Log in to QA as Turnaround Manager and open the Shutdown Logic page of a plan. Collapse the Manpower Resource histogram.
2. Pick a Work (Lv3) row with 5 Work Breakdown (Lv4) rows. Write down the Manpower Resource of each Lv4 row and of the Work row.
3. In Excel copy `16` / `20` and paste it at the Duration cell of the first Lv4 row.
4. In Excel copy `ECM Fitter[2]` / `ECM Fitter[3]` and paste it at the Manpower Resource cell of the first Lv4 row.
5. Look at the Manpower Resource cell of the Work row.

### Actual Result
- The two Lv4 rows show Duration `16` / `20` and Manpower Resource `ECM Fitter[2]` / `ECM Fitter[3]`; Edit modal POB 2 / 3, Man-hrs 32 / 60 (OK).
- The 5 Lv4 rows of the Work hold ECM Fitter 13 and DRT 2 in total.
- The Work row shows **`ECM Fitter[4]`, `DRT[2]`**.

Pictures: work/ETM-8521/defect-8749-evidence/step01_before.png (before), work/ETM-8521/defect-8749-evidence/step02_pasted.png (after the paste), work/ETM-8521/defect-8749-evidence/step03_work_row.png (Work row after the paste).

### Expected Result
The Work row shows the Manpower sum of its Work Breakdown rows per type: **`ECM Fitter[13]`, `DRT[2]`** (Story ETM-8521 AC 1.3, BA R2-2; Xray Test ETM-8749 step 3).

---
ภาษาไทย: หลัง paste Manpower ลงแถว Lv4 แถว Work แสดง ECM Fitter[4] แต่ผลรวมของ 5 แถวลูกคือ ECM Fitter[13] ส่วน AC 1.3 และ BA R2-2 บอกว่าแถว Work ต้องเป็นผลรวม (sum)
