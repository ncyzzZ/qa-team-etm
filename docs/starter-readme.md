# QA team starter

ทีม QA ที่ทำงานด้วย Claude Code: เขียน test case, รัน Playwright, ทำ evidence, push ผลขึ้น Xray, log defect
โดยมีบอร์ดสถานะให้ดูและกดตอบคำถามได้
A QA team that runs on Claude Code: writes test cases, runs Playwright, builds evidence, pushes results to Xray and logs defects, with a status board you can watch and answer on.

ใช้เวลาตั้งค่าครั้งแรกประมาณ 30–60 นาที / First setup takes about 30–60 minutes.

---

## ต้องมีอะไรก่อน / What you need first

- **Claude Code** (แท็บ Code ในแอป Claude Desktop หรือคำสั่ง `claude`) / the Code tab in Claude Desktop, or the `claude` command
- **Node.js 18+** และ / and **git**
- **Jira Cloud + Xray** ของโปรเจกต์คุณ และ Xray API key / your project's Jira Cloud + Xray, and an Xray API key
- **Playwright repo** ของทีมคุณ (repo ที่เก็บ test script) / your team's Playwright repo (where the test scripts live)
- (ไม่บังคับ / optional) repo FE ของ dev สำหรับ self-healing / the developers' FE repo, for self-healing

---

## ตั้งค่าทีละขั้น / Setup, step by step

### ขั้นที่ 1: เข้าไปในโฟลเดอร์นี้ก่อนเสมอ / Step 1: always go into this folder first

> ⚠️ ทุกคำสั่งข้างล่างต้องรัน **ในโฟลเดอร์นี้** ถ้ารันที่อื่นจะไปแก้ repo อื่นแทน
> ⚠️ Run every command below **inside this folder**. Run elsewhere, it changes another repo.

```bash
cd /path/to/qa-team-starter
```

### ขั้นที่ 2: ทำเป็น git repo ของทีมคุณ / Step 2: make it your team's git repo

```bash
git init && git add -A && git commit -m "starter"
```

### ขั้นที่ 3: สร้าง profile ของโปรเจกต์คุณ / Step 3: create your project's profile

ใส่ค่าของคุณแทนตัวอย่าง (ตัวอย่างนี้สมมติว่าโปรเจกต์ชื่อ ACME) / Put your own values in place of the example (ACME):

```bash
node tools/setup.mjs --new-profile acme --key ACME --site acme.atlassian.net --project-id 10001 --board 42 --pw-repo-dir acme-fe-qa --fe-repo-dir acme-fe
```

| ค่า / Flag | คืออะไร / What it is |
|---|---|
| `--new-profile` | ชื่อ profile ตัวเล็ก / profile name, lowercase |
| `--key` | Jira project key เช่น `ACME` (การ์ดจะเป็น `ACME-123`) / e.g. `ACME` (cards are `ACME-123`) |
| `--site` | Jira site ของคุณ / your Jira site |
| `--project-id`, `--board` | ตัวเลข id ของ project และ board ใน Jira / numeric Jira project and board ids |
| `--pw-repo-dir`, `--fe-repo-dir` | ชื่อโฟลเดอร์ Playwright repo และ FE repo / folder names of the Playwright and FE repos |

**ควรเห็น / You should see:** `profiles/acme/` ถูกสร้าง และรายการเช็ก `OK` / `FIX` / `profiles/acme/` is created, then a list of `OK` / `FIX` checks.
บรรทัด `FIX` ตอนนี้ยังปกติ ขั้นต่อไปจะแก้ / `FIX` lines are normal at this point; the next steps fix them.

### ขั้นที่ 4: ใส่ค่าลับใน .env / Step 4: put secrets in .env

```bash
cp .env.example .env
```

เปิด `.env` แล้วกรอก / Open `.env` and fill in: `PW_REPO` (path เต็มของ Playwright repo / full path of the Playwright repo), `XRAY_CLIENT_ID`, `XRAY_CLIENT_SECRET`
ห้าม commit `.env` (git ignore ไว้แล้ว) / Never commit `.env` (it is git-ignored).
เชื่อม Jira ผ่าน Atlassian connector ใน Claude / Connect Jira through the Atlassian connector in Claude.

### ขั้นที่ 5: เขียนกฎของโปรเจกต์ / Step 5: write your project's rules

แก้ไฟล์ `profiles/acme/rules.md` (Claude อ่านทุกครั้งที่เปิด session) / Edit `profiles/acme/rules.md` (Claude reads it in every session):
role ที่ใช้ login บน QA และสิทธิ์ของแต่ละ role, ข้อมูลที่ห้ามแตะ, หน้าที่ต้องทำอะไรก่อนเทส
login roles on QA and what each may do, data nobody may touch, pages that need a first step before testing.

และใน `profiles/acme/profile.json` กรอก `jira.fields` (id ของ custom field) และ `roles` /
and in `profiles/acme/profile.json` fill `jira.fields` (custom field ids) and `roles`.

### ขั้นที่ 6: เช็กว่าพร้อม / Step 6: check it is ready

```bash
node tools/setup.mjs
node tools/profile.mjs show
node --test tools/profile-rules.test.mjs tools/export-starter.test.mjs
```

**ควรเห็น / You should see:** ไม่มี `FIX`, เห็นค่าของคุณ, เทส `fail 0` / no `FIX`, your values, and tests with `fail 0`.

---

## ใช้งานครั้งแรกจะเป็นยังไง / What the first time looks like

1. เปิด Claude Code **ในโฟลเดอร์นี้** / Open Claude Code **in this folder**.
   ตอนเปิด session ระบบจะส่งกฎของโปรเจกต์คุณให้ Claude อัตโนมัติ / At session start your project's rules are given to Claude automatically.
   ลองถาม / Try asking: "project key ของเราคืออะไร" → ควรตอบ `ACME` / it should answer `ACME`.
2. พิมพ์เลขการ์ด Story หนึ่งใบ เช่น `ACME-123` / Type one Story key, e.g. `ACME-123`.
3. Claude ทำหน้าที่ QA lead: เปิดบอร์ดที่ http://localhost:4777, อ่าน Story และ AC, ถามสิ่งที่ไม่ชัด, ออกแบบ test case แล้วส่งให้ reviewer ตรวจ
   Claude acts as the QA lead: opens the board at http://localhost:4777, reads the Story and AC, lists what is unclear, designs test cases and has them reviewed.
4. ก่อนทำอะไรที่ย้อนไม่ได้ (push Xray, log defect, ลบ, เขียน Jira) จะถามคุณก่อน บนบอร์ดหรือในแชท
   Before anything that cannot be undone (Xray push, defect, delete, Jira write) it asks you first, on the board or in chat.

ครั้งแรกอาจช้าและถามเยอะกว่าปกติ เพราะยังไม่มี UI map และกฎของโปรเจกต์ยังน้อย ยิ่งเขียน `rules.md` ครบ ยิ่งถามน้อยลง
The first card is slower and asks more, because there is no UI map yet and few project rules. The fuller `rules.md` gets, the fewer questions.

---

## ⚠️ ต้องรู้ก่อนใช้จริง / Know this before real use

- **การอนุญาตล่วงหน้าเป็นของทีมเดิม** / **Standing approvals belong to the original team.**
  `CLAUDE.md` ข้อ 3d และ `TEAM.md` "Standing approvals" มีงานที่ Claude ทำได้เลยโดยไม่ถาม (เช่นรันเทสบางแบบ, re-run, apply heal) ซึ่งทีมเดิมเป็นคนอนุญาต
  ทีมคุณควรอ่านแล้วตัดสินใจเอง แก้หรือลบข้อที่ไม่เห็นด้วย ก่อนใช้กับงานจริง
  `CLAUDE.md` item 3d and `TEAM.md` "Standing approvals" list things Claude does without asking (some test runs, re-runs, applying heals), approved by the original team.
  Read them and decide as a team; change or remove what you do not agree with before real use.
- **Playwright repo ต้องมีโครงตามนี้ถึงจะรันอัตโนมัติได้** / **Your Playwright repo needs this layout for automated runs:**
  `node_modules/@playwright/test` (ติดตั้งแล้ว / installed), ผลรันไปที่ / results in `output/runs/`,
  ข้อมูลเทสของการ์ด / card test data in `scripts/seed/cards/<KEY>.data.cjs`, login ผ่าน / login through `seed.<role>.spec.ts`.
  ถ้ายังไม่มี ขั้นออกแบบ test case และ Jira/Xray ใช้ได้ แต่ขั้นรันอัตโนมัติต้องปรับ repo ก่อน
  Without it, test design and Jira/Xray work, but automated runs need the repo adapted first.
- **เทสของเครื่องมือมีมาไม่ครบ** / **Only some tool tests are included** (7 files). ถ้าแก้ไฟล์ใน `tools/` ให้เพิ่มเทสเอง / If you change `tools/`, add tests.

---

## อ่านต่อ / Read next

- [docs/new-team-setup.md](docs/new-team-setup.md) รายละเอียดการตั้งค่าทุกช่อง / every setting in detail (English)
- `CLAUDE.md`, `TEAM.md` ขั้นตอนการทำงานของทีม / the team's process
- `profiles/<name>/` ทุกอย่างที่เป็นของโปรเจกต์คุณ / everything specific to your project

ลบ `profiles/example/` ได้เมื่อ profile ของคุณใช้งานได้แล้ว / Delete `profiles/example/` once your profile works.
