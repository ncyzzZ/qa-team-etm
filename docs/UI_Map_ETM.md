# UI Map - ETM (EP-Turnaround Management): index

The map is split by module so an agent reads only what the Story needs (the old single file was about 40 KB; every card paid for all of it). Read this index, then ONLY the module files whose "read when" matches the Story.

| File | Read when | Size |
|---|---|---|
| `docs/modules/core-architecture.md` | any Story: hierarchy, roles, worklist, gantt engine, constraint date, working calendar, manpower resource | small |
| `docs/modules/core-navigation-worklist.md` | you need a URL, a menu path, the Worklist, Create Work, the Work pages or the Planning tab | medium |
| `docs/modules/manpower-mob-plan.md` | Manpower Mob Plan, Sprint 21, ETM-5614 and neighbours (table, snapshot from Shutdown Logic, max character, date rules, timeline colours) | large |
| `docs/modules/automation-selectors.md` | writing or fixing a Playwright script (selector order, the app has no data-testid) | small |
| `docs/modules/equipment-mob-plan.md` | Equipment Mob Plan (ETM-7305..7351: layout, Work Header and Equipment add/edit/delete, field limits, Filter Panel, Export, copy and paste): confirmed rules with source and date, texts, differences from the AC, open points | large |
| `docs/modules/equipment-mob-plan-validation.md` | Equipment Mob Plan page messages from the Validation & Result sheet (written 21 Oct, not checked on the app) | small |
| `docs/modules/equipment-mob-plan-figma.md` | what the Equipment Mob Plan screens should look like in Figma, and what Figma does not show | medium |
| `docs/modules/planning.md` | Planning tab and Plan Cards: create / duplicate / activate rules, row redirection, Equipment Mob Plan activation (ETM-6845, ETM-6846), open points | medium |
| `docs/modules/planning-confirmation-result.md` | Planning (View Planning Item): toast / modal messages for create, duplicate, delete, activate | medium |
| `docs/modules/shutdown-logic.md` | Shutdown Logic page: Used Resource toggle, Filter Panel and Focus toggles, blank state (ETM-7898), open points; SIMOP is in skill `etm-simop-rules` | small |
| `docs/modules/shutdown-logic-validation.md` | Shutdown Logic: toast / modal messages and field validation of Create/Edit Shutdown Logic and the Gantt Edit Work Header / Work / Work Breakdown windows (converted from the xlsx) | large |
| `docs/modules/daily-report-validation.md` | Daily Report: every toast / modal title and message (CR-01..CR-39), field limits and file rules for Create/Edit Plan and Attached Image (VP, VI), spec issues I-01..I-15 | medium |
| `docs/modules/daily-report-export-template.md` | Daily Report export to Word: page layout, sections A-F, S-Curve chart, colour rules, open points | medium |
| `docs/modules/shutdown-timeline.md` | Shutdown Timeline rules confirmed card by card: frame and split pane (ETM-7345), calendar engine and weekly plan % (7346), seeding and SD type estimate (7347), edit plan (7348), type change (7984), editable weekly Plan % (8405), open points | large |
| `docs/modules/shutdown-timeline-validation.md` | Shutdown Timeline: toast / modal messages (Update Progress, Notes, Save Plan, change Shutdown Type) and field limits (Update Progress, Note, Edit Plan) | small |
| `docs/modules/shutdown-timeline-default-plan.md` | Shutdown Timeline default plan: Major / Medium / Minor SD durations, start rules, Ramp Down date logic, weights | large |

Other places with confirmed rules: SIMOP / Work Conflict Matrix = skill `etm-simop-rules` (+ `docs/etm-7289-status.md`). Not covered yet: ETM-7899 (Filter Panel: no source file found), ETM-7340 (Manpower Mob Plan card, not merged into `manpower-mob-plan.md`), Import Work / Breakdown (`Import Breakdown Validation.xlsx` not converted).

## วิธีดูแลไฟล์นี้ (กติกาเดิม ใช้กับทุกไฟล์ใน docs/modules/)

1. **ทุกข้อต้องมีวันที่ตรวจกำกับ** — ของที่ไม่มีวันที่ ถือว่าเชื่อไม่ได้
2. **ห้ามเดา** Navigation Path / ชื่อปุ่ม / ชื่อ tab — ถ้าไม่มีในไฟล์นี้ ให้เข้า QA ตรวจก่อน หรือถามผู้ใช้
3. **เจอหน้าใหม่ / ของเปลี่ยน → อัปเดตที่นี่ทันที** ก่อนเขียน TC (Workflow step 4 ของ `CLAUDE_v2.md`)
4. **ของเก่าที่ล้าสมัยแล้ว ไม่ต้องลบ** — ใส่ป้าย 🔴 ทับพร้อมวันที่ ให้รู้ว่าเคยเป็นอะไร เพราะ TC เก่าอ้างของเก่าอยู่
5. **แยกให้ชัดว่ามาจากไหน**: ระบบจริงบน QA / Figma / เอกสาร Validation / BA confirm — ไม่ผสมกัน
