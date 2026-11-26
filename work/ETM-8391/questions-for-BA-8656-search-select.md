# ETM-8391 Question for BA: Remark filter, selection made inside a search after the search is cleared

Story: ETM-8391 [Improvement] View Worklist Table - Remark Column Filter
Xray Test: ETM-8656, steps 5 to 7. Seen on QA on 25 Nov 2026 (evening build), Turnaround Manager, automated run `2026-11-25_195104_ETM-8391` and a read-only check of the panel.

## What changed in the evening build of 25 Nov 2026
The column filters (Remark and Job Description alike) now behave like the Excel filter:
1. Typing in the filter's Search box ticks all options found (e.g. `Note` ticks `Note 1`, `Note 2`, `Note 10`).
2. Clicking `Apply` while the search text is there filters the table to the options found (only W05, W06, W07).
3. Clearing the Search box (without Apply) brings back the full list with the earlier selection: every option ticked again. The ticks made inside the search are not kept.
4. With nothing ticked, `Apply` is disabled (it was enabled before and gave "No results found").
5. The search ignores letter case now (`note` finds `Note 1`).

## Test ETM-8656 as written
- Step 5: untick everything, type `Note`, tick Select All: the three Note options are ticked. **Matches.**
- Step 6: clear the Search box: only the three Note options stay ticked, the other options are not ticked. **Live: every option is ticked again.**
- Step 7: Apply: only the Note works are shown. **Live: every option is ticked, so Apply after the cleared search shows all works** (read from the ticks; not applied in the run).

## Question
Is the new behaviour (point 3: a selection made inside a search is dropped when the search is cleared; the user must click Apply while the search text is still there) the intended design?
- **A.** Yes, by design (Excel-like filter, same for all columns). QA will reword Xray ETM-8656 steps 6 and 7 to "Apply while the search text `Note` is shown -> only W05, W06, W07", and the nothing-ticked steps (ETM-8649, ETM-8655) to "Apply is disabled, same as the Job Description filter".
- **B.** No, the ticks made inside a search must be kept after the search is cleared. Then this is a bug in all column filters.

Please also confirm point 4 (Apply disabled when nothing is ticked) is intended. Earlier answer (24 Nov, Q6) said nothing ticked shows no works.

## Note from the code (stms-fe develop 1.26.36, read only)
The change is deliberate: commit `6fba9abf` (25 Nov 17:03, "ETM-10065 ... Blank filter") set the worklist column filters to AG Grid `excelMode: 'mac'` with `applyMiniFilterWhileTyping: false`. The dev comment says: typing in the search box narrows the ticked options to the matches, so Apply after a search keeps only what was found. In this mode a selection made inside a search is not kept when the search is cleared, and Apply is disabled while nothing is ticked. Commit `c6ac6044` (ETM-9231) made the search ignore letter case again on purpose.
So the question is only whether the BA agrees with this design (answer A), or wants the old behaviour back (answer B).
