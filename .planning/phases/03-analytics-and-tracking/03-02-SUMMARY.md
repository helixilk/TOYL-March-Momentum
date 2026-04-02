---
phase: 03-analytics-and-tracking
plan: 02
subsystem: analytics
tags: [gtm, datalayer, analytics, ga4, react, typescript]

# Dependency graph
requires:
  - phase: 03-01
    provides: GTM snippet in index.html, window.dataLayer type declaration in src/types/gtm.d.ts, Button onClick fix

provides:
  - cta_click dataLayer event on all 3 CTA buttons (nav, hero, final_cta locations)
  - form_submit dataLayer event on successful waitlist form submission
  - Defensive dataLayer initialization pattern preventing crashes when GTM is blocked

affects:
  - 03-03 (GTM configuration — these are the events GTM will route to GA4)
  - Future analytics reporting — event names and properties are now the canonical tracking contract

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Defensive dataLayer push: (window.dataLayer = window.dataLayer || []).push() — initializes array if GTM blocked"
    - "cta_location property identifies click source for funnel segmentation"
    - "form_submit fires only in try-block after success — never on error path"

key-files:
  created: []
  modified:
    - src/App.tsx
    - src/components/WaitlistForm.tsx

key-decisions:
  - "Defensive dataLayer initialization (window.dataLayer = window.dataLayer || []).push() used for all pushes — silently no-ops when GTM is blocked by ad blockers"
  - "form_submit placed after submitLead() and before setFormState('success') — strict ordering ensures event fires only on confirmed success"
  - "No analytics library import — window.dataLayer typed from existing gtm.d.ts declaration"

patterns-established:
  - "All dataLayer pushes use defensive initialization pattern matching GTM's own snippet idiom"
  - "Event schema: { event: string, ...metadata } — GTM triggers filter by event name"

# Metrics
duration: 3min
completed: 2026-04-02
---

# Phase 3 Plan 02: Wire dataLayer Events Summary

**cta_click (3 CTA buttons) and form_submit (waitlist success) wired to dataLayer using defensive push pattern — GTM can now route both events to GA4 without further code changes.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-02T09:14:25Z
- **Completed:** 2026-04-02T09:17:45Z
- **Tasks:** 2 completed
- **Files modified:** 2

## Accomplishments

- All 3 CTA buttons (nav, hero, final_cta) push `{ event: 'cta_click', cta_location: '...' }` to dataLayer on click
- Successful waitlist form submissions push `{ event: 'form_submit', form_name: 'waitlist' }` after `submitLead` resolves
- Failed submissions trigger no dataLayer push — error path is clean
- Defensive initialization pattern applied to all 4 push calls — no crash when GTM snippet is absent or blocked

## Task Commits

Each task was committed atomically:

1. **Task 1: Add cta_click dataLayer events to all CTA buttons in App.tsx** - `c6dd4a5` (feat)
2. **Task 2: Add form_submit dataLayer event to WaitlistForm on success** - `fbef79f` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/App.tsx` - Added onClick handlers with dataLayer.push to all 3 Button instances (nav, hero, final_cta)
- `src/components/WaitlistForm.tsx` - Added dataLayer.push in handleSubmit try-block between submitLead and setFormState("success")

## Decisions Made

- **Defensive dataLayer initialization:** Used `(window.dataLayer = window.dataLayer || []).push(...)` rather than `window.dataLayer.push(...)` — matches GTM's own snippet idiom and silently no-ops when GTM is blocked by ad blockers
- **Strict placement of form_submit:** After `await submitLead()` and before `setFormState("success")` in the try-block only — guarantees the event tracks a confirmed successful CRM submission, not UI state

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] window.dataLayer crash when GTM not loaded**

- **Found during:** Task 2 (WaitlistForm form_submit implementation)
- **Issue:** `window.dataLayer.push(...)` throws `Cannot read properties of undefined (reading 'push')` when `window.dataLayer` is not initialized — happens in test environments and when GTM is blocked by ad blockers. The plan stated the push "silently fails" when blocked, but that's only true with the defensive initialization pattern.
- **Fix:** Changed all 4 dataLayer push calls (3 in App.tsx, 1 in WaitlistForm.tsx) from `window.dataLayer.push(...)` to `(window.dataLayer = window.dataLayer || []).push(...)` — the standard GTM-recommended defensive pattern
- **Files modified:** `src/App.tsx`, `src/components/WaitlistForm.tsx`
- **Verification:** All 32 unit tests pass including WaitlistForm success test; 19 E2E tests pass; build succeeds
- **Committed in:** `fbef79f` (part of Task 2 commit)
