# ETM-8870 - Export PDF shows the same row colours as the screen (by hand, 5 steps)

Test Execution: ETM-8875. Environment: QA. Plan: the ETM-8034 plan (`.env` `ETM8034_PATH`). Log in as Turnaround Manager.
Why by hand: a person must compare colours in the PDF with the screen; the browser agent cannot judge a PDF.

Precondition (writes data: Save on the ETM-8034 plan): save these colours, then reload:
- Platform row: highlight `D7E3FF`
- Work Header row: text colour `1E39C5`
- a Work row: highlight `FFE58F` and text `D48806`
- a Work Breakdown row: highlight `FFD7E7`
- one row left with no colour

| # | Do | Expected | Picture for Xray |
|---|---|---|---|
| 1 | Record the colours of these rows on the screen | The screen colours are written down | screenshot of the Gantt table |
| 2 | Use `Export PDF` on the Shutdown Logic page | A PDF file is downloaded | the downloaded file |
| 3 | Open the PDF and find the four coloured rows | Each row has the same background and text colour as on the screen, in all columns | PDF page with the rows |
| 4 | Find the row with no colour | It has the default look in the PDF | PDF page |
| 5 | Check the columns of the table in the PDF | All columns of the table on the screen are in the PDF | PDF page + screen header |

After the Test: set the colours back to `No Color` and Save, so other runs start clean.
Send QA the result per step (pass / fail + what was seen) and the pictures; the lead pushes them to Xray only after a yes.
