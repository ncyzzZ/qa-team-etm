#!/usr/bin/env node
// export-skills.mjs - copies of the project skills (.claude/skills/*) for the shared Claude account, one .zip per skill.
// The account keeps older copies under the prefix anthropic-skills:; people who work outside this repo use those.
// After a rule changes here, run this and upload the zips in claude.ai -> Settings -> Capabilities -> Skills (replace the old ones).
//   node tools/export-skills.mjs            -> dist/account-skills/<skill>.zip (and the unzipped folder next to it)
// Windows: zips with PowerShell Compress-Archive; Mac / Linux: zip.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The repo-only description start ("Repo version ... prefer it over the account skill ...") becomes "Synced from ... on <date>." */
export function accountDescription(md, date) {
  return md.replace(
    /^(description:\s*"?)Repo version \(project skill, no prefix; always prefer it over the account skill `anthropic-skills:(?:&lt;|<)same name(?:&gt;|>)`\)\.\s*/m,
    `$1Synced from the qa-team-etm repo on ${date}. `,
  );
}

function zip(cwd, name) {
  const r = process.platform === 'win32'
    ? spawnSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${name}' -DestinationPath '${name}.zip' -Force`], { cwd, encoding: 'utf8' })
    : spawnSync('zip', ['-qr', `${name}.zip`, name], { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`zip of ${name} failed: ${(r.stderr || r.error?.message || '').trim()}`);
}

/** @returns {string[]} the zip files written */
export function exportSkills({ root = ROOT, out = path.join(root, 'dist', 'account-skills'), date = new Date().toISOString().slice(0, 10) } = {}) {
  const src = path.join(root, '.claude', 'skills');
  const names = fs.readdirSync(src, { withFileTypes: true }).filter((e) => e.isDirectory() && fs.existsSync(path.join(src, e.name, 'SKILL.md'))).map((e) => e.name).sort();
  fs.mkdirSync(out, { recursive: true });
  const made = [];
  for (const n of names) {
    fs.rmSync(path.join(out, n), { recursive: true, force: true }); // only this skill's own export, never the out folder itself
    fs.rmSync(path.join(out, `${n}.zip`), { force: true });
    fs.cpSync(path.join(src, n), path.join(out, n), { recursive: true });
    const md = path.join(out, n, 'SKILL.md');
    fs.writeFileSync(md, accountDescription(fs.readFileSync(md, 'utf8'), date));
    zip(out, n);
    made.push(path.join(out, `${n}.zip`));
  }
  return made;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const made = exportSkills();
  for (const z of made) console.log(`[export-skills] ${path.relative(ROOT, z)}`);
  console.log('[export-skills] upload them in claude.ai -> Settings -> Capabilities -> Skills, replacing the old ones');
}
