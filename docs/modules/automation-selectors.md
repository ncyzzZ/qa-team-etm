# Automation - selectors checked on the real DOM (no data-testid in the app)

Part of the ETM UI map (index: `docs/UI_Map_ETM.md`). Text below is moved verbatim from the old single file; keep the rule there: every fact has a check date, never guess, update here BEFORE writing test cases.

### Selector สำหรับ Automation (ตรวจ DOM จริง 09 Sep 2026)

**ทั้งระบบไม่มี `data-testid` แม้แต่ตัวเดียว** (ตรวจ 5 หน้า ได้ 0 ทุกหน้า) และไม่มี `data-test` · `data-qa` · `data-cy`

**ลำดับ selector ที่ให้ใช้**

| ลำดับ | Selector | ใช้ที่ไหน |
|:--:|---|---|
| 1 | `[formcontrolname="..."]` | **ฟอร์มทุกหน้า** — Create Work มีครบ: `workHeader` `priority` `department` `accommodation` `hotBed` `remark` `specificRequirement` `workBreakdown` `manpowerResource` `pob` `duration` `manHrs` `dnShift` |
| 2 | `.ag-cell[col-id="..."]` · `.ag-row[row-id="row-{uuid}"]` | **ตารางทุกหน้าเป็น AG Grid** (`ag-grid-angular`) · `row-id` = UUID จาก backend |
| 3 | `window.bryntum.query('gantt')` | Shutdown Logic · Daily Report — **ใช้ store ไม่ใช้ DOM** |
| 4 | `getByRole('button', {name})` | ปุ่มที่มีข้อความชัดเจน |
| 5 | `.b-button[data-ref="..."]` | ปุ่มภายในของ Bryntum เช่น `collapseExpand` |
| 6 | XPath / `nth()` | **ห้ามใช้** ยกเว้นไม่มีทางอื่น พร้อมคอมเมนต์กำกับ |

**`col-id` ที่ยืนยันแล้ว**

- Shutdown Event List: `ag-Grid-AutoColumn` · `platforms` · `sdType` · `plannedDate` · `taManagers` · `status` · `action`
- Worklist: `ag-Grid-AutoColumn` · `jobDescription` · `functionalLocation` · `platform` · `jobOwner` · `department` · `manpowerResourceStr` · `pob` · `duration` · `remark` · `status` · `action`

⚠️ **AG Grid ทำ virtual scrolling** — แถวนอกจอไม่มีใน DOM · ห้ามใช้ `.count()` สรุปจำนวนแถวทั้งหมด
⚠️ **Bryntum**: `records` = แถวที่ผ่าน filter · `allRecords` = ทั้งหมด · **เคยใช้ผิดแล้วเกือบเขียนค่าลง 5,223 แถว**

⚠️ **Page behaviour first**: before a step that filters, searches, deletes, pastes or drags, read the module file of that page (Worklist: `core-navigation-worklist.md`, Shutdown Logic Gantt: `shutdown-logic.md` "Gantt grid behaviour"). Not there → live check (automator step 1b) and add the fact with its date (24 Nov 2026).
⚠️ **Wait for data, not time**: after an action that reloads table data, wait for its network response or a changed row count / `Total Results` before asserting (ETM-8391, 24 Nov 2026).
⚠️ **Helpers never return silently**: a helper whose target row or cell is not found throws with a clear message (ETM-8049, 24 Nov 2026).

> แผน automation เต็ม (26 เคสที่ควรทำ + 8 กลุ่มที่ไม่ควรทำ) อยู่ใน `ETM_AutomationCandidates.md`
