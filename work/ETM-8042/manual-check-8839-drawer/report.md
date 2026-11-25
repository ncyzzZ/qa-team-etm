# ETM-8042 / 8839 Optimization Setting drawer (read-only, QA, TM)
- Step 1: histogram collapsed (step-1.png).
- Step 2: Optimize clicked; the "unsaved changes" dialog did NOT appear.
- Step 3 (waited ~10 s, step-3.png, step-3-hover-confirm.png): Confirm is DISABLED. No tooltip on hover. No validation message, no spinner, no asterisk.
  - Objective Weight: Minimize Duration 0%, Minimize Headcounts 0%, Resource Leveling 0%, Area Adjacency 0%, Schedule Stability 0% (all 0).
  - Hard Constraint: Fix Resource Capacity, Fix Maximum Duration, Work Conflicted: all unchecked.
  - Manpower Resource rows: CONCOR (Ratio 1.0, Capacity 11 disabled, Priority empty select, Weight 0%, "Soft"); ECM Scaffolder (Ratio 1.0, Capacity 1 disabled, Priority empty select, Weight 0%, "Soft").
  - Total Weight: 0%. Hint "(The total weight must equal 100.)".
- Step 4: closed with Cancel (step-4-after-cancel.png). Confirm never clicked, nothing saved.
Likely reason: Confirm is disabled because Total Weight = 0%, not 100. All weights start at 0 (no default/saved values), so this looks like normal rule + empty data, not an app bug. Open point for BA: should the drawer pre-fill defaults? Priority selects are empty (not marked required).
