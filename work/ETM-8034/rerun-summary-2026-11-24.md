# ETM-8034 รันซ้ำ 24/11 (21:52 + 23:17)

ผลรวม 19 Tests: ผ่าน 6 (8854, 8857, 8858, 8863, 8864, 8866) | flaky 1 (8871 ผ่านรอบ retry ยังนับว่าผ่านไม่ได้) | fail 8 | skip 1 (8860) | manual 3 (8868, 8869, 8870)
ไม่ได้ push Xray, ไม่ได้เขียน Jira, ไม่ได้ commit

| Test | สาเหตุ | สถานะ / ต้องทำ |
|---|---|---|
| 8856, 8859 | defect ETM-9219 (กรอบฟ้าไม่ขึ้นที่สีที่ใช้อยู่) | รอ dev |
| 8855, 8872 | ข้อมูล: JO เปิดหน้าแล้วเจอ Access Denied (`/unauthorized`) แผนน่าจะไม่ Active หรือ JO ไม่มีสิทธิ์ | ผู้ใช้เช็ค: แผน 8034 Active ไหม (ไม่ได้เปิด Active เอง) |
| 8862 | build ไม่มี toast หลัง Save ใน Work Details modal (stms-fe ไม่มีข้อความ "Save Work Successfully") | ถาม BA ว่าต้องมี toast ไหม ถ้าไม่ต้องมี จะแก้ step 8 |
| 8866 | script: ชื่อเมนูผิด 'Delete' ต้องเป็น 'Delete Work Breakdown' (บรรทัด 505) | ผู้ใช้กด Apply แล้ว แก้แล้วรันซ้ำ **ผ่าน** (run 232952) |
| 8867 | แก้ script แล้ว (แถว Shutdown Logic เปิดในแท็บใหม่) และผ่าน step 1-7 แล้ว ตอนนี้ fail ที่ step 8: เอาสีออกจาก Platform ของแผน copy แล้ว Platform ของแผนต้นฉบับหายสีไปด้วย (FFCCC6 กลายเป็น FFFFFF) | น่าจะเป็น defect ต้องยืนยันก่อน log (ยังไม่ได้เช็คว่า row id ของแผน copy ซ้ำกับต้นฉบับไหม) |
| 8865 | กดปุ่ม Undo/Redo ทำงานได้ แต่กด Ctrl+Z 2 ครั้งแล้วสี B9E0FF ไม่หาย | อาจเป็น defect หรือ focus ไม่อยู่ที่ตาราง ต้องยืนยัน |
| 8861 | กด Ctrl+V แล้ว text ไม่ไปที่แถวปลายทาง | อาจเป็น defect หรือ clipboard ของ script ต้องยืนยัน |

Run: `ep-etm-fe-qa/output/runs/2026-11-24_215258_ETM-8034`, `..._231724_ETM-8034`

## 25/11 แผน Active และ event ใหม่
- 08:25 ผู้ใช้ตอบ "เปิด Active แล้วรัน": เปิด Active ให้ S26 Row Colour (ทำให้ Wide Plan B - NN เป็น Inactive) แต่ JO ยังเจอ Access Denied เพราะ item Shutdown Logic ปิดอยู่
- ต่อมาผู้ใช้สั่ง "คืน + สร้าง event": คืน Active ให้ Wide Plan B - NN แล้ว (S26 Row Colour กลับเป็น Inactive) แต่ **item ทั้ง 5 แถวของ Wide Plan B ปิดอยู่** ไม่รู้ว่าก่อนหน้านี้เปิดอยู่ไหม จึงไม่ได้เปิด เจ้าของแผนควรเช็ค
- สร้าง event ใหม่ "QA ETM-8034" (ART, PSD, 01-13 Apr 2026) มีแผน "QA ETM-8034 Row Colour JO" (Active, item Shutdown Logic เปิด) มี 3 Works ใช้ setup ที่ `ep-etm-fe-qa/tests/fe/setup/setupEtm8034.spec.ts` และตั้ง `.env` `ETM8034_JO_PATH` ไว้แล้ว ส่วน 8855/8872 เปลี่ยนให้ใช้แผนนี้
- 8872 **ผ่าน** (run 091313)
- 8855: step 1-2 ผ่าน (JO เห็นสีที่ TM บันทึกไว้ และสียังอยู่หลัง reload) แต่ fail ที่ step 3 เพราะ JO คลิกขวาแล้ว**ไม่มีเมนูขึ้นเลย** ขณะที่ script บังคับว่าต้องมีเมนู เสนอแก้ script ให้ถือว่าไม่มีเมนูเลยก็ผ่าน (ไม่มีตัวเลือกสี = ตรงกับ Expected) รอผู้ใช้ตอบ yes
- 8855 แก้ script (`rightClickRowAsViewer`: JO คลิกขวาแล้วไม่มีเมนูเลย = ไม่มีตัวเลือกสี) แล้วรันซ้ำ **ผ่าน** (run 091947)

## สีใน Figma กับ build (ผู้ใช้ส่งรูปจาก Figma 25/11 09:22, node 174-811357)
Figma "Color Code" = ค่าเดิมใน TC/Xray (ชุดสีของ Ant Design) ทั้ง 24 สี ส่วน build (stms-fe row-color.constant.ts) ใช้ค่าที่ต่างจาก Figma 15 สี (ต่างช่องสีละ 1-4):
highlight D6E4FF→D7E3FF, BAE0FF→B9E0FF, B5F5EC→B4F5EC, FFD8BF→FFD9BF, FFCCC7→FFCCC6, FFD6E7→FFD7E7 (D9F7BE, EBF5BA, FFFB8F, FFE58F, FFE7BA, EFDBFF ตรงกัน)
text 1D39C4→1E39C5, 1677FF→1777FF, 08979C→04979C, 52C41A→53C31B, 81A827→81A828, D4B106→D4B108, FA8C16→FA8B16, F5222D→F5212D, EB2F96→EB2E97 (D48806, FA541C, 722ED1 ตรงกัน)
=> build ไม่ตรงกับ hex ที่ Figma เขียนไว้ (dev น่าจะดูดสีจากภาพ) และค่า hex นี้ถูกบันทึกลง BE ตามนั้นเลย ถ้าถือ Figma เป็นหลัก นี่คือ defect (ต้องให้ผู้ใช้ยืนยันก่อน log) และ spec ต้องกลับไปใช้ค่าตาม Figma ส่วน Xray ยังเป็นค่าตาม Figma อยู่แล้ว (การแก้ palette ใน Xray พักไว้)

## 25/11 สาเหตุของ 6 Tests ที่ fail และ manual 8868/8869
| Test | สาเหตุ | กลุ่ม | ทำแล้ว / ต้องทำ |
|---|---|---|---|
| 8856, 8859 | กรอบฟ้าไม่ขึ้นที่สีปัจจุบัน | app (ETM-9219) | รอ dev; spec ยังใช้ค่าสีตาม build ต้องเปลี่ยนกลับเป็นค่าตาม Figma (ETM-10034) |
| 8862 | หลัง Save ใน Work Details modal ไม่มี toast (stms-fe ไม่มีโค้ดแสดง toast ตรงนี้) | รอ BA | ถาม BA ว่าต้องมี toast ไหม |
| 8865 | step 10: script กด Ctrl+Z 2 ครั้งติดกัน ครั้งที่ 2 โดนตัดทิ้งระหว่างโหลด (isTableLoading) | script แก้แล้ว | `pressKeys` รอให้ toolbar กดได้ก่อน; รอบ 103450 step 10-23 ผ่าน แต่ไป fail ที่ **step 24**: Undo การแก้ใน Work Details แล้ว 3 ช่อง (workNumber, activityGroup, priorityDisplay) หลุด highlight FFD7E7 กลายเป็น F2F8FA ส่วนรอบ retry timeout ตอน hover splitter (env ช้า) | น่าจะ defect ต้องยืนยัน |
| 8861 | Ctrl+C ทั้งแถว (double-click No.) ไม่ลง clipboard และ Ctrl+V ไม่วาง ลองทั้ง Cmd, Ctrl และ API ของ Bryntum ใน browser อัตโนมัติ | ไม่รู้ (app หรือ automation) | ให้คนลองเองบน Mac/Windows 1 นาที |
| 8867 | แก้ script แท็บใหม่แล้ว; step 8: เอาสีออกจาก Platform ของแผน copy แล้วแผนต้นฉบับหายสีด้วย; id ของแถวสร้างจากชื่อ (`platform:ASSET#0`) และ Platform เป็นข้อมูลระดับ event | น่าจะ app | ต้องยืนยันก่อน log |

Manual (ไม่ได้ Save, ไม่ได้ push Xray):
- 8868: pass 9, needs-human 6 (step 4, 6, 11 สีผสมแดงกับ highlight; step 6 แดง FFCCC7 กับ highlight FFCCC6 ต่างกันแค่ 1; step 14-15 Test ไม่บอกวิธีสร้าง dependency conflict). รูปอยู่ใน `work/ETM-8034/manual-run-8868/`
- 8869: pass 3, needs-human 5 (hover / select / focus / disabled ทับ highlight, step 4 คลิกที่ว่างไม่ล้าง selection). รูปอยู่ใน `work/ETM-8034/manual-run-8869/`
- 8870 (Export PDF): ให้คนเทียบเอง ยังไม่ได้ทำ
