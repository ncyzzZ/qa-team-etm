// run-plan.mjs - small pure helpers for tools/run-card.mjs (self-healing additions).
import fs from 'node:fs';
import path from 'node:path';

const VALUE_FLAGS = new Set(['-g', '--grep', '--grep-invert', '--project', '-c', '--config', '--workers', '-j', '--reporter', '--output', '--timeout', '--repeat-each', '--retries', '--shard', '--max-failures']);

/** Spec files named in run-card arguments, resolved under <pwRepo>/tests/fe (relative to pwRepo). Only files that exist. */
export function specFilesFrom(args, pwRepo) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('-')) { if (VALUE_FLAGS.has(a)) i++; continue; }
    for (const c of [a, `${a}.ts`].flatMap((x) => [path.join('tests', 'fe', x), x])) {
      if (pwRepo && fs.existsSync(path.join(pwRepo, c)) && fs.statSync(path.join(pwRepo, c)).isFile()) { out.push(path.normalize(c)); break; }
    }
  }
  return [...new Set(out)];
}

/** Adds --retries=1 unless the user set retries, or the run touches @dailyreport (shared data, restored by a separate spec). */
export function retriesFor(args, pwRepo) {
  if (args.some((a) => a === '--retries' || a.startsWith('--retries='))) return [...args];
  // only a plain list of existing spec files is known not to reach @dailyreport; a folder or "everything" may
  const positional = args.filter((a, i) => !a.startsWith('-') && !VALUE_FLAGS.has(args[i - 1]));
  if (!positional.length || specFilesFrom(positional, pwRepo).length !== positional.length) return [...args, '--retries=0'];
  const grep = args.some((a, i) => (/^(-g|--grep)$/.test(args[i - 1] || '') || /^--grep=/.test(a)) && /@dailyreport/.test(a));
  const inFiles = specFilesFrom(args, pwRepo).some((f) => { try { return /@dailyreport/.test(fs.readFileSync(path.join(pwRepo, f), 'utf8')); } catch { return false; } });
  return [...args, grep || inFiles ? '--retries=0' : '--retries=1'];
}

/**
 * True only when at least one test passed and every test that ran passed on its first and only attempt.
 * Skipped tests (test.skip) are ignored; a flaky test (failed, then passed) is not a pass.
 */
export function allPassed(results) {
  let passed = 0, ok = true;
  (function walk(s) {
    for (const sp of s.specs || []) for (const t of sp.tests || []) {
      const res = (t.results || []).filter((r) => r.status !== 'skipped');
      if (!res.length) continue;
      if (res.some((r) => r.status !== 'passed')) ok = false; else passed++;
    }
    (s.suites || []).forEach(walk);
  })(results);
  return passed > 0 && ok;
}

const FILTER = /^(-g|--grep|--grep-invert|--last-failed|--only-changed|--shard|--max-failures|-x)(=|$)/;

/** Move the stms-fe baseline only after a clean exit of an unfiltered run where everything that ran passed. */
export function canAdvanceBaseline(args, exitCode, results) {
  return exitCode === 0 && !args.some((a) => FILTER.test(a)) && allPassed(results);
}
