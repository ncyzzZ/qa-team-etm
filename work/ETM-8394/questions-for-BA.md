# ETM-8394 Questions for BA

**Story:** [Improvement] Import Work and Work Breakdown - Import Work Status and Breakdown Status
**Status:** Ready For Development. These items block test cases that are not written yet.
⭐ = affects an Expected Result directly.

Already clear from ETM-6843 / ETM-846 (no need to answer): status text ignores case (ETM-6843 AC 7.5); any Error disables Confirm and nothing is imported until fixed (AC 7.1); Delete on Work is a soft delete, Delete on Breakdown is permanent (AC 1.4).

## Status values and master data

1. ⭐ **`Deleted` as Work Status.** The template sheet `Dropdown Options` has New, Reviewed, Updated, Information Required, Ready for Work Status, and no `Deleted`. Confirm that importing `Deleted` shows the AC 6 master data Error (and not a separate message). Is the same true for `Deleted` in the Breakdown Status column?

2. ⭐ **`Change Requested`.** ETM-846 lists it as a Work Status, but it is not in the template dropdown. Can a Turnaround Manager import `Change Requested` (accepted), or is it a master data Error?

3. ⭐ **Spaces around the value.** Is a value such as ` Reviewed ` (leading/trailing space) trimmed and accepted, or is it a master data Error?

4. ⭐ **Status in the wrong column.** A Work Status value (for example `Reviewed`) is typed in the Breakdown Status column, or the reverse. Is it the AC 6 Error on that cell?

## Action = Revise

5. ⭐ **Blank status on Revise, Turnaround Manager.** Only Work `Reviewed` and `Information Required` become `Updated` after an edit (ETM-846 AC 5.1), and only Breakdown `Breakdown Reviewed` / `Breakdown Required` become `Breakdown Updated` (AC 5.3). Please confirm that with a blank status cell every other status stays the same: Work `New`, `Updated`, `Change Requested`, `Ready`, and Breakdown `Breakdown Updated`.

6. ⭐ **What counts as "edited".** Does the automatic trigger fire only when a data cell really changed, or on every Revise row (even when all values are the same as in the system)?

7. ⭐ **One status column filled.** Turnaround Manager revises a Work and fills only Work Status (Breakdown Status blank), or only Breakdown Status. Is the blank column handled by the automatic trigger, or left unchanged?

8. ⭐ **Filled status and data change together.** Revise changes a data cell and also fills a status (for example Work `Reviewed` with a changed Work Header). Does the imported status always win over the automatic trigger (so it stays `Reviewed`, not `Updated`)?

9. **Same status as today.** Turnaround Manager imports the status the record already has. Please confirm: no change and no message.

## Job Owner and permission

10. ⭐ **Who counts as Turnaround Manager.** Is the role checked per user, per Worklist, or per Work? Example: a user who is Turnaround Manager on one Worklist and Job Owner on another, importing into the second one.

11. ⭐ **Job Owner with an invalid value.** Job Owner imports a status cell with an invalid or `Deleted` value. AC 1.2 says the columns are ignored without any message. Please confirm there is no Error either (the file can still be confirmed).

## Delete, Deleted records and Freeze

12. ⭐ **Revise on a Work that is already Deleted** (or a Work Breakdown under a Deleted Work). Is the row rejected with a message, ignored, or does the status change? Which message?

13. ⭐ **Action = Delete with a status filled.** Is the status ignored, or an Error?

14. ⭐ **Work in `Ready` or `Deleted` with a blank status on Revise.** Please confirm it stays the same.

15. ⭐ **Frozen Worklist.** The Worklist is frozen and a Turnaround Manager imports Work `Ready` or `Reviewed`. Is the imported status kept, or does a Freeze rule from ETM-846 AC 5.5 apply?

## Combination (AC 4)

16. **Work `Ready` with Breakdown `Breakdown Updated`.** AC 4 accepts it, but in the UI (ETM-846 AC 3) Ready needs Breakdown Reviewed. Please confirm there is no warning on the import result screen and the record opens normally afterwards.
