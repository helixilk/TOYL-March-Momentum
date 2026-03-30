---
phase: 02-espocrm-lead-capture
plan: 03
subsystem: client-ui
tags: [react, typescript, form, utm, waitlist, tailwind]

requires: [02-01-netlify-infrastructure]
provides:
  - src/services/waitlistService.ts — fetch wrapper POSTing to /.netlify/functions/submit-lead
  - src/components/WaitlistForm.tsx — form UI with idle/loading/success/error states
affects: [02-04-unit-tests, phase-03-analytics]

tech-stack:
  added: []
  patterns: [controlled-form-state with useState, UTM capture via useMemo, service-layer abstraction for fetch]

key-files:
  created:
    - src/services/waitlistService.ts
    - src/components/WaitlistForm.tsx
  modified: []

key-decisions:
  - "WaitlistForm imports submitLead from waitlistService — network logic fully delegated to service layer"
  - "UTM params read via useMemo (synchronous, no side effects) rather than useEffect"
  - "aria-busy=true on submit button during loading state for screen reader accessibility"
  - "Error state preserves all form field values — user never loses their input on retry"
  - "No ESPOCRM credentials or VITE_-prefixed vars in either client-side file"

patterns-established:
  - "Service layer (waitlistService) owns fetch URL and error mapping — component stays UI-only"
  - "Four-state form pattern: idle → loading → success/error"

duration: ~4 minutes
completed: 2026-03-30
---

# Phase 2 Plan 03: Waitlist Form Component Summary

**Waitlist client layer complete: waitlistService wraps fetch to /.netlify/functions/submit-lead and WaitlistForm manages four UI states (idle/loading/success/error) with accessible labeled fields, UTM capture, and no EspoCRM credentials anywhere in src/.**

## Performance
- Duration: ~4 minutes
- Tasks: 2
- Files created: 2 (waitlistService.ts, WaitlistForm.tsx)
- Files modified: 0

## Accomplishments

### Task 1: Create waitlistService.ts
Created a thin fetch wrapper at `src/services/waitlistService.ts`:
- Exports `WaitlistPayload` interface with `firstName`, `lastName`, `email`, and optional `utmSource`, `utmMedium`, `utmCampaign` fields
- Exports `submitLead(payload)` that POSTs JSON to `/.netlify/functions/submit-lead`
- Throws `Error` with server-provided message on non-2xx response, falling back to "Submission failed. Please try again."
- Contains zero references to ESPOCRM credentials or VITE_-prefixed environment variables

### Task 2: Create WaitlistForm.tsx
Created the form component at `src/components/WaitlistForm.tsx`:
- Four UI states handled: idle (form visible), loading (button disabled + aria-busy), success (confirmation panel replaces form), error (error message shown, form values preserved)
- Three accessible labeled fields: `<label htmlFor="firstName">` + `<input id="firstName">`, lastName, email (all htmlFor/id paired)
- UTM params captured synchronously at mount via `React.useMemo` reading `window.location.search`
- Submit handler: prevents default, sets loading state, awaits `submitLead`, branches on success/error
- Styled with Tailwind v4 utility classes consistent with existing Button.tsx viridian palette
- Exports both named `WaitlistForm` and default export

## Task Commits
1. **Task 1: Create waitlistService fetch wrapper** — `60391f7` (feat)
2. **Task 2: Create WaitlistForm component with 4 UI states** — `7b7cd82` (feat)

## Files Created
- `src/services/waitlistService.ts` — exports `WaitlistPayload` interface and `submitLead` async function
- `src/components/WaitlistForm.tsx` — exports `WaitlistForm` component (default + named)

## Verification Results
- `npx tsc --noEmit` — passes with zero errors
- `grep -r "ESPOCRM" src/` — returns nothing (exit 1)
- `grep "submitLead" src/components/WaitlistForm.tsx` — confirms service import and usage
- `grep "\.netlify/functions" src/components/WaitlistForm.tsx` — returns nothing (URL lives only in service)

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Service layer owns the fetch URL | Component stays UI-only; URL change requires touching one file |
| useMemo for UTM capture, not useEffect | Synchronous read requires no side effects; simpler and immediately available |
| aria-busy on submit button | Screen readers announce loading state without additional live regions |
| Error preserves field values | UX: user can correct a typo or retry without re-entering all fields |
| Named + default export on WaitlistForm | Allows both import styles for consumer flexibility |

## Deviations from Plan

None — plan executed exactly as written.

## Next Phase Readiness
- WaitlistForm is ready to be placed in App.tsx or any marketing section
- Unit tests for both files are the next step (Plan 04)
- The full data path is complete once Plan 02 (serverless function) is also merged: WaitlistForm → waitlistService → submit-lead function → EspoCRM Lead
- No blockers for downstream plans

---
*Phase: 02-espocrm-lead-capture*
*Completed: 2026-03-30*
