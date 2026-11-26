# แก้ Xray ต่อไม่ได้ (401) บน Mac

อาการ: ใน Claude พิมพ์ "เช็ค เชื่อมต่อ xray" แล้วได้

```
authenticate 401: Authentication failed. Invalid client credentials!
```

ทั้งที่ key ถูกต้องและใช้ใน terminal ได้

## สาเหตุ

- แอป Claude ไม่แทน `${XRAY_CLIENT_ID}` ใน `.mcp.json` เป็นค่าจริง แต่ส่งข้อความนี้ไปตรงๆ
- แอปที่เปิดจาก Dock มองไม่เห็น key ที่ export ไว้ใน `~/.zshrc`
- server xray จะไม่เริ่มใหม่จนกว่าจะปิด session ระหว่างนั้น session ที่เปิดอยู่จะใช้ key ผิดไปตลอด

โค้ดใน `main` แก้แล้ว (commit `b419dd2`): server อ่าน key จาก login shell เอง เหลือแค่ทำตามขั้นตอนด้านล่าง

## วิธีแก้

**1. ดึงโค้ดล่าสุด** (รันในโฟลเดอร์ของ repo นี้)

```bash
git pull origin main
```

**2. ใส่ key ใน `~/.zshrc`** (ข้ามได้ถ้ามีแล้ว)

เปิดไฟล์ด้วยคำสั่งนี้

```bash
open -e ~/.zshrc
```

เพิ่ม 2 บรรทัดนี้โดยใช้ key ของตัวเอง แล้วบันทึก ห้ามใส่ key ในไฟล์ที่ commit เข้า git

```bash
export XRAY_CLIENT_ID="ใส่ client id"
export XRAY_CLIENT_SECRET="ใส่ client secret"
```

**3. ทดสอบ key** (เปิด terminal ใหม่ก่อน)

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" -H 'Content-Type: application/json' -X POST https://xray.cloud.getxray.app/api/v2/authenticate -d "{\"client_id\":\"$XRAY_CLIENT_ID\",\"client_secret\":\"$XRAY_CLIENT_SECRET\"}"
```

- `HTTP 200`: key ถูกต้อง ไปขั้นต่อไปได้
- `HTTP 401`: key ผิดหรือหมดอายุ ต้องขอ key ใหม่จาก admin ของ Jira/Xray (ในหน้า Xray Settings → API Keys)

**4. หยุด server xray เก่าที่ค้างอยู่**

```bash
pkill -f xray-toolkit/index.mjs
```

**5. เปิดแอปใหม่**

ปิดแอป Claude ให้สนิทด้วย Cmd+Q แล้วเปิดใหม่ จากนั้นเปิด **session ใหม่** แล้วพิมพ์

```
เช็ค เชื่อมต่อ xray
```

ถ้าได้ `OK - authenticated against https://xray.cloud.getxray.app/api/v2` แปลว่าใช้ได้แล้ว

## จำไว้

- เปลี่ยน key ใน `~/.zshrc` เมื่อไร ให้ทำขั้นตอนที่ 4 และ 5 ใหม่
- session ที่เปิดค้างไว้ก่อนแก้จะยังได้ 401 ให้ใช้ session ใหม่
- `node tools/setup.mjs` เช็คแค่ว่ามี key หรือไม่ ไม่ได้เช็คว่า key ถูกต้อง ถ้าจะเช็คว่าถูกต้องให้ใช้ขั้นตอนที่ 3
