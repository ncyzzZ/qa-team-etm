# Draft comment for ETM-9225 (not posted yet; needs the user's yes)

**Retest: Passed**

The fix is verified on QA.

* Date: 25 Nov 2026, 22:14. Environment: QA (stms-qa.apps.pttep.com), FE build `main-4ZTW4UHE.js`, role Turnaround Manager.
* Test: ETM-8793 (TC-020, card ETM-8049), Playwright run 2026-11-25_221439, Test Execution ETM-8822.
* Data: work `WK-18-O` (Plan "QA ETM-8049 Old") with Deck `HELIPAD, main deck`; the old value `main deck` was set in the database (stands for data saved before ETM-8049).
* Steps: Edit Work Details, change only the Remark, Save: Deck stays `HELIPAD, main deck` (not converted, AC 6.4). Edit Work Breakdown of WK-18-O, remove the tag `main deck`, type `main deck` and press Enter (step 6), Save, read the Deck cell (step 8).
* Seen: after Enter the new tag is `Main Deck`; the saved cell is `Main Deck, HELIPAD`; `HELIPAD` is unchanged.
* Note: the Jira status was still "In Progress" when QA retested; the fix was already on the QA build.

Pictures to embed:
- work/ETM-8049/xray-evidence-2026-11-25/ETM-8793/Step_6_Type_main_deck_in_the_same_Deck_cell_and_press_Enter..png
- work/ETM-8049/xray-evidence-2026-11-25/ETM-8793/Step_8_Read_the_Deck_cell_of_WK-18..png
