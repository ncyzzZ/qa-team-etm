# xray-mcp — Xray Cloud MCP server for Claude Desktop

Zero dependencies. Needs Node 18+ only.

## 1. Get Xray API keys

Jira → ⚙️ Apps → Manage apps → **Xray** (left menu) → **API Keys** → pick your user → **Generate**

You get a **Client ID** and a **Client Secret**. The secret is shown once.

(This is NOT the Atlassian API token — different system.)

## 2. Install

Put this folder somewhere permanent, e.g.:

    ~/mcp/xray-mcp/

## 3. Configure Claude Desktop

macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "xray": {
      "command": "node",
      "args": ["/Users/np/mcp/xray-mcp/index.mjs"],
      "env": {
        "XRAY_CLIENT_ID": "your-client-id",
        "XRAY_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

Use the **absolute** path. Restart Claude Desktop fully (quit, not just close the window).

## 4. Tools

| Tool | What it does |
|---|---|
| `xray_auth_check` | Confirms the credentials work |
| `xray_get_execution_tests` | Reads a Test Execution: every test in it, with key, summary and current status |
| `xray_get_test_steps` | Reads the manual steps (action / data / expected result) of one test |
| `xray_scan_evidence` | Reads an evidence folder, shows the TC → Jira key mapping and file sizes. Sends nothing. |
| `xray_import_results` | Sets test statuses in a Test Execution and attaches evidence files |
| `xray_graphql` | Escape hatch for any other Xray GraphQL query |

Test steps live in Xray's own store, not in Jira fields — `xray_get_test_steps` is the
only way to read them. This is what makes a read-execute-report loop possible:
read the steps, run them in the browser, then write the results back.

## 5. Example prompts in Claude Desktop

> เช็ค evidence ที่ `/Users/me/work/my-fe-qa/evidence` หน่อย ใช้ prefix <KEY>- offset 6033

> ผ่านหมดทุกข้อ ใส่ผล PASSED เข้า test execution <KEY>-6081 พร้อมแนบ evidence ให้ด้วย

## Notes

- Evidence is sent base64 inside the import payload. `xray_scan_evidence` shows the total size first — if it is large, import in batches or set `maxEvidence`.
- Status values: `PASSED`, `FAILED`, `TODO`, `EXECUTING` (default Xray Cloud names).
- Server/DC Xray is not supported — this targets Xray **Cloud** only.
