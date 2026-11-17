# ETM-8391 Questions for BA
Story: [Improvement] View Worklist Table - Remark Column Filter

1. **Saved filter.** Before this release a user may have saved the Remark filter as text (Contains / Blank / Not blank). What should happen to that saved filter and to its URL parameter after release: reset, converted to the checklist, or an error?
2. **Blank rule.** Blank is an empty Remark, a Remark of only spaces, or exactly `-`. Is a Remark such as `- ` (dash plus space), ` - ` or `--` also Blank? Our assumption: only empty, whitespace-only and exactly `-` are Blank.
3. **Sort position.** Where should Thai text, symbols (`#`, `(`) and emoji sit relative to English letters? Our assumption: we only check that the order equals the system-wide `localeCompare('en', { numeric: true })` order used by other columns.
4. **Search box inside the filter.** Is it a case-insensitive "contains" search? Does Select All apply only to the searched results? Our assumption: same as the other columns.
5. **Source of options.** Do the options come from all works in the worklist, or only from works left after other column filters or the quick search? Our assumption: all works in the worklist (AC 2 says "found in the worklist").
6. **Nothing ticked.** When no option is ticked, does the table show no rows or all rows? Our assumption: same as the other columns.
7. **Design.** The reference mockup is "to be provided". What is the exact label of the `-` option, and is the hover form (tooltip) defined?
