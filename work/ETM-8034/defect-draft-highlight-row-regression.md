# Defect draft (not logged): ETM-8034 row menu shows "Highlight Cell" instead of "Highlight Row" after a whole row is selected

Status: NOT LOGGED - duplicate of ETM-10077 (already open, In Progress, created 25 Nov 17:00). Kept for reference only.
Related finding: F-35 (rule: Highlight Row after double-click No. + right-click; Highlight Cell for one cell).

## Fields (resolved at log time)
- Work type: Defect (Found-in Environment: QA = 16336)
- Summary: `[ETM-8034] Right-click on a fully selected row shows "Highlight Cell" instead of "Highlight Row" (regression)`
- Labels: FE, UI. Epic, Sprint: copy from ETM-8034. Link: Relates to ETM-8034.
- Assignee: assignee of the [FE] sub-task of ETM-8034.
- Xray: Test Execution ETM-8875, Test ETM-8854 step 2 ("First option is Highlight Row").
- [QA] sub-task: `[QA] Fix and verify Highlight Row menu on a selected row`, worklog 20m (5 failed tests triaged + live check + source).

## Pictures
1. `work/ETM-8034/defect-highlight-row-pics/1-before-1326-whole-row-menu-highlight-row.png` (25 Nov 13:26, older build: the same gesture gave "Highlight Row")
2. `work/ETM-8034/defect-highlight-row-pics/2-after-1856-whole-row-menu-highlight-cell.png` (25 Nov 18:56, row 41 fully selected, menu shows "Highlight Cell")

---

## English (Jira Description)

On the Shutdown Logic page (Gantt table), when a whole row is selected (double-click on its No. cell) and the user right-clicks it, the context menu shows **Highlight Cell** instead of **Highlight Row**. It happens on every row and every level. It started with the FE build of 25 Nov 2026 (about 14:55); on the build before it, the same steps showed Highlight Row. Because of this a row colour can no longer be applied to the whole row from the menu.

**Environment:** QA, Turnaround Manager, Shutdown Logic of plan "S26 Row Colour" (event NN TEST QA), Chrome. Seen 25 Nov 2026 18:56 and 19:18.

### Step to Reproduce
1. Log in as Turnaround Manager and open the Shutdown Logic page of a plan.
2. Double-click the No. cell of a Work row (the whole row turns blue = selected).
3. Right-click the selected row.
4. Read the first option of the context menu.

### Actual Result
The first option is **Highlight Cell** (followed by Change Text Color, Delete Work). Highlight Row is not in the menu.

### Expected Result
The first option is **Highlight Row**, as before this build (ETM-8034 AC 2 and the confirmed behaviour: a whole selected row gives Highlight Row; one selected cell gives Highlight Cell). Xray ETM-8854 step 2: "First option is Highlight Row".

---

## Thai (for the team)

หน้า Shutdown Logic: ดับเบิลคลิกช่อง No. ให้เลือกทั้งแถวแล้วคลิกขวา เมนูขึ้น **Highlight Cell** แทน **Highlight Row** ทุกแถว ทุก level เริ่มเป็นตั้งแต่ build FE วันที่ 25/11 ราว 14:55 (ก่อนหน้านั้นยังขึ้น Highlight Row) ที่ถูกต้องคือเมนูแรกต้องเป็น Highlight Row ตาม AC 2
