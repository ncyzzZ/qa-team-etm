# ETM-8394 Questions for BA, round 2 (still open after the 18 Nov answers)

**Story:** [Improvement] Import Work and Work Breakdown - Import Work Status and Breakdown Status
**Status:** Ready For Development. These items block test steps that are not written yet.
⭐ = affects an Expected Result directly.

1. ⭐ **Preset breakdowns (Work Breakdown Type).** A Turnaround Manager imports `Action = Add` for a Work that has a `Work Breakdown Type` preset and no explicit Work Breakdown rows (ETM-6843 AC 4.3). The system generates the breakdowns. What Breakdown Status do the generated breakdowns get: `Breakdown Updated` (default), or something taken from the file? The Breakdown Status column has no row to sit on.

2. ⭐ **Add a new breakdown under an existing Work.** A Turnaround Manager imports `Action = Revise` for an existing Work (Work-level values unchanged, Work Status blank) plus a new Work Breakdown row (`Action = Add`). Does the new breakdown count as a "Work Breakdown value that differs from the system" (AC 3.3), and does it change the Work Status? Example: Work at `Reviewed`; does it stay `Reviewed` or become `Updated`? The Breakdown Status of the new row is `Breakdown Updated` when blank, or the filled value.

3. ⭐ **Status typed on the wrong Data Level row.** `Breakdown Status` is filled on a row with Data Level `Work`, or `Work Status` on a row with Data Level `Work Breakdown`. Is the value ignored, or is it an Error (AC 6), or does the system read the status by column no matter the row level? (We assume Work Status is read on Work rows and Breakdown Status on Work Breakdown rows.)

4. **Delete of a breakdown inside a Revise Work.** A Revise Work (values unchanged, status blank) has one breakdown row with `Action = Delete`. Does the permanent delete count as an "edit" for the Work Status trigger (Work at `Reviewed` becomes `Updated` or stays)? And does it change the Breakdown Status of the breakdowns that remain? (We assume the remaining unchanged breakdowns keep their status.)
