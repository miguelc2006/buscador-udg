---
name: diagnose
description: Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument → fix → regression-test. Use when user says "diagnose this" / "debug this", reports a bug, says something is broken/throwing/failing, or describes a performance regression.
---

# Diagnose

A discipline for hard bugs. Skip phases only when explicitly justified.

## Phase 1 — Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, you will find the cause.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one — try them in roughly this order

1. **Failing test** at whatever seam reaches the bug
2. **HTTP script** against a running dev server
3. **CLI invocation** with a fixture input
4. **Headless browser script** — drives the UI, asserts on DOM/console/network
5. **Replay a captured trace** — save a real request to disk, replay in isolation
6. **Throwaway harness** — minimal subset of the system that exercises the bug
7. **Property / fuzz loop** — 1000 random inputs, look for failure mode
8. **Bisection harness** — automate "boot at state X, check, repeat"
9. **Differential loop** — same input, old vs new version, diff outputs

Build the right feedback loop, and the bug is 90% fixed.

## Phase 2 — Minimise

Reduce the reproduction to its simplest form:
- Fewest steps
- Smallest input
- Fewest dependencies
- Most direct path to the bug

## Phase 3 — Hypothesise

Generate hypotheses based on code analysis:
- Read the code path from entry to failure
- Form 2-3 hypotheses
- Validate each with evidence
- Discard unsupported hypotheses
- Identify root cause

## Phase 4 — Fix

1. Implement minimal fix
2. Verify fix resolves the bug
3. Verify no regressions introduced
4. Search for diversified bugs (same logic in other places)

## Phase 5 — Regression test

1. Run existing tests
2. Add test for the fixed bug
3. Test edge cases
4. Document the fix
