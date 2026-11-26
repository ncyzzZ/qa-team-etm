# Defect draft: [ETM-8034] Removing the Platform row highlight in a duplicated plan also removes it from the original plan

**Environment:** QA (https://stms-qa.apps.pttep.com), Turnaround Manager account, build of 25 Nov 2026. Shutdown Event `NN TEST QA`, plan `S26 Row Colour` (Shutdown Logic). Run 2026-11-25_211646_ETM-8034, failed the same way on the retry.

After `Duplicate Plan`, the new plan shows the same row colours (OK). When the Platform row highlight is set to `No Color` in the new plan and saved, the Platform row of the **original** plan also loses its highlight. The original plan must stay unchanged.

### Step to Reproduce
1. Log in to QA as Turnaround Manager. Open the Shutdown Logic of plan `S26 Row Colour` and collapse the Manpower Resource histogram.
2. Double-click the No. cell of a Platform row, right-click it, `Highlight Row` -> `FFCCC7`. Also give a Work row the text colour `1677FF` and a Work Breakdown row `D9F7BE` + text `722ED1`. Click `Save` and confirm.
3. Go to the Planning tab of the event, open the three-dot menu of `S26 Row Colour` and choose `Duplicate Plan`. Type the Plan Name `QA Colour Copy` and click `Save`.
4. Wait until `Duplicate plan in progress.` is gone and open the Shutdown Logic of `QA Colour Copy`. The three rows show the same colours as in the original (OK).
5. In `QA Colour Copy`, double-click the No. cell of the same Platform row, right-click it, `Highlight Row` -> `No Color`. Click `Save` and confirm `Save Shutdown Logic and Update Worklist`.
6. Open the Shutdown Logic of the original plan `S26 Row Colour` again.

### Actual Result
- The Platform row of the original plan `S26 Row Colour` has the default background `F2F8FA`; the highlight `FFCCC7` saved in step 2 is gone.

Pictures: work/ETM-8034/defect-dup-plan-pics/1-original-colours-saved.png (original plan, colours saved (step 2).), work/ETM-8034/defect-dup-plan-pics/2-copy-has-colours.png (the copy shows the same colours (step 4).), work/ETM-8034/defect-dup-plan-pics/3-copy-platform-no-color.png (copy, Platform row set to No Color (step 5).), work/ETM-8034/defect-dup-plan-pics/4-copy-saved.png (copy saved (step 5).), work/ETM-8034/defect-dup-plan-pics/5-original-platform-lost-colour.png (original plan opened again, Platform row without highlight (step 6).).

### Expected Result
The original plan is not changed by edits in the duplicated plan: its Platform row still has the highlight `FFCCC7`. (Xray Test ETM-8867 step 8 "The original Platform row still has `FFCCC7`"; Duplicate copies Highlight and Text Color as its own copy, BA R3-3 / DEC-055, ETM-2696.)

Not checked yet: whether the Work and Work Breakdown colours of the original are also affected (the test checks only the Platform row at step 8).

---
ภาษาไทย: Duplicate Plan แล้วไปเอาสี Highlight ของแถว Platform ออก (No Color) ใน Plan ใหม่แล้ว Save ปรากฏว่าแถว Platform ของ Plan ต้นฉบับสีหายไปด้วย ซึ่ง Plan ต้นฉบับต้องไม่เปลี่ยน
