# Phase 3: Analytics and Tracking - Research

**Researched:** 2026-04-02
**Domain:** GTM, GA4, Meta Pixel, LinkedIn Insight Tag, React/Vite SPA event tracking
**Confidence:** HIGH (all major claims verified against official documentation and authoritative community sources)

---

## Summary

Phase 3 adds observability to the TOYL Yoga landing page by wiring Google Tag Manager (GTM) as the single tag container, then deploying GA4, Meta Pixel, and LinkedIn Insight Tag through it. Two custom events (`cta_click` and `form_submit`) are fired from React code into `window.dataLayer` and forwarded to GA4 via GTM.

The standard implementation pattern for a React + Vite SPA is to embed the GTM head snippet and noscript fallback directly in `index.html` — no npm package is needed. All tag configuration (GA4 measurement tag, Meta Pixel base tag, LinkedIn Insight Tag, custom event tags) lives inside the GTM container and requires zero future code deploys to change. Custom events are pushed from React component code using `window.dataLayer.push({ event: 'cta_click', ... })`.

This site is a true single-page application with no client-side router. It renders once on load and never changes the URL. Because of this, the GA4 "page changes based on browser history events" enhanced measurement feature has nothing to listen to — the single page load fires exactly one pageview naturally on container load, which is correct and sufficient. No SPA history-change trigger configuration is needed.

**Primary recommendation:** Embed GTM snippet in `index.html`, push custom events from React via `window.dataLayer`, configure all tags in the GTM UI, verify with GTM Preview + GA4 DebugView before publishing.

---

## Standard Stack

### Core (code side — what goes into the repository)

| Item | Version/Format | Purpose | Why Standard |
|------|---------------|---------|--------------|
| GTM head snippet | Static HTML in `<head>` | Bootstraps GTM container asynchronously | Single code change; all future tags managed in GTM dashboard |
| GTM noscript fallback | `<noscript>` after `<body>` open | Pixel fires for JS-disabled browsers | Required by GTM install instructions |
| `window.dataLayer.push()` | Native browser API | Sends custom events from React to GTM | Zero-dependency; GTM defines the contract |
| TypeScript global declaration | `declare global { interface Window { dataLayer: Record<string, unknown>[] } }` | Type-safe `window.dataLayer` access | Required in strict TS to suppress `any` errors |

### GTM Container Configuration (GTM dashboard — no code deploys)

| Tag | Template | Trigger | Purpose |
|-----|----------|---------|---------|
| GA4 Configuration | Google Analytics: GA4 Configuration (built-in) | All Pages | Pageview + sends measurement ID to GA4 |
| GA4 cta_click event | Google Analytics: GA4 Event (built-in) | Custom event: `cta_click` | Forwards CTA click data to GA4 |
| GA4 form_submit event | Google Analytics: GA4 Event (built-in) | Custom event: `form_submit` | Forwards conversion event to GA4 |
| Meta Pixel base | "Facebook Pixel" community template (facebookarchive) | All Pages | Pageview for retargeting audience population |
| LinkedIn Insight Tag | "LinkedIn Insight Tag" or "LinkedIn Insight Tag 2.0" built-in template | All Pages | Pageview for retargeting audience population |

### No npm Packages Required

The standard approach for a static `index.html` (Vite) app is direct HTML injection — no `react-gtm-module`, no `@sooro-io/react-gtm-module`, no wrappers. Those packages exist for dynamic environment switching or SSR; they add complexity without benefit here.

**Installation command:** None — only `index.html` edits and React component changes.

---

## Architecture Patterns

### Recommended File Changes

```
index.html                   ← add GTM head snippet + noscript
src/
├── types/
│   └── gtm.d.ts             ← declare global Window.dataLayer type
├── App.tsx                  ← add dataLayer.push for cta_click on Button clicks
└── components/
    └── WaitlistForm.tsx     ← add dataLayer.push for form_submit on success
```

### Pattern 1: GTM Snippet in index.html

**What:** Two code blocks injected into `index.html` — the loader script in `<head>` (as high as possible) and a `<noscript>` iframe immediately after the opening `<body>` tag.

**When to use:** Every time. This is the only required code-level change for GTM.

**Exact snippet structure (replace GTM-XXXXXXX with real container ID):**
```html
<!-- Head snippet — place as high as possible in <head> -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- Noscript fallback — immediately after opening <body> tag -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

Source: GTM official installation documentation (support.google.com/tagmanager/answer/14847097), cross-verified with analyticsmania.com.

### Pattern 2: TypeScript Window Declaration

**What:** A `.d.ts` file that augments the global `Window` interface so `window.dataLayer` is type-safe.

**Example (src/types/gtm.d.ts):**
```typescript
// Source: community consensus — github.com/vercel/next.js/discussions/20784 et al.
export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
```

### Pattern 3: dataLayer.push for cta_click

**What:** Push a custom event when a user clicks any waitlist/join CTA button.

**Where:** `src/App.tsx` — on the `<Button>` components wrapping `STRIPE_PLACEHOLDER_URL` and the "Join Waitlist" nav anchor, and any other CTA.

**Example:**
```typescript
// Source: developers.google.com/tag-platform/tag-manager/datalayer
const handleCtaClick = (ctaLocation: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_click',
    cta_location: ctaLocation,   // e.g. 'hero', 'nav', 'final_cta'
  });
};
```

**In JSX:**
```tsx
<Button
  href={STRIPE_PLACEHOLDER_URL}
  onClick={() => handleCtaClick('hero')}
  variant="gradient"
>
  PRACTICE WITH US
</Button>
```

Note: `<Button>` renders an `<a>` tag. The `onClick` fires before navigation because external links open in a new tab or navigate away — the `dataLayer.push` is synchronous so it completes before the browser unloads.

### Pattern 4: dataLayer.push for form_submit

**What:** Push a custom event when the waitlist form submission succeeds (the `setFormState("success")` branch).

**Where:** `src/components/WaitlistForm.tsx` — inside `handleSubmit`, after `await submitLead(...)` resolves.

**Example:**
```typescript
// Source: developers.google.com/tag-platform/tag-manager/datalayer
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setFormState("loading");
  try {
    await submitLead({ firstName, lastName, email, ...utmParams });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'form_submit',
      form_name: 'waitlist',
    });
    setFormState("success");
  } catch (err) {
    // ... existing error handling
  }
}
```

**Why push before setFormState("success"):** The dataLayer push is synchronous and imperceptible; pushing before the state change ensures the event fires even if a subsequent re-render causes any issues.

### Pattern 5: GTM Custom Event Trigger Configuration

**In GTM dashboard (no code change):**
- Trigger type: Custom Event
- Event name: `cta_click` (exact match, case-sensitive)
- Fires on: All Custom Events matching that name

Repeat for `form_submit`. Then create two GA4 Event tags that reference these triggers. Event names in GTM triggers must exactly match the `event` key pushed to `dataLayer`.

### Anti-Patterns to Avoid

- **Using `react-gtm-module`:** Unnecessary npm dependency for a static SPA; direct `window.dataLayer.push` is simpler and has no version drift risk.
- **Placing GTM snippet in `<body>` only:** Head placement is required for the script to load before page content; body-only placement causes missed early events.
- **Placing noscript tag inside `<head>`:** `<iframe>` is not valid HTML inside `<head>`. The noscript must be in `<body>`.
- **Using `window.dataLayer.push` without the guard `window.dataLayer = window.dataLayer || []`:** GTM initialises `dataLayer` when it loads, but the push may happen before GTM loads (e.g. very fast user action). The guard is defensive.
- **Mismatched event names:** GA4 treats `form_submit` and `formSubmit` as different events. Copy event names exactly from code to GTM triggers.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tag management | Custom script injection per tag | GTM container (the whole point) | Single code change; future tags deployed in GTM UI without deploys |
| Meta Pixel loading | `<script>` in index.html with fbq() | GTM "Facebook Pixel" community template | Template handles init + event deduplication; avoids manual script management |
| LinkedIn Insight Tag loading | `<script>` in index.html | GTM "LinkedIn Insight Tag" built-in template | Managed in GTM; supports Insight Tag 2.0 for conversion tracking |
| GA4 pageview | Direct `gtag.js` snippet | GA4 Configuration tag inside GTM | Keeps all tags in one place; avoids dual tracking conflicts |
| TypeScript types for dataLayer | Custom complex typed interfaces | Simple `Record<string, unknown>[]` global declaration | Sufficient for all push patterns; avoids over-engineering |

**Key insight:** Every tag after the GTM snippet belongs inside the GTM container, not in `index.html`. The GTM snippet is the only script that ever needs to touch the HTML.

---

## Common Pitfalls

### Pitfall 1: Analytics IDs not substituted before deployment

**What goes wrong:** The GTM snippet ships to production with `GTM-XXXXXXX` as a literal placeholder. No container fires. Nothing is tracked.
**Why it happens:** Developer forgets to replace placeholder before committing / deploying.
**How to avoid:** Never commit `GTM-XXXXXXX` literally. The user must supply their real GTM container ID before this phase executes (noted as a known constraint). Use a comment in the file noting the replacement location.
**Warning signs:** Google Tag Assistant shows "No containers found" on the page.

### Pitfall 2: noscript placed inside `<head>`

**What goes wrong:** HTML becomes invalid. Some parsers move the `<iframe>` outside `<head>` unpredictably.
**Why it happens:** Developer places both blocks together in `<head>` for convenience.
**How to avoid:** Place the noscript block as the first child of `<body>`, immediately after `<body class="...">`.
**Warning signs:** HTML validator errors; GTM noscript fallback not loading.

### Pitfall 3: GTM fires but GA4 tag not configured in container

**What goes wrong:** GTM Preview shows the container loading but GA4 DebugView shows nothing. The head snippet only loads the container loader — all tags must be configured inside GTM and published.
**Why it happens:** Confusion between "GTM is installed" and "GA4 is configured in GTM".
**How to avoid:** After installing the snippet, create and publish the GA4 Configuration tag in GTM with the correct Measurement ID and an "All Pages" trigger. Container must be published (not just saved) for tags to fire.
**Warning signs:** GTM Preview shows container fired but tag list is empty.

### Pitfall 4: Container not published after configuration

**What goes wrong:** Tags are created in GTM but never deployed to production visitors. Only GTM Preview mode users see them.
**Why it happens:** GTM drafts are not live until published.
**How to avoid:** After creating/editing tags in GTM, click Submit → Publish. Verify with a fresh browser session (no GTM Preview cookie).
**Warning signs:** DebugView shows events in Preview mode but not in normal browsing.

### Pitfall 5: Ad blockers blocking verification

**What goes wrong:** Developer tests with ad blocker active. GA4 DebugView shows nothing. Developer concludes tracking is broken.
**Why it happens:** uBlock Origin, Privacy Badger etc. block analytics requests.
**How to avoid:** Test in a browser profile with all extensions disabled, or in an Incognito window with no extensions.
**Warning signs:** GTM Preview shows tags fired but DebugView is empty.

### Pitfall 6: form_submit fires on every form state change, not just success

**What goes wrong:** The dataLayer push is placed outside the try/catch, or in a `useEffect` watching `formState`, and fires on "loading" or "error" transitions too.
**Why it happens:** Developer adds tracking in a useEffect rather than in the success branch of the async handler.
**How to avoid:** Place the `dataLayer.push` exactly in the `try` block after `await submitLead(...)` resolves successfully, before `setFormState("success")`.

---

## Code Examples

### Full index.html After Phase 3 Change

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- GTM head snippet — replace GTM-XXXXXXX with real container ID -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TOYL Yoga 20-20 Mobility Program</title>
    <!-- ... rest of existing head ... -->
</head>
<body class="bg-[#F8FAF9] text-[#2D3436]">
    <!-- GTM noscript fallback — immediately after opening body tag -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

Source: GTM official installation instructions, cross-verified analyticsmania.com install guide.

### GTM Dashboard Configuration Checklist

In the GTM container (GTM-XXXXXXX), create and publish the following tags:

1. **Tag: GA4 Configuration**
   - Tag type: Google Analytics: GA4 Configuration
   - Measurement ID: `G-XXXXXXXXXX` (user's GA4 measurement ID)
   - Trigger: All Pages

2. **Tag: Meta Pixel – PageView**
   - Tag type: Facebook Pixel (community template from facebookarchive)
   - Pixel ID: `<user's numeric pixel ID>`
   - Event: PageView
   - Trigger: All Pages

3. **Tag: LinkedIn Insight Tag**
   - Tag type: LinkedIn Insight Tag (built-in template)
   - Partner ID: `<user's LinkedIn partner ID>`
   - Trigger: All Pages

4. **Trigger: cta_click**
   - Trigger type: Custom Event
   - Event name: `cta_click`

5. **Tag: GA4 Event – cta_click**
   - Tag type: Google Analytics: GA4 Event
   - Configuration tag: (reference GA4 Configuration tag)
   - Event name: `cta_click`
   - Trigger: cta_click trigger

6. **Trigger: form_submit**
   - Trigger type: Custom Event
   - Event name: `form_submit`

7. **Tag: GA4 Event – form_submit**
   - Tag type: Google Analytics: GA4 Event
   - Configuration tag: (reference GA4 Configuration tag)
   - Event name: `form_submit`
   - Trigger: form_submit trigger

After creating all tags: **Submit → Publish** the container version.

---

## SPA Pageview Considerations

This app has no client-side router (no React Router, no URL changes after load). The page loads once, and the user stays on `toylmm.com/` for the entire session.

**Implication:** No SPA history-change trigger is needed. The GA4 Configuration tag fires on the single page load. GA4 Enhanced Measurement "page changes based on browser history events" can be left ON (it is harmless — the history API never fires here) but will never trigger additional pageviews.

**Do not configure a History Change trigger** in GTM for this site. It would be dead configuration and could confuse future maintainers.

The single pageview per session is correct behaviour for a one-page marketing site.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| GA Universal Analytics | GA4 | July 2023 (UA sunset) | GA4 uses event-based model; all events including pageview go through GTM's GA4 Configuration tag |
| Facebook Pixel custom HTML tag | Facebook Pixel community template in GTM gallery | 2020, maintained 2025 | Template is vetted by Google; preferred over custom HTML |
| LinkedIn Insight Tag v1 | LinkedIn Insight Tag 2.0 | 2023-2024 | 2.0 supports Event ID for deduplication and conversion tracking per tag |
| `react-gtm-module` for dataLayer | Direct `window.dataLayer.push` | Ongoing preference | No-dependency approach is simpler for non-SSR SPAs |

**Deprecated/outdated:**
- `analytics.js` / Universal Analytics: Sunset July 2023. Use GA4 only.
- `gtag.js` direct in `index.html`: Still works but conflicts with GTM managing GA4. If GTM is the tag manager, all GA4 traffic routes through GTM, not a parallel `gtag.js` snippet.

---

## Open Questions

1. **Analytics IDs not yet provided**
   - What we know: GTM container ID (GTM-XXXXXXX), GA4 Measurement ID (G-XXXXXXXXXX), Meta Pixel ID (numeric), LinkedIn Partner ID — all must be supplied before any testing can happen.
   - What's unclear: Whether the user has created the GTM container and GA4 property yet, or if account setup is also part of this work.
   - Recommendation: Treat account creation and ID collection as the first task in the phase plan. All subsequent tasks depend on it.

2. **Button component's onClick support**
   - What we know: `src/components/Button` is used for CTA links. It renders an `<a>` tag (based on usage with `href`). The component file was not read.
   - What's unclear: Whether `Button` accepts and forwards `onClick` props.
   - Recommendation: Read `src/components/Button.tsx` during planning. If it does not forward `onClick`, add `onClick?: React.MouseEventHandler` to its props and pass it to the rendered element.

3. **Meta Pixel template name in GTM gallery**
   - What we know: The template is named "Facebook Pixel" and published by facebookarchive. Some 2025 sources still call it "Facebook Pixel" in the GTM gallery.
   - What's unclear: Whether Meta has renamed or replaced the gallery template with a new "Meta Pixel" entry.
   - Recommendation: In the plan task, instruct the user to search "Facebook" OR "Meta" in the GTM Template Gallery and select the one by `facebookarchive`.

---

## Sources

### Primary (HIGH confidence)
- [GTM Install Web Container — support.google.com/tagmanager/answer/14847097](https://support.google.com/tagmanager/answer/14847097) — installation snippet placement
- [GA4 Single Page Applications — developers.google.com/analytics/devguides/collection/ga4/single-page-applications](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications) — enhanced measurement for history-based SPAs
- [The dataLayer — developers.google.com/tag-platform/tag-manager/datalayer](https://developers.google.com/tag-platform/tag-manager/datalayer) — dataLayer.push API
- [Custom event trigger — support.google.com/tagmanager/answer/7679219](https://support.google.com/tagmanager/answer/7679219) — GTM custom event trigger configuration
- [Set up GA4 in Tag Manager — support.google.com/tagmanager/answer/9442095](https://support.google.com/tagmanager/answer/9442095) — GA4 configuration tag

### Secondary (MEDIUM confidence)
- [Add LinkedIn Insight Tag to GTM — linkedin.com/help/lms/answer/a416960](https://www.linkedin.com/help/lms/answer/a416960) — official LinkedIn GTM guide
- [Track LinkedIn Conversions with GTM — analyticsmania.com](https://www.analyticsmania.com/post/track-linkedin-conversions-with-google-tag-manager/) — Partner ID field, template selection, trigger
- [Meta Pixel with GTM — analyticsmania.com](https://www.analyticsmania.com/post/facebook-pixel-with-google-tag-manager/) — community template name, pixel ID variable, event setup
- [datalayer.push examples — analyticsmania.com/post/datalayer-push](https://www.analyticsmania.com/post/datalayer-push/) — event push patterns and naming conventions
- [window.dataLayer TypeScript — github.com/vercel/next.js/discussions/20784](https://github.com/vercel/next.js/discussions/20784) — global Window type extension

### Tertiary (LOW confidence)
- WebSearch results on GTM + Vite environment variables — not used in plan (container ID is hardcoded in index.html per standard GTM install, not a build-time env var)

---

## Metadata

**Confidence breakdown:**
- Standard stack (GTM snippet structure, dataLayer API): HIGH — verified against official GTM install docs
- Architecture (where to place snippets, where to push events): HIGH — matches official GTM docs and codebase review
- SPA pageview behaviour (no router = no history trigger needed): HIGH — verified against official GA4 SPA docs
- GTM dashboard configuration (tag types, template names): MEDIUM — verified against official LinkedIn docs and community templates known to be maintained; Meta template name carries LOW-to-MEDIUM risk of rename
- Pitfalls: HIGH — all pitfalls are directly derived from official documented behaviour

**Research date:** 2026-04-02
**Valid until:** 2026-07-01 (GTM/GA4 platform; stable. LinkedIn/Meta template names: verify at execution time)
