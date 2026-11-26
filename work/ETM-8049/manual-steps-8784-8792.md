# ETM-8049 manual steps: ETM-8784 (TC-011) and ETM-8792 (TC-019)

Test Execution ETM-8822. Both Tests are TO DO in Xray. Scripts already prove most steps; a person is needed for the parts below.
- ETM-8784: the file is read by script. A person opens the exported file **in Excel** and checks it by eye.
- ETM-8792: steps 6-7 paste from **Word** and **Excel**, which the browser script cannot do. The other steps are scripted.

Environment: QA only (https://stms-qa.apps.pttep.com). Log in as Turnaround Manager. Take a full-screen picture for every step.
Column Customization is the button at the top right of the table. Deck, X and Y are hidden by default: check `Working Location (Deck)`, `(X)` and `(Y)`, then click `Apply`. At the end click `Reset`, then `Apply`.

## ETM-8784 - Export Worklist file is unchanged (5 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/8615c7fb-a8c5-4a33-8868-456bca141118/planning/5bed9f3c-e424-4f08-be03-45bd2f25c4b2/worklist/27fc9831-7daa-4ba3-837d-5ce15e411957
Data: the work `BATEST8049A` on the BA's Plan "ZZ BA Claude Test" (the BA made it; do not change it).

| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click `Export Worklist` (next to `Create Work`) | A file named like `<event>_<plan>_Worklist_<date>.xlsx` is downloaded | Download with the file name |
| 2 | Open the file **in Excel**, sheet `Worklist_Data`, and find `BATEST8049A` | The file opens without an error or repair message. There is one Work row, followed by 3 Work Breakdown rows | Sheet with the 4 rows |
| 3 | Read columns R, S and T of the Work row | R = `Weather Deck,Main Deck,Cellar Deck,Aft Area,Helipad,HELIPAD,Main  Deck,Zone A, B,Zone C`; S = `0,1,5,9`; T = `A,B,C,F` | Columns R-T of the Work row |
| 4 | Read columns R, S and T of the 3 Work Breakdown rows | See the table below | Columns R-T of the 3 rows |
| 5 | In the app, show Deck, X and Y and read the Deck cell of `BATEST8049A` | The values are in the same order as the file. Only the separator differs: `,` in the file and `, ` in the cell. Cell = `Weather Deck, Main Deck, Cellar Deck, Aft Area, Helipad, HELIPAD, Main  Deck, Zone A, B, Zone C` | Deck cell next to the file |

Expected values for step 4 (`Main  Deck` has 2 spaces):

| Row | R (Deck) | S (X) | T (Y) |
|---|---|---|---|
| Work Breakdown 1 | `Main Deck,Main  Deck,Zone A, B,Zone C` | `0` | `A` |
| Work Breakdown 2 | `Weather Deck,Cellar Deck,Helipad` | `1,9` | `B,F` |
| Work Breakdown 3 | `Main Deck,Cellar Deck,Aft Area,HELIPAD` | `1,5` | `A,C` |

## ETM-8792 - Unusual Deck text, paste from Word and Excel, a comma inside one value (14 steps)
writes data: yes. It creates new works on Plan "QA ETM-8049 Scratch" only. Delete the works you made at the end (works on this Plan belong to this card).
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/e95c9b6a-e347-49d9-8e1b-0f0f6e3d9c4c/worklist/bea32b01-d98f-4952-8c5c-bbffb84d46dd
Before you start, set up the paste source: type `Deck  Two` (2 spaces between the words) in a Word document and in one Excel cell.
Work Number: use a new number each time, e.g. `WK-19m1-<your initials>`. Fill X = `1` and Y = `A`.

Steps 1-5 are done once for each data row (the script already passes all 10 rows; by hand, 1-2 rows are enough, e.g. `  main deck  ` and `ดาดฟ้าหลัก`):

| Typed | Expected tag / cell |
|---|---|
| `😀` | `😀` |
| `😀😀😀` | `😀😀😀` |
| `ดาดฟ้าหลัก` | `ดาดฟ้าหลัก` |
| `主甲板` | `主甲板` |
| `سطح السفينة` | `سطح السفينة` |
| `Deck <A> & "B"` | `Deck <A> & "B"` |
| `Deck/1\2 %` | `Deck/1\2 %` |
| `  Zone C  ` (outer spaces) | `Zone C` |
| `  main deck  ` | `Main Deck` (Master Data spelling) |
| `Main  Deck` (2 inner spaces) | `Main  Deck` |

| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click `Create Work` > `Manual Create` | The page opens | Create Work form |
| 2 | Type the value of the data row in Deck and press Enter | The tag shows the expected value | Deck tag |
| 3 | Fill in the other required fields and click `Save` | The work is saved | Saved message |
| 4 | Read the Deck cell of the new work | The cell shows the expected value and the page does not break | Deck cell |
| 5 | Open the Deck filter and type the expected value in the search box | The option with the expected value is listed | Filter list |
| 6 | **Create Work again. Copy `Deck  Two` from Word and paste it into Deck** | The field shows `Deck  Two` with both spaces and without Word formatting (font, colour, size) | Deck field after the paste |
| 7 | **Clear the field. Copy the cell from Excel and paste it into Deck** | The field shows `Deck  Two` with no new line or tab (the cursor stays on the same line) | Deck field after the paste |
| 8 | Leave this page without saving, then open `Create Work` > `Manual Create` | A new, empty form opens. Nothing from steps 6-7 is saved (not in the table either) | Empty form |
| 9 | Fill in the other required fields, X = `1`, Y = `A` | The page shows the values | Filled form |
| 10 | Type `Zone A, B` in Deck and press Enter | There is 1 tag `Zone A, B`, not 2 tags | Deck tag |
| 11 | Click `Save` | The work is saved | Saved message |
| 12 | Read the Deck cell of the new work | The cell shows `Zone A, B` | Deck cell |
| 13 | Open the Deck filter and type `Zone A` | Exactly 1 option is listed, `Zone A, B`. There is no `Zone A` and no `B` | Filter list |
| 14 | Untick Select All, tick `Zone A, B` only, click `Apply` | The table shows the new work | Filtered table |

At the end: delete the works you made in this Test, then in Column Customization click `Reset`, then `Apply`.

## ETM-8791 - Deck boundary 29/30/31 characters in the forms and an Excel import with a 31-character value (14 steps)
writes data: yes
writes: steps 4 and 8 save 2 new works in Plan "QA ETM-8049 Scratch" (WK-18b-<n>, WK-18c-<n>); delete them at the end. The import of steps 11-14 must create nothing; if it does, delete those works too. No other Plan.
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/e95c9b6a-e347-49d9-8e1b-0f0f6e3d9c4c/worklist/bea32b01-d98f-4952-8c5c-bbffb84d46dd
Values: 29 `Deck-0123456789-0123456789-AB`, 30 `Deck-0123456789-0123456789-ABC`, 31 `Deck-0123456789-0123456789-ABCD`. Paste (steps 7, 9): put the 31-character value on the clipboard and paste with Ctrl+V (or a synthetic paste event); say how.
Import (steps 11-14), one round per template row:
- Row A, template of ETM-6843: file /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/import-8791/ETM-8791-31char-6843-1124.xlsx (valid work WK-31ok-1124 `Main Deck`, bad work WK-31bad-1124 with the 31-character Deck). Expected message ends `Please refer to the sheet name "Dropdown Options" for the maximum limit.`, button `Import` disabled.
- Row B, template of ETM-1008 / ETM-1106 (`Next`): N/A (user decision 26 Nov 2026: the app has only the ETM-6843 Import Work page; no `Next`). Not run.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open Create Work > Manual Create and fill in the other required fields, X `1`, Y `A` | The page shows the filled values | Form |
| 2 | Type the 29-character value in Deck and press Enter | The tag shows the full 29-character value | Deck tag |
| 3 | Remove the tag, type the 30-character value and press Enter | The tag shows the full 30-character value | Deck tag |
| 4 | Click `Save` | The work is saved and its Deck cell shows `Deck-0123456789-0123456789-ABC` (ellipsis only if the column is narrow) | Deck cell |
| 5 | Open Create Work > Manual Create again and fill in the other required fields, X `1`, Y `A` | The page shows the filled values | Form |
| 6 | Type the 31-character value in Deck | The field keeps 30 characters, the 31st `D` is not accepted, no message | Deck field |
| 7 | Remove the text and paste the 31-character value | The field keeps `Deck-0123456789-0123456789-ABC`, no message | Deck field |
| 8 | BND check: press Enter and click `Save` | Saved with Deck `Deck-0123456789-0123456789-ABC` (30) and no work with a 31-character Deck | Deck cell |
| 9 | Open Create Work again and paste the 31-character value into the Deck cell of the Work Breakdown table | Truncated to the first 30 characters, no error | Breakdown table cell |
| 10 | Open Edit Work Breakdown of the work of step 4 (row menu, View Work Details, Edit Breakdown), double-click the Deck cell and type the 31-character value | The cell editor keeps 30 characters, no message | Cell editor |
| 11 | Click `Create Work`, choose `Import Excel` | The import window opens | Import page |
| 12 | NEG check: choose the file of the row and import it | The error report lists the row, the cell and the message of the row | Error report |
| 13 | NEG check: look at the `Import` button | The button is disabled | Button |
| 14 | NEG check: check the table for the valid row of the file | The valid row (WK-31ok-1124) is not imported and no work with a 31-character Deck exists | Worklist search |

At the end: delete the works made in this Test, then Column Customization `Reset`, `Apply`.
