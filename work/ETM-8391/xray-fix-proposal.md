# ETM-8391 - Xray step fixes (PROPOSAL, nothing written)

Needs the user's yes. Before writing, save the current steps of each Test (xray_get_test_steps) to work/ETM-8391/xray-steps-before.json.

AC 5 start state (Select All already ticked) - add "Untick Select All" before the first tick:
- ETM-8649 step 11 ("Tick only Note 1")
- ETM-8655 steps 1-2 ("tick Note 2" then "only W06")
- ETM-8656 step 5 ("Tick Select All -> the three Note options are ticked")
- ETM-8658 step 2 ("tick Note 1 and Note 2")
- ETM-8662 step 1 ("tick Valve A, B")

Order text:
- ETM-8650 step 8: symbol group must read ` - `, ` Test`, `- `, `- a`, `--`, `(Hold)`, `#Urgent` (node localeCompare('en',{numeric:true}), per audit). Step 11 and spec:573 already use localeCompare.

Not changed here: Q6 nothing-ticked wording (waits for BA, see ba-answers.md).

Letter case in the filter search box (added 25 Nov 2026):
- ETM-8656 step 1 Expected "Only Note 1, Note 2, Note 10" and step 2 "Letter case is ignored" -> live QA 25 Nov: every column filter (Job Description, Job Owner, Remark) matches letter case exactly (`note`, `w0`, `qa`, `TEST` give "No matches."; `Note`, `W0`, `QA`, `test` match). BA (DEC-040): the search box behaves like the other columns. Proposed: step 1 type `Note` -> the three Note options; step 2 type `note` -> "No matches." like the Job Description filter with `w0`. The script already checks the "like Job Description" rule and stays not PASSED (partial) until this is written. If the BA wants case to be ignored, it is a defect on all column filters, not only Remark.
