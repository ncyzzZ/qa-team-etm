# Defect draft (not logged): ETM-8034 colour palette hex differs from Figma

Status: DRAFT ONLY. Nothing written to Jira. Log only after the user's yes in chat.
Related finding: F-36 (findings.json). The team accepted the build values on 2026-11-24 ("เอาสีตาม dev"). On 2026-11-25 the user checked Figma again, so that decision is reversed.

## Evidence (status 25 Nov)
1. Figma "Color Code" labels: the user's screenshots, node 174-811357. These show the label text only.
2. Dev source: stms-fe `src/app/features/shutdown-event-list/pages/shutdown-logic/components/shutdown-gantt-chart/row-color/shutdown-gantt-row-color.constant.ts` (commit 73dfde33). Line 5: "Values are taken pixel-for-pixel from the Figma design — do not normalise". Line 11 `'#D7E3FF'`, line 27 `'#1E39C5'`, line 29 `'#04979C'`.
3. On screen: run 2026-11-24_150208 (ETM-8858), the assertion read the build values from the row cells.
4. **MISSING, and this decides it:** the Fill hex of the swatch itself in Figma (select the swatch, then Properties > Fill). Figma MCP hit the View-seat limit, so the user has to check it. Dev sampled pixels; on a Mac display a sampled pixel drifts by 1-4.
   - Fill = label (e.g. 08979C): real defect. Put the Fill screenshot in the Description.
   - Fill = build value (e.g. 04979C): the Figma label is wrong. This is not a defect; ask UX/BA which value is right.

## Fields (to be resolved at log time)
- Work type: Defect (Found-in Environment: QA = 16336)
- Summary: `[ETM-8034] Highlight Row and Change Text Color palettes save hex values that differ from the Figma Color Code (15 of 24 colours)`
- Labels: FE, UI
- Epic, Sprint: copy them from ETM-8034
- Link: Relates to ETM-8034
- Assignee: the assignee of the [FE] sub-task of ETM-8034, resolved when it is logged
- Xray: Test Execution ETM-8875, Test ETM-8858 (the step that checks each highlight / text colour hex). Step number confirmed when it is logged.
- [QA] sub-task: `[QA] Fix and verify palette hex values match Figma`, worklog 15m (compare 24 colours with Figma + source + run)
- Evidence images: Figma Color Code frames (user screenshots 25 Nov, node 174-811357) + an ETM-8858 run picture of a coloured row. **To confirm: who embeds them.**

---

## English (Jira Description)

On the Shutdown Logic page (Gantt table), the colours offered by **Highlight Row** and **Change Text Color** do not use the hex values in the Figma design. 15 of the 24 colours differ from the Figma "Color Code" by 1-4 per RGB channel. The saved value is sent to the backend as is, so the stored colour codes do not match the design. The palette is defined in stms-fe `row-color.constant.ts`, build 73dfde33.

Figma: EMI - Turnaround (Shutdown Logic 2), node 174-811357, frames "Color Code" (highlight) and Frame 1010105847 (text).

### Step to Reproduce
1. Log in to QA as Turnaround Manager and open the Shutdown Logic page of a plan.
2. Double-click the No. cell of a Work row to select the row, right-click it, open `Highlight Row`, and choose each colour in turn.
3. Read the background colour of the row cells (or the colour value in the Save request).
4. Do the same with `Change Text Color` and read the text colour.
5. Compare each value with the Figma Color Code.

### Actual Result
Actual values were read from the row cells on screen in run 2026-11-24_150208 (ETM-8858) and are the same as stms-fe `row-color.constant.ts`.

| Palette | Figma (expected) | Build, on screen and saved (actual) | Difference (RGB) |
|---|---|---|---|
| Highlight | #D6E4FF (214,228,255) | #D7E3FF (215,227,255) | R+1 G-1 |
| Highlight | #BAE0FF (186,224,255) | #B9E0FF (185,224,255) | R-1 |
| Highlight | #B5F5EC (181,245,236) | #B4F5EC (180,245,236) | R-1 |
| Highlight | #FFD8BF (255,216,191) | #FFD9BF (255,217,191) | G+1 |
| Highlight | #FFCCC7 (255,204,199) | #FFCCC6 (255,204,198) | B-1 |
| Highlight | #FFD6E7 (255,214,231) | #FFD7E7 (255,215,231) | G+1 |
| Text | #1D39C4 (29,57,196) | #1E39C5 (30,57,197) | R+1 B+1 |
| Text | #1677FF (22,119,255) | #1777FF (23,119,255) | R+1 |
| Text | #08979C (8,151,156) | #04979C (4,151,156) | R-4 |
| Text | #52C41A (82,196,26) | #53C31B (83,195,27) | R+1 G-1 B+1 |
| Text | #81A827 (129,168,39) | #81A828 (129,168,40) | B+1 |
| Text | #D4B106 (212,177,6) | #D4B108 (212,177,8) | B+2 |
| Text | #FA8C16 (250,140,22) | #FA8B16 (250,139,22) | G-1 |
| Text | #F5222D (245,34,45) | #F5212D (245,33,45) | G-1 |
| Text | #EB2F96 (235,47,150) | #EB2E97 (235,46,151) | G-1 B+1 |

These 9 match: highlight #D9F7BE, #EBF5BA, #FFFB8F, #FFE58F, #FFE7BA, #EFDBFF; text #D48806, #FA541C, #722ED1.

### Expected Result
Each colour in Highlight Row and Change Text Color uses exactly the hex value in the Figma Color Code: 12 highlight and 12 text colours, plus No Color. The same hex is shown on the screen and saved. (The Xray steps of ETM-8858 already state the Figma values.)

---

## ภาษาไทย (สำหรับผู้ใช้อ่าน)
**หัวข้อ:** สีใน Highlight Row และ Change Text Color ไม่ตรงกับ hex ใน Figma (ไม่ตรง 15 จาก 24 สี)
**รายละเอียด:** ในหน้า Shutdown Logic ตัวเลือกสีทั้ง 2 เมนูใช้ hex ที่ต่างจาก "Color Code" ใน Figma ช่องสีละ 1-4 ค่า และค่านี้ถูกบันทึกลง BE ตามนั้นเลย กำหนดไว้ในไฟล์ `row-color.constant.ts` ของ stms-fe (build 73dfde33)
**ขั้นตอน:** เปิดหน้า Shutdown Logic → ดับเบิลคลิกช่อง No. → คลิกขวา → Highlight Row / Change Text Color → เลือกทีละสี → เทียบค่ากับ Figma
**ผลที่ได้:** ไม่ตรง 15 สีตามตารางด้านบน (ตรง 9 สี)
**ผลที่ควรได้:** ทุกสีใช้ hex ตรงกับ Figma ทั้ง 12 สีพื้นและ 12 สีตัวอักษร

## Follow-up after logging (QA side)
- Change the spec / helpers / manual files back to the Figma values (they were changed to the build values on 24 Nov). The Xray steps already have the Figma values, so Xray needs no edit.
- Close the board item "Palette hex -> build values" in xray-fix-proposal (no longer needed).
