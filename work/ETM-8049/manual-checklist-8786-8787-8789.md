# ETM-8049 เทสมือ: ETM-8786 (TC-013), ETM-8787 (TC-014), ETM-8789 (TC-016)

Test Execution: ETM-8822 · ทั้ง 3 ข้อต้องใช้ไฟล์ Excel / Gantt / clipboard จึงให้ manual-runner ทำไม่ได้ (ไม่มี manual-steps file)
ขั้นตอนเต็มอยู่ใน Xray ของแต่ละ Test (ไฟล์นี้สรุปพร้อมข้อควรรู้ 24 พ.ย.)
QA: https://stms-qa.apps.pttep.com · ใช้ Plan "QA ETM-8049 Scratch" ได้ (worklist ว่าง, ลบ work ที่สร้างหลังเทส)
Scratch: https://stms-qa.apps.pttep.com/shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/e95c9b6a-e347-49d9-8e1b-0f0f6e3d9c4c/worklist/bea32b01-d98f-4952-8c5c-bbffb84d46dd

## ข้อควรรู้ก่อนเริ่ม

- **Work ที่ลบแล้วยังโชว์ในตาราง** (Status = D): ตอนอ่านผลให้ดูเฉพาะแถว N
- **`main deck` อาจไม่ถูกแปลง** (เจอ 24 พ.ย. ใน Edit Work Breakdown): ถ้าใน Event มีค่า free text `main deck` อยู่แล้ว การใส่ `main deck` ได้ `main deck` แต่ `mAiN dEcK` ได้ `Main Deck` · Event NN TEST QA มี `main deck` อยู่ (WK-6b-K, WK-18-O) → ขั้นที่คาด `Main Deck` จาก `main deck` ใน 3 ข้อนี้อาจ fail ด้วยเหตุเดียวกัน ให้จดผลจริงไว้
- **Q29 (BA แก้คำตอบ 24 พ.ย.):** X และ Y เลือกได้อย่างเดียว พิมพ์ไม่ได้ จึงไม่มีเคส `a` → `A` · **ข้ามส่วน Y ทั้งหมด** ใน TC-013 (ขั้น 3 อ่านแค่ Deck, ไฟล์ใส่ Y เป็น `A`) และ TC-014 (ขั้น 10 และ Y ในขั้น 12)
- **Q27 (BA 24 พ.ย.):** Import ต้องรับทั้ง `Helipad` และ `helipad` (DEC-046) · ถ้า Excel ปฏิเสธว่า "duplicates" = อาการบั๊ก ให้เก็บรูปไว้
- **Q28 (BA):** พิมพ์ Deck แล้วไม่กด Enter ข้อความจะถูกทิ้งตอน Save โดยไม่มีข้อความเตือน
- ความยาว Deck สูงสุด 30 ตัว

## ETM-8786 TC-013 · Excel import แปลง Deck เป็นสะกดแบบ Master Data (และ Y `a`→`A`)

ต้องเตรียม: ไฟล์ `[Template] Import Worklist.xlsx` 1 แถว: Work Number `WK-X1`, Deck `main deck`, X `1`, Y `a` · ไฟล์ Import Work and WB (ETM-6843) 1 แถว WB: Work Number `WK-X3`, Deck `CELLAR deck`

| # | ทำ | คาด |
|---|---|---|
| 1 | Create Work > Import Excel | หน้าต่าง import เปิด |
| 2 | เลือกไฟล์แรก import | สร้าง work สำเร็จ |
| 3 | อ่าน Deck, Y ของ WK-X1 | Deck `Main Deck`, Y `A` (ดูข้อควรรู้เรื่อง `main deck`) |
| 4 | Create Work > Import Excel (flow ETM-6843) | หน้าต่าง import เปิด |
| 5 | เลือกไฟล์ที่สอง import | สำเร็จ |
| 6 | อ่าน Deck ของ WK-X3 | `Cellar Deck` |

## ETM-8787 TC-014 · Shutdown Logic (Gantt / Modal / Paste)

ต้องเตรียม: work `WK-1a`, `WK-1b` (Deck `Helideck`), `WK-18g` (Deck `Helideck`, Y `B`) ใน plan ที่เปิด Shutdown Logic ได้ · ข้อความสำหรับ copy: `main deck`, `Deck-0123456789-0123456789-ABCD` (31 ตัว)
รัน 2 รอบ: Edit by Gantt Table กับ `WK-1a` พิมพ์ `main deck` · Edit by Modal กับ `WK-1b` พิมพ์ `MAIN deck`

| # | ทำ | คาด |
|---|---|---|
| 1 | เปิดวิธีแก้ของรอบนั้นกับ work ของรอบนั้น | Deck แก้ได้ |
| 2 | พิมพ์ค่าของรอบนั้น + Enter | เห็น `Main Deck` ทันที |
| 3 | Save | บันทึกได้ |
| 4 | หน้า Worklist อ่าน Deck | `Main Deck, Helideck` |
| 5 | กลับไปแก้ที่เดิม พิมพ์ค่า 31 ตัว | รับแค่ 30 ตัว |
| 6 | NEG: ออกโดยไม่ Save | ค่าเดิมไม่เปลี่ยน |
| 7 | Gantt: เลือกเซลล์ Deck ของ WK-18g | ถูกเลือก |
| 8 | Paste ค่า 31 ตัว | เหลือ `Deck-0123456789-0123456789-ABC` ไม่มี error |
| 9 | Paste `main deck` เซลล์เดิม | `Main Deck` |
| 10 | ~~Y paste `a`~~ | ไม่มีคอลัมน์ Y ใน Gantt (Q29) → จดว่าทำไม่ได้ |
| 11 | Save | บันทึกได้ |
| 12 | Worklist อ่าน Deck (และ Y) ของ WK-18g | Deck `Main Deck` · Y ยังเป็น `B` |

## ETM-8789 TC-016 · Excel 4 แถวต่างตัวพิมพ์ + Gantt paste

ต้องเตรียม: ไฟล์ Excel 4 แถว Deck `Quay Wall`, `QUAY WALL`, `quay wall`, `main deck` (ตามลำดับ, คนละ work) · works `WK-20a`..`WK-20d` (Deck `Helideck`) · ไม่มี `Quay Wall` ใน worklist นั้นมาก่อน

| # | ทำ | คาด |
|---|---|---|
| 1 | เปิดไฟล์ตรวจ 4 ค่า | ถูกต้อง |
| 2 | Create Work > Import Excel | สร้าง 4 works |
| 3 | อ่าน Deck 3 work แรก | `Quay Wall`, `QUAY WALL`, `quay wall` ตามที่พิมพ์ |
| 4 | อ่าน Deck work ที่ 4 | `Main Deck` (ดูข้อควรรู้เรื่อง `main deck`) |
| 5 | Shutdown Logic, copy 4 ค่า (บรรทัดละค่า) | copy ได้ |
| 6 | เลือกเซลล์ Deck WK-20a..d ใน Gantt แล้ว paste | ได้ 4 ค่า ไม่สร้าง work ใหม่ |
| 7 | Save | บันทึกได้ |
| 8 | Worklist อ่าน WK-20a..c | ตามที่พิมพ์ |
| 9 | อ่าน WK-20d | `Main Deck` |

ลบ work ที่สร้างหลังเทส

## ส่งผลให้ QA LEAD

ตอบในแชทรายข้อ เช่น `8786: 1-6 pass` / `8787: ขั้น 9 fail ได้ main deck` แล้วแนบรูปไว้ในโฟลเดอร์ใดก็ได้ · การ push ผลขึ้น Xray (ETM-8822) ต้องได้ yes ก่อน · ข้อที่ทำไม่ได้ (เช่น ขั้น Y ของ 8787) จะไม่นับเป็น PASSED

## หมายเหตุ 24 พ.ย. (หลัง F-27)

- F-27 ถูก log แล้วเป็น **ETM-9223** (Import ปฏิเสธ `Helipad,helipad` ว่า duplicates) ห้าม log ซ้ำ
- ETM-8786 ใน ETM-8822 เป็น FAILED แล้ว และ step 2 ผูกกับ ETM-9223 อยู่ · ถ้า import ผล 8786 ใหม่ ต้องผูก step 2 กับ ETM-9223 อีกครั้ง (import จะลบลิงก์ของ step)
- รอ yes: เพิ่มแถว import แบบ `Helipad,helipad` ลงใน ETM-8786 หรือทำเป็น TC ใหม่
