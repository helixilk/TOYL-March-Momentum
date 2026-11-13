# TOYL — March Momentum landing page

Marketing landing page for TOYL (The Other Yoga Life) 4-week mobility challenge. Its job: get visitors onto the waitlist, which creates a Lead in EspoCRM and starts the email nurture sequence.

## Stack
- React 19 + TypeScript + Vite 6 + Tailwind v4, single-page app (`src/App.tsx` holds all sections).
- Components in `src/components/`; app-wide literals in `src/constants.tsx`.
- Waitlist: `WaitlistForm.tsx` → `src/services/waitlistService.ts` → Netlify function `netlify/functions/submit-lead.mts` → EspoCRM `POST /api/v1/Lead`.
- "Daily intention" widget calls Gemini (`src/services/geminiService.ts`) with a fallback when it fails.

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
- `vite.config.ts` defines `process.env.GEMINI_API_KEY` into the client bundle. If a real key is ever set at build time, it becomes public. As of 2026-11-13 the live bundle contains no key. Move Gemini behind a Netlify function before adding one.
- EspoCRM field quirks: use `emailAddress` (not `email`) and `source: "Web Site"` (with the space).

## History
- Built in AI Studio, then extended in Mar–Apr 2026 in three phases (testing, EspoCRM, analytics). Detailed plans and decisions are in `.planning/` and `plans/`.
- Branches `GTMexplore`, `Over-50`, `feature/*` are fully merged into `main` (nothing unique). `testing` has one unmerged commit ("Makes the site blue").
