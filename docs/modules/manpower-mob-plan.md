# Manpower Mob Plan (Sprint 21) - dashboard, table, snapshot from Shutdown Logic, max character, messages, date rules, timeline, ETM-5614 AC conflicts

Part of the ETM UI map (index: `docs/UI_Map_ETM.md`). Text below is moved verbatim from the old single file; keep the rule there: every fact has a check date, never guess, update here BEFORE writing test cases.

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
| **ยุบ/กางแถวชื่อ Resource** | **ทำให้ปุ่ม `Save` กลายเป็น enabled และกด Save ได้** — ✅ **เป็นสเปก ไม่ใช่ bug** พฤติกรรมเดียวกันกับหน้า **Shutdown Logic** และ **Daily Report** (ทีม ยืนยัน 08 Sep 2026)<br>→ ผลพลอยได้: ยุบแถวแล้วออกจากหน้าจะเจอ modal `Unsaved Change` ทั้งที่ไม่ได้แก้ข้อมูล **ถูกต้องตามสเปก** |
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
- **2 field ด้านบนคือ Filter ของรายการเส้นทาง** ไม่ใช่ช่องกรอกข้อมูล (ทีม ยืนยัน 08 Sep 2026)
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

**error ของ Demob = กรอบแดงที่ช่องเท่านั้น ไม่มีข้อความ ไม่มี toast** (ทีม ยืนยัน 08 Sep 2026 · ช่อง Message ในเอกสารเป็น `-` แปลว่าไม่มีจริง)

**เพิ่ม/ลบ Resource และ People — ไม่มี toast และไม่มี modal ยืนยัน** (ทีม ยืนยัน 08 Sep 2026)

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
| **AC 1.2.4** | *"`Required Manpower` … **strictly view-only and cannot be edited or overwritten**"* | 🔴 **แก้ไขได้แล้ว** — **การ์ดยังไม่ได้แก้** · ทีม จะแจ้ง BA (08 Sep 2026) |
| **AC 1.2.6** | *"Snapshotted trade categories … **do not display a delete action**"* | 🔴 **ลบได้** — **การ์ดยังไม่ได้แก้** · ทีม จะแจ้ง BA (08 Sep 2026) |
| **AC 2.1** | *"sorted in **alphabetical ascending order (A to Z)**"* | 🔴 เรียงตาม **Unicode code point** (case-sensitive) → ไม่ใช่ A-Z แบบพจนานุกรม |
| **AC 3.3** | *"All column groups … initialize in the **Expanded** state"* | 🔴 **บางกลุ่มยุบอยู่** ตอนเปิดหน้า |
| **Data Source + AC 3.1.2 / 3.1.4 / 3.2.2.2 / 3.2.2.3** | *"`Vessel No.`"* | 🔴 **BA พิมพ์ผิด · ชื่อจริงคือ `Route No.`** (ทีม ยืนยัน 08 Sep 2026) |

**สิ่งที่การ์ดเขียนตรงกับของจริง (ใช้อ้างอิงได้)**

- **AC 1.2.5** สีแดงของ `Required Manpower` = **`#A8071A`** · เงื่อนไข `POB(C,d) < Required Manpower(C,d)`
- **AC 1.3.1** Resource ที่เพิ่มเอง **ไม่มีแถว `Required Manpower`** ✅ ตรงกับที่ ทีม ยืนยัน
- **AC 1.3.2** Resource ที่เพิ่มเอง **ไม่มีไอคอน `(i)`** ✅
- **AC 2.2.2** ยุบแถวชื่อ Resource แล้ว **แถว `Required Manpower` ยังแสดงอยู่** ✅ ตรงกับคำตอบ Q5614-3
- **AC 1.2.3** สูตร `Required Manpower(C,d) = MAX(headcount ชั่วโมง 0..23 ของวัน d)`
- **คอลัมน์ที่ 3 ของกลุ่ม `Mob` และ `Demob` คือ `Route No.` ไม่ใช่ `Vessel No.`** — การ์ดพิมพ์ผิด (ทีม ยืนยัน 08 Sep 2026)
  → **max character = 20** (เอกสาร Validation ชีต 3 แถว `Route No.`)
  → ยุบกลุ่มแล้วซ่อน `Transportation` และ `Route No.` เหลือ `Mob Date` / `Demob Date`
