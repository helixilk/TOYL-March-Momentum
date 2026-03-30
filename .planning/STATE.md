# STATE — TOYL: The Other Yoga Life

**Last updated:** 2026-03-30
**Session:** Phase 2 plan 02-02 execution complete

---

## Project Reference

**Core value:** Visitors submit their contact info and enter an automated nurture sequence that converts them into paying students.

**Current focus:** Phase 2 — EspoCRM integration (Plan 02-02 complete)

**Stack:** React 18 + TypeScript + Vite + Tailwind v4, Netlify deployment with serverless functions

---

## Current Position

**Active phase:** Phase 2 — EspoCRM
**Active plan:** 02-02 complete — awaiting Phase 2 plan 02-03 execution
**Status:** Phase 2 In Progress

```
Phase 1 [Testing]       ██████████  Complete
Phase 2 [EspoCRM]       ██████░░░░  In Progress (2/6 plans done)
Phase 3 [Analytics]     ░░░░░░░░░░  Pending
```

**Open PRs:**

- `feature/espocrm-integration` (#2) — Phase 2 work
- `feature/analytics-tracking` (#3) — Phase 3 work

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases total | 3 |
| Phases complete | 1 |
| Requirements total (v1) | 16 |
| Requirements complete | 4 (Phase 1: TEST-01, TEST-02, TEST-03, TEST-04) |
| Requirements in progress | Phase 2 underway |

---

## Accumulated Context

### Decisions Made

| Decision | Rationale |
|----------|-----------|
| GTM as tag management layer | Single code change; all future tags managed in dashboard without code deploys |
| EspoCRM via serverless API proxy | Keeps API key server-side; no credentials exposed to browser |
| Three separate PR branches per milestone | Clean review history; each feature independently mergeable |
| Testing first, then CRM, then analytics | Foundation before features; analytics validates CRM conversions |
| GEMINI_API_KEY=placeholder-key-ci for E2E | Prevents geminiService constructor throw in Playwright webServer; no real API calls made |
| vi.mock for geminiService in unit tests | Isolates service layer; unit tests run without any API key requirement |
| Netlify as hosting provider | Confirmed by @netlify/vite-plugin + netlify.toml setup in Phase 2 plan 01 |
| ESPOCRM_* vars not VITE_-prefixed | VITE_-prefixed vars are injected into the browser bundle; API keys must never reach the client |
| Env vars in Netlify dashboard (Functions scope) | netlify.toml [environment] block is build-time only; runtime function secrets go in dashboard |
| source: "Web Site" (with space) | EspoCRM Lead source is a string enum — must match exactly or CRM silently ignores it |
| emailAddress not email in CRM payload | EspoCRM Lead entity uses emailAddress as the field name; email would create a Lead with no email |
| AbortSignal.timeout(8000) for CRM fetch | Prevents hung requests from blocking the serverless function; returns 504 on timeout |

### Known Constraints

- EspoCRM API key must never appear client-side
- Analytics IDs (GTM container ID, GA4 measurement ID, Meta Pixel ID, LinkedIn Partner ID) must be provided before Phase 3 can ship
- No waitlist form component exists yet — needs to be built in Phase 2 plan 03
- Netlify functions live at `netlify/functions/` (relative to project root)

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Application shell — owns all sections and modal state |
| `src/components/` | Button, SectionHeading, FAQ, DailyIntention, LegalModal |
| `src/services/geminiService.ts` | Gemini API integration with fallback |
| `src/constants.tsx` | App-wide literals (colours, URLs, program metadata) |
| `index.html` | Entry point — GTM snippet will be added here in Phase 3 |
| `playwright.config.ts` | E2E config — webServer env block passes GEMINI_API_KEY |
| `.github/workflows/test.yml` | CI: runs unit and E2E jobs on every PR push |
| `netlify.toml` | Build config and SPA redirect rule (status=200 catch-all) |
| `vite.config.ts` | Vite config with @netlify/vite-plugin wiring local function proxy |
| `.env.local.example` | Template for ESPOCRM_API_KEY and ESPOCRM_BASE_URL (no VITE_ prefix) |
| `netlify/functions/submit-lead.mts` | Serverless proxy: validates input, creates EspoCRM Lead via X-Api-Key |

### Blockers

None. Function infrastructure and serverless proxy are ready.

User must provide real ESPOCRM_API_KEY and ESPOCRM_BASE_URL before Phase 2 plan 06 (end-to-end testing) can run.

### Todos

- [x] Confirm hosting provider (Netlify) — resolved in Phase 2 plan 01
- [ ] User: create EspoCRM API key and set ESPOCRM_API_KEY + ESPOCRM_BASE_URL in Netlify dashboard (Functions scope)
- [ ] Collect GTM container ID, GA4 measurement ID, Meta Pixel ID, LinkedIn Partner ID before Phase 3 executes

---

## Session Continuity

**Last session:** 2026-03-30
**Stopped at:** Completed 02-02-PLAN.md (serverless-proxy-function)
**Resume file:** None

To resume work:

1. Check which phase is active above
2. Execute Phase 2 plan 03 (waitlist form component)
3. Ensure ESPOCRM_API_KEY and ESPOCRM_BASE_URL are set before plan 06 end-to-end testing
4. Check the open PR for Phase 2 on GitHub (#2 for EspoCRM)

---

*State initialized: 2026-03-29 after roadmap creation*
*Updated: 2026-03-30 after Phase 2 plan 02-02 completion*
