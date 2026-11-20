#!/usr/bin/env node
// pw-mcp.mjs - start Playwright's test MCP server (used by the playwright-healer and manual-runner agents) inside the Playwright repo,
// so this repo's .mcp.json can use it without knowing where PW_REPO is. Headless, stdio transport.
// Sets PW_MANUAL_SEED=1: the manual runner's seed specs (tests/fe/manual/seed.*.spec.ts) are ignored by playwright.config.ts
// in normal runs and only visible with that variable.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolveRepos } from './config.mjs';

/** @returns {{ args: string[], cwd: string, env: Record<string, string|undefined> }} what to run, for node */
export function mcpCommand(pwRepo, env = process.env) {
  const cli = path.join(pwRepo, 'node_modules', '@playwright', 'test', 'cli.js');
  return { args: [cli, 'run-test-mcp-server', '--headless', '--config', path.join(pwRepo, 'playwright.config.ts')], cwd: pwRepo, env: { ...env, PW_MANUAL_SEED: '1' } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { pwRepo } = resolveRepos();
  const c = mcpCommand(pwRepo);
  if (!fs.existsSync(c.args[0])) {
    console.error(`[pw-mcp] Playwright not found at ${c.args[0]}. Set PW_REPO (node tools/setup.mjs <folder>) and run npm install there.`);
    process.exit(1);
  }
  const child = spawn(process.execPath, c.args, { cwd: c.cwd, env: c.env, stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code ?? 0));
  for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => child.kill(s));
}
