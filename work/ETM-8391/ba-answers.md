# ETM-8391 - BA answers and open rules (2026-11-24)

Source of the answers below: DEC-040 (BA answers of 2026-11-17, as noted in the session). The original BA text was not saved; this file is the place to keep it from now on.

## Recorded
- Sort: symbols < digits < English letters (not case sensitive, lowercase first) < Thai; `Item 9` < `Item 10`.
- Search box and "nothing ticked" behave like the other columns.
- Options come from all works of the worklist.
- AC 5: old text filter and URL parameter are cleared; the Remark filter starts at Select All.

## Q6 "nothing ticked" - ANSWERED by BA (24 Nov 2026)
Source: work/SPRINT26/ba-answers-all-2026-11-24.md, section "Audit items" (text ends with "Please confirm", so keep it as to-confirm in the Story).
Answer: the Remark filter follows the other checkbox columns (ETM-434 AC 5, BR-WL-007). With nothing ticked (Select All unticked) the result is **no works**, the same as Job Description. QA scripts that expect "all works" must change.
This matches the live QA behaviour (No results found, Total 0) and the earlier choice of "same as the Job Description reference".

### TC / script changes
| Test | Item | Status |
|---|---|---|
| ETM-8649 | step 12 result: "same rows as Job Description with nothing ticked" -> sharpen to "no works (No results found)" | Xray reworded 24 Nov to "same as Job Description"; sharpen = new Xray write, needs yes. spec:110 already compares Total with Job Description |
| ETM-8655 | step 3 same; steps 11, 16, 22 already "same as Job Description reference" | step 3 reworded 24 Nov; spec:299 compares with the reference. Sharpen to "no works" = new Xray write |
| ETM-8656 | step 11 (search "zzzz" then Select All): not a nothing-ticked case; spec:367 now strict | script done, not re-run OK |
| ETM-8658 | no nothing-ticked step; only the AC 5 start-state fix | Xray done 24 Nov |
| ETM-8662 | no nothing-ticked step; AC 5 start-state fix | Xray done 24 Nov |
| ETM-8650 | not Q6 (order, defect ETM-8896) | - |
Optional hardening for script: also assert Total Results = 0 and "No results found" in 8649 step 12 / 8655 step 3, not only equality with Job Description.

## Not applicable / decision needed
- ETM-8648: ETM has only the TM and JO roles (memory: project-etm-roles-tm-jo), so a user without View Worklist may not exist. Decide: not applicable, or ask for a test user.
- ETM-8663: pre-release state cannot be created on QA; old key names are guessed. Ask dev for the real old address keys, or mark manual.
