# ETM-8049 คำถามถึง BA (ก่อนเขียน Test Case)

Story: [Improvement] View Worklist Table - Working Location Columns
แหล่งที่มา: analyst.md (22 ข้อ) · ข้อที่ทำเครื่องหมาย ⭐ กระทบ Expected Result โดยตรง ควรตอบก่อน

## Master Data และการเรียงลำดับ

1. ⭐ Master Data ของ Deck คืออะไรบ้าง (Story ให้แค่ X = 0-9, N/A และ Y = A-J, N/A แบบ "เช่น")? ลำดับ sort ใช้ตามแถวใน sheet หรือเรียงตัวอักษร? "N/A" อยู่ท้ายสุดไหม?
2. X และ Y เรียงเป็น 0-9 / A-J แล้วตามด้วย N/A หรือตามลำดับใน Master Data? กฎเดียวกันใช้กับลำดับ option ใน filter (AC 3.4) ด้วยไหม?

## Column Customization

3. ⭐ "Reset" คือปุ่มอะไร อยู่ตรงไหนของ Column Customization? มีให้ยืนยันก่อนไหม? คืนทั้งลำดับและการซ่อนคอลัมน์ ทำให้ Deck/X/Y กลับไปซ่อนและอยู่ระหว่าง Department กับ Manpower Resource ใช่ไหม?
4. ถ้า saved layout ซ่อน Department (ไม่ติ๊ก) ไว้ Deck/X/Y จะวางตรงไหน? ยังวางถัดจากตำแหน่งที่ซ่อนอยู่ใช่ไหม?

## Filter และการแสดงผลในเซลล์

5. ⭐ `Main Deck` กับ `main deck` เป็นคนละ option (AC 3.6) ถ้าเลือกแค่ `main deck` work ที่มีเฉพาะ `Main Deck` ต้องไม่แสดงใช่ไหม (เทียบแบบแยกตัวพิมพ์เล็กใหญ่)? ช่อง search ใน filter แยกตัวพิมพ์เล็กใหญ่หรือไม่?
6. work ที่มีทั้ง `Main Deck` และ `main deck` (จาก Work Breakdown คนละอัน) แสดงในเซลล์ตามลำดับไหน (localeCompare 'en' numeric จัดการตัวพิมพ์อย่างไร)?
7. Deck ที่มี ", " อยู่ในค่าเอง ทำได้ไหม? ถ้าได้ เซลล์และ filter แยกค่าอย่างไร? มี validation เรื่อง comma ไหม?
8. ellipsis ขึ้นตามความกว้างคอลัมน์อย่างเดียว หรือมีความกว้างขั้นต่ำ? tooltip เป็นแบบมาตรฐานของ grid แสดงข้อความเต็มที่คั่นด้วย ", " ใช่ไหม?

## ความยาวและการตรวจค่า

9. ⭐ ข้อจำกัด 30 ตัวอักษรต่อค่า ตรวจที่ไหนบ้าง (ช่องกรอก, Excel import, Gantt paste, Shutdown Logic)? ถ้า 31 ตัวขึ้นข้อความหรือพฤติกรรมอะไร? ถ้าสะกดแบบ Master Data ยาวเกิน 30 จะเกิดอะไรขึ้น?
10. Excel import และ Shutdown Logic เปิดจากเมนู/ปุ่มอะไร? template ของ ETM-1008 / 1106 / 6843 มีคอลัมน์ Working Location (Deck/X/Y) อยู่แล้วหรือไม่?
11. ค่า X/Y ที่ไม่อยู่ใน Master Data (ใน Excel, Gantt paste, ฟอร์ม) ปฏิเสธหรือเมินค่านั้น? ข้อความ error คืออะไร?
12. Excel ที่ปนแถวถูกและแถวผิด (เช่น Deck เกิน 30 ตัว) reject ทั้งไฟล์หรือเฉพาะแถว?
13. ตัดช่องว่างหน้า/หลังก่อนเทียบตัวพิมพ์ (AC 6.1/6.2) ไหม? `Main  Deck` (เว้นสองช่อง) ถือว่าตรงกับ `Main Deck` หรือไม่?

## กฎการแปลงตัวพิมพ์ (AC 6)

14. "earliest-created work" ใช้เวลาสร้างของ Work แม้แก้ไขภายหลังหรือย้ายมาจาก worklist อื่น? ถ้า work ต้นฉบับถูกลบ จะใช้ spelling ของใคร?
15. "topmost Work Breakdown" คือบนสุดตามที่เห็นบนหน้าจอตอนกดบันทึก หรือตามเลขลำดับ? ใน Gantt Copy & Paste แถวไหนนับเป็นแถวแรก?
16. AC 6.3 ตอนพิมพ์ แปลงทุกครั้งที่กดตัวอักษร, ตอน blur, ตอน Enter หรือเฉพาะ paste? ถ้าพิมพ์ได้แค่ครึ่งเดียว (ข้อความบางส่วน) แปลงไหม?
17. กฎแปลงตัวพิมพ์ใช้กับ X/Y ด้วยไหม? (analyst สมมติว่าไม่ เพราะ Story บอกว่า free-text มีเฉพาะ Deck)
18. ข้อมูลเก่าที่มี case ต่างกัน มีการแก้ข้อมูลรวม (migration) ไหม หรือคงเดิมจนกว่าจะถูกแก้ไข? ถ้าแก้ work แต่ไม่ได้แตะช่อง Deck ค่าเก่าจะถูกแปลงด้วยไหม?

## Export และที่มาของค่า

19. Export (AC 5) ค่าหลายค่าใช้ตัวคั่น ", " และลำดับเดียวกับเซลล์ใช่ไหม? (Story บอก "no change" ต้องการรูปแบบเดิมเพื่อเขียน Expected Result)
20. ถ้า work ไม่มี Work Breakdown (หรือถูกลบหมด) เซลล์แสดงค่าจาก Work เองหรือว่างเปล่า? ที่มาของค่าในเซลล์คือ Work หรือ Work Breakdown?

## อื่นๆ

21. (ข้อเสนอ ไม่อยู่ใน Story) ขอ default column width ของ Deck / X / Y เพื่อเตรียมข้อมูลทดสอบ ellipsis ให้คาดเดาได้
22. ETM-8391 (Remark filter) และ ETM-686 เปลี่ยนพฤติกรรม filter ร่วม (Select All, search) ที่ AC 3.1 อ้างถึงหรือไม่?

## คำถามใหม่ (เพิ่มตอนออกแบบ TC)

23. ผู้ใช้ที่ไม่มีสิทธิ์ View Worklist เปิดลิงก์ worklist ตรงๆ จะเห็นอะไร (redirect เงียบ หรือขึ้นข้อความ)?
24. กด Select All ขณะที่พิมพ์ข้อความค้นหาใน filter อยู่ จะเลือกเฉพาะ option ที่เห็นอยู่ ใช่ไหม (เหมือนคอลัมน์อื่น)?
25. ถ้าไม่กรอก Deck / X / Y แล้วกดบันทึก ระบบแสดงอย่างไร (ปุ่ม Save ถูก disable หรือขึ้นข้อความ error)?


## Round 2 questions (raised after test runs, 2026-11-24, Story status: Deployed to QA)

26. ⭐ AC 6.1 says "Edit Work", but the Edit Work Details form has no Working Location (Deck / X / Y) field. Should AC 6.1 read "Edit Work Breakdown" (worklist row menu > View Work Details > Edit Breakdown)? Is there any other edit screen where Deck can be changed?
27. ⭐ Import Excel rejects a cell with `Helipad,helipad` with a "duplicates" error, but AC 6.2 says values that differ only by letter case are stored as separate values. Which is correct for Excel import: reject as duplicate, or store `Helipad` and `helipad` as two values?
28. Create Work: the user types a Deck value and clicks away without pressing Enter. What should happen: the typed text is added as a value, the text is discarded, or a message is shown? (follow-up to Q16)


## Round 3 questions (from the Sprint 26 audit, 2026-11-24, Story status: In Testing)

29. ⭐ Y value `a` becomes `A` (TC-013 Excel import, TC-014 Shutdown Logic): AC 6 speaks only about Deck, and X / Y are "From list". Should a lower-case Y such as `a` be converted to `A`, rejected, or is it impossible to enter? (follow-up to Q17)
30. Reset in Column Customization (TC-002): does the table change at once when Reset is clicked, or only after Apply? The test still uses the BA proposal "after Apply" (Q3); please confirm.
31. Two users save the same work with different Deck spellings at the same time (TC-004 steps 6-10): what is the expected result (last save wins, both kept, or an error)? This was never answered.
32. ⭐ Create Work (TC-015): the screen has one Work Details row per work, so several Work Breakdown rows of ONE work cannot be entered there. Where can a user enter several Deck values for one work in one session (Edit Work Breakdown only)? We will rewrite TC-015 to the real flow after your answer.

## Round 4 question (TC-020 result, 2026-11-24, Story status: In Testing)

33. ⭐ Edit Work Breakdown on work `WK-18-O` (event NN TEST QA): typing `main deck` + Enter keeps `main deck` (not converted), although the suggestion list shows `Main Deck`. Typing `mAiN dEcK` gives `Main Deck`. The event already has the free-text value `main deck` on other works; QA set that existing value directly in the database to stand for data saved before this change (AC 6.4: existing values are not converted, no migration), because new entries are converted and the screen can no longer make it. Please confirm: (a) such lower-case Master Data values really exist in production data from before this change, so this case is reachable for users; and (b) a new entry `main deck` must still convert to `Main Deck` even when the event already holds the old value `main deck`. If both are yes, QA will log it as a defect.
    Update 2026-11-24: logged as defect ETM-9225 before this answer (QA lead's choice). Sent again on its own: questions-for-BA-ETM-9225.en.md.

## Round 5 question (TC-015 result, 2026-11-24, Story status: In Testing)

34. ⭐ Create Work, one Deck cell: after the tag `Dock Area` (or `DOCK AREA`) is in the cell, typing `DOCK AREA` (or `dock area`) shows the existing tag as already selected (a tick in the list), and pressing Enter adds nothing. So one cell cannot hold two free-text values that differ only by letter case. Your answer to Q32 says Create Work accepts several Deck values in one cell, and AC 6.2 says free text is saved exactly as entered. TC-015 (ETM-8788) expects the cell `Main Deck, Cellar Deck, Dock Area, DOCK AREA`. Import shows the same rule (`Helipad,helipad` is rejected, defect ETM-9223). Which is correct for Create Work and Edit Work Breakdown: (a) the cell may hold `Dock Area` and `DOCK AREA` together, so this is a defect like ETM-9223, or (b) values that differ only by letter case are duplicates inside one cell, and TC-015 must change? Picture: TC015-case-variant-not-added-2026-11-24.jpg.
