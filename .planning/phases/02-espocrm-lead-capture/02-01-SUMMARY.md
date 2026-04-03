---
phase: 02-espocrm-lead-capture
plan: 01
subsystem: infrastructure
tags: [netlify, vite, serverless, environment-variables, spa]

requires: [01-testing]
provides:
  - netlify.toml with build config and SPA catch-all redirect
  - vite.config.ts with @netlify/vite-plugin enabling /.netlify/functions/* proxy in local dev
  - .env.local.example documenting ESPOCRM_API_KEY and ESPOCRM_BASE_URL (no VITE_ prefix)
  - package.json updated with @netlify/functions and @netlify/vite-plugin
affects: [02-02-serverless-function, 02-03-waitlist-form]

tech-stack:
  added: ["@netlify/functions@5.1.5", "@netlify/vite-plugin@2.11.2"]
  patterns: [netlify-vite-plugin for local function proxy, TOML-based build config]

key-files:
  created:
    - netlify.toml
    - .env.local.example
  modified:
    - vite.config.ts
    - package.json
    - package-lock.json
    - .gitignore (auto-updated by @netlify/vite-plugin to add .netlify)

key-decisions:
  - "Netlify confirmed as hosting provider — serverless functions live at netlify/functions/"
  - "ESPOCRM_* env vars must NOT have VITE_ prefix to prevent browser exposure"
  - "Env vars go in Netlify dashboard (Functions scope) — not in netlify.toml [environment] block which is build-scope only"
  - "@netlify/vite-plugin wires /.netlify/functions/* proxy in local dev — no netlify dev CLI needed"

patterns-established:
  - "netlify.toml [[redirects]] catches all routes and serves index.html (SPA routing)"
  - "Functions directory: netlify/functions/ (relative to project root)"

duration: ~3 minutes
completed: 2026-03-30
---

# Phase 2 Plan 01: Netlify Infrastructure Summary

**Netlify deployment wired: @netlify/vite-plugin active in Vite, netlify.toml with SPA redirect and build config, .env.local.example documents ESPOCRM_API_KEY and ESPOCRM_BASE_URL without VITE_ prefix — local dev starts cleanly with function proxy available.**

## Performance
- Duration: ~3 minutes
- Tasks: 2
- Files modified: 4 (vite.config.ts, package.json, package-lock.json, .gitignore)
- Files created: 2 (netlify.toml, .env.local.example)

## Accomplishments
- Installed @netlify/functions@5.1.5 and @netlify/vite-plugin@2.11.2
- Added `netlify()` to vite.config.ts plugins array alongside existing `react()` — all prior config preserved
- Created netlify.toml with `[build]` config (command, publish=dist, functions=netlify/functions) and `[[redirects]]` SPA catch-all rule returning status 200
- Created .env.local.example with ESPOCRM_API_KEY and ESPOCRM_BASE_URL — no VITE_ prefix, with inline comment warning
- Plugin auto-added `.netlify` to .gitignore
- Verified `npm run dev` starts cleanly with Netlify middleware loaded (functions, environment variables, redirects emulated)

## Task Commits
1. **Task 1: Install Netlify packages** — `4fa3eb5` (chore)
2. **Task 2: Add @netlify/vite-plugin to vite.config.ts and create netlify.toml** — `36270e9` (feat)

## Files Created/Modified
- `vite.config.ts` — added `import netlify from '@netlify/vite-plugin'` and `netlify()` to plugins array
- `netlify.toml` — created with [build] config (command/publish/functions) and [[redirects]] SPA rule (status=200)
- `.env.local.example` — created with ESPOCRM_API_KEY and ESPOCRM_BASE_URL, no VITE_ prefix, warning comment
- `package.json` — @netlify/functions and @netlify/vite-plugin added to dependencies
- `.gitignore` — `.netlify` entry added automatically by the vite plugin on first run

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Netlify confirmed as hosting provider | Plan structure and @netlify/vite-plugin choice locks in Netlify |
| Env vars scoped to Netlify Functions (dashboard), not netlify.toml | netlify.toml [environment] block is build-time only; runtime function env must be set in dashboard |
| ESPOCRM_* without VITE_ prefix | VITE_-prefixed vars are injected into browser bundle by Vite — API keys must never reach the client |

## Deviations from Plan

None — plan executed exactly as written.

## User Setup Required

Before Phase 2 Plan 2 (serverless function) can be tested end-to-end, the user must:

1. Create a dedicated API user in EspoCRM: Admin > API Keys
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `ESPOCRM_API_KEY` — the key from step 1
   - `ESPOCRM_BASE_URL` — root URL of the self-hosted EspoCRM instance
3. In the Netlify dashboard: Site Configuration > Environment Variables, add both vars scoped to **Functions**

## Next Phase Readiness
- Function URL contract established: `/.netlify/functions/{name}` resolves in both local dev and production
- Local dev works via `npm run dev` without the `netlify dev` CLI
- Phase 2 Plan 2 (serverless function) and Plan 3 (waitlist form) can now build on this foundation
- No blockers for downstream plans

---
*Phase: 02-espocrm-lead-capture*
*Completed: 2026-03-30*
