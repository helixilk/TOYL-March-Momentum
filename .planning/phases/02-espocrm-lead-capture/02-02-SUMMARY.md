---
phase: 02-espocrm-lead-capture
plan: 02
subsystem: serverless-function
tags: [netlify-functions, espocrm, api-proxy, typescript, security]

requires: [02-01-netlify-infrastructure]
provides:
  - netlify/functions/submit-lead.mts — serverless proxy that creates EspoCRM Lead records
  - Server-side validation (lastName + email required, 400 on failure)
  - Env var guard (500 if ESPOCRM_API_KEY or ESPOCRM_BASE_URL missing)
  - AbortSignal.timeout(8000) with 504 on timeout, 502 on CRM non-2xx
  - UTM parameter capture in Lead description field
  - CORS header on all responses
affects: [02-03-waitlist-form, 02-06-e2e-testing]

tech-stack:
  added: []
  patterns: [modern Netlify function format (default export + Request/Response), process.env for secrets, AbortSignal.timeout for fetch timeout]

key-files:
  created:
    - netlify/functions/submit-lead.mts
  modified: []

key-decisions:
  - "Modern Netlify function format used (default export, .mts extension) — legacy exports.handler Lambda format avoided per plan"
  - "AbortSignal.timeout(8000) catches both AbortError and TimeoutError name variants for cross-runtime compatibility"
  - "source field set to exactly 'Web Site' (with space) — required by EspoCRM enum"
  - "emailAddress used (not email) — EspoCRM field name for the Lead entity"
  - "description field set to undefined (not empty string) when no UTM params present — avoids blank field in CRM"

patterns-established:
  - "All CRM credentials accessed only via process.env inside the serverless function — never in src/"
  - "X-Api-Key header used for EspoCRM authentication (API key auth, not Basic)"
  - "CORS header '*' on all responses — supports local dev and future domain changes without function changes"

duration: ~5 minutes
completed: 2026-03-30
---

# Phase 2 Plan 02: Serverless Proxy Function Summary

**Typed Netlify serverless function at netlify/functions/submit-lead.mts — validates input server-side, creates EspoCRM Lead via X-Api-Key with source "Web Site" and UTM params in description, returns typed errors for all failure modes, zero credentials exposed to browser.**

## Performance
- Duration: ~5 minutes
- Tasks: 1
- Files created: 1 (netlify/functions/submit-lead.mts)
- Files modified: 0

## Accomplishments
- Created `netlify/functions/submit-lead.mts` using modern Netlify function format (default export, Request/Response, .mts)
- Implemented 405 method guard, JSON parse with error handling, 400 validation for missing lastName/email
- Added 500 guard for missing ESPOCRM_API_KEY or ESPOCRM_BASE_URL env vars (prevents silent misconfiguration)
- EspoCRM Lead POST uses correct field names: `emailAddress` (not `email`), `source: "Web Site"` (enum match)
- AbortSignal.timeout(8000) wraps the CRM fetch — catches AbortError/TimeoutError and returns 504
- 502 returned on any non-2xx EspoCRM response
- UTM parameters written to Lead `description` field when present; `undefined` when absent (no empty string)
- CORS header `Access-Control-Allow-Origin: *` on all responses
- TypeScript compiles clean (`npx tsc --noEmit` — zero errors)
- `ESPOCRM_API_KEY` confirmed absent from all files under `src/`

## Task Commits
1. **Task 1: Create netlify/functions/submit-lead.mts** — `ee05b9d` (feat)

## Files Created/Modified
- `netlify/functions/submit-lead.mts` — created; full serverless proxy with typed default export

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Modern default-export format (.mts) | Legacy exports.handler is being deprecated by Netlify in 2025; .mts extension signals modern ES module function |
| AbortSignal.timeout vs setTimeout+controller | AbortSignal.timeout is cleaner and supported in Node 18+; catches both AbortError and TimeoutError names for cross-runtime safety |
| source: "Web Site" with space | EspoCRM Lead source is a string enum — value must match exactly or CRM rejects/silently ignores it |
| emailAddress not email | EspoCRM Lead entity field name; using wrong name creates a Lead with no email address |
| description: undefined when no UTM | Avoids empty description field in CRM; only populated when at least utmSource is present |

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

- `npx tsc --noEmit` — passed, zero errors
- `grep -r "ESPOCRM_API_KEY" src/` — returned nothing (clean)
- File `netlify/functions/submit-lead.mts` exists with `X-Api-Key` header and `process.env.ESPOCRM_API_KEY` access
- End-to-end curl testing against live EspoCRM deferred to Plan 02-06 (requires real ESPOCRM_API_KEY + ESPOCRM_BASE_URL)

## User Setup Required

Before end-to-end testing in Plan 02-06:

1. Copy `.env.local.example` to `.env.local` and fill in:
   - `ESPOCRM_API_KEY` — API key from EspoCRM Admin > API Keys
   - `ESPOCRM_BASE_URL` — root URL of the EspoCRM instance (e.g. `https://crm.example.com`)
2. In Netlify dashboard: Site Configuration > Environment Variables, add both vars scoped to **Functions**

## Next Phase Readiness
- `/.netlify/functions/submit-lead` endpoint is ready to receive POST requests from the waitlist form (Plan 02-03)
- All error codes defined: 400 (validation), 405 (method), 500 (config), 502 (CRM error), 504 (timeout), 200 (success)
- No blockers for Plan 02-03 (waitlist form component)

---
*Phase: 02-espocrm-lead-capture*
*Completed: 2026-03-30*
