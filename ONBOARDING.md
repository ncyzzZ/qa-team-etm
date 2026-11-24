# ตั้งค่าเครื่องสำหรับทีม QA ETM (สำหรับคนใหม่)

ทำตามลำดับครั้งเดียว ใช้ได้ทั้ง Windows และ Mac ใช้เวลาราว 20-30 นาที

> **สำคัญที่สุด:** กฎของทีม (การล็อก defect, การ push Xray, การขออนุมัติ) อยู่ใน repo `qa-team-etm` และทำงานเฉพาะเมื่อเปิด **Claude Code ในโฟลเดอร์ `qa-team-etm`** เท่านั้น
> ถ้าใช้แท็บ Chat หรือ Cowork บน claude.ai หรือเปิด Claude Code ที่โฟลเดอร์อื่น Claude จะใช้ skill รุ่นเก่าบนบัญชี (`anthropic-skills:...`) และทำงานผิดกฎ

## 1. ของที่ต้องมีในเครื่อง

- **Claude Code**: ใช้แท็บ Code ในแอป Claude Desktop หรือคำสั่ง `claude` ใน terminal
- **Node.js 18 ขึ้นไป** และ **git**
- **VPN** ของบริษัท (ต้องใช้ตอนรันเทสบน QA)
- สิทธิ์เข้า GitHub ของทั้งสอง repo (ขอจากพี่ที่ดูแล)

## 2. Clone ทั้งสอง repo ไว้โฟลเดอร์เดียวกัน

```bash
git clone https://github.com/ncyzzZ/qa-team-etm.git
```

```bash
git clone https://github.com/ncyzzZ/ep-etm-fe-qa.git
```

ควรได้ `qa-team-etm` กับ `ep-etm-fe-qa` วางข้างกัน ถ้าวางข้างกันแบบนี้ ข้อ 4 จะหา path ให้เอง

## 3. ติดตั้ง Playwright repo

เข้าไปที่โฟลเดอร์ `ep-etm-fe-qa` แล้วรัน

```bash
npm install
```

```bash
npx playwright install chromium
```

จากนั้นคัดลอก `.env.example` เป็น `.env` (ในโฟลเดอร์ `ep-etm-fe-qa`) แล้วกรอกค่า login และ DB ของ QA **ขอค่าจากพี่ที่ดูแล ห้าม commit ไฟล์ `.env`**

## 4. ตั้งค่า repo ทีม QA

เข้าไปที่โฟลเดอร์ `qa-team-etm`

- ถ้า `ep-etm-fe-qa` ไม่ได้วางข้างกัน ให้บอกที่อยู่ (คำสั่งนี้ตรวจโฟลเดอร์แล้วจำไว้ใน `.env` ของ repo นี้)
  - Windows: `node tools/setup.mjs "D:\path\to\ep-etm-fe-qa"`
  - Mac: `node tools/setup.mjs ~/path/to/ep-etm-fe-qa`
- (ไม่บังคับ) ถ้ามี repo `stms-fe` ของ dev ให้เพิ่มบรรทัด `FE_REPO=<ที่อยู่ stms-fe>` ใน `qa-team-etm/.env` ระบบซ่อม locator และ `regress.mjs` จะใช้ได้

## 5. ตั้ง Xray key เป็น environment variable

ขอ `XRAY_CLIENT_ID` และ `XRAY_CLIENT_SECRET` จากพี่ที่ดูแล **ห้ามใส่ในไฟล์ที่ commit**

- **Windows (PowerShell)** รันสองบรรทัดนี้ แล้วปิดเปิด Claude Desktop / terminal ใหม่
  - `[Environment]::SetEnvironmentVariable('XRAY_CLIENT_ID','<ค่า>','User')`
  - `[Environment]::SetEnvironmentVariable('XRAY_CLIENT_SECRET','<ค่า>','User')`
- **Mac (zsh)** เพิ่มสองบรรทัดนี้ใน `~/.zshrc` แล้วเปิด terminal ใหม่ (ถ้าใช้ Claude Desktop ให้ปิดแล้วเปิดแอปใหม่)
  - `export XRAY_CLIENT_ID=<ค่า>`
  - `export XRAY_CLIENT_SECRET=<ค่า>`

## 6. รายชื่อ dev สำหรับ assignee ของ defect

คัดลอก `.claude/team/people.example.md` เป็น `.claude/team/people.local.md` แล้วใส่บรรทัดละคน `ชื่อเล่น = ชื่อใน Jira (ภาษาอังกฤษ)` ขอรายชื่อจากพี่ที่ดูแล ไฟล์นี้ไม่ขึ้น git

## 7. ตรวจว่าครบ

ในโฟลเดอร์ `qa-team-etm` รัน

```bash
node tools/setup.mjs
```

ต้องจบด้วย `[setup] all good` ถ้าขึ้น `FAIL` ให้แก้ตามที่บอกในบรรทัดนั้น

## 8. เปิด Claude Code ให้ถูกที่

1. เปิด Claude Code โดยเลือกโฟลเดอร์ **`qa-team-etm`** (ไม่ใช่โฟลเดอร์แม่ และไม่ใช่ `ep-etm-fe-qa`)
2. ถ้ามีคำถามว่า "เชื่อถือโฟลเดอร์นี้ไหม" ให้ตอบ **เชื่อถือ (Trust)** ไม่อย่างนั้น hook ของทีมจะไม่ทำงาน
3. เชื่อม connector ในแอป Claude: **Atlassian (Jira)** บังคับ, **Figma** ถ้ามีสิทธิ์
4. ตรวจในแชท:
   - พิมพ์ `/agents` ต้องเห็น agent ของทีม (ba-analyst, test-designer, automation-engineer ฯลฯ)
   - ถามว่า "skill log-defect-jira-etm ที่ใช้อยู่เป็นของ repo ไหม" Claude ต้องตอบว่าเป็นของ repo (`.claude/skills/`) ไม่ใช่ `anthropic-skills:`
5. บอร์ดสถานะเปิดที่ http://localhost:4777 (ขึ้นเองตอน Claude เริ่มทำงานการ์ดแรก)

## 9. เริ่มงาน

พิมพ์แค่คีย์การ์ด เช่น `ETM-1234` หรือ `เริ่มเขียน TC การ์ด ETM-1234` Claude จะทำตาม `TEAM.md` เอง

- Claude ต้องถามก่อนทุกครั้งที่จะรันเทส push Xray หรือล็อก defect ตอบในแชทหรือกดปุ่มบนบอร์ดก็ได้
- **ห้ามพิมพ์ชื่อ skill ที่ขึ้นต้นด้วย `anthropic-skills:` เอง** (repo จะบล็อกไว้ แต่อย่าเรียกเองดีกว่า)

## 10. ทุกเช้าก่อนเริ่มงาน

ดึงกฎและสคริปต์ล่าสุดทั้งสอง repo

```bash
git -C qa-team-etm pull
```

```bash
git -C ep-etm-fe-qa pull
```

## ถ้ากฎดูไม่ตรงกับของพี่

ตรวจตามนี้ก่อนถาม

1. เปิด Claude Code ที่โฟลเดอร์ `qa-team-etm` หรือเปล่า (ดู path ด้านบนของหน้าต่าง)
2. `git pull` แล้วหรือยัง
3. `node tools/setup.mjs` ขึ้น `all good` ไหม
4. ถ้าเห็นข้อความ "is the shared account's OLD copy" แปลว่า repo บล็อก skill เก่าให้แล้ว Claude จะเรียกตัวที่ถูกต่อเอง
