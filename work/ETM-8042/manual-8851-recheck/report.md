# ETM-8042 / ETM-8851 manual re-check (no data written, always Cancel, Save never pressed)
Paste method: navigator.clipboard.writeText then real keyboard Ctrl/Cmd+V (playwright), after Select-all in the field; then Tab + click on modal title. Clipboard read-back matched the text. Typing (step 5): keyboard.type.
Pictures: step-1.png .. step-6.png in this folder.

| # | Start (Ramp Down / Up) | After input, before leaving | End (after Tab/outside) | Save enabled | Verdict |
|---|---|---|---|---|---|
| 1 | 15 Feb 2026 09:00 / 25 Feb 2026 18:00 | - | same | no | pass |
| 2 paste 31 Feb 2026 08:00 in Start | 15 Feb 2026 09:00 / 25 Feb 2026 18:00 | Start shows `31 Feb 2026 08:00` | Start `15 Feb 2026 09:00` (reverted to old value, NOT cleared) / End `25 Feb 2026 18:00` | no | fail vs "cleared" (Save disabled only because nothing changed) |
| 3 paste 31 Feb 2026 08:00 in End | same | End shows `31 Feb 2026 08:00` | End `25 Feb 2026 18:00` (reverted, not cleared) | no | fail vs "cleared" |
| 4 paste 2026-02-08 08:00 in End | same | End shows `2026-02-08 08:00` | End `25 Feb 2026 18:00` (reverted, not cleared) | no | fail vs "cleared" |
| 5 type 31 Feb 2026 08:00 in End | same | End shows `31 Feb 2026 08:00` | End `25 Feb 2026 18:00` (reverted, not cleared) | no | fail vs "cleared" |
| 6 Cancel | - | - | modal closed; badge `15 Feb 2026 09:00 - 25 Feb 2026 18:00` | - | pass |

Conclusion: the script failure reproduces by hand, for paste and typing alike. The picker never accepts the invalid value (it does not get saved, Save stays disabled) but it restores the previous valid date instead of clearing the field. Whether "revert" or "clear" is right is a BA call (Q11 / AC 1.2 says cleared): this is a spec-vs-behaviour gap, not a data problem. Nothing saved; badge unchanged.

## Evidence round 2 (no data written, Save never pressed, always Cancel)
Pictures: case<N>-a-before-tab.png (right after paste, field still focused) and case<N>-b-after-tab.png (after Tab + click on modal title). Framed on the Edit Plan modal (picker + Save). Clipboard read-back matched the pasted text. Not blank (checked by eye on case2-a; sizes 19-30 KB each).

| Case | (a) after paste, before Tab | After Tab only (read from DOM) | (b) after Tab + click title |
|---|---|---|---|
| 1 Start paste `31 Feb 2026 08:00` | Start `31 Feb 2026 08:00`, End `25 Feb 2026 18:00`, date panel open, Save disabled | Start still `31 Feb 2026 08:00` | Start `15 Feb 2026 09:00` (restored), End `25 Feb 2026 18:00`, Save disabled |
| 2 End paste `31 Feb 2026 08:00` | End shows `31 Feb 2026 08:00`, Start `15 Feb 2026 09:00`, Save disabled | End already `25 Feb 2026 18:00` | same, restored |
| 3 End paste `2026-02-08 08:00` | End shows `2026-02-08 08:00`, Save disabled | End already `25 Feb 2026 18:00` | same, restored |

Red border / validation text in (a): none in all three cases (no red-bordered element and no error/invalid text found inside the modal). The invalid text is simply shown in the field with the normal blue focus border; Save is disabled (greyed) because nothing valid changed.
Side note: in case 1 the Start stays showing the invalid text after Tab and is restored only after the next click (title); in cases 2 and 3 the End is restored on Tab already. In no case is the field cleared.
Cancel pressed after each case; Plan Cards unchanged (`15 Feb 2026 09:00 - 25 Feb 2026 18:00`).
