# ETM-8391 - Defect drafts (NOT logged)

Status: drafts only. Nothing is created in Jira or Xray. Each one needs the user's decision ("script bug / wrong test / real app bug") and a go-ahead in the chat before it is logged (log-defect-jira-etm gate).

Common facts (all three)
- Story: ETM-8391 [Improvement] View Worklist Table - Remark Column Filter. Environment: QA (`stms-qa.apps.pttep.com`), Story status "Deployed to QA". Found after the dev reported the fix deployed (2026-11-23).
- Work type: **Defect** (QA). Found-in Environment: QA (`16336`). Summary prefix `[ETM-8391]`. Labels: FE + UI is the default for a UI issue; these three may be BE (the list comes from `/works/filters`), so the label and assignee depend on the dev answer ([FE] ETM-8554/8555 or [BE] ETM-8553).
- Test data: worklist `S26 Remark Set` (21 works W01-W19, W21, W22; Job Description of each work = its id), opened from Planning tab > Plan Card > Worklist Item. Login: Turnaround Manager.
- Xray: Test Execution ETM-8874 (16 Tests ETM-8648..8663). Step-level linking needs the exact Test and step; see each draft.
- Evidence: the run folder `ep-etm-fe-qa/output/runs/2026-11-23_144454_ETM-8391/` (error text and page snapshot of each failed test; screenshot `test-failed-1.png` is there but was not read). Images must be embedded in the Description by the user or through the browser (needs the user's OK to open Chrome).
- Worklog for the `[QA]` sub-task (proposal): 20m each (test data was already set up; several runs and a page-snapshot read to confirm).
- Original Estimate / Remaining estimate: none (rule of the skill).

---

## Defect 1 - Remark filter options are not sorted as the Story requires

**Verdict needed from the user:** real app bug / script bug. Evidence is strong: the same order in 6 runs, and the order is read from the page, not guessed.

**Summary:** `[ETM-8391] Remark filter options are sorted as plain text, not with localeCompare numeric order (Note 10 before Note 2)`

### English (Jira Description, Markdown)

On QA, the Remark column filter of the View Worklist table lists its options in plain character order, not in the order required by the Story. `Note 10` appears before `Note 2`, and symbol-led values appear in a different order than the system-wide alphabetical sort.

### Step to Reproduce
1. Log in as Turnaround Manager on QA.
2. Open the Planning tab of the Shutdown Event, click the Worklist Item of a Plan Card whose worklist has works with these Remarks: `Note 1`, `Note 2`, `Note 10`, `#Urgent`, `(Hold)`, `- a`, `--`, `Test`, and the Thai text `ซ่อมด่วน` (QA worklist `S26 Remark Set`).
3. Click the filter icon of the Remark column and read the list under `Select All`.

### Actual Result
The options are listed in this order (read from the page): `-`, ` - `, ` Test`, `#Urgent`, `(Hold)`, `- `, `- a`, `--`, `100% ...`, `Check valve 🔧`, `Long remark ...`, `Note 1`, `Note 10`, `Note 2`, `Test`, `Test `, `Valve A, B`, `ซ่อมด่วน`.
`Note 10` comes before `Note 2`. `#Urgent` comes before `(Hold)` and before `- `, which is the plain character-code order.

### Expected Result
After `-`, the options follow `a.localeCompare(b, 'en', { numeric: true })` (Story AC 2.3, BA answer 2026-11-17): `Note 1`, `Note 2`, `Note 10`; symbols first, then digits, then English letters (not case sensitive, lowercase first), then Thai.

### ภาษาไทย
ตัวกรองคอลัมน์ Remark บน QA เรียงตัวเลือกตามรหัสตัวอักษรธรรมดา ไม่ใช่ตามกฎของ Story (AC 2.3): `Note 10` ขึ้นก่อน `Note 2` และสัญลักษณ์เรียงไม่ตรงกับการเรียงมาตรฐานของระบบ
- วิธีทำซ้ำ: เปิด Worklist ผ่าน Plan Card กดไอคอน filter ของคอลัมน์ Remark ดูรายการใต้ Select All
- ผลที่ได้: `Note 1`, `Note 10`, `Note 2` และ `#Urgent` ก่อน `(Hold)` ก่อน `- `
- ผลที่คาด: `Note 1`, `Note 2`, `Note 10` ตามสูตร `localeCompare('en', { numeric: true })`

Xray: Test ETM-8650 (TC-003, option list order). The exact step number is checked against `xray_get_test_steps` when logging.
Related: the same rule was reported once for the Job Description filter as open item C-10 (2026-11-10).

---

## Defect 2 - Selecting Blank (`-`) is not kept (address shows `null`, lost after reload and re-open)

**Verdict needed from the user:** real app bug / script bug / wrong test. Evidence is consistent across 3 tests (ETM-8662, ETM-8655, ETM-8656) but I did not compare with another column that has a blank value, and the expected behaviour (filters kept in the page address and restored) is an assumption taken from the module doc and other columns, not written in the Story. Confirm with BA/dev before logging.

**Summary:** `[ETM-8391] Remark filter: the Blank (-) selection is not kept in the page address and is lost after reload`

### English (Jira Description, Markdown)

When the user filters the Remark column by the Blank option `-`, the filter works at first, but the selection is not saved: the page address shows `wsRemarks=null`, a reload shows no works, and the filter panel no longer shows `-` as selected.

### Step to Reproduce
1. Log in as Turnaround Manager on QA and open a worklist where some works have an empty Remark (QA worklist `S26 Remark Set`: W11 empty, W12 spaces only, W13 `-`).
2. Open the Remark filter, untick `Select All`, tick `-`, click `Apply`. The table shows the Blank works (W11, W12, W13).
3. Look at the page address.
4. Reload the page.
5. Open the Remark filter again.

### Actual Result
- Step 3: the address fragment is `#wsRemarks=null`.
- Step 4: the table shows `No results found` (Total Results 0); `Reset Table Filter` is disabled.
- Step 5: `-` is not ticked.
- While the Blank filter is applied (step 2), `Reset Table Filter` is disabled.

### Expected Result
The Blank selection is kept like the selection of any other option: it is written in the page address, a reload shows the same Blank works, the filter panel shows `-` ticked, and `Reset Table Filter` is enabled while a filter is on.
Note: persistence of table filters in the page address is taken from the module behaviour of the other columns (assumption, to confirm with BA/dev; the Story only says that the Remark filter works like the other columns).

### ภาษาไทย
เมื่อกรองคอลัมน์ Remark ด้วยตัวเลือก Blank (`-`) ตัวกรองทำงานได้ แต่ไม่ถูกเก็บ: ที่อยู่หน้าเป็น `wsRemarks=null`, reload แล้วตารางไม่มีงาน (Total 0), เปิด filter ใหม่ `-` ไม่ได้ติ๊ก และปุ่ม Reset Table Filter กดไม่ได้ขณะที่ตัวกรองยังทำงาน
- วิธีทำซ้ำ: เปิด worklist ที่มีงาน Remark ว่าง ยกเลิก Select All ติ๊ก `-` กด Apply ดูที่อยู่หน้า reload เปิด filter ใหม่
- ผลที่คาด: เก็บค่า Blank เหมือนตัวเลือกอื่น reload แล้วเห็นงาน Blank เดิม และ `-` ติ๊กอยู่ (ข้อสันนิษฐานเรื่องเก็บใน URL ต้องยืนยันกับ BA/dev)

Xray: Tests ETM-8662 (reload) and ETM-8655 (several options and `-`); ETM-8656 (Reset button) for supporting evidence. Exact steps checked against `xray_get_test_steps` when logging.

---

## Defect 3 - The lowercase Remark `test` is missing from the options (needs a re-check before logging)

**Verdict needed from the user:** real app bug / script bug. Evidence (updated 2026-11-23): the user checked by hand on QA. The table shows W02 with Remark `test` (lowercase). Typing `test` in the Search box of the Remark filter lists only 3 options, all with a capital T (` Test`, `Test`, `Test `), and no `test`. The script's full option list had the same 18 values. The values that differ by spaces are kept separate but the one that differs by letter case is not, which is what AC 2.1 says must not happen. Ready to log once the user decides. Evidence images: the user's screenshot of the filter with `test` typed in Search, and of the table row W02.

**Summary:** `[ETM-8391] Remark filter does not list the lowercase value "test" separately from "Test"`

### English (Jira Description, Markdown)

The Remark filter should list values that differ in letter case as separate options (Story AC 2.1). On QA the work W02 has the Remark `test`, but the option list has `Test`, ` Test` (leading space) and `Test ` (trailing space) and no `test`.

### Step to Reproduce
1. Log in as Turnaround Manager on QA and open the worklist `S26 Remark Set` (W01 `Test`, W02 `test`, W03 ` Test`, W04 `Test `).
2. Open the Remark filter and read the options that contain the word Test.

### Actual Result
Options found: ` Test`, `Test`, `Test `. There is no `test` option; W02 cannot be selected by its Remark.

### Expected Result
Four separate options: `test`, `Test`, ` Test`, `Test ` (AC 2.1: values that differ in letter case or in leading/trailing spaces are separate options).

### ภาษาไทย
ตัวกรอง Remark ควรแยกตัวเลือกที่ต่างกันที่ตัวพิมพ์ (AC 2.1) แต่บน QA งาน W02 มี Remark `test` ในรายการมีแค่ ` Test`, `Test`, `Test ` ไม่มี `test` จึงเลือกงาน W02 ด้วย Remark ไม่ได้

Xray: Test ETM-8649 (case and space variants) or ETM-8659. Exact step checked against `xray_get_test_steps` when logging.
Manual check done by the user on 2026-11-23: confirmed (3 options, no lowercase `test`).

---

## Defect 4 - Blank page after returning to the worklist through the breadcrumb (reported by the user, found by hand)

**Status:** draft only, not logged (the user has not said to log it yet). Reported by the user on 2026-11-23 while testing Defect 2 by hand. Steps come from the user's words; the two items marked (assumption) were not given in detail and must be confirmed before logging. Possibly related to ETM-8897 (the address shows `wsRemarks=null`), cause not known.

**Summary:** `[ETM-8391] Worklist page shows nothing after returning from the edit page by the breadcrumb with the Remark Blank (-) filter applied`

### English (Jira Description, Markdown)

After filtering the Remark column by the Blank option `-`, opening the edit page and returning to the worklist through the breadcrumb shows an empty page: no table, no filter bar.

### Step to Reproduce
1. Log in as Turnaround Manager on QA and open the worklist `S26 Remark Set`.
2. Open the Remark filter, untick `Select All`, tick `-`, click `Apply`.
3. Open the edit page of the worklist (assumption: `Edit Work Details` of a work from the row menu; to confirm).
4. Click the worklist link in the breadcrumb at the top of the page (assumption: `Worklist: S26 Remark Set`; to confirm).

### Actual Result
The page shows nothing at all.

### Expected Result
The worklist page opens again with the table shown (and the Remark filter state kept or cleared, but never an empty page).

### ภาษาไทย
หลังกรองคอลัมน์ Remark ด้วย Blank (`-`) แล้วเข้าหน้า edit และกลับมาด้วย breadcrumb หน้าจอไม่แสดงอะไรเลย
- ผลที่คาด: กลับมาที่หน้า worklist และเห็นตาราง

Xray: no Test step covers this flow. Link to ETM-8662 (reload with Blank) as the closest, or none; to decide when logging.

---

## Not drafted (still unclear, may be script)

- ETM-8658: W06 above W05 after sorting the Remark column. This may follow from Defect 1 (`Note 2` vs `Note 1` order). Decide after Defect 1.
- ETM-8654 (the list does not move when scrolled) is probably a script problem.
- ETM-8648 (user without View Worklist permission): needs a test login, not run.
