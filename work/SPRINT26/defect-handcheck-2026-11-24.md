# เช็คมือ defect Sprint 26 (24 พ.ย. 2026)

QA: https://stms-qa.apps.pttep.com · login เป็น Turnaround Manager

## 1. ETM-8042 F-9: Planned S-Curve ของ Daily Report เก่าจบผิดวัน

- **Daily Report เก่า (Export 5000, ไม่มี snapshot):**
  https://stms-qa.apps.pttep.com/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/75ee62f6-1954-41b4-954d-ab2ca1d183c8/daily-report/31885cb6-33f4-4b5f-94d8-ee1ea1216b77
- **ข้อมูล:** Event Planned Date 17 Jun 2026 10:00 - 15 Jul 2026 06:00 · วันที่ 16 Jun 2026 ถูก freeze ไว้
- **เช็ค:** เปิดกราฟ S-Curve แล้วดูว่าเส้น Planned จบวันไหน
  - ที่ควรเป็น: 15 Jul 2026 + วันที่ขยาย (ถ้ามี) ตาม BA Q9 / AC 8.2 / DEC-048
  - ที่ QA เห็น: จบประมาณ 12 Apr 2027 = วันจบงานสุดท้าย → defect
- ดูก่อนว่า event นี้มีวันที่ขยาย (extended days) ไหม

## 2. ETM-8042 F-10: ปุ่ม Excel กดไม่ได้เมื่อแผนยาว 3 ปี (รอ Dev ตอบ)

- **Plan 3 ปี** "Plan Scenario Long Name Plan Scenario Long Name 12" (15 Feb 2026 08:00 - 15 Feb 2029 20:15), หน้า Shutdown Logic:
  https://stms-qa.apps.pttep.com/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b/planning/cd82b347-1dcd-4b0a-a5f1-f0b236111e89/logics/8b963dd3-fa18-4560-9d66-529725b6ead7
- **เช็ค:** เปิดหน้าใหม่ (ห้ามมีการแก้ที่ยังไม่ Save) → Export Shutdown Logic → ดูว่า `Excel File` กดได้ไหม
  - ถ้ากดไม่ได้ทั้งที่ไม่มีการแก้ค้าง: ETM-5492 บอกว่าไม่มีช่วงสูงสุด และ ETM-3461 AC 1.2 บอกว่าปิดได้เฉพาะตอนมีการแก้ที่ยังไม่ Save
  - เทียบกับ Plan A (10 วัน) ที่กดได้
- ⚠️ ETM-8846 จะลบ Plan นี้ตอนจบเทส ให้เช็คก่อนรัน 8846

## 3. ETM-8049 F-27: Import `Helipad,helipad` โดนปฏิเสธว่าซ้ำ

- **Plan สำหรับทดสอบ "QA ETM-8049 Scratch"** (worklist ว่าง ลบ work ที่สร้างหลังเทส):
  https://stms-qa.apps.pttep.com/shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/e95c9b6a-e347-49d9-8e1b-0f0f6e3d9c4c/worklist/bea32b01-d98f-4952-8c5c-bbffb84d46dd
- **ข้อมูล:** ใน template Import Excel ใส่ 1 Work ที่คอลัมน์ Working Location (Deck) = `Helipad,helipad` (ค่าอื่นใส่ตามปกติ)
- **เช็ค:** Import แล้วดูว่ามี Error ไหม
  - ที่ควรเป็น: รับทั้ง 2 ค่า (BA Q27, DEC-046)
  - ที่ QA เห็น: ไม่รับ บอกว่าค่าซ้ำ (duplicates) → defect
- เทียบ: พิมพ์ `Helipad` กับ `helipad` ในฟอร์ม Create Work ได้ทั้งคู่

## 4. ETM-8449 ETM-9175 / ETM-9177 (log แล้ว 9175 ยังไม่มีรูป)

- **PLAN-20K** "Shutdown Logic: New Plan 20,000 Work", หน้า Shutdown Logic:
  https://stms-qa.apps.pttep.com/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/d584b6ce-458e-4d87-b74f-77d2e4a42794/logics/97600d7c-39c9-4279-bddc-a5a1a9b482fc?years=2026,2027&tab=planning
- ถ้าอยากให้หน้าโหลดเร็วขึ้น ใช้ filter Platform "CBWA" ได้ (708 แถว)
- **ETM-9175:** ให้ทุกแถวกางอยู่และทุกกล่องเป็น − แล้วกดกล่อง Platform → ดูว่ากล่องสลับได้ไหม (ไม่ควรสลับได้) **ถ่ายรูปตอนนี้เพื่อแนบใน 9175**
- **ETM-9177:** กด − ที่ Work Header → กด + ที่ Work Header → ดูว่าแถว Work กลับมาไหม ทั้งที่กล่อง Work ยังเป็น −
- ขั้นตอนเต็มอยู่ใน `work/ETM-8449/defect-drafts-2026-11-24.md`

## 5. ETM-8521 / 8739: ลากมุมขวาล่างเพื่อเลือกหลาย cell (ยังไม่ได้ตัดสิน)

- เปิดหน้า Shutdown Logic หน้าไหนก็ได้ (ใช้ PLAN-20K ข้างบนก็ได้)
- **เช็ค:** คลิก cell ในตาราง Gantt แล้วดูว่ามุมขวาล่างของ cell มีจุดให้ลาก (fill handle) ไหม
  - ETM-2615 AC 1.2 บอกว่าเลือกหลาย cell ได้ 3 แบบ: Shift+click, ลากมุมขวาล่าง, Ctrl+click
  - ถ้าไม่มีจุดให้ลาก: เป็น defect หรือจะตัด step 5 ของ 8739 ออก
