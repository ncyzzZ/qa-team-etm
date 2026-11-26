# Answers from dev: Work Breakdowns of a Work deleted by Import (ETM-10051)

**To:** QA · **Date:** 26 Nov 2026
**Related:** Defect ETM-10051, Story ETM-8394 (AC 7), Xray ETM-8767 / ETM-8747, ETM-8766

These answers come from reading the current `develop` code. Nothing was run on the QA environment.

---

## 1. Design: are a deleted Work's breakdowns kept on purpose?

Yes. Deleting a Work is a **soft delete**: it only sets `shutdown_work.sdw_is_delete = 'Y'`. Nothing else is changed. The breakdowns, their manpower, working locations and conflicts all stay in their tables, unchanged.

They are treated as deleted only because their Work is deleted. The screens and exports load the Work list first, filtered on `sdw_is_delete = 'N'`, and then read the breakdowns of those Works. The breakdown table has no delete flag of its own.

The rows are removed for real later, by a daily cleanup job. It hard-deletes Works that have been soft-deleted for more than **30 days**, along with their breakdowns and everything linked to them. So "removed permanently" does happen, but about 30 days later, not at import time.

## 2. The breakdown row with Action = Delete in the same file

This is expected. The row is checked but never applied.

- **Preview:** under a Work marked Delete, every breakdown row **must** also be Delete and have its UUID. If not, preview shows an error. The row also passes the usual check that the UUID exists. That is why it shows no Error.
- **Import:** a Work marked Delete is handled as one unit, and only the Work's flag is set. Its breakdown rows are skipped.

So the Delete row only confirms what you mean. It does not remove anything.

## 3. Where users see it

| Place | Breakdown of a deleted Work |
|---|---|
| Worklist, Work detail | Hidden. Only Works with `sdw_is_delete = 'N'` are listed. |
| Export Work | Hidden. Same filter. |
| Shutdown Logic (Gantt) | Hidden. The Gantt is built from the Works that are not deleted. |
| Daily Report | Hidden. It is built from the same list as the Gantt. |
| **Manpower Mob** | **Can still be counted, for a limited time (see below).** |

### The exception: Manpower Mob

Each Shutdown Logic keeps saved Gantt bars, one per breakdown. When a Manpower Mob is created, it reads those saved bars directly, without checking whether the Work is deleted. Deleting a Work from the Worklist or by Import does not remove its saved bars. They are only rewritten the next time someone saves that logic's Gantt.

So this can happen:

1. The Gantt is saved.
2. A Work is deleted from the Worklist or by Import. On a frozen Worklist only a Turnaround Manager can do this.
3. A Manpower Mob is created from that logic **before** the Gantt is saved again.
4. The deleted Work's breakdowns are counted in the Mob's resources and histogram.

This comes from reading the code. It has not been reproduced on QA. A test case for this exact order of steps would confirm it.

## 4. UUID reuse

A breakdown UUID under a deleted Work **cannot** be reused.

- **On a new Work (Add):** an Add row must have an empty UUID. Preview gives the "UUID must be empty" error.
- **On a Work that is not deleted (Revise):** preview gives **"UUID does not exist"**, not "associated with another work". The ownership check ignores breakdowns whose Work is deleted. So the ETM-8766 message does not appear here.
- **Same Work Number imported again as Add:** this is allowed, because the duplicate check only compares against Works that are not deleted. It creates a **new** Work with **new** breakdown UUIDs. The old Work and its breakdowns stay deleted and separate.

## 5. Restore

Yes. A Turnaround Manager can restore a deleted Work until the 30-day cleanup runs. Restore flips the flag back to `'N'`. Since the breakdowns were never touched, they come back **exactly as they were**.

Importing the Work again is different. A Revise or Delete row with the old Work UUID gives "UUID does not exist". An Add row creates a new Work, as described in point 4. The old breakdowns do not come back that way.

## 6. Delete from the screen

- **Worklist delete:** this is the same function the import calls, so the behaviour is the same. The Work is soft-deleted and its breakdowns are kept.
- **Delete on the Shutdown Logic (Gantt) screen:** also soft-deletes the Work and keeps its breakdowns. It also removes that Work's saved Gantt bars right away, so the Manpower Mob exception in point 3 does not apply. (Deleting a single **breakdown** on the Gantt removes it for good.)

---

## On your planned changes

- **Xray ETM-8767, steps 9 and 13:** checking "Work is Deleted, and its breakdowns are hidden in the UI" matches the code. You could add one step for the Manpower Mob order in point 3.
- **Story ETM-8394, AC 7:** agreed that the current wording doesn't match. A more accurate version would be: *"the Work is deleted and its breakdowns are no longer shown. They are removed for good after 30 days."*

---

## Follow-up from dev (26 Nov 2026, chat): the Manpower Mob count stays for good

| Situation | Does the Mob Plan count the deleted Work's manpower? |
|---|---|
| Mob Plan created before the Gantt is saved again | Yes. Saving the Gantt later does not remove it. |
| Mob Plan created after the Gantt is saved | No. |

**Why it stays:**
- The Mob Plan reads the Gantt only once, when it is created (`CreateManpowerMob` → `SaveByMpmIDAndSdlID`).
- It stores what it read in `manpower_mob_resource` / `manpower_mob_period`.
- Opening the Mob Plan reads these tables. It does not recalculate from the Gantt.
- Saving the Gantt never touches the Mob Plan.

**Why a Mob Plan created after a save is right:**
- A Work deleted on the Worklist is never loaded into the Gantt, because the query filters on `sdw_is_delete = 'N'`. The FE never sends it back.
- A Work deleted on the Gantt itself is sent with `isDelete = true`, and the BE makes no gantt row for it.
- In both cases `SaveGantts` clears the old gantt rows first, so the deleted Work does not get a row back.
