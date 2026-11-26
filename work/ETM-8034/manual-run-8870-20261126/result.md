# ETM-8870 Export PDF vs screen - result 2026-11-26 (QA, Turnaround Manager, plan "S26 Row Colour")

How: probe script (not committed) saved the colours, used Export > PDF File > Overall, rendered the PDF with pdf.js and read pixel colours; a second run (no Save) took the screen picture with the histogram hidden. Colours were set back to No Color and saved after the export.
Colours used (palette values; the manual file's D7E3FF / 1E39C5 / FFD7E7 are not in the palette): Platform bg D6E4FF, Work Header text 1D39C4, Work bg FFE58F + text D48806, Work Breakdown bg FFD6E7.

| Step | Proposed | Seen |
|---|---|---|
| 1 | pass | Screen: Platform D6E4FF (No.) / CDDBF5 (other cells, parent-row shade), Header text 1D39C4, Work FFE58F + D48806, Breakdown FFD6E7, uncoloured rows white |
| 2 | pass | `NN TEST QA_S26 Row Colour_Overall_20261126.pdf` downloaded (3 pages) |
| 3 | pass | PDF pixels equal the screen pixels in every column: Platform D6E4FF/CDDBF5, Header E9EEF0 + text 1D39C4, Work FFE58F (shaded column F5DC89 on both), Breakdown FFD6E7 (shaded column F5CEDE on both); Work text orange |
| 4 | pass | Uncoloured rows are white (F5F5F5 in the shaded column), same as screen |
| 5 | pass | PDF columns: No., Description, Duration, Predecessor, Equipment Number, Manpower Resource, Remark = the 7 screen columns |
Files: step*.png, export-overall.pdf, screen.json (DOM colours), pdf-colours.json.
