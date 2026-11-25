# Defect exams

Each folder is one real defect. It holds what the team knew before the defect (`story.md`, `analyst.md`, frozen copies), the bug in one line, and a catch signature in `exam.json`. The question: does a test designer, given only those inputs, write a test case that would catch the defect?

```
node tools/defect-exam.mjs list
node tools/defect-exam.mjs all --baseline      # score the team's original drafts (must stay 2/2)
node tools/defect-exam.mjs prepare ETM-9229    # copy inputs to .claude/team/work/EXAM-ETM-9229/, print the brief
#   then run the test-designer agent with that brief (no Jira, no Xray, no app run)
node tools/defect-exam.mjs score ETM-9229      # CAUGHT / MISSED, which TC
node --test tools/defect-exam.test.mjs
```

A TC catches the defect when, inside one `### TC-` block, every `block` word group appears and every `steps` entry matches within one step line (the heading does not count). Keep a signature narrow: the test file checks that the original draft is caught by the right TC only, and that removing that step gives MISSED.

Adding an exam: make `evals/exams/<DEFECT>/`, copy the Story's `story.md` and `analyst.md` from before the defect (they must not name the defect: `prepare` refuses), save the original draft as `baseline-draft-tc.md`, write `exam.json` like the others, and add two tests (caught by the right TC, missed without its step).

Exams come from two sources: defects of Stories the team designed (`baseline-draft-tc.md` is the team's original draft) and defects another tester found on Stories the team never designed (no baseline; inputs in `_story-<KEY>/`, shared by every exam of that Story through `run`, so one designer run serves them all). Both first exams (ETM-9229, ETM-8877) were caught by the team's design; ETM-9229 slipped later in the script (stale rows, ai-miss M-9). Lessons L-3 and L-4 now name them, so a new run measures "with lessons". Defects the team did not design a case for are better exams: add them when found.

## Runs

| Date | Exam | Result | TCs (baseline) | Note |
|---|---|---|---|---|
| 2026-11-25 | ETM-9229 | CAUGHT by TC-022 | 28 (16) | with lessons (L-3 names the defect) |
| 2026-11-25 | ETM-8877 | CAUGHT by TC-040 | 47 (23) | with lessons (L-4); first scored MISSED: the signature wanted the words "weekly Plan" in the paste step. Signature widened, two tests added. TC-040 uses vague data ("activity 1", "3 values") where the baseline named rows and values. |

| 2026-11-25 | ETM-8902 | MISSED | 28 (16, also MISSED) | only defect of our Stories found outside a designed Test. The new draft goes "to another page and back with the browser Back button", not back through the breadcrumb from the edit page. |
| 2026-11-25 | ETM-8664 | MISSED | 46 (-) | TC-033 has the exact steps but the opposite expected result ("stays enabled"): it would PASS on the bug. |
| 2026-11-25 | ETM-8666 | MISSED | 46 (-) | TC-004 has the Job Owner collapse and expand but never leaves the page. |
| 2026-11-25 | ETM-8412 | CAUGHT by TC-046 | 55 (-) | only the Edit Plan half; "collapse on the Timeline, then open Edit Plan" has no case. |
| 2026-11-25 | ETM-8429 | CAUGHT by TC-048 | 55 (-) | |
| 2026-11-25 | ETM-8430 | CAUGHT by TC-047 | 55 (-) | |
| 2026-11-25 | ETM-8497 | MISSED | 55 (-) | keyboard use was listed as "Suggestion (not in Story), not written". |

Every score above was checked by reading the draft. Three signatures were too narrow at first (ETM-8412, ETM-8429 "tab B", ETM-8430 "session B") and one too wide (ETM-8429 counted a case that expects no dialog); each fix has a test.

Saved drafts: `<DEFECT>/runs/<date>-draft-tc.md`. Re-score one with `score <DEFECT> --draft <file>`.

### Run 2 (2026-11-25, after the design-techniques rules "Unsaved changes" and "Leaving and coming back" and the test-designer rule on Expected Results the Story does not give)

| Exam | Run 1 | Run 2 | Note (checked by reading) |
|---|---|---|---|
| ETM-9229 | CAUGHT | MISSED | TC-022 searches with a filter on but never clears the search: same inputs, different result. |
| ETM-8902 | MISSED | MISSED | TC-023 still uses the browser Back only. |
| ETM-8877 | CAUGHT | CAUGHT (TC-031) | |
| ETM-8664 | MISSED | MISSED | TC-034 again expects "still enabled" after expanding back; the new rule did not change it. |
| ETM-8666 | MISSED | MISSED | the right answer is in Open questions ("assumed no warning"), not in a case step. |
| ETM-8412 | half | CAUGHT both halves | TC-012 sets the collapse on the Timeline and opens Edit Plan (the new "related screen" rule). |
| ETM-8429 | CAUGHT | CAUGHT (TC-052) | |
| ETM-8430 | CAUGHT | CAUGHT (TC-049) | |
| ETM-8497 | MISSED | MISSED | `docs/modules/shutdown-timeline.md`: keyboard-only "Not wanted" for ETM-7348 (user, 3 Nov). The designer followed a user decision; do not count this one against it. |

4/9 (3/8 without ETM-8497) against 5/9 in run 1. One run per exam is too noisy to show a rule helps; compare several runs per exam before keeping or dropping a rule.

### Reviewer step (2026-11-25)

Checks 10-12 (would the case fail on the bug, unsaved changes and leaving, assumed answers tested) were added to the normal review: none of the three reviewers used them, and no review named a missed defect.
The same checks as a separate short call (`bug-check.md`, three tables), then one designer fix round:

| Exam | Run 2 draft | After bug-check + fix | Note |
|---|---|---|---|
| ETM-8664 | MISSED | CAUGHT (TC-034) | bug-check row: "That is the buggy behaviour the case calls expected." Generic prompt. |
| ETM-8666 | MISSED | CAUGHT (TC-043) | the "assumed" Open question became a case. Generic prompt. |
| ETM-9229 | MISSED | CAUGHT (TC-032) | the prompt for this pass listed "clearing one control while another is on" and "edit page and back": leading, so weak evidence. |
| ETM-8902 | MISSED | CAUGHT (TC-028 step 3) | same leading prompt. |

Bug-check is now its own mode in `test-reviewer.md` and a step of Phase 3 in `TEAM.md`. To confirm it without a leading prompt, run it on new exams.

### New set: Equipment Mob Plan (2026-11-25), bug-check with the generic prompt of its agent mode

Stories ETM-7311 and ETM-7306, defects of another tester. Story text is the Jira changelog version before the first defect (both Stories were edited after the defects). `docs/modules/equipment-mob-plan.md` was kept from the designer: it names ETM-7936 and holds rules learned later. ETM-7920 was dropped: a later user rule (letters may be typed, then rejected) overrules its expected result. ETM-7884 was not used: the Story has no Column No. field.

| Exam | Rule in Story | Draft | After bug-check + fix | Note (checked by reading) |
|---|---|---|---|---|
| ETM-7913 | yes | CAUGHT (TC-007) | CAUGHT | |
| ETM-7915 | partly | CAUGHT (TC-010) | CAUGHT | 0.05 x 0.1 = 0.005 -> 0.01 |
| ETM-7936 | yes | MISSED | **CAUGHT (TC-017)** | bug-check: "almost any result passes" on the hedged "either ... or red" step |
| ETM-7857 | yes | CAUGHT (TC-019) | CAUGHT | |
| ETM-7801 | yes | MISSED | MISSED | TC-002 checks alignment only at the default width |
| ETM-7922 | no | MISSED | MISSED | thousands separator |
| ETM-7938 | no | MISSED | MISSED | paste inside edit mode |
| ETM-7940 | no | MISSED | MISSED | search in dropdowns |
| ETM-7947 | no | MISSED | MISSED | date picker start month |
| ETM-8073 | no | MISSED | MISSED | dropdowns in lower rows |
| ETM-7799 | no | MISSED | MISSED | plan deleted in another session |
| ETM-7886 | no | MISSED | MISSED | auto-scroll of both panels |

Rule in Story: 3/5 -> 4/5. Not in Story: 0/7 -> 0/7. Bug-check fixes wrong or hedged Expected Results; it does not invent expectations the Story does not state. Drafts grew 40 -> 51 and 35 -> 42 cases. The "not in Story" misses are general UI habits (number format, search in lists, paste at the cursor, picker start month, rows far down, panels in sync, object deleted elsewhere): a checklist of those for grids is the next candidate, measured on yet another set.

### Grid habits checklist, measured on a third set (2026-11-25)

"Grid and input habits" was written into `design-techniques.md` from the seven Equipment Mob Plan misses only, and added as check 4 of bug-check. It was then measured on Stories never used to make a rule: ETM-7902 (date input in grids, 4 defects) and ETM-7314 (Equipment Mob Plan Filter Panel, 3 defects). `equipment-mob-plan.md` was withheld for ETM-7314 again.

| Exam | Rule in Story | Draft | After bug-check + fix | Note (checked by reading) |
|---|---|---|---|---|
| ETM-8501 | yes | CAUGHT (TC-020) | CAUGHT | |
| ETM-8462 | yes | CAUGHT (TC-022) | CAUGHT | |
| ETM-8460 | implied | CAUGHT (TC-004) | CAUGHT | |
| ETM-8456 | yes | MISSED | MISSED | Tab tested only on Shutdown Logic; on Manpower Mob Plan only Enter. Gap: each commit trigger on each page. |
| ETM-7957 | yes | CAUGHT (TC-022) | CAUGHT | |
| ETM-7945 | yes | CAUGHT (TC-031) | CAUGHT | |
| ETM-7949 | no (checklist item) | MISSED | **CAUGHT, weak (TC-048)** | from check 4. Expects the plan start month; the BA wanted the earliest month in the data. Still fails on the bug (current month) unless the plan starts this month. Manual, Low. |

5/7 -> 6/7. The checklist was skipped by the designer (as before with knowledge rules) and worked only through the focused bug-check. Not changed after this set: a "each trigger on each page" rule would fit ETM-8456 only; keep it as a candidate until another set shows the same gap.

### Totals so far (fresh designer + bug-check + one fix round; ETM-8497 not counted, user decision)

| Set | Draft | After bug-check |
|---|---|---|
| Sprint 26 cards + ETM-7345/7348 (rules were made from these) | 4/8 | 8/8 (ETM-9229/8902 with a leading prompt) |
| Equipment Mob Plan ETM-7311/7306 | 3/12 | 4/12 |
| ETM-7902/7314 (never used for a rule) | 5/7 | 6/7 |
| ETM-7899/7350/7315 (never used for a rule) | 5/9 | 5/9; 8/9 with check 5 (made from this set) |

### Fourth set, never seen by the team (2026-11-25): ETM-7899, ETM-7350, ETM-7315

Stories of another tester (Dechathon); the team never designed them. Same method: fresh designer, bug-check with the generic prompt, one fix round. `equipment-mob-plan.md` withheld for ETM-7315 (holds later BA answers). ETM-7876 dropped: grid edit rule of ETM-7311, not in the Export Story.

| Exam | Rule in Story | Draft | After bug-check + fix | Note (checked by reading) |
|---|---|---|---|---|
| ETM-8433 | yes | CAUGHT (TC-008) | CAUGHT | Work Header list in Master Data order. First scored MISSED: block wanted "filter", the case says only "Expand `Work Header`". Signature widened, test added. |
| ETM-8437 | yes (AND rule) | MISSED | MISSED | TC-022 combines Work Header with Priority (expects empty body), never with Date. Near miss: the bug may not be Date-only. |
| ETM-8439 | partly | MISSED | MISSED | TC-027 adds the value on Shutdown Logic; the bug is a value created on the Worklist page. |
| ETM-8295 | yes | CAUGHT (TC-033) | CAUGHT | shorten, then extend back, note must not return. First scored MISSED ("move the End Date into an earlier week"); signature widened, test added. |
| ETM-8328 | yes | MISSED | MISSED | TC-035 (Shutdown Type) and TC-036 (Actual + Update Progress) shrink the grid but never extend it back; "note is gone" passes on the bug while the week is hidden. |
| ETM-8361 | no | MISSED | MISSED | no case checks the plan dates after Save. First scored CAUGHT by TC-034 on "End Date ... same week"; signature narrowed, test added. |
| ETM-7863 | yes | CAUGHT (TC-022) | CAUGHT | |
| ETM-7869 | partly | CAUGHT (TC-023) | CAUGHT | |
| ETM-7892 | yes | CAUGHT (TC-024) | CAUGHT | |

5/9 -> 5/9 (rule in Story: 5/7). Bug-check opened 11 / 22 / 13 rows and the fix round added 9 / 16 / 8 cases (42->51, 36->52, 37->45), none of them on the missed defects. Pattern of the misses: the case does the first half of the flow and stops ("gone" without coming back, a new value made on the same page instead of the page where users make it, AND with one other filter instead of each). Candidate rule, not added yet: for "X is removed/hidden when Y" also undo Y and check X stays removed; for "new values appear", create the value on every page that can create it. Measure on another set before adding.

Drafts and bug-checks: `_story-<KEY>/runs/2026-11-25-*`. qa-check could not read the exam path for the designers (they passed a key); not checked.

### Check 5 "Effects and their reverse" (2026-11-25), made from the fourth set

New section in `design-techniques.md` and check 5 of bug-check (`test-reviewer.md`): each trigger undone, each place that creates a value, each kind of control combined (and one that leaves nothing under a parent), untouched values after Save. Made from the misses above, so the fourth set measures "with lessons" (leading); ETM-7902 is the cross-check.

Order: first draft again -> bug-check (agents still loaded the old 4-check file: the agent definition is read when the session starts, so no table 5 was written) -> fix -> check 5 alone, rule text in the prompt -> fix.

| Exam | First run (4 checks) | Rerun 4 checks | + check 5 | Note (checked by reading) |
|---|---|---|---|---|
| ETM-8433 | CAUGHT | CAUGHT | CAUGHT | |
| ETM-8437 | MISSED | MISSED | MISSED | Date row added to the AND table, but "P1 + Date that excludes some P1 tasks": P1 keeps tasks, so the Platform row rightly stays. The "nothing left under a parent" item was not combined with Date. |
| ETM-8439 | MISSED | MISSED | **CAUGHT (TC-027 step 5)** | value created from the Worklist |
| ETM-8295 | CAUGHT | CAUGHT | CAUGHT | |
| ETM-8328 | MISSED | MISSED | **CAUGHT (TC-035 step 4, TC-036 step 6)** | Shutdown Type back / Actual typed back, note must not return. Signature widened ("back to the old", "value back"), test added. |
| ETM-8361 | MISSED | MISSED | **CAUGHT (TC-052 step 3)** | other activity dates equal the recorded ones after Save. Signature widened ("activity date", "equals the recorded"), test added. |
| ETM-8456 (cross-check) | MISSED | **CAUGHT (TC-029 step 4)** | (not fixed, already 4/4) | found by check 1 ("only Enter used") in the rerun, not by check 5: run-to-run variance of the same check. Check 5 opened 9 more rows on ETM-7902. |

Fourth set: 5/9 -> 8/9 with check 5 (leading: rule made from these misses). Cross-check ETM-7902: 4/4, but not because of check 5. Check 5 opened 6 / 6 / 9 rows and the fixes added 0 / 4 / - cases (mostly steps in existing cases). Next: measure the full 5-check bug-check in one call (new session, so the agent file is reloaded) on a set never used for a rule.

### Fifth set, never used for a rule (2026-11-25): full 5-check bug-check in one call

First run with the reloaded agent file: each reviewer wrote all five tables in one call. Stories: ETM-7900 (Shutdown Logic PDF timeframe, Dechathon), ETM-7349 (Timeline progress, Dechathon), ETM-7351 (Equipment Mob Plan paste) and ETM-7310 (Add Equipment), both found by the user by hand. None of the four was designed by the team. Story text frozen from the Jira changelog before the Story's first defect. `equipment-mob-plan.md` was withheld for ETM-7351 and ETM-7310, and `shutdown-timeline.md` for ETM-7349: they name these defects or hold later answers. Dropped: ETM-7910 (Deck 30 overrules the Story's 100), ETM-7933 (`;` and emoji blocked is a later rule, not in the Story), ETM-7859 (Cancelled), ETM-8499 (badge colour only). Only the Timeline-tab half of ETM-8403 is used: the Edit Plan text was decided again later.

| Exam | Rule in Story | Draft | After bug-check + fix | Which check found it / note (checked by reading) |
|---|---|---|---|---|
| ETM-8398 | yes | CAUGHT (TC-023) | CAUGHT | Export closes the drawer. Draft |
| ETM-8513 | yes | CAUGHT (TC-013) | CAUGHT (+TC-042 from check 5) | First scored as TC-008 only (empty day, "no task rows"). The real catch is TC-013: the setup is in the Precondition, and step 3 says "W2 is not listed". Signature widened, test added. |
| ETM-8370 | yes (enum + read-only on Edit Plan) | MISSED | MISSED | TC-005 only clicks Status on Edit Plan ("read-only"). The fix round's TC-048 step 5 compares with "the saved values" but never checks the text. Check 5 opened "Close back to Open" (TC-077), but only on the Timeline. No check asks whether a value shows the same text on every screen. |
| ETM-8403 | yes (exact text) | CAUGHT (TC-037) | CAUGHT | Draft |
| ETM-7951 | yes | CAUGHT (TC-020, TC-021) | CAUGHT | Draft |
| ETM-7979 | yes | CAUGHT (TC-022) | CAUGHT | Draft |
| ETM-7860 | partly (free text) | MISSED | MISSED | Strange input is tested only in Remark and Department (TC-011). WIN# gets only `CCU-0001`. Bug-check did not flag it either. |
| ETM-7846 | no | MISSED | MISSED | Check 4 marked "list opens in last rows after scrolling" as covered (TC-020: last row, scroll down). No step opens a popup and then scrolls sideways. |

5/8 -> 5/8 (rule in Story: 5/7). Bug-check opened 20 / 28 / 26 / 27 rows. The fix rounds added 9 / 16 / 13 / 12 cases (36->45, 62->78, 47->60, 31->43), none of them on a missed defect. Check 5 wrote rows on every Story (11 / 15 / 14 / 17) and produced real new cases (ETM-7900 TC-042 parent row back after the filter is cleared, ETM-7351 TC-059 untouched cells after Save). On this unseen set it caught nothing new: every missed defect was a display or input rule applied on one screen or field and not on the next. Pattern: the same value shown on two screens (Status text on Timeline vs Edit Plan), and the same input rule on each field (strange characters on the free-text field the Story names, not only on Remark). Candidate rule, not added: "every value shown on more than one screen is compared on each screen; strange input goes into every free-text field". Measure it on another set before adding it.

Drafts and bug-checks: `_story-<KEY>/runs/2026-11-25-*`. qa-check could not read the exam folder (it wants a card key). It was not run.

### Sixth set (2026-11-25): the two rules made from the fifth set

Rules added after the fifth set (commits c7a5e5c, 1ddc3ee): "a value shown on more than one screen is checked on every screen" (Effects and their reverse, bug-check check 5) and "strange input in every free-text field" (Grid and input habits, check 4). Measured on three Stories no exam had used: ETM-6538 (Export Gantt Table into Excel; defects found by the user while running her own Tests, not designed in this repo), ETM-6373 (Optimization Feedback panel, Dechathon), ETM-6843 (Import Work and Work Breakdown, user). Story text frozen before each Story's first defect. No module doc names these defects; nothing withheld. Bug-check agents were told to re-read the Bug-check section of `test-reviewer.md` from disk (it changed in this session). Dropped: ETM-6864 (Story says POB center-aligned and blank, the defect wants right-aligned and "-"), ETM-6881 (template file not available), ETM-6857 / 6858 (Gantt screen, other Story), ETM-7379 (Story gives the "not exist" message the defect rejects), ETM-7477 (Story says FL / Equipment Number are ignored on import), ETM-7369 (expected message not defined), ETM-7260 / 7262 (Figma look), ETM-7580 (long chain, kept for later).

| Exam | Rule in Story | Draft | After bug-check + fix | Note (checked by reading) |
|---|---|---|---|---|
| ETM-6888 | yes | CAUGHT (TC-023) | CAUGHT | full names as a table of expected values; step 2 "They equal the table". First scored MISSED (signature wanted the name in the step line); second form added, test added. |
| ETM-6889 | partly (format; value = screen implied) | CAUGHT (TC-023) | CAUGHT | precondition date `02 Jan 2025, 15:30`, BO equals it in the table. First scored CAUGHT by 5 cases: "bo" inside "both" / "bold" and "same rows"; signature tightened (word boundary, a real date-time needed), tests added. |
| ETM-6890 | yes | MISSED | MISSED | Hot Bed is read only on an empty row ("blank, not `No`"); no case exports a set Hot Bed and reads column L. |
| ETM-6871 | no (screen order) | MISSED | MISSED | TC-024 expects `Dayshift, Nightshift` (already ascending); no case compares the order with the screen. Bug-check row 111 "Gantt and file show the same value" listed screens but not this column. |
| ETM-6907 | partly | MISSED | MISSED | "Rows with SIMOP Allow, Restriction, Prohibit exist": the data is assumed, never built from the matrix. |
| ETM-7300 | yes | MISSED | MISSED | fix round TC-008 step 6 checks the reverse: setting changed after the run, panel keeps the sent one. Changed before the run is not tested. |
| ETM-7316 | partly | MISSED | **CAUGHT (TC-008 step 8)** | bug-check check 5: "Summary Schedule/Event dates vs Gantt and Event Details, no day shift". The new rule. |
| ETM-7328 | partly | CAUGHT (TC-009) | CAUGHT | |
| ETM-7565 | partly | MISSED | MISSED | first scored CAUGHT by fix-round TC-004 step 7: a failed run saved and reloaded expects the old dates, which passes on the bug. Signature narrowed, test added. Reload after a successful run + Save has no case. |
| ETM-7450 | partly | MISSED | MISSED | TC-037 loops the message matrix: "shows the message", never "only this message". |
| ETM-7456 | partly | MISSED | MISSED | same as ETM-7450. |

3/11 -> 4/11 (rule in Story: 2/3 -> 2/3). Bug-check opened 40 / 44 / 26 rows; the fix rounds added 12 / 9 / 19 cases (38->50, 31->40, 65->84). One new catch, by the new "every screen" rule through check 5 (ETM-7316). The strange-input rule was used by every designer without being asked (ETM-6538 TC-032, ETM-6373 TC-030, ETM-6843 TC-076), but no defect of this set is that kind, so it is not measured here. Misses left: an enum column read only when empty (ETM-6890), screen order of a list (ETM-6871), test data assumed instead of built through the real rule (ETM-6907), the one direction of "change then check" not tested (ETM-7300, ETM-7565), and "only this message" for one cell (ETM-7450/7456). Candidate rules, not added: "every enum column of an export is read with each of its values, not only empty"; "a message check also says no other message is shown for that cell". Measure on another set first.

### Seventh set (2026-11-25): with the two rules made from the sixth set

Rules added after the sixth set (commit 7aea1f4, check 5): "a fixed-list column is read with each of its values where it is shown" and "a message check also says no other message shows for that cell". The two fifth-set rules stay. Stories no exam had used: ETM-7984 (Shutdown Size change, user found the defects running her own Tests; `shutdown-timeline.md` withheld, it holds later notes), ETM-6844 (Export Work and Work Breakdown, Dechathon), ETM-6928 (keyboard shortcuts for editable tables, Dechathon), ETM-7321 (Daily Report PDF header colour, user). Dropped: ETM-7879 (both defects contradict the Story's alignment), ETM-7381 (console error, race), the format half of ETM-7272 and the Tab half of ETM-7294 (not in the Story). ETM-7984 had no fix round: its draft already caught all three.

| Exam | Rule in Story | Draft | After bug-check + fix | Note (checked by reading) |
|---|---|---|---|---|
| ETM-8470 | yes | CAUGHT (TC-023, TC-029) | (no fix round) | edited text kept after "a change to another size"; first scored MISSED: block wanted "Shutdown Size". Signature widened, test added. |
| ETM-8471 | yes | CAUGHT (TC-027) | (no fix round) | "shown again as the last task of the group". Same signature fix. |
| ETM-8490 | partly | CAUGHT (TC-041, TC-043) | (no fix round) | exact tooltip "and no other message": the new message rule written by the designer. |
| ETM-7272 | no (Work order = page) | MISSED | MISSED | only the hierarchy (Work then its breakdowns) is checked; first scored CAUGHT by TC-005 (column-header order); signature narrowed, test added. |
| ETM-7281 | partly | MISSED | MISSED | fix-round TC-006 step 4 checks the dropdown on the last exported row, but no case exports more than 3,000 rows. |
| ETM-7294 | no (same look on each page) | MISSED | MISSED | no case compares the selected-cell look across the four pages; first scored CAUGHT by fix-round TC-055 (panel scroll, "Look at"); signature narrowed, test added. |
| ETM-7352 | partly | MISSED | MISSED | no case checks the PDF holds every task of the page; first scored CAUGHT by a TC-010 precondition ("Key Activities"); signature narrowed, test added. |

3/7 -> 3/7 (rule in Story: 3/3 + partly 1/3). Bug-check opened 27 / 26 / 31 / 23 rows; the fix rounds added 3 / 16 / 7 cases (34->37, 43->59, 24->31). The designers used every new rule without being asked: fixed-list values (ETM-6844 TC-015 and TC-018, ETM-6928 TC-058), "no other message" (ETM-7984 TC-041, ETM-6844 TC-006), strange input in every field, values on every screen. None of the four misses is one of those kinds. Every miss is the "same on every screen" idea applied to something that is not a single value: the order of a list (ETM-7272), the full content of an export (ETM-7352), the look of a control on each page (ETM-7294), and a size limit (ETM-7281). Candidate rule, not added: "an export or second screen shows the same rows, in the same order, as the source screen; a control shared by several pages looks and acts the same on each". Four signatures were too wide at first and one too narrow; every score here was read by hand.

### Eighth set (2026-11-25): with the rule made from the seventh set

Rule added after the seventh set (commit cc040d7, check 5): "an export or second screen holds the same rows in the same order as its source, with data past any page or batch size; a control shared by several pages is compared across those pages". Stories no exam had used: ETM-6394 (POB Chart Edit Data, user), ETM-6379 (POB Chart display, Dechathon), ETM-6506 (Export Error Excel, Dechathon). ETM-7287 (Daily Report filter) was built and dropped after its draft: its defect ETM-7787 expects a Job Owner to Save, but the team rule (CLAUDE.md) says Job Owner is view only, and the designer rightly expected Save hidden for JO. ETM-6506 had no fix round (draft already caught its exam). Dropped before: ETM-6794 (scroll jitter, look only).

| Exam | Rule in Story | Draft | After bug-check + fix | Note (checked by reading) |
|---|---|---|---|---|
| ETM-6770 | yes | CAUGHT (TC-013) | CAUGHT | two graphs named `Graph A` saved, no duplicate message. |
| ETM-6886 | partly (dirty state) | MISSED | MISSED | draft TC-028 expects Save enabled on open with a Name (the bug). Fix-round TC-027 step 1 only "writes the Save state down"; first scored CAUGHT on its "(a user expects Save disabled)" note; signature narrowed, test added. |
| ETM-6806 | no (grid habit) | MISSED | MISSED | fix-round TC-045: another user deletes the graph; the defect is the plan / Manpower Mob Plan deleted. |
| ETM-6913 | no (second screen order) | MISSED | MISSED | no case duplicates the plan; duplication is another Story's action, so the new rule had no "second screen" to point at. |
| ETM-7366 | yes | CAUGHT (TC-008) | (no fix round) | Details and How to fix show `-` when empty. |

2/5 -> 2/5. Bug-check opened 24 / 35 rows; fix rounds added 13 / 17 cases (40->53, 45->62). The new rule was used (ETM-6506 TC-003 "same rows as the panel in the same order", 1 / 1,000 / 5,000 rows in TC-017; ETM-6394 TC-052 legend and table in the same order), but no defect of this set is that kind. The misses: a Save state the Story half-states (disabled only for blank Name) where the designer wrote the bug as expected and the fix round hedged ("written down"); "someone else deletes" applied to the nearest object (the graph), not to the parent (the plan); and an action from another Story (duplicate plan) that copies this Story's data. Candidate rules, not added: "Save disabled until a change is the default; a case never expects Save enabled on open"; "someone else deletes the object and each parent of it (graph, plan, event)".

### Totals (fresh designer + bug-check + one fix round)

| Set | Draft | After bug-check |
|---|---|---|
| Sprint 26 cards + ETM-7345/7348 (rules were made from these) | 4/8 | 8/8 (ETM-9229/8902 with a leading prompt) |
| Equipment Mob Plan ETM-7311/7306 | 3/12 | 4/12 |
| ETM-7902/7314 (never used for a rule) | 5/7 | 6/7 |
| ETM-7899/7350/7315 (never used for a rule) | 5/9 | 5/9; 8/9 with check 5 (made from this set) |
| ETM-7900/7349/7351/7310 (never used for a rule, 5 checks in one call) | 5/8 | 5/8 |
| ETM-6538/6373/6843 (never used for a rule; with the two rules from the 5th set) | 3/11 | 4/11 |
| ETM-7984/6844/6928/7321 (never used for a rule; with the two rules from the 6th set) | 3/7 | 3/7 |
| ETM-6394/6379/6506 (never used for a rule; with the rule from the 7th set) | 2/5 | 2/5 |
| All unseen sets (3rd, 4th first run, 5th to 8th) | 23/47 | 25/47 |

### Manpower Mob Plan set with Playwright's planner (2026-11-25): ETM-5614, ETM-5615, ETM-6378

Question: does a planner agent that walks the real screen first (Playwright `init-agents` planner, ETM rules, READ ONLY on QA)
help the designer catch more? Steps: fresh designer draft from the frozen Story -> planner walks Manpower Mob Plan on QA
(TM and JO, 43 min, 100 tool calls, about 250k tokens) and writes one plan per Story -> the designer revises its draft with
the plan (the Story stays the source of every Expected Result; screen differences become Open questions). Every score read by hand.

| Defect | Story | First draft | After planner | Note |
|---|---|---|---|---|
| ETM-6366 collapse Reservation keeps Booking No. | 5614 | CAUGHT (TC-006 s4) | CAUGHT | signature took "chevron" after reading |
| ETM-6852 "No people assigned." | 5614 | CAUGHT (TC-026) | CAUGHT | signature block widened after reading |
| ETM-6634 options sorted upper case first | 5615 | CAUGHT (TC-015 s7) | CAUGHT | Filter Panel called "the Panel" |
| ETM-6664 zero rows message | 5615 | CAUGHT (TC-022) | CAUGHT | |
| ETM-6666 date picker opens on current month | 5615 | MISSED (TC-009 "a calendar opens") | CAUGHT (TC-018 s2) | **leak**: QA has the fix, the planner saw "opens on the plan's month" and the designer copied it |
| ETM-6765 table dates under chart dates | 6378 | CAUGHT (TC-012) | CAUGHT | |
| ETM-6772 Add Data enabled at 10 graphs | 6378 | MISSED (expects "stays enabled") | MISSED | no plan on QA had 10 graphs |
| ETM-6774 tooltip cut off with many graphs | 6378 | MISSED | MISSED | TC-027 tooltip added, but with one graph |

**5/8 -> 6/8, or 5/8 -> 5/8 without the leaked catch.** The planner cannot show what QA data does not have (10 graphs, many
graphs ticked), and on a fixed build it shows the fixed behaviour, so on old defects it can only leak, not prove. What it did
bring: 12+ "differs from Story" points on today's QA that the Story-only drafts could not see (groups open collapsed, no zero-result
message, JO sees no Add Data but page Save enabled by a filter, picker format dd/MM/yyyy and no range limit, chart and schedule
2 px / different widths). Those are review findings for the current build, not exam catches.
Run note: the ETM-5615 draft folder was re-created by a `prepare` before the fix round, so its "after planner" draft was
written new from the Story and the plan (37 cases) instead of revised; the first draft is in `runs/2026-11-25-draft-tc.md`.
