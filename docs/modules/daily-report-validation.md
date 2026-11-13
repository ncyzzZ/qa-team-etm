> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Provided by the team as the validated spec; texts are verbatim from the source workbook/document, so use them as Expected Results without rewording.

# Daily Report – Validation & Confirmation/Result Specification

> แหล่งที่มา: `Daily Report Validation&Result.xlsx` (3 sheets: `Confirmation&Result`, `Create, Edit Plan Validation`, `Attached Image`)
> ข้อความ (Title / Message / Button) ในเอกสารนี้คัดลอกจากไฟล์ **ตามตัวอักษร (verbatim)** ใช้เป็น Expected Result ได้ทันที — ห้ามแก้คำ/ตัวพิมพ์เอง
> จุดที่สงสัยว่า Spec ผิด/ไม่ครบ ถูกรวบรวมไว้ที่หัวข้อ **[7. Spec Issues / Open Questions](#7-spec-issues--open-questions)** — ควรเคลียร์กับ BA ก่อนปิด TC
> หมายเหตุ: ช่อง "Figma Link" ในไฟล์ต้นทางว่าง (ไม่มีลิงก์)

---

## 1. คำจำกัดความ (Result Types)

| Type | ความหมาย | ปุ่ม |
|---|---|---|
| **Toast - Success** | Toast แจ้งสำเร็จ (Title + Message) | ไม่มี |
| **Toast - Fail** | Toast แจ้งล้มเหลว (Title + Message) | ไม่มี |
| **Confirmation Modal - Style 1** | Modal แจ้งเตือน/ยืนยัน | ตาม Spec แต่ละรายการ (1 หรือ 2 ปุ่ม) |
| **Confirmation Modal - Style 2** | Modal ยืนยันการลบ | `Delete`, `Cancel` |
| **Inline Error** | ข้อความ error แสดงใต้/ข้าง field | ไม่มี |

**Post-action "กด OK แล้ว Refresh"** = หลังผู้ใช้กดปุ่ม `OK` ระบบต้อง Refresh หน้า/ข้อมูลให้เป็นสถานะล่าสุด (ใช้กับรายการที่ระบุใน Notes เท่านั้น)

---

## 2. Page: View Planning Item

### 2.1 Create Plan
**Trigger:** Click Save Button in Create Plan Modal

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-01 | Create Success | Toast - Success | `Create Success` | `Create Plan Successfully` | – | – |
| CR-02 | Create Fail | Toast - Fail | `Create Failed` | `Create Plan Failed` | – | – |

### 2.2 Edit Plan
**Trigger:** Click Edit Plan *(ดู Issue I-02)*

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-03 | Edit Success | Toast - Success | `Edit Success` | `Edit Plan Successfully` | – | – |
| CR-04 | Edit Fail | Toast - Fail | `Edit Failed` | `Edit Plan Failed` | – | – |

### 2.3 Delete Plan
**Trigger:** Click Delete Plan

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-05 | (แสดงเสมอเมื่อกด Delete Plan) | Confirmation Modal - Style 2 | `Delete Plan` | `Are you sure you want to delete the selected plan?` | `Delete`, `Cancel` | – |

### 2.4 Confirm Delete Plan
**Trigger:** Click Delete Button (ใน Modal CR-05)

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-06 | Delete Success | Toast - Success | `Delete Success` | `Delete Plan Successfully` | – | – |
| CR-07 | Delete Fail | Toast - Fail | `Delete Failed` | `Delete Plan Failed` | – | – |
| CR-08 | Plan Has Been Deleted | Confirmation Modal - Style 1 | `Unable to Delete Plan` | `The plan has already been deleted.` | `OK` | กด OK แล้ว Refresh |

### 2.5 Create Daily Report
**Trigger:** Click Create Button in Daily Report Card

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-09 | Create Success | Toast - Success | `Create Success` | `Create Daily Report Successfully` | – | – |
| CR-10 | Create Fail | Toast - Fail | `Create Failed` | `Create Daily Report Failed` | – | – |
| CR-11 | Daily Report Already Created | Confirmation Modal - Style 1 | `Unable to Create Daily Report` | `The daily report has already been created.` | `OK` | กด OK แล้ว Refresh |

### 2.6 Delete Daily Report
**Trigger:** Click Delete Daily Report

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-12 | (แสดงเสมอเมื่อกด Delete Daily Report) | Confirmation Modal - Style 2 | `Delete Daily Report` | `Are you sure you want to delete the selected daily report?` | `Delete`, `Cancel` | – |

### 2.7 Confirm Delete (Daily Report)
**Trigger:** Click Delete Button (ใน Modal CR-12)

| ID | Condition (ตามไฟล์) | Type | Title (ตามไฟล์) | Message (ตามไฟล์) | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-13 | Create Success ⚠️ | Toast - Success | `Create Success` ⚠️ | `Create Daily Report Successfully` ⚠️ | – | – |
| CR-14 | Create Fail ⚠️ | Toast - Fail | `Create Failed` ⚠️ | `Create Daily Report Failed` ⚠️ | – | – |
| CR-15 | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | `Unable to Delete Daily Report` | `The daily report has already been deleted.` | `OK` | กด OK แล้ว Refresh |

> ⚠️ CR-13/CR-14 น่าจะ copy มาผิดจาก Create Daily Report — ดู Issue I-01

### 2.8 View Daily Report (จาก View Planning Item)
**Trigger:** Click Daily Report Card or Click View Daily Report

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-16 | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | `Unable to View Daily Report` | `The daily report has already been deleted.` | `OK` | กด OK แล้ว Refresh |

---

## 3. Page: View Daily Report

### 3.1 Change Report Date
**Trigger:** Change Report Date to View

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-17 | Unsaved Change | Confirmation Modal - Style 1 | `Unsaved Change` | `Are you sure you want to change the report date? Changes you made to the report data will not be saved.` | `Continue Editing`, `Discard Change` | – |
| CR-18 | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | `Unable to View Daily Report` | `The daily report has already been deleted.` | `OK` | กด OK แล้ว Refresh |
| CR-19 | Daily Report Already Unfrozen | Confirmation Modal - Style 1 | `Unable to View Daily Report` | `The daily report for the selected date is not available for viewing` *(ไม่มีจุดท้ายประโยค)* | `OK` | กด OK แล้ว Refresh |

### 3.2 Change Cut-off Time
**Trigger:** Click Save Button in Change Daily Report Cut-off Modal

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-20 | Save Success | Toast - Success | `Save Success` | `Change Daily Report Cut-off Successfully` | – | – |
| CR-21 | Save Fail | Toast - Fail | `Save Failed` | `Change Daily Report Cut-off Failed` | – | – |

### 3.3 Freeze Daily Report
**Trigger:** Click Freeze Button

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-22 | Freeze Success | Toast - Success | `Freeze Success` | `Freeze Daily Report Successfully` | – | – |
| CR-23 | Freeze Fail | Toast - Fail | `Freeze Failed` | `Freeze Daily Report Failed` | – | – |
| CR-24 | Daily Report Already Frozen | Confirmation Modal - Style 1 | `Unable to Freeze Daily Report` | `This report has already been frozen and cannot be frozen again.` | `OK` | กด OK แล้ว Refresh |
| CR-25 | Previous Daily Report Not Frozen | Confirmation Modal - Style 1 | `Unable to Freeze Daily Report` | `The previous daily report must be frozen before freezing this report.` | `OK` | กด OK แล้ว Refresh |
| CR-26 | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | `Unable to View Daily Report` ⚠️ | `The daily report has already been deleted.` | `OK` | กด OK แล้ว Refresh |
| CR-27 | Extend Daily Report (Freeze ขณะยังมี task ไม่ complete) | Confirmation Modal - Style 1 | `Extend Daily Report` | `To freeze this daily report with incomplete tasks, the system must extend the report period. Are you sure you want to freeze this report?` | `Confirm`, `Cancel` | – |
| CR-28 | Delete Extended Day (Freeze แล้ว task complete ทั้งหมด และมีวัน extend เกิน) | Confirmation Modal - Style 1 | `Delete Extended Days` | `Freezing this daily report will make all tasks complete.`⏎`The system will remove the extended report days that are no longer needed. Are you sure you want to freeze this report?` *(มีขึ้นบรรทัดใหม่หลังประโยคแรก)* | `Confirm`, `Cancel` | – |

### 3.4 Unfreeze Daily Report
**Trigger:** Click Unfreeze Button

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-29 | Unfreeze Success | Toast - Success | `Unfreeze Success` | `Unfreeze Daily Report Successfully` | – | – |
| CR-30 | Unfreeze Fail | Toast - Fail | `Unfreeze Failed` | `Unfreeze Daily Report Failed` | – | – |
| CR-31 | Daily Report Already Unfrozen | Confirmation Modal - Style 1 | `Unable to Unfreeze Daily Report` | `This daily report has already been unfrozen and cannot be unfrozen again.` | `OK` | กด OK แล้ว Refresh |
| CR-32 | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | `Unable to View Daily Report` ⚠️ | `The daily report has already been deleted.` | `OK` | กด OK แล้ว Refresh |

### 3.5 Save Daily Report
**Trigger:** Click Save Button

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-33 | Save Success | Toast - Success | `Save Success` | `Save Daily Report Successfully` | – | – |
| CR-34 | Save Fail | Toast - Fail | `Save Failed` | `Save Daily Report Failed` | – | – |
| CR-35 | Daily Report Already Frozen | Confirmation Modal - Style 1 | `Unable to Save Daily Report` | `This daily report is already frozen and cannot be saved.` | `OK` | กด OK แล้ว Refresh |
| CR-36 | Previous Daily Report Not Frozen | Confirmation Modal - Style 1 | `Unable to Save Daily Report` | `The previous daily report must be frozen before saving this report.` | `OK` | กด OK แล้ว Refresh |
| CR-37 | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | `Unable to View Daily Report` ⚠️ | `The daily report has already been deleted.` | `OK` | กด OK แล้ว Refresh |
| CR-38 | % Plan Validation | Confirmation Modal - Style 1 | `Unable to Save Daily Report` | `Some data is invalid.` | `OK` | กด OK แล้ว Refresh ⚠️ |

### 3.6 Leave Page
**Trigger:** Click Back Button or Change Page Using Side Menu

| ID | Condition | Type | Title | Message | Button(s) | Post-action |
|---|---|---|---|---|---|---|
| CR-39 | (มีการแก้ไขที่ยังไม่ Save — ดู Issue I-08) | Confirmation Modal - Style 1 | `Unsaved Change` | `Are you sure you want to leave this page? Change you made will not be saved.` | `Continue Editing`, `Discard Change` | – |

---

## 4. Field Validation: Create / Edit Plan (Modal)

| ID | Field | Input Type | Required | Max Character | Validation | Error Style | Message |
|---|---|---|---|---|---|---|---|
| VP-01 | Plan Name | Text Field | **Yes** | 50 (String) | Unique (ภายใน Event เดียวกัน) | Inline Error | `This plan name is already exist in this event.` |
| VP-02 | Description | Free Text | No | 200 (String) | – | – | – |

**Boundary ที่ควรเทส**
- Plan Name: 0 (ว่าง), 1, 49, 50, 51 ตัวอักษร
- Description: 0 (ว่าง), 199, 200, 201 ตัวอักษร
- Plan Name ซ้ำกับ Plan อื่นใน Event เดียวกัน → แสดง VP-01
- Plan Name ซ้ำกับ Plan ใน Event อื่น → ต้องบันทึกได้ (เพราะ Unique แค่ "in this event")
- Edit Plan โดยไม่เปลี่ยนชื่อ (ชื่อเดิมของตัวเอง) → ไม่ควรขึ้น VP-01

---

## 5. Field Validation: Attached Image

| ID | Field | Input Type | Required | Validation | Error Style | Message |
|---|---|---|---|---|---|---|
| VI-01 | Image | File Upload | No | Duplicate File Name | Inline Error | `The file [File name] already exists.` |
| VI-02 | Image | File Upload | No | File Type Error (อนุญาตเฉพาะ .png, .jpg, .jpeg) | Inline Error | `The file type must be .png, .jpg, .jpeg.` |
| VI-03 | Image | File Upload | No | File Name Error (อนุญาตเฉพาะ A-Z, a-z, 0-9, `_`, `-`, `( )`, `.`) | Inline Error | `The file name "[File Name]" contains invalid characters. Only letters (A-Z, a-z), numbers (0-9), underscores (_), hyphens (-), parentheses ( ), and periods (.) are allowed.` |
| VI-04 | Image | File Upload | No | File Upload Limit Exceeded (สูงสุด 10 ไฟล์) | Inline Error | `The number of file must not exceed 10.` |
| VI-05 | Image | File Upload | No | File Size Exceeded (สูงสุด 9MB ต่อไฟล์) | Inline Error | `The file size must not exceed 9MB.` |

> `[File name]` / `[File Name]` = placeholder ต้องถูกแทนด้วยชื่อไฟล์จริง

**Boundary ที่ควรเทส**
- จำนวนไฟล์: 0, 1, 9, 10, 11
- ขนาดไฟล์: < 9MB, = 9MB, > 9MB (เช่น 9MB + 1 byte)
- นามสกุล: `.png`, `.jpg`, `.jpeg` (ผ่าน) / `.gif`, `.pdf`, `.bmp`, ไฟล์ไม่มีนามสกุล (ไม่ผ่าน) / ตัวพิมพ์ใหญ่ `.PNG`, `.JPG` (ดู Issue I-12)
- ชื่อไฟล์: มีช่องว่าง, ภาษาไทย, `@ # $ % & !` → ไม่ผ่าน VI-03 / มี `_ - ( ) .` → ผ่าน
- อัปโหลดไฟล์ชื่อซ้ำกับไฟล์ที่แนบอยู่แล้ว → VI-01

---

## 6. Coverage Summary

| Section | จำนวน Rule |
|---|---|
| View Planning Item (CR-01 – CR-16) | 16 |
| View Daily Report (CR-17 – CR-39) | 23 |
| Create/Edit Plan Field Validation (VP-01 – VP-02) | 2 |
| Attached Image Validation (VI-01 – VI-05) | 5 |
| **รวม** | **46** |

---

## 7. Spec Issues / Open Questions

ควรยืนยันกับ BA ก่อนใช้เป็น Expected Result สุดท้าย:

| # | Rule | ประเด็น |
|---|---|---|
| I-01 | CR-13, CR-14 | Confirm Delete Daily Report แต่ Condition/Title/Message เป็น `Create Success` / `Create Daily Report Successfully` และ `Create Failed` / `Create Daily Report Failed` — น่าจะต้องเป็น `Delete Success` / `Delete Daily Report Successfully` และ `Delete Failed` / `Delete Daily Report Failed` |
| I-02 | CR-03, CR-04 | Trigger ของ Edit Plan เขียนว่า "Click Edit Plan" — ควรเป็น "Click Save Button in Edit Plan Modal" หรือไม่ (เทียบกับ Create Plan) |
| I-03 | CR-26, CR-32, CR-37 | Action เป็น Freeze / Unfreeze / Save แต่ Title เป็น `Unable to View Daily Report` — ควรเป็น `Unable to Freeze/Unfreeze/Save Daily Report` หรือไม่ |
| I-04 | CR-19 | Condition "Daily Report Already Unfrozen" ตอนเปลี่ยนวันที่ดูรายงาน — ความหมายไม่ชัด (หมายถึงรายงานวันนั้นยังไม่พร้อมให้ดู?) และ Message ไม่มีจุด `.` ท้ายประโยคต่างจากรายการอื่น |
| I-05 | CR-27, CR-28 | ระบุเป็น Style 1 แต่มี 2 ปุ่ม (`Confirm`, `Cancel`) — ยืนยัน Style ที่ถูกต้อง; และยังไม่ระบุผลลัพธ์หลังกด Confirm/Cancel (เช่น Confirm แล้วขึ้น Toast CR-22 หรือไม่) |
| I-06 | CR-28 | Condition = "Delete Extended Day" แต่ Title = `Delete Extended Days` (มี s) — ยืนยันคำที่ถูกต้อง; ยืนยันว่าต้องขึ้นบรรทัดใหม่ใน Message |
| I-07 | CR-38 | "% Plan Validation" ไม่ระบุว่า invalid เงื่อนไขอะไร (ช่วงค่า %, เกิน 100%, ค่าติดลบ?) และหลังกด OK ให้ Refresh — ข้อมูลที่ผู้ใช้กรอกจะหายหรือไม่ |
| I-08 | CR-39 | ไม่ระบุ Condition — ต้องยืนยันว่า Modal ขึ้นเฉพาะเมื่อมี unsaved change เท่านั้นหรือขึ้นทุกครั้ง; และผลของปุ่ม `Continue Editing` / `Discard Change` ทั้ง CR-17 และ CR-39 ยังไม่ระบุ |
| I-09 | CR-05, CR-12 | ไม่ระบุผลเมื่อกด `Cancel` (คาดว่าปิด Modal โดยไม่ลบ) |
| I-10 | Toast ทั้งหมด | ไม่ระบุตำแหน่ง/ระยะเวลาแสดง/การปิด Toast และหลัง Success มีการ refresh list หรือปิด Modal หรือไม่ |
| I-11 | VP-01 | Plan Name เป็น Required แต่ **ไม่มี Error Message กรณีว่าง**; ไม่ระบุพฤติกรรมเมื่อเกิน 50 ตัว (บล็อกการพิมพ์ หรือแสดง error); ไม่ระบุว่าเช็ค Unique แบบ case-sensitive / trim space หรือไม่; ไม่ระบุเวลาที่เช็ค (on blur / on save). Message มี grammar ผิด `is already exist` (ถ้าแก้เป็น `already exists` ต้องอัปเดต TC) |
| I-12 | VI-02 | ไม่ระบุว่านามสกุลตัวพิมพ์ใหญ่ (`.PNG`, `.JPG`) ผ่านหรือไม่ |
| I-13 | VI-03 | ไฟล์ต้นทางมีขึ้นบรรทัดใหม่ต่อท้าย Message; Spec เขียน "parentheses ( )" แต่ขัดแย้งกับเรื่อง space — ยืนยันว่า **space ไม่อนุญาต** |
| I-14 | VI-04, VI-05 | `number of file` grammar (ควรเป็น files?); 9MB = 9×1024×1024 bytes หรือ 9,000,000 bytes; Limit 10 ไฟล์นับรวมไฟล์ที่แนบไว้แล้วหรือไม่; ถ้าเลือกหลายไฟล์พร้อมกันแล้วบางไฟล์ไม่ผ่าน ไฟล์ที่ผ่านถูกอัปโหลดหรือไม่ |
| I-15 | ทั้งไฟล์ | ช่อง Figma Link ว่าง — ไม่มีลิงก์ UI อ้างอิง |
