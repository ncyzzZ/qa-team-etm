# ชุดส่งมอบ — Xray automation toolkit

## ไฟล์ในชุดนี้

| ไฟล์ | คืออะไร | ใครต้องใช้ |
|---|---|---|
| `SETUP-TH.md` | คู่มือติดตั้งภาษาไทย (macOS + Windows) | ทุกคน — อ่านอันนี้ก่อน |
| `index.mjs` | ตัว MCP server เชื่อม Claude Desktop กับ Xray | ทุกคน |
| `README-en.md` | เอกสารอ้างอิงของ MCP (ภาษาอังกฤษ) | คนที่จะแก้/ต่อยอด |
| `xray-import.mjs` | สคริปต์ยิงผล Playwright เข้า Xray โดยไม่ต้องใช้ Claude | ทีม automation / CI |

---

## เช็กก่อนส่งต่อ

- [ ] **ไม่มี Client ID / Client Secret อยู่ในไฟล์ไหนเลย** — เปิดดูให้ชัวร์
- [ ] `.env` ไม่ได้ติดมาด้วย
- [ ] `claude_desktop_config.json` ของตัวเอง **ไม่ได้** แนบไปด้วย (มี key อยู่ข้างใน)
- [ ] ถ้ามี evidence หรือ screenshot ตัวอย่าง ดูว่าไม่มีข้อมูลลูกค้าหรือข้อมูลจริงหลุด

## ค่าที่แต่ละคนต้องตั้งเอง (ห้ามใช้ของคนอื่น)

| ค่า | ได้มาจากไหน |
|---|---|
| `XRAY_CLIENT_ID` + `XRAY_CLIENT_SECRET` | Jira → Apps → Manage apps → Xray → API Keys (ออกแยกรายคน) |
| path ของ `node` | `which node` (Mac) / `(Get-Command node).Source` (Windows) |
| path ของ `index.mjs` | ที่ที่ตัวเองวางไฟล์ไว้ |

## ค่าที่ผูกกับโปรเจกต์ ต้องแก้ถ้าเอาไปใช้กับโปรเจกต์อื่น

ในไฟล์ `xray-import.mjs` ส่วนหัว:

| ตัวแปร | ค่าตอนนี้ | หมายถึง |
|---|---|---|
| `EXECUTION_KEY` | `ETM-6081` | Test Execution ที่จะลงผล |
| `EVIDENCE_DIR` | `./evidence` | โฟลเดอร์รูป |
| `TC_KEY_PREFIX` | `ETM-` | prefix ของ project |
| `TC_KEY_OFFSET` | `6033` | ตัวเลขที่บวกกับเลข TC → TC-002 = ETM-6035 |

> `TC_KEY_OFFSET` ใช้ได้เฉพาะกรณีที่ test case ถูกสร้างเรียงกันติดกันเป็นชุดเดียว
> ถ้าเลข Jira ไม่เรียง ต้องเปลี่ยนไปทำ mapping แบบตารางแทน

---

## ลำดับการเทรน (แนะนำ)

1. ให้ทำตาม `SETUP-TH.md` จนสั่ง `xray_auth_check` ผ่าน
2. ลอง `xray_get_execution_tests` กับ execution จริงที่มีอยู่ — ยังไม่เขียนอะไร
3. ลอง `xray_scan_evidence` — ดูว่า mapping ถูกไหม ยังไม่ส่ง
4. ค่อยลอง `xray_import_results` กับ **execution ทดสอบที่สร้างขึ้นใหม่** ไม่ใช่ของจริง
5. พอมั่นใจแล้วค่อยใช้กับงานจริง

ข้อ 4 สำคัญ — `xray_import_results` เขียนทับสถานะของจริงทันที ไม่มี undo
