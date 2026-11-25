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
| ETM-7899/7350/7315 (never used for a rule) | 5/9 | 5/9 |

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
