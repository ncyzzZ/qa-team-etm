# UI Map — ETM (EP-Turnaround Management)

> **ไฟล์นี้คืออะไร**: บันทึกของจริงบนระบบ QA — Navigation Path · ชื่อ tab/ปุ่ม/เมนูตามตัวอักษรจริง · URL · ค่า default · max character · selector · จุดที่การ์ด Jira เขียนไม่ตรงกับของจริง
> **กฎการเขียน TC ไม่อยู่ในไฟล์นี้** — อยู่ใน `CLAUDE_v2.md`
> QA: https://stms-qa.apps.pttep.com

## วิธีดูแลไฟล์นี้

1. **ทุกข้อต้องมีวันที่ตรวจกำกับ** — ของที่ไม่มีวันที่ ถือว่าเชื่อไม่ได้
2. **ห้ามเดา** Navigation Path / ชื่อปุ่ม / ชื่อ tab — ถ้าไม่มีในไฟล์นี้ ให้เข้า QA ตรวจก่อน หรือถามผู้ใช้
3. **เจอหน้าใหม่ / ของเปลี่ยน → อัปเดตที่นี่ทันที** ก่อนเขียน TC (Workflow step 4 ของ `CLAUDE_v2.md`)
4. **ของเก่าที่ล้าสมัยแล้ว ไม่ต้องลบ** — ใส่ป้าย 🔴 ทับพร้อมวันที่ ให้รู้ว่าเคยเป็นอะไร เพราะ TC เก่าอ้างของเก่าอยู่
5. **แยกให้ชัดว่ามาจากไหน**: ระบบจริงบน QA / Figma / เอกสาร Validation / BA confirm — ไม่ผสมกัน

## สารบัญ

- System Architecture — hierarchy, roles, worklist, gantt engine, constraint, calendar, manpower
- Verified UI Navigation Map — URL, tab, โครงหน้า
- หน้า Worklist / Create Work / Work ทั้ง 4 หน้า
- Planning tab · Manpower Mob Plan (Sprint 21)
- Max Character · ข้อความ modal/toast ที่ยืนยันแล้ว
- ETM-5614 — AC ที่ขัดกับของจริง
- Selector สำหรับ Automation

---

## System Architecture

### Hierarchy
Level 1: Platform → Level 2: Work Header → Level 3: Work → Level 4: Breakdown Task

### Roles
- **Turnaround Manager**: Full access (edit, create, delete, change status)
- **Job Owner**: Limited access (view only in most cases; cannot change Work/Breakdown status, Copy to, or edit Constraint Date)

### Worklist
- **Worklist Status**: Initial / Collecting / Freeze
- **Active Status**: Active / Inactive — only 1 Worklist can be Active at a time
- **1 Worklist : 1 Shutdown Logic** (1:1 relationship)
- Shutdown Logic can only be Active if its Worklist is also Active

### Gantt Engine
- **Bryntum Gantt**: auto-repositions bars based on constraints and dependencies
- **Dependency Types**: FS (Finish-to-Start), SS, FF, SF
- **Dependency Priority**: Soft / Normal / Hard (Hard = bar cannot be dragged manually)
- **FCFS Rule**: First-Come, First-Served — existing saved constraints/dependencies take priority over new inputs

### Constraint Date (ETM-2616)
- Located in **Advanced tab** (last tab, after Successor) in all 3 Setting modals (Lv.2, Lv.3, Lv.4)
- Fields: Constraint Type (7 options + None) and Constraint Date (Date + Time; minutes: 00/15/30/45 only)
- Constraint Date field is disabled when Type = None; auto-clears when Type reverts to None

### Working Calendar (ETM-2698 / ETM-3059)
- Located in **Advanced tab**, but only visible for **Level 4 (Breakdown Task)** — other levels only see Constraint Date section
- 3 radio options: Resource Calendar / Custom Calendar / Manual Adjust
- **Resource Calendar**: uses shifts from assigned Manpower Resources; multi-select dropdown auto-populated
- **Custom Calendar**: weekly grid (7 days), time intervals, preset options (ETM-3059)

### Manpower Resource
- **Shutdown Logic page — bottom section**: Manpower Resource table with columns: Resource Name, Shift, Capacity + Histogram
  - Double-click Resource name to rename (uses Organic Crew name → auto-fills Shift + Capacity; new name → Default / 1); sorts A-Z immediately on lost focus / Enter
  - Double-click Shift → dropdown from Working Schedule
  - Double-click Capacity → edit number
  - Changes here do NOT affect master Manpower Resource tab data
  - Right-click → Add Resource (no effect on tasks) / Delete Resource (removes from linked tasks; if task had only that resource → cell turns red; bar loses resource label) / Edit name (propagates to linked tasks)
  - Yellow Capacity cell = capacity insufficient → tooltip shows required amount → Optimize will fail if not fixed
- **Edit Working Schedule** (master data): Manpower Resource tab → "Edit Working Schedule" button → Edit Working Schedule page

### Add/Remove Resource to a Task
1. **Worklist**: View Work Details → Edit Breakdown → Edit Work Breakdown page → Manpower Resource column or "Setting Resource" button (modal; Qty 1–99; can add new resource not in master)
2. **Shutdown Logic Gantt table**: Manpower Resource column (inline) or ≡ button → Breakdown Setting Modal → Manpower Resource tab
3. **Shutdown Logic Histogram**: right-click → Add / Delete Resource

---

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

### Planning tab — Sprint 21 (Manpower Mob Plan) · ยืนยัน 07 Sep 2026

> สถานะ ณ 07 Sep 2026: **ยังไม่ขึ้น QA** — ทุก Plan Card บน QA ยังมี sub-item แค่ 3 แถว
> (Worklist / Shutdown Logic / Daily Report) ข้อมูลด้านล่างมาจาก Figma + BA confirm

- Plan Card จะมี sub-item **4 แถว** เรียง: `Worklist` · `Shutdown Logic` · **`Manpower Mob Plan`** · `Daily Report`
  → Manpower Mob Plan แทรก**เหนือ** Daily Report ทำให้ Daily Report กลายเป็นแถวที่ 4
- **Equipment Mob Plan ไม่อยู่ใน Sprint 21** (Figma แสดงไว้เป็น future scope) — ถ้าเจอแถวนี้บน QA ให้ report
- เมนู `⋮` ของแถว Manpower Mob Plan มี **2 ตัวเลือก**: `View Manpower Mob Plan` · `Delete Manpower Mob Plan` (ไม่มี Edit)
- แถวที่ยังไม่สร้างจะมีปุ่ม `Create` ด้านขวา (pattern เดียวกับ Daily Report)

### หน้า Manpower Mob Plan dashboard — Sprint 21

- Breadcrumb 3 ชั้น: `Shutdown Event List / {Shutdown Event Name} / Manpower Mob Plan: {Plan Name}`
- Header: `Manpower Mob Plan: [Plan Name]`
- **Header มี 2 ปุ่ม**: **`Route`** · `Save` (ปุ่มน้ำเงิน · เทาตอนยังไม่มีการแก้)
  → ⚠️ **ชื่อปุ่มคือ `Route` ไม่ใช่ `Set Route`** การ์ด ETM-5613/5838 เขียน `Set Route` แต่ Figma (08 Sep 2026) ใหม่กว่า
- **ไอคอน toggle `Table / Split View` และไอคอน filter อยู่มุมขวาบนของ*พื้นที่ตาราง*** ไม่ใช่ใน header
- Layout: pane ซ้าย = ตาราง · pane ขวา = timeline รายวัน
- **scroll ตั้งตรง sync กัน 2 pane · scroll แนวนอนไม่ sync** (ขยับขวา ซ้ายอยู่กับที่)
- toggle `Table / Split View` → **ซ่อน schedule pane หายไปเลย** ตารางกินเต็มความกว้าง · **refresh แล้วกลับเป็น split view** (ไม่จำสถานะ)
- **ไม่มี panel กราฟด้านล่าง** ใน Sprint 21 (POB / trade distribution เป็น future feature)
- **ไม่มี Filter** ใน Sprint 21
- **Job Owner = view only** บนหน้านี้ → ปุ่ม `Route` และ `Save` **ถูกซ่อน** (ไม่ใช่ greyed out)

### ตารางฝั่งซ้าย (จาก Figma + BA confirm 08 Sep 2026)

- หัวกลุ่มคอลัมน์: `Resource >` · `Mob >` · `Onboard Date` · `Demob >` · `Reservation >`
- **default เปิดหน้ามา บางกลุ่มยุบอยู่** ⚠️ **ไม่ใช่กางหมด** ตามที่ AC 3.3 ของ ETM-5614 เขียน → การ์ดผิด
- **โครงคอลัมน์ (อัปเดต 08 Sep 2026)**

| กลุ่ม | คอลัมน์ |
|---|---|
| `Resource` | `* Name` · `Company` · `Department` · **`Accommodation`** · **`D/N Shift`** · **`* Hot Bed`** |
| `Mob` | `Transportation` · `Mob Date` · **`Route No.`** |
| (เดี่ยว) | `Onboard Date` — auto-fill แก้ไม่ได้ |
| `Demob` | `Transportation` · `Demob Date` · **`Route No.`** |
| `Reservation` | `Dlog Status` · `Booking No.` |

  → **`Accommodation` และ `D/N Shift` เป็นคอลัมน์ใหม่** · **`Hot Bed` ย้ายจาก `Reservation` มาอยู่ `Resource` ต่อจาก `Department`**
- `Accommodation` = dropdown **`LQ` · `Barge` · `FSO`** (ตามลำดับ)
- `D/N Shift` = dropdown **`Day` · `Night`** (ตามลำดับ)
- ยุบกลุ่มแล้วเหลือโชว์: `* Name` · `Mob Date` · `Demob Date` · `Dlog Status`
- **`* Name` มีดอกจันสีแดงที่หัวคอลัมน์** · `Name` และ `Hot Bed` เป็น 2 ช่องเดียวที่บังคับกรอก
- แถว **`Mob Route`** และ **`Demob Route`** อยู่บนสุด เหนือแถวชื่อช่างแถวแรก
- **แถวชื่อช่าง** (สีน้ำเงินเข้ม) = ชื่อ + **ไอคอนดินสอ ✏️** · คอลัมน์ฝั่งซ้ายอื่น **เว้นว่าง** (ไม่ใช่ขีด `-`)
- **แถวตัวเลข** เขียนคำว่า **`Required Manpower`** ในคอลัมน์ Name
- กลุ่มที่ยังไม่มีคนแสดง **`No people assigned.`**
- `Hot Bed` default = `No` · dropdown `Yes` / `No`

### ค่าที่ snapshot มาจาก Shutdown Logic (ยืนยัน 08 Sep 2026)

| ดึงมาจาก | ลงที่ไหน |
|---|---|
| **Resource Name** (ตาราง Manpower Resource) | แถวชื่อช่างในตารางซ้าย |
| **Required Manpower ต่อวัน** (Histogram) | แถว `Required Manpower` ในปฏิทินฝั่งขวา |

⚠️ **ไม่ได้ดึง Task หรือช่วงเวลาของ Task มา**

**ช่วงวันของ timeline** (ยืนยัน 08 Sep 2026) — นับจาก **วันเริ่มและวันจบของ Shutdown Logic** ครอบ **7 วันก่อนวันเริ่ม ถึง 7 วันหลังวันจบ**
→ ⚠️ **ไม่ใช่** "งานแรกสุด/งานสุดท้าย" ตามที่การ์ด ETM-5837 เขียน เพราะหน้านี้ไม่มี Task
→ **ขอบเขตของหน้านี้**: จัดการ **คน · วัน · ยานพาหนะ** เท่านั้น ไม่เกี่ยวกับงาน

**สีตัวอักษรของแถว `Required Manpower`**

- ตอนเริ่มต้น ถ้าค่า **> 0** → **ตัวอักษรสีแดง** (แปลว่ายังจัดคนไม่ครบ)
- เมื่อเพิ่ม people ในวันนั้นให้ **>= Required Manpower** → **เปลี่ยนเป็นสีเทาปกติ**
- 🆕 พฤติกรรมนี้**ไม่มีในการ์ด ETM-5614** เลย

**แถว `Required Manpower` ขึ้นเฉพาะแถวที่ snapshot มาจาก Shutdown Logic** (ยืนยัน 08 Sep 2026)

- แถวชื่อ Resource ที่ผู้ใช้เพิ่มเองด้วย **`+ Add Resource`** → **ไม่มีแถว `Required Manpower`** เลย
- เข้าคู่กับกฎไอคอน `(i)` — แถวที่เพิ่มเองไม่มีทั้ง `(i)` และแถว `Required Manpower`
- **ตัวเลขในแถว `Required Manpower` แก้ไขได้แล้ว** (เดิมเป็น read-only เพราะดึงมาจาก Shutdown Logic · เปลี่ยน 08 Sep 2026)

### พฤติกรรมการยุบ/กาง และ empty state (ยืนยัน 08 Sep 2026)

| เรื่อง | ของจริง |
|---|---|
| ยุบแถวชื่อ Resource (สีน้ำเงิน) | **แถว `Required Manpower` ยังอยู่** หายแต่แถวคน |
| ยุบกลุ่มคอลัมน์แล้ว refresh | **ไม่จำ กลับเป็น default** (เหมือน toggle Table/Split View) |
| **ยุบ/กางแถวชื่อ Resource** | **ทำให้ปุ่ม `Save` กลายเป็น enabled และกด Save ได้** — ✅ **เป็นสเปก ไม่ใช่ bug** พฤติกรรมเดียวกันกับหน้า **Shutdown Logic** และ **Daily Report** (Benz ยืนยัน 08 Sep 2026)<br>→ ผลพลอยได้: ยุบแถวแล้วออกจากหน้าจะเจอ modal `Unsaved Change` ทั้งที่ไม่ได้แก้ข้อมูล **ถูกต้องตามสเปก** |
| ตารางไม่มี Resource เลย | ข้อความ **`No resource available to display.`** + ปุ่ม **`Route` และ `Save` เป็น disabled** |
| **ชื่อซ้ำ** | **ซ้ำได้ทั้งชื่อ Resource และชื่อคน** ไม่มี error ไม่รวมแถว |
### ✅ Max Character — สรุปแล้ว (BA อัปเดตเอกสาร Validation · อ่านซ้ำ 08 Sep 2026)

| ช่อง | Max Character | หมายเหตุ |
|---|:---:|---|
| `Name` | **256** | |
| `Company` | **256** | |
| `Department` | **64** | ⚠️ **สั้นกว่า 2 ช่องบน** ต้องเทสแยก |
| `Dlog Status` | **20** | |
| `Booking No.` | **30** | ⚠️ **ไม่เท่ากับ Dlog Status** ต้องเทสแยก |
| `Route No.` | **20** | |
| `Capacity` | **99** | เป็นค่าตัวเลขสูงสุด ไม่ใช่จำนวนตัวอักษร |

> ตัวเลขในการ์ด Jira (100/50) **ผิดทุกใบ** · เลข 50/20 ที่ผมบันทึกไว้เมื่อ 07 Sep **ล้าสมัยแล้ว**
> **ไม่มี 2 คอลัมน์ใหม่ในเอกสาร** (`Accommodation` · `D/N Shift`) → ขอ BA เพิ่ม แต่ไม่บล็อกเพราะเป็น dropdown

> ✅ **`Route No.` ในตาราง = 20 ตัวอักษร** (ใช้ค่าเดียวกับ `Route No.` ในฟอร์ม Add Route)

**ปุ่มใน modal `Unsaved Change`**: `Continue Editing` / **`Discard Change`** (ค่าเต็มยืนยันแล้ว 08 Sep 2026)

### panel เส้นทาง (จาก Figma 08 Sep 2026)

- กดปุ่ม `Route` → เปิด **drawer** ด้านขวา หัว drawer = **`Route`** เฉย ๆ
  → ⚠️ **ไม่ใช่ `Route: DD Mon YYYY`** (ผมเคยบันทึกผิด · แก้จากภาพจริง 08 Sep 2026)
- **ปุ่ม `⊕ Add Route` มีปุ่มเดียว อยู่มุมขวาบนของหัว drawer** (การ์ด ETM-5838 ที่บอกว่ามีปุ่มละตาราง **ผิด**)
- **มีปุ่ม `Back` อยู่มุมซ้ายล่างของ drawer** ใช้ปิด drawer
- **2 field ด้านบนคือ Filter ของรายการเส้นทาง** ไม่ใช่ช่องกรอกข้อมูล (Benz ยืนยัน 08 Sep 2026)
  → `Transportation:` chip `Helicopter ×` `MSB ×` `Vessel ×` + chevron
  → `Mob/Demob:` chip `Mob ×` `Demob ×` + chevron
  → **default ติ๊กมาครบทุกค่า** ผู้ใช้กด `×` เพื่อตัดค่าที่ไม่ต้องการเห็นออก
- แยก **2 ส่วนที่ยุบได้**: **`Routine Route`** · **`Non-Routine Route`**
- การ์ดเส้นทาง Routine: ไอคอนวงกลม + **`Every Saturday`** + ✏️ 🗑️ · บรรทัดสอง `📍 PLA - SKL` · `👤 30`
- การ์ดเส้นทาง Non-Routine: ไอคอนวงกลม + **`15 Feb 2025`** + ✏️ 🗑️ · บรรทัดสอง `📍 SKL - PLA` · `👤 70` · `🎫 IK - 1234567`
- **`Route No.` ตอนไม่ได้กรอก ไม่แสดงบรรทัดนั้นเลย** ไม่ใช่ขีด `-`
- `Origin` / `Destination` ใช้ **ชื่อ Platform 3 ตัวอักษร** เช่น `PLA` (เอกสารเขียน `[3 Cha Platform Name]` **ถูก** · การ์ดที่เขียน `Field of Asset` **ผิด**)
- **default capacity มีจริง**: Helicopter 12 · MSB 30 · Vessel 70 (เห็น 30 และ 70 ใน Figma)
- ช่อง `Route Type` (radio · default `Routine`) **อยู่ในฟอร์ม Add/Edit Route** ไม่ใช่ใน panel รายการ
- 🆕 **`Day` และ `Date` สลับกันแสดงตาม `Route Type`** (เอกสาร Validation คอลัมน์ Notes · 08 Sep 2026)
  → `Route Type` = `Routine` → แสดง **`Day`** (dropdown 7 วัน) · ซ่อน `Date`
  → `Route Type` = `Non-Routine` → แสดง **`Date`** (date picker) · ซ่อน `Day`
  → ⚠️ **ไม่ได้อยู่ในฟอร์มพร้อมกัน** ฟอร์มเปลี่ยนหน้าตาเมื่อสลับ radio
- ชื่อ field ทิศทางคือ **`Mob/Demob`** (การ์ด ETM-5839 ที่เขียน `Direction` **ผิด**)

### ป้ายเส้นทางบน timeline (ยืนยัน 08 Sep 2026)

- ป้ายในแถว `Mob Route` / `Demob Route` แสดง **ไอคอนพาหนะเท่านั้น ไม่มีเลข capacity**
- **ทางเดียวที่ผู้ใช้เห็นเลขที่นั่งคือ hover แล้วดู tooltip**
- ⚠️ **การ์ด ETM-5839 ล้าสมัย 2 ข้อ** — AC 1.2.2 เขียนว่าป้ายมีเลข (`[🚁 12]`) ซึ่งไม่จริงแล้ว
  และ **AC 1.2.3 (กฎย่อเป็นไอคอนล้วนเมื่อมีพาหนะครบ 3 ชนิด) ตกไปทั้งข้อ** เพราะไม่มีเลขตั้งแต่แรก
  ก็ไม่มีอะไรให้ย่อ → ควรให้ BA ลบ AC 1.2.3 ออก

### ข้อความยืนยันแล้ว (เอกสาร `Manpower Mob Plan Validation&Result.xlsx`)

| จังหวะ | Title | ข้อความ | ปุ่ม |
|---|---|---|---|
| Save สำเร็จ | `Save Success` | `Save Manpower Mob Plan Successfully` | — |
| Save ไม่สำเร็จ | `Save Failed` | `Save Manpower Mob Plan Failed` | — |
| ออกจากหน้าโดยยังไม่ Save | `Unsaved Change` | `Are you sure you want to leave this page? Changes you made will not be saved.` | `Continue Editing` / `Discard C…` (ยังต้องขอค่าเต็ม) |
| ลบเส้นทาง | `Delete Route` | `Are you sure you want to delete the selected route?` | `Delete` / `Cancel` |
| เพิ่มเส้นทางสำเร็จ | `Add Success` | `Add Route Successfully` | — |
| แก้เส้นทางสำเร็จ | `Edit Success` | `Edit Route Successfully` | — |
| ลบเส้นทางสำเร็จ | `Delete Success` | `Delete Route Successfully` | — |

**error ของ Demob = กรอบแดงที่ช่องเท่านั้น ไม่มีข้อความ ไม่มี toast** (Benz ยืนยัน 08 Sep 2026 · ช่อง Message ในเอกสารเป็น `-` แปลว่าไม่มีจริง)

**เพิ่ม/ลบ Resource และ People — ไม่มี toast และไม่มี modal ยืนยัน** (Benz ยืนยัน 08 Sep 2026)

> ⚠️ **กับดักในเอกสาร Validation**: ชีต 1 มีแถว `Add Resource` · `Delete Resource` ·
> `Confirm Delete Resource` · `Add People` โดยช่องข้อความว่างทั้งหมด
> **แถวพวกนี้เป็นของเหลือ ไม่ใช่งานที่ต้องทำ** — ห้ามอนุมานว่า "มีแถว = มี modal"
> (ผมเคยสรุปผิดแบบนี้เมื่อ 07 Sep) ควรให้ BA ลบ 4 แถวนั้นออกจากเอกสาร

**ความเสี่ยงที่ควรกำกับไว้**: ลบชื่อช่าง 1 แถว = ลบแถว Required Manpower + คนทั้งหมดข้างใต้
โดยไม่ถามยืนยันและไม่มี undo → เป็นสเปก ไม่ใช่ defect แต่ควรแจ้ง User ให้รู้

### ลำดับการกรอกวันที่ → สิ่งที่ปฏิทินแสดง (ยืนยัน 08 Sep 2026)

**สำคัญ: ลำดับการกรอกให้ผลกลางต่างกัน · การ์ด ETM-5837 ไม่ได้เขียน state พวกนี้เลย**

**ลำดับ A — ใส่ `Mob Date` ก่อน**

| กรอก | ปฏิทินแสดง | `Demob Date` |
|---|---|---|
| `Mob Date` | **ไอคอน M เดี่ยว ๆ** ยังไม่มี O ไม่มีแถบ | 🔒 กดไม่ได้ |
| `Transportation` | **ไอคอน O** + **แถบเขียวยาวไปจนสุดปฏิทิน** | 🔓 ปลดล็อก |
| `Demob Date` | **ไอคอน D** + **แถบถูกปิด** ที่ `Demob - 1` | ✅ |

**ลำดับ B — ใส่ `Transportation` ก่อน**

| กรอก | ปฏิทินแสดง | `Demob Date` |
|---|---|---|
| `Transportation` | **ไม่แสดงอะไรเลย** | 🔒 กดไม่ได้ |
| `Mob Date` | **ไอคอน M และ O โผล่พร้อมกัน** + **แถบยาวไปจนสุดปฏิทิน** | 🔓 ปลดล็อก |
| `Demob Date` | **ไอคอน D** + **แถบถูกปิด** | ✅ |

**3 จุดที่ต่างจากการ์ด**

1. **ไอคอน M ขึ้นได้โดยไม่ต้องมี `Transportation`** — ไม่ต้องรอ O
2. 🔴 **แถบเขียวมี state "ยาวไปจนสุดปฏิทิน"** เมื่อมี `Onboard` แล้วแต่ยังไม่มี `Demob`
   → **AC 2.2.4 ของ ETM-5837 ไม่มี state นี้** เขียนแค่ `[Onboard, Demob - 1]` · ควรให้ BA เพิ่ม AC
3. **`Transportation` เดี่ยว ๆ ไม่ทำให้เกิดอะไร** เพราะ `Onboard = f(Transportation, Mob Date)` ต้องมีทั้งคู่
4. **`Demob Date` ปลดล็อกตอนที่ `Onboard Date` คำนวณได้** ไม่ใช่ตอนที่ `Mob Date` มีค่า

### ป้าย M / O ตอนวันเดียวกัน (ยืนยัน 08 Sep 2026)

- ถ้า **Mob Date = Onboard Date** → **ไอคอน M และ O ซ้อนเหลื่อมกัน** · **M อยู่ซ้าย · O อยู่ขวา · O ทับ M**
- ⚠️ **ไม่ใช่ป้ายรวม `M/O` ป้ายเดียว** ตามที่ **AC 2.2.3 ของ ETM-5837** เขียน → **การ์ดผิด ควรให้ BA แก้**

### สีของป้ายและแถบบน timeline (ยืนยัน 08 Sep 2026)

| สิ่งของ | รหัสสี | หมายเหตุ |
|---|---|---|
| ป้าย **M** (Mob) | `#73D13D` | เขียวอ่อน ทึบ |
| ป้าย **O** (Onboard) | `#389E0D` | เขียวเข้ม ทึบ |
| ป้าย **D** (Demob) | `#FAAD14` | ส้ม ทึบ |
| **แถบช่วงอยู่บนแท่น** | `#73D13D33` | สีเดียวกับ M แต่ **ทึบ 20%** |

> แถบเป็นสีโปร่งแสง ห้ามให้ QA วัดสีจากภาพหน้าจอแล้วเทียบตรง ๆ
> เพราะสีที่ตาเห็นจะผสมกับพื้นหลังของช่อง ให้เทียบว่า**อ่อนกว่าป้าย M ชัดเจน** หรือเปิด DevTools ดู CSS

### ไอคอน info ในตาราง (ยืนยัน 08 Sep 2026)

- ไอคอน **`(i)`** อยู่ข้างชื่อช่าง · **hover แล้วขึ้น tooltip** บอกว่าข้อมูลมาจาก Shutdown Logic
- **ขึ้นเฉพาะแถวที่ดึงมาจาก Shutdown Logic** — แถวที่ผู้ใช้เพิ่มเองด้วย `+ Add Resource` **ไม่มีไอคอน**
- ✅ **ข้อความ tooltip มีในการ์ดแล้ว** (ETM-5614 AC 1.2.2.1 · อ่านซ้ำ 08 Sep 2026):
  **`Baseline resource sourced from Shutdown Logic schedule.`**
  → ยังควรจดข้อความจริงตอน execute เทียบกับค่านี้

### ⚠️ ETM-5614 — สิ่งที่การ์ดเขียนไว้แต่ขัดกับของจริง (อ่านซ้ำ 08 Sep 2026)

| AC | การ์ดเขียน | ของจริง |
|---|---|---|
| **AC 1.2.4** | *"`Required Manpower` … **strictly view-only and cannot be edited or overwritten**"* | 🔴 **แก้ไขได้แล้ว** — **การ์ดยังไม่ได้แก้** · Benz จะแจ้ง BA (08 Sep 2026) |
| **AC 1.2.6** | *"Snapshotted trade categories … **do not display a delete action**"* | 🔴 **ลบได้** — **การ์ดยังไม่ได้แก้** · Benz จะแจ้ง BA (08 Sep 2026) |
| **AC 2.1** | *"sorted in **alphabetical ascending order (A to Z)**"* | 🔴 เรียงตาม **Unicode code point** (case-sensitive) → ไม่ใช่ A-Z แบบพจนานุกรม |
| **AC 3.3** | *"All column groups … initialize in the **Expanded** state"* | 🔴 **บางกลุ่มยุบอยู่** ตอนเปิดหน้า |
| **Data Source + AC 3.1.2 / 3.1.4 / 3.2.2.2 / 3.2.2.3** | *"`Vessel No.`"* | 🔴 **BA พิมพ์ผิด · ชื่อจริงคือ `Route No.`** (Benz ยืนยัน 08 Sep 2026) |

**สิ่งที่การ์ดเขียนตรงกับของจริง (ใช้อ้างอิงได้)**

- **AC 1.2.5** สีแดงของ `Required Manpower` = **`#A8071A`** · เงื่อนไข `POB(C,d) < Required Manpower(C,d)`
- **AC 1.3.1** Resource ที่เพิ่มเอง **ไม่มีแถว `Required Manpower`** ✅ ตรงกับที่ Benz ยืนยัน
- **AC 1.3.2** Resource ที่เพิ่มเอง **ไม่มีไอคอน `(i)`** ✅
- **AC 2.2.2** ยุบแถวชื่อ Resource แล้ว **แถว `Required Manpower` ยังแสดงอยู่** ✅ ตรงกับคำตอบ Q5614-3
- **AC 1.2.3** สูตร `Required Manpower(C,d) = MAX(headcount ชั่วโมง 0..23 ของวัน d)`
- **คอลัมน์ที่ 3 ของกลุ่ม `Mob` และ `Demob` คือ `Route No.` ไม่ใช่ `Vessel No.`** — การ์ดพิมพ์ผิด (Benz ยืนยัน 08 Sep 2026)
  → **max character = 20** (เอกสาร Validation ชีต 3 แถว `Route No.`)
  → ยุบกลุ่มแล้วซ่อน `Transportation` และ `Route No.` เหลือ `Mob Date` / `Demob Date`

### Selector สำหรับ Automation (ตรวจ DOM จริง 09 Sep 2026)

**ทั้งระบบไม่มี `data-testid` แม้แต่ตัวเดียว** (ตรวจ 5 หน้า ได้ 0 ทุกหน้า) และไม่มี `data-test` · `data-qa` · `data-cy`

**ลำดับ selector ที่ให้ใช้**

| ลำดับ | Selector | ใช้ที่ไหน |
|:--:|---|---|
| 1 | `[formcontrolname="..."]` | **ฟอร์มทุกหน้า** — Create Work มีครบ: `workHeader` `priority` `department` `accommodation` `hotBed` `remark` `specificRequirement` `workBreakdown` `manpowerResource` `pob` `duration` `manHrs` `dnShift` |
| 2 | `.ag-cell[col-id="..."]` · `.ag-row[row-id="row-{uuid}"]` | **ตารางทุกหน้าเป็น AG Grid** (`ag-grid-angular`) · `row-id` = UUID จาก backend |
| 3 | `window.bryntum.query('gantt')` | Shutdown Logic · Daily Report — **ใช้ store ไม่ใช้ DOM** |
| 4 | `getByRole('button', {name})` | ปุ่มที่มีข้อความชัดเจน |
| 5 | `.b-button[data-ref="..."]` | ปุ่มภายในของ Bryntum เช่น `collapseExpand` |
| 6 | XPath / `nth()` | **ห้ามใช้** ยกเว้นไม่มีทางอื่น พร้อมคอมเมนต์กำกับ |

**`col-id` ที่ยืนยันแล้ว**

- Shutdown Event List: `ag-Grid-AutoColumn` · `platforms` · `sdType` · `plannedDate` · `taManagers` · `status` · `action`
- Worklist: `ag-Grid-AutoColumn` · `jobDescription` · `functionalLocation` · `platform` · `jobOwner` · `department` · `manpowerResourceStr` · `pob` · `duration` · `remark` · `status` · `action`

⚠️ **AG Grid ทำ virtual scrolling** — แถวนอกจอไม่มีใน DOM · ห้ามใช้ `.count()` สรุปจำนวนแถวทั้งหมด
⚠️ **Bryntum**: `records` = แถวที่ผ่าน filter · `allRecords` = ทั้งหมด · **เคยใช้ผิดแล้วเกือบเขียนค่าลง 5,223 แถว**

> แผน automation เต็ม (26 เคสที่ควรทำ + 8 กลุ่มที่ไม่ควรทำ) อยู่ใน `ETM_AutomationCandidates.md`

### Create Worklist modal
- Title "Create Worklist" · `*Worklist Name` (0/50) · `Worklist Status` (default Initial) · `Active Status` (toggle, default Inactive) · `Description` (0/200) · ปุ่ม "Cancel" / "Save"

---
