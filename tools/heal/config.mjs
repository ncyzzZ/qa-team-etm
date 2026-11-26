// config.mjs - where the Playwright repo (PW_REPO) and the developers' front-end repo (FE_REPO) are.
// Same lookup order as run-card.mjs: environment variable, else NAME= in the git-ignored .env, else a default.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { profile } from '../profile.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function envFileValue(envFile, name) {
  try {
    const m = fs.readFileSync(envFile, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}

/** @returns {{ pwRepo: string, feRepo: string, feBranch: string, sources: { pw: string, fe: string } }} */
export function resolveRepos({ envFile = path.join(ROOT, '.env'), profile: p = profile() } = {}) {
  const pwEnv = process.env.PW_REPO, pwFile = envFileValue(envFile, 'PW_REPO');
  const pwRepo = pwEnv || pwFile || path.resolve(ROOT, '..', p.repos.pwRepoDir);
  const feEnv = process.env.FE_REPO, feFile = envFileValue(envFile, 'FE_REPO');
  const feRepo = feEnv || feFile || path.resolve(pwRepo, '..', p.repos.feRepoDir);
  return {
    pwRepo, feRepo, feBranch: p.repos.feBranch || 'develop',
    sources: {
      pw: pwEnv ? 'environment' : pwFile ? '.env' : 'default: next to this repo',
      fe: feEnv ? 'environment' : feFile ? '.env' : `default: ${p.repos.feRepoDir} next to PW_REPO`,
    },
  };
}
