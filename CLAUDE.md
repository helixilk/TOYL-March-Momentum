# TOYL — March Momentum landing page

Marketing landing page for TOYL (The Other Yoga Life) 4-week mobility challenge. Its job: sell a $27 spot in the next session (Stripe), with a free "Remind Me" form as a fallback that creates a Lead in EspoCRM.

## Stack
- React 19 + TypeScript + Vite 6 + Tailwind v4, single-page app (`src/App.tsx` holds all sections).
- Components in `src/components/`; app-wide literals in `src/constants.tsx`.
- Waitlist: `WaitlistForm.tsx` → `src/services/waitlistService.ts` → Netlify function `netlify/functions/submit-lead.mts` → EspoCRM `POST /api/v1/Lead`.

## Each new session
- Update `NEXT_SESSION_DATE` in `src/constants.tsx`. It drives the top badge, the "Next session" reminder section and the final call-to-action.
- Buying ($27 via Stripe) reserves a spot in the next session. The free form is "Remind Me" (not a waitlist).

## Hosting & deploy
- Netlify project `toyl-mm` (dashboard: https://app.netlify.com/projects/toyl-mm/overview), live at https://toyl-mm.netlify.app.
- `netlify.toml`: build `npm run build`, publish `dist`, functions in `netlify/functions`, SPA catch-all redirect.
- Pushing to `main` deploys to production, so push only when the owner approves. Do the work on a branch first.
- Secrets (`ESPOCRM_API_KEY`, `ESPOCRM_BASE_URL`) live in the Netlify dashboard (Functions scope). Never prefix them with `VITE_` and never commit them. Local copies go in `.env.local` (see `.env.local.example`).

## Analytics
- GTM container `GTM-MDXCVHSJ` is in `index.html`. GA4 (`G-DKE8295GJ4`) and Meta Pixel (`902073786190499`) are configured inside GTM, so tag changes happen in the GTM dashboard and need no deploy.
- Code pushes dataLayer events (`cta_click`, `form_submit`, `initiate_checkout`) and does nothing if GTM is blocked. Types are in `src/types/gtm.d.ts`.
- LinkedIn Insight Tag is still to do (waiting on a Partner ID; add it via GTM).

## Commands
- `npm install`, `npm run dev` (local dev with Netlify function emulation)
- `npm run lint` (tsc), `npm run test:unit` (Vitest), `npm run test:e2e` (Playwright)
- CI (`.github/workflows/test.yml`) runs unit + E2E tests on every PR and on pushes to `main`.

## Known issues / watch-outs
- Never put API keys in client code or `VITE_` vars. Anything secret goes through a Netlify function. (The old Gemini "Daily Intention" widget was removed on 2026-11-13 for this reason, and because it was broken.)
- EspoCRM field quirks: use `emailAddress` (not `email`) and `source: "Web Site"` (with the space).

## History
- Built in AI Studio, then extended in Mar–Apr 2026 in three phases (testing, EspoCRM, analytics). Detailed plans and decisions are in `.planning/` and `plans/`.
- Branches `GTMexplore`, `Over-50`, `feature/*` are fully merged into `main` (nothing unique). `testing` has one unmerged commit ("Makes the site blue").
