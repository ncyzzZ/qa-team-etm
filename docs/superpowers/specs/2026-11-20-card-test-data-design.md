# Card test data: seed and reset before each run (design)

Date: 2026-11-20. Status: draft for the user's approval.

## Why

Today the test data of a card is spread over three places and is set up by hand:

- `.env` keys per card (40 keys, 13 for ETM-8392 alone): ids, paths, dates of data someone made by hand.
- Sprint-wide scripts: `scripts/seed/seedSprint26.cjs` + `sprint26.data.cjs` (DB, dry run by default, `--apply`, `--undo`) and the UI setup specs `tests/fe/setup/setupSprint26Plans.spec.ts`, `setupEtm8042RampData.spec.ts` (make Events / Plans through the UI, safe to run again, print `.env` lines and a "SETUP TODO" list for steps a person must do).
- The QA environment itself, shared with other testers and other chats: a test that edits a Plan leaves it changed, so the next run starts from an unknown state.

Results: cards blocked by data (ETM-8405 waits for `seedSprint26 --actual --apply`, ETM-8003 S-Curve data), triage cause `data` with no way to tell what was wrong, and a new chat cannot run a card without re-reading the handoff note.

Goal: for one card, one command brings its data to a known state before the run, the run uses that data, and anyone (a new chat, another person) can do it from the card key alone.

## Goals

1. One data file per card describes all the data the card's tests need.
2. One command per card: `check` (read only, what differs), `reset` (dry run by default, `--apply` writes), `setup` (the one-time UI part).
3. `run-card.mjs` checks the card's data before Playwright starts and stops with a clear message when it is not ready (never runs on unknown data).
4. Specs read the card's ids from the data result file, not from new `.env` keys.
5. Every DB write is QA-only, in one transaction, dry run first, and approved by the user.

## Non-goals

- No CI (item 1 waits). No UAT / PROD ever.
- No rewrite of existing cards' specs or `.env` keys now. Old cards move to the new way only when the card is touched again.
- Not a general DB fixture framework: only the tables the ETM cards actually use, added when a card needs them.
- No new data via the app's REST API (Save requests are gzipped whole-tree bodies, see `verifyShutdownLogicPriority.spec.ts`; too fragile to build).

## Anti-goals (a failure even if it works)

- A reset that touches rows the card does not own (another tester's plan, the shared base event's works).
- A run that starts on data the reset did not confirm, and then reports PASSED.
- A write to QA data without the user's yes (the approval rule in CLAUDE.md / TEAM.md).
- Breaking the cards that use the old way (`.env`, `seedSprint26`).

## Approaches considered

- **A. Restore after the run**: snapshot the rows the tests touch, put them back at the end. Rejected: a crashed run or another person's edit leaves the data wrong, and the next run does not know.
- **B. Fresh data per run**: new Event / Plan with a unique name every run. Rejected: making a Plan through the UI takes minutes, the QA env fills with leftovers, and some data (Daily Report snapshot, frozen worklist) cannot be made fresh quickly.
- **C. Own Plan per card, made once; content reset to a known state before every run** (chosen by the user). Builds on the `seedSprint26` pattern. A crashed run or someone's edit does not matter, because the next run resets first.

## Design

### 1. Ownership: what a card may reset

Each card owns **its own Plan(s)**, or its own **Event** when the data lives on the Event (Timeline cards; like ETM-8042 "QA S26 Ramp"), named with the card key: `QA ETM-8405 <purpose>`. One data file may own several Plans and Events (ETM-8049 / 8391 style data sets with many Plans). The reset may rewrite anything inside an owned Plan or Event because nobody else uses it.

Data outside owned Plans / Events (the base event "NN TEST QA", the spare Timeline event `TL_SPARE_EVENT_ID`, an existing active Daily Report) is **shared**. On shared data the tool may only (a) UPDATE named columns of rows found by a stable key, and (b) insert rows of its own and later change or remove **only those rows**: their ids are kept in the result file and every later write is limited to those ids (this is how ETM-8405 gets its weekly Actual (%), which `seedSprint26 --actual` inserts today). It never deletes or edits a shared row it did not make, beyond (a). Shared items are listed apart in the dry run summary. *(Builder's call, after review: a card-owned Event for every Timeline card would mean a lot more QA data to create by hand.)*

A Plan the card owns is recognised by name + event and recorded with its id in the result file. The reset refuses to write into a Plan whose name does not carry the card key.

### 2. The data file

`ep-etm-fe-qa/scripts/seed/cards/ETM-<n>.data.cjs` (same folder family and CommonJS style as `sprint26.data.cjs`, so the existing helpers can be reused):

```js
module.exports = {
  key: 'ETM-8405',
  event: '9885b03f-...',              // default NN TEST QA
  plans: {                             // made once through the UI (setup), content reset by DB
    main: { name: 'QA ETM-8405 Weekly', ramp: { start: '13 Sep 2026 16:15', end: '30 Sep 2026 16:15' },
            needs: ['shutdownLogic'],  // UI steps setup must do on the Plan card
            works: [ work('WK-1', [bd(['Main Deck'], ['1'], ['A'])]), ... ] },
  },
  shared: [                            // UPDATE only, rows found by a stable key
    { what: 'weekly Actual (%) of WK-1 on the base Timeline', table: '...', where: { ... }, set: { ... } },
  ],
  manual: [                            // what neither UI setup nor DB can make; checked by `check`, never reset
    { what: 'Plan main worklist frozen', check: 'select ... ' },
  ],
  outputs: ['plans.main.id', 'plans.main.worklistId'],   // what specs read
};
```

Three layers, each with a different way to make it:

| Layer | Made by | When | Reset before each run |
|---|---|---|---|
| structure (Event, Plan, Shutdown Logic / Daily Report rows) | UI setup spec, generic, driven by the data file | once, or when `check` says missing | no (only checked) |
| content (works, breakdowns, values inside owned Plans) | DB, one transaction | before every run | yes |
| shared fields | DB UPDATE of named columns | before every run | yes, own approval line |
| manual items | a person | once | no (only checked; missing = stop with the TODO) |

### 3. Commands

`node scripts/seed/card-data.cjs <KEY> <check|reset|setup> [--apply]` in the Playwright repo.

- `check` (read only, no approval): for each layer, compare the DB with the data file (every column the file sets, plus the work count of each owned worklist). Prints one line per difference and an overall `READY` / `NEEDS RESET` / `NEEDS SETUP` / `NEEDS MANUAL: <todo>`. Exit codes 0 / 10 / 11 / 12.
- `reset`: content + shared. Without `--apply`: the whole reset inside one transaction, print the counts (`works: 2 updated, 1 inserted, 1 marked deleted; shared: 1 row updated`), ROLLBACK. With `--apply`: same, COMMIT, then run `check` again and require `READY`.
  Content reset is **in place, keyed by work number** (the data file's work id, stored as `sdw_work_number`), so work ids stay the same and the structure rows that point at works (Shutdown Logic tasks, Daily Report items made once by setup) keep pointing at live works: a work in the file and in the DB gets its columns and children (breakdowns, working locations) rewritten to the file; a work only in the file is inserted; a work only in the DB is marked deleted the way the app does (`sdw_is_delete = 'Y'`, as `seedSprint26 --undo`). Children (breakdowns, locations) have no rows pointing at them from structure and may be replaced. *(Builder's call, after review.)*
- `setup`: runs the generic UI setup spec `tests/fe/setup/setupCard.spec.ts` with `CARD=<KEY>` for missing structure only (safe to run again, like the existing setup specs), then prints the manual TODO list. Writes QA data through the UI, so it needs approval too.

Guards in every write: QA host only (same check as `seedSprint26` and the setup specs), refuse a Plan without the card key in its name, refuse a worklist holding works this tool did not make unless the Plan is owned, one transaction, `--apply` only.

### 4. Result file and how specs read it

`ep-etm-fe-qa/output/seed/ETM-<n>.json`: `{ key, resetAt, dbHost, feVersion, ids: { 'plans.main.id': '...', ... } }`. A helper `cardData(key)` in `utils/` returns the ids and throws a clear error ("run card-data.cjs ETM-8405 reset") when the file is missing. New specs use it instead of `.env`. A spec that still needs a value the tool cannot produce (a login state file) keeps its `.env` key.

### 5. Run flow (run-card.mjs and the lead)

1. Lead, before asking "พร้อมรันไหม": `card-data.cjs <KEY> check`. When the card has no data file, nothing changes (old way).
2. `NEEDS SETUP` / `NEEDS MANUAL`: show what is missing, ask (setup is a QA write).
3. **Every run of a card with a data file is preceded by a reset** (the user's choice: reset before each run; tests edit the data, so a `READY` from the last run cannot be trusted). The run approval question includes the reset dry-run summary: `ask --approve --options "รีเซ็ตแล้วรัน|ยังก่อน" "ETM-8405: reset data (2 works, 1 shared row) then run 9 tests?"`. One yes covers that reset + that run, this time only. Recorded with `state.mjs approve --kind data-reset`.
4. `run-card.mjs` enforces it: right before Playwright it requires (a) a result file whose `resetAt` is newer than the card's last run folder, and (b) `check` = `READY`. Otherwise it stops (exit 2) and prints the command to run. It writes the check result into the run folder (`data-check.json`). `--no-data-check` exists for a run the user asked for on purpose (printed in the report as "data not reset").
5. Triage: a failure in a run whose `data-check.json` was `READY` is not given cause `data` for missing / wrong setup data; triage says so in its reason.

Two cards cannot own the same Plan / Event: the tool refuses a data file whose Plan or Event name carries another card key. Lock: one file per card, `ep-etm-fe-qa/output/seed/ETM-<n>.lock`, taken by `reset` and kept by `run-card.mjs` until the run ends (both tools find it through `PW_REPO`); a stale lock older than 2 hours is reported, not silently taken.

### 6. Moving existing data

- `seedSprint26.cjs` and its data stay as they are (cards 8049, 8391, 8405 use them). ETM-8405 is the first card moved to the new way (its Actual is the open blocker), as the worked example.
- The generic UI setup spec reuses `createPlan` / `card` helpers already used by `setupSprint26Plans.spec.ts`.
- ETM-8042's setup spec belongs to another chat: not touched.

## Constraints

- QA DB access as today (`DB_HOST` ... in `.env`, `pg`), `created_by = TURNAROUND_MANAGER_USER`.
- Approval rule: a QA data write needs the user's yes (chat or `team.mjs wait` ANSWER). Read-only `check` needs none.
- Must run on Windows and Mac (same as `tools/setup.mjs`).
- Reply language and board rules unchanged.

## Left to the builder

- Exact SQL per table, found from the existing `seedSprint26.cjs` and the QA DB schema; which columns `check` compares.
- The shape of `work()` / `bd()` helpers (reuse from `sprint26.data.cjs`).
- How `setupCard.spec.ts` drives each `needs` step (reuse existing helpers; a step without a helper goes to the manual TODO).
- Test plan: unit tests for the diff and the guards with a fake DB layer; one real `check` on ETM-8405 (read only).
