> **25 Nov 2026: superseded in part.** User ruling: the cascade of ETM-2431 is correct (`-` at a level also turns every lower box to `+`; `+` shows that level and the levels above only). The 8632 / 8630 sequences below still fit. For 8633 s5 and 8635 s5 / s7 the expected result is P+H (not F0 / N0); 8635 s7 then clicks `+` Work Breakdown to bring back N0. See ba-answers.md (ruling 25 Nov).

# ETM-8449 TC rewrite after F-6 (2026-11-24)

Rule (user): box `-` = that level's rows are shown; click `-` -> the level's rows are hidden (rows below it too, their parent is hidden), box `+`; click `+` -> the level's rows are shown again, box `-`. Platform box never switches (Platform rows cannot be hidden). Lower levels keep their own box state.
P/H/W/B = rows per level, N0 = all. Start: all shown, every box `-`.

## ETM-8632 (13 steps, same count)
| # | Action | Expected |
|---|---|---|
| 1 | Open PLAN-20K, count rows by level | All shown; P, H, W, B, N0 written down |
| 2 | Open Custom View panel | 4 levels; every box `-` (S0) |
| 3 | Click the box of `Platform` | Nothing changes: count N0, Platform box stays `-` (cannot switch) |
| 4 | Click `-` of `Work Breakdown` | Work Breakdown rows hidden; count P+H+W; box `+` |
| 5 | Click `-` of `Work` | Work rows hidden; count P+H; box `+` |
| 6 | Click `-` of `Work Header` | Work Header rows hidden; count P; box `+` |
| 7 | Click `+` of `Work Header` | Work Header rows shown; Work still hidden (its box `+`); count P+H |
| 8 | Click `+` of `Work` | Work rows shown; count P+H+W |
| 9 | Click `+` of `Work Breakdown` | count N0; row order equals step 1; every box `-` |
| 10-13 | unchanged (row arrow does not change boxes; 30 s; reopen panel) | unchanged |

## ETM-8630 (timing, 9 steps)
A1 click Platform box (no change, not timed: expect no change) -> replaced by A1 `-` Work Breakdown; A2 `-` Work; A3 `-` Work Header (count P); A4 `+` Work Header (P+H); A5 `+` Work (P+H+W); A6 `+` Work Breakdown (N0). Step 8: every time 20 s or less, times recorded.

## ETM-8633 (filter, 5 steps)
s4 `-` of Work Header -> only the filtered Platform row(s) (F0 Platform count); s5 `+` of Work Header -> back to F0 (Work and Work Breakdown boxes still `-`).

## ETM-8635 (rapid clicks, 10 steps)
s4 `-` of Work Header -> only Platform rows (P); s5 `+` within 1 s -> N0 again; s6 `-` within 1 s -> P; s7 `+` once -> N0 and the row order equals step 1; s9-s10 counts from N0.

## Open point (conflicts with F-2)
F-2 said `+` of Work Header shows Platform, Work Header **and Work**. Under this rule it shows Work rows only if the Work box is `-`. In 8632 s7 the Work box is `+`, so the proposal expects P+H. In 8633 / 8635 the Work box is `-`, so all rows come back.

## Defect candidate
Run 2026-11-24 (8632 s3): the Platform box could be clicked: it switched to `+` and the Work Header rows were hidden. Rule: Platform box never switches.
