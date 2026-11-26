# ติดตั้ง Xray MCP บน Claude Desktop

ทำให้ Claude Desktop อ่าน Test Execution / test steps จาก Xray Cloud ได้
และส่งผลทดสอบ + evidence กลับเข้า Xray ได้

รองรับทั้ง **macOS** และ **Windows** — เลือกทำเฉพาะส่วนของเครื่องตัวเอง

---

## สิ่งที่ต้องเตรียม (เหมือนกันทั้งสองระบบ)

1. **Node.js 18 ขึ้นไป** — เช็คด้วย `node -v`
2. **ไฟล์ `index.mjs`** (ตัว MCP server)
3. **Xray API Key** — Client ID + Client Secret
   ขอจาก: Jira → ⚙️ Apps → Manage apps → Xray (เมนูซ้าย) → API Keys → เลือก user → Generate

> Secret แสดงครั้งเดียว ต้องเก็บไว้ทันที
> นี่คนละตัวกับ Atlassian API token — ใช้แทนกันไม่ได้

---
---

# 🍎 macOS

เปิด **Terminal** (`⌘ Space` พิมพ์ `terminal`)

## 1. วางไฟล์

```bash
mkdir -p ~/mcp/xray-mcp
mv ~/Downloads/index.mjs ~/mcp/xray-mcp/
ls -l ~/mcp/xray-mcp/
```

ต้องเห็นชื่อ `index.mjs`

## 2. หา path ของ node

```bash
which node
```

จดค่าที่ได้ เช่น `/Users/xxx/.nvm/versions/node/v25.7.0/bin/node`

> **สำคัญ** — ห้ามใส่แค่คำว่า `node` ในไฟล์ config
> Claude Desktop เปิดจาก Finder ใช้ PATH คนละชุดกับ Terminal จะหา node ไม่เจอ
> โดยเฉพาะถ้าใช้ nvm

## 3. สำรองไฟล์ config

```bash
CFG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
mkdir -p "$(dirname "$CFG")"
[ -f "$CFG" ] && cp "$CFG" "$CFG.bak" || echo '{}' > "$CFG"
python3 -c 'import json,sys; json.load(open(sys.argv[1])); print("JSON ok")' "$CFG"
```

ต้องขึ้น `JSON ok`

## 4. เพิ่ม xray พร้อมใส่ key

**แก้ `NODE_PATH` เป็นค่าจากขั้นที่ 2 ก่อน** แล้วรันทั้งก้อน
มันจะถามหา Client ID / Secret — พิมพ์แล้วตัวอักษรไม่ขึ้นบนจอ (ปกติ) กด Enter ต่อได้เลย

```bash
NODE_PATH="/Users/xxx/.nvm/versions/node/v25.7.0/bin/node"
CFG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
read -s "XID?Client ID: "; echo
read -s "XSEC?Client Secret: "; echo
NODE_PATH="$NODE_PATH" XID="$XID" XSEC="$XSEC" python3 -c 'import json,os,sys; p=sys.argv[1]; d=json.load(open(p)); d.setdefault("mcpServers",{})["xray"]={"command":os.environ["NODE_PATH"],"args":[os.path.expanduser("~/mcp/xray-mcp/index.mjs")],"env":{"XRAY_CLIENT_ID":os.environ["XID"],"XRAY_CLIENT_SECRET":os.environ["XSEC"]}}; json.dump(d,open(p,"w"),indent=2); print("done - mcpServers:", list(d["mcpServers"]))' "$CFG"
unset XID XSEC
```

ต้องขึ้น `done - mcpServers: [... 'xray' ...]`

> **ห้ามแก้ไฟล์นี้ด้วย TextEdit** — มันเปลี่ยน `"` เป็น smart quote `" "` ทำให้ JSON พังทันที
> ถ้าจำเป็นต้องแก้มือ ใช้ VS Code แทน

## 5. รีสตาร์ท

กด `⌘Q` ปิด Claude Desktop **ให้สนิท** (กดกากบาทมุมหน้าต่างไม่พอ) แล้วเปิดใหม่

## กู้คืน config (macOS)

```bash
CFG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"; cp "$CFG.bak" "$CFG"
```

## ดู log (macOS)

```bash
tail -40 ~/Library/Logs/Claude/mcp-server-xray.log
```

---
---

# 🪟 Windows

เปิด **PowerShell** (กด Start พิมพ์ `powershell`)

## 1. วางไฟล์

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\mcp\xray-mcp" | Out-Null
Move-Item "$env:USERPROFILE\Downloads\index.mjs" "$env:USERPROFILE\mcp\xray-mcp\" -Force
Get-ChildItem "$env:USERPROFILE\mcp\xray-mcp"
```

ต้องเห็นชื่อ `index.mjs`

## 2. หา path ของ node

```powershell
(Get-Command node).Source
```

จดค่าที่ได้ เช่น `C:\Program Files\nodejs\node.exe`

> ถ้าใช้ **nvm-windows** path จะเป็นแบบ `C:\Users\xxx\AppData\Roaming\nvm\v20.11.0\node.exe`
> และจะพังเมื่อสลับเวอร์ชัน — ต้องกลับมาแก้ path ใหม่

## 3. สำรองไฟล์ config

```powershell
$cfg = "$env:APPDATA\Claude\claude_desktop_config.json"
New-Item -ItemType Directory -Force -Path (Split-Path $cfg) | Out-Null
if (!(Test-Path $cfg)) { '{}' | Set-Content $cfg }
Copy-Item $cfg "$cfg.bak" -Force
Get-Content $cfg -Raw | ConvertFrom-Json | Out-Null; "JSON ok"
```

ต้องขึ้น `JSON ok`

## 4. เพิ่ม xray พร้อมใส่ key

รันทั้งก้อน มันจะถามหา Client ID / Secret (Secret จะไม่แสดงตอนพิมพ์)

```powershell
$cfg  = "$env:APPDATA\Claude\claude_desktop_config.json"
$node = (Get-Command node).Source
$id   = Read-Host "Client ID"
$sec  = Read-Host "Client Secret" -AsSecureString
$secPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))

$j = Get-Content $cfg -Raw | ConvertFrom-Json
if (-not $j.PSObject.Properties['mcpServers']) { $j | Add-Member mcpServers ([pscustomobject]@{}) }
$entry = [pscustomobject]@{
  command = $node
  args    = @("$env:USERPROFILE\mcp\xray-mcp\index.mjs")
  env     = [pscustomobject]@{ XRAY_CLIENT_ID = $id; XRAY_CLIENT_SECRET = $secPlain }
}
$j.mcpServers | Add-Member xray $entry -Force
[IO.File]::WriteAllText($cfg, ($j | ConvertTo-Json -Depth 20), (New-Object Text.UTF8Encoding $false))
"done - mcpServers: " + ($j.mcpServers.PSObject.Properties.Name -join ", ")
Remove-Variable id, sec, secPlain
```

ต้องขึ้น `done - mcpServers: ... xray ...`

> **ห้ามแก้ไฟล์นี้ด้วย Notepad ถ้าเลี่ยงได้** — ถ้าต้องแก้มือ ใช้ VS Code
> และจำไว้ว่าใน JSON ต้องเขียน path เป็น `C:\\Users\\...` (backslash สองตัว)
> หรือใช้ `/` แทนก็ได้ — คำสั่งข้างบนจัดการให้แล้ว

## 5. รีสตาร์ท

กดกากบาทมุมหน้าต่าง **ไม่พอ** — Claude ยังทำงานอยู่ใน system tray
คลิกขวาไอคอน Claude ที่มุมขวาล่าง (อาจต้องกดลูกศร `^` เพื่อขยาย) → **Quit** แล้วเปิดใหม่

ถ้าไม่แน่ใจ ใช้คำสั่งนี้ปิดให้หมด:

```powershell
Get-Process Claude -ErrorAction SilentlyContinue | Stop-Process -Force
```

## กู้คืน config (Windows)

```powershell
$cfg = "$env:APPDATA\Claude\claude_desktop_config.json"; Copy-Item "$cfg.bak" $cfg -Force
```

## ดู log (Windows)

```powershell
Get-Content "$env:APPDATA\Claude\logs\mcp-server-xray.log" -Tail 40
```

---
---

# ทดสอบ (เหมือนกันทั้งสองระบบ)

กด **New** เปิด **แชทธรรมดา** แล้วพิมพ์ทีละอัน:

```
เช็ค xray_auth_check ให้หน่อย
```
```
อ่าน test execution <KEY>-6081 ให้ดูหน่อย
```
```
ดึง step ของ <KEY>-6035 มาให้ดู
```

ผ่านทั้งสามข้อ = ติดตั้งเสร็จ

---

# Tools ที่ได้

| Tool | ทำอะไร |
|---|---|
| `xray_auth_check` | เช็คว่า credential ใช้ได้ |
| `xray_get_execution_tests` | อ่าน Test Execution — มี test อะไรบ้าง สถานะปัจจุบัน |
| `xray_get_test_steps` | อ่าน step ของ test (action / data / expected result) |
| `xray_scan_evidence` | สแกนโฟลเดอร์ evidence ดู mapping + ขนาดไฟล์ (ยังไม่ส่งอะไร) |
| `xray_import_results` | ส่ง status + แนบ evidence กลับเข้า Xray |
| `xray_graphql` | ยิง GraphQL เอง เผื่อ query สำเร็จรูปไม่ตรงงาน |

---

# แก้ปัญหา

| อาการ | สาเหตุ | วิธีแก้ |
|---|---|---|
| Claude บอกว่าไม่รู้จัก tool | ใช้แชทแบบ task/Cowork ซึ่งรันบนคลาวด์ มองไม่เห็น MCP ในเครื่อง | เปิดแชทธรรมดาแทน |
| MCP ไม่ขึ้นเลย | `command` ใส่แค่ `node` | ใส่ path เต็มจากขั้นที่ 2 |
| JSON error | แก้ไฟล์ด้วย TextEdit/Notepad แล้วโดน smart quote หรือ backslash เดี่ยว | กู้จาก `.bak` แล้วทำขั้นที่ 4 ใหม่ |
| ปิดแอปแล้วยังไม่ reload (Windows) | ปิดแค่หน้าต่าง แอปยังอยู่ใน tray | Quit จาก tray หรือ `Stop-Process` |
| `401` ตอน auth_check | key ผิด หรือถูก revoke | สร้าง API key ใหม่ |
| `400` ตอน import | testKey ไม่ได้อยู่ใน execution นั้น | เช็ค key ให้ตรง |
| import ช้า / ไม่ผ่าน | payload ใหญ่เกิน (evidence base64) | แบ่งส่งเป็นชุด หรือจำกัดจำนวนรูปต่อ test |

---

# เรื่องความปลอดภัย

- Client Secret เก็บอยู่ในไฟล์ config บนเครื่องเท่านั้น
- **ห้าม** commit เข้า git และ **ห้าม** พิมพ์ลงแชท (ถือว่า exposed ต้อง regenerate ใหม่)
- API key มีขอบเขตแค่ Xray ไม่ได้เพิ่มสิทธิ์ใน Jira เกินกว่าที่ account มีอยู่
- ออก key แยกรายคน อย่าใช้ร่วมกัน — จะได้ไล่ย้อนได้ว่าใครส่งผลอะไรเข้าไป
- ถ้าเปลี่ยน node เวอร์ชันใหม่แล้วลบตัวเก่า MCP จะพัง ต้องกลับมาแก้ path ในขั้นที่ 4
