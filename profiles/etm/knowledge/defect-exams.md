# ETM defect exams behind design-techniques.md

The examples in `.claude/team/knowledge/design-techniques.md` that say "defect exam, 2026-11-25" came from these ETM exam cards (`evals/exams/`). Kept here so ETM can trace each rule to its exam.

| Rule in design-techniques.md (section, short) | Exam card(s) |
|---|---|
| Unsaved changes: Save disabled right after opening (Edit Data opened with Save enabled) | ETM-6886 |
| Effects and their reverse: each parent gives its own message (graph deleted, bug was the plan) | ETM-6806 |
| Strange input in EVERY free-text field (bug was in WIN#) | ETM-7860 |
| A rule changed on one screen read on every screen (Status wrong on Edit Plan) | ETM-8370 |
| Fixed-list values read in every place shown (Hot Bed export wrote `N`) | ETM-6890 |
| Only this message on the cell (extra messages piled up) | ETM-7450, ETM-7456 |
| Export / PDF / second screen holds the same rows in the same order | ETM-7272, ETM-7352, ETM-7281 |
| Shared control acts the same on each page (selected-cell style) | ETM-7294 |
