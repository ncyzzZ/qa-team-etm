# ETM-7902 [Improvement] Cross-Module - Flexible Date and Time Input Auto-Conversion
Frozen for a defect exam: description as it was before 2026-11-12T13:25 (Jira changelog version of 2026-11-05T10:49, Jira wiki markup; 0 later edits not included), comments written before 2026-11-12T13:25 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* type dates and date-times in flexible common formats (e.g. slashes, hyphens, spaces, compact numbers, 12/24h time) and have the system auto-convert them into standard canonical format
*So that* manual data entry across planning tables is accelerated, user cognitive burden is minimized, and syntax input errors are eliminated.

----

*Pre-Conditions*

* The user is logged into the STMS application as a *Turnaround Manager* or *Job Owner*.
* The user is editing an editable table containing date or date-time input fields in one of the target modules:
** *Shutdown Logic* (Task Start / End Date Time)
** *Daily Report* (Daily Progress & Schedule Dates)
** *Manpower Mob Plan* (Mobilization & Demobilization Dates)
** *Equipment Mob Plan* (Material Ready at SKL, Require at Offshore, Backload to SKL Dates)
** *Shutdown Timeline* (Preparation Task Start & End Dates)

----

*Data Source*

* *Server Time & Timezone*: {{Asia/Bangkok}} (UTC+7).

----

*Acceptance Criteria*

# *Trigger Lifecycle (Blur & Enter Commit)*:
## The auto-conversion engine evaluates the input string immediately upon:
##* *Blur Trigger*: Moving focus away from the input field (clicking outside or tabbing to the next cell).
##* *Enter Trigger*: Pressing {{Enter}} while inside the input field.
## Leading and trailing whitespaces are automatically trimmed before evaluation.
## If the entered value matches any supported flexible syntax pattern, the raw input is automatically converted and replaced with the standard canonical display string in volatile memory and marked dirty.
# *Supported Date-Only Input Syntaxes (16 Formats) & Day-First Parsing Precedence*:
## *Day-First Precedence Rule*: Across all delimiters and compact numeric formats, the date sequence strictly adheres to Day-Month-Year ({{DD/MM/YYYY}}). Day strictly precedes Month in all numerical inputs (e.g. {{05/06/2026}} is evaluated as 5 June 2026, never 6 May 2026).
## The system must recognize and parse all of the following date formats (supporting both single and double digits {{[D]D}} and {{[M]M}}):
##* *Forward Slash Delimiters*: {{D/M/YY}}, {{DD/MM/YY}}, {{D/M/YYYY}}, {{DD/MM/YYYY}} (including mixed digits e.g. {{5/6/26}}, {{5/06/2026}}, {{05/6/2026}}).
##* *Hyphen Delimiters*: {{D-M-YY}}, {{DD-MM-YY}}, {{D-M-YYYY}}, {{DD-MM-YYYY}} (including mixed digits e.g. {{5-6-26}}, {{05-06-2026}}, {{5-06-2026}}).
##* *Space Delimiters*: {{D M YY}}, {{DD MM YY}}, {{D M YYYY}}, {{DD MM YYYY}} (e.g. {{5 6 26}}, {{05 06 2026}}).
##* *Compact Formats (Zero Delimiters)*:
##** {{DMYY}} (4 digits, e.g. {{5626}} -> {{05 Jun 2026}}).
##** {{DDMMYY}} (6 digits, e.g. {{050626}} -> {{05 Jun 2026}}).
##** {{DMYYYY}} (6 digits, e.g. {{562026}} -> {{05 Jun 2026}}).
##** {{DDMMYYYY}} (8 digits, e.g. {{05062026}} -> {{05 Jun 2026}}).
## *Compact 6-Digit Precedence*: When a 6-digit numeric input is ambiguous, valid calendar evaluation is prioritized. If both interpretations are valid, {{DDMMYY}} takes precedence over {{DMYYYY}}.
## *Target Canonical Output*: All date-only inputs must strictly convert to: {{DD Mmm YYYY}} (e.g. {{05 Jun 2026}}).
## *2-Digit Year Parsing Rule*: 2-digit years ({{YY}}) are interpreted within the 21st century (values {{[00..69]}} map to {{2000..2069}}).
# *Supported Date + Time Input Syntaxes*:
## For fields that require date and time (e.g. Shutdown Logic Start/End Date-Time, Daily Report Start/End Date), the date string is followed by a delimiter (either comma {{, }} or single space {{ }}) and time components:
##* *24-Hour Time Formats*:
##** {{..date..[separator]hh:mm}} (e.g. {{5/6/26, 14:30}}, {{5/6/26 14:30}} -> {{05 Jun 2026 14:30}}).
##** {{..date..[separator]hh,mm}} (e.g. {{5/6/26, 08,00}} -> {{05 Jun 2026 08:00}}).
##** {{..date..[separator]hh mm}} (e.g. {{5/6/26, 08 00}} -> {{05 Jun 2026 08:00}}).
##** {{..date..[separator]hhmm}} (e.g. {{5/6/26, 0800}} -> {{05 Jun 2026 08:00}}).
##* *12-Hour AM Formats (Case-Insensitive* {{AM}}*/*{{am}}*, supporting single-digit hour* {{h:mm}}*)*:
##** {{..date..[separator]hh:mm AM}}
##** {{..date..[separator]hh,mm AM}}
##** {{..date..[separator]hh mm AM}}
##** {{..date..[separator]hhmm AM}}
##* *12-Hour PM Formats (Case-Insensitive* {{PM}}*/*{{pm}}*, supporting single-digit hour* {{h:mm}}*)*:
##** {{..date..[separator]hh:mm PM}}
##** {{..date..[separator]hh,mm PM}}
##** {{..date..[separator]hh mm PM}}
##** {{..date..[separator]hhmm PM}}
## *Target Canonical Output*: All date+time inputs must strictly convert to: {{DD Mmm YYYY HH:mm}} (24-hour military format, e.g. {{05 Jun 2026 14:30}}).
## *Date-Only Input on Date+Time Fields (Auto-Default to 00:00)*: If a user enters a valid date-only string (matching any of the supported 16 date formats) into a field that requires Date and Time, the system automatically converts the date and appends the default time of {{00:00}} (e.g. {{5/6/26}} -> {{05 Jun 2026 00:00}}).
# *Copy & Paste Array Support*:
## When pasting tabular data from external spreadsheets (Excel) into table cells per [ETM-2615|https://pttep.atlassian.net/browse/ETM-2615] / [ETM-7351|https://pttep.atlassian.net/browse/ETM-7351], pasted date values adhering to any of the supported date or date-time formats are automatically converted to canonical format upon cell insertion.
## In multi-cell paste operations containing a mix of valid and invalid cells, valid cells are converted and populated successfully, while invalid date cells become blank with a red background (Partial Success).
# *Validation & Non-Matching String Fallback (Current Grid State Behavior)*:
## If the entered or pasted value cannot be matched to a valid calendar date or supported format (e.g. {{31/02/2026}}, invalid text string, unsupported delimiters like dot {{.}}, or unrecognized 5/7-digit numeric sequence):
##* *Cell Blank & Red Background*: The cell display text is cleared to *blank*, and the cell background turns *red* (indicating a validation error).
##* *Gantt Bar Preservation*: The adjacent Gantt chart bar position and duration do *not* change (preserved based on the prior valid schedule in memory).
##* *Edit Mode Prior-Value Pre-fill*: When the user double-clicks the cell to re-enter edit mode, the input field automatically pre-fills with the *prior valid date value*.
##* *Save Button Guard*: The page-level {{[ 💾 Save ]}} button is *disabled* while any cell remains in a validation error state.
## Emptying or clearing the cell (deleting all content) is treated as an intentional cell clear action, leaving the cell blank with a red background, and disabling {{[ 💾 Save ]}} until a valid date is provided.

----

*UI Design*

* *Design System*: Built using PTTEP Nualta Design System table cell inputs.

----

## Comments (before 2026-11-12T13:25)

### Thanawat Chongphipatmongkol, 2026-11-05T10:49

\[Update - Sprint 25 Grooming / Requirements Refinement\]  
Summary of Acceptance Criteria and Specification Updates:

1\. Data Source:  
\- Removed local Business Rule reference; retained canonical Server Timezone (Asia/Bangkok, UTC+7).

2\. AC 1 (Trigger Lifecycle):  
\- Explicitly clarified that leading and trailing whitespaces are automatically trimmed prior to evaluation.

3\. AC 2 (Supported Date-Only Syntaxes):  
\- Corrected typos in Hyphen and Space delimiters: updated to DD-MM-YY and DD MM YY (aligned with 2026-10-27 meeting notes).  
\- Clarified support for mixed single/double-digit day and month combinations (\[D\]D/\[M\]M, e.g., 5/06/2026, 05-6-2026).  
\- Specified 6-digit compact numeric precedence: calendar feasibility is prioritized; if ambiguous between DDMMYY and DMYYYY, DDMMYY (21st century 2-digit year) takes precedence.

4\. AC 3 (Supported Date + Time Syntaxes):  
\- Added standard 24-hour colon format: ..date..\[separator\]hh:mm (e.g., 5/6/26, 14:30 or 5/6/26 14:30).  
\- Clarified that both Comma (, ) and Space ( ) are accepted as separators between date and time components.  
\- Clarified that 12-hour AM/PM matching is case-insensitive (AM/PM/am/pm) and supports single-digit hours (h:mm).  
\- Added AC 3.3: Entering date-only inputs into Date+Time fields automatically defaults and appends time to 00:00 (e.g., 5/6/26 -> 05 Jun 2026 00:00).

5\. AC 4 (Copy & Paste Array Support):  
\- Clarified Partial Success behavior: valid cells are converted and populated, while invalid date cells become blank with red background.

6\. AC 5 (Validation & Non-Matching String Fallback):  
\- Aligned with current Shutdown Logic grid behavior: typing or pasting an invalid format clears the cell to blank with red background, preserves the adjacent Gantt bar unchanged, and pre-fills the prior valid date value upon double-clicking to re-enter edit mode.  
\- Note: Future cross-module harmonization (direct revert without intermediate blank/red state) logged in pending improvements backlog.

