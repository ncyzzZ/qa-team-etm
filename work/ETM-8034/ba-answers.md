# ETM-8034 คำตอบที่ได้รับ (จากผู้ใช้ ใช้เขียน Expected Result)

| ข้อ | คำตอบ | ผลต่อ TC |
|---|---|---|
| 1 | No Color = ช่องที่ 13 (+12 สี) | 13 ช่องต่อ submenu |
| 2 | ทำได้ทีละแถว (ไม่มี multi-select) | ไม่ต้องมี TC หลายแถว |
| 3 | กรอบสีฟ้า = สีที่เลือกอยู่ (selected) | TC: เปิดเมนูซ้ำเห็นสีปัจจุบันมีกรอบ |
| 4 | "ตามรูปที่ 2" = Roles and Permissions Matrix (Shutdown Timeline: Turnaround Manager มีสิทธิ์ครบ, Job Owner ดูได้อย่างเดียว) | ผู้ใช้ไม่มีสิทธิ์ไม่เห็นสองเมนู แต่เห็นสีที่บันทึก ⚠ ต้องยืนยันว่าแถวสิทธิ์ที่ใช้คือ "Edit Plan" หรือ "Edit Shutdown Logic Table and Visualization" |
| 5 | ทั้งแถวทั้งหมด | ตรวจทุกคอลัมน์ในแถว |
| 6 | ไม่สืบทอด แถวใครแถวมัน | ลง Platform/Work Header แล้วลูกไม่เปลี่ยน |
| 7 | ย่อ/ขยาย/ย้าย สีตามแถว; copy-paste สีไม่ตามไป (มาแค่ text) | |
| 8 | แทรกแถวไม่ได้ แก้ตรงนั้นเลย; สีที่ Save แล้วคงเดิมแม้แก้ข้อมูลอื่น จนกว่าจะ Save สีทับ | |
| 9 | condition color ที่มีอยู่แล้วเหมือนเดิม (ไม่เปลี่ยน) | ⚠ สูตรผสมยังรอ ux |
| 10 | ค่าที่ระบบมีมาก่อนดึงเหมือนเดิม | |
| 11 | รอ ux ส่งรูป | ค้าง |
| 12 | มี modal unsaved changes | TC: ออกหน้าแล้วขึ้น modal |
| 13 | ใคร Save ทีหลังได้ | |
| 14 | ใช่ (เปลี่ยนสีอย่างเดียวเปิดใช้ Save) | |
| 15 | สีตาม Duplicate plan ไปทั้งหมด | TC: Duplicate plan แล้วสีมาครบ |
| 16 | Undo ย้อนสีได้ (รวมหลัง Save) | |
| 17 | PDF: สิ่งที่เป็นอยู่แล้วเหมือนเดิม | |
| 18 | ค่าว่างปกติ (No Color) | |
| 19 | ผู้ใช้ถามกลับว่าคืออะไร (ดูคำอธิบายในแชต) | ค้าง |

ยังค้าง: ข้อ 11 และสูตรผสมสี (ข้อ 9) รอรูปจาก ux; ข้อ 4 ต้องยืนยันชื่อสิทธิ์; ข้อ 19

## รอบ 2 (BA ตอบ 2026-11-18, ไฟล์ 2026-11-18_ETM-8034_qa-questions.md)
สรุปอยู่ใน .claude/team/work/ETM-8034/story.md ท้ายไฟล์. ยังเปิด: ข้อ 4 ข้อความ modal unsaved (Dev), สูตรผสมสีจาก Figma 163-807247, Dev ยืนยันว่า cell ไหนมี condition color และ backend เช็คสิทธิ์.

## รอบ 3 (BA ตอบ 2026-11-24, work/SPRINT26/ba-answers-all-2026-11-24.md หัวข้อ ETM-8034; คำถาม questions-for-BA-round3.en.md)
| R3 | คำตอบ BA | ผลต่อ TC / script |
|---|---|---|
| R3-1 | AC 1.2 = No Color + 12 สี (13 ช่อง); BA แก้ข้อความ AC 1.2 เอง, DEC-028 คงไว้ | ETM-8856 คงเดิม (spec เช็ค 13 ช่องอยู่แล้ว) |
| R3-2 | Undo history รวมการแก้ใน Work Details modal เรียงตามลำดับกับการเปลี่ยนสี (ETM-2703); ถ้า build ไม่ทำ = defect | ETM-8865 s22-25 มีที่มาแล้ว คงไว้ |
| R3-3 | DEC-055: Copy & Paste (ETM-2615) = double-click ช่อง No. + Ctrl+C / Ctrl+V คัดลอกแค่ text ไม่เอาสี; Duplicate (ETM-2696) คัดลอก Highlight และ Text Color; ไม่มีเมนู copy อื่น | ETM-8861 s1-4 ใน spec ตรงแล้ว; Xray 8861 s1-2 ควรเขียนชื่อวิธีให้ชัด (รอ yes) |

ปิดครบทั้ง 3 ข้อ ไม่มีคำถามรอบ 3 ค้าง

## Behaviour table (ผู้ใช้ส่งในแชต 2026-11-24, ตรงกับ build stms-fe 73dfde33)
| ที่ไหน | การกระทำ | ผล |
|---|---|---|
| คอลัมน์ No. | Click | Select Cell |
| คอลัมน์ No. | Shift + Click | Select Multiple Cell |
| คอลัมน์ No. | Right Click | Dropdown: Highlight Cell, Change Text Color, Delete |
| คอลัมน์ No. | Double Click | Select Row |
| คอลัมน์ No. | Shift + Double Click / Select Row + Shift + Click | Select Multiple Row |
| คอลัมน์ No. | Select Row + Right Click | Dropdown: Highlight Row, Change Text Color, Delete |
| คอลัมน์อื่น | Click / Shift + Click | Select Cell / Select Multiple Cell |
| คอลัมน์อื่น | Right Click | Dropdown: Highlight Cell, Change Text Color, Delete |

ผล: "คลิกขวาที่แถว" ใน TC = double-click No. แล้วคลิกขวา; Highlight Cell (ลงสีเฉพาะช่อง) ยังไม่มีใน AC (อ่าน AC ใหม่ 14:23 แล้ว: แก้แค่ 1.2) และไม่มี TC -> ถาม BA รอบ 4 (F-35, R4-1)

## Highlight Cell (ผู้ใช้ตอบในแชตของ lead 2026-11-24)
"Highlight Cell ต้องคลิกขวาที่ description ตั้งใจเพิ่มมา แต่รอก่อนได้ไหม"
- Highlight Cell เป็น feature ที่ตั้งใจเพิ่ม (คลิกขวาที่ช่อง Description) ไม่ใช่ defect
- พักไว้ก่อน: ยังไม่ส่ง R4-1 ให้ BA และยังไม่เพิ่ม TC ของ Highlight Cell (F-35 confirmed, deferred)
- script คงเดิม: double-click No. -> คลิกขวา -> Highlight Row

## QA lead decisions (user, main chat 2026-11-26, relayed by the lead session)
- **Round 5 Q1 (Xray ETM-8862 step 8):** no toast is expected after Save in the Work Details modal. Step 8 becomes "the modal closes and the row shows the new values".
- **Round 6 Q1 (Xray ETM-8867 step 8):** answer a) the colours of a duplicated plan are fully separate from the original. Checked by hand by the user: plan "เทสสีหลัง dup" (duplicate of "Wide Plan B - NN", event NN TEST QA) got Aug01 red and row 11 yellow; the original "Wide Plan B - NN" kept Aug01 green and 08-Maimai02 pink. Our earlier automated finding (original Platform lost FFCCC7) is not reproduced by hand: no defect; re-run 8867 for clean evidence.

## QA lead decisions, round 7 (user, main chat 2026-11-26: "Q1=a Q2=ได้ Q3=ไม่มี") - Xray ETM-8868
- Q1 = a: the red error cell keeps `#FFCCC7`, the same colour as the red row highlight; accepted as designed. Step 6 becomes "The red cell keeps `#FFCCC7` (the same colour as the row highlight)."
- Q2 = yes: step 4 becomes "The red cell stays `#FFCCC7` and is clearly red among the highlighted cells."
- Q3 = no: no state gives a Gantt table row a red dependency border (the app blocks conflicts with "Unable to Apply Dependency"). Steps 14-15 are removed from ETM-8868.
