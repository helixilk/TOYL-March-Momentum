# STATE — TOYL: The Other Yoga Life

**Last updated:** 2026-04-02
**Session:** Phase 2 complete — all 6 plans executed and verified

---

## Project Reference

**Core value:** Visitors submit their contact info and enter an automated nurture sequence that converts them into paying students.

**Current focus:** Phase 3 — Analytics and Tracking

**Stack:** React 18 + TypeScript + Vite + Tailwind v4, Netlify deployment with serverless functions

---

## Current Position

**Active phase:** Phase 3 — Analytics
**Active plan:** None (Phase 2 complete, Phase 3 not yet planned)
**Status:** Phase 2 Complete ✓

```
Phase 1 [Testing]       ██████████  Complete
Phase 2 [EspoCRM]       ██████████  Complete
Phase 3 [Analytics]     ░░░░░░░░░░  Pending
```

**Open PRs:**

- `feature/espocrm-integration` (#2) — Phase 2 work (ready to merge)
- `feature/analytics-tracking` (#3) — Phase 3 work

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases total | 3 |
| Phases complete | 2 |
| Requirements total (v1) | 16 |
| Requirements complete | 10 (Phase 1: TEST-01–04, Phase 2: CRM-01–06) |
| Requirements in progress | 0 |

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
| Service layer owns the fetch URL | WaitlistForm stays UI-only; URL change requires touching one file (waitlistService) |
| useMemo for UTM capture, not useEffect | Synchronous read requires no side effects; simpler and immediately available on first render |
| aria-busy on submit button | Screen readers announce loading state without additional live regions |
| Error state preserves field values | UX: user can correct a typo or retry without re-entering all fields |
| vi.stubGlobal('fetch') for unit tests | Tests real waitlistService error-mapping path while isolating network layer |
| page.route() before page.goto() in E2E | Ensures mock is registered before any request fires; prevents real EspoCRM calls |
| Object.assign(process.env, env) in vite.config.ts | Injects .env vars into Node.js process so Netlify function emulation reads them via process.env |
| .env gitignored (not .env.local only) | Prevents accidental credential commits; .env.local.example documents required vars |

### Known Constraints

- EspoCRM API key must never appear client-side
- Analytics IDs (GTM container ID, GA4 measurement ID, Meta Pixel ID, LinkedIn Partner ID) must be provided before Phase 3 can ship
- Netlify functions live at `netlify/functions/` (relative to project root)

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Application shell — owns all sections and modal state |
| `src/components/` | Button, SectionHeading, FAQ, DailyIntention, LegalModal, WaitlistForm |
| `src/services/geminiService.ts` | Gemini API integration with fallback |
| `src/services/waitlistService.ts` | Fetch wrapper: POSTs to /.netlify/functions/submit-lead |
| `src/components/WaitlistForm.tsx` | Waitlist form UI with 4 states (idle/loading/success/error) |
| `src/constants.tsx` | App-wide literals (colours, URLs, program metadata) |
| `index.html` | Entry point — GTM snippet will be added here in Phase 3 |
| `playwright.config.ts` | E2E config — webServer env block passes GEMINI_API_KEY |
| `.github/workflows/test.yml` | CI: runs unit and E2E jobs on every PR push |
| `netlify.toml` | Build config and SPA redirect rule (status=200 catch-all) |
| `vite.config.ts` | Vite config with @netlify/vite-plugin; Object.assign injects .env into process.env |
| `.env.local.example` | Template for ESPOCRM_API_KEY and ESPOCRM_BASE_URL (no VITE_ prefix) |
| `netlify/functions/submit-lead.mts` | Serverless proxy: validates input, creates EspoCRM Lead via X-Api-Key |

### Blockers

None.

### Todos

- [x] Confirm hosting provider (Netlify) — resolved in Phase 2 plan 01
- [x] Set ESPOCRM_API_KEY and ESPOCRM_BASE_URL — done, verified in Phase 2 plan 06
- [ ] Collect GTM container ID, GA4 measurement ID, Meta Pixel ID, LinkedIn Partner ID before Phase 3 executes

---

## Session Continuity

**Last session:** 2026-04-02
**Stopped at:** Phase 2 complete — all 6 plans executed, verified, ROADMAP and STATE updated
**Resume file:** None

To resume work:

1. Merge `feature/espocrm-integration` PR (#2) — Phase 2 work is ready
2. Collect analytics IDs (GTM, GA4, Meta Pixel, LinkedIn) before planning Phase 3
3. Run `/gsd:discuss-phase 3` or `/gsd:plan-phase 3` to begin analytics work

---

*State initialized: 2026-03-29 after roadmap creation*
*Phase 1 complete: 2026-03-30*
*Phase 2 complete: 2026-04-02*
