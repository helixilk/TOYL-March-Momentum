# Roadmap: TOYL — The Other Yoga Life

**Created:** 2026-03-29
**Depth:** Standard
**Milestones:** 3
**Phases:** 3
**Coverage:** 16/16 requirements mapped

## Overview

Three focused milestones convert the existing static marketing SPA into a lead-capture engine with full observability. Testing locks in a regression baseline first, CRM wires up the waitlist form to EspoCRM second, and analytics layers GTM/GA4/Meta/LinkedIn on top to measure every conversion.

---

## Phases

### Phase 1 — Testing

**Goal:** The codebase has a reliable, automated regression baseline that catches regressions before they reach production.

**Dependencies:** None — foundation work that unblocks all subsequent phases.

**Requirements:** TEST-01, TEST-02, TEST-03, TEST-04

**Status:** Complete ✓ (merged 2026-03-30)

**Plans:** 1 plan

Plans:

- [x] 01-01-PLAN.md — Verify E2E suite locally, confirm CI green, merge PR

#### Success Criteria

1. Running `npm test` (unit) and `npm run test:e2e` locally produces a green result across all 5 components and all specified E2E journeys (page load, CTA clicks, modals, FAQ accordion, mobile viewport).
2. A PR pushed to GitHub triggers CI automatically; both the unit and E2E jobs must pass before the PR can be considered ready to merge.
3. The Gemini service is never called during CI — a mock intercepts the call and the test suite completes without a real API key.
4. Each of the five existing components (Button, SectionHeading, DailyIntention, FAQ, LegalModal) has at least one unit/component test covering its primary render behavior.

---

### Phase 2 — EspoCRM Lead Capture

**Goal:** Visitors can join the waitlist through a form on the site, and their details are captured as a Lead in EspoCRM without ever exposing API credentials to the browser.

**Dependencies:** Phase 1 (test baseline must exist so CRM code ships with coverage).

**Requirements:** CRM-01, CRM-02, CRM-03, CRM-04, CRM-05, CRM-06

**Status:** Pending

#### Success Criteria

1. A visible waitlist form on the page accepts first name, last name, and email, and submits without a page reload.
2. After a successful submission, a Lead record appears in EspoCRM with source set to "Web Site" and any UTM parameters from the URL recorded in the lead data.
3. The EspoCRM API key is not present in any browser network request, JavaScript bundle, or client-side source — all CRM communication goes through a server-side proxy function.
4. The form communicates state clearly: a loading indicator while the request is in flight, a success confirmation after creation, and a human-readable error message if the request fails.
5. Lead creation in EspoCRM triggers the configured automated email sequence (verifiable by checking the Lead's workflow history in EspoCRM after a test submission).

---

### Phase 3 — Analytics and Tracking

**Goal:** All visitor traffic, page engagement, and waitlist conversion events are observable in GA4, Meta Ads Manager, and LinkedIn Campaign Manager without requiring future code deploys for tag changes.

**Dependencies:** Phase 2 (form_submit event requires the waitlist form to exist).

**Requirements:** ANL-01, ANL-02, ANL-03, ANL-04, ANL-05, ANL-06

**Status:** Pending

#### Success Criteria

1. The GTM container snippet is present in `index.html` (head snippet + noscript fallback), and Google Tag Assistant confirms the container fires on page load.
2. GA4 reports a pageview event for a test visit; the realtime report in GA4 shows the session within seconds of loading the page.
3. Meta Events Manager and LinkedIn Insight Tag Helper browser extensions confirm the Pixel and Insight Tag fire on page load, enabling retargeting audiences to populate.
4. Clicking any waitlist/join CTA button fires a `cta_click` custom event visible in the GTM Preview debug panel and in GA4 DebugView.
5. Completing a waitlist form submission fires a `form_submit` custom event visible in GTM Preview and GA4 DebugView, confirming end-to-end conversion tracking is wired.

---

## Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 — Testing | Automated regression baseline | TEST-01–04 | Complete ✓ |
| 2 — EspoCRM Lead Capture | Waitlist form → EspoCRM Lead | CRM-01–06 | Pending |
| 3 — Analytics and Tracking | GTM/GA4/Meta/LinkedIn observable | ANL-01–06 | Pending |

## Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| TEST-01 | Phase 1 | Complete |
| TEST-02 | Phase 1 | Complete |
| TEST-03 | Phase 1 | Complete |
| TEST-04 | Phase 1 | Complete |
| CRM-01 | Phase 2 | Pending |
| CRM-02 | Phase 2 | Pending |
| CRM-03 | Phase 2 | Pending |
| CRM-04 | Phase 2 | Pending |
| CRM-05 | Phase 2 | Pending |
| CRM-06 | Phase 2 | Pending |
| ANL-01 | Phase 3 | Pending |
| ANL-02 | Phase 3 | Pending |
| ANL-03 | Phase 3 | Pending |
| ANL-04 | Phase 3 | Pending |
| ANL-05 | Phase 3 | Pending |
| ANL-06 | Phase 3 | Pending |

**v1 requirements mapped: 16/16 — no orphans**

---

*Roadmap created: 2026-03-29*
*Phase 1 complete: 2026-03-30*
