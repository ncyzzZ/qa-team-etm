// core.mjs - pure rules of regress.mjs: which Playwright specs to re-run for a set of stms-fe merges.
// Design: docs/superpowers/specs/2026-11-20-fe-diff-regression-design.md
//
// Spec  = { file, folder, keys: string[], tokens: Set<string>, owner: string|null }
// Merge = { commit, branch, keys: string[], files: { path, lines: string[] }[] }
// Row   = { file, tier: 'Must'|'Should'|'Warn', reasons: string[], owner: string|null }

const FEATURE = 'src/app/features/shutdown-event-list/';
const RANK = { Must: 3, Should: 2, Warn: 1 };
const COMMON = 5;   // a token used by more specs than this is too common to point at one spec
const BIG = 20;     // a merge with more changed app files than this is a big merge
const WIDE = 5;     // a shared change used by more page folders than this is a wide change

/** Card keys in a branch name; a bare number after a key keeps its prefix (ETM-8666,8664 / ETM-8671-8672). */
export function cardKeys(branch) {
  const out = [];
  for (const m of String(branch).matchAll(/ETM-(\d+)((?:[,\-_+/]\d{3,})*)/g)) {
    out.push(`ETM-${m[1]}`);
    for (const n of m[2].match(/\d{3,}/g) || []) out.push(`ETM-${n}`);
  }
  return [...new Set(out)];
}

const full = (prefix) => (prefix.startsWith('src/') ? prefix : FEATURE + prefix);
const under = (p, prefix) => p === prefix || p.startsWith(`${prefix.replace(/\/$/, '')}/`);

/** Spec folders of an stms-fe path (longest prefix wins), or null when no prefix maps it. */
export function mapPath(map, fePath) {
  let best = null;
  for (const e of map) {
    const pre = full(e.prefix);
    if (under(fePath, pre) && (!best || pre.length > best.pre.length)) best = { pre, specs: e.specs };
  }
  return best ? [...best.specs] : null;
}

/** Code several pages use: shared/, core/, the app root, a feature's components / models / utils / services, routes. */
export function isShared(map, fePath) {
  if (mapPath(map, fePath)) return false;
  return /^src\/app\/(shared|core)\//.test(fePath)
    || /^src\/app\/[^/]+\.ts$/.test(fePath)
    || /^src\/app\/features\/[^/]+\/(components|models|utils|services)\//.test(fePath)
    || /\.routes\.ts$/.test(fePath);
}

/** Specs the report may list: tests/fe/e2e only, never setup / cleanup / probe specs or setup / manual / explore folders. */
export function isListable(specPath) {
  const p = String(specPath).replace(/\\/g, '/');
  if (!/^tests\/fe\/e2e\/.+\.spec\.ts$/.test(p)) return false;
  if (/\/(setup|manual|explore)\//.test(p)) return false;
  return !/^(setup|cleanup|probe)/i.test(p.split('/').pop());
}

/** Rank the specs for the merges. Each spec once, in its highest tier, with every reason. */
export function tier({ specs, merges, map, importers }) {
  const rows = new Map();
  const notMapped = new Set();
  const wide = [];
  const add = (s, t, reason) => {
    const r = rows.get(s.file) || { file: s.file, tier: t, reasons: [], owner: s.owner };
    if (RANK[t] > RANK[r.tier]) r.tier = t;
    if (!r.reasons.includes(reason)) r.reasons.push(reason);
    rows.set(s.file, r);
  };
  const uses = new Map();
  for (const s of specs) for (const t of s.tokens) uses.set(t, (uses.get(t) || 0) + 1);
  const inFolders = (folders) => specs.filter((s) => folders.includes(s.folder));

  for (const m of merges) {
    const name = m.keys.length ? `${m.branch} (${m.keys.join(', ')})` : `${m.branch} (no card)`;
    for (const s of specs) if (s.owner && m.keys.includes(s.owner)) add(s, 'Must', `${name}: tests of card ${s.owner}`);

    for (const f of m.files) {
      if (isShared(map, f.path)) {
        const folders = [...new Set(importers(f.path).flatMap((p) => mapPath(map, p) || []))];
        if (folders.length > WIDE) { wide.push({ merge: name, file: f.path, folders }); continue; }
        if (!folders.length) { notMapped.add(f.path); continue; }
        for (const s of inFolders(folders)) add(s, 'Warn', `${name}: shared ${f.path}, used by ${folders.join(', ')}`);
        continue;
      }
      const folders = mapPath(map, f.path);
      if (!folders) { notMapped.add(f.path); continue; }
      for (const s of inFolders(folders)) add(s, 'Should', `${name}: same page as ${f.path}`);
    }

    const big = m.files.length > BIG;
    for (const s of specs) {
      const hits = new Map(); // token -> first file whose changed lines contain it
      for (const t of s.tokens) {
        if ((uses.get(t) || 0) > COMMON) continue;
        const f = m.files.find((x) => x.lines.some((l) => l.includes(t)));
        if (f) hits.set(t, f.path);
      }
      if (!hits.size) continue;
      const [t, file] = [...hits][0];
      const what = `${name}: locator ${[...hits.keys()].join(', ')} changed in ${file}`;
      if (big && hits.size < 2) add(s, 'Should', `${name}: locator ${t} changed in ${file} (big merge)`);
      else add(s, 'Must', what);
    }
  }
  const out = [...rows.values()].sort((a, b) => RANK[b.tier] - RANK[a.tier] || a.file.localeCompare(b.file));
  return { rows: out, notMapped: [...notMapped].sort(), wide };
}

/** Run commands: per owner card one run-card for Must, one for Should + Warn; specs with no owner in one plain playwright run. */
export function commands(rows) {
  const out = [];
  const owners = [...new Set(rows.filter((r) => r.owner).map((r) => r.owner))].sort();
  for (const o of owners) {
    const mine = rows.filter((r) => r.owner === o);
    const must = mine.filter((r) => r.tier === 'Must').map((r) => r.file);
    const rest = mine.filter((r) => r.tier !== 'Must').map((r) => r.file);
    if (must.length) out.push(`node tools/run-card.mjs ${o} ${must.join(' ')}`);
    if (rest.length) out.push(`node tools/run-card.mjs ${o} ${rest.join(' ')}`);
  }
  const none = rows.filter((r) => !r.owner).sort((a, b) => RANK[b.tier] - RANK[a.tier]).map((r) => r.file);
  if (none.length) out.push(`npx playwright test ${none.join(' ')} --workers=1 --reporter=line   # results not recorded per card`);
  return out;
}
