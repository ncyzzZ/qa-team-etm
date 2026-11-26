// profile.mjs - the active project profile (profiles/<name>/profile.json).
// Name order: name argument, env QA_PROFILE, QA_PROFILE= in .env, else 'etm'.
// Root (folder that contains profiles/): env QA_PROFILE_ROOT, else the repo root.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function envFileValue(envFile, name) {
  try {
    const m = fs.readFileSync(envFile, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}

export function escapeKey(key) {
  return String(key).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function loadProfile({ root = process.env.QA_PROFILE_ROOT || ROOT, envFile, name } = {}) {
  envFile = envFile ?? path.join(ROOT, '.env');
  const pname = name || process.env.QA_PROFILE || envFileValue(envFile, 'QA_PROFILE') || 'etm';
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(pname)) throw new Error('profile name "' + pname + '" is not allowed');
  const dir = path.join(root, 'profiles', pname);
  const file = path.join(dir, 'profile.json');
  if (!fs.existsSync(file)) throw new Error(`profile "${pname}" not found (profiles/${pname}/profile.json)`);
  let raw;
  try { raw = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { throw new Error(`profile "${pname}": profile.json is not valid JSON (${e.message})`); }
  const need = (p, v) => { if (v === undefined || v === null || v === '') throw new Error(`profile "${pname}": ${p} missing`); };
  need('jira.site', raw.jira?.site);
  need('jira.projectKey', raw.jira?.projectKey);
  if (!/^[A-Z][A-Z0-9_]{1,9}$/.test(raw.jira.projectKey)) throw new Error(`profile "${pname}": jira.projectKey must match ^[A-Z][A-Z0-9_]{1,9}$`);
  need('repos.pwRepoDir', raw.repos?.pwRepoDir);
  need('repos.feRepoDir', raw.repos?.feRepoDir);
  return { ...raw, repos: { ...raw.repos, feBranch: raw.repos.feBranch || 'develop' }, name: pname, dir };
}

let cached;
export function profile() { return (cached ??= loadProfile()); }
export function _resetProfileCache() { cached = undefined; }

export function keyRe(p, { anchored = false, global = false } = {}) {
  const k = escapeKey(p.jira.projectKey);
  return new RegExp(anchored ? `^${k}-\\d+$` : `(?<![A-Za-z0-9])${k}-\\d+(?!\\d)`, global ? 'g' : '');
}
export function isKey(s, p = profile()) { return keyRe(p, { anchored: true }).test(String(s)); }
export function keysIn(text, p = profile()) { return [...new Set(String(text).match(keyRe(p, { global: true })) || [])]; }
export function firstKey(text, p = profile()) { return keysIn(text, p)[0] || ''; }
export function browseUrl(key, p = profile()) { return `https://${p.jira.site}/browse/${key}`; }

/** "- Jira fields: ..." lines for jira.fields ({name: {id, options?}}); empty when the profile has none. */
export function fieldLines(fields) {
  const list = Object.entries(fields || {}).filter(([, f]) => f && f.id);
  if (!list.length) return [];
  return ['- Jira fields (`jira.fields.<name>`):', ...list.map(([n, f]) => {
    const opts = Object.entries(f.options || {}).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(', ');
    return `  - \`${n}\`: \`${f.id}\`${opts ? ` (options ${opts})` : ''}`;
  })];
}

/** Text of .claude/active-profile.md: header, settings from profile.json, then the profile's rules.md as is. */
export function renderActiveProfile(p) {
  const rulesName = p.docs?.rules || 'rules.md';
  const rel = `profiles/${p.name}/${rulesName}`;
  let rules;
  try { rules = fs.readFileSync(path.join(p.dir, rulesName), 'utf8').replace(/\r\n/g, '\n'); }
  catch { rules = `(no ${rel} yet: write the project's rules there)\n`; }
  const j = p.jira, r = p.repos, d = p.docs || {};
  const settings = [
    `## Settings (from profiles/${p.name}/profile.json)`,
    '',
    `- Jira site: ${j.site}. Project key: ${j.projectKey}${j.projectId !== undefined ? ` (project id ${j.projectId})` : ''}.${j.boardId !== undefined ? ` Board id: ${j.boardId}.` : ''}`,
    `- \`<KEY>\` in CLAUDE.md, TEAM.md, agents and skills means ${j.projectKey}; \`<KEY>-1234\` is a card of this project. Jira links: https://${j.site}/browse/<card>.`,
    `- Playwright repo folder: \`${r.pwRepoDir}\` (PW_REPO). FE repo folder: \`${r.feRepoDir}\` (FE_REPO), branch \`${r.feBranch || 'develop'}\`.`,
    `- UI map: ${d.uiMap ? `\`${d.uiMap}\`` : '(none)'}. Templates: ${d.templates ? `\`${d.templates}/\`` : '(none)'}.`,
    ...fieldLines(j.fields),
    `- Full profile: \`node tools/profile.mjs show\`.`,
  ].join('\n');
  return `<!-- generated from ${rel}; edit that file -->\n# Active project: ${p.title || j.projectKey}\n\n${settings}\n\n${rules.endsWith('\n') ? rules : rules + '\n'}`;
}

/** Writes <root>/.claude/active-profile.md (imported by CLAUDE.md; git-ignored). check: true only compares. */
export function syncActiveProfile({ root = process.env.QA_PROFILE_ROOT || ROOT, p = profile(), check = false } = {}) {
  const file = path.join(root, '.claude', 'active-profile.md');
  const want = renderActiveProfile(p);
  let have = null;
  try { have = fs.readFileSync(file, 'utf8'); } catch {}
  const changed = have !== want;
  if (changed && !check) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, want);
  }
  return { path: file, changed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === 'session-context') {
    // SessionStart hook (.claude/settings.json): stdout goes into Claude's context. Never blocks a session.
    try {
      const p = profile();
      const text = renderActiveProfile(p);
      try { syncActiveProfile({ p }); } catch {} // a read-only checkout still gets the rules in context
      process.stdout.write(text);
    } catch (e) { console.log(`PROJECT PROFILE NOT LOADED: ${e.message} — run node tools/setup.mjs`); }
    process.exit(0);
  }
  try {
    if (cmd === 'show') console.log(JSON.stringify(profile(), null, 2));
    else if (cmd === 'key') console.log(profile().jira.projectKey);
    else { console.error('usage: node tools/profile.mjs show|key|session-context'); process.exit(2); }
  } catch (e) { console.error(e.message); process.exit(1); }
}
