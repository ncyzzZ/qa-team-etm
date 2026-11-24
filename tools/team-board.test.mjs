// Board answers must reach the chat: `team.mjs wait` waits until the board answers (no 9-minute give-up), and
// `team.mjs answers` lists board answers nobody has read yet (used by the UserPromptSubmit hook).
// A fake board server on a free port stands in for .claude/team/serve.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const TEAM = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.claude', 'team', 'team.mjs');

function fakeBoard(byJob) {
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    if (u.pathname !== '/state') { res.writeHead(404); return res.end(); }
    const job = u.searchParams.get('job');
    const body = job ? { job, ...(byJob[job] || { ask: null, answer: null }) }
      : { jobs: Object.entries(byJob).map(([key, v]) => ({ key, ticket: key, ask: v.ask ? { text: v.ask.text } : null })) };
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r(srv)));
}

function run(args, port) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [TEAM, ...args], { env: { ...process.env, TEAM_PORT: String(port), TEAM_JOB: '' } });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('exit', (code) => resolve({ code, out }));
  });
}

test('wait: with no --timeout it keeps waiting past the old 9-minute limit and prints the board answer', async () => {
  const state = { 'ETM-1': { ask: { text: 'push?' }, answer: null } };
  const srv = await fakeBoard(state);
  const port = srv.address().port;
  const p = run(['wait', '--job', 'ETM-1', '--poll', '0.05'], port);
  await new Promise((r) => setTimeout(r, 400));
  state['ETM-1'].answer = { text: 'ใช่ push', at: Date.now(), question: 'push?' };
  const { code, out } = await p;
  srv.close();
  assert.equal(code, 0);
  assert.match(out, /ANSWER: ใช่ push/);
  assert.match(out, /WAITING: no time limit/); // default is no limit (was 540 s, after which board answers were lost)
});

test('wait: an explicit --timeout still ends with exit 3', async () => {
  const srv = await fakeBoard({ 'ETM-1': { ask: { text: 'q' }, answer: null } });
  const { code, out } = await run(['wait', '--job', 'ETM-1', '--timeout', '0.2', '--poll', '0.05'], srv.address().port);
  srv.close();
  assert.equal(code, 3);
  assert.match(out, /TIMEOUT/);
});

test('wait: the board being down for a while does not end the wait', async () => {
  const srv0 = await fakeBoard({});
  const port = srv0.address().port;
  srv0.close();
  const p = run(['wait', '--job', 'ETM-1', '--poll', '0.05'], port);
  await new Promise((r) => setTimeout(r, 300));
  const state = { 'ETM-1': { ask: { text: 'q' }, answer: { text: 'yes', at: Date.now(), question: 'q' } } };
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ job: 'ETM-1', ...state['ETM-1'] })); });
  await new Promise((r) => srv.listen(port, '127.0.0.1', r));
  const { code, out } = await p;
  srv.close();
  assert.equal(code, 0);
  assert.match(out, /ANSWER: yes/);
});

test('answers: lists every job whose board question was answered, and says how to read it', async () => {
  const srv = await fakeBoard({
    'ETM-1': { ask: { text: 'push?' }, answer: { text: 'ใช่ push', at: Date.now(), question: 'push?' } },
    'ETM-2': { ask: { text: 'run?' }, answer: null },
  });
  const { code, out } = await run(['answers'], srv.address().port);
  srv.close();
  assert.equal(code, 0);
  assert.match(out, /ETM-1/);
  assert.match(out, /ใช่ push/);
  assert.match(out, /team\.mjs wait --job ETM-1/);
  assert.doesNotMatch(out, /ETM-2: .*ANSWER/);
});

test('answers: prints nothing when there is no answer or the board is down', async () => {
  const srv = await fakeBoard({ 'ETM-2': { ask: { text: 'run?' }, answer: null } });
  const a = await run(['answers'], srv.address().port);
  const port = srv.address().port;
  srv.close();
  const b = await run(['answers'], port);
  assert.equal(a.code, 0); assert.equal(a.out.trim(), '');
  assert.equal(b.code, 0); assert.equal(b.out.trim(), '');
});
