#!/usr/bin/env node
// pw-mcp.mjs - start Playwright's test MCP server (used by the playwright-healer agent) inside the Playwright repo,
// so this repo's .mcp.json can use it without knowing where PW_REPO is. Headless, stdio transport.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { resolveRepos } from './config.mjs';

const { pwRepo } = resolveRepos();
const cli = path.join(pwRepo, 'node_modules', '@playwright', 'test', 'cli.js');
if (!fs.existsSync(cli)) {
  console.error(`[pw-mcp] Playwright not found at ${cli}. Set PW_REPO (node tools/setup.mjs <folder>) and run npm install there.`);
  process.exit(1);
}
const child = spawn(process.execPath, [cli, 'run-test-mcp-server', '--headless', '--config', path.join(pwRepo, 'playwright.config.ts')], { cwd: pwRepo, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => child.kill(s));
