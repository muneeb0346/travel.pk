# CACHING.md — travel.pk

One-page summary of what is cached, what is not, and what breaks if either is reversed.

## What is cached

| Resource | Mechanism | TTL / behavior |
|----------|-----------|----------------|
| `/air/flights/karachi-to-dubai` (static route guide) | `export const revalidate = 3600` in `src/app/air/flights/karachi-to-dubai/page.tsx` | Incremental Static Regeneration: prerendered at build, regenerated at most once per hour on request. `next build` reports Revalidate `1h`, Expire `1y`. |
| Next.js framework assets (`/_next/*`, fonts, CSS, JS chunks) | Next.js default output | Standard browser/CDN caching of build assets; versioned file names. |
| React Router / `searchParams` reads | None (by design) | Every search read is fresh; nothing about `/air/search` is cached. |

No other route or API response is cached. `npm run build` output confirms only the route guide has a revalidate value; `/`, `/air/search`, `/api/offers` are dynamic/on-demand.

## What is NOT cached

| Resource | Why not cached |
|----------|----------------|
| `/api/offers` (live fares) | Live fares must never go stale. Fetched with `cache: "no-store"` and `next: { revalidate: 0 }` from the server (`src/app/air/search/offers-list.tsx:109-113`). Every search hits the API fresh. |
| `/air/search` page results | Uncached by construction — part of the URL-as-state contract; pasted URLs must reproduce current fares, not yesterday's. |
| `/api/offers` `simulate` states | All five simulation states (`ok`, `slow`, `empty`, `partial`, `error`) are generated on demand; no response is stored. |

## What breaks if caching is reversed

**If `/api/offers` or `/air/search` were cached (e.g. `revalidate: 3600` or default ISR):**

1. **Stale fares shown to travelers.** A returned fare or availability snapshot could be an hour old; users may be quoted prices that no longer exist. Core trust breakage for a flight search.
2. **Simulation states break.** `?simulate=slow` (~2500 ms), `?simulate=error` (503), `?simulate=empty`, and `?simulate=partial` exist specifically to test loading/error/empty/partial UIs. A cached 200 response would mask all of them — QA and regression testing collapse.
3. **URL-as-state breaks.** Refreshing `?simulate=error&price=50000` would serve a cached success page instead of the error UI, and browser back/forward would show mismatched fare sets for the same URL.
4. **Retry becomes meaningless.** `router.refresh()` after a 503 would return the cached 200, hiding the service-unavailable path the Retry button is designed to recover from.

**If the route guide's `revalidate = 3600` were removed (fully static) or raised:**

- Removed: the guide ("~2h15m KHI→DXB, PKT vs GST, fares from PKR 54,200") would never reflect fare/airline changes; content goes stale silently.
- Raised (or set to `false`/uncached): every guide request rerenders server-side — wasteful for a rarely-changing route page and removes the build-time optimization, but nothing functionally breaks.

## Bottom line

Live fares: never cached. Static route guide: cached for 1 hour. Reversing the live-fares rule breaks correctness, simulation-based QA, and URL-as-state; it is the one caching decision that must not change.
