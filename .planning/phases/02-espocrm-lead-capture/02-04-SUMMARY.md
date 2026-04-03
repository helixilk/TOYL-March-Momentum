---
phase: 02-espocrm-lead-capture
plan: 04
subsystem: testing
tags: [vitest, playwright, testing-library, unit-tests, e2e, waitlist, fetch-mock]

requires: [02-03-waitlist-form-component]
provides:
  - src/tests/WaitlistForm.test.tsx — unit tests for all four WaitlistForm states
  - e2e/waitlist.spec.ts — E2E test intercepting submit-lead with page.route()
affects: [02-05-app-integration, 02-06-end-to-end-smoke]

tech-stack:
  added: []
  patterns: [vi.stubGlobal for fetch isolation, page.route() for E2E network interception]

key-files:
  created:
    - src/tests/WaitlistForm.test.tsx
    - e2e/waitlist.spec.ts
  modified: []

key-decisions:
  - "vi.stubGlobal('fetch') used instead of vi.mock for waitlistService — tests the real service layer, only isolates the network"
  - "vi.unstubAllGlobals() in afterEach keeps each test hermetic regardless of execution order"
  - "act() wraps fetch resolution in loading-state test to avoid React state-update warnings"
  - "page.route() registered before page.goto() so no real network traffic escapes during E2E"
  - "E2E test navigates to /#waitlist to scroll to the form section (per plan 02-05 integration)"

patterns-established:
  - "vi.stubGlobal('fetch') pattern for unit-testing components that call fetch directly through a service"
  - "page.route() before page.goto() pattern ensures route mock is active before any requests fire"

duration: ~2 minutes
completed: 2026-03-30
---

# Phase 2 Plan 04: WaitlistForm Unit and E2E Tests Summary

**WaitlistForm test coverage locked in: five unit tests cover all four form states using vi.stubGlobal('fetch') for full network isolation, plus one E2E test using page.route() to intercept the serverless function call and assert the success message.**

## Performance
- Duration: ~2 minutes
- Tasks: 2
- Files created: 2 (WaitlistForm.test.tsx, waitlist.spec.ts)
- Files modified: 0

## Accomplishments

### Task 1: WaitlistForm unit tests (src/tests/WaitlistForm.test.tsx)

Five unit tests written following the project's existing vitest + @testing-library/react pattern:

1. **Idle render** — asserts all three labeled inputs (First Name, Last Name, Email) and the "Join the Waitlist" submit button are present in the document.
2. **Loading state** — types into all fields, submits, asserts button text changes to "Joining..." and the button is disabled. Uses a never-resolving Promise to hold the loading state open, then resolves inside `act()` for clean teardown.
3. **Success state** — mock resolves `{ ok: true, json: () => ({ success: true }) }`, asserts "You're on the list!" heading appears.
4. **Error state** — mock resolves `{ ok: false, json: () => ({ error: "CRM error" }) }`, asserts the `[role="alert"]` element contains "CRM error".
5. **Network rejection** — mock rejects with `new Error("Network failure")`, asserts `[role="alert"]` shows "Network failure".

All tests use `vi.stubGlobal('fetch', vi.fn())` and restore with `vi.unstubAllGlobals()` in `afterEach`. No real HTTP calls possible during unit test runs.

### Task 2: Waitlist E2E test (e2e/waitlist.spec.ts)

One E2E test that:
- Calls `page.route('**/.netlify/functions/submit-lead', ...)` before `page.goto('/#waitlist')` to intercept the serverless call and return `{ success: true }` with status 200
- Fills all three form fields using `page.fill('[id=firstName]', ...)` etc.
- Clicks the "Join the Waitlist" button
- Asserts `page.getByText(/you're on the list/i)` becomes visible

The route intercept ensures no real EspoCRM API call is made during automated test runs.

## Task Commits
1. **Task 1: WaitlistForm unit tests** — `8f1ab4f` (test)
2. **Task 2: E2E test for waitlist form flow** — `e28d63a` (test)

## Files Created
- `src/tests/WaitlistForm.test.tsx` — five unit tests; contains `vi.stubGlobal`
- `e2e/waitlist.spec.ts` — one E2E test; contains `page.route`

## Verification Results
- `npm run test:unit` — exits 0, 32 tests passed across 6 test files
- No `act()` warnings in final test run
- E2E file exists with `page.route` intercept pattern

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| vi.stubGlobal('fetch') over vi.mock for service | Tests the real waitlistService error-mapping path; only the network is isolated |
| vi.unstubAllGlobals() in afterEach | Prevents test-order coupling; each test starts with a clean global fetch |
| act() wrap on fetch resolution in loading test | Prevents "update not wrapped in act()" React warning when promise resolves after assertion |
| page.route() before page.goto() | Guarantees the mock is registered before any request is made; prevents real network traffic |
| Navigate to /#waitlist | Consistent with App.tsx section id from plan 02-05; scrolls to form without extra waiting |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] React act() warning on loading-state test**

- **Found during:** Task 1 verification run
- **Issue:** The loading-state test resolved the fetch Promise after asserting button state, causing React to log "An update to WaitlistForm inside a test was not wrapped in act(...)"
- **Fix:** Wrapped `resolveFetch(...)` call in `await act(async () => { ... })` so React processes the state transition synchronously within the act boundary
- **Files modified:** src/tests/WaitlistForm.test.tsx
- **Commit:** part of `8f1ab4f`

## Next Phase Readiness
- Unit tests will catch any regression to WaitlistForm's four-state contract
- E2E test is ready; it will run green once plan 02-05 (App.tsx integration) lands and the form is mounted on the page
- Full `npm test` suite will be green after plans 02-04 and 02-05 are both merged
- No blockers for plan 02-05 (App.tsx integration) or plan 02-06 (end-to-end smoke)

---
*Phase: 02-espocrm-lead-capture*
*Completed: 2026-03-30*
