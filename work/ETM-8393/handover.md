# ETM-8393 handover (closed 2026-11-25)

Card: Histogram tooltip (Capacity / Used Resource). Story **Ready for UAT**. Test Execution ETM-8828 **Done, 15/15 PASSED**.
15 linked Tests Closed (Done); [QA] subtasks ETM-8562, ETM-8563 Done (JQL check 2026-11-25).

- Data: Inactive plan copy "QA ETM-8393 Tooltip" (`ETM8393_PATH` in the PW repo `.env`), made through the UI, kept for retests (user, 2026-11-24). Details: test-data-needed.md sections 4-10. No `create: true` data file: the tests are read only (8820 confirms in the modal only, never saves).
- Spec: tests/fe/e2e/shutdownLogic/verifyShutdownLogicHistogramTooltip.spec.ts (ep-etm-fe-qa, branch wip/sprint26-specs, commits f65cc4f, fd5b3cb, not pushed). The histogram stays open in this spec (reason in its header).
- Re-run 2026-11-25: 15/15 passed (8819 flaky once, passed on re-run; 8820 script fix round 1, see script-fixes.md). Xray unchanged (already PASSED).
- Open: AC-2 rated weak although all its tests pass (qa-check strength warning), AC proven 3/4. Re-rate if the AC count matters.
