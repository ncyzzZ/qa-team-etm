# ETM-8851 full-screen evidence (round 3), QA, TM, Plan Scenario A, Edit Plan. 1440x900 pictures. Nothing saved (Cancel each time).

| Case | Input | (a) before leaving: Start / End | (b) after Tab + click title: Start / End | Save enabled | Red border/message |
|---|---|---|---|---|---|
| 1 | Start paste `31 Feb 2026 08:00` | `31 Feb 2026 08:00` / `25 Feb 2026 18:00` | `15 Feb 2026 09:00` / `25 Feb 2026 18:00` | no (disabled in a and b) | none |
| 2 | End paste `31 Feb 2026 08:00` | `15 Feb 2026 09:00` / `31 Feb 2026 08:00` | `15 Feb 2026 09:00` / `25 Feb 2026 18:00` | no / no | none |
| 3 | End paste `2026-02-08 08:00` | `15 Feb 2026 09:00` / `2026-02-08 08:00` | `15 Feb 2026 09:00` / `25 Feb 2026 18:00` | no / no | none |
| 4 | End type `31 Feb 2026 08:00` | `15 Feb 2026 09:00` / `31 Feb 2026 08:00` | `15 Feb 2026 09:00` / `25 Feb 2026 18:00` | no / no | none |

Finding: after leaving the field the old value is put back (not cleared as BA Q11 expects); Save is disabled in (a) only because the form is unchanged/invalid, and in (b) because the value equals the original. Final badge unchanged: 15 Feb 2026 09:00 - 25 Feb 2026 18:00.
Files not blank (140-156 KB each). Red check = DOM count of ant error classes (0), not by eye.
