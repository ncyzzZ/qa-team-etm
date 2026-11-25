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

Both first exams (ETM-9229, ETM-8877) were caught by the team's design; ETM-9229 slipped later in the script (stale rows, ai-miss M-9). Lessons L-3 and L-4 now name them, so a new run measures "with lessons". Defects the team did not design a case for are better exams: add them when found.
