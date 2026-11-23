#!/usr/bin/env node
/**
 * xray-mcp - minimal MCP server for Xray Cloud (zero dependencies, Node 18+)
 *
 * Env:
 *   XRAY_CLIENT_ID      (required)
 *   XRAY_CLIENT_SECRET  (required)
 *   XRAY_BASE           (optional, default https://xray.cloud.getxray.app/api/v2)
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { execFileSync } from 'node:child_process';

// Some hosts (the Claude desktop app) pass "${XRAY_CLIENT_ID}" from .mcp.json
// through unexpanded, and an app started from the Dock does not see variables
// exported in ~/.zshrc. Treat an unexpanded value as unset and, on Mac/Linux,
// read the variable from the user's login shell.
function envVar(name) {
  const v = process.env[name];
  if (v && !v.startsWith('${')) return v;
  if (process.platform === 'win32') return undefined;
  try {
    const shell = process.env.SHELL || '/bin/zsh';
    const out = execFileSync(shell, ['-ilc', `printf '%s' "$${name}"`], {
      encoding: 'utf8', timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() || undefined;
  } catch {
    return undefined;
  }
}

const XRAY_BASE = process.env.XRAY_BASE || 'https://xray.cloud.getxray.app/api/v2';
const CLIENT_ID = envVar('XRAY_CLIENT_ID');
const CLIENT_SECRET = envVar('XRAY_CLIENT_SECRET');

let cachedToken = null;
let cachedAt = 0;

async function token() {
  if (cachedToken && Date.now() - cachedAt < 20 * 3600 * 1000) return cachedToken;
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('XRAY_CLIENT_ID / XRAY_CLIENT_SECRET not set');
  const r = await fetch(`${XRAY_BASE}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  });
  if (!r.ok) throw new Error(`authenticate ${r.status}: ${await r.text()}`);
  cachedToken = (await r.text()).replace(/^"|"$/g, '');
  cachedAt = Date.now();
  return cachedToken;
}

function readEvidence(dir, max = 0) {
  if (!dir || !fs.existsSync(dir)) return [];
  let files = fs.readdirSync(dir).filter(f => /\.(png|jpe?g|gif|pdf|txt|log|json)$/i.test(f)).sort();
  if (max > 0) files = files.slice(0, max);
  const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
                 pdf: 'application/pdf', txt: 'text/plain', log: 'text/plain', json: 'application/json' };
  return files.map(f => ({
    filename: f,
    contentType: mime[f.split('.').pop().toLowerCase()] || 'application/octet-stream',
    data: fs.readFileSync(path.join(dir, f)).toString('base64'),
  }));
}


const GRAPHQL = XRAY_BASE.replace(/\/api\/v2$/, '/api/v2') + '/graphql';

async function gql(query, variables = {}) {
  const r = await fetch(GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` },
    body: JSON.stringify({ query, variables }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`graphql ${r.status}: ${JSON.stringify(body).slice(0, 800)}`);
  if (body.errors) throw new Error(`graphql: ${JSON.stringify(body.errors).slice(0, 800)}`);
  return body.data;
}

const jqlKey = k => `key = "${String(k).replace(/"/g, '')}"`;

// ---------------- tools ----------------

const TOOLS = [
  {
    name: 'xray_scan_evidence',
    description: 'Scan an evidence folder whose subfolders are named like "ETM-5994 TC-002 - ...". Returns the TC number -> Jira test key mapping and the file count per test, WITHOUT sending anything. Use this to check the mapping before importing.',
    inputSchema: {
      type: 'object',
      properties: {
        evidenceDir: { type: 'string', description: 'Absolute path to the evidence folder' },
        keyPrefix: { type: 'string', description: 'Jira project prefix, e.g. "ETM-"' },
        keyOffset: { type: 'number', description: 'Number added to the TC number to get the Jira key. TC-002 with offset 6033 -> ETM-6035' },
      },
      required: ['evidenceDir', 'keyPrefix', 'keyOffset'],
    },
  },
  {
    name: 'xray_import_results',
    description: 'Set the status of tests in an Xray Cloud Test Execution and optionally attach evidence files. One call updates many tests at once.',
    inputSchema: {
      type: 'object',
      properties: {
        executionKey: { type: 'string', description: 'Test Execution issue key, e.g. ETM-6081' },
        tests: {
          type: 'array',
          description: 'Tests to update',
          items: {
            type: 'object',
            properties: {
              testKey: { type: 'string', description: 'Test issue key, e.g. ETM-6035' },
              status: { type: 'string', description: 'PASSED | FAILED | TODO | EXECUTING' },
              comment: { type: 'string' },
              evidenceDir: { type: 'string', description: 'Absolute path to a folder of files to attach as evidence' },
              maxEvidence: { type: 'number', description: 'Cap the number of evidence files (0 = all)' },
            },
            required: ['testKey', 'status'],
          },
        },
      },
      required: ['executionKey', 'tests'],
    },
  },
  {
    name: 'xray_get_execution_tests',
    description: 'Read a Test Execution from Xray Cloud: every test in it, with its Jira key, summary and current run status. Use this first to see what needs to be executed.',
    inputSchema: {
      type: 'object',
      properties: { executionKey: { type: 'string', description: 'Test Execution issue key, e.g. ETM-6081' } },
      required: ['executionKey'],
    },
  },
  {
    name: 'xray_get_test_steps',
    description: 'Read the manual test steps (action, data, expected result) of one Xray test. Test steps are stored in Xray, not in Jira fields, so this is the only way to get them.',
    inputSchema: {
      type: 'object',
      properties: { testKey: { type: 'string', description: 'Test issue key, e.g. ETM-6035' } },
      required: ['testKey'],
    },
  },
  {
    name: 'xray_graphql',
    description: 'Escape hatch: run an arbitrary Xray Cloud GraphQL query. Use only when the dedicated tools do not cover what is needed.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        variables: { type: 'object' },
      },
      required: ['query'],
    },
  },
  {
    name: 'xray_auth_check',
    description: 'Verify the Xray Cloud API credentials work. Returns OK or the error.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name, args = {}) {
  if (name === 'xray_auth_check') {
    await token();
    return `OK - authenticated against ${XRAY_BASE}`;
  }

  if (name === 'xray_scan_evidence') {
    const { evidenceDir, keyPrefix, keyOffset } = args;
    const rows = fs.readdirSync(evidenceDir, { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name).sort()
      .map(dir => {
        const m = dir.match(/TC-(\d+)/i);
        if (!m) return { folder: dir, skipped: 'no TC number' };
        const n = parseInt(m[1], 10);
        const full = path.join(evidenceDir, dir);
        const files = fs.readdirSync(full).filter(f => /\.(png|jpe?g|gif|pdf|txt|log|json)$/i.test(f));
        const bytes = files.reduce((s, f) => s + fs.statSync(path.join(full, f)).size, 0);
        return { folder: dir, tc: `TC-${m[1]}`, testKey: `${keyPrefix}${keyOffset + n}`,
                 path: full, files: files.length, sizeMB: +(bytes / 1048576).toFixed(2) };
      });
    return JSON.stringify(rows, null, 2);
  }


  if (name === 'xray_get_execution_tests') {
    const q = `query($jql:String!){ getTestExecutions(jql:$jql, limit:1){ results {
        issueId
        jira(fields:["key","summary"])
        testRuns(limit:100){ total results { id status{name} test { issueId jira(fields:["key","summary"]) } } }
    } } }`;
    const d = await gql(q, { jql: jqlKey(args.executionKey) });
    const exec = d?.getTestExecutions?.results?.[0];
    if (!exec) throw new Error(`test execution ${args.executionKey} not found`);
    const rows = (exec.testRuns?.results || []).map(tr => ({
      testRunId: tr.id,
      testKey: tr.test?.jira?.key,
      summary: tr.test?.jira?.summary,
      status: tr.status?.name,
    }));
    return JSON.stringify({ executionKey: exec.jira?.key, total: exec.testRuns?.total, tests: rows }, null, 2);
  }

  if (name === 'xray_get_test_steps') {
    const q = `query($jql:String!){ getTests(jql:$jql, limit:1){ results {
        issueId
        jira(fields:["key","summary"])
        testType { name }
        steps { id action data result }
    } } }`;
    const d = await gql(q, { jql: jqlKey(args.testKey) });
    const t = d?.getTests?.results?.[0];
    if (!t) throw new Error(`test ${args.testKey} not found`);
    return JSON.stringify({
      testKey: t.jira?.key,
      summary: t.jira?.summary,
      testType: t.testType?.name,
      steps: (t.steps || []).map((s, i) => ({ no: i + 1, action: s.action, data: s.data, expectedResult: s.result })),
    }, null, 2);
  }

  if (name === 'xray_graphql') {
    return JSON.stringify(await gql(args.query, args.variables || {}), null, 2);
  }

  if (name === 'xray_import_results') {
    const { executionKey, tests } = args;
    // AI-miss M-1: never PASSED when the latest run result says otherwise (tools/push-guard.mjs in the QA repo)
    let guardNote = '';
    const guardFile = new URL('../tools/push-guard.mjs', import.meta.url);
    if (fs.existsSync(guardFile)) {
      const { checkPush, blockMessage } = await import(guardFile.href);
      const { blocked, noResult } = checkPush(tests);
      if (blocked.length) throw new Error(blockMessage(blocked));
      if (noResult.length) guardNote = `\nNo run result for ${noResult.join(', ')}: PASSED sent as a manual check, say so to the user.`;
    }
    const payload = {
      testExecutionKey: executionKey,
      tests: tests.map(t => {
        const ev = readEvidence(t.evidenceDir, t.maxEvidence || 0);
        const out = { testKey: t.testKey, status: t.status };
        if (t.comment) out.comment = t.comment;
        if (ev.length) out.evidence = ev;
        return out;
      }),
    };
    const sizeMB = (Buffer.byteLength(JSON.stringify(payload)) / 1048576).toFixed(1);
    const r = await fetch(`${XRAY_BASE}/import/execution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` },
      body: JSON.stringify(payload),
    });
    const body = await r.text();
    if (!r.ok) throw new Error(`import ${r.status} (payload ${sizeMB} MB): ${body}`);
    return `Imported ${payload.tests.length} tests into ${executionKey} (payload ${sizeMB} MB)\n${body}${guardNote}`;
  }

  throw new Error(`unknown tool: ${name}`);
}

// ---------------- MCP stdio plumbing ----------------

function send(msg) { process.stdout.write(JSON.stringify(msg) + '\n'); }
const ok = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, message) => send({ jsonrpc: '2.0', id, error: { code: -32000, message } });

readline.createInterface({ input: process.stdin }).on('line', async (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;

  try {
    switch (method) {
      case 'initialize':
        return ok(id, {
          protocolVersion: params?.protocolVersion || '2025-06-18',
          capabilities: { tools: {} },
          serverInfo: { name: 'xray-mcp', version: '1.0.0' },
        });
      case 'notifications/initialized':
      case 'notifications/cancelled':
        return;
      case 'ping':
        return ok(id, {});
      case 'tools/list':
        return ok(id, { tools: TOOLS });
      case 'resources/list':
        return ok(id, { resources: [] });
      case 'prompts/list':
        return ok(id, { prompts: [] });
      case 'tools/call': {
        const text = await callTool(params?.name, params?.arguments || {});
        return ok(id, { content: [{ type: 'text', text: String(text) }] });
      }
      default:
        if (id !== undefined) fail(id, `unsupported method: ${method}`);
    }
  } catch (e) {
    if (id !== undefined) ok(id, { content: [{ type: 'text', text: `ERROR: ${e.message}` }], isError: true });
  }
});
