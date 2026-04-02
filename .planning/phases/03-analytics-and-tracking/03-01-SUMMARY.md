---
phase: 03-analytics-and-tracking
plan: 01
subsystem: analytics
tags: [gtm, google-tag-manager, typescript, dataLayer, tracking, button]

requires: [02-espocrm-lead-capture]
provides:
  - GTM container snippet in index.html head (placeholder ID GTM-XXXXXXX)
  - noscript iframe fallback immediately after <body> tag
  - src/types/gtm.d.ts declaring window.dataLayer as DataLayerEvent[]
  - Button component fires onClick when rendered as <a> tag
affects: [03-02-cta-click-tracking, 03-03-ga4-events, 03-04-meta-pixel, 03-05-linkedin-insight]

tech-stack:
  added: []
  patterns: [GTM as single code change — all tags managed in dashboard, direct window.dataLayer.push (no npm analytics packages)]

key-files:
  created:
    - src/types/gtm.d.ts
  modified:
    - index.html
    - src/components/Button.tsx

key-decisions:
  - "GTM container snippet added with placeholder ID GTM-XXXXXXX — real ID must be substituted before production"
  - "window.dataLayer typed via global Window augmentation in gtm.d.ts — no 'any' casts needed in component code"
  - "Button onClick wired to <a> branch — native link navigation proceeds after handler fires (no preventDefault)"
  - "No npm analytics packages — direct window.dataLayer.push is the standard GTM integration pattern"

patterns-established:
  - "GTM snippet is first child of <head> for fastest possible container load"
  - "noscript fallback is first child of <body> per GTM recommended placement"
  - "DataLayerEvent interface allows arbitrary extra properties via [key: string]: unknown"

duration: ~2 minutes
completed: 2026-04-02
---

# Phase 3 Plan 01: GTM Integration Summary

**GTM container snippet added to index.html head and noscript body with placeholder ID GTM-XXXXXXX; window.dataLayer typed globally via DataLayerEvent interface; Button fires onClick when rendered as an anchor for CTA click tracking.**

## Performance
- Duration: ~2 minutes
- Tasks: 2
- Files created: 1 (src/types/gtm.d.ts)
- Files modified: 2 (index.html, src/components/Button.tsx)

## Accomplishments
- Added standard GTM head snippet as first child of `<head>` in index.html
- Added noscript iframe fallback immediately after opening `<body>` tag
- Created `src/types/gtm.d.ts` with `DataLayerEvent` interface and global `Window` augmentation for `window.dataLayer`
- Added `onClick={onClick}` to the `<a>` branch in Button.tsx so click handlers fire alongside href navigation
- All 32 unit tests and 19 E2E tests pass without modification

## Task Commits
1. **Task 1: Add GTM snippet to index.html and create dataLayer type declaration** — `3381581` (feat)
2. **Task 2: Fix Button component to fire onClick when href is also provided** — `eafff81` (fix)

## Files Created/Modified
- `index.html` — GTM head snippet added as first `<head>` child; noscript iframe added as first `<body>` child
- `src/types/gtm.d.ts` — created with `DataLayerEvent` interface and `declare global { interface Window { dataLayer: DataLayerEvent[] } }`
- `src/components/Button.tsx` — `onClick={onClick}` added to the `<a>` element in the `href` branch

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| GTM placeholder ID GTM-XXXXXXX | Real ID requires GTM account creation; placeholder keeps build passing and allows testing the snippet structure |
| window.dataLayer typed with index signature [key: string]: unknown | Accommodates arbitrary event properties (ecommerce objects, custom dimensions) without needing type casts |
| onClick fires before native link navigation on <a> | dataLayer.push is synchronous; GTM tag fires before browser navigates; no preventDefault needed |
| No npm analytics packages | Direct window.dataLayer.push is the standard pattern for GTM — third-party wrappers add unnecessary abstraction |

## Deviations from Plan

None — plan executed exactly as written.

## User Setup Required

Before Phase 3 Plan 2 (CTA click tracking) can be used in production:

1. Create a GTM account and container at tagmanager.google.com
2. Replace the placeholder `GTM-XXXXXXX` in `index.html` (two occurrences — head script and noscript body) with the real container ID

## Next Phase Readiness
- GTM loads on every page view — GA4, Meta Pixel, and LinkedIn Insight Tag can be configured in the GTM dashboard without future code deploys
- TypeScript is ready for `window.dataLayer.push({...})` calls in any component — no casts needed
- Button can fire tracking events on CTA clicks while still navigating to the Stripe link
- No blockers for downstream plans once the real GTM container ID is substituted

---
*Phase: 03-analytics-and-tracking*
*Completed: 2026-04-02*
