// profile-lint.mjs - fails when project values (key, site, repo folders, project id,
// FE branch) are hard-coded in executable code instead of read from the profile.
// Usage: node tools/profile-lint.mjs   (exit 1 + "file:line text" per hit)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, profile, escapeKey } from './profile.mjs';

function patterns(p) {
  const k = escapeKey(p.jira.projectKey);
  const list = [
    new RegExp(`(?<![A-Za-z0-9])${k}-(?:\\d|\\\\d|\\(|\\$\\{|['\"\x60])`),
    new RegExp(`'${k}'`),
    new RegExp(`"${k}"`),
    new RegExp(escapeKey(p.jira.site)),
    new RegExp(escapeKey(p.repos.pwRepoDir)),
    new RegExp(escapeKey(p.repos.feRepoDir)),
    new RegExp(`origin/${escapeKey(p.repos.feBranch || 'develop')}(?![A-Za-z0-9_-])`),
  ];
  if (p.jira.projectId !== undefined && p.jira.projectId !== '') list.push(new RegExp(`(?<![0-9])${escapeKey(String(p.jira.projectId))}(?![0-9])`));
  return list;
}

export function findHardcoded(files, p) {
  const res = patterns(p);
  const hits = [];
  for (const file of files) {
    let lines;
    try { lines = fs.readFileSync(file, 'utf8').split('\n'); } catch { continue; }
    lines.forEach((text, i) => {
      const t = text.trim();
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
      const code = text.replace(/\s\/\/\s.*$/, "");
      if (res.some((re) => re.test(code))) hits.push({ file, line: i + 1, text: t });
    });
  }
  return hits;
}

function walk(dir, out) {
  let ents;
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    if (e.name === 'node_modules') continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (e.name.endsWith('.mjs') && !e.name.endsWith('.test.mjs')) out.push(f);
  }
  return out;
}

export function repoFiles(root = ROOT) {
  const out = [];
  walk(path.join(root, 'tools'), out);
  for (const d of ['.claude/team', 'xray-toolkit']) {
    for (const e of (fs.existsSync(path.join(root, d)) ? fs.readdirSync(path.join(root, d), { withFileTypes: true }) : [])) {
      if (e.isFile() && e.name.endsWith('.mjs') && !e.name.endsWith('.test.mjs')) out.push(path.join(root, d, e.name));
    }
  }
  return out.sort();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const hits = findHardcoded(repoFiles(), profile());
  for (const h of hits) console.log(`${path.relative(ROOT, h.file)}:${h.line} ${h.text}`);
  if (hits.length) { console.error(`${hits.length} hard-coded project value(s); read them from tools/profile.mjs`); process.exit(1); }
  console.log('profile-lint: ok');
}
