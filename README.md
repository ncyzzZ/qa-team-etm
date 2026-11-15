# ทีม QA AI สำหรับ ETM

ทุกอย่างของทีมอยู่ใน repo นี้ (agents, skills, เอกสาร, สคริปต์รายงาน, บอร์ด) คนอื่นแค่ clone แล้วเปิดด้วย Claude Code

## เริ่มใช้ (ครั้งเดียว)

1. `git clone https://github.com/ncyzzZ/qa-team-etm.git` แล้วเปิดโฟลเดอร์นี้ใน Claude Code
2. ต้องมี **Node.js 18+** และ repo Playwright `ep-etm-fe-qa` (ติดตั้ง `npm install` แล้ว)
3. ตั้งค่าเครื่อง (ใช้ได้ทั้ง **Windows และ Mac**):
   - บอกที่อยู่ของ repo Playwright `ep-etm-fe-qa` (คำสั่งนี้ตรวจโฟลเดอร์ให้ แล้วเก็บใน `.env` ที่ไม่ขึ้น git):
     - Windows: `node tools/setup.mjs "D:\path\to\ep-etm-fe-qa"`
     - Mac: `node tools/setup.mjs ~/path/to/ep-etm-fe-qa`
     - ถ้าวาง `ep-etm-fe-qa` ไว้ข้าง repo นี้ ไม่ต้องบอก
   - ตั้ง `XRAY_CLIENT_ID` และ `XRAY_CLIENT_SECRET` เป็น environment variable (ห้ามใส่ในไฟล์ที่ commit; `.mcp.json` อ่านสองตัวนี้ และใช้ server ใน `xray-toolkit/`):
     - Windows (PowerShell, มีผลกับ terminal ที่เปิดใหม่): `[Environment]::SetEnvironmentVariable('XRAY_CLIENT_ID','<ค่า>','User')` แล้วทำซ้ำกับ `XRAY_CLIENT_SECRET`
     - Mac (zsh): เพิ่มบรรทัด `export XRAY_CLIENT_ID=<ค่า>` และ `export XRAY_CLIENT_SECRET=<ค่า>` ใน `~/.zshrc` แล้วเปิด terminal ใหม่
   - ตรวจว่าครบ: `node tools/setup.mjs` (ไม่แก้อะไร แค่รายงานว่าอะไรยังขาด)
4. เชื่อม connector ใน Claude: Atlassian (Jira) และ Figma ตามสิทธิ์ที่คุณมี
5. เปิด Claude Code ในโฟลเดอร์นี้ พิมพ์ `/agents` ควรเห็น 7 ตัว: ba-analyst, ux-inspector, test-designer, test-reviewer, automation-engineer, evidence-reporter, jira-xray-logger

> **หมายเหตุ skill ซ้ำบนบัญชี:** บัญชี Claude ที่ใช้ร่วมกันยังมี skill ชื่อเดียวกันรุ่นเก่า (ขึ้นต้น `anthropic-skills:`) ที่คนอื่นใช้อยู่ ใน repo นี้ให้ใช้ skill ของโปรเจกต์ (ไม่มี prefix) เท่านั้น กติกานี้เขียนไว้ใน `CLAUDE.md` แล้ว ถ้าเห็น Claude เรียก `anthropic-skills:...` ให้บอกมันให้หยุดและกลับไปทำตาม `TEAM.md` (โค้ดรายงานของ repo อยู่ใน `tools/` จึงไม่ถูก skill เก่าเขียนทับ)

## วิธีเริ่มงาน

พิมพ์ `เริ่มเขียน TC การ์ด ETM-1234` (หรือส่งแค่คีย์ `ETM-1234`) Claude จะอ่าน `TEAM.md` แล้วทำงานเป็น QA LEAD และเปิดบอร์ดที่ http://localhost:4777

**เรียกครั้งเดียวจบ:** Lead ทำครบทุกขั้นเอง ไม่ถามว่า "ต่อไหม" ระหว่างขั้น และหยุดเฉพาะจุดที่ต้องให้คุณตัดสิน คุณอนุมัติล่วงหน้าได้ในข้อความเดียวกัน เช่น

- `ETM-1234 ทำให้ครบ` = ดูผล quick scan และร่าง TC แล้วไปต่อโดยไม่รอ
- `ETM-1234 ทำให้ครบ push ได้เลย รันได้เลย` = ผ่านด่านตรวจแล้ว push Xray และรันเทสให้เลย
- การล็อก defect และการตัดสินว่า step ที่ fail เป็น bug หรือสคริปต์ผิด ไม่มีทางอนุมัติล่วงหน้า ต้องให้คุณตอบเสมอ

ผลงานของทุก agent ผ่าน "ด่านตรวจคุณภาพ" (G1-G8 ใน `TEAM.md`) ก่อนถึงมือคุณ

## มีอะไรใน repo

| ที่อยู่ | คืออะไร |
|---|---|
| `TEAM.md`, `CLAUDE.md` | กติกาและวงจรการทำงานของทีม, ค่า settings (Jira, board, `PW_REPO`) |
| `.claude/agents/` | 7 บทบาท |
| `.claude/skills/` | `etm-nn-fullqa` (กติกา Jira/Xray), `etm-evidence-report` (รายงานหลังรัน), `log-defect-jira-etm` (ล็อก defect), `etm-simop-rules` (Story SIMOP), `resolve-tested-by` (ปิด Test ของ Story), `etm-xray-delete-test-executions` (ลบถาวร ต้องสั่งเอง), `test-field-limit` (ทดสอบจำนวนตัวอักษรของช่อง) |
| `.claude/team/` | บอร์ดสถานะ, ไฟล์ความรู้ (`knowledge/`: lessons, วิธีออกแบบ, กฎเขียนสคริปต์, วิธีรัน/Xray) |
| `docs/` | workflow doc, UI map ของ ETM, template เอกสาร |
| `evals/` | fixture ทดสอบตัวตรวจ (`node tools/qa-check.mjs selftest`) เพิ่มทุกครั้งที่ทีมพลาด |
| `tools/` | `run-card.mjs` (รัน Playwright ต่อการ์ด แล้วสร้างรายงานทันที), `evidence-report-v4.mjs` (ตัวสร้างรายงาน) |
| `tools/qa-check.mjs` | ตัวตรวจผลงานของ agent ก่อนส่งให้ผู้ใช้: `draft` (test case), `spec` (สคริปต์), `work` (ไฟล์ของ analyst/inspector/reviewer/automator), `manifest`, `diff` (Xray เทียบกับร่าง) |
| `xray-toolkit/` | MCP server ของ Xray และสคริปต์ import |

## รันเทสและดูรายงาน

จากโฟลเดอร์ root ของ repo นี้ (เปิด VPN ก่อน):

```bash
node tools/run-card.mjs ETM-1234 <spec> -g "ETM-1111|ETM-2222"
```

- ผลรันเก็บใน `test-results-<KEY>-<เวลา>` ใน `PW_REPO` และรายงาน HTML อยู่ที่ `Evidence/_reports/` ใน repo นี้ (ไม่ถูก commit)
- สร้างรายงานใหม่จากโฟลเดอร์ที่เก็บไว้: `node tools/run-card.mjs ETM-1234 --build-only <โฟลเดอร์ผลรัน>`
- รายงานมี 2 แท็บ: ผลรายขั้น (ตารางพร้อมรูป) และสรุปส่งต่อ dev / BA
- Step (Action) / Expected / Test Data ในรายงานมาจาก manifest ที่ดึงจาก Xray (ดู `.claude/skills/etm-evidence-report/SKILL.md`)

## บอร์ด

`node .claude/team/team.mjs open` (เปิด), `stop` (ปิด), `status` (ดูสถานะ) เซิร์ฟเวอร์ฟังเฉพาะเครื่องคุณ (127.0.0.1)

## ไม่ถูกเก็บใน git (อยู่เฉพาะเครื่อง)

`.env`, ข้อมูลงานรายการ์ด `.claude/team/work/`, `Evidence/`, ผลรัน, ไฟล์ zip

## ข้อจำกัดที่ควรรู้

- ทีมจะไม่รันเทส ไม่ล็อก defect และไม่ push เข้า Xray ถ้าคุณยังไม่ได้สั่งตรง ๆ
- Figma เป็น View seat เรียกได้จำกัดต่อเดือน Inspector จะแจ้งจำนวนครั้งก่อนใช้
- ตั้งโมเดลของแต่ละตัวได้ที่บรรทัด `model:` ของไฟล์ใน `.claude/agents/`

## ช่องว่างที่ยังไม่ได้ปิด

1. ชุดประเมินคุณภาพ agent จากการ์ดจริงที่รู้เฉลย (`evals/` ตอนนี้ทดสอบแค่ตัวตรวจ ไม่ได้ทดสอบว่า agent เขียนได้ดีไหม)
2. จำกัดเครื่องมือต่อ agent (analyst/inspector/reviewer ไม่ควรเขียน Jira ได้เลย ตอนนี้กันด้วยกติกากับ Hard stops)
3. ไฟล์ trace รวม AC -> TC -> Xray key -> ผลรัน
4. ตัวชี้วัดที่ยังไม่มี: จำนวนครั้งที่ผู้ใช้ต้องแก้ผลของ agent, ต้นทุนต่อการ์ด
