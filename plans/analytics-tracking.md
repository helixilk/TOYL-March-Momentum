# Plan: Analytics & Marketing Tracking
**Branch:** `feature/analytics-tracking`

## Objective
Integrate Google Tag Manager (GTM) as the tag management layer, with GA4, Meta Pixel, and LinkedIn Insight Tag firing through it. This enables full-funnel visibility — organic traffic, paid ad attribution, and conversion tracking — without future code changes.

---

## Accounts & IDs Required

Before implementation, gather the following IDs:

| Service | Where to get it | ID format |
|---|---|---|
| Google Tag Manager | tagmanager.google.com → Create Account → Container | `GTM-XXXXXXX` |
| Google Analytics 4 | analytics.google.com → Create Property | `G-XXXXXXXXXX` |
| Meta Pixel | business.facebook.com → Events Manager → Connect Data Source | `XXXXXXXXXXXXXXXX` (16 digits) |
| LinkedIn Insight Tag | linkedin.com/campaignmanager → Account Assets → Insight Tag | `XXXXXXX` (7 digits) |

---

## Implementation Steps

### 1. Add GTM Container Snippet to Site
- **File:** `index.html`
- Add GTM `<script>` tag in `<head>` (as high as possible)
- Add GTM `<noscript>` fallback in `<body>` immediately after opening tag
- This is the **only code change** needed in the repository

```html
<!-- GTM head snippet (replace GTM-XXXXXXX) -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- GTM noscript fallback (place immediately after <body>) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### 2. Configure GA4 Tag in GTM Dashboard
- Tag type: **Google Analytics: GA4 Configuration**
- Measurement ID: `G-XXXXXXXXXX`
- Trigger: **All Pages**
- This captures pageviews, sessions, traffic sources automatically

### 3. Configure Meta Pixel Tag in GTM Dashboard
- Tag type: **Custom HTML**
- Paste Meta base code with your Pixel ID
- Trigger: **All Pages**
- Add a second tag for `PageView` event on **All Pages**

### 4. Configure LinkedIn Insight Tag in GTM Dashboard
- Tag type: **Custom HTML**
- Paste LinkedIn Insight Tag script with your Partner ID
- Trigger: **All Pages**

### 5. Custom Event Tracking (GTM Triggers)
Set up the following conversion events via GTM click triggers (no code changes):

| Event | Trigger | Why it matters |
|---|---|---|
| `cta_click` | Click on "Join the Waitlist" / "Join the Challenge" buttons | Primary conversion |
| `video_play` | YouTube iframe interaction | Engagement signal |
| `form_submit` | Waitlist form submission | Lead captured |
| `section_view` | Scroll depth to key sections | Content engagement |

### 6. Verify & Publish
- Use **GTM Preview mode** to validate all tags fire correctly before publishing
- Use **GA4 DebugView** to confirm events are received
- Use **Meta Pixel Helper** (Chrome extension) to validate pixel fires
- Publish GTM container once verified

---

## What You'll Be Able to See

### In GA4
- Total users, sessions, page views over time
- Traffic sources: organic, direct, referral, social, paid
- User flow through the page (scroll behavior, time on page)
- Conversion events (CTA clicks, form submits)

### In Meta Ads Manager
- Which ad campaigns drove CTA clicks or form submits
- Audience building from site visitors (retargeting)
- Cost per conversion

### In LinkedIn Campaign Manager
- Which LinkedIn ads drove traffic
- Retarget visitors with LinkedIn ads

---

## Files Changed
- `index.html` — GTM container snippet (head + body)

## Testing Checklist
- [ ] GTM Preview shows tags firing on page load
- [ ] GA4 DebugView receives pageview and custom events
- [ ] Meta Pixel Helper shows PageView on load
- [ ] LinkedIn tag fires (verify in GTM Preview network tab)
- [ ] No console errors introduced
- [ ] Lighthouse performance score not significantly impacted
