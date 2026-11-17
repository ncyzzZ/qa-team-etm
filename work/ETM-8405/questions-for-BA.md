# ETM-8405 Questions for BA (before writing test cases)

**Story:** [Improvement] Shutdown Timeline - Editable Weekly Plan (%) in Edit Plan
**Status:** In Development. 1 comment (clamping rules update, already merged into the AC). No mockup yet.
⭐ = affects an Expected Result directly, please answer first.

## Blank values and Save (AC 1.5, 2.1, 4.2)

1. ⭐ When a weekly cell is cleared (or gets a negative / invalid value) and the user clicks Save, is it stored and shown as blank or as 0.0 after Save, after reload, and on the Main Timeline?
2. ⭐ Is `[ Save ]` disabled only when Total Progress → Plan (%) is not 100.0, or also while any cell holds invalid input?
3. When the weekly sum has a decimal drift (e.g. 0.1 + 0.2), is the sum rounded to 1 decimal before it is compared with 100.0?

## Clamping and Paste (AC 1.5, 3.3)

4. ⭐ Pasting a value like 100.9: truncate first, then clamp (result 100.0)? Does this match ETM-7349 AC 2.4?
5. ⭐ Pasting into several cells (ETM-8388): which AC governs it for this Story, and how are out-of-range or read-only target cells handled?
6. When a value is clamped to 100.0, is a message or tooltip shown, or does it change silently?
7. If the calculated Plan (%) is above 100.0 (e.g. 130.0) and the user then types a value in the activity's Plan (%), does the typed value (clamped to 100.0) overwrite all weekly values per AC 3.1 even when it equals the current value?

## Changing dates (AC 1.1-1.3, 3.1-3.2)

8. ⭐ If a Start/End Date change moves some weeks out of the date range, do those cells become empty and stop counting in the sum?
9. ⭐ If an activity loses its Start or End Date, are its weekly values cleared or kept, and does its Plan (%) stay or reset?

## Shutdown Size change (AC 5)

10. ⭐ Does a Size change apply immediately with no confirmation, and what happens to weekly edits that are not saved yet?
11. For a custom activity whose dates fall outside the new Shutdown Size, are its weekly values still kept unchanged?

## Design

12. Mockup is still "To be provided": please share how editable and read-only weekly cells should look (colour, cursor).
