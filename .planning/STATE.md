# STATE — TOYL: The Other Yoga Life

**Last updated:** 2026-04-02
**Session:** Phase 3 complete — all 3 plans done, analytics stack verified live

---

## Project Reference

**Core value:** Visitors submit their contact info and enter an automated nurture sequence that converts them into paying students.

**Current focus:** All 3 phases complete

**Stack:** React 18 + TypeScript + Vite + Tailwind v4, Netlify deployment with serverless functions

---

## Current Position

**Active phase:** Phase 3 complete — Analytics
**Active plan:** 03-03 complete (all plans done)
**Status:** Phase 3 Complete — All phases complete

```
Phase 1 [Testing]       ██████████  Complete
Phase 2 [EspoCRM]       ██████████  Complete
Phase 3 [Analytics]     ██████████  Complete
```

**Open PRs:**

- `feature/espocrm-integration` (#2) — Phase 2 work (ready to merge)
- `feature/analytics-tracking` (#3) — Phase 3 work (ready to merge)

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases total | 3 |
| Phases complete | 3 |
| Requirements total (v1) | 16 |
| Requirements complete | 13 (Phase 1: TEST-01–04, Phase 2: CRM-01–06, Phase 3: ANALYTICS-01–03) |
| Requirements in progress | 0 |

---

## Accumulated Context

### Decisions Made

| Decision | Rationale |
|----------|-----------|
| GTM-MDXCVHSJ deployed to index.html | Real container ID provided by user; replaces placeholder in both head snippet and body noscript iframe |
| GA4 property G-DKE8295GJ4 | Measurement ID configured in GTM as GA4 Configuration tag |
| Meta Pixel 902073786190499 via GTM | Pixel configured via GTM Community Template; centralized in dashboard not hardcoded |
| LinkedIn Insight Tag skipped for now | Partner ID not available; can be added later via GTM dashboard without code deploy |
| GTM as tag management layer | Single code change; all future tags managed in dashboard without code deploys |
| GTM placeholder ID GTM-XXXXXXX in index.html | Real ID requires GTM account; placeholder keeps build passing until ID is available |
| window.dataLayer typed via DataLayerEvent interface | Avoids (window as any) casts in all component code; index signature allows arbitrary event properties |
| Button onClick fires before anchor navigation, no preventDefault | dataLayer.push is synchronous; GTM tag fires before browser navigates; no preventDefault needed |
| Defensive dataLayer push pattern | Silently no-ops when GTM is blocked by ad blockers; matches GTM's own snippet idiom; required for unit tests |
| form_submit placed after submitLead() and before setFormState("success") | Strict ordering ensures event only tracks confirmed CRM success, never error path |
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

### Analytics IDs Deployed

| Platform | ID | Status |
| -------- | -- | ------ |
| Google Tag Manager | GTM-MDXCVHSJ | Live in index.html |
| Google Analytics 4 | G-DKE8295GJ4 | Receiving pageviews and events |
| Meta Pixel | 902073786190499 | Firing on page load |
| LinkedIn Insight Tag | — | Skipped — add later via GTM dashboard |

### Known Constraints

- EspoCRM API key must never appear client-side
- LinkedIn Insight Tag not yet configured — requires Partner ID; add via GTM dashboard when available (no code deploy)

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Application shell — owns all sections, modal state, and cta_click dataLayer events |
| `src/components/` | Button, SectionHeading, FAQ, DailyIntention, LegalModal, WaitlistForm |
| `src/services/geminiService.ts` | Gemini API integration with fallback |
| `src/services/waitlistService.ts` | Fetch wrapper: POSTs to /.netlify/functions/submit-lead |
| `src/components/WaitlistForm.tsx` | Waitlist form UI with 4 states (idle/loading/success/error) + form_submit dataLayer event |
| `src/types/gtm.d.ts` | Global Window augmentation: window.dataLayer typed as DataLayerEvent[] |
| `src/constants.tsx` | App-wide literals (colours, URLs, program metadata) |
| `index.html` | Entry point — GTM snippet with real container ID GTM-MDXCVHSJ |
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
- [x] Collect GTM container ID, GA4 measurement ID, Meta Pixel ID — done (LinkedIn: skipped, add later via GTM dashboard)
- [x] Deploy GTM-MDXCVHSJ to index.html — done (commit feb6d2d)
- [x] Configure GTM dashboard (GA4 + Meta Pixel tags) and publish container — done
- [x] Human-verify all tags fire end-to-end — done (GA4 Realtime, Meta Pixel Helper, GTM Preview, GA4 DebugView all confirmed)
- [ ] Add LinkedIn Insight Tag — blocked on Partner ID; add via GTM dashboard when available

---

## Session Continuity

**Last session:** 2026-04-02
**Stopped at:** Completed 03-03-PLAN.md — Phase 3 fully complete
**Resume file:** None

All 3 phases complete. Next actions:

1. Merge `feature/analytics-tracking` PR (#3) into main
2. Merge `feature/espocrm-integration` PR (#2) into main
3. Deploy to Netlify production
4. Add LinkedIn Insight Tag via GTM dashboard when Partner ID is available (no code deploy needed)

---

*State initialized: 2026-03-29 after roadmap creation*
*Phase 1 complete: 2026-03-30*
*Phase 2 complete: 2026-04-02*
*Phase 3 complete: 2026-04-02*
