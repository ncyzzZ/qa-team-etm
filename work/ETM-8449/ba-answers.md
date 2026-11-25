# ETM-8449 BA answers

| Q | Answer | Date | Source | Effect |
|---|---|---|---|---|
| F-2 (`+` box of Work Header) | Shows Platform, Work Header and Work rows (option a). Work Breakdown stays hidden. | 2026-11-24 | BA, relayed by the user in chat | ETM-8632 s5 already right. ETM-8633 s5 and ETM-8635 s7 change to P+H+W (Xray after a yes; script done). ETM-8635 s9-s10 counts now start from the step-7 count. |

Open: F-1, F-3, F-4, F-5.

## From existing Stories (self-answer check, work/SPRINT26/ba-self-answers-2026-11-24.md)

| Q | Answer | Source | Effect |
|---|---|---|---|
| F-4 dependency line, one end hidden | Line is hidden when one or both ends are hidden by a collapsed parent. | ETM-2431 AC 4.5; ETM-8449 AC 2 "as before" | ETM-8634 s3/s6: expect the line hidden (Xray after a yes; script after the current run). |
| F-3 lighter box | Partly: box is strictly `+` or `-`; disabled / lighter look not defined. | ETM-2431 AC 2, AC 3.4 | Still open. |
| F-5 JO and PLAN-20K | Partly: JO may expand/collapse, not save. Making PLAN-20K Active is a test-data decision for the user (it deactivates the event's other plan). | ETM-2431 AC 5.4; docs/modules/planning.md rules 3-4 | Ask the user. |
| F-1 speed target | Not found in any Story. | ETM-7609 AC 6.4 "[X]" | Still open for BA. |

## BA answers 2026-11-24 (work/SPRINT26/ba-answers-all-2026-11-24.md, section ETM-8449)

| Q | BA answer | Effect |
|---|---|---|
| F-1 speed target | No speed target (DEC-049). ETM-8449 is performance only; all behaviour stays exactly as before. | Remove the 15 s / 20 s pass rule from ETM-8629 s6 / ETM-8630 s8 and the script (`judgeTimes`); record the time as data; pass = no freeze + correct result. |
| F-3 lighter box | No new design; the box works as before. | No TC relies on the colour; drop the Q8 check-by-eye note. |
| F-4 dependency lines | Behave as before the change (= ETM-2431 AC 4.5: hidden when an end is hidden). | Already applied (Xray 8634 s3/s6, script). |
| F-5 Job Owner | Set the 20,000-Work plan to Active for ETM-8631, back to Inactive afterwards. | ETM-8631: add set-Active pre-step and set-Inactive clean-up (a data write: needs the user's yes; deactivates the event's other plan while Active). |

## User answers in chat (2026-11-24, after the run)

| Q | Answer (user) | Effect |
|---|---|---|
| F-1 speed | Fastest about 0.5 s or faster; when slow, not more than 20 s. | Pass rule = each time <= 20 s, time recorded (overrides "no target" for this card; DEC-049 stays for ETM-8521). Script done; Xray 8629 s6 / 8630 s8 wording waits for a yes. |
| item 2 | "Same as before." | F-2 stays as answered. F-6 (`-` Work Header) still needs a clear (a)/(b). |
| F-3 box look | Normal colour, same as before, not disabled. | Closed. |
| F-4 lines | Line disappears when an end is not shown (said before). | As applied. |
| F-5 Job Owner | The tester sets PLAN-20K Active before the test. | ETM-8631 precondition; the script skips with "precondition missing" when the Job Owner gets Access Denied. Back to Inactive after (BA). |
| F-6 `-` box | Platform box cannot switch +/- (Platform rows can never be hidden). Clicking a level's box from `-` to `+` HIDES that level's rows; `+` to `-` shows them again. | TCs 8630, 8632, 8633, 8635 were written on the wrong model (`-` = collapse the level's rows). Rewrite proposal: work/ETM-8449/tc-rewrite-F6.md. Run 2026-11-24: the app let `-` Platform be clicked (box became `+`, Work Header rows hidden) -> defect candidate against this rule. |

## User ruling 25 Nov 2026 (chat, relayed by the lead): ETM-9177

| Q | Ruling | Effect |
|---|---|---|
| F-2 / F-6 (`+` / `-` of a level) | The system is correct. Cascade as ETM-2431: `-` at a level hides that level and every level below (their boxes turn `+`); `+` at a level shows that level and the levels above only. ETM-8449 changes nothing here. BA answer F-2 (P+H+W) is wrong; the F-6 reading "lower levels keep their own box" is replaced. | ETM-9177 not a bug: deleted 25 Nov 2026 by the user. Spec 8634 s8 changed too (`+` Work Header gives P+H, then `+` Work Breakdown brings back all rows and lines). Spec: 8633 s5 expects P+H of F0, Work / Work Breakdown boxes `+`; 8635 s5 and s7 expect P+H, s7 then `+` Work Breakdown brings back N0. 8630 / 8632 unchanged (their order already fits). Xray step text of 8633 s5, 8635 s5 / s7 waits for a yes. Tell the BA that F-2 is corrected. QA check 25 Nov (manual-9177-icons/): icons match the rows. |

Xray step text updated 25 Nov 2026 (user yes in chat "แก้ step text ใน Xray ด้วย"): ETM-8633 s5, ETM-8634 s6 and s8, ETM-8635 s5 and s7 now follow the cascade; read back equal; step counts unchanged. Before text: xray-before-cascade-2026-11-25.json. ETM-8630 / ETM-8632 text already fits (no change). BA told by the user that F-2 is corrected (user, chat 25 Nov 2026).
