| test | round | cause | what changed |
|---|---|---|---|
| ETM-8631 | 1 | Log Out opens a Microsoft sign-out popup (pick account); main page stays until the account is picked | step 11 picks the TM account in the popup, expects /login + Login button; COOP window.closed console line from the popup ignored in collapseExpand.helpers noise |
