# ETM-8391 - tests that need a person's look (25 Nov 2026)

The script ran every step of these tests and every measured check passed. Each stays "Not proven" only for the part named below, which a script cannot judge. Answer per test in one reply, e.g. `8650=pass 8651=pass 8654=pass 8657=fail 8663=manual 8648=na`.
A `pass` becomes PASSED in Xray (8650 is FAILED now, from defect ETM-8896, which is Ready for UAT). Nothing is pushed before your answer.

Evidence reports (open in the browser; step pictures inside):
- R1 = `ep-etm-fe-qa/output/runs/2026-11-25_192950_ETM-8391/evidence-report-ETM-8391-20261125-192950.html` (8650, 8651, 8657, 8663)
- R2 = `ep-etm-fe-qa/output/runs/2026-11-25_195104_ETM-8391/evidence-report-ETM-8391-20261125-195104.html` (8654)
Step pictures also in `ep-etm-fe-qa/output/evidence/<TEST>/`.

| Test | Script proved (all steps ran, all checks passed) | Left for a person | Where to look |
|---|---|---|---|
| ETM-8650 | `-` first and only once; Note 1, Note 2, Note 10 order; symbols, digits, A-Z, Thai order (ETM-8896 fixed); long option cut with ellipsis on one line, hover text = full value | Does the hover text box LOOK right (readable, not cut) | R1, ETM-8650 steps 13 and 16 |
| ETM-8651 | Empty, spaces-only and `-` Remarks are one `-` option; a work saved with no Remark joins `-`; same in worklists A, B, C | Step 4 "keep Remark empty on Create Work": the form has **no Remark field**, so the script could not read it. The work is saved without a Remark and shows under `-` (step 6). Accept as pass, or reword step 4 ("the form has no Remark field") | R1, ETM-8651 steps 4 to 6 |
| ETM-8654 | The 60+ option list scrolls inside the panel, page behind does not move, Remark 060 last and can be ticked; W17 cell has ellipsis; hover text = full 200 characters, also after the filter was opened | Does the hover text box LOOK right | R2, ETM-8654 steps 5 to 7 |
| ETM-8657 | Fonts, colours, sizes, spacing, checkbox and search box of the Remark panel equal the Job Description panel | Do the two panels look the same to you | R1, ETM-8657 steps 1 to 3 |
| ETM-8663 | Old Remark keys (`wsRemarkType` / `wsRemarkValue`) in the address, in the `#` part and as an old query link, are dropped: the Remark filter starts at Select All, Job Owner kept, table not filtered by the old text | The real pre-release saved state cannot be made any more; the old state is rebuilt as an old-format address. Accept this as proof (pass), or mark manual / not applicable | R1, ETM-8663 steps 3 to 9 |
| ETM-8648 | not run | Needs a QA login WITHOUT View Worklist. ETM has only TM and JO (both can view the worklist), so no such user exists. Mark not applicable (stays TO DO with a comment), or the BA names a user | - |
