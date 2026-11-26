import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { planExport, leakScan, namePatterns, leakPatterns, projectSkips, projectRenames, renamePath, renameText, exportStarter } from './export-starter.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'starter-'));
const write = (dir, rel, text) => { const f = path.join(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const K = (n) => ['E', 'TM-', n].join(''); // keeps this file free of a literal card key

test('planExport: brief example', () => {
  const r = planExport([`work/${K(1)}/a.md`, 'tools/x.mjs', 'docs/modules/m.md', '.claude/team/assets/logo.png', 'evals/exams/q.png']);
  assert.deepEqual(r.copy, ['.claude/team/assets/logo.png', 'tools/x.mjs']);
  assert.equal(r.skip.length, 3);
  assert.ok(r.skip.every((s) => s.file && s.why));
});

test('planExport: project data, secrets, profiles and binaries are skipped', () => {
  const files = [
    'profiles/_template/profile.json', 'profiles/proj/rules.md', 'profiles/other/profile.json',
    '.env', '.env.local', 'tools/.env', '.claude/settings.local.json', '.claude/active-profile.md',
    '.claude/team/events.jsonl', '.claude/team/knowledge/ai-misses.jsonl', '.claude/team/knowledge/lessons.md',
    '.claude/team/people.local.md', '.claude/team/people.example.md',
    'evals/evidence-check/score.mjs', 'evals/evidence-check/truth.json', 'evals/agents/selftest.key.json', 'evals/agents/run.mjs',
    'docs/superpowers/p.md', 'docs/new-team-setup.md',
    '.claude/skills/proj-only/SKILL.md', '.claude/skills/other/SKILL.md', 'docs/proj-notes.md', 'docs/proj-map.md', 'dist/account-skills/a.zip', '.superpowers/x.md',
    'README.md', 'ONBOARDING.md', 'tools/pic.png', 'tools/doc.PDF',
  ];
  const r = planExport(files, { ignored: new Set(['tools/.env']), extraSkip: ['.claude/skills/proj-only/', 'docs/proj-', 'docs/proj-map.md'] });
  assert.deepEqual(r.copy, [
    '.claude/skills/other/SKILL.md', '.claude/team/knowledge/lessons.md', '.claude/team/people.example.md',
    'docs/new-team-setup.md', 'evals/agents/run.mjs', 'evals/evidence-check/score.mjs', 'profiles/_template/profile.json',
  ]);
  assert.equal(r.copy.length + r.skip.length, files.length);
});

test('planExport: a git-ignored file is never copied', () => {
  const r = planExport(['tools/a.mjs', 'tools/b.mjs'], { ignored: new Set(['tools/b.mjs']) });
  assert.deepEqual(r.copy, ['tools/a.mjs']);
  assert.match(r.skip[0].why, /ignored/);
});

test('projectSkips: uiMap, templates and export.skip of each project profile', () => {
  const r = tmpDir();
  write(r, 'profiles/zed/profile.json', JSON.stringify({ docs: { uiMap: 'docs/Map_Z.md', templates: 'docs/Z_Templates' }, export: { skip: ['.claude/skills/z-only/', 'docs/z-'] } }));
  write(r, 'profiles/_template/profile.json', JSON.stringify({ docs: { uiMap: 'docs/tpl.md' } }));
  assert.deepEqual(projectSkips({ root: r }), ['docs/Map_Z.md', 'docs/Z_Templates', '.claude/skills/z-only/', 'docs/z-']);
  const p = planExport(['docs/Map_Z.md', 'docs/Z_Templates/a.md', 'docs/z-flow.md', '.claude/skills/z-only/SKILL.md', 'docs/zebra.md'], { extraSkip: projectSkips({ root: r }) });
  assert.deepEqual(p.copy, ['docs/zebra.md']);
});

test('leakScan: a card key in a file is one hit with its line', () => {
  const d = tmpDir();
  write(d, 'a.md', `first\nsee ${K(12)}\n`);
  write(d, 'b.md', 'clean\n');
  const hits = leakScan(d, [new RegExp(K('\\d+'))]);
  assert.equal(hits.length, 1);
  assert.deepEqual(hits[0], { file: 'a.md', line: 2, match: K(12) });
});

test('leakScan: file names are scanned too', () => {
  const d = tmpDir();
  write(d, `notes/${K(7)}/x.md`, 'clean\n');
  const hits = leakScan(d, [new RegExp(K('\\d'))]);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].line, 0);
});

test('leakScan: a name from people.local.md is one hit, reported by label only', () => {
  const people = '# Team nicknames\n\nExample (not real people):\n\nnick = Firstname Lastname\n\nzork = Quentin Vandermolen\n';
  const pats = namePatterns(people);
  const d = tmpDir();
  write(d, 'a.md', 'assigned to quentin vandermolen today\n');
  const hits = leakScan(d, pats);
  assert.equal(hits.length, 1);
  assert.match(hits[0].match, /^name#\d+$/);
  assert.ok(!JSON.stringify(hits).toLowerCase().includes('vandermolen'));
});

test('leakPatterns: from each project profile (key, site, id, repos) plus its export-leaks.json', () => {
  const r = tmpDir();
  write(r, 'profiles/zed/profile.json', JSON.stringify({ jira: { site: 'zedcorp.atlassian.net', projectKey: 'ZED', projectId: 98765 }, repos: { pwRepoDir: 'zed-qa', feRepoDir: 'zed-web' } }));
  write(r, 'profiles/zed/export-leaks.json', JSON.stringify(['Moon Base', { source: 'secret\\s+thing', flags: 'i' }]));
  write(r, 'profiles/_template/profile.json', JSON.stringify({ jira: { site: 'acme.atlassian.net', projectKey: 'ACME' }, repos: { pwRepoDir: 'acme-fe-qa', feRepoDir: 'acme-fe' } }));
  const pats = leakPatterns({ root: r });
  const d = tmpDir();
  write(d, 'a.md', ['ZED-1 x', 'see zedcorp.atlassian.net', 'id 98765', 'repo zed-qa', 'zed-web', 'Moon Base', 'SECRET  thing', 'ACME-1 acme-fe', 'ZEDX-1 198765 clean'].join('\n'));
  assert.deepEqual(leakScan(d, pats).map((h) => h.line), [1, 2, 3, 4, 5, 6, 7]);
});

test('namePatterns: the template example line is not a name', () => {
  assert.equal(namePatterns('nick = Firstname Lastname\n`nickname = name as it is in Jira (English)`\n').length, 0);
});

test('CLI: refuses an out folder inside the repo and a non-empty one', () => {
  const inside = spawnSync(process.execPath, ['tools/export-starter.mjs', path.join(ROOT, 'tmp-starter-x'), '--no-people'], { cwd: ROOT, encoding: 'utf8' });
  assert.notEqual(inside.status, 0);
  assert.match(inside.stderr, /inside the repo/);
  assert.ok(!fs.existsSync(path.join(ROOT, 'tmp-starter-x')));
  const d = tmpDir(); write(d, 'keep.txt', 'x');
  const full = spawnSync(process.execPath, ['tools/export-starter.mjs', d, '--no-people'], { cwd: ROOT, encoding: 'utf8' });
  assert.notEqual(full.status, 0);
  assert.match(full.stderr, /not empty/);
  assert.deepEqual(fs.readdirSync(d), ['keep.txt']);
});

test('renames: whole tokens in paths and text, from each project export-renames.json', () => {
  const r = tmpDir();
  write(r, 'profiles/zed/profile.json', JSON.stringify({ jira: { site: 'z.atlassian.net', projectKey: 'ZED' }, repos: { pwRepoDir: 'a', feRepoDir: 'b' } }));
  write(r, 'profiles/zed/export-renames.json', JSON.stringify({ 'zed-fullqa': 'qa-fullqa', 'zed_del.py': 'del.py' }));
  const ren = projectRenames({ root: r });
  assert.equal(renamePath('.claude/skills/zed-fullqa/zed_del.py', ren), '.claude/skills/qa-fullqa/del.py');
  assert.equal(renamePath('.claude/skills/zed-fullqa-old/x.md', ren), '.claude/skills/zed-fullqa-old/x.md');
  assert.equal(renameText('use `zed-fullqa` and anthropic-skills:zed-fullqa, not zed-fullqa2 or my-zed-fullqa; run zed_del.py', ren),
    'use `qa-fullqa` and anthropic-skills:qa-fullqa, not zed-fullqa2 or my-zed-fullqa; run del.py');
});

test('CLI: no people file and no --people / --no-people is refused', () => {
  const fakeRoot = tmpDir();
  const d = path.join(tmpDir(), 'out');
  const res = spawnSync(process.execPath, ['tools/export-starter.mjs', d], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, QA_EXPORT_PEOPLE_ROOT: fakeRoot } });
  assert.equal(res.status, 2);
  assert.match(res.stderr, /people/);
  assert.ok(!fs.existsSync(d));
});

test('CLI: an out folder reached through a symlink into the repo is refused', () => {
  const link = path.join(tmpDir(), 'repo-link');
  fs.symlinkSync(ROOT, link);
  const res = spawnSync(process.execPath, ['tools/export-starter.mjs', path.join(link, 'tmp-starter-y'), '--no-people'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(res.status, 2);
  assert.match(res.stderr, /inside the repo/);
  assert.ok(!fs.existsSync(path.join(ROOT, 'tmp-starter-y')));
});

test('exportStarter: a file with a NUL byte is skipped whatever its extension, except under .claude/team/assets/', () => {
  const r = tmpDir();
  write(r, 'profiles/_template/profile.json', JSON.stringify({ jira: { site: 'acme.atlassian.net', projectKey: 'ACME' }, repos: { pwRepoDir: 'a', feRepoDir: 'b' } }));
  write(r, 'profiles/_template/rules.md', '# rules\n');
  write(r, 'tools/a.mjs', 'export const a = 1;\n');
  fs.writeFileSync(path.join(r, 'tools/blob.mjs'), Buffer.from([0x61, 0x00, 0x62]));
  fs.writeFileSync(path.join(r, 'tools/odd.txt'), Buffer.from([0x00, 0x01]));
  fs.mkdirSync(path.join(r, '.claude/team/assets'), { recursive: true });
  fs.writeFileSync(path.join(r, '.claude/team/assets/font.woff2'), Buffer.from([0x77, 0x00, 0x46]));
  const g = (...a) => spawnSync('git', a, { cwd: r, encoding: 'utf8' });
  g('init', '-q'); g('add', '-A');
  const out = path.join(tmpDir(), 'out');
  fs.mkdirSync(out);
  const { skipped } = exportStarter(out, { root: r, patterns: [] });
  assert.ok(fs.existsSync(path.join(out, 'tools/a.mjs')));
  assert.ok(!fs.existsSync(path.join(out, 'tools/blob.mjs')));
  assert.ok(!fs.existsSync(path.join(out, 'tools/odd.txt')));
  assert.ok(fs.existsSync(path.join(out, '.claude/team/assets/font.woff2')));
  assert.deepEqual(skipped.filter((s) => s.why === 'binary (NUL byte)').map((s) => s.file).sort(), ['tools/blob.mjs', 'tools/odd.txt']);
});

test('leakPatterns: the git-ignored export-leaks.local.json of a profile is merged in', () => {
  const r = tmpDir();
  write(r, 'profiles/zed/profile.json', JSON.stringify({ jira: { site: 'zedcorp.atlassian.net', projectKey: 'ZED' }, repos: { pwRepoDir: 'zed-qa', feRepoDir: 'zed-web' } }));
  write(r, 'profiles/zed/export-leaks.json', JSON.stringify(['Moon Base']));
  write(r, 'profiles/zed/export-leaks.local.json', JSON.stringify([{ source: 'jane\\s+roe|bigco', flags: 'i' }]));
  const d = tmpDir();
  write(d, 'a.md', ['Moon Base', 'by Jane  Roe', 'BigCo ltd', 'clean'].join('\n'));
  assert.deepEqual(leakScan(d, leakPatterns({ root: r })).map((h) => h.line), [1, 2, 3]);
  const g = tmpDir();
  fs.copyFileSync(path.join(ROOT, '.gitignore'), path.join(g, '.gitignore'));
  spawnSync('git', ['init', '-q'], { cwd: g });
  const ign = spawnSync('git', ['check-ignore', '-q', 'profiles/some-team/export-leaks.local.json'], { cwd: g });
  assert.equal(ign.status, 0, 'profiles/*/export-leaks.local.json is git-ignored');
});
