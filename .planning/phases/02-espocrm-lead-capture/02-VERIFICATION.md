---
phase: 02-espocrm-lead-capture
status: passed
score: 5/5
verified: 2026-04-02
---

# Verification: Phase 2 — EspoCRM Lead Capture

**Status: PASSED — 5/5 must-haves verified against codebase**

---

## Must-Have Results

### 1. Visible waitlist form with three labeled fields ✓
- `src/App.tsx`: `<section id="waitlist">` confirmed; `<WaitlistForm />` rendered inside it
- `src/components/WaitlistForm.tsx`: three accessible inputs with `htmlFor`/`id` pairs — `firstName`, `lastName`, `email`

### 2. Lead targets EspoCRM with source "Web Site" and UTM in description ✓
- `netlify/functions/submit-lead.mts`: `source: "Web Site"` (exact enum string with space)
- UTM params assembled into `description` field when `utmSource` is present in payload

### 3. API key absent from browser ✓
- `grep -r "ESPOCRM" src/` — zero matches
- `vite.config.ts` `define` block exposes only `GEMINI_API_KEY` — no ESPOCRM vars
- `ESPOCRM_API_KEY` and `ESPOCRM_BASE_URL` accessed only via `process.env` inside the serverless function

### 4. Form communicates loading / success / error states ✓
- `aria-busy="true"` on submit button in loading state
- Success state replaces form with confirmation panel (form not rendered)
- Error state renders `role="alert"` with error message; all field values preserved

### 5. Full test suite passes ✓
- `src/tests/WaitlistForm.test.tsx`: 5 unit tests — idle, loading, success, CRM error, network error
- `e2e/waitlist.spec.ts`: 1 E2E test with `page.route()` mock — no real EspoCRM calls
- `npm test` exits 0: 32 unit + 19 E2E = 51 tests passing

---

## Human Verification (Checkpoint 02-06)

Manual verification passed during execution:
- Real form submission created a Lead in EspoCRM dashboard ✓
- Source field confirmed "Web Site" ✓
- ESPOCRM_API_KEY absent from all DevTools network requests ✓

## Deferred Items (non-blocking)

- **UTM end-to-end**: Code path is wired but not tested with a real UTM URL submission.
- **Automated email sequence**: CRM workflow configuration is outside the codebase; requires EspoCRM admin setup.

---

## Bug Fixed During Execution

`vite.config.ts` required `Object.assign(process.env, env)` to inject `.env` vars into the Node.js process so the Netlify function emulation could read them via `process.env`. Fix committed at `862cfa4`.

---

*Verification completed: 2026-04-02*
