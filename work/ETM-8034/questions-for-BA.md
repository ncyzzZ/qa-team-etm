# ETM-8034 คำถามถึง BA (ก่อนเขียน Test Case)

Story: [Improvement] Shutdown Logic - Row Highlight and Text Color in Gantt Table
สถานะ: Ready For Development · ไม่มีคอมเมนต์ · ⭐ = กระทบ Expected Result โดยตรง ควรตอบก่อน

## Context menu และ palette

1. (ปิดแล้ว: 13 ช่อง = No Color + 12 สี ตามที่ผู้ใช้ยืนยัน, ลำดับตามตารางท้ายไฟล์) เหลือถามเล็กน้อย: เมื่อชี้เมาส์ที่ช่องสีมี tooltip หรือชื่อสีไหม? ถ้ามี ขอข้อความ
2. ⭐ ถ้าเลือกหลายแถวพร้อมกัน (multi-select) แล้วคลิกขวา สีใช้กับทุกแถวที่เลือกหรือเฉพาะแถวที่คลิกขวา?
3. ใน Figma ช่องที่ถูกเลือก/hover มีกรอบสีฟ้า (เช่น No Color และสีชมพูใน Change Text Color) กรอบนี้คือ hover หรือ "สีที่ใช้อยู่ตอนนี้" (selected)? เมนู Highlight Row / Change Text Color แสดงสีปัจจุบันไหม? ถ้าแถวมีสีอยู่แล้วแล้วเลือกสีเดิมซ้ำ เกิดอะไรขึ้น?
4. ⭐ ผู้ใช้ไม่มีสิทธิ์ (AC 1.5): เมนูอื่นที่มีอยู่เดิมยังขึ้นตามปกติใช่ไหม? ถ้าไม่มีสิทธิ์และไม่มีเมนูอื่นเลย คลิกขวาแล้วขึ้นอะไร?

## ขอบเขตการลงสี (AC 2, 3)

5. ⭐ "Whole table row" ครอบคลุมคอลัมน์ไหนบ้าง (รวมคอลัมน์ frozen/fixed, แถบ Gantt bar ด้านขวา, ปุ่ม expand/collapse, ไอคอนในเซลล์)? Text Color เปลี่ยนสีไอคอน/ลิงก์ในแถวด้วยไหม?
6. ⭐ ลงสีที่ระดับ Platform / Work Header แล้วแถวลูก (Work, Work Breakdown) ได้สีตามด้วยไหม หรือลงสีเฉพาะแถวที่เลือก? ถ้าลูกมีสีของตัวเองอยู่แล้ว สีไหนชนะ?
7. ลงสีแล้วย่อ (collapse) / ขยาย (expand) / เลื่อนลำดับแถว / copy-paste แถว สีตามแถวไปด้วยไหม? (Copy & Paste อยู่ใน ETM-8035)
8. แถวใหม่ที่เพิ่มหรือแทรกจากแถวที่มีสี ได้สีตามแถวต้นทางหรือเป็นค่าเริ่มต้น?

## Condition Colors (AC 4)

9. ⭐ "Layer ที่ผสมกับสี highlight" คือสูตรอะไร (opacity เท่าไร, สีไหนอยู่บน)? ต้องการค่าจาก Figma node 163-807247 เพื่อเขียน Expected Result ของ disabled cell และ validation error
10. Text Color ชนกับ condition color ของตัวอักษร (เช่น error ตัวแดง) สีไหนชนะ? ความคมชัดของสี text กับ highlight (เช่น text เหลืองบนพื้นเหลือง) มีกฎป้องกันไหม?
11. สถานะ hover / selected / focus ของแถว ทับสี highlight อย่างไร?

## การบันทึก (AC 5)

12. ⭐ ถ้าเปลี่ยนสีแล้วไม่กด Save แล้วออกจากหน้า มี dialog เตือนก่อนออกไหม? ถ้าไม่ สีที่เปลี่ยนหายใช่ไหม?
13. ถ้าผู้ใช้สองคนเปลี่ยนสีแถวเดียวกันพร้อมกัน ใช้ตามคนที่ Save ทีหลังใช่ไหม? มี conflict message ไหม?
14. การเปลี่ยนสีอย่างเดียว (ไม่แก้ข้อมูลอื่น) ทำให้ปุ่ม Save เปิดใช้งานไหม? ปุ่ม Save/ไอคอน "มีการเปลี่ยนแปลง" ทำงานเหมือนแก้ข้อมูลปกติใช่ไหม?
15. สีผูกกับ Shutdown Logic version/plan ใด? ถ้ามี version หรือ copy Shutdown Logic สีถูกคัดลอกไปด้วยไหม?

## Undo / Redo (AC 6)

16. ⭐ การเลือกสีหลายแถวพร้อมกัน นับเป็น 1 ขั้น Undo หรือแยกตามแถว? ลำดับกับการแก้ข้อมูลอื่นรวมใน history เดียวกันใช่ไหม? หลัง Save แล้ว Undo ยังย้อนสีได้ไหม?

## Export PDF (AC 7)

17. ⭐ PDF แสดงสีตรงกับหน้าจอทั้ง highlight และ text, รวมถึง condition colors ที่ผสมแล้วด้วยไหม? ถ้าผู้ใช้ไม่ได้ Save สีที่เปลี่ยน PDF ใช้สีที่ Save ไว้หรือสีบนหน้าจอ? ตอนพิมพ์ขาวดำสีอ่านออกไหม (ไม่ต้องทดสอบถ้าไม่อยู่ใน scope)

## อื่นๆ

18. ข้อมูลเดิมก่อนมี feature นี้ไม่มีสี = No Color (default) ใช่ไหม? มี API/BE เก็บเป็น field `Highlight Color`, `Text Color` ตามชื่อใน Data Source ใช่ไหม ค่า "No Color" เก็บเป็น null หรือค่าอะไร?
19. ETM-8035 (Done, Gantt Table Enhancements: Row Highlight...) ที่ relates to Story นี้ ทำสิ่งเดียวกันไปแล้วหรือไม่? ขอบเขตต่างกันอย่างไร และ ETM-8034 เป็นการแทนหรือเพิ่ม?

## Palette ที่ได้รับ (จากภาพ Color Code, ผู้ใช้ส่งมา)

| # | Highlight Row (light) | Change Text Color (strong) |
|---|---|---|
| 1 | #D6E4FF | #1D39C4 |
| 2 | #BAE0FF | #1677FF |
| 3 | #B5F5EC | #08979C |
| 4 | #D9F7BE | #52C41A |
| 5 | #EBF5BA | #81A827 |
| 6 | #FFFB8F | #D4B106 |
| 7 | #FFE58F | #D48806 |
| 8 | #FFE7BA | #FA8C16 |
| 9 | #FFD8BF | #FA541C |
| 10 | #FFCCC7 | #F5222D |
| 11 | #FFD6E7 | #EB2F96 |
| 12 | #EFDBFF | #722ED1 |

หมายเหตุ: ยืนยันแล้วจากภาพเมนู Figma ที่ผู้ใช้ส่งมา: Change Text Color เปิด palette เข้ม, Highlight Row เปิด palette อ่อน เมนูทั้งสองอยู่เหนือ "Delete Work" (ตรงกับ AC 1.1) แต่ละ submenu มี No Color (ช่องที่ 13) + 12 สี = 13 ช่อง ข้อความ AC 1.2 ที่ว่า "No Color ตามด้วย 13 สี" จึงถือว่าเขียนหลวม (ตีความเป็น 13 ช่องรวม No Color)
