# Core - verified navigation, URLs, Worklist, Create Work, Work pages, Planning tab

Part of the ETM UI map (index: `docs/UI_Map_ETM.md`). Text below is moved verbatim from the old single file; keep the rule there: every fact has a check date, never guess, update here BEFORE writing test cases.

## Verified UI Navigation Map (ตรวจจากระบบจริงบน QA — 11 Aug 2026)

> ⚠️ **ห้ามเดา Navigation Path / ชื่อปุ่ม / ชื่อ tab เอง** — QA เคย execute แล้วเจอว่าไม่ตรงระบบจริง
> ถ้า path ไหนไม่มีในแผนที่ด้านล่าง ให้เข้าเว็บ QA ตรวจก่อน หรือถามผู้ใช้ ห้ามสมมติ

> 🔴 **อัปเดต 09 Sep 2026 — หน้า Event เหลือ 4 tab แล้ว**
>
> **ของจริงวันนี้**: `Details` · `Manpower Resource` · `Planning` · `Shutdown Organization`
>
> **ไม่มี tab `Worklist` และ `Shutdown Logic` แยกอีกแล้ว** — ทั้งคู่ย้ายไปเป็น sub-item ใต้ Plan Card
> ในแท็บ `Planning` · แผนผังด้านล่างที่เขียน 6 tab เป็นของเก่า (11 Aug 2026) เก็บไว้อ้างอิงเท่านั้น
>
> **Test case เก่าที่เขียน Navigation Path ผ่าน tab Worklist โดยตรงจะ execute ไม่ผ่าน**

### URL ที่ยืนยันแล้ว (09 Sep 2026) — ใช้ deep link ได้

```
/shutdown-event-list?years=2026,2027&keyword={ชื่อ event}
/shutdown-event-list/events/{eventId}?tab=planning
/shutdown-event-list/events/{eventId}/planning/{planId}/worklist/{worklistId}
/shutdown-event-list/events/{eventId}/planning/{planId}/worklist/{worklistId}/form
/shutdown-event-list/events/{eventId}/planning/{planId}/logics/{logicId}
```

- **filter ของตารางไปอยู่ใน URL ด้วย** เช่น `&wsStatus=Work Status/Reviewed,...`
- ⚠️ **ถ้าเดา path ผิด ระบบ redirect กลับหน้า Shutdown Event List เงียบ ๆ** ไม่ขึ้น 404
- คลิก sub-item ของ Plan Card → **เปิดแท็บใหม่**

### โครงหลัก (ของเก่า 11 Aug 2026 — tab ไม่ตรงกับของจริงแล้ว)
```
Shutdown Event List  (หน้าแรกหลัง login)
  └── [คลิกชื่อ Event]  →  หน้า Event
        Tabs: Details | Worklist | Manpower Resource | Shutdown Logic | Planning | Shutdown Organization
        └── Worklist tab  →  section "Worklist Item" (แสดงเป็น **การ์ด** ไม่ใช่ตาราง)
              - แต่ละการ์ด: ชื่อ + badge สถานะ (Initial/Collecting/Freeze) + badge Active + เมนู ⋮ + "Last update on ..."
              - ปุ่ม "Create Worklist" มุมขวาบนของ section
              - Empty state: "No worklist items available." + ปุ่ม "Create Worklist" กลางจอ
              └── [คลิกการ์ด worklist]  →  **เปิดแท็บใหม่** → หน้า Worklist detail (ตาราง Work)
```

### หน้า Worklist detail (ตาราง Work)
- Breadcrumb: `Shutdown Event List / [Event Name] / [Worklist Name]`
- หัวข้อ = ชื่อ worklist + badge สถานะ + badge Active
- ปุ่ม **"Create Work"** (สีน้ำเงิน มี + ไอคอน) มุมขวาบน → dropdown 2 ตัวเลือก: **"Manual Create"** / **"Import Excel"**
- Search box: "Search work number and job description" · ปุ่ม "Reset Table Filter"
- คอลัมน์: Work Number | Job Description | Equipment Number | Functional Location | Platform | Job Owner | Department | Manpower Resource | POB | Man-hrs. | Duration | Status | *(เลื่อนขวาเพื่อดูคอลัมน์เพิ่ม)*
- Empty state: "No results found" + "Total Results: 0"

#### Worklist table: how filter, search and delete really behave (for scripts and manual steps)
- Column filter panel: clear its search text first; with a search text typed, `Select All` acts only on the options still shown. To pick exact values: clear search, untick `Select All` (none ticked), then tick the labels (ETM-8049, 24 Nov 2026, live check by the lead).
- When no option of a column filter is ticked, the table is empty (same for every column, also Remark). Tick `Select All` or `Reset Table Filter` before a step that needs other rows (ETM-8391, 24 Nov 2026, user on QA).
- Close the open column filter panel (Apply) before typing in the table search box; typing while it is open loses the filter (ETM-8391, 24 Nov 2026).
- The table search box searches only after Enter (ETM-8049, 24 Nov 2026, live check).
- After search or filter, wait for the search request's response (or a changed `Total Results`) before reading rows; old rows stay on screen until it arrives (ETM-8391, 24 Nov 2026, hid defect ETM-9229).
- A deleted work stays in the grid with Status `D`; it does not disappear. A row off screen is not in the DOM (virtual scroll): scroll to it before acting, and fail if it is not found (ETM-8049, 24 Nov 2026).
- Working Location Deck tag: open the cell editor before removing a tag (ETM-8049, 24 Nov 2026).

### หน้า Create Work (Create Work > Manual Create)
- เป็น **หน้าเต็ม** ไม่ใช่ modal · URL ลงท้าย `/form` · หัวข้อ "Create Work"
- Section **"General Information"**: `*Work Header` (dropdown) · `*Priority` (dropdown) · `*Job Owner` · `Department` (auto/disabled) · `Accommodation` (default LQ) · `Hot Bed` (default No) · `Remark` (0/200) · `Specific Requirement` (checkbox 15 ตัว)
- Section **"Work Breakdown"**: `*Work Breakdown Type` (default "Single Task (Inherit from Work)") · `*Manpower Resource` (0/5) + ปุ่ม "Setting Resource" · `*POB` · `*Duration` · `*Man-hrs.` · `*D/N Shift` (default Day)
- ปุ่มล่าง: **"Back"** (ซ้าย) / **"Save"** (ขวา, disabled จนกรอกครบ)

### Priority dropdown (ยืนยันจากระบบจริง)
- 5 ตัวเลือก เรียงบนลงล่าง: **P1 · P2 · P3 · Pre SD · Post SD**
- สะกด **มีเว้นวรรค**: "Pre SD" / "Post SD" (ไม่ใช่ PreSD/PostSD ตามที่การ์ด Jira เขียน)
- **default = P2** (ไม่ใช่ค่าว่าง)
- ในช่องมีปุ่ม **× (clear)** → ใช้ล้างค่าให้เป็นว่างได้ ถ้าจะเทส required ต้องกด × ไม่ใช่ "เว้นว่างไว้"

### หน้า Work ทั้ง 4 หน้า (ตรวจจากระบบจริง — 27 Aug 2026)

**เมนู ⋮ ท้ายแถวในตาราง Worklist** มี 4 ตัวเลือกเรียงตามนี้:
`View Work Details` · `Edit Work Details` · `Duplicate Work` · `Delete Work`

| เข้าจาก | ชื่อหน้าที่แสดงจริง | URL ลงท้าย |
|---|---|---|
| `Create Work` → `Manual Create` | **Create Work** | `/form` |
| `Duplicate Work` | **Create Work** ⚠️ (ไม่ใช่ "Duplicate Work") | `/form?...&mode=duplicate&workId={id}` |
| `Edit Work Details` | **Edit Work Details** | `/works/{id}/form` |
| `View Work Details` → `Edit Breakdown` | **Edit Work Breakdown** | `/works/{id}/form-breakdown` |

- **Create Work** (3 section): `General Information` → `Work Breakdown` → `Work Details` (มีปุ่ม `⊕ Add Work` + ตาราง `* Work Type / * Work Number / * Job Description / * Platform / * Working Location (Deck) / (X) / (Y) / Functional Location ...`)
- **Edit Work Details**: **ไม่มี** section Work Breakdown และไม่มีตาราง Work Details — มีแค่ field grid + `Specific Requirement` + `Back` / `Save`
- **View Work Details** (read-only): header = `[Equipment Number] : [Job Description]` · มี dropdown สถานะ 2 ตัว + `⋮` มุมขวาบน · section `Work Details` (ปุ่ม `✎ Edit Work Details`) · section `Work Breakdown` (ปุ่ม `✎ Edit Breakdown`) + ตาราง `Task Description / Priority / Working Location (Deck) / (X) / (Y) / Manpower Resource / POB / Duration / Man-hrs. / D/N Shift`
- **Edit Work Breakdown**: ปุ่มบนหัวหน้า `⊕ Add Breakdown Task` · `⊕ Add from Typical Work Breakdown` · ไอคอน `ⓘ` · ตารางคอลัมน์ `* Task Description / * Priority / * Working Location (Deck) / (X) / (Y) / * Manpower Resource (chip + ปุ่ม Setting Resource ต่อแถว) / * POB ...` · `Back` / `Save`

**สไตล์ tooltip ของไอคอน ⓘ ที่มีอยู่แล้ว** (ใช้เป็นตัวเทียบของ ETM-5297): การ์ดพื้นขาว overlay ขึ้นมา ขึ้นต้นด้วยบรรทัดหัวข้อ เช่น `Work Breakdown Type List:` แล้วตามด้วยรายการที่ขึ้นต้นด้วย `- ` ทีละบรรทัด

**ไอคอน ⓘ ที่มีอยู่แล้วบนระบบ**: `Work Breakdown Type ⓘ` (หน้า Create Work) · `ⓘ` มุมขวาบนหน้า Edit Work Breakdown · `Capacity ⓘ` (ตาราง Manpower Resource หน้า Shutdown Logic)

### Planning tab (ยืนยัน 27 Aug 2026)
- URL ใช้ query param: `/shutdown-event-list/events/{eventId}?tab=planning`
- หัวข้อ section = `Planning` · ปุ่ม `⊕ Create Plan` มุมขวาบน
- Plan Card: หัวการ์ดเขียวเมื่อ Active / น้ำเงินเข้มเมื่อ Inactive · toggle + label `Active`/`Inactive` + `⋮` + chevron
- sub-item 3 แถว: `Worklist` (+ badge สถานะ) · `Shutdown Logic` · `Daily Report` — แต่ละแถวมี `Last update on DD Mon YYYY` + toggle + `⋮`
- คลิกแถว Worklist → เปิด**แท็บใหม่** → header `Worklist: [Plan Name]` + badge สถานะ · breadcrumb `Shutdown Event List / [Event] / Worklist: [Plan Name]`
- ตาราง Worklist มีปุ่ม export (ไอคอน) อยู่ซ้ายมือของปุ่ม `Create Work`

### Create Worklist modal
- Title "Create Worklist" · `*Worklist Name` (0/50) · `Worklist Status` (default Initial) · `Active Status` (toggle, default Inactive) · `Description` (0/200) · ปุ่ม "Cancel" / "Save"

---
