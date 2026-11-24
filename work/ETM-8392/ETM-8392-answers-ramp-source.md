# ETM-8392 – คำตอบจาก Dev: เส้น Ramp บน Daily Report Gantt เอาวันที่มาจากไหน

- **Story:** ETM-8392 [Improvement] Daily Report – Ramp Down and Ramp Up Vertical Lines on Gantt Chart
- **Related:** ETM-8042 (Ramp Down/Up Date แยกต่อ Plan + snapshot ใน Daily Report)
- **ตรวจจาก:** stms-be `origin/develop` (v1.26.5), 20 Nov 2026
- **API:** `GET /v1/shutdown-events/:event_id/planning/:plan_id/daily-report`

## สรุปสั้น

`event.startDate` / `event.endDate` ใน response ของ Daily Report คือ **snapshot ของ Ramp Down / Ramp Up Date ของ Plan** ซึ่งบันทึกไว้ตอนสร้าง Daily Report ไม่ใช่ Planned Start / End ของ Event FE อ่านถูก field อยู่แล้ว ฝั่ง BE ไม่ต้องทำอะไรเพิ่ม มีแค่ comment ในโค้ด FE ที่อธิบายผิด

---

## 1. `event.startDate` / `event.endDate` คืออะไร

เป็น **snapshot ของ Ramp Down / Ramp Up Date ของ Plan ที่เก็บใน Daily Report**

- BE อ่านจากคอลัมน์ `daily_report.sdr_ramp_down_date` / `sdr_ramp_up_date`
- ถ้าคอลัมน์เป็น NULL จะใช้ `sde_start_date` / `sde_end_date` ของ Event แทน
- โค้ด: `buildDailyReportEventData` → `dailyReportRampDates` (`src/internal/usecase/daily_report_usecase.go`)

FE ที่ comment ไว้ว่า "the event's own start / end" อธิบายผิด แต่ค่าที่ได้คือ snapshot อยู่แล้ว **FE ไม่ต้องเพิ่ม field ใหม่**

## 2. สอง Plan ใน Event เดียวกัน แต่ Ramp date ต่างกัน

แต่ละ Daily Report ได้วันที่ของ **Plan ตัวเอง** เส้นจึงอยู่คนละตำแหน่ง

- ตอนสร้าง Daily Report ระบบอ่าน Ramp date ของ Plan (`resolvePlanRampDates`) แล้วบันทึกลง `daily_report`
- ถ้า Plan ไม่มี Ramp date จะใช้วันที่ของ Event แทน
- ส่วนนี้ทำเสร็จแล้วใน ETM-8042 ไม่ต้องรอการ์ดหรือ branch ใหม่

## 3. แก้ Ramp date ของ Plan หลังสร้าง Daily Report

**ไม่เปลี่ยน** BE เขียน snapshot นี้แค่ครั้งเดียวตอนสร้าง Daily Report (`saveDailyReport`) ไม่มีจุดไหนอัปเดตทีหลัง

## 4. Extend วันสุดท้าย / ลบวันที่ extend

**ไม่เปลี่ยน** เพราะ Extension ไม่ได้เขียน snapshot นี้ ตรงกับ DEC-062

> ⚠️ response มี `startDate` / `endDate` / `hasExtendedDays` ที่ระดับบนสุดอีกชุดหนึ่ง แยกจาก `event.*` ส่วนนี้ยังไม่ได้ตรวจว่าเปลี่ยนตาม Extension หรือไม่ เส้น Ramp ควรอ่านจาก `event.startDate` / `event.endDate` เท่านั้น

## 5. ขึ้น QA (stms-qa) แล้วหรือยัง

- ETM-8042 merge เข้า develop ใน **v1.26.1** และอยู่ใน `release/1.26.1`, `release/1.26.2`, `release/1.26.4`
- **จากโค้ดยืนยันไม่ได้** ว่าตอนนี้ stms-qa รันเวอร์ชันไหน และได้รัน migration `20261116084501_alter_shutdown_plan_add_ramp_date.sql` แล้วหรือยัง ต้องดูจาก pipeline หรือ deployment ของ QA หรือเช็คตาราง `atlas_schema_revisions` บน DB ของ QA
- ถ้ายังไม่ได้รัน migration ทุก Daily Report จะใช้วันที่ของ Event แทน

---

## หมายเหตุเรื่อง DEC-048 (Daily Report ที่สร้างก่อน ETM-8042)

migration เติมข้อมูลเก่าเป็นสองขั้น

1. Plan ที่ Ramp date เป็น NULL → `spl_ramp_*` = วันที่ Start / End ของ Event
2. Daily Report ที่ snapshot เป็น NULL → `sdr_ramp_*` = Ramp date ของ Plan จากขั้น 1

ผลคือ Daily Report เก่าจะมี snapshot เท่ากับวันที่ของ Event **ณ วันที่รัน migration** และไม่ได้ดึงวันที่ปัจจุบันของ Event ทุกครั้ง ถ้าหลังจากนั้นมีคนแก้ Planned Start / End ของ Event เส้นใน Daily Report เก่าจะไม่ขยับตาม
→ **ถ้า BA ตั้งใจให้ DEC-048 อ่านวันที่ของ Event ตลอด ต้องคุยกันต่อ**

## ข้อแนะนำการเตรียมข้อมูลทดสอบ (ETM-8677 / ETM-8688 / ETM-8797)

ถ้าจะแยก snapshot ออกจากวันที่ของ Event ให้ได้ ต้องเตรียมข้อมูลแบบนี้

1. ตั้ง Ramp date ของ Plan ให้**ต่างจาก Event** และให้สอง Plan ใน Event เดียวกันมีวันที่ต่างกัน **ก่อน**สร้าง Daily Report
2. สร้าง Daily Report → เส้นต้องอยู่ตรง Ramp date ของ Plan นั้น ๆ
3. แก้ Ramp date ของ Plan อีกครั้ง หรือทำ Extension / ลบวันที่ extend → เส้นต้อง**อยู่ที่เดิม**
