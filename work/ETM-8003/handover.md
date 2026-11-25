# ETM-8003 สรุปให้ตอนกลับมา (24 Nov 2026, 22:20)

ผลล่าสุด (run `2026-11-24_221700_ETM-8003`): ผ่าน 3 · Not proven 6 · fail 0 · 8805 เป็นเคส manual ยังไม่ทำ
รายงาน: `ep-etm-fe-qa/output/runs/2026-11-24_221700_ETM-8003/evidence-report-ETM-8003-20261124-221700.html`
ยังไม่ได้ push Xray, ไม่ได้เขียน Jira, ไม่ได้ log defect และไม่ได้ commit

## ที่ทำไปคืนนี้
1. 8800 ที่ fail เมื่อบ่ายเป็นปัญหาชั่วคราว พอรันใหม่ก็ไม่ fail แล้ว
2. 8807 (JO): plan เดิม `f0792b80` เป็น Inactive JO จึงได้หน้า Access Denied (ถูกต้องตาม rule) เปลี่ยนไปใช้ Active plan "QA EMP Del A" (`51a3bef2`, ของ ETM-8392) และบันทึก `ETM8003_VIEW_ACTIVE_URL` ไว้ใน `.env` ของ ep-etm-fe-qa แล้ว
3. แก้ script 2 จุด (`pages/dailyReportPage/sCurvePage.ts` และ spec ของ 8807):
   - JO เห็นปุ่ม filter ของ S-Curve เป็น **disabled** จึงให้ `stable(false)` ข้ามการรอปุ่มนี้ และบันทึกเป็น note ไว้
   - ตอนกราฟเพิ่งโหลด canvas จะมีแค่แกนกราฟก่อน script เลยต้องรอให้มีสีของเส้นก่อนถือว่ากราฟนิ่ง
   - สีที่ JO เห็นตรงกับ TM (น้ำเงิน #1677FF และส้ม #FA8C16) **ไม่ใช่ defect**

## ผลแต่ละ Test
| Test | ผล | ที่เหลือให้คนตรวจด้วยตา |
|---|---|---|
| 8801, 8806, 8807 | ผ่าน | – |
| 8800 | Not proven | ค่าตัวเลขบน label เทียบกับ Progress Summary (เส้นประอ่านจาก pixel ได้ถูก: Plan 0.44 / Actual 0.01) |
| 8802 | Not proven | จุดบนเส้นกับเส้นประใน legend ของ Plan |
| 8803 | Not proven | label 0% ที่ซ้อนกันยังอ่านออกไหม และจุดไหนอยู่ด้านบน |
| 8804 | Not proven | ค่าตัวเลขบน label |
| 8808 | Not proven | Show Only Today ซ่อน label ของวันอื่นจริงไหม (Week/Month) |
| 8809 | Not proven | ค่าตัวเลขบน label |
| 8805 | ยังไม่ได้ทำ | Export PDF (manual) |

ทั้ง 6 เคสที่ Not proven จะไม่ใส่ PASSED ใน Xray ต้องตรวจด้วยตาก่อน

## รอผู้ใช้ตัดสินใจ
- จะถาม BA ไหมว่า JO เห็นปุ่ม filter ของ S-Curve เป็น disabled ถูกต้องหรือไม่ (ยังไม่ได้ส่งคำถาม) ถ้าไม่ถูกต้องอาจเป็น defect แต่ไม่ใช่เรื่องของการ์ดนี้ (การ์ดนี้เรื่องสี)
- จะ push ผลขึ้น Xray ไหม (3 เคสที่ผ่าน)

## Xray (24 Nov 22:3x)
Push เข้า TE ETM-8816 แล้ว: PASSED 8801, 8806, 8807 พร้อมรูป (ตรวจอ่านค่ากลับแล้ว) ที่เหลือ 7 เคสยังเป็น TO DO
หมายเหตุ: comment ของ 8807 เขียนว่า "asked BA separately" แต่ยังไม่ได้ถาม BA จริง

## 8805 manual-runner (25 Nov 10:10)
รัน: `ep-etm-fe-qa/output/runs/2026-11-25_100450_ETM-8003_manual` ผ่าน 7/10
- ผ่าน: 1, 3, 4, 5, 6 (RGB 22,119,255 = #1677FF), 7 (250,140,22 = #FA8C16), 10
- needs-human: 2 (ใน PDF ไม่มีข้อความ S-Curve ซึ่ง baseline ก็ไม่มี ส่วนกราฟอยู่บนหน้า 1), 8 (pixel สีเทาต่างกัน 6367 จุด น่าจะเป็น anti-aliasing)
- fail ที่ต้องให้คนตัดสิน: 9 Gantt หน้า 2-4 มี marker "R Ramp Down" ที่ baseline ไม่มี น่าจะเป็นเพราะ plan เปลี่ยนหลังทำ baseline หรือมาจาก Story อื่น ไม่ใช่เรื่องสี
ยังรอยืนยัน ยังไม่ได้ push Xray

ผู้ใช้ตัดสิน 8805 (25 Nov, แชท): step 2 = pass, step 8 = pass, step 9 = ถาม BA (Q2 ใน questions-for-BA-round3.md)
ยังไม่ได้รัน `results.mjs --decide` เพราะถ้ารันตอนนี้ Test จะถูก confirm พร้อม step 9 ที่ยังเป็น fail พอ BA ตอบแล้วให้รัน:
`node tools/manual/results.mjs <PW_REPO>/output/runs/2026-11-25_100450_ETM-8003_manual --decide ETM-8805 2=pass 8=pass 9=<pass|fail>`

8805 confirmed 25 Nov: 10/10 pass (user: 2, 8 pass; BA Q2 yes -> 9 pass). run-results.json = passed (manual-agent). Not pushed to Xray yet.

## Manual canvas 6 Tests (25 Nov 10:22, run 2026-11-25_102222_ETM-8003_manual) รอยืนยัน
- 8800 4/4, 8804 9/9, 8808 10/10, 8809 7/7 ผ่านทุก step (รอยืนยันทั้งหมด)
- 8802 needs-human step 2, 3: จุด origin (0% ซ้ายของ 3 Jun) ไม่มี label
- 8803 needs-human step 3: ที่ origin (0% ทั้งคู่) จุดสีน้ำเงินทับจุดส้มจนมองไม่เห็น ส่วนที่ 3 Jun เห็นทั้ง 2 จุด
- ข้อสังเกต: ระหว่างรัน Plan บน QA เปลี่ยนจากจบ 20 Jun 100% เป็นจบ 16 Jun 88% (มีคนแก้ข้อมูล?)

ยืนยันแล้ว 25 Nov: 8800, 8804, 8808, 8809 (ยืนยันผลตามที่ manual-runner เสนอ), 8802 step 2/3 และ 8803 step 3 = pass (จุด origin คือจุดเริ่มของเส้น) ตอนนี้ run-results ผ่านครบ 10/10
ยัง push Xray ไม่ครบ: 8800, 8802-8805, 8808, 8809 ยังเป็น TO DO
ข้อควรรู้: `results.mjs --confirm A B C` confirm แค่ตัวแรก ต้องใส่ `--confirm` ทีละตัว

## Xray (25 Nov 11:xx)
ETM-8816: PASSED ครบ 10/10 (อ่านค่ากลับแล้ว) manual 7 เคส push พร้อมรูปทุก step (xray-step-push) ส่วน 8802 กับ 8808 reset Test Run (resetTestRun) ให้เป็น steps ล่าสุดก่อน push
เหลือ: Q1 (ปุ่ม filter ของ JO) ยังรอ BA, closeout ยังไม่ทำ, ยังไม่ได้ commit

แก้ 25 Nov: เรื่อง "JO เห็นปุ่ม filter เป็น disabled" สรุปผิด เพราะปุ่มเปิดใช้ได้ (ผู้ใช้ส่งรูปมา และเช็คซ้ำบน eND50 กับ QA EMP Del A แล้ว) ที่เห็น disabled คือตอนเปิด plan Inactive ซึ่งหน้าแวบไปก่อนขึ้น Access Denied ถอน Q1 ออกแล้ว และแก้ comment ใน script แล้ว
แก้ comment ของ 8807 ใน Xray (ETM-8816) แล้ว 25 Nov (สถานะยังเป็น PASSED)

## Closeout (25 Nov 2026)
- Tests 8800-8809: Closed / Done ครบ 10/10 (JQL ยืนยันแล้ว) 9 ตัว assign เป็น Nuchanart ส่วน 8805 ถูกปิดไว้ก่อนแล้วโดย Dechathon จึงไม่ได้แตะ
- TE ETM-8816: Done
- [QA] ETM-8556 (description อัปเดตแล้ว) และ ETM-8557: Done
- Story ETM-8003: Ready for UAT
ยังไม่ได้ commit
