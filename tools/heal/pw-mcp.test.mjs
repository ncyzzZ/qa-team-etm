import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mcpCommand } from './pw-mcp.mjs';

test('the MCP server is started with PW_MANUAL_SEED=1 so the manual seed specs are visible to it', () => {
  const c = mcpCommand('/repo/pw', { PATH: '/bin', PW_MANUAL_SEED: undefined });
  assert.equal(c.env.PW_MANUAL_SEED, '1');
  assert.equal(c.env.PATH, '/bin', 'the rest of the environment is kept');
  assert.equal(c.cwd, '/repo/pw');
  assert.deepEqual(c.args.slice(1), ['run-test-mcp-server', '--headless', '--config', path.join('/repo/pw', 'playwright.config.ts')]);
  assert.equal(c.args[0], path.join('/repo/pw', 'node_modules', '@playwright', 'test', 'cli.js'));
});
