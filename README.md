# Share Fund System — Frontend (Phase 1 Founding Participant)

Mock-only React app for Phase 1: Founding Participant enrollment, BMIS profile/questionnaire, Success Centers, projections, and admin configuration.

## Stack

- React 19 + Vite + TypeScript
- React Router 7, TanStack Query, React Hook Form + Zod
- Tailwind 4 + shadcn/ui

## Run

```bash
npm install
npm run dev
```

Optional env (`.env.example`):

- `VITE_API_URL` — reserved for future backend (axios client unused in Phase 1 mocks)
- `VITE_LANDING_URL` — pre-launch landing site

## Mock auth

- Participant: any email that does **not** contain `admin`
- Admin: any email containing `admin` (temporary mock until JWT)
- Passwords are accepted in forms but not validated
- Session + accounts persist in `localStorage` key `sfs-phase1-store`

## Phase 1 surfaces

**Participant:** Dashboard · Questionnaire · Success Centers · Enrollment/Checkout · Billing · Recommendation projections · Account (BMIS profile) · Legal pages (`/legal/:kind`)

**Admin:** Overview · Participants · Enrollments · Success Centers · Pricing · Rules · Recommendations · Disclosures · Settings (audit)

## Parked Phase 2 demo (not deleted)

Rewards, Learn, Campaigns activate flow, Admin Rewards/Marketing/Analytics (and legacy Members/Campaigns/Content pages) remain on disk. Routes are commented/redirected so deep links cannot open them. Look for `PHASE2_PARKED` comments.

## Open items (Todd)

- Final BMIS questionnaire questions
- Final recommendation formula
- Final legal/disclosure wording
- Confirm Stripe; wire when backend exists
- Final Success Center launch list/content

## Backend note

This repo is FE-only mocks. Real JWT, MongoDB, and Stripe are out of scope here; API modules under `src/lib/api/*` are shaped for a future HTTP swap.
