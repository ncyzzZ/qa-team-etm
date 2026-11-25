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
