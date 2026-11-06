# Design techniques

Use these in Step 4 (Coverage Map). Write the technique name next to each
row so the Reviewer can see why a case exists.

## Edge values (boundary)
For any limit (length, amount, count, date range, percent):
- exactly on the limit
- one step below
- one step above
- the smallest and the largest allowed
- zero, empty, and negative where they make sense

## Input groups (equivalence)
Split inputs into groups that should behave the same: valid, invalid,
empty, wrong type. Test one or two from each group, not every value.

## Condition table (decision table)
When the result depends on several conditions:
1. List every condition and every possible result.
2. Make a table of all combinations.
3. Remove combinations that cannot happen (write why).
4. Every remaining row is one expected result.

## State changes
When something moves through statuses (draft, submitted, approved, closed):
- every allowed change
- every change that must be blocked
- going back, and repeating the same change twice
- what each status allows the user to do (edit, delete, view only)

## Roles and permission
For every role: can open, can see, can change, can delete, cannot do. Also
test a role that has no access trying a direct link.

## Error guessing (experience)
Think where it usually breaks: first and last item, empty list, one item only,
very long text, duplicate data, double click, Back and Refresh, slow
connection, expired login, two tabs, two users. Use `lessons-learned.md`.

## Real-user view
Pick a real user type (new, in a hurry, careless, on a phone, uses the
keyboard only). Write at least one case for how that person would really use
it, not how it was designed to be used.

## Screen states
For every screen: normal, empty, loading, error, disabled, read-only, no
permission, too much data, too little data.

## Combinations
When many options can be chosen together, do not test every combination.
Pick: each option alone, all together, and the pairs most likely to clash.
