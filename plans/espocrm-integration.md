# Plan: EspoCRM Integration
**Branch:** `feature/espocrm-integration`

## Objective
Connect the site's waitlist/contact form to EspoCRM so that every lead submission is automatically captured as a Contact or Lead record. Enables follow-up, segmentation, and lifecycle tracking without manual data entry.

---

## Prerequisites

- A running EspoCRM instance (self-hosted or cloud)
- EspoCRM API credentials:
  - Base URL: `https://your-espocrm-instance.com`
  - API Key (Settings → API Users → Create API User)
- Decision: capture as **Lead** (unqualified) or **Contact** (qualified) — recommend **Lead** initially

---

## Integration Approach

### Option A: Direct API (Recommended for simplicity)
The site calls EspoCRM's REST API directly from a backend/serverless function when the form is submitted. Keeps the API key server-side and hidden from the browser.

### Option B: Via Webhook (EspoCRM → form tool)
If using a third-party form tool that supports webhooks, configure EspoCRM's webhook receiver. Less relevant here since the form is custom-built in React.

### Option C: Zapier / Make (no-code middleware)
Form submits to a Zapier webhook → Zapier creates Lead in EspoCRM. Easier to set up, adds a dependency and potential cost.

**This plan implements Option A** using a Vite-compatible serverless function (or thin backend proxy) to protect credentials.

---

## Data Mapping

Fields collected on the waitlist form → EspoCRM Lead fields:

| Form Field | EspoCRM Field | Notes |
|---|---|---|
| First Name | `firstName` | Required |
| Last Name | `lastName` | Optional — may be a single Name field |
| Email | `emailAddress` | Required |
| (source) | `source` | Hardcode: `"Web Site"` |
| (campaign) | `campaign` | Pull from UTM params if present |
| (status) | `status` | Default: `"New"` |
| Submission date | (auto) | EspoCRM sets `createdAt` automatically |

---

## Implementation Steps

### 1. Create EspoCRM API User
- Settings → API Users → + Create
- Set Role with permission to create Leads/Contacts
- Copy the API Key — treat like a password

### 2. Create Serverless Function / Backend Proxy
- **File:** `api/submit-lead.ts` (Vite SSR or standalone Netlify/Vercel function)
- Receives form data via POST from the React frontend
- Validates input server-side (email format, required fields)
- Calls EspoCRM REST API:

```
POST https://your-espocrm.com/api/v1/Lead
Authorization: ApiKey YOUR_API_KEY
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "emailAddress": "jane@example.com",
  "source": "Web Site",
  "status": "New"
}
```

- Returns success/error to frontend
- API key stored in environment variable: `ESPOCRM_API_KEY`
- Base URL stored in: `ESPOCRM_BASE_URL`

### 3. Update Frontend Form Component
- **File:** `src/components/WaitlistForm.tsx` (or equivalent)
- On submit, POST to `/api/submit-lead` instead of (or in addition to) current handler
- Handle loading state during submission
- Show success message on `200` response
- Show user-friendly error message on failure (do not expose API details)

### 4. UTM Parameter Capture (Optional but recommended)
- On page load, read UTM params from URL (`utm_source`, `utm_medium`, `utm_campaign`)
- Store in `sessionStorage`
- Include in form submission payload → map to EspoCRM `campaign` / custom fields
- Connects ad spend to leads in EspoCRM

### 5. Environment Variables
Add to `.env.local` (never commit to git):
```
ESPOCRM_BASE_URL=https://your-espocrm-instance.com
ESPOCRM_API_KEY=your_api_key_here
```
Add variable names (without values) to `.env.example`.

### 6. EspoCRM — Confirm Lead List View
- After first test submission, confirm Lead appears in EspoCRM
- Set up an EspoCRM workflow (optional): auto-send a welcome email on Lead creation

---

## What You'll Be Able to Do in EspoCRM

- See every waitlist signup as a Lead record with source, date, and contact info
- Filter Leads by source, campaign, or date range
- Convert Leads to Contacts when they enroll
- Trigger automated email sequences (if EspoCRM email is configured)
- Report on lead volume over time

---

## Files Changed
- `api/submit-lead.ts` — new serverless function (EspoCRM proxy)
- `src/components/WaitlistForm.tsx` — updated submit handler
- `.env.example` — document new required env vars
- `vite.config.ts` — may need server-side function configuration depending on host

## Security Checklist
- [ ] API key is in environment variable, never hardcoded or committed
- [ ] `.env.local` is in `.gitignore` (verify)
- [ ] Server function validates and sanitizes all input before forwarding to EspoCRM
- [ ] Rate limiting considered (to prevent spam submissions)
- [ ] CORS restricted to own domain on the API endpoint

## Testing Checklist
- [ ] Test submission creates Lead in EspoCRM with correct field values
- [ ] UTM params captured and stored correctly (if implemented)
- [ ] Form shows loading state during submission
- [ ] Form shows success state after submission
- [ ] Form shows error state gracefully on API failure
- [ ] No API key visible in browser network tab or JS bundle
