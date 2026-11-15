# Planning

Module: Shutdown Event > tab Planning of ETM (PTTEP EP-Turnaround Management). It lists Plan Cards (one per plan) with 5 item rows; plans are created, duplicated, activated and deactivated here.

| Card | Feature | Last status date |
| --- | --- | --- |
| ETM-6845 | Planning Tab - Equipment Mob Plan Item View & Activation (Tests ETM-7637..7646, Test Execution ETM-7647) | 22-27 Oct 2026 |
| ETM-6846 | Planning Tab - Duplicate Plan with Equipment Mob Plan Item (Tests ETM-7816..7822, Test Execution ETM-7823) | 30 Oct 2026 |
| ETM-5386 | Generic Duplicate Plan (only quoted in ETM-6846 notes, no status file here) | 30 Oct 2026 |

Rule: every line ends with its source: (ETM-nnnn, date).
Already in the repo, not repeated here: `planning-confirmation-result.md` (toasts/modals of create, duplicate, delete, activate), `equipment-mob-plan-figma.md` and `equipment-mob-plan.md` (Equipment Mob Plan page), `core-navigation-worklist.md` (old "Planning tab" section).

## Navigation and screen facts
- Plan Card header: green = Active, dark blue (`bg-[#004166]`) = Inactive; plan toggle, three-dot menu. (ETM-6845, 22 Oct 2026; checked on QA)
- Item rows in a card: `Worklist`, `Shutdown Logic`, `Manpower Mob Plan`, `Equipment Mob Plan`, `Daily Report`; each has its own toggle. (ETM-6845, 22 Oct 2026)
- Selectors: card `app-plan-card`, row `app-plan-item-card`, toggle `.ant-switch` (on = class `ant-switch-checked`, no aria-checked), row menu `app-plan-item-trailing button.ant-btn:not(:has-text("Create"))`. (ETM-6845, 22 Oct 2026)
- Plan three-dot menu: `Edit Plan`, `Duplicate Plan`, `Delete Plan`. Duplicate modal title `Create Plan`: Plan Name (0/50, required), Description (0/200), Cancel, Save; Save greyed while Plan Name is empty. (ETM-6846 draft v3, 26 Oct 2026)
- While duplicating, the new card shows a spinner with `Duplicate plan in progress.` and no item rows. (ETM-6846 draft v3, 26 Oct 2026)
- Plan response fields: plan `planLastUpdated`, `equipmentMob.lastUpdated`, `equipmentMob.isCreate`, `equipmentMob.isActiveStatus`. (ETM-6845, 27 Oct 2026)
- Equipment Mob Plan page opens in a NEW tab (no browser Back); leave by clicking the event name in the breadcrumb; with unsaved edits pop-up `Unsaved Change` with `Discard Change` / `Continue Editing`. (ETM-6845, 27 Oct 2026)
- Equipment Mob Plan row not created: `Create` button instead of date/toggle/menu. (ETM-6846 draft v3, 26 Oct 2026)

## Confirmed rules
1. Only ONE Plan can be Active per event. (planning-plan-activation-rules, 22 Oct 2026, confirmed by: user)
2. Item toggles work only while their Plan is Active; in an Inactive Plan every item toggle is disabled (`ant-switch-disabled`). Assert disabled, do not click. (planning-plan-activation-rules, 22 Oct 2026, confirmed by: user)
3. Turn a Plan ON while another is Active: pop-up `Change Active Plan` "Do you want to make plan '<new>' active and set plan '<old>' to inactive?" [Cancel] [Confirm]; after Confirm new = Active, old = Inactive. (planning-plan-activation-rules, 22 Oct 2026, confirmed by: user)
4. Turn a Plan OFF: pop-up `Inactive Plan` "Inactive this plan will automatically inactive all items within the plan. Are you sure you want to continue?" [Cancel] [Confirm]; after Confirm Plan and ALL its items are Inactive and their "Last update on" changes. (planning-plan-activation-rules, 22 Oct 2026, confirmed by: user)
5. Turning a Plan back ON does NOT turn its items back on; each item is turned on by hand. (planning-plan-activation-rules, 22 Oct 2026, confirmed by: user)
6. Toast after a successful plan change: `Edit Success - Edit Plan Successfully.` (planning-plan-activation-rules, 22 Oct 2026, confirmed by: user)
7. Job Owner sees the Plan card and all 5 rows but NO toggle at all (not disabled, none); by design. (ETM-6845, 22 Oct 2026, confirmed by: user)
8. An Equipment Mob Plan needs a Worklist (not a Shutdown Logic); plan `emptiey` (no Shutdown Logic) shows `Create` on its Equipment Mob Plan row. Not a defect. (ETM-6845, 22 Oct 2026, confirmed by: user)
9. Delete Equipment Mob Plan on Planning tab: pop-up "Are you sure you want to delete the selected equipment mob plan?" (Cancel/Delete), then toast. (ETM-6845, 22 Oct 2026, confirmed by: user)
10. Offline Save on Equipment Mob Plan: app shows `Network Error / No internet connection. Please check your network.`; the user then told the team to follow the validation sheet (`Save Failed`), so this is a defect (ETM-7849). (ETM-6845, 27 Oct 2026, confirmed by: user)
11. Pop-up text is `Change you made will not be saved.` (no "s"); the sheet was corrected. (ETM-6845, 27 Oct 2026, confirmed by: user)
12. Export is grey while there are unsaved changes (covered by another card). (ETM-6845, 27 Oct 2026, confirmed by: user)
13. Duplicate: copy = identical to the source in everything, only Inactive; plan and its items start Inactive. (ETM-6846 draft v3, 26 Oct 2026, confirmed by: user)
14. Only Turnaround Manager can duplicate; Job Owner has no Duplicate Plan. The `Create` button of an uncreated Equipment Mob Plan is enabled only for Turnaround Manager, other roles see it disabled. (ETM-6846 draft v3, 26 Oct 2026, confirmed by: user)
15. Duplicate Last update uses Thailand time. Modal title `Create Plan` and spinner text `Duplicate plan in progress.` are correct as written. (ETM-6846 draft v3, 26 Oct 2026, confirmed by: user)
16. Failed duplicate: toast `Duplicate Failed` / `Duplicate Plan Failed` and the failed copy keeps nothing; status copied as the source has it; no daily required mobilization and no booking reference; No. fields (e.g. WIN# No.) may repeat. (ETM-6846 draft v3, 26 Oct 2026, confirmed by: BA) See Open points for the toast conflict.
18. A new Equipment Mob Plan (and the copy) holds the 7 baseline Work Headers, with no equipment: `Mechanical (PM)`, `Mechanical (CM)`, `Valve Greasing`, `Inspection - GVI`, `Modification`, `Operation`, `Other`. (ETM-6846, 30 Oct 2026, checked on QA)
19. Job Owner sees only the ACTIVE plan and only the Equipment Mob Plan row, with no plan three-dot menu. (ETM-6846, 30 Oct 2026, checked on QA)
20. Active plan is pinned on top of the list; copy collapsed/expanded state follows the source as persisted; No. is a continuous running number (deleting an item shifts numbers). (ETM-6846, 30 Oct 2026, checked on QA)
21. An empty Work Header is not stored by Save. (ETM-6846, 29 Oct 2026, checked on QA)

## Where the card text and the real system differ
- ETM-6846 TC said "card at the top"; AC (6846, 5386) says nothing about position. Decision: wording "appears in the list". (ETM-6846, 30 Oct 2026)
- ETM-7819 steps 4/7: copy shows the 7 baseline headers with `No equipment added.`, not empty. Decision: TC and script check that. (ETM-6846, 30 Oct 2026)
- Job Owner: AC 5.2 only says Duplicate Plan hidden; no plan menu at all is fine. Decision: TC wording, not a defect. (ETM-6846, 30 Oct 2026)
- Failure toast: ETM-5386 AC 6.1.1 and ETM-6846 AC 4.4 say in-process failure = inline failure in the card, NO toast; toast only for pre-process failure (5386 AC 2.4, no placeholder card). Newest (30 Oct) wins over BA toast answer (26 Oct): ETM-7821 reworded, manual. (ETM-7821, 30 Oct 2026)
- Defect candidate ETM-7308 (Edit Work Header): renaming a baseline Work Header (e.g. `Mechanical (PM)`) is lost after Save + reload; a hand-added header rename is kept. AC 4.1 has no baseline exception. NOT logged. (ETM-6846, 30 Oct 2026)
- ETM-7849: offline Save shows `Network Error` instead of `Save Failed` (logged, ETM-7646 FAILED). (ETM-6845, 27 Oct 2026)
- Sheet vs app: `Changes you made` vs `Change you made`; user chose the app text. Success toast has trailing dot `Save Equipment Mob Plan Successfully.` (sheet none). (ETM-6845, 27 Oct 2026)
- Old UI map (`core-navigation-worklist.md`, 27 Aug 2026) lists 3 rows in a card; the newer sources (22 Oct) list 5. Newest wins.

## QA test data
- ETM-6845: `eND50` (Alpha, Active, all items on), `7340 - Del` (Beta, Inactive), `mm 29` (Delta, Inactive; ETM-7645 deletes its Equipment Mob Plan, press Create to restore), `emptiey` (Epsilon). Gamma `Paste Test ETM-6876` is in event NN TEST QA (`9885b03f-17ab-4ff5-a725-6d841259ff1a`); ETM-7642 uses `Man-Dup` there. Only Alpha may end Active; scripts that turn a Plan off must restore it (Plan ON with Confirm and all items ON). (ETM-6845, 27 Oct 2026)
- ETM-6846: event ART PSD (`6580f57b`). Plan A `QA EMP Dup A` (Active, 20 equipment items, WIN# `TRQ-HYD-500` repeats); Plan B `QA EMP Dup B` (Equipment Mob Plan not created); `QA EMP Del A` Inactive, used by ETM-7315. Before every run check no `QA EMP Dup 01/04/05` is left. (ETM-6846, 30 Oct 2026)
- Plan: own event `QA ETM-6846 Dup` with `QA EMP Dup A`/`B`, because only one Plan Active per event and Duplicate Plan cannot copy across events; setup script written, not run. (ETM-6846, 30 Oct 2026)
- Don't run in parallel with others on the same plan: a concurrent change failed ETM-7642 once. (ETM-6845, 27 Oct 2026)

## Open points
- Failure toast of duplicate: BA said toast `Duplicate Failed`; AC says no toast for in-process failure. Ask BA before the manual ETM-7821 run. (ETM-6846, 30 Oct 2026)
- Whether renaming a baseline Work Header should persist (ETM-7308): waits for BA; defect not logged.
- ETM-7818, ETM-7822 TO DO; Job Owner steps (ETM-7822, ETM-7819 step 3) not tested; security spec never run; ETM-7820/7821 manual.
- A plan without a created Equipment Mob Plan is copied uncreated: only in TC draft v3 (TC-004), no decision line says confirmed. (ETM-6846, 26 Oct 2026)
- Tests that turn Plans on/off (ETM-7639, 7641, 7643+) may need the pop-up wording check; ETM-7645 description in Xray still names event ART PSD / `QA EMP Del A`.
- Add Equipment cannot be filled by script since 29 Oct (no data-item-key). (ETM-6846, 30 Oct 2026)

## Sources
`claude\planning-plan-activation-rules.md`, `claude\etm-6845-status.md`, `claude\etm-6846-status.md`, `claude\etm-6846-tc-draft.md` (v3; `etm-6846-tc-draft-v3-grouped.md` does not exist), `claude\etm-6846-tc-draft-v2-ungrouped.md`; headings of the 4 repo files above.
