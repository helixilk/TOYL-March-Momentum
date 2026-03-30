# STATE — TOYL: The Other Yoga Life

**Last updated:** 2026-03-30
**Session:** Phase 1 plan 01-01 execution complete

---

## Project Reference

**Core value:** Visitors submit their contact info and enter an automated nurture sequence that converts them into paying students.

**Current focus:** Phase 2 — EspoCRM integration (Phase 1 complete)

**Stack:** React 18 + TypeScript + Vite + Tailwind v4, static SPA deployment

---

## Current Position

**Active phase:** Phase 2 — EspoCRM
**Active plan:** None (awaiting Phase 2 plan execution)
**Status:** Phase 1 Complete

```
Phase 1 [Testing]       ██████████  Complete
Phase 2 [EspoCRM]       ░░░░░░░░░░  Pending
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

### Known Constraints

- Hosting environment TBD — serverless function must be compatible (Netlify/Vercel functions preferred)
- EspoCRM API key must never appear client-side
- Analytics IDs (GTM container ID, GA4 measurement ID, Meta Pixel ID, LinkedIn Partner ID) must be provided before Phase 3 can ship
- No waitlist form component exists yet — needs to be built in Phase 2
- No server-side function infrastructure exists yet — needs to be established in Phase 2

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

### Blockers

None. Phase 2 requires hosting environment decision before serverless proxy can be implemented.

### Todos

- [ ] Confirm hosting provider (Netlify vs Vercel) before Phase 2 plan is executed
- [ ] Collect GTM container ID, GA4 measurement ID, Meta Pixel ID, LinkedIn Partner ID before Phase 3 executes

---

## Session Continuity

**Last session:** 2026-03-30
**Stopped at:** Completed 01-01-PLAN.md (verify-and-merge testing baseline)
**Resume file:** None

To resume work:
1. Check which phase is active above
2. Read `.planning/ROADMAP.md` for phase goals and success criteria
3. Check the open PR for the active phase on GitHub (#2 for EspoCRM)
4. Confirm hosting provider decision before executing Phase 2 plan
5. Run `npm test` to verify regression baseline before starting new work

---

*State initialized: 2026-03-29 after roadmap creation*
*Updated: 2026-03-30 after Phase 1 plan 01-01 completion*
