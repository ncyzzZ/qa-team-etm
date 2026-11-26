# Questions for dev: Work Breakdowns of a Work deleted by Import (ETM-10051)

**From:** QA, 26 Nov 2026
**Related:** Defect ETM-10051, Story ETM-8394 (AC 7), Xray ETM-8767 / ETM-8747, ETM-8766

## Context
Dev and the BA agree that the current behaviour is correct, and no improvement is planned. QA accepts this. We want to understand the design so that our test cases check the right things.

What we see on QA (retests on 26 Nov, last run 15:30):
- A Work Breakdown row with `Action = Delete`, when its Work is kept: the breakdown is removed.
- A Work row with `Action = Delete`, together with its Work Breakdown row with `Action = Delete`:
  - the Work becomes Deleted (`shutdown_work.sdw_is_delete = 'Y'`);
  - its breakdown stays in `shutdown_activity_breakdown`, unchanged (example: W-8394-Z2-qkoo).

## Questions
1. **Design:** When a Work is deleted, its breakdowns are kept as they are. Is that the rule? Are they treated as deleted only because their Work is deleted, for example because every read joins on `sdw_is_delete`?
2. **The Delete row of the breakdown:** In the same file, the breakdown row with `Action = Delete` passes the preview with no Error, but nothing happens to the breakdown. Is that expected, or is the row skipped when its Work is deleted in the same file?
3. **Where users see it:** Is a breakdown of a deleted Work hidden everywhere? For example:
   - the Worklist and Work detail;
   - Export Work;
   - Shutdown Logic and the Manpower histogram;
   - reports.

   Is there any place where it could still show or still be counted?
4. **UUID reuse:** Can the UUID of a breakdown under a deleted Work be used again in a later import?
   - On a new Work?
   - On the same Work Number if it is imported again?

   Or does it give the "associated with another work" message (as on ETM-8766)?
5. **Restore:** Can a deleted Work be restored or imported again? If so, do its old breakdowns come back with it?
6. **Delete from the screen:** Does deleting a Work from the screen (the ETM-6843 delete) follow the same rule, keeping its breakdowns in the table?

## What QA will change after your answers
- **Xray ETM-8767:** Steps 9 and 13 will check only that the Work is Deleted and that its breakdowns no longer show in the UI.
- **Story ETM-8394, AC 7:** The text "a Work Breakdown is removed permanently" no longer matches the agreed behaviour. We will ask the BA whether the AC should be updated.
