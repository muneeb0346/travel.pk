# travel.pk

Flight search prototype: live fares from `/api/offers`, URL-driven filter/sort/simulation state, static route guide, and WCAG AA-conscious UI. Built with Next.js 15 App Router + TypeScript + Tailwind CSS (no UI libraries, no state-management libraries).

## 10-minute setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open the app
open http://localhost:3000/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2
```

That's it — no build step, no env vars, no external services. The API (`/api/offers`) is served by the app itself and backed by `src/data/offers.json` (30 synthetic offers, PKR fares, local times with offsets).

## Simulate states (flaky-supplier testing)

Append `?simulate=<state>` to `/api/offers` (or to the search page URL) to exercise each supplier behavior:

| State | URL | Behavior |
|-------|-----|----------|
| `ok` | `/api/offers?simulate=ok` | 200, all ~30 offers, ~1200 ms delay |
| `slow` | `/api/offers?simulate=slow` | 200, all offers, ~2500 ms delay (streaming skeleton shows) |
| `empty` | `/api/offers?simulate=empty` | 200, `offers: []`, ~1500 ms delay |
| `partial` | `/api/offers?simulate=partial` | 200, 6 offers + `failedAirlines`, amber non-blocking banner, ~1500 ms |
| `error` | `/api/offers?simulate=error` | 503 `{ error: "service_unavailable" }`, no delay, error UI + Retry |
| invalid | `/api/offers?simulate=banana` | 400 with allowed-values message |
| default | `/api/offers` (no simulate) | `ok` with random 1200–2500 ms delay |

Example full page URLs:

```
http://localhost:3000/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2&simulate=ok
http://localhost:3000/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2&simulate=slow
http://localhost:3000/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2&simulate=empty
http://localhost:3000/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2&simulate=partial
http://localhost:3000/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2&simulate=error
```

State lives entirely in the URL (`route`, `date`, `pax`, `cabin`, `stops`, `airlines`, `price`, `sort`, `simulate`): paste a URL, hit refresh, or use back/forward and the screen reproduces exactly.

## Verification

```bash
npm run lint      # eslint — clean
npx tsc --noEmit  # typecheck — clean
npm run build     # next build — clean
node scripts/validate-offers.mjs   # offers.json schema/data validation
```

Rendered HTML + API evidence per state is committed under `docs/evidence/` (captured with `curl` against the dev server; see `docs/walkthrough.md`).

## Known gaps

- **No browser-based screenshots/walkthrough recording:** this sandbox has no browser binary and headless Chromium cannot launch here, so `docs/walkthrough.md` evidences the four states and keyboard pass with curl-captured rendered HTML plus source-verified focus behavior. Capture screenshots locally in Chrome/Firefox before submitting if required.
- **No test runner:** no vitest/jest/playwright installed. `scripts/validate-offers.mjs` covers data shape; add component/end-to-end tests next.
- **Synthetic data only:** 30 offers, fixed dates (2026-12-01), PKR only; no real GDS/airline integration.
- **Single static route guide:** only `/air/flights/karachi-to-dubai` exists; other routes lack guides.

## Next steps

**Decisions / tradeoffs (defensible at checkpoint)**
- URL-as-state: all search/filter/simulate params live in `searchParams`; `buildSearchParams`/`pushParams` keep route/date/pax/sort/simulate when filtering, and `ClearFiltersButton` preserves those while clearing cabin/stops/airlines/price.
- Server/client boundary: `src/app/air/search/page.tsx` is a React Server Component (never `"use client"`); it awaits `searchParams` (Next.js 15 promise) and streams `/OffersList` through `<Suspense>`. All interactive leaves (`FilterControls`, `SortSelector`, `MobileFilterDialog`, `RetryButton`, `ClearFiltersButton`) are `"use client"`. Server fetch of `/api/offers` uses an absolute URL derived from `headers()` — relative URLs throw `ERR_INVALID_URL` on the server in Next.js 15 (see `.kilo/agent/rules.md`).
- Flaky-supplier handling: `cache: "no-store"` + `next: { revalidate: 0 }` on every search fetch; `error` simulate → 503 with human-readable UI + `router.refresh()` retry that keeps all filters; `partial` → visible results + non-blocking amber banner; `empty` → names active filters and offers a working Clear filters button.

**Tests to add**
- Unit: `applyFilters`/`applySort` in `offers-list.tsx`; `formatPrice`; `buildSearchParams` round-trip (incl. undefined/empty deletes keys).
- E2E (Playwright): each simulate state renders expected UI; URL paste/refresh round-trip; keyboard tab order + focus-visible outlines; dialog Escape trap.

**Improvements**
- Add Lighthouse CI (speed) + axe-core (a11y) to CI; both are free.
- Cache `/api/offers` only per explicit opt-in — live fares intentionally remain uncached (see `CACHING.md`).
- Pagination/infinite scroll for large offer sets; debounce price input (currently commits on blur/Enter).
- Real backend behind `/api/offers`; keep the `simulate` contract for testing.

## Project context

This is Session S4 of the TechAbout assessment (travel.pk). Sessions S1–S3 built the API, search page, four states, and leaf components. Guardrails live in `.kilo/agent/project-map.md` and `.kilo/agent/rules.md`.
