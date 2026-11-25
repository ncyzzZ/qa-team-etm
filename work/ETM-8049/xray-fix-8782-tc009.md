# ETM-8782 (TC-009): Xray step change to match the app

Reason: user chose "แก้ TC ตามแอป" (24 Nov 2026). What the app does, checked in Chrome on 24 Nov 2026, Plan "QA ETM-8049 Any":
- Pressing Enter on a search clears every column filter (Deck and Job Description alike): existing table behaviour.
- A column filter set after a search works together with the search, and the URL keeps both.
- After a search, a filter lists only the values of the rows the search shows.
- Clearing the search box and pressing Enter leaves the old keyword in the URL, so the script no longer clears the search box.

Steps 1-8 stay as they are. Old steps 9-14 are replaced by the new steps 9-15 below. Old steps 15-16 (the empty worklist) become steps 16-17 with no text change. The script already follows this, and the G6 gate passed with 0 errors.

| # | Action | Expected result |
|---|---|---|
| 9 | Open the Deck filter and select `Cellar Deck` and `Helideck`. | `WK-2` and `WK-3` are shown. |
| 10 | Open the Y filter and select `B`. | Only `WK-2` is shown, so the filters of different columns work together. |
| 11 | Click Reset Table Filter. | `WK-1`, `WK-2` and `WK-3` are all shown. |
| 12 | Type `WK-2` in the search box above the table and press Enter. | Only `WK-2` is shown. |
| 13 | Open the Deck filter. | The options are only the Deck values of `WK-2`: `Main Deck`, `Cellar Deck`. |
| 14 | Select only `Cellar Deck` and click Apply. | `WK-2` is still shown, and the search and the Deck filter work together. |
| 15 | Type `WK-3` in the search box and press Enter. | Only `WK-3` is shown and the Deck filter is cleared: a new search clears the column filters (existing table behaviour). |

Before the change: the steps were read on 24 Nov 2026 with xray_get_test_steps ETM-8782 (16 steps). The old steps 9-14 were: search WK-2, Deck Helideck gives no rows, add Cellar Deck gives WK-2, clear the search gives WK-2 and WK-3, Y B gives WK-2, clear every filter gives all.
