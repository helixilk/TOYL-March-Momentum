# Phase 2: EspoCRM Lead Capture — Research

**Researched:** 2026-03-30
**Domain:** EspoCRM REST API + Serverless proxy + React form (Netlify/Vercel Functions)
**Confidence:** HIGH (core stack), MEDIUM (UTM field strategy), HIGH (infrastructure patterns)

---

## Summary

Phase 2 introduces a waitlist capture form that posts visitor data as a Lead into EspoCRM without exposing API credentials in the browser. The pattern is well-established: a React form sends a `fetch` call to a serverless function deployed alongside the SPA; the function holds the EspoCRM API key as an environment variable and forwards the request to EspoCRM's REST API.

There are two viable paths for the CRM call itself. The **REST API path** (`POST /api/v1/Lead` with `X-Api-Key` header) gives the most control over field mapping and is universally supported on any EspoCRM installation. The **Web-to-Lead path** (`POST /api/v1/LeadCapture/{CAPTURE_KEY}`) requires a configured Lead Capture record in EspoCRM admin but needs no server-side auth header — the key is embedded in the URL. Given that the API key must never reach the browser, either path is equally safe when routed through a serverless proxy. The REST API path is simpler to implement without requiring EspoCRM admin configuration.

The serverless function will be written in the modern Netlify Functions format (default export, `Request`/`Response`, `.mts` extension). No extra bundler is needed — `@netlify/vite-plugin` enables local development via `npm run dev`. Vercel is a viable fallback with a nearly identical pattern (`api/submit-lead.ts` file).

**Primary recommendation:** Use the EspoCRM REST API (`POST /api/v1/Lead`, `X-Api-Key` header) via a Netlify Function at `netlify/functions/submit-lead.mts`. Store UTM parameters in the `description` field as structured text until/unless custom UTM fields are configured in EspoCRM admin.

---

## Standard Stack

### Core
| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| `@netlify/functions` | latest | TypeScript types for modern handler | Required for `Context` type; functions compile without it but types catch errors |
| `@netlify/vite-plugin` | latest | Emulate Netlify locally via `npm run dev` | Avoids needing `netlify dev` CLI; functions available at `/.netlify/functions/*` during dev |
| Native `fetch` | — | HTTP call from serverless function to EspoCRM | Node 18+ ships fetch natively; no extra dep needed |
| Tailwind v4 (already in project) | v4 | Form styling | Already in project; no new CSS dependency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `react-hook-form` | ^7.x | Form state, validation, error handling | Preferred for controlled forms with field-level validation; avoids manual useState per field |
| `zod` | ^3.x | Schema-based validation shared between form and server | Use if validation rules are complex enough to warrant schema; optional for a 3-field form |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `react-hook-form` | Plain `useState` | 3-field form is simple enough that plain state is fine; RHF reduces boilerplate for accessible error wiring |
| Netlify Functions | Vercel Functions | Vercel uses `api/` directory, `export default { async fetch() }` format — nearly identical; switch is a directory rename |
| `@netlify/vite-plugin` | `netlify dev` CLI | Plugin is newer, cleaner; CLI still works but adds a global install step |

### Installation
```bash
npm install @netlify/functions @netlify/vite-plugin
# Optional form library:
npm install react-hook-form
```

---

## Architecture Patterns

### Recommended Project Structure
```
netlify/
└── functions/
    └── submit-lead.mts      # Serverless proxy: validates input, calls EspoCRM
src/
├── components/
│   └── WaitlistForm.tsx     # Form UI: fields, loading, success, error states
├── services/
│   └── waitlistService.ts   # fetch wrapper: POST to /.netlify/functions/submit-lead
└── tests/
    └── WaitlistForm.test.tsx  # Unit: renders, validates, handles states
e2e/
└── waitlist.spec.ts          # E2E: submits form, verifies success message (mocked API)
netlify.toml                  # Build config + SPA redirect rule
.env.local                    # ESPOCRM_API_KEY, ESPOCRM_BASE_URL (never committed)
```

### Pattern 1: Serverless Proxy Function (Modern Netlify Format)

**What:** A `.mts` function in `netlify/functions/` that receives the form POST, validates input server-side, and calls EspoCRM's `POST /api/v1/Lead`.

**When to use:** Always — this is the only pattern that keeps the API key server-side.

**Example:**
```typescript
// netlify/functions/submit-lead.mts
// Source: https://developers.netlify.com/guides/migrating-to-the-modern-netlify-functions/
import type { Context } from "@netlify/functions";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { firstName, lastName, email, utmSource, utmMedium, utmCampaign } =
    await req.json();

  const apiKey = process.env.ESPOCRM_API_KEY;
  const baseUrl = process.env.ESPOCRM_BASE_URL; // e.g. https://crm.example.com

  const response = await fetch(`${baseUrl}/api/v1/Lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey!,
    },
    body: JSON.stringify({
      firstName,
      lastName,
      emailAddress: email,
      source: "Web Site",
      description: utmSource
        ? `utm_source=${utmSource} utm_medium=${utmMedium} utm_campaign=${utmCampaign}`
        : undefined,
    }),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "CRM error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

### Pattern 2: netlify.toml Configuration

**What:** Minimal `netlify.toml` at project root that sets build config and the mandatory SPA redirect rule.

**When to use:** Required for any Netlify deployment of a Vite SPA + functions.

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Pattern 3: vite.config.ts Plugin Addition

**What:** Add `@netlify/vite-plugin` so `npm run dev` serves functions at `/.netlify/functions/*`.

```typescript
// vite.config.ts addition
import netlify from "@netlify/vite-plugin";

plugins: [react(), netlify()],
```

### Pattern 4: WaitlistForm Component States

**What:** The form must clearly communicate four states: idle, loading, success, and error.

```typescript
// src/components/WaitlistForm.tsx (state shape)
type FormState = "idle" | "loading" | "success" | "error";

// Accessibility: loading button should be disabled + aria-busy
// Error: show human-readable message, not raw status code
// Success: replace form with confirmation message (don't re-enable form)
```

### Pattern 5: UTM Parameter Capture

**What:** Read UTM params from the page URL at form render time using native `URLSearchParams`; pass them to the serverless function as part of the payload.

```typescript
// No React Router needed — this is a static SPA, window.location is fine
const params = new URLSearchParams(window.location.search);
const utmData = {
  utmSource: params.get("utm_source") ?? undefined,
  utmMedium: params.get("utm_medium") ?? undefined,
  utmCampaign: params.get("utm_campaign") ?? undefined,
};
```

### Anti-Patterns to Avoid

- **Storing ESPOCRM_API_KEY in `.env` with a `VITE_` prefix.** Any env var prefixed `VITE_` is injected into the JS bundle by Vite and visible to the browser. The CRM key must NOT have this prefix.
- **Calling EspoCRM directly from the React component.** Defeats the entire security model.
- **Using the legacy Netlify handler format** (`exports.handler = async (event, context) => {...}`). Netlify is deprecating this in 2025. Use the modern default-export `Request`/`Response` format with `.mts` extension.
- **Not including `[[redirects]]` in netlify.toml.** Without the SPA redirect rule, direct URL hits (e.g. browser refresh) return 404 from Netlify's CDN.
- **Skipping server-side input validation in the function.** Even though the form validates client-side, the function must reject bad input independently — it's the only server-side gatekeeper.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form field validation | Custom regex / useState per error | `react-hook-form` or native `required`/`type="email"` | Accessibility, focus management, and re-render optimization are already solved |
| Serverless function bundling / TypeScript compile | Custom esbuild config | Let Netlify handle it | `@netlify/vite-plugin` + Netlify build auto-compiles `.mts` via esbuild; zero config needed |
| Environment variable injection at runtime | Reading `.env` manually | `process.env.VAR_NAME` (functions scope) | Netlify resolves vars at deploy time; `netlify.toml` env vars are build-only and NOT available in functions |
| Loading / disabled state | Complex state machine | Single `FormState` enum + `disabled` prop on button | Simple enough; no state library needed |
| UTM persistence across page loads | Custom session storage | Read from `window.location.search` at submit time | UTMs are in the URL; no need to persist separately for a single-page form |

**Key insight:** The most dangerous hand-roll is a custom serverless bundler config. Netlify's default esbuild pipeline handles TypeScript ESM functions natively — adding custom config introduces breakage with no benefit.

---

## Common Pitfalls

### Pitfall 1: VITE_ Prefix on Secret Environment Variables

**What goes wrong:** Developer adds `VITE_ESPOCRM_API_KEY` to `.env`, which Vite statically injects into the JS bundle at build time. The key appears in `dist/assets/index-*.js` and every browser network tab.

**Why it happens:** Vite's prefix convention is easy to misapply when developers are used to CRA's `REACT_APP_` pattern.

**How to avoid:** Name the variable `ESPOCRM_API_KEY` (no `VITE_` prefix). Set it in Netlify dashboard under Site Configuration > Environment Variables with Functions scope. Access it only inside `netlify/functions/`.

**Warning signs:** If you can `console.log(import.meta.env.ESPOCRM_API_KEY)` from a React component and see a value, the key is exposed.

### Pitfall 2: netlify.toml env vars not available in Functions

**What goes wrong:** Developer adds `ESPOCRM_API_KEY = "..."` to `[context.development.environment]` in `netlify.toml` and expects it in the function. The function receives `undefined`.

**Why it happens:** Netlify's docs state that `netlify.toml` environment variables have "build" scope, not "Functions" scope. Functions only receive variables set in the dashboard or via `netlify env:set`.

**How to avoid:** Set the variable in the Netlify UI dashboard, or use `netlify env:set ESPOCRM_API_KEY "value"` via CLI. For local dev, create a `.env.local` file — the `@netlify/vite-plugin` reads it for the dev server.

**Warning signs:** `process.env.ESPOCRM_API_KEY` returns `undefined` in production even though it's in `netlify.toml`.

### Pitfall 3: Missing SPA Redirect Rule

**What goes wrong:** The Netlify build succeeds, deployment works, but visiting any URL other than `/` returns a Netlify 404 page.

**Why it happens:** Netlify's CDN serves static files directly. Without a rewrite rule, `/*.html` patterns don't match unless `index.html` is explicitly routed.

**How to avoid:** Always include the `[[redirects]] from = "/*" to = "/index.html" status = 200` block in `netlify.toml`.

**Warning signs:** `npm run build && netlify dev` works fine, but production deployment shows 404 on direct URL access.

### Pitfall 4: EspoCRM `source` Field Value Must Match Enum

**What goes wrong:** The function sends `source: "Website"` and EspoCRM silently ignores it or returns a validation error, leaving the field blank.

**Why it happens:** EspoCRM's `source` field is an enum. The exact allowed value is `"Web Site"` (with a space), as defined in the entity metadata.

**How to avoid:** Always use the exact string `"Web Site"` for the source field when creating leads via API.

**Warning signs:** Leads appear in EspoCRM with an empty Source field.

### Pitfall 5: Function Returns Before EspoCRM Response Resolves

**What goes wrong:** The function appears to work locally but leads don't appear in EspoCRM consistently in production.

**Why it happens:** Serverless functions have a cold-start time budget. If `await fetch(...)` to EspoCRM takes longer than the function timeout (default 10s), the function is killed mid-request.

**How to avoid:** EspoCRM self-hosted instances can be slow. Add explicit timeout handling and return a 504 with a descriptive error if the upstream call exceeds 8 seconds.

**Warning signs:** Sporadic lead creation failures in production but consistent success in local dev.

### Pitfall 6: CORS in Local Development

**What goes wrong:** `npm run dev` serves the React app on `localhost:3000` but the function endpoint is at `localhost:8888/.netlify/functions/submit-lead`, causing CORS errors during development.

**Why it happens:** Without the Netlify Vite plugin, the dev server and function runner are on different ports.

**How to avoid:** Install and configure `@netlify/vite-plugin` in `vite.config.ts`. This proxies function calls through the same dev server port, eliminating cross-origin issues locally. In production, both the SPA and functions are on the same Netlify domain — no CORS issue.

---

## Code Examples

### EspoCRM Lead Field Reference
```typescript
// Source: https://docs.espocrm.com/development/api/ and EspoCRM entity metadata
// https://github.com/espocrm/espocrm/blob/master/application/Espo/Modules/Crm/Resources/metadata/entityDefs/Lead.json
{
  firstName: string,         // varchar, max 100
  lastName: string,          // varchar, max 100 (required)
  emailAddress: string,      // email type
  source: "Web Site",        // enum — must be exact string from allowed list
  description: string,       // text — use for UTM params until custom fields configured
  status: "New",             // enum default; can omit to use EspoCRM default
}
```

### EspoCRM API Authentication Header
```typescript
// Source: https://docs.espocrm.com/development/api/
headers: {
  "Content-Type": "application/json",
  "X-Api-Key": process.env.ESPOCRM_API_KEY!, // set in Netlify dashboard, Functions scope
}
```

### WaitlistForm Unit Test Pattern
```typescript
// Source: Vitest + React Testing Library docs (verified pattern)
// Mock fetch before tests; restore after
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  }));
});
afterEach(() => vi.unstubAllGlobals());

it("shows success message after submit", async () => {
  render(<WaitlistForm />);
  await userEvent.type(screen.getByLabelText(/first name/i), "Jane");
  await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
  await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
  await userEvent.click(screen.getByRole("button", { name: /join/i }));
  expect(await screen.findByText(/you're on the list/i)).toBeInTheDocument();
});
```

### Playwright E2E API Mock Pattern
```typescript
// Source: https://playwright.dev/docs/mock
// Register route before page.goto to intercept the function call
await page.route("**/.netlify/functions/submit-lead", async (route) => {
  await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
});
await page.goto("/");
// ... fill form and assert success message
```

### Netlify Environment Variable for Local Dev
```bash
# .env.local (gitignored) — read by @netlify/vite-plugin during npm run dev
ESPOCRM_API_KEY=your-real-key-here
ESPOCRM_BASE_URL=https://crm.yourdomain.com
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Netlify Functions legacy `exports.handler` Lambda format | Modern default export `Request`/`Response`, `.mts` extension | Announced 2021, deprecating 2025 | All new functions must use modern format |
| `netlify dev` CLI required for local function testing | `@netlify/vite-plugin` proxies functions through Vite dev server | 2024–2025 | Run `npm run dev` instead of `netlify dev` |
| EspoCRM Basic Auth (username/password) | API Key via `X-Api-Key` header (dedicated API User) | Established best practice | Simpler, no password rotation needed |

**Deprecated/outdated:**
- `netlify-lambda` package: replaced by built-in TypeScript + esbuild pipeline, do not use
- `exports.handler` function format: Netlify deprecating in 2025, use default export

---

## Open Questions

1. **EspoCRM custom UTM fields vs. `description` field**
   - What we know: EspoCRM's Lead entity has no built-in UTM fields; `description` is a text field available via API.
   - What's unclear: Whether the EspoCRM instance for this project already has custom UTM fields configured (e.g., `utmSourcec` via Entity Manager).
   - Recommendation: Default to storing UTM params in `description` as `utm_source=X utm_medium=Y utm_campaign=Z`. If custom fields exist, update the payload keys to match — check the EspoCRM instance's Entity Manager or query `/api/v1/Metadata` for Lead fields.

2. **EspoCRM workflow for automated email sequence (CRM-05)**
   - What we know: EspoCRM workflows can trigger on Lead creation and send emails from a template. This requires a Workflow rule configured in EspoCRM admin, not in the code.
   - What's unclear: Whether the workflow is already configured, or if Phase 2 includes setting it up.
   - Recommendation: The code only needs to create the Lead correctly (source = "Web Site"). The workflow setup is a CRM admin task. Phase 2 should include a verification step: after a test form submission, check the Lead's Workflow Log in EspoCRM to confirm the sequence fired (per success criterion 5).

3. **Hosting environment: Netlify vs. Vercel confirmed?**
   - What we know: Prior decisions say "Netlify/Vercel functions preferred" — not yet locked.
   - What's unclear: Which platform is actually in use.
   - Recommendation: Plan for Netlify (most common with Vite SPAs, `@netlify/vite-plugin` exists). Document the Vercel equivalent so the plan can switch. Netlify uses `netlify/functions/submit-lead.mts`; Vercel uses `api/submit-lead.ts` with `export default { async fetch(req) {} }`.

---

## Sources

### Primary (HIGH confidence)
- `https://docs.espocrm.com/development/api/` — Authentication methods, `X-Api-Key` header, Lead endpoint
- `https://docs.espocrm.com/administration/web-to-lead/` — Web-to-Lead feature, LeadCapture endpoint, field types
- `https://github.com/espocrm/espocrm/blob/master/application/Espo/Modules/Crm/Resources/metadata/entityDefs/Lead.json` — Authoritative field names: `firstName`, `lastName`, `emailAddress`, `source` enum values
- `https://docs.netlify.com/build/functions/get-started/` — Modern function handler signature, TypeScript setup, `.mts` extension
- `https://docs.netlify.com/build/functions/environment-variables/` — `process.env` in functions, scope requirements, `.toml` env vars NOT available in functions
- `https://developers.netlify.com/guides/migrating-to-the-modern-netlify-functions/` — Modern vs. legacy format, deprecation status
- `https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/` — Vite + Netlify setup, SPA redirect rule, `@netlify/vite-plugin`

### Secondary (MEDIUM confidence)
- `https://forum.espocrm.com/forum/developer-help/65375-api-payload-field-format-for-lead-capture` — Confirmed camelCase field names for Lead Capture API (verified against official metadata)
- WebSearch: Netlify same-domain CORS — SPA and functions on same Netlify domain have no CORS; verified by multiple community sources consistent with official behavior

### Tertiary (LOW confidence)
- WebSearch: UTM parameters in EspoCRM description field — community pattern; no official documentation for UTM-specific field handling found

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against official Netlify and EspoCRM docs
- Architecture: HIGH — Netlify Functions + Vite plugin is the canonical pattern, confirmed in official docs
- EspoCRM field names: HIGH — verified against EspoCRM GitHub entity metadata and forum
- UTM field strategy: MEDIUM — `description` fallback is verified as available; custom field names are installation-specific
- Pitfalls: HIGH (VITE_ prefix, netlify.toml scope, SPA redirect) / MEDIUM (EspoCRM enum values, timeout)

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (Netlify Functions API is stable; EspoCRM field schema is stable)
