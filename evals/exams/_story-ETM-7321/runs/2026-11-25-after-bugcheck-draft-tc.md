# Draft TC: ETM-7321 Daily Report - Update Export PDF Template Table Header Color

Story: ETM-7321 [Improvement] Daily Report - Update Export PDF Template Table Header Color (frozen exam copy).
Source: story.md (no comments), docs/modules/daily-report-export-template.md, knowledge/. No analyst.md and no inspector.md exist for this exam: AC ids below are numbered by me from the Story's own numbering and are stable inside this draft.
Existing [QA] subtasks: none known.

## Think like the user
- Who: a Turnaround Manager who sends the exported PDF to executives every day, and exports a whole month at once (ZIP) before a review.
- Wants: a PDF that looks the same as before but with the ice-blue header, readable text, no broken colours in the progress numbers.
- Careless user: exports on a date that is not Frozen, exports the batch with many days, prints the PDF in black and white, opens the PDF on a phone, exports a day with no images or very long notes that run onto a second page.

## Common precondition
Logged in as Turnaround Manager (TM) on the Daily Report screen, role has "Export Daily Report", the Daily Report date under test is Frozen. The date has: Key Activities, Activities Plan for Tomorrow, Area of Concern and Remark all filled (Key Activities and Remark with bold, bullet and two paragraphs), at least 9 activity groups in Progress Summary, and 3 attached images with captions. Sample names: "2026 Platong Full Shutdown".

Notation: "header colour" = solid background `#E3EFF3`. "Header text" = Bold, Font Color Black `#000000`. Colours are read in the exported PDF, never on screen.

## Coverage map

| Requirement / screen state | Technique | Risk | Cases |
|---|---|---|---|
| AC-1 Global: every table header row has `#E3EFF3` | Condition table, error guessing | One table missed (old dark colour stays) | TC-001, TC-002, TC-011 |
| AC-1.1 Table 1 Row 1 headers (Key Activities, Activities Plan for Tomorrow): fill, Bold, Black | Edge values | Only one of two cells changed | TC-003 |
| AC-1.2 Table 1 Row 3 headers (Area of Concern, Remark) | Same | Row 3 forgotten, only row 1 changed | TC-003 |
| AC-1.3 Table 2 header (5 cells) | Same | A cell such as Note keeps old colour | TC-004 |
| AC-1.4 Table 3 header (Attached Image, merged) | Same | Merged cell not filled fully | TC-005 |
| AC-1 "all table header rows" vs AC list (Schedule/Gantt table of the template, Total row of Progress Summary) | Gap analysis | Story says all, lists three tables | TC-011, TC-012 (and Open questions Q1, Q2) |
| AC-2.1 Data rows white | Screen states | Colour bleeds into data rows | TC-006 |
| AC-2.2 100% green `#D9F7BE` black font, Plan and Actual | Condition table | Rule lost after colour change | TC-007 |
| AC-2.2 Actual < Plan red `#A8071A`, > Plan green `#389E0D`, = Plan black | Condition table | Wrong font colour, background not white | TC-007 |
| AC-2.2 boundaries 0%, 99%, 100%, Plan 100 Actual 100, Plan 0 Actual 0 | Edge values | 100% rule fights with the other rules | TC-008 |
| AC-2.3 Rich text in Table 1 rows 2 and 4 kept | Real-user view, strange input | Formatting lost, text cut | TC-009, TC-010 |
| AC-3.1 Current Execution Date mode | State changes | Only one mode updated | TC-001 |
| AC-3.1 Daily Plan mode: ZIP of daily PDFs per month, every PDF in it | Matrix: one case plus table | Only first PDF updated | TC-002 |
| AC-3.2 Filename, freeze validation, Gantt day scale, fallback hyperlinks | Regression | Colour change breaks old features | TC-013, TC-014, TC-015, TC-016 |
| Permission: no "Export Daily Report", other role | Roles and permission | Permission leak | TC-017 |
| State: date not Frozen | State changes | Export allowed or wrong colour in error flow | TC-014 |
| Screen states: empty section (no images, empty Area of Concern), very long text across pages, many rows | Screen states | Header lost on page 2, empty table shows broken header | TC-018, TC-019, TC-020, TC-021 |
| Strange input in every free-text field shown in the export (Activity Group name, Note, Caption, notes) | Strange input | Special characters break table or header | TC-010 |
| Same data shown on many places (Progress numbers on screen and PDF) | Lesson 8 | Colour rule uses wrong value (rounded vs stored) | TC-008 |
| Unsaved edit then export; leaving after export; other PDF exports unchanged | Error guessing | Unsaved text in PDF, warning on leave, colour leaks to other exports | TC-025, TC-026, TC-027 |
| Header text alignment unchanged (Q3) | Regression | Alignment shifts | TC-028 |
| Strange input per field (table) | Strange input | Break or lost text | TC-029 |
| Colour rule undone (100 to 90) | Effects and reverse | Stale green | TC-030 |
| Rules inside the monthly ZIP PDFs | Matrix | Only single mode checked | TC-031 |
| Double click on Export, two tabs | Error guessing | Two files or half file | TC-022 |
| Print black and white / legibility | Real-user view | Header text unreadable | TC-023 |

Categories (lessons-learned 1-9 plus section 10):
1 Two people at once: relevant, TC-022 (one user exports while another unfreezes). 2 Filter+Sort+Search: not relevant, export has no filter. 3 Old data after migrations: relevant, TC-024 (old Frozen date). 4 Strange input: TC-010. 5 Reordering: not relevant, no reorder. 6 Linked data: not relevant, no data change by this Story. 7 Charts: not relevant, S-Curve not changed (covered only as regression in TC-016). 8 Same data many pages: TC-008. 9 Matrix: TC-007 table. L-1..L-7: not relevant (no sorted list, filter, paste, collapse, picker). L-8 Story text changed during sprint: relevant, the Total row colour rule is not in this Story, so TC-012 reads it as is and Q2 asks. 
Skipped screen states: loading and error of the Export button are in TC-014 and TC-022; no mobile case because export is a file download (reading the PDF on a phone is in TC-023 as zoom check only).

## Counts
High 13, Medium 13, Low 5 (priority by damage, no Story priority given).
Auto 9, Partial 15, Manual 7 (colour checks need the PDF read; final look by eye).

## Open questions
Q1. AC-1 says "all table header rows across the exported PDF" but AC lists only three tables. The template also has a Schedule/Activity table with Gantt (Section F, many header cells: Details, Scheduled, Description, Work Number...). Does it get `#E3EFF3`? TC-011 writes the Expected Result as "ice-blue, Bold, Black" (what the user would call correct for "all"), pending the answer.
Q2. The Total row of Progress Summary is dark and bold in the old template. After this Story, which colour must it have: `#E3EFF3`, white or old dark? Which font colour? TC-012 expects it is NOT left dark while the header is ice-blue and its text stays readable; BA must confirm.
Q3. Row 1 and Row 3 header text colour is Black; is Weight (%) / Plan (%) etc. text alignment (left, centre) unchanged? Assumed unchanged.
Q4. Header on a page break: does a table header repeat on the next page? Unknown in the template; TC-019 expects the header on the new page to be ice-blue if it repeats, and asks.
Q5. Table 3 with no images: is the Attached Image header shown with an empty table or hidden (template section 5 says to confirm)? TC-018 expects what the old build did; BA to confirm.
Q6. Empty Area of Concern / Remark: header still ice-blue with empty body (assumed).
Q7. Does the Daily Plan ZIP include dates that are not Frozen? Story says the target date is Frozen; AC silent for others.
Q8. Can the Actual (%) or Plan (%) value be typed with a decimal (99.6) and can it be edited while the date is unfrozen? TC-008 step 6 and TC-030 depend on it.
Q9. Which other PDF exports of the product exist, so TC-027 can name one?
Fix round: bug-check rows fixed in TC-008, TC-009, TC-011, TC-014, TC-017 and new TC-025 to TC-031.
Suggestion (not in Story): print and greyscale check of contrast (TC-023 only reads the actual colour values, no extra rule added). Suggestion (not in Story): colour check of the Word template. Not written as cases.

## Test cases (31 flows)

### TC-001 [FE][MT] Verify Current Execution Date export shows ice-blue table headers (POS) [Partial: file download automatic, header colours read from the PDF pixels, final look by eye]
Precondition: common
Priority: High
Trace: AC-1, AC-3.1
1. Open the Daily Report screen on the Frozen date. -> The Daily Report screen shows the Frozen date with the Export button enabled.
2. Choose Current Execution Date as the export mode. -> The Current Execution Date mode is selected.
3. Click Export. -> One PDF file is downloaded; the file name follows the old naming rule and no error message appears.
4. Open the PDF and look at every table header row. -> Every table header row has solid ice-blue background `#E3EFF3`; no header keeps the old dark colour.
Starting data: the Frozen date in the common precondition. Check: header pixel colour of the 4 header rows on page 1 to 3. Data set: one date. Clean up: delete the downloaded file.

### TC-002 [FE][MT] Verify Daily Plan export puts ice-blue headers in every PDF of the monthly ZIP (POS) [Partial: ZIP and PDF reading automatic, loops over every PDF; look by eye on two files]
Precondition: common; a plan range that spans two months, so two ZIP files or two month folders are made, with at least 3 Frozen days in each month.
Priority: High
Trace: AC-1, AC-3.1
1. Choose Daily Plan as the export mode. -> The Daily Plan mode is selected.
2. Click Export. -> A ZIP file for each month is downloaded; no error message appears.
3. Open the first ZIP. -> The ZIP holds one PDF per day of that month.
4. Open the first PDF, the last PDF and one PDF in the middle. -> Every table header row in each of the three PDFs has background `#E3EFF3`.
5. Open the ZIP of the second month and open its first PDF. -> The headers in that PDF also have background `#E3EFF3`.
Expected values the test loops over: for every PDF in every ZIP, Table 1 row 1, Table 1 row 3, Table 2 header and Table 3 header are `#E3EFF3`. Clean up: delete downloaded files.

### TC-003 [FE][MT] Verify Executive Notes table headers (row 1 and row 3) have fill, Bold and Black text (POS) [Partial: fill and font read from PDF, final look by eye]
Precondition: common
Priority: High
Trace: AC-1.1, AC-1.2
1. Export the Current Execution Date PDF and open page 1. -> The PDF page 1 shows the Executive Notes table.
2. Look at the cell `Key Activities`. -> Background `#E3EFF3`, text Bold, font colour `#000000`.
3. Look at the cell `Activities Plan for Tomorrow`. -> Background `#E3EFF3`, text Bold, font colour `#000000`.
4. Look at the cell `Area of Concern`. -> Background `#E3EFF3`, text Bold, font colour `#000000`.
5. Look at the cell `Remark`. -> Background `#E3EFF3`, text Bold, font colour `#000000`.
6. Look at the two cells under row 1 and row 3 (the note bodies). -> The note body cells are white, not ice-blue.

### TC-004 [FE][MT] Verify Progress Summary header cells have fill, Bold and Black text (POS) [Partial: read from PDF]
Precondition: common
Priority: High
Trace: AC-1.3
1. Export the PDF and open the Progress Summary table. -> The table shows the header row Activity Group, Weight (%), Plan (%), Actual (%), Note.
2. Check the header cell `Activity Group`. -> Background `#E3EFF3`, Bold, Black `#000000`.
3. Check the header cell `Weight (%)`. -> Background `#E3EFF3`, Bold, Black `#000000`.
4. Check the header cell `Plan (%)`. -> Background `#E3EFF3`, Bold, Black `#000000`.
5. Check the header cell `Actual (%)`. -> Background `#E3EFF3`, Bold, Black `#000000`.
6. Check the header cell `Note`. -> Background `#E3EFF3`, Bold, Black `#000000`.
Data set: the 5 header cells above, one loop.

### TC-005 [FE][MT] Verify Attached Image header fills the whole merged cell (POS) [Partial: read from PDF]
Precondition: common
Priority: Medium
Trace: AC-1.4
1. Export the PDF and open the Attached Image section. -> The table shows the header `Attached Image` over both columns.
2. Check the header cell background from the left edge to the right edge. -> The whole header cell, left and right half, has background `#E3EFF3` with no white gap in the middle.
3. Check the header text. -> `Attached Image` is Bold, Black `#000000`.
4. Check the image rows and caption rows under it. -> They stay white.

### TC-006 [FE][MT] Verify data rows stay white in all three tables (POS) [Partial: pixel sample of body cells]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Export the PDF and open Table 1 rows 2 and 4. -> The two note body rows have a white background.
2. Open the Progress Summary rows that are not 100% (a row with Plan 50% and Actual 50%). -> Activity Group, Weight, Note cells are white; Plan and Actual cells are white.
3. Open the image and caption rows of the Attached Image table. -> Both are white.

### TC-007 [FE][MT] Verify Plan (%) and Actual (%) colour rules are kept after the header change (POS) [Auto: expected-values table below, loop over rows; pixel and font colour read from the PDF]
Precondition: common; Progress Summary rows with these values (made up groups): `Pre-SD Works` Plan 100 Actual 100; `Process Ramp-Down` Plan 98 Actual 100; `PVI : Pressure Vessel Cleaning & Inspection` Plan 100 Actual 90; `INS : PLCPP and PLOCPP2 10Y PM ICSS` Plan 10 Actual 30; `INP : PLFT1 Flare Rope Access Inspection` Plan 85 Actual 85; `Process De-Isolation & Start-up` Plan 0 Actual 0.
Priority: High
Trace: AC-2.2
1. Export the PDF and open the Progress Summary table. -> Each prepared row is listed.
2. For each row of the table below, read the Plan cell and the Actual cell. -> Each cell has the background, font colour shown in the table.
3. Read the whole row again for any cell not listed. -> No other colour appears.

| Row | Plan cell background / font | Actual cell background / font |
|---|---|---|
| Plan 100, Actual 100 | `#D9F7BE` / `#000000` | `#D9F7BE` / `#000000` |
| Plan 98, Actual 100 | white / `#000000` | `#D9F7BE` / `#000000` |
| Plan 100, Actual 90 | `#D9F7BE` / `#000000` | white / `#A8071A` |
| Plan 10, Actual 30 | white / `#000000` | white / `#389E0D` |
| Plan 85, Actual 85 | white / `#000000` | white / `#000000` |
| Plan 0, Actual 0 | white / `#000000` | white / `#000000` |
Clean up: delete downloaded file.

### TC-008 [FE][MT] Verify colour rule edges and that the PDF uses the same value as the screen (BND) [Partial: values read from screen and PDF automatically, edge rows prepared by hand]
Precondition: common; rows with Plan/Actual: 99/100, 100/99, 0/1, 1/0, Actual 99.6 typed on screen in the Actual field of one more row (only if the field accepts a decimal; Q8).
Priority: High
Trace: AC-2.2
1. Open the Daily Report screen and write down the Plan (%) and Actual (%) of each edge row. -> The values are written down for comparison with the PDF.
2. Export the PDF and read the same rows. -> The numbers equal the numbers of the screen, same format (`100%`, no extra decimals).
3. Check the colour of 99 vs 100. -> Only the cell showing 100% is `#D9F7BE`; 99% is white with the red/green/black rule of its comparison.
4. Check row Plan 100, Actual 99. -> Actual is white with font `#A8071A`; Plan is `#D9F7BE`.
5. Check rows 0/1 and 1/0. -> 0/1: Actual white with font `#389E0D`; 1/0: Actual white with font `#A8071A`.
6. Check the row with Actual 99.6 against its Plan of 100. -> The Actual cell shows the same text as the screen and is white with font `#A8071A`, never green `#D9F7BE`; if the screen does not accept a decimal, this row is dropped and Q8 stands.
7. Check the Total row. -> The Total row has no `#D9F7BE` fill and no `#A8071A` or `#389E0D` font from the Plan/Actual rule (see Q2).

### TC-009 [FE][MT] Verify rich-text note bodies keep content and formatting (POS) [Partial: text compare automatic, formatting by eye]
Precondition: common; Key Activities and Remark saved with bold, bullet list and two paragraphs; Activities Plan for Tomorrow and Area of Concern saved with bold, bullet list and two paragraphs as well (all four note bodies are rich text under AC-2.3).
Priority: High
Trace: AC-2.3
1. Open the Daily Report screen and read the text of the four note bodies. -> The saved text, bold and bullets of Key Activities, Activities Plan for Tomorrow, Area of Concern and Remark are shown.
2. Export the PDF and open Table 1 rows 2 and 4. -> In all four bodies the text is the same as on screen; bold stays bold, bullets stay bullets, both paragraphs are present.
3. Check the text colour and size of the body. -> Body text is not ice-blue and not Bold unless the user made it bold; nothing overlaps or is cut at the cell edge.
4. Compare the four body cells with the text and formatting written down from the screen in step 1. -> Every word, bold run and bullet of the screen is in the PDF body; only the headers have a new colour.

### TC-010 [FE][MT] Verify strange text in every free-text field does not break headers or tables (NEG) [Auto: data set loop over fields; PDF text read]
Precondition: common; a Frozen date prepared with these values on separate rows (all typed on screen): Activity Group name `A/B : <Test> & "Quote" 100% # 'x'`; Note `\ / : * ? " < > | & # % '` with leading and trailing spaces; a Caption with Thai `ทดสอบรายงาน` and an emoji; Key Activities text that looks like HTML `<b>x</b>`.
Priority: Medium
Trace: AC-2.3, AC-1
1. Export the PDF. -> The PDF is downloaded without an error.
2. Check each field in the PDF. -> Every value is shown exactly as on screen; no tag turns into bold text, no character is missing.
3. Check the header rows. -> All header rows are still `#E3EFF3`, Bold, Black; the layout of the tables is unchanged.
4. Check the filename. -> The name follows the usual rule and has no strange character from the text above.
Data set: one prepared date, each field one loop. Clean up: restore the original text.

### TC-011 [FE][MT] Verify the Schedule / Activity table headers of the template (POS) [Manual: wording follows AC-1, BA to confirm Q1]
Precondition: common
Priority: High
Trace: AC-1
1. Export the PDF and go to the landscape page with the Schedule / Activity table. -> The landscape page shows the table with its header cells (Details, Scheduled, Description, Work Number, Activity Group, Job Owner, Duration, Start Date, End Date and so on).
2. Look at all header cells. -> Every header cell is `#E3EFF3`, Bold, Black, as AC-1 "all table header rows" says (Q1 asks the BA to confirm; the old dark colour on any header is a fail).
3. Look at the Gantt day scale header. -> The day labels are readable and the scale is correct.

### TC-012 [FE][MT] Verify the Total row of Progress Summary is readable next to the new header colour (POS) [Manual: rule not in Story, Q2]
Precondition: common
Priority: Medium
Trace: none (Total row gap, Q2)
1. Export the PDF and open the Progress Summary table. -> The table shows the Total row at the bottom.
2. Write down the Total row background and font colour. -> The colours are written down.
3. Compare with the header row. -> The text on the Total row is readable (not dark text on dark fill, not white text on white); the Total row is not drawn with the colour rule of Plan/Actual.

### TC-013 [FE][MT] Verify filename convention is unchanged (POS) [Auto: name read from the download]
Precondition: common
Priority: High
Trace: AC-3.2
1. Write down the file name an export had before the change (from the current name rule in ETM-5277). -> The pattern is written down for comparison.
2. Export Current Execution Date. -> The file name follows the same pattern with the date of the Frozen day.
3. Export Daily Plan. -> The ZIP names follow the same monthly pattern.

### TC-014 [FE][MT] Verify export of a date that is not Frozen is still refused (NEG) [Auto: message text read]
Precondition: TM logged in, Daily Report date that is not Frozen, "Export Daily Report" granted.
Priority: High
Trace: AC-3.2
1. Open the Daily Report screen on the not-Frozen date. -> The screen shows the date as not Frozen.
2. Click Export. -> The same freeze validation message as before the change is shown and no file is downloaded; only that one message is shown, no other message.
3. Freeze the date, Export again. -> The PDF is downloaded with `#E3EFF3` headers.
4. Unfreeze the date again. -> The date returns to its first state.
5. Choose Daily Plan mode and Export for a range that includes this not-Frozen date. -> The same freeze validation message as before the change is shown, no ZIP holds a PDF for the not-Frozen date, and only that one message is shown (Q7 BA confirms whether the other Frozen days still export).
6. Export Daily Plan for a range of Frozen dates only. -> The ZIP is downloaded and its PDFs have `#E3EFF3` headers, so the validation is not lost by the colour change.

### TC-015 [FE][MT] Verify the Gantt day scale and Gantt bars are unchanged (POS) [Partial: Gantt look by eye]
Precondition: common; the Frozen date has a Gantt with several days.
Priority: Medium
Trace: AC-3.2
1. Export the PDF and open the Gantt page. -> The Gantt shows the day-scale columns.
2. Check each day label against the Frozen date range. -> Labels are the same days and order as in the old PDF; no label shifted or cut.
3. Check the table header of that page. -> Header colour follows TC-011; the bars keep their old colours.

### TC-016 [FE][MT] Verify the hyperlink fallback ("Link to STMS") and S-Curve are intact (POS) [Auto: link read from the PDF]
Precondition: common
Priority: Medium
Trace: AC-3.2
1. Export the PDF and open page 1. -> The report title `Daily Report: 2026 Platong Full Shutdown`, the date and the cut-off text are shown.
2. Click `Link to STMS`. -> The link opens the STMS address that the old PDF opened.
3. Check the S-Curve chart. -> Plan and Actual lines and legend are the same as before.

### TC-017 [FE][MT] Verify a user without Export Daily Report cannot export (NEG) [Auto]
Precondition: Job Owner (JO) account, or a role without "Export Daily Report", on the same Frozen date; the export request of a TM export was recorded earlier from the network log (address and method).
Priority: High
Trace: AC-3.2
1. Log in as JO and open the Daily Report screen. -> The screen opens.
2. Look for the Export button. -> The Export button is hidden or disabled as before the change.
3. As JO, send the recorded export request. -> The request is refused with the same refusal as before the change (permission error), no PDF and no ZIP is returned, and only that one message or status is shown.

### TC-018 [FE][MT] Verify the Attached Image section with no images (BND) [Manual: Q5]
Precondition: common except no images on the date.
Priority: Medium
Trace: AC-1.4
1. Export the PDF and look at the page where images would be. -> The result is the same as the old build: either the section is hidden or an empty table is shown.
2. If the empty table is shown, check its header. -> `Attached Image` is `#E3EFF3`, Bold, Black.

### TC-019 [FE][MT] Verify header colour on a table that runs over two pages (BND) [Manual: layout look, Q4]
Precondition: common; Progress Summary with so many rows (made by the data owner) that the table does not fit on one page; Key Activities with very long text.
Priority: Medium
Trace: AC-1.3, AC-2.3
1. Export the PDF and go to the page break of the Progress Summary table. -> The table continues on the next page.
2. Look at the header on the first page. -> `#E3EFF3`, Bold, Black.
3. Look at the top of the next page. -> If the header repeats, it also is `#E3EFF3`; if it does not repeat, the body rows stay white and not cut.
4. Check Table 1 with the long text. -> Text is complete, no row has a header colour by mistake.

### TC-020 [FE][MT] Verify empty Area of Concern and Remark (BND) [Auto]
Precondition: common except Area of Concern and Remark are empty.
Priority: Low
Trace: AC-1.2
1. Export the PDF and open Table 1. -> The headers `Area of Concern` and `Remark` are shown.
2. Check their background and font. -> `#E3EFF3`, Bold, Black; the empty body cells under them are white with the same blank look as the old build.

### TC-021 [FE][MT] Verify a very long Activity Group name and very long Note in the header-coloured table (BND) [Manual: layout]
Precondition: common; Activity Group name of 150 characters and a Note of 500 characters (typed on screen).
Priority: Low
Trace: AC-1.3
1. Export the PDF and open the Progress Summary table. -> The row is shown.
2. Check the header and the long row. -> The header stays `#E3EFF3` in full width; the long text wraps inside its cell, no text hides behind the header.

### TC-022 [FE][MT] Verify double click on Export and a second user changing the freeze state (Exotic: two users, double click) [Partial: two browser contexts]
Precondition: common; second user (TM) in another browser.
Priority: Medium
Trace: AC-3.1
1. Double-click Export quickly in Current Execution Date mode. -> One PDF or two identical PDFs download; each file opens and has `#E3EFF3` headers; no broken file.
2. The second user unfreezes the date. -> The date is unfrozen in the second browser.
3. The first user clicks Export again without reloading. -> The freeze validation message is shown, no PDF is downloaded, and only that one message.
4. The second user freezes the date again. -> The date is Frozen again.

### TC-023 [FE][MT] Verify header text stays readable when zoomed and printed (Exotic: real user) [Manual: by eye]
Precondition: common
Priority: Low
Trace: none (readability, real-user view)
1. Open the exported PDF and zoom to 400 percent on the header of Table 2. -> The header text is sharp, Bold and Black on the ice-blue background.
2. Print the PDF in black and white (print preview). -> Header text stays readable against the light-grey background and the column lines are still visible.

### TC-024 [FE][MT] Verify an old Frozen date (data made before this Story) exports with the new headers (POS) [Partial: old date needs data from before]
Precondition: TM, an old Frozen date from several months ago that was exported with the old template, also one old date with no Executive Notes saved.
Priority: Medium
Trace: AC-1, AC-2.3
1. Open the old Frozen date and Export. -> The PDF is downloaded.
2. Check the header rows. -> All are `#E3EFF3`, Bold, Black.
3. Check the old notes and the progress values. -> They equal the saved values on screen; an empty note shows an empty body with the header still coloured.
4. Compare the file with the old PDF of that date. -> Only the header colour is different; numbers, images and colours of Plan/Actual are the same.

### TC-025 [FE][MT] Verify an unsaved note edit is not in the exported PDF (Exotic: unsaved change) [Partial: PDF text read automatic]
Precondition: common; the Remark can be edited on screen.
Priority: Medium
Trace: AC-2.3
1. Open the Daily Report screen and write down the saved Remark text. -> The saved Remark text is written down.
2. Type an extra line `unsaved test line` in Remark and do not save. -> The editor shows the extra line.
3. Click Export in Current Execution Date mode. -> One PDF is downloaded with no error.
4. Open the PDF and read the Remark body. -> The body holds the saved text from step 1 and does not hold `unsaved test line`; the Remark header is `#E3EFF3`.
5. Undo the extra line by hand and leave the screen. -> The text equals the saved text and no unsaved-changes warning is shown.

### TC-026 [FE][MT] Verify export does not raise an unsaved-changes warning when leaving (POS) [Manual: warning pop-up by eye]
Precondition: common; TM and JO accounts.
Priority: Low
Trace: none (view-only action, leaving the page)
1. As TM click Export and wait for the download. -> One PDF is downloaded.
2. Click the breadcrumb to leave the Daily Report screen. -> The other screen opens with no unsaved-changes warning.
3. As JO open the Daily Report screen and click the browser Back button. -> The screen is left with no warning.

### TC-027 [FE][MT] Verify other PDF exports of the product keep their old header colour (NEG) [Manual: which exports exist is known by the BA, Q9]
Precondition: common; one other PDF export of the product that is not the Daily Report export (named by the BA, Q9).
Priority: Medium
Trace: AC-1
1. Export that other PDF from its own screen. -> The PDF is downloaded.
2. Look at its table headers. -> The headers keep the colour they had before this Story and none is `#E3EFF3`.

### TC-028 [FE][MT] Verify header text alignment is unchanged by the new colour (POS) [Partial: position read from PDF, compare by eye]
Precondition: common; a PDF of the same Frozen date saved from the old build for comparison (Q3).
Priority: Low
Trace: AC-1.3
1. Export the PDF and open the Progress Summary header row. -> The five headers are shown.
2. Compare each header text position (left, centre, right) with the old PDF. -> Every header text sits at the same position as in the old PDF.

### TC-029 [FE][MT] Verify strange text in each free-text field, one field per loop (NEG) [Auto: data set loop over the table; PDF text read]
Precondition: common; a Frozen date prepared on screen with the values in the table. Where the screen trims or refuses a value, the value that the screen keeps is the expected one.
Priority: Medium
Trace: AC-1, AC-2.3
1. Export the PDF. -> The PDF is downloaded without error.
2. For each row of the table read the field in the PDF. -> The PDF shows exactly the text the screen shows, no tag turns into styling, no character is missing, the table is not broken.
3. Check all header rows. -> Every header row is `#E3EFF3`, Bold, Black.

| Field | Value typed |
|---|---|
| Key Activities | `A & B < C > "D" 50% #1` with a Thai line `ทดสอบ` |
| Activities Plan for Tomorrow | `\ / : * ? | ' %` and `<script>x</script>` |
| Area of Concern | Thai `ความเสี่ยงสูง`, then a line of 300 characters |
| Remark | `   spaces around   ` and an emoji |
| Activity Group name | Thai text, an emoji, and leading and trailing spaces |
| Note | Thai text, an emoji and `<b>x</b>` |
| Caption | `a/b:c*d?"e<f>g|h`, `<i>x</i>` and a 200 character text |
| Event / plan name in the title `Daily Report: ...` | `Plan "A" & <B> 2026` |
| Schedule table Description, Work Number, Job Owner | special characters `& < > "` and Thai text in each |
Clean up: restore the original text.

### TC-030 [FE][MT] Verify the 100% green rule disappears when the Actual value is changed back below 100 (POS) [Partial: freeze steps by hand, colour read from PDF]
Precondition: common; the Actual value of one row can be changed on screen while the date is unfrozen (Q8); that row has Plan 100 and Actual 100.
Priority: High
Trace: AC-2.2
1. Export the PDF and read that row. -> Plan and Actual are `#D9F7BE` with font `#000000`.
2. Unfreeze the date and change Actual from 100 to 90. -> The screen shows Actual 90.
3. Freeze the date and Export again. -> A new PDF is downloaded.
4. Read the same row. -> Plan is `#D9F7BE`; Actual shows 90 on a white background with font `#A8071A`; no green fill remains on Actual.
5. Restore Actual to 100 and freeze the date. -> The row is as in the first state.

### TC-031 [FE][MT] Verify data rows, Plan/Actual colours, rich text, Gantt scale and links inside the monthly ZIP PDFs (POS) [Auto: loops over every PDF of the ZIP]
Precondition: common; a ZIP made by Daily Plan mode with at least 3 Frozen days, the data of the common precondition on each day.
Priority: High
Trace: AC-2.1, AC-2.2, AC-2.3, AC-3.1, AC-3.2
1. Export in Daily Plan mode and open the ZIP. -> The ZIP holds one PDF per Frozen day.
2. For every PDF read the body cells of the three tables. -> The data rows are white.
3. For every PDF read the Plan and Actual cells of the Progress Summary. -> They follow the same colour rules as the expected-values table of the Current Execution Date export.
4. For every PDF read the four note bodies. -> The text and the bold and bullets equal the saved text of that day.
5. For every PDF read the Gantt day scale and click `Link to STMS`. -> The day scale equals the Current Execution Date PDF for the same day and the link opens the STMS address of the old build.
Clean up: delete downloaded files.
