// config.mjs - where the Playwright repo (PW_REPO) and the developers' front-end repo (FE_REPO, stms-fe) are.
// Same lookup order as run-card.mjs: environment variable, else NAME= in the git-ignored .env, else a default.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function envFileValue(envFile, name) {
  try {
    const m = fs.readFileSync(envFile, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}

/** @returns {{ pwRepo: string, feRepo: string, sources: { pw: string, fe: string } }} */
export function resolveRepos({ envFile = path.join(ROOT, '.env') } = {}) {
  const pwEnv = process.env.PW_REPO, pwFile = envFileValue(envFile, 'PW_REPO');
  const pwRepo = pwEnv || pwFile || path.resolve(ROOT, '..', 'ep-etm-fe-qa');
  const feEnv = process.env.FE_REPO, feFile = envFileValue(envFile, 'FE_REPO');
  const feRepo = feEnv || feFile || path.resolve(pwRepo, '..', 'stms-fe');
  return {
    pwRepo, feRepo,
    sources: {
      pw: pwEnv ? 'environment' : pwFile ? '.env' : 'default: next to this repo',
      fe: feEnv ? 'environment' : feFile ? '.env' : 'default: stms-fe next to PW_REPO',
    },
  };
}
