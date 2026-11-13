# ทีม QA AI สำหรับ ETM

ทุกอย่างของทีมอยู่ใน repo นี้ (agents, skills, เอกสาร, สคริปต์รายงาน, บอร์ด) คนอื่นแค่ clone แล้วเปิดด้วย Claude Code

## เริ่มใช้ (ครั้งเดียว)

1. `git clone https://github.com/ncyzzZ/qa-team-etm.git` แล้วเปิดโฟลเดอร์นี้ใน Claude Code
2. ต้องมี **Node.js 18+** และ repo Playwright `ep-etm-fe-qa` (ติดตั้ง `npm install` แล้ว)
3. ตั้ง environment variable (ห้ามใส่ลงไฟล์ที่ commit):
   - `PW_REPO` = โฟลเดอร์ของ `ep-etm-fe-qa` (ถ้าวางไว้ข้าง repo นี้ในชื่อ `ep-etm-fe-qa` ไม่ต้องตั้ง)
   - `XRAY_CLIENT_ID` และ `XRAY_CLIENT_SECRET` สำหรับ Xray (`.mcp.json` อ่านจากสองตัวนี้ และใช้ server ใน `xray-toolkit/`)
4. เชื่อม connector ใน Claude: Atlassian (Jira) และ Figma ตามสิทธิ์ที่คุณมี
5. เปิด Claude Code ในโฟลเดอร์นี้ พิมพ์ `/agents` ควรเห็น 7 ตัว: ba-analyst, ux-inspector, test-designer, test-reviewer, automation-engineer, evidence-reporter, jira-xray-logger

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
| `.claude/skills/` | `etm-nn-fullqa` (กติกา Jira/Xray), `etm-evidence-report` (รายงานหลังรัน), `log-defect-jira-etm` (ล็อก defect), `etm-simop-rules` (Story SIMOP) |
| `.claude/team/` | บอร์ดสถานะ, ไฟล์ความรู้ (`knowledge/`: lessons, วิธีออกแบบ, กฎเขียนสคริปต์, วิธีรัน/Xray) |
| `docs/` | workflow doc, UI map ของ ETM, template เอกสาร |
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
