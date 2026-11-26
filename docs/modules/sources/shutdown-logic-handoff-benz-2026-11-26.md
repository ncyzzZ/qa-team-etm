# Shutdown Logic — Knowledge Handoff (QA)

Nov 26, 2026 · @Benz

สรุปองค์ความรู้หน้า Shutdown Logic และหน้าที่เกี่ยวข้อง สำหรับส่งต่อให้ทีม QA · ข้อที่ Benz ยืนยันแล้วถือเป็นกฎ แม้จะขัดกับการ์ด Jira

## แผนผัง

&#91;embedded content: หน้า Shutdown Logic กับ 8 หน้าที่เกี่ยวข้อง\]

Worklist กับ Optimize · SIMOP ไหล 2 ทาง: Worklist ส่ง Work เข้ามา และ Save ของ Shutdown Logic เขียนกลับ · Optimize / SIMOP ส่งร่างไปคำนวณแล้วส่งผลกลับ

## 1. หน้าที่เกี่ยวข้องและวิธีเข้า

ทุกหน้าเริ่มจาก Shutdown Event List → หน้า Event (5 tab: `Details` · `Manpower Resource` · `Planning` · `Timeline` · `Shutdown Organization`) · หน้าย่อยของ Plan Card เปิดเป็น**แท็บใหม่** · เดา path ผิด = redirect กลับ Event List เงียบ ๆ ไม่ขึ้น 404

| หน้า | ทางเข้า | URL |
| --- | --- | --- |
| Shutdown Event List | หน้าแรกหลัง login | `/shutdown-event-list?years=2026,2027&keyword={ชื่อ}` |
| Event › Planning | คลิกชื่อ Event → tab Planning | `/shutdown-event-list/events/{eventId}?tab=planning` |
| **Shutdown Logic** | Plan Card → แถว `Shutdown Logic` | `/events/{eventId}/planning/{planId}/logics/{logicId}` |
| Worklist | Plan Card → แถว `Worklist` | `/events/{eventId}/planning/{planId}/worklist/{worklistId}` |
| Edit Work Breakdown | Worklist → ⋮ `View Work Details` → `Edit Breakdown` | `.../works/{id}/form-breakdown` |
| Event › Manpower Resource | tab ในหน้า Event (Organic Crew · `Edit Working Schedule`) | `?tab=...` |
| Daily Report | Plan Card → แถว `Daily Report` | `.../planning/{planId}/daily-report/{dailyReportId}` |
| Manpower Mob Plan / Equipment Mob Plan | Plan Card → แถวของตัวเอง | `.../equipment-mob/{id}` |
| Timeline | tab ในหน้า Event | `/events/{eventId}?tab=timeline` |
| Edit Shutdown Event | Event List ⋮ `Edit Details` หรือ Details → `Edit Detail` | `/shutdown-event-list/form/{eventId}` |

Plan Card มี sub-item 5 แถว: Worklist · Shutdown Logic · Manpower Mob Plan · Equipment Mob Plan · Daily Report · badge `Ramp Down/Up Date: …` (ETM-8042) · เมนู ⋮ ของ Shutdown Logic = `View Shutdown Logic` · `Delete Shutdown Logic`

## 2. โครงหน้าและสิทธิ์

หน้าแบ่ง ซ้าย-ขวา: **ซ้าย** = ตาราง Gantt (บน) + ตาราง Manpower Resource (ล่าง) · **ขวา** = timeline (บน) + Histogram (ล่าง) · splitter ลากปรับได้ · hover มีลูกศร `<` / `>` ยุบ pane

- หัวหน้า `Shutdown Logic: {ชื่อ}` · badge `Active` แสดงอย่างเดียว ไม่ล็อกอะไร
- ปุ่มมุมขวาบน: `Export` · `Optimize` · `Save`
- แถบเครื่องมือ: Undo / Redo · ผล Optimize · `Focus Critical Path` · `Focus Dropped Task` · `SIMOP` · Custom View · Filter Panel
- เส้นตั้งบน timeline ชื่อ `Ramp Down` / `Ramp Up` (ETM-7897) วาดที่วัน Ramp ของ **Plan** (ETM-8042) · แก้วัน Ramp ทีหลัง = ย้ายแค่เส้น งานไม่ขยับ
- ตารางว่าง = `No work available to display.` ทั้ง Gantt และ Histogram
- ช่อง No.: ตัวเลขชิดซ้าย · ป้าย `C` = Critical Path (ได้จาก Optimize) · `D` = Dropped Task

**สิทธิ์** — ระบบดู permission 3 ตัว ไม่ดูชื่อ role · ปุ่มที่ไม่มีสิทธิ์ถูก**ลบออกจาก DOM** ไม่ใช่ disable

| Permission | ทำอะไรได้ | Turnaround Manager | Job Owner |
| --- | --- | --- | --- |
| View | เปิดหน้า · zoom · filter · custom view (ไม่ถูกเก็บ) | ✔ | ✔ |
| Edit | แก้ทุกอย่าง · Save · Undo · SIMOP · **Export** · save filter / custom view | ✔ | ✘ |
| Optimize | ปุ่ม Optimize · `Export Error` | ✔ | ✘ |

- Job Owner ไม่มี modal `Unsaved Change` (แก้อะไรไม่ได้) · Job Owner ไม่เห็น tab Manpower Resource ของ Event
- หน้าเว็บ**ไม่ล็อก**การแก้ตาม Worklist `Freeze` หรือ Plan Inactive

## 3. ระดับของแถว และแก้อะไรได้

ต้นไม้ 4 ชั้น: Platform → Work Header → Work → Work Breakdown · วันที่ของ 3 ชั้นบน**คำนวณจากลูก** แก้ตรง ๆ ไม่ได้

| ระดับ | ช่องที่แก้ได้ | ลาก bar | เมนูคลิกขวา |
| --- | --- | --- | --- |
| Platform | ไม่ได้เลย | ✘ | ไม่มี |
| Work Header | Predecessor · Successor | ✘ | `Edit Work Header` |
| Work | Work Number · Description · Activity Group · Priority · Equipment No. · Functional Location · Remark · Predecessor · Successor | ✘ | `Delete Work` · `Edit Work` |
| Work Breakdown | Description · Activity Group · Priority · Duration · Start · End · Deck · Manpower (≤ 5) · Remark · Predecessor · Successor | ✔ ลาก / ยืด | `Duplicate Work Breakdown` · `Delete Work Breakdown` · `Edit Breakdown` · `Edit SIMOP` · `Split task` (เฉพาะ Manual Adjust) |

- เพดาน: Description ≤ 200 · Activity Group ≤ 200 · Remark ≤ 500
- **คลิก 1 ครั้ง = เลือก** (พื้นฟ้าอย่างเดียว) · ดับเบิลคลิก = แก้ · Tab ย้ายช่อง**เฉพาะตอนเปิดแก้** · Enter = save แล้วเปิดช่องเดียวกันแถวถัดไป · Esc ครั้งที่ 1 = คืนค่าแต่ยังแก้อยู่ · ครั้งที่ 2 = ออก
- วันที่พิมพ์ได้หลายรูปแบบ (ETM-7902) → แสดง `DD Mmm YYYY, HH:mm` · วันมาก่อนเดือน · เวลาถูกปัดทีละ 15 นาที · ค่าผิด = ช่องว่างพื้นแดง + bar ไม่ขยับ + `Save` disable
- End ≤ Start: เฉพาะ Manual Adjust ได้ Duration 0.00 · Resource / Custom Calendar = popup `Unable to Apply Scheduled Time` แล้วคืนค่า
- Deck ที่ตรง Master Data (ไม่สนตัวเล็ก-ใหญ่) ถูกแก้ตัวสะกดตาม Master Data (ETM-8049)
- **ลบ Work / Work Breakdown ในหน้านี้ไม่มี modal ยืนยัน** (Undo ได้) · `Delete Work Breakdown` ซ่อนถ้าเป็นลูกตัวเดียว · ลบ Work ตัวสุดท้าย → Work Header / Platform ที่ว่างหายตาม
- Duplicate Work Breakdown: แถวใหม่ใต้ตัวเดิม **ไม่มีเส้น ไม่มี constraint ไม่มีป้าย C / D**
- เพิ่ม Work / Platform ใหม่ไม่ได้ (ต้องไป Worklist) · **ย้าย Work ไป Work Header / Platform อื่นได้เฉพาะผ่าน Work Setting modal** (ลากข้ามแม่ไม่ได้) → Work ต้องไปอยู่แถวล่างสุด (AC 12.1)
- ลากเรียงแถวที่ช่อง No. ได้เฉพาะในแม่เดียวกัน

**Setting modal** (≡ หรือคลิกขวา Edit) — Save ของ modal = ร่างในหน้า ยังไม่ถึง DB · 1 ครั้ง = 1 undo

| Modal | Tabs |
| --- | --- |
| `Work Header Setting` | Predecessor · Successor · Advanced |
| `Work Setting` | Work Details · Manpower Resource (ดูอย่างเดียว) · Predecessor · Successor · Advanced |
| `Breakdown Setting` | Breakdown Details · Manpower Resource (`* Resource Type` / `* Quantity` 5 แถว) · Predecessor · Successor · Advanced |

## 4. Dependency

ชนิด FS · SS · FF · SF · ระดับ `Soft` · `Normal` · `Hard` · lag เป็นชั่วโมง ปัดทีละ 0.25 ติดลบได้ · ผูกได้ที่ Work Header · Work · Work Breakdown (ไม่ได้ที่ Platform)

- **Hard** = 2 bar ชิดกันตามชนิด · ห่างได้แค่ช่วงนอกกะ (Resource / Custom Calendar) · ลากได้ถ้าไม่เกิดช่องว่าง
- **Soft** = บนหน้าเว็บทำงานเหมือน Normal · ต่างแค่ Optimize ผ่อนเส้น Soft ได้
- **Hard กับ constraint อยู่ด้วยกันไม่ได้** — มี constraint = เลือก Hard ไม่ได้ · มี Hard ขาเข้า = ตั้ง constraint ไม่ได้
- **FCFS** — ของที่มีอยู่ก่อนชนะ ของใหม่ที่ขัดถูกปฏิเสธ

**สร้างเส้นได้ 4 ทาง**

1. ลากจาก bar ไป bar → ได้ **Normal** เสมอ
2. พิมพ์ในช่อง Predecessor / Successor: `9` · `9SS` · `9+1.25` · `9SS-0.5` (ไม่ใส่ชนิด = FS) · อ้างแถวที่ถูก filter ซ่อนได้
3. Setting modal แท็บ `Predecessor` / `Successor` (`* Description · * Type · * Lag · * Priority`) → **ที่เดียวที่ตั้ง Soft / Normal / Hard ได้** · ตัวที่ผูกไม่ได้ (Platform / ตัวเอง) ไม่แสดง · แม่-ลูก / วน = สีเทา
4. Paste ในช่อง Predecessor / Successor

⚠️ **การพิมพ์ในช่อง = เขียนรายการใหม่ทั้งหมด** — เส้นเดิมที่ไม่ได้พิมพ์ซ้ำถูกลบ · ถูกปฏิเสธ**เงียบ ๆ**: ลากเส้นซ้ำคู่เดิม · รูปแบบผิด (`9XX`) · เลขแถวที่ไม่มี · เลขซ้ำ (เอาตัวแรก) · ลากไป Platform

**modal `Unable to Apply Dependency`** (ปุ่ม OK ปุ่มเดียว)

| กรณี | ข้อความ | ขึ้นทางไหน |
| --- | --- | --- |
| ต่อกับตัวเอง | `Task cannot be its own dependency.` | พิมพ์ |
| ต่อกับ Platform | `Platform cannot be assigned as dependency.` | พิมพ์ |
| ต่อกับแม่ / ลูก / ปู่ / หลาน | `Task cannot be linked to its own parent or child.` | ลาก · พิมพ์ |
| วนกลับ (นับผ่านแม่-ลูกด้วย) | `The selected dependency creates a circular relationship.` | ลาก · พิมพ์ |
| ดันงานจนผิด constraint หรือทำเส้น Hard อื่นห่าง | `The selected dependency conflicts with the constraint.` | ทุกทาง |

ลากสร้างลิงก์แม่→ลูก / วน = **tooltip ระหว่างลาก ไม่มี popup** · ขัด constraint หรือทำเส้น Hard อื่นห่าง = **ต้องมี popup** (Benz 23 Nov) · paste ค่าผิด = ช่องว่างพื้นแดง ไม่มี popup

ลบเส้น (คลิกเส้น · ลบใน cell · ลบใน modal) → ไม่มีอะไรถูกดึงกลับ · เส้นวาดก็ต่อเมื่อปลายทั้ง 2 ผ่าน filter และไม่ถูกยุบ

## 5. Cascade · Constraint · Working Calendar

**Cascade** — ทุกครั้งที่วันเวลาเปลี่ยน (ลาก · ยืด · split · แก้ช่อง · modal · สร้างเส้น · เปลี่ยน lag · เปลี่ยนกะ) ระบบจัดงานนั้นใหม่แล้วไล่งานปลายเส้นต่อ

- FS: เริ่มปลายทาง ≥ จบต้นทาง + lag · SS: เริ่ม ≥ เริ่ม + lag · FF: จบ ≥ จบ + lag · SF: จบ ≥ เริ่ม + lag
- **ดัน**เมื่อเส้นผิด · **ดึงกลับ**เฉพาะเส้น Hard หรือเส้นที่ชิดพอดีก่อนขยับ · เส้นใหม่ดึงให้ชิดทันที
- ผิด constraint / Hard → **ยกเลิกทั้งการกระทำ** · พิมพ์ในตาราง = popup `Unable to Apply Scheduled Time` / `The selected scheduled time conflicts with the dependency or constraint.` · ลาก / ยืด bar = **tooltip** `This scheduled time conflicts with the HARD dependency on {name}.` แล้วเด้งกลับ ไม่มี popup (ETM-8415 AC 5.2)
- ตอนเปิดหน้า**ไม่ตรวจเส้นซ้ำ** — ยืด Duration ใน Worklist แล้วงานปลายเส้นซ้อนทับได้ จนกว่าจะมีคนขยับงานในหน้านี้ หรือ Optimize

**Constraint** (แท็บ Advanced ของ Work Header / Work / Work Breakdown)

- จริงบน QA: **6 แบบ + None** — `Start no earlier than` · `Start no later than` · `Finish no earlier than` · `Finish no later than` · `Must start on` · `Must finish on` (ตัวเล็กหลังคำแรก)
- วันที่ + เวลา นาที 00/15/30/45 · Type = None → ช่องวันที่ disable และถูกล้าง
- Work Header / Work: ตั้ง constraint **ไม่ทำให้อะไรขยับ** · ถ้าช่วงปัจจุบันผิดอยู่แล้ว = ถูกปฏิเสธ

| Title | ข้อความ | เกิดตอน |
| --- | --- | --- |
| `Unable to Apply Constraint` | `The selected constraint conflicts with the dependency.` | ตั้ง constraint ชนเส้น |
| 〃 | `The selected constraint conflicts with constraint in parent or child tasks.` | ชน constraint ของแม่ / ลูก |
| 〃 | `The selected constraint date is outside the task's working time and cannot be met exactly.` | วันที่ตกนอกกะ |
| 〃 | `The selected constraint conflicts with the current scheduled dates.` | Work Header / Work ที่ช่วงวันผิดอยู่แล้ว |
| `Unable to Apply Dependency and Constraint` | `The selected dependency and constraint conflict with each other.` | แก้ทั้ง 2 อย่างใน modal ครั้งเดียว |

**Working Calendar** (แท็บ Advanced · เฉพาะ Work Breakdown)

- `Resource Calendar` (ทำงานเฉพาะช่วงที่กะของทุกคนทับกัน) · `Custom Calendar` (7 วัน วันละ ≤ 5 ช่วง) · `Manual Adjust` (split เองได้)
- **งานใหม่ได้ Resource Calendar** (หลังบ้านตั้ง · ถ้าเจอ Manual = หลังบ้านไม่ส่งมา)
- เพิ่ม/ลบคน หรือเปลี่ยน Shift → งาน Resource Calendar ถูกจัดใหม่ + cascade · ผิดกฎ = `Unable to Apply Working Calendar` / `The selected working calendar cannot be rendered due to a conflict with a dependency or constraint.`
- กะไม่ทับกันเลย → `No Working Time Available` / `Changing the manpower resource or shift makes some tasks have no overlapping working time.` (ขึ้นตอนเปิดหน้าด้วยถ้ามีงานค้าง)
- Split ผิดกฎ → `Unable to Split Task` · segment ของ split เลื่อนแยกกัน
- D/N Shift ของ Work Breakdown **ไม่มีผล**กับปฏิทิน / Histogram

## 6. Manpower Resource และ Histogram

ตาราง Manpower Resource (ซ้ายล่าง) สร้างจากคนของ Work Breakdown · เก็บแยกต่อ Shutdown Logic · **แก้ที่นี่ไม่กระทบ Organic Crew / master** · คอลัมน์ Resource Name · Shift · Capacity พร้อม Histogram ฝั่งขวา

**กฎจับคู่กับ Organic Crew** (Event › tab Manpower Resource)

| กรณี | Shift | Capacity |
| --- | --- | --- |
| ชื่อตรง Organic Crew | Working Schedule ของ crew | Quantity ของ crew |
| ไม่ตรง · มาจาก `Add Resource` หรือพิมพ์ชื่อใน Histogram | `Default` | 1 |
| ไม่ตรง · มาจากช่อง Manpower / paste / Setting modal | `Default` | จำนวนคนมากสุดของงานเดียว (QA: เพิ่ม 3 คน → Capacity 3) |
| เพิ่มคนใน Worklist หลัง logic สร้างแล้ว | `Default` | 1 — **ไม่ใช่ defect** (Benz 26 Nov) |

- พิมพ์ชื่อ crew ตัวเล็ก (`mechanic`) ใน Histogram → แก้เป็นตัวสะกดของ crew (`Mechanic`) + ได้ Shift / Quantity ของ crew
- เปลี่ยนชื่อแถว = **Shift / Capacity ที่แก้เองถูกรีเซ็ต** · ชื่อใหม่ถูกส่งต่อไปทุกงานที่ใช้ · เรียง A-Z ทันทีตอน Enter / lost focus
- ดับเบิลคลิก: ชื่อ (≤ 20 · ซ้ำแบบไม่สนตัวเล็ก-ใหญ่ = แดง) · Shift (dropdown จาก Working Schedule · ว่าง + Enter = Default) · Capacity 1–999
- คลิกขวา: `Add Resource` (ไม่กระทบงาน · แถวว่างทำให้ Save / Optimize disable) · `Delete Resource` (ลบจากงานที่ใช้)
- Delete Resource มี modal เฉพาะเมื่อมีงานที่ใช้คนนี้**คนเดียว**: `Deleting "{name}" will leave {n} task(s) with no manpower assigned. Continue?` (`Delete` / `Cancel`) · งานที่ไม่เหลือคน ช่อง Manpower แดง
- กด × ลบคนสุดท้ายออกจากงาน → แถวใน Histogram ยังอยู่
- ช่อง Manpower ในตาราง Gantt: กำหนด Quantity ไม่ได้ · พิมพ์ชื่อใหม่ไม่ได้ · paste `Name[qty]` ได้ (qty 1–99)

**สีและตัวเลข**

- bar = ผลรวมคนของงานที่ทับกัน · **แดง** = เกิน capacity หรือนอกเวลากะ (รวมช่วงพัก เช่น 12:00–13:30)
- ช่อง Capacity **เหลือง** = คนของ**งานเดียว** > capacity · tooltip `The current capacity cannot support the required manpower of {N}.` · Optimize จะไม่ผ่าน · งานทับกันรวมเกิน = bar แดงแต่ช่อง**ไม่**เหลือง
- ช่วงเวลาทำงานมาจาก Working Schedule **ชื่อเดียวกัน**ใน Event · แก้ช่วงเวลา → เส้น capacity เปลี่ยนตอนเปิดหน้าใหม่ แต่ bar ไม่ถูกจัดใหม่
- เลือกแถว / คลิก bar ของ Work หรือ Work Breakdown → timeline เลื่อนไปหา bar · Histogram เหลือเฉพาะคนของงานนั้น · **คลิกซ้ำ = กลับเป็นทั้งหมด**
- Histogram นับเฉพาะ Work Breakdown ที่ผ่าน filter (ถูกยุบยังนับ) · `View Only Used Resource` (Custom View · default OFF · ETM-7898) ซ่อนคนที่ไม่ถูกใช้

## 7. Save · Undo · Unsaved · Concurrency

ทุกอย่างที่แก้เป็น**ร่างในหน้า** จนกด `Save` ของหน้า · Save เขียนข้อมูล Work / Work Breakdown **กลับไป Worklist** ด้วย

| เหตุการณ์ | สิ่งที่เห็น |
| --- | --- |
| กด Save | modal `Save Shutdown Logic and Update Worklist` → toast `Save Success` / `Save Shutdown Logic Successfully.` |
| Save ไม่สำเร็จ (server ส่งรหัส `GANTT_EDIT_FAILED`) | toast `Save Failed` / `Save Shutdown Logic Failed.` |
| Save ไม่สำเร็จ (error อื่น) | toast `Server Error` / `An unexpected error occurred. Please try again.` · ค่าที่แก้ยังอยู่ · Save ยังกดได้ |
| ออกจากหน้าตอนยังไม่ save | `Unsaved Change` · `Discard Change` / `Continue Editing` (Job Owner ไม่มี) |

- Save ส่งหลายขั้น: ผล Optimize → ต้นไม้ทั้งหมด (รวมเส้น) → calendar → filter → โหลดหน้าใหม่ · ขั้นหลังพัง = ขั้นแรกถูก save ไปแล้ว · บน plan ใหญ่ Save ใช้ > 30 วินาที
- เปลี่ยน filter อย่างเดียวก็ทำให้ Save enable · สถานะยุบ/กางของแถวถูก save (ปุ่มระดับ Expand/Collapse ไม่ถูก save)
- หลัง Save กลุ่มคอลัมน์ที่กางไว้ถูกพับกลับ = ปัญหา (ควรกางค้าง · Benz 23 Nov)
- **Undo** สูงสุด 10 ครั้ง · Save แล้วยัง undo ได้ · **SIMOP / รับผล Optimize / โหลดหน้า ล้างประวัติ** · filter / custom view / focus undo ไม่ได้ · 1 paste = 1 undo · Ctrl+Z ห่าง ≥ 250ms ถือว่าถูก
- **Concurrency**: ไม่มีการเช็คชน ส่งทั้งต้นไม้ → คนที่ save ทีหลังทับ (Last Write Wins)
- ทุกข้อความกฎการจัดงาน = **modal ปุ่ม OK ปุ่มเดียว** ไม่ใช่ toast · อีกอัน: `Unable to Delete Task` / `Deleting this task makes the parent task conflict with its constraint.`

## 8. ฟังก์ชันอื่นในหน้า

| ฟังก์ชัน | สาระสำคัญ |
| --- | --- |
| **Filter Panel** | 13 ส่วน: Platform · Work Header · Description · Activity Group · Priority · Duration · Date · Predecessor · Successor · SIMOP · Working Location (Deck) · Functional Location · Manpower Resource · กางส่วนได้ด้วย chevron เท่านั้น · หลาย filter = AND · ไล่จากล่างขึ้นบน แถวที่แสดง แม่ทุกชั้นแสดง (ETM-8517) · Work Header options ผูกด้วย code จึงครอบทุก Platform · Duration `Between` ต้องใส่ทั้ง min/max · ไม่มีแถวผ่าน = หัวตารางอยู่ ไม่มีข้อความ · TM save filter ได้ JO ใช้ได้แต่ไม่ถูกเก็บ |
| **Focus Critical Path / Dropped Task** | กรองเฉพาะ Work Breakdown (แม่ยังแสดง) · ไม่ save · ไม่มีผล Optimize = disable |
| **Custom View** | ปุ่มระดับซ่อนแถว**ของระดับนั้น** (Collapse all Work Breakdown = เหลือ Platform / Work Header / Work) · Platform ยุบไม่ได้ · `View Only Used Resource` |
| **ไฮไลต์แถว / สีตัวอักษร** (ETM-8034) | คลิกขวา `Highlight Row` · `Change Text Color` บนสุด · 13 สี + `No Color` · ทุกระดับ · save ด้วย Save · undo ได้ · Duplicate copy สี / Paste ไม่ copy |
| **SIMOP** | ปุ่ม `SIMOP` ส่งต้นไม้ที่ยังไม่ save ไปเช็ค → ระบายสี bar · **ล้าง undo** · หน้าต่าง SIMOP เปิดจากคลิกขวา bar Work Breakdown (`Edit SIMOP`) หรือคอลัมน์ SIMOP ในกลุ่ม Dependencies · คอลัมน์ `Description` · `Activities SIMOP Matrix` · `Override Conflict` (Allow / Prohibit) · `SIMOP Status` · ไม่มีคู่ชน = ไม่มีสัญลักษณ์ |
| **Optimize** | ตั้งค่าใน drawer (น้ำหนักรวม 100) · รันเบื้องหลัง \~20 นาที (อย่ารันซ้อน — `Optimization in progress`) · Stop / Cancel · รับผลแล้วต้อง Save · ส่งวัน = Ramp ของ Plan · ไม่สำเร็จ → ปุ่ม `Export Error` (`Optimization_Errors_[Plan]_[YYYYMMDD_HHmm].xlsx`) |
| **Export** | ต้องมีสิทธิ์ Edit · drawer `Export Shutdown Logic` (`File Type` → `Export Mode` → `Timeframe`) · ดูตารางด้านล่าง |
| **Copy / Paste** | คัดลอกหลายช่อง รวม Predecessor / Successor · **คัดลอกทั้งแถว**: คลิกช่อง No. → Ctrl+C/V · **เขียนทับแถวปลายทาง ไม่สร้างแถวใหม่** · กลุ่มคอลัมน์ที่ยุบไม่ถูกคัดลอก · Cut ไม่ได้ · วันที่ผิด = ว่างพื้นแดง · paste ได้เฉพาะแถว leaf |

**Export ทุกแบบ**

| แบบ | ข้อมูลที่ใช้ | ชื่อไฟล์ |
| --- | --- | --- |
| Excel · Overall | **ของที่ save แล้ว** · filter ไม่มีผล · disable ตอนมีของแก้ค้าง | `[Event]_[Plan]_Shutdown_Logic_[YYYYMMDD].xlsx` |
| PDF · Overall | **ของบนจอ รวมที่ยังไม่ save** · filter มีผล · A3 แนวนอน · ต้องครอบทุก task รวมก่อน Ramp Down | `[Event]_[Plan]_Overall_[YYYYMMDD].pdf` |
| PDF · Daily Plan | เหมือนบน · งานอยู่วัน D เมื่อ `End >= D 00:00` และ `Start < D+1 00:00` · `Full Shutdown Timeframe` / `Focus Timeframe` (D-1 ถึง D+2) | ZIP รายเดือน `[Event]_[Plan]_ShutdownLogic_DailyPlan_[YYYYMM].zip` ข้างใน `..._Day[N]_[YYYYMMDD].pdf` |

ข้อความ: `Export Failed` / `Export Shutdown Logic Failed.` · `Export Incomplete` / `Some days could not be exported and were left out: …` · PDF พิมพ์จากฝั่ง BE (บน plan 5,223 task ใช้ 39 นาที)

## 9. Worklist กระทบ Shutdown Logic อย่างไร

หลังบ้านสร้างต้นไม้ใหม่ทุกครั้งที่เปิดหน้า Shutdown Logic → ของที่แก้ใน Worklist **โผล่เมื่อเปิด / refresh** · แท็บที่เปิดค้างไม่อัปเดตเอง · ในทางกลับกัน Save ของ Shutdown Logic เขียนกลับ Worklist

**กฎจับคู่เส้นตอนโหลด** — Work Breakdown ใช้ taskID · Work ใช้ workID · Work Header ใช้ `workHeaderID` · ปลายเส้นหาไม่เจอ = **เส้นหายเงียบ ๆ** และหายถาวรเมื่อ Save ครั้งถัดไป · ตอนโหลดไม่ตรวจเส้นซ้ำ (ไม่ดัน ไม่ตรวจวน)

| ทำอะไรใน Worklist | ผลที่หน้า Shutdown Logic |
| --- | --- |
| Create Work (Manual / Import Excel) | แถวใหม่ · เริ่มที่ **Ramp Down ของ Plan** · ไม่มีเส้น · Resource Calendar · สร้าง Platform / Work Header ให้ถ้ายังไม่มี |
| Edit Work Details: เปลี่ยน Work Header / Platform | Work ย้ายแม่ · เส้นของ Work ตามไป · Work Header เก่าว่าง → เส้นของ Work Header นั้นหาย |
| Edit Breakdown: เพิ่ม task / Add from Typical | แถวใหม่ · ช่วง Work กว้างขึ้น ไม่ดันงานปลายเส้น |
| Edit Breakdown: ลบ task | แถวหาย + เส้นของ task หาย · ไม่ดึงงานปลายเส้น · ลบตัวสุดท้ายไม่ได้ |
| Edit Breakdown: เปลี่ยน Duration / POB / คน | ค่าเปลี่ยนตอนโหลด · ยืด Duration ไม่ดันงานปลายเส้น (ซ้อนทับได้) · ⚠️ Duration จาก Worklist ยังไม่ sync = งาน sprint หน้า ไม่ใช่ defect |
| Delete Work (soft delete) | **ไม่แสดง** · เส้นหาย · Restore แล้วไม่ได้เส้นคืน · ลบใน Worklist มี modal `Delete Work` |
| Duplicate Work · Copy Works to other Worklist · Copy Breakdown | ID ใหม่ · ไม่มีเส้นติดไป · Copy ไป Plan อื่น → หน้าเปิดใต้ Plan ปลายทาง (ถูก) |
| เปลี่ยน Work / Breakdown Status · Import Status (ETM-8394) | **ทุกสถานะแสดง** · ไม่มีผลกับเส้น |
| Worklist Freeze / Plan Inactive | หน้าเว็บไม่ล็อกการแก้ |
| Duplicate Plan | copy ทุกอย่าง (เส้น · constraint · วัน Ramp) **ยกเว้นผล Optimize** · plan ใหม่ Inactive · 🔴 เส้นที่ Work Header หาย (DF-1) |
| Create / Edit Plan: `Ramp Down/Up Date` (ETM-8042) | วันเริ่มตารางของ logic ใหม่ · เส้นตั้ง · Optimize · ชื่อไฟล์ export · แก้ทีหลังงานไม่ขยับ |
| แก้ Deck (ETM-8049) | ค่าที่ตรง Master Data ถูกแก้ตัวสะกดตอน save ทุกทาง |

**หน้า Event › Manpower Resource กระทบด้วย** — แก้ Organic Crew ทีหลัง = แถวที่มีอยู่ไม่เปลี่ยน · Edit Working Schedule → Save → modal `Potential Resource Impact` (`Continue Editing` / `Confirm`) · ลบ Working Schedule = กลับเป็น Default

## 10. หน้าที่เกี่ยวข้องอื่น

| หน้า | เกี่ยวกับ Shutdown Logic อย่างไร | เรื่องที่ต้องรู้ |
| --- | --- | --- |
| **Planning tab / Plan Card** | ต้นทางของ logic · วัน Ramp ของ Plan | `Create Plan` / `Edit Plan` มี `* Ramp Down/Up Date` (default = Planned Date ของ event · Ramp Up = Ramp Down ได้) · 1 Worklist : 1 Shutdown Logic · Active ได้ทีละ Plan · Duplicate Plan เปิด modal `Create Plan` · `Duplicate plan in progress.` · `Last update on` อัปเดตหลัง refresh |
| **Worklist / Edit Work Breakdown** | แหล่ง Work / Breakdown / คน · รับค่ากลับตอน Save | ดูหัวข้อ 9 · `Setting Resource` modal Qty 1–99 เพิ่มชื่อใหม่ได้ · Priority `P1 · P2 · P3 · Pre SD · Post SD` (default P2) · หน้า Worklist ไม่เรียงเอง |
| **Event › Manpower Resource** | Organic Crew → Shift/Capacity · Working Schedule → ช่วงทำงานใน Histogram | Job Owner ไม่เห็น tab · หน้า crew ยอมชื่อซ้ำต่างตัวเล็ก-ใหญ่ · Quantity 1–999 |
| **Edit Shutdown Event** | Shutdown Date ของ event = default ของวัน Ramp | แก้ Planned Date ทีหลัง **ไม่เปลี่ยนวันของ Plan** · event บน Platform เดียวกันห้ามทับกัน (`Shutdown date cannot overlap with other events …`) |
| **Daily Report** | ตาราง task เป็น Bryntum อีกตัว ใช้ต้นไม้ 4 ระดับเดียวกัน | Start/End อยู่ในกลุ่ม **Scheduled** ที่ยุบไว้ · Details ยุบไว้ (Work Number / Activity Group ไม่อยู่ใน DOM) · Freeze = ทั้งหน้า read-only (ปุ่มเป็น `Unfreeze`) · Job Owner แก้ได้แค่ `Actual (%)` ระดับ Breakdown |
| **Timeline tab** | ไม่ใช้วัน Ramp ของ Plan (ยังใช้ Planned Date ของ event) | grid เขียนเอง (ไม่ใช่ AG Grid / Bryntum) · Edit Plan / Update Progress / Add note เฉพาะ TM |
| **Manpower Mob Plan** | snapshot resource จาก Shutdown Logic **ตอนสร้าง item ครั้งแรกเท่านั้น** | รายละเอียดใน `Sprint 21/Sprint21_MobPlan_KnowledgeBase.md` |
| **Equipment Mob Plan** | อยู่ใต้ Plan เดียวกัน · ใช้ Work Header | ตารางเขียนเอง 2 pane · Save เป็น PUT เดียวทุก Work Header |

ทุกหน้าใช้กฎเดียวกัน: คลิก 1 ครั้ง = เลือก (พื้นฟ้า ไม่มีกรอบ) · ดับเบิลคลิก = แก้ · วันที่พิมพ์ได้หลายรูปแบบ (ETM-7902 · 5 หน้า) · `unsavedChangeGuard` ทุกฟอร์ม

## 11. การเรียง

กฎหลักของหน้านี้คือ **A = พจนานุกรมอังกฤษ ไม่สนตัวเล็ก-ใหญ่ อ่านตัวเลขเป็นตัวเลข** (`localeCompare('en', {numeric:true})`) — **ไม่ใช่ Unicode** ตาม CLAUDE.md 2.10 · ทุกที่ที่มีการเรียงต้องเช็คก่อนว่าใช้กฎไหน

| รหัส | กฎ | ลำดับตัวอย่าง (แรก → หลัง) |
| --- | --- | --- |
| A | พจนานุกรม + numeric | (ว่าง) · `_x` · `-x` · `2a` · `10a` · `a2` · `a10` · `abc` · `ABC` · `abd` · `Abd` · `ไทย` |
| B | ตามภาษา browser · ตัวเลขอ่านเป็นตัวอักษร | `10a` ก่อน `2a` · browser ไทย: ไทยขึ้นก่อนอังกฤษ |
| R | ลำดับ Master Data ก่อน แล้วที่เหลือใช้ A |  |
| N | ตามเลขแถว |  |
| API | ไม่เรียง ใช้ลำดับหลังบ้าน |  |

| จุดในหน้า Shutdown Logic | กฎ | ค่าว่าง |
| --- | --- | --- |
| แถว Histogram · ป้ายชื่อคนในช่อง Manpower | A | ท้าย |
| dropdown คน (ช่อง Manpower / modal) · dropdown Shift | API | — |
| ตัวเลือก Resource Calendar · รายการคนใน Optimization Setting | B | — |
| รายการ dependency ใน Setting modal | N | — |
| Filter: Platform · Work Header | R | ท้าย |
| Filter: Priority | `P1 · P2 · P3 · Pre SD · Post SD` แล้ว A | ท้าย |
| Filter: Activity Group · Functional Location · Manpower Resource | A | หน้า |
| Filter: Deck | R แล้ว A | หน้า |
| Filter: Predecessor · Successor | N | หน้า |
| Filter: Description | ตามลำดับแถวใน Gantt | — |

Test data ที่แยกกฎได้ครบ: `abc` `ABC` `Abd` `abd` `a2` `a10` `2a` `10a` `_x` `-x` `ไทย` + ค่าว่าง · รันบน browser ภาษาไทย 1 รอบเพื่อจับจุดที่ใช้ B

## 12. Defect ที่ยืนยันแล้ว และของที่ไม่ใช่ defect

**Defect (Benz ยืนยัน)** — เจออีก ให้ link เข้าตัวเดิม ไม่ต้องเปิดใหม่

| รหัส | อาการ |
| --- | --- |
| DF-1 | Duplicate Plan แล้วเส้นที่ Work Header หาย (4 เส้นเหลือ 3) |
| DF-2 | แก้ข้อความเส้น `9` (Hard) → `9SS` แล้วกลายเป็น Normal (แก้แค่ lag ยัง Hard) |
| DF-3 | Delete Resource ตอนมี filter: งานที่ถูกซ่อนไม่ถูกนับ ไม่ถูกลบชื่อ ไม่มี modal |
| DF-4 | เพิ่มคนจาก dropdown ช่อง Manpower (Resource Calendar) ไม่เช็ค constraint → งานเลย deadline เงียบ ๆ |
| ETM-10094 | Work ที่ย้าย Work Header ผ่าน modal ไม่ไปอยู่ล่างสุด (AC 12.1) |
| ETM-10096 | PDF Daily Focus ที่ zoom Week พิมพ์ทั้งสัปดาห์ |
| ETM-10098 | PDF Overall เริ่มที่ Ramp Down ตัด task ที่เริ่มก่อน |
| ETM-10148 | Duration 45 บนงานที่ทำงานวันละ 1 ชม. ทำ cell แดง (ต้องเทียบชั่วโมงทำงาน) |
| ETM-8513 | แถวแม่ที่ไม่มีลูกทำงานยังอยู่ใน PDF รายวัน |

**ไม่ใช่ defect (Benz ตัดสิน) — ห้าม log ซ้ำ**

- Duration ที่แก้ใน Worklist ยังไม่ไปถึง Shutdown Logic — งาน sprint หน้า
- Resource ที่เพิ่มใน Worklist หลัง logic สร้างแล้วได้ Default / 1 — ผู้ใช้แก้ Capacity เองได้
- วันที่แสดงตาม time zone ของเครื่อง — ไม่ต้องเทสเรื่องเวลาเครื่องบนหน้านี้
- Esc ครั้งแรกคืนค่าแต่ยังแก้อยู่ · End ≤ Start บน Resource / Custom Calendar ขึ้น popup · Duration ยาวขึ้นบน Must Finish On ขึ้น popup แล้วคืนค่า
- Soft ทำงานเหมือน Normal บนหน้าเว็บ

**ยังค้าง (รอ Benz / BA)**: ตอนเปิดหน้าไม่ดันงานที่เส้นผิด · ชื่อไฟล์ export 3 แบบเขียนไม่เหมือนกัน (ETM-5492) · คำสะกดผิด `overlaping` · กลุ่มคอลัมน์พับกลับหลัง Save

## 13. Test data และ Automation tips

**Test data บน QA**

| ชื่อ | อยู่ที่ | ใช้ทำอะไร |
| --- | --- | --- |
| `QA8517 Filter Plan` | event `QA Daily Focus Event` | seed ของ automation · ทดสอบแล้วกด `Discard Change` |
| `QA8415 Test Plan` | event `QA Daily Focus Event` (Inactive) | plan ที่ duplicate มา · มี Work `QA8415-W5` · ลบได้ |
| `QA Focus Plan` | event `QA Daily Focus Event` (25 Feb – 4 Mar 2027) | Export timeframe (ETM-7900) |
| `QA EMP Del A` | event `ART PSD` | Filter Platform / Work Header · Ramp lines |
| plan 5,223 tasks | `ETM8311_BIG_LOGIC_URL` | อ่านอย่างเดียว · โหลด \~40 วิ |
| `Logic For Automate (ห้ามแก้)` | DEV | sanity suite · ห้าม save |

**Selector**

- ไม่มี `data-testid` ทั้งระบบ · หน้า Shutdown Logic ใช้ **Bryntum store** (`window.bryntum.query('gantt')`) ไม่ใช้ DOM · Histogram = `bryntum.query('timelinehistogram')`
- ⚠️ `records` = แถวที่ผ่าน filter · `allRecords` = ทั้งหมด (เคยเกือบเขียนทับ 5,223 แถว)
- Dependency `type`: 0 SS · 1 SF · 2 FS · 3 FF · เลข No. = ลำดับ `taskStore.traverse`
- Undo / Redo = `app-shutdown-undo-redo-button button` nth 0 / 1 · Filter Panel = `app-shutdown-filter-panel` · ปุ่ม = `app-panel-toggle-button[tooltip="Filter Panel"] button`
- Ramp lines = TimeRanges `event-start` / `event-end` → `.b-sch-line[data-id=...]` · เส้นนอกจอไม่อยู่ใน DOM → `gantt.scrollToDate()` ก่อน
- Export: drawer ที่ปิดแล้วยังอยู่ใน DOM → เช็ค `.ant-drawer.ant-drawer-open`

**ข้อควรระวัง**

- Clipboard ใน browser อัตโนมัติใช้ไม่ได้ → เคส copy / paste ทั้งแถว ต้องให้ `clipboard-read/write` หรือลองด้วยมือ
- Save ช้า (> 30 วิ) ใช้ `saveWithConfirm()` timeout 180 วิ · Optimize \~20 นาที ห้ามรันซ้อน · spec ที่ใช้ plan เดียวกันรัน `--workers 1`
- `ResizeObserver loop completed…` ขึ้นตอน zoom = เก็บเป็น finding ไม่ ignore
- พิมพ์ด้วย `pressSequentially` ไม่ใช่ `fill()` (fill ข้าม maxlength)
- Evidence ต้องมีรูปทุก step + กรอบแดง (`evidence()` ใน `utils/xrayEvidence.ts`) · ส่งด้วย `tools/xrayStepEvidence.mjs`

**สถานะชุดทดสอบ ETM-8415** (26 Nov): Test Execution ETM-10033 มี 1,060 เคส · PASSED \~624 · TO DO \~430 · automated 781 + sanity 10 · manual-only 191 · sanity suite บน DEV: `npm run test:sl-sanity` (28 เคส \~5.5 นาที)

## 14. ที่มา

ทุกไฟล์อยู่ในโฟลเดอร์โปรเจกต์ `ETM-Turnaround Manager` · ต้องการรายละเอียดระดับบรรทัดโค้ดให้เปิดไฟล์เหล่านี้

- `Sprint 26/ETM-8415_ShutdownLogic_KnowledgeBase_v3.md` — KB หลัก (ส่วนที่ 8 ชนะส่วนอื่น)
- `Sprint 26/ETM-8415_KB_Src2_Worklist_Effects.md` · `ETM-8415_KB_Src5_Messages.md` — Worklist → Shutdown Logic · ข้อความทุกตัว
- `Sprint 26/ETM-8415_Handover_26Nov.md` — สถานะล่าสุดและงานค้าง
- `ETM-sitemap-for-QA-team.md` — แผนที่เว็บและ TM / JO เห็นต่างกัน
- `Sprint 21/Sprint21_MobPlan_KnowledgeBase.md` — Manpower Mob Plan
- `CLAUDE.md` (root) · `ep-etm-fe-qa-handoff/ep-etm-fe-qa/CLAUDE.md` — กฎที่ Benz ยืนยัน · selector และ spec ทุกหน้า
- Role & Permission: [Role & Permission V.2.xlsx](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)
