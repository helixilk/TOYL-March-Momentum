# Plan: Testing Setup
**Branch:** `feature/testing-setup`

## Objective
Establish a testing baseline for the site and its planned features — analytics tracking and EspoCRM integration — with automated checks running on every PR via GitHub Actions. Tests are added in phases alongside feature implementation.

---

## Stack

| Layer | Tool | Why |
|---|---|---|
| Unit / Component | **Vitest** + **React Testing Library** | Native Vite integration, fast, Jest-compatible |
| DOM environment | **jsdom** | Required by RTL for component rendering |
| E2E | **Playwright** | Best GH Actions integration, built-in HTML reports, screenshot/trace on failure |
| API mocking (future) | **msw** (Mock Service Worker) | Mock EspoCRM API without a live instance |
| GH Integration | **GitHub Actions** | PR status checks, test summary comments |

---

## Phase 1 — Baseline (current codebase)

Tests for what exists now. No form, no API — just the landing page.

### Vitest / RTL — component tests

| Test | Component | What |
| --- | --- | --- |
| All Button variants render | `Button` | primary, outline, ghost, gradient |
| Button renders as link with correct href | `Button` | when `href` is provided |
| SectionHeading renders title and subtitle | `SectionHeading` | centered and left-aligned |
| DailyIntention shows loading state | `DailyIntention` | before Gemini resolves |
| DailyIntention shows intention text | `DailyIntention` | after mocked Gemini response |
| DailyIntention shows fallback on error | `DailyIntention` | when Gemini API throws |
| FAQ renders all questions | `FAQ` | all 6 items present |
| FAQ expands and collapses items | `FAQ` | click to open, click to close |
| LegalModal opens and closes | `LegalModal` | open prop + close button |
| LegalModal renders title and children | `LegalModal` | content display |

### Playwright — E2E

| Test | What |
| --- | --- |
| Page loads, no JS console errors | Smoke test |
| Hero CTA "PRACTICE WITH US" is visible and links to Stripe | Primary conversion button |
| Nav "JOIN FOR $27" is visible and links to Stripe | Secondary CTA |
| YouTube iframe is present in hero | Video embed |
| FAQ accordion opens and closes an item | User interaction |
| Terms modal opens via footer link, closes via close button | Legal flow |
| Privacy modal opens via footer link, closes via close button | Legal flow |
| Nav links scroll to correct sections | Anchor navigation |
| Mobile viewport (375px): page renders without overflow | Responsive layout |

---

## Phase 2 — EspoCRM Integration

_Add alongside `feature/espocrm-integration` implementation._

### Vitest + MSW — unit/integration

- `api/submit-lead.ts` serverless function:
  - Valid payload → forwards to EspoCRM, returns 200
  - Missing required fields → returns 400 without calling EspoCRM
  - EspoCRM API failure → returns 500, does not leak API key in response
  - API key never present in response body
- UTM capture utility:
  - Reads `utm_source`, `utm_medium`, `utm_campaign` from URL
  - Stores to `sessionStorage`
  - Returns empty strings when no UTM params present

### Playwright — E2E form flows

- Happy path: fill form → submit → success message shown
- Error path: simulate API failure → user-friendly error shown, no raw error exposed
- Empty submit: validation errors shown, form not submitted
- No API key visible in browser network tab (check response headers/body)

---

## Phase 3 — Analytics Tracking

_Add alongside `feature/analytics-tracking` implementation._

Analytics tags fire via GTM in production — not unit-testable. Instead:

### Playwright — dataLayer assertions

- On page load, `window.dataLayer` exists and contains `gtm.start` event
- CTA button click pushes `cta_click` event to `window.dataLayer`
- Form submit pushes `form_submit` event to `window.dataLayer`

> GTM's forwarding to GA4/Meta/LinkedIn is verified manually via GTM Preview mode (documented in `plans/analytics-tracking.md`).

---

## GitHub Actions Workflow

Two jobs run in parallel on every PR and push to `main`:

```yaml
# .github/workflows/test.yml

name: Test

on:
  push:
    branches: [main]
  pull_request:

jobs:
  unit:
    name: Unit & Component Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test:unit -- --reporter=junit --outputFile=results/unit.xml
      - uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Unit Test Results
          path: results/unit.xml
          reporter: java-junit

  e2e:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

---

## Files Changed

| File | Description |
| --- | --- |
| `vitest.config.ts` | Vitest config with jsdom environment |
| `playwright.config.ts` | Playwright config targeting localhost:3000 |
| `src/tests/Button.test.tsx` | Button component tests |
| `src/tests/SectionHeading.test.tsx` | SectionHeading component tests |
| `src/tests/DailyIntention.test.tsx` | DailyIntention tests with mocked geminiService |
| `src/tests/FAQ.test.tsx` | FAQ accordion tests |
| `src/tests/LegalModal.test.tsx` | LegalModal open/close tests |
| `e2e/smoke.spec.ts` | Page load, CTA, iframe, mobile |
| `e2e/navigation.spec.ts` | Nav links, section scroll |
| `e2e/modals.spec.ts` | Terms and Privacy modal flows |
| `e2e/faq.spec.ts` | FAQ accordion E2E |
| `.github/workflows/test.yml` | CI workflow |
| `package.json` | New scripts: `test:unit`, `test:e2e` |

---

## Install

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D @playwright/test
```

---

## Testing Checklist — Phase 1

- [ ] `npm run test:unit` passes locally
- [ ] `npm run test:e2e` passes locally against `npm run dev`
- [ ] GitHub Actions workflow runs on PR and reports results
- [ ] Playwright HTML report uploads as artifact on failure
- [ ] No console errors on page load
