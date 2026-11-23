# Card test data: create by script before the run, delete after (design)

Date: 2026-11-23. Status: draft for the user's approval. Changes `2026-11-20-card-test-data-design.md`.

## Why

Making a card's Event / Plan once through the UI and resetting it is slow to set up and leaves card data on QA for
good. The user wants every card run to make its own data **by script** (not through the UI), run the tests on it,
and delete it when the run ends.

## Goals

1. A card's data file says what to create; one command makes all of it with no UI: Event and Plan through the app's
   own API, the content inside (works, breakdowns, daily report values) through the DB, as `card-data.cjs` does now.
2. `run-card.mjs` does create → run → delete for every card that has a data file. Delete runs even when tests fail
   or the run crashes.
3. Specs read the ids of the new data with `cardData('<KEY>')`, as now.
4. Leftovers from a crashed run are found and deleted at the start of the next run of that card.

## Non-goals

- Per test case data (each TC its own Event). One set of data per card run.
- Changing old cards that still use `.env` keys or `seedSprint26`. They move when touched.
- The Shutdown Logic tree save (gzipped whole-tree body). If a card needs Shutdown Logic rows, that part stays
  in the data file as a DB insert or as a `manual` item, decided per card.

## Anti-goals

- Deleting anything the script did not create. Only ids written in the card's ledger file are deleted.
- A run on data the create step did not finish (create fails → the run does not start).
- UAT / PROD: QA host only, same guard as today.

## Approach (chosen: C, mixed)

- **A. All DB**: rejected, the app creates many rows per Event / Plan; a hand-made row set may not match the app.
- **B. All API**: rejected, the content APIs (logic tree save) are too fragile to build.
- **C. Structure by API, content by DB, delete by API** (user's pick).

## Design

### Flow of one card run (`run-card.mjs <KEY> ...`, card with a data file)

1. **Sweep**: read `output/seed/<KEY>.ledger.json`; any Event / Plan id left from an earlier run is deleted by API
   first (only those ids).
2. **Create** (`card-data.cjs <KEY> create --apply`): sign in token as in `tests/global-setup.ts`; `POST
   /shutdown-events` with the data file's event fields, name `QA-AUTO <KEY> <yyyyMMdd-HHmm>`; `POST
   /shutdown-events/{id}/planning` for each plan; each new id goes into the ledger right away (so a crash halfway
   still leaves a list to delete). Then the existing content writer fills works / breakdowns / daily report rows in
   one DB transaction, targeted at the new ids. Then `check` must be `READY`; `output/seed/<KEY>.json` gets the ids.
3. **Run** Playwright as now.
4. **Delete** (`card-data.cjs <KEY> cleanup --apply`), always, in a `finally`: delete Plans then the Event by API
   (`DELETE /shutdown-events/{id}/planning/{planId}`, `DELETE /shutdown-events/{id}`); any DB row the content step
   inserted on shared tables is removed by id; ledger cleared only for ids that were really deleted.
   `--keep-data` skips this step for a run the user wants to look at afterwards (the report says so).

### Approval

One question before the run covers create + run + delete for that run:
`ask --approve --options "สร้าง data → รัน → ลบ|ยังก่อน" "<KEY>: create data (1 event, 2 plans, 12 works), run N tests, delete after?"`
Recorded with `state.mjs approve --kind data-reset` (same kind as today). The sweep of leftovers is listed in the
same question when there are any.

### Data file

`scripts/seed/cards/<KEY>.data.cjs` gains `create: true`. Then:
- `event` is either an existing event id (the card's Plans are made on it, as ETM-7343 / 8049 need: their source plan
  and master data live on that event) or `{ create: {...SaveForm fields} }` for a new Event of its own.
- each Plan is made by `POST .../planning` (ramp dates) or, with `source`, by `POST .../planning/{id}/duplicate`
  (then poll `.../duplicate/status`); its `needs` (`shutdownLogic`, `dailyReport`, `manpowerMob`, `equipmentMob`) by the
  matching `POST .../planning/{id}/<need>`; `contentBy: 'import'` works by `POST .../works/import-works` with the
  same Excel the UI setup uploads today. Then the DB content step as now.
- Cleanup deletes the Plans the run made (needs first, then the Plan), and the Event only when the run made it.
Content (`works`, `shared`, `manual`) keeps today's shape.

## Constraints

- Token: same SSO login as `tests/global-setup.ts` (credentials in `.env`, never printed).
- Windows and Mac, Node only.
- The approval rule in CLAUDE.md is unchanged.

## Left to the builder

- Exact request bodies: captured from one real create in the app (network log), then fixed in a helper.
- Whether `DELETE /shutdown-events/{id}` refuses an Event with Plans or works (then delete children first).
- Which existing cards' data files move first (ETM-8405 as the worked example, as before).
