/**
 * ETM-8049: soft-delete the leftover works (list updated 2026-11-24 after run 095826) in Plan "QA ETM-8049 Scratch" (QA only), the same way the app deletes
 * (shutdown_work.sdw_is_delete = 'Y'). Only the exact Work Numbers below, only in the Scratch worklist, only rows still active.
 *
 * Dry run (default, read only):  node <this file>
 * Apply (needs the user's yes):  node <this file> --apply
 * Run from anywhere; it uses PW_REPO's .env, node_modules and DB certs.
 */
const path = require('path');
const fs = require('fs');
const { createRequire } = require('module');

const PW_REPO = process.env.PW_REPO || '/Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa';
const req = createRequire(path.join(PW_REPO, 'package.json'));
req('dotenv').config({ path: path.join(PW_REPO, '.env'), quiet: true });
const { Client } = req('pg');

const SCRATCH_WORKLIST = 'bea32b01-d98f-4952-8c5c-bbffb84d46dd'; // plans.scratch.worklistId in output/seed/ETM-8049.json
const WORKS = ['WK-16a-107944'];

const e = process.env;
const apply = process.argv.includes('--apply');
if (/uat|prod/i.test(`${e.DB_HOST} ${e.BASE_URL}`)) { console.error('Refused: DB_HOST / BASE_URL is not QA.'); process.exit(2); }
const cert = (f) => fs.readFileSync(path.join(PW_REPO, 'dataTests', 'accessDB', f)).toString();

(async () => {
  const c = new Client({
    host: e.DB_HOST, port: +(e.DB_PORT || 5432), database: e.DB_NAME, user: e.DB_USER, password: e.DB_PASSWORD, connectionTimeoutMillis: 15000,
    ssl: e.DB_SSL === 'true' ? { rejectUnauthorized: false, ca: cert('server-ca.pem'), cert: cert('client-cert.pem'), key: cert('client-key.pem') } : false,
  });
  await c.connect();
  try {
    await c.query('BEGIN');
    const plan = (await c.query(
      `select m.swl_id, p.spl_name from shutdown_map m join shutdown_plan p on p.spl_id = m.spl_id where m.swl_id = $1 and p.spl_is_delete = 'N'`, [SCRATCH_WORKLIST])).rows[0];
    if (!plan || plan.spl_name !== 'QA ETM-8049 Scratch') throw new Error(`worklist ${SCRATCH_WORKLIST} is not Plan "QA ETM-8049 Scratch" (${plan && plan.spl_name})`);
    const rows = (await c.query(
      `select sdw_id, sdw_work_number from shutdown_work where swl_id = $1 and sdw_is_delete = 'N' and sdw_work_number = any($2::text[]) order by sdw_work_number`,
      [SCRATCH_WORKLIST, WORKS])).rows;
    console.log(`Plan: ${plan.spl_name}. Active works matching the list: ${rows.length} of ${WORKS.length}`);
    for (const r of rows) console.log(`  ${r.sdw_work_number}  ${r.sdw_id}`);
    const missing = WORKS.filter((w) => !rows.some((r) => r.sdw_work_number === w));
    if (missing.length) console.log(`Not found / already deleted: ${missing.join(', ')}`);
    if (!apply) { await c.query('ROLLBACK'); console.log('DRY RUN: nothing changed. Add --apply to soft-delete.'); return; }
    const u = await c.query(
      `update shutdown_work set sdw_is_delete = 'Y', sdw_updated_by = 'qa-cleanup-ETM-8049', sdw_updated_date = now()
       where sdw_id = any($1::uuid[]) and swl_id = $2 and sdw_is_delete = 'N'`, [rows.map((r) => r.sdw_id), SCRATCH_WORKLIST]);
    if (u.rowCount !== rows.length) throw new Error(`expected ${rows.length} rows, updated ${u.rowCount}; rolled back`);
    await c.query('COMMIT');
    console.log(`APPLIED: soft-deleted ${u.rowCount} works.`);
  } catch (err) { await c.query('ROLLBACK').catch(() => {}); console.error(String(err.message || err)); process.exitCode = 1; }
  finally { await c.end(); }
})();
