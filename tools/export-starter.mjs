// export-starter.mjs - a clean copy of this repo for another team: the tools, agents, skills
// and board, without any project's cards, pictures, names or rules.
// Usage: node tools/export-starter.mjs <outDir> [--people <people.local.md>]
//   <outDir> must be outside the repo and missing or empty. Copies the git-tracked files that
//   planExport keeps, writes profiles/example/, .env.example and README.md, then scans the
//   result (contents and file names) with leakPatterns. Any hit: prints "file:line match",
//   exits 1 and leaves the folder for inspection.
// Leak patterns come from every project profile (key, site, project id, repo folders), from
// profiles/<name>/export-leaks.json (extra terms of that project) and from the names in
// .claude/team/people.local.md (printed as name#<n>, never written out).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT, escapeKey } from './profile.mjs';

const SKIP_PREFIX = [
  ['work/', 'card work data'],
  ['evals/exams/', 'exam data from real cards'],
  ['docs/modules/', 'project module notes'],
  ['docs/superpowers/', 'design notes of this repo'],
  ['dist/', 'built skill zips'],
  ['.superpowers/', 'working notes of this repo'],
];
const SKIP_EXACT = new Map([
  ['.claude/team/knowledge/ai-misses.jsonl', 'project log'],
  ['.claude/team/people.local.md', 'real names'],
  ['.claude/settings.local.json', 'personal settings'],
  ['.claude/active-profile.md', 'generated from the active profile'],
  ['README.md', 'replaced by a generic README'],
  ['ONBOARDING.md', 'project onboarding'],
]);
const BINARY = /\.(png|jpe?g|gif|zip|pdf|xlsx|docx|webm)$/i;

function skipReason(f, ignored, extraSkip) {
  if (ignored.has(f)) return 'git-ignored';
  for (const p of extraSkip) if (f === p || f.startsWith(p.endsWith('/') ? p : p + '/') || (p.endsWith('-') && f.startsWith(p))) return 'project-only (profile)';
  for (const [p, why] of SKIP_PREFIX) if (f.startsWith(p)) return why;
  if (SKIP_EXACT.has(f)) return SKIP_EXACT.get(f);
  if (f.startsWith('profiles/') && !f.startsWith('profiles/_template/')) return 'project profile';
  if (/^\.claude\/team\/[^/]+\.jsonl$/.test(f)) return 'board log';
  if (/^(evals\/evidence-check|evals\/agents)\//.test(f) && !f.endsWith('.mjs')) return 'eval data from real cards';
  if (/(^|\/)\.env($|\.)/.test(f)) return 'environment file';
  if (BINARY.test(f) && !f.startsWith('.claude/team/assets/')) return 'binary (pictures, documents)';
  return '';
}

/**
 * Which tracked files go to the starter. Deterministic: copy is sorted.
 * extraSkip: project-only paths from the profiles (projectSkips): a file, a folder, or a prefix ending in "-".
 */
export function planExport(trackedFiles, { ignored = new Set(), extraSkip = [] } = {}) {
  const copy = [], skip = [];
  for (const f of [...trackedFiles].sort()) {
    const why = skipReason(f, ignored, extraSkip);
    if (why) skip.push({ file: f, why }); else copy.push(f);
  }
  return { copy, skip };
}

/** Name patterns from people.local.md ("nick = First Last"); label name#<n>, the name is never returned. */
export function namePatterns(text) {
  const out = [];
  let n = 0;
  for (const raw of String(text).split(/\r?\n/)) {
    const m = raw.match(/^\s*([^#`=\s][^=`]*?)\s*=\s*([^=`]+?)\s*$/);
    if (!m) continue;
    const [, nick, name] = m;
    if (/^nick(name)?$/i.test(nick) || /^firstname lastname$/i.test(name)) continue;
    n++;
    const terms = new Set([name, ...name.split(/\s+/), nick].filter((t) => t.length >= 3));
    for (const t of terms) out.push({ re: new RegExp(`(?<![\\p{L}\\p{N}])${escapeKey(t)}(?![\\p{L}\\p{N}])`, 'iu'), label: `name#${n}` });
  }
  return out;
}

function readJson(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } }

const projectProfiles = (root) => {
  const pdir = path.join(root, 'profiles');
  return fs.existsSync(pdir) ? fs.readdirSync(pdir).filter((n) => !['_template', 'example'].includes(n)).sort() : [];
};

/** Project-only paths of every project profile: its docs.uiMap, docs.templates and export.skip. */
export function projectSkips({ root = ROOT } = {}) {
  const out = [];
  for (const n of projectProfiles(root)) {
    const p = readJson(path.join(root, 'profiles', n, 'profile.json')) || {};
    for (const d of [p.docs?.uiMap, p.docs?.templates, ...(p.export?.skip || [])]) if (d) out.push(String(d).replace(/^\.\//, ''));
  }
  return out;
}

/** Leak patterns of every project profile under <root>/profiles (not _template/example) plus people names. */
export function leakPatterns({ root = ROOT, people } = {}) {
  const out = [];
  const pdir = path.join(root, 'profiles');
  for (const n of projectProfiles(root)) {
    const p = readJson(path.join(pdir, n, 'profile.json'));
    if (p?.jira?.projectKey) out.push(new RegExp(`(?<![A-Za-z0-9])${escapeKey(p.jira.projectKey)}-\\d`));
    if (p?.jira?.site) {
      out.push(new RegExp(escapeKey(p.jira.site), 'i'));
      const label = p.jira.site.split('.')[0];
      if (label.length >= 4) out.push(new RegExp(`\\b${escapeKey(label)}\\b`, 'i'));
    }
    if (p?.jira?.projectId) out.push(new RegExp(`(?<![0-9])${escapeKey(String(p.jira.projectId))}(?![0-9])`));
    for (const d of [p?.repos?.pwRepoDir, p?.repos?.feRepoDir]) if (d) out.push(new RegExp(escapeKey(d), 'i'));
    const extra = readJson(path.join(pdir, n, 'export-leaks.json')) || [];
    for (const e of extra) out.push(typeof e === 'string' ? new RegExp(escapeKey(e), 'i') : new RegExp(e.source, e.flags || ''));
  }
  const pf = people ?? path.join(root, '.claude/team/people.local.md');
  if (fs.existsSync(pf)) out.push(...namePatterns(fs.readFileSync(pf, 'utf8')));
  return out;
}

function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, base, out); else if (e.isFile()) out.push(path.relative(base, f).split(path.sep).join('/'));
  }
  return out;
}

function matcher(patterns) {
  const pats = patterns.map((p) => (p instanceof RegExp ? { re: p } : p));
  return (s) => {
    for (const { re, label } of pats) { const m = s.match(re); if (m) return label || m[0]; }
    return null;
  };
}

/** Hits of patterns (RegExp or {re, label}) in one file's name (line 0) and text (binary: name only). */
function scanFile(base, file, first) {
  const hits = [];
  const pm = first(file);
  if (pm) hits.push({ file, line: 0, match: pm });
  const buf = fs.readFileSync(path.join(base, file));
  if (buf.includes(0)) return hits;
  buf.toString('utf8').split('\n').forEach((text, i) => {
    const m = first(text);
    if (m) hits.push({ file, line: i + 1, match: m });
  });
  return hits;
}

/** Hits of patterns (RegExp or {re, label}) in file names (line 0) and text contents; one hit per line. */
export function leakScan(dir, patterns) {
  const first = matcher(patterns);
  return walk(dir).flatMap((file) => scanFile(dir, file, first));
}

/** Tests and eval fixtures are examples, not tools: one that names the project is left out, not reworded. */
export const isFixture = (f) => /\.test\.mjs$/.test(f) || f.startsWith('evals/');

const README = `# QA team starter

A Claude Code QA team: agents (\`.claude/agents/\`), project skills (\`.claude/skills/\`), the status board
(\`.claude/team/\`, http://localhost:4777), quality gates and tools (\`tools/\`), and the Xray MCP server
(\`xray-toolkit/\`). Everything project-specific lives in \`profiles/<name>/\`.

Start with **[docs/new-team-setup.md](docs/new-team-setup.md)**.

Quick start:

\`\`\`sh
git init && git add -A && git commit -m "starter"
node tools/setup.mjs --new-profile <name> --key <KEY> --site <you>.atlassian.net --project-id <id> --board <id> --pw-repo-dir <pw-repo> --fe-repo-dir <fe-repo>
node tools/setup.mjs            # checks the whole setup
\`\`\`

The process is in \`CLAUDE.md\` and \`TEAM.md\`; your project's own rules go in \`profiles/<name>/rules.md\`.
`;

const ENV_EXAMPLE = `# Copy to .env (git-ignored) and fill in. Never commit .env.
QA_PROFILE=example
PW_REPO=
FE_REPO=
XRAY_CLIENT_ID=
XRAY_CLIENT_SECRET=
FIGMA_TOKEN=
`;

function exampleProfile(root) {
  const t = JSON.parse(fs.readFileSync(path.join(root, 'profiles/_template/profile.json'), 'utf8'));
  t.title = 'Example project';
  t.jira = { ...t.jira, site: 'example.atlassian.net', projectKey: 'EXAMPLE' };
  t.repos = { ...t.repos, pwRepoDir: 'example-fe-qa', feRepoDir: 'example-fe' };
  return JSON.stringify(t, null, 2) + '\n';
}

function git(args, cwd) { return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 << 20 }); }

/** Copies and writes the starter into outDir (checked by the caller). Returns { copied, skipped }. */
export function exportStarter(outDir, { root = ROOT, patterns = [] } = {}) {
  const tracked = git(['ls-files', '-z'], root).split('\0').filter(Boolean);
  const ignored = new Set(git(['ls-files', '-z', '-ci', '--exclude-standard'], root).split('\0').filter(Boolean));
  const plan = planExport(tracked, { ignored, extraSkip: projectSkips({ root }) });
  const target = (rel) => {
    const f = path.resolve(outDir, rel);
    if (path.relative(outDir, f).startsWith('..') || path.isAbsolute(path.relative(outDir, f))) throw new Error(`refusing to write outside ${outDir}: ${rel}`);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    return f;
  };
  const first = matcher(patterns);
  let copied = 0;
  for (const rel of plan.copy) {
    const src = path.join(root, rel);
    if (!fs.existsSync(src) || !fs.statSync(src).isFile()) continue; // deleted in the work tree
    if (isFixture(rel) && scanFile(root, rel, first).length) { plan.skip.push({ file: rel, why: 'test or eval data that names the project' }); continue; }
    fs.copyFileSync(src, target(rel));
    copied++;
  }
  fs.writeFileSync(target('profiles/example/profile.json'), exampleProfile(root));
  fs.copyFileSync(path.join(root, 'profiles/_template/rules.md'), target('profiles/example/rules.md'));
  fs.writeFileSync(target('.env.example'), ENV_EXAMPLE);
  fs.writeFileSync(target('README.md'), README);
  return { copied, skipped: plan.skip };
}

function main(argv) {
  const args = argv.slice(2);
  const pi = args.indexOf('--people');
  const people = pi >= 0 ? path.resolve(args.splice(pi, 2)[1] || '') : undefined;
  if (args.length !== 1) { console.error('usage: node tools/export-starter.mjs <outDir> [--people <people.local.md>]'); return 2; }
  const outDir = path.resolve(args[0]);
  const rel = path.relative(ROOT, outDir);
  if (!rel.startsWith('..') && !path.isAbsolute(rel)) { console.error(`refusing: ${outDir} is inside the repo`); return 2; }
  if (fs.existsSync(outDir) && (!fs.statSync(outDir).isDirectory() || fs.readdirSync(outDir).length)) { console.error(`refusing: ${outDir} is not empty`); return 2; }
  const patterns = leakPatterns({ people });
  fs.mkdirSync(outDir, { recursive: true });
  const { copied, skipped } = exportStarter(outDir, { patterns });
  const hits = leakScan(outDir, patterns);
  console.log(`starter: ${copied} files copied, ${skipped.length} skipped, 4 written -> ${outDir}`);
  if (hits.length) {
    for (const h of hits) console.log(`${h.file}:${h.line} ${h.match}`);
    console.error(`LEAK: ${hits.length} hit(s); the folder is left for inspection. Reword or move them, then export again into an empty folder.`);
    return 1;
  }
  console.log('leak scan: no hits');
  console.log(`next steps:\n  cd ${outDir}\n  git init && git add -A && git commit -m "starter"\n  node tools/setup.mjs --new-profile <name> --key <KEY> --site <you>.atlassian.net --project-id <id> --board <id> --pw-repo-dir <dir> --fe-repo-dir <dir>\n  read docs/new-team-setup.md`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv);
