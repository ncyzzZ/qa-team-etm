> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Provided by the team as the validated spec; texts are verbatim from the source workbook/document, so use them as Expected Results without rewording.

# Template: Daily Report Export (Word) — ETM Turnaround

> ที่มา: `Export Template.docx` (SharePoint › TurnaroundManagement)
> ข้อมูลในไฟล์ต้นฉบับเป็น **ตัวอย่าง (dummy / Lorem ipsum)** — template นี้บอกเฉพาะ **โครงสร้าง, field, รูปแบบ และกฎการแสดงผล** ที่เห็นในไฟล์
> ช่องที่เขียนว่า **[ต้องยืนยัน]** = เห็นจากตัวอย่างแต่ไม่มีกฎเขียนไว้ ควรถาม BA ก่อนเขียน Expected Result

---

## 0. โครงสร้างเอกสารโดยรวม

| หน้า | การวางหน้า | Section | เนื้อหา |
|---|---|---|---|
| 1 | แนวตั้ง (Portrait) | Header + Section A–C | ชื่อรายงาน, วันที่, กราฟ S-Curve, ตาราง Key Activities / Area of Concern |
| 2 | แนวตั้ง (Portrait) | Section D | ตาราง Activity Group (Weight / Plan / Actual) |
| 3 | แนวตั้ง (Portrait) | Section E | Attached Image (รูป + คำอธิบาย) |
| 4 | **แนวนอน (Landscape)** | Section F | ตาราง Schedule / Activity รายละเอียด + Gantt |
| 5 | แนวตั้ง | — | **หน้าว่าง** มีแค่ header (โลโก้ซ้ำ 2 อัน) **[ต้องยืนยัน: ตั้งใจหรือเป็น bug]** |

**ทุกหน้ามี Page Header:** โลโก้ PTTEP ชิดซ้าย + เส้นคั่นแนวนอนใต้โลโก้
**Page number:** แสดงที่มุมขวาล่างของแต่ละหน้า

---

## 1. Section A — หัวรายงาน (หน้า 1)

```
Daily Report: {Turnaround Name}
{Report Date} (Daily report cut-off: {Cut-off Time}.) Link to STMS
```

| Field | ตัวอย่าง | รูปแบบ | หมายเหตุ |
|---|---|---|---|
| Report Title | `Daily Report: 2025 Platong Full Shutdown` | ข้อความคงที่ `Daily Report: ` + ชื่อ Turnaround | ตัวหนา ขนาดใหญ่ (Heading) |
| Turnaround Name | `2025 Platong Full Shutdown` | Text | ดึงจากชื่อ Turnaround / Project |
| Report Date | `22 Jun 2025` | `DD Mon YYYY` | ตัวหนา |
| Cut-off Time | `22:00` | `HH:mm` (24 ชม.) | อยู่ในวงเล็บ สีเทา: `(Daily report cut-off: 22:00.)` |
| Link to STMS | `Link to STMS` | Hyperlink | สีฟ้า กดแล้วไปหน้า STMS **[ต้องยืนยัน URL ปลายทาง]** |

---

## 2. Section B — กราฟ S-Curve Progress (หน้า 1)

| องค์ประกอบ | รายละเอียด |
|---|---|
| ประเภทกราฟ | Line chart |
| แกน X | วันที่ รูปแบบ `DD Mon` (ตัวอย่าง: 18 Feb → 22 Feb) |
| แกน Y | เปอร์เซ็นต์ 0% – 100% (ขั้นละ 20%) |
| เส้น **Plan** | เส้นประ สีเหลือง/ส้มอ่อน — แสดงทุกวันจนจบแผน |
| เส้น **Actual** | เส้นทึบ สีเขียวมะกอก — แสดงถึงวันปัจจุบันเท่านั้น |
| Data label | แสดงค่า % บนทุกจุด |
| Legend | ด้านล่างกราฟ: `Plan`, `Actual` |

ตัวอย่างค่า (sample):

| วันที่ | Plan | Actual |
|---|---|---|
| (วันแรก) | 0% | 0% |
| 18 Feb | 0% | 0% |
| 19 Feb | ~39% | ~42.66% |
| 20 Feb | ~71% | — |
| 21 Feb | 100% | — |
| 22 Feb | 100% | — |

> ⚠️ วันที่ในกราฟ (Feb 2025) ไม่ตรงกับ Report Date (22 Jun 2025) — เป็นเพราะข้อมูลตัวอย่าง ตอนทดสอบจริงควรเช็กว่าช่วงวันที่ในกราฟสัมพันธ์กับ Report Date / ช่วง Turnaround **[ต้องยืนยัน]**

---

## 3. Section C — ตารางสรุปประจำวัน 2 คอลัมน์ (หน้า 1)

ตาราง 2 คอลัมน์ 2 แถวหัวข้อ (หัวข้อพื้นเข้ม ตัวหนา)

| ซ้าย | ขวา |
|---|---|
| **Key Activities** | **Activities Plan for Tomorrow** |
| {ข้อความหลายย่อหน้า} | {ข้อความหลายย่อหน้า} |
| **Area of Concern** | **Remark** |
| {ข้อความหลายย่อหน้า} | {ข้อความหลายย่อหน้า} |

| Field | ประเภท | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|
| Key Activities | Long text (หลายย่อหน้า) | Lorem ipsum ... (2 ย่อหน้า) | ขึ้นบรรทัดใหม่ได้ |
| Activities Plan for Tomorrow | Long text | Lorem ipsum ... (1 ย่อหน้า) | |
| Area of Concern | Long text | *(ว่าง)* | ในตัวอย่างว่าง → ช่องว่าง ไม่มี "-" **[ต้องยืนยัน: ค่าว่างให้แสดงอะไร]** |
| Remark | Long text | Lorem ipsum ... (2 ย่อหน้า มีบรรทัดว่างคั่น) | |

---

## 4. Section D — ตาราง Activity Group Progress (หน้า 2)

| Activity Group | Weight (%) | Plan (%) | Actual (%) | Note |
|---|---|---|---|---|
| Pre-SD Works | 2.70% | 100% | 100% | Lorem ipsum ... |
| Process Ramp-Down | 1.49% | 98% | 100% | Lorem ipsum ... |
| PVI : Pressure Vessel Cleaning & Inspection | 14.48% | 100% | 90% | |
| INP : PLFT1 Flare Rope Access Inspection | 13.49% | 85% | 85% | |
| INS : PLCPP and PLOCPP2 10Y PM ICSS | 27.39% | 10% | 30% | |
| ODC : PL OT CyberSecurity Implementation | 19.30% | 80% | 50% | |
| ELE : PLOCPP2 and PLCPP2 PMS Retrofit | 9.74% | 50% | 0% | |
| ECM [Notification] : Anomaly Repair | 10.27% | 0% | 10% | |
| Process De-Isolation & Start-up | 1.14% | 0% | 0% | |
| **Total** | **100.00%** | **100%** | **90%** | |

### 4.1 รูปแบบข้อมูล

| คอลัมน์ | รูปแบบ | หมายเหตุ |
|---|---|---|
| Activity Group | `{Code} : {Name}` หรือชื่ออย่างเดียว | Pre-SD Works, Process Ramp-Down, Process De-Isolation & Start-up ไม่มี Code |
| Weight (%) | ทศนิยม 2 ตำแหน่ง + `%` | ผลรวมทุกแถว = 100.00% |
| Plan (%) | จำนวนเต็ม + `%` | |
| Actual (%) | จำนวนเต็ม + `%` | |
| Note | Long text | ว่างได้ |
| แถว Total | ตัวหนา, พื้นหลังเข้มเหมือนหัวตาราง | Weight = ผลรวม; สูตร Plan/Actual รวม **[ต้องยืนยัน: weighted average หรือค่าอื่น]** |

### 4.2 กฎสี (เห็นจากตัวอย่าง) **[ต้องยืนยันทั้งหมด]**

| เงื่อนไข | การแสดงผล | ตัวอย่างในไฟล์ |
|---|---|---|
| ค่า Plan หรือ Actual = 100% | **พื้นหลังเซลล์สีเขียว** | Pre-SD (Plan+Actual), Ramp-Down (Actual), PVI (Plan) |
| Actual < Plan | **ตัวเลข Actual สีแดง** | PVI 90<100, ODC 50<80, ELE 0<50 |
| Actual > Plan | **ตัวเลข Actual สีเขียว** | INS 30>10, ECM 10>0 |
| Actual = Plan (และไม่ใช่ 100%) | สีปกติ | INP 85=85, De-Isolation 0=0 |
| Actual > Plan และ Actual = 100% | พื้นเขียว ตัวเลขสีปกติ | Ramp-Down 98→100 |
| แถว Total | ไม่ใช้กฎสี (Actual 90 < Plan 100 แต่ไม่แดง) | Total |

---

## 5. Section E — Attached Image (หน้า 3)

ตาราง 2 คอลัมน์ หัวตาราง `Attached Image` (merge เต็มแถว พื้นเข้ม)
แต่ละรูปใช้ 2 แถว: **แถวรูป** + **แถวคำอธิบาย (Caption)** ใต้รูป

| ช่อง | รูป | Caption (จัดกลาง) |
|---|---|---|
| ซ้าย-1 | รูปแนวตั้ง (Flare) | PLCPP Flare Light on Lorem ipsum ... (ข้อความยาว ตัดบรรทัด) |
| ขวา-1 | Screenshot แนวนอน | PLCPP Production Train#1 Gas Deliver |
| ซ้าย-2 | รูปแนวนอน (งานนั่งร้าน) | Desc 100 Cha - Lorem ipsum ... |
| ขวา-2 | *(ว่าง)* | *(ว่าง)* |

| กฎ | รายละเอียด |
|---|---|
| ลำดับการวาง | ซ้าย → ขวา แล้วขึ้นแถวใหม่ (2 รูปต่อแถว) |
| จำนวนรูปเป็นเลขคี่ | ช่องขวาสุดท้ายเว้นว่าง (ทั้งรูปและ caption) |
| ขนาดรูป | ย่อให้พอดีความกว้างคอลัมน์ คงสัดส่วนเดิม (แนวตั้ง/แนวนอนผสมกันได้) |
| Caption | ตัวอย่างยาว ~100 ตัวอักษร (`Desc 100 Cha`) ตัดบรรทัดอัตโนมัติ **[ต้องยืนยัน max length]** |
| ไม่มีรูปเลย | **[ต้องยืนยัน: ซ่อน section หรือแสดงตารางว่าง]** |

---

## 6. Section F — ตาราง Activity Schedule + Gantt (หน้า 4, Landscape)

> ในไฟล์ตัวอย่าง section นี้เป็น **ภาพ (screenshot) ของหน้าจอ Schedule** วางลงในเอกสาร ไม่ใช่ตาราง Word ที่แก้ไขได้ **[ต้องยืนยัน: export จริงเป็นรูปหรือตาราง]**

### 6.1 คอลัมน์

| กลุ่มหัว | คอลัมน์ | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|
| — | No. | 1, 2, 3 … | เรียงต่อเนื่องทุกแถว (รวม parent/child) |
| — | (Icon) | 🔴 ไอคอนสีแดงบางแถว | **[ต้องยืนยันความหมาย เช่น Critical]** |
| Details | Description | `500567942 : PM ME 2Y DESANDER H...` | มีลูกศร ˅ ขยาย/ยุบ, ย่อหน้าตามระดับ, ข้อความยาวถูกตัดด้วย `...`, มี tag เช่น `Group 1`, `Ramp Down` |
| Details | Work Number | `500567942`, `TBC`, `-` | |
| Details | Activity Group | `Group 1`, `Ramp Down`, `-` | |
| — | Job Owner | `Saranya T` | รูปแบบ `ชื่อ + อักษรย่อนามสกุล` |
| Scheduled | Duration | `48.00` | ทศนิยม 2 ตำแหน่ง (ชั่วโมง) มีไอคอนปฏิทิน |
| Scheduled | Start Date | `19 Feb, 00:00` | `DD Mon, HH:mm` (แถว parent ถูกตัดเป็น `19 Feb, 00...`) |
| Scheduled | End Date | `21 Feb, 00:00` | `DD Mon, HH:mm` |
| — | Manpower | `Mechanic[1]` `CR3[5]` `+2` | chip `{Skill}[{จำนวน}]`, เกินพื้นที่แสดง `+N` |
| — | Man-hrs. | `288.00` | ทศนิยม 2 ตำแหน่ง |
| — | Plan (%) | `33%` | |
| — | Actual (%) | `40%` | |
| Gantt | วันที่ (18–22) | หัว `Feb 2025` | แท่ง Plan + แถบ Actual สีเหลืองใต้แท่ง |

### 6.2 ลำดับชั้นข้อมูล (Hierarchy)

```
Level 0  PLCPP2                                   (Platform / Area)
 └ Level 1  Operation / Electrical and Instrument (PM) / Mechanical (CM)   (Discipline)
    └ Level 2  {Work Number} : {Work Order Name}   (ตัวหนา)
       └ Level 3  {Activity Name}                  (ตัวปกติ สีอ่อนกว่า)
```

| ระดับ | ตัวหนา | ค่า "-" ที่พบ |
|---|---|---|
| Level 0–1 (กลุ่ม) | ✔ | Work Number, Activity Group, Job Owner, Manpower, Man-hrs. = `-` |
| Level 2 (Work Order) | ✔ | Work Number อาจเป็น `-` หรือ `TBC` |
| Level 3 (Activity) | ✘ | Work Number = `-` |

### 6.3 Gantt bar (เห็นจากตัวอย่าง) **[ต้องยืนยัน]**

| ระดับ | สีแท่ง |
|---|---|
| กลุ่ม / Work Order | น้ำเงินเทา / teal |
| Activity | เขียว |
| Actual progress | แถบเส้นเหลืองใต้แท่ง |

---

## 7. จุดที่ควรยืนยันก่อนเขียน TC (สรุป)

| # | ประเด็น | Section |
|---|---|---|
| 1 | URL ของ "Link to STMS" | A |
| 2 | ช่วงวันที่ในกราฟสัมพันธ์กับ Report Date อย่างไร | B |
| 3 | ช่องข้อความว่าง แสดงช่องว่าง หรือ `-` | C, D |
| 4 | สูตร Plan/Actual ในแถว Total | D |
| 5 | กฎสี (เขียว 100%, แดง Actual<Plan, เขียว Actual>Plan) ถูกต้องหรือไม่ | D |
| 6 | ไม่มีรูปแนบ — ซ่อน section หรือไม่ | E |
| 7 | ความยาวสูงสุดของ Caption | E |
| 8 | Section F ออกเป็นรูปหรือตาราง | F |
| 9 | ไอคอนแดงในคอลัมน์ที่ 2 หมายถึงอะไร | F |
| 10 | หน้า 5 ว่างและโลโก้ซ้ำ 2 อัน — ตั้งใจหรือเป็น bug | ทั้งเอกสาร |
