# Team nicknames: template

Copy this file to `.claude/team/people.local.md` (that file is git-ignored) and fill it in. One line per developer:
`nickname = name as it is in Jira (English)`. No account ids: the skill looks the id up fresh with `lookupJiraAccountId`.
Used by `log-defect-jira-etm` when you name an assignee by nickname, because Jira search does not understand Thai nicknames.

Example (not real people):

nick = Firstname Lastname
