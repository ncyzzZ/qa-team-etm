# ETM-8449 TC and script changes after BA answers (2026-11-24)

| Test | Xray change (needs the user's yes) | Script | Status |
|---|---|---|---|
| ETM-8629 s6 | "Compare T1-T4 with the limits" -> "Record T1-T4 as data; the table finishes each time (no freeze) with the right rows" (F-1, DEC-049) | `judgeTimes` records only, no 15/20 s rule | script done, Xray waiting |
| ETM-8630 s8 | same for A1-A6 | same | script done, Xray waiting |
| ETM-8631 | add pre-step "set PLAN-20K Active" and a clean-up step "set it back to Inactive" (F-5); step numbers move | add the steps (data write on QA; deactivates the event's other plan while Active) | waiting: how/where to set Active, user's yes for the data write |
| ETM-8632 | none (s5 already P+H+W, F-2) | Q8 box-look note removed (F-3) | done |
| ETM-8633 s5, 8635 s7 | done (F-2) | done | done |
| ETM-8634 s3, s6 | done (line hidden, ETM-2431 AC 4.5 = "as before") | done | PLAN-20K has no dependency between two Works of different Work Headers: test skips (no data) |

Run 2026-11-24 13:11 (0/6 proven): "- Work Header" leaves only Platform rows (8635 s4: 18/0/0/0, 8633 s4: 1/0/0/0), and after "- Platform" then "+ Platform" the Work Header box still shows "-" (8632 s5).
ETM-2431 AC 3.1 / 3.3 ("as before" reference): "[-]" collapses the rows of that level and cascades down only, so "- Work Header" should leave Platform + Work Header rows, and "- Platform" should set the lower boxes to "+". The TCs follow ETM-2431; the app does not -> defect candidate (user decides).

## Histogram rule (2026-11-24)
openPlan in collapseExpand.helpers.ts collapses the histogram (hideHistogram); ETM-8634 opens it again (showHistogram) right after load, before the line count. Not run yet.
