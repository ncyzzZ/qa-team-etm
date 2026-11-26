# DROPPED (25 Nov 2026 20:15): NOT a defect. Probe B (run 2026-11-25_201250, Plan Case, no search text typed) shows the filter is exact: ticking only `main deck` sends `main deck` and shows only WK-6b-K. TC-010 failed because the helper onlyTick typed the value in the filter search box, which in the evening build changes the ticks; after the helper fix ETM-8783 passed (run 2026-11-25_201353). Kept for the record only.
# ON HOLD, NOT LOGGED (25 Nov 2026 20:10). User verdict "2=app" for ETM-8783 stands, but this draft's description is WRONG and must not be logged as is.
# The blind evidence check (not-proven) was right: in the earlier probes the untick of Select All did not take. Probe run 2026-11-25_200629 (no text typed in the filter search):
#  - after unticking Select All: Select All = partly, `Dock Area` and `DOCK AREA` both STILL ticked (every other option unticked);
#  - one click on `Dock Area` unticks only `Dock Area`; `DOCK AREA` stays ticked (correct);
#  - Apply sends `DOCK AREA` only and shows only WK-P2 (correct for what is ticked).
# So the oddity seen is "Select All untick leaves the case-variant pair ticked" (and with a search text typed the pair is re-ticked). It does NOT fully explain
# TC-010: there the helper reached Select All = none before ticking `main deck`, and `Main Deck` works were still shown. Cause not known yet.
# Next: check by hand in Chrome on Plan "QA ETM-8049 Case" (untick Select All, tick `main deck`, look at the ticks and the URL after Apply), then rewrite this draft.


**Summary:** [ETM-8049] Worklist Deck filter: ticking one option also ticks the option that differs only by letter case ("Dock Area" ticks "DOCK AREA"), so both are filtered

**Opening:**
On the Worklist, the Working Location (Deck) filter lists values that differ only by letter case as separate options, as AC 3.6 asks. But when the user ticks one of them, the other spelling is ticked too, and after Apply the table shows the works of both spellings. On the QA build of the afternoon of 25 Nov 2026 only the exact spelling was filtered (Xray ETM-8783 TC-010 passed). It fails on the evening build `main-A7CDL4M2.js`, after the fix of ETM-9231 (filter search box ignores case), so the filter may now compare option keys without letter case.

**Environment:** QA (https://stms-qa.apps.pttep.com), 25 Nov 2026 evening, FE build `main-A7CDL4M2.js`, user Turnaround Manager. Event NN TEST QA, Plan "QA ETM-8049 Scratch" (data made in the UI). Playwright run 2026-11-25_200103 (UI-made data, pictures below; same result in runs 195128 and 195537); Xray ETM-8783 TC-010 failed the same way in run 2026-11-25_192944 and passed in run 2026-11-25_155213 (afternoon build).

### Step to Reproduce
1. Open the Worklist of Plan "QA ETM-8049 Scratch". Click `Create Work` > `Manual Create` and create work `WK-P1` with Working Location (Deck) `Dock Area` (free text, not in Master Data), X `1`, Y `A`.
2. Create a second work `WK-P2` the same way with Deck `DOCK AREA`.
3. In the search box above the table type the number part the two works share and press Enter, so only `WK-P1` and `WK-P2` are shown.
4. Open the filter of the Working Location (Deck) column, untick `Select All`, and type `dock` in the filter search box. Both `Dock Area` and `DOCK AREA` are listed, both unticked.
5. Click the checkbox of `Dock Area` only.
6. Click `Apply`.

### Actual Result
- Step 5: one click ticks both `Dock Area` and `DOCK AREA`.
- Step 6: the filter is sent with both values (URL `wsWorkingLocationDecks=Dock Area,DOCK AREA`) and the table shows both `WK-P1` and `WK-P2`.

Pictures (full viewport, Plan "QA ETM-8049 Scratch", Playwright run 2026-11-25_200103):
- work/ETM-8049/defect-8783-pics/probe-1.png (steps 1-2: the two works made in the UI)
- work/ETM-8049/defect-8783-pics/probe-2.png (the Deck filter lists `Dock Area` and `DOCK AREA` as two options)
- work/ETM-8049/defect-8783-pics/probe-3.png (step 3: only WK-P1 and WK-P2 are shown)
- work/ETM-8049/defect-8783-pics/probe-4a.png (step 4: Select All unticked, search `dock`: both options unticked)
- work/ETM-8049/defect-8783-pics/probe-4b.png (step 5: right after clicking only `Dock Area`: both options are ticked)
- work/ETM-8049/defect-8783-pics/probe-4c.png (step 6: after Apply both works are shown)
- work/ETM-8049/defect-8783-pics/3-afternoon-select-main-deck-only-WK-6b-K.png (earlier behaviour only, other Plan: afternoon build, Plan "QA ETM-8049 Case", selecting `main deck` showed only the exact spelling)

### Expected Result
- Step 5: only `Dock Area` is ticked; `DOCK AREA` stays unticked.
- Step 6: only `WK-P1` is shown. Each spelling is its own option and selecting one matches that exact spelling (ETM-8049 AC 3.6; Xray ETM-8783 TC-010 step 3).
- The search box inside the filter popup still ignores case (ETM-9231): typing `dock` lists both options. That part is fine.

**Note on data:** the example uses only values a user can enter in the UI (free text in Create Work, one value per work). The afternoon picture uses `main deck`, which was set in the database as old data; it only shows the earlier behaviour.

**Links:** Story ETM-8049. Test ETM-8783 (step 3) in Test Execution ETM-8822. Related: ETM-9231 (filter search box letter case, Ready for UAT): the change for it may be the cause.
