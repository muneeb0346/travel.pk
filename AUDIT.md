# AUDIT.md — travel.pk

## Scope

**Audited page:** `/flights/karachi-to-dubai` — "Karachi to Dubai Flight Route Guide" (`src/app/flights/karachi-to-dubai/page.tsx`), served at `http://localhost:3000/flights/karachi-to-dubai`.

**Type:** Accessibility (WCAG AA) + speed audit. **Report only — the live site was not patched.**

**Method / tools (free):** rendered HTML captured via `curl` (`docs/evidence/page-route-guide.html`), source inspection of `page.tsx` and `src/app/layout.tsx`, `next build` output, and markup checks. No browser was available in this sandbox, so automated tools (Lighthouse, axe DevTools, DevTools contrast inspector) could not be run; where a check needs a browser (color contrast, computed focus styles), it is flagged "verify locally" rather than scored.

## Findings

### 1. Live-fares URL is plain text, not a link (accessibility)

**Evidence:** `src/app/flights/karachi-to-dubai/page.tsx:27-29` — "Live fares are uncached and fetched per search at `<code>/air/search?route=karachi-to-dubai</code>`." The URL sits inside `<code>`, is not an `<a>`, and cannot be tabbed to or activated from the keyboard.

**Who it hurts:** Keyboard-only and motor-impaired users (must copy/paste manually); screen-reader users get no navigable target to the live search.

**Severity:** Moderate.

**One-line fix:** Replace `<code>/air/search?route=karachi-to-dubai</code>` with `<a href="/air/search?route=karachi-to-dubai">Live fares for Karachi → Dubai</a>` (inherits the global `:focus-visible` outline in `src/app/globals.css:29`).

---

### 2. No skip-to-content link or landmark region (accessibility)

**Evidence:** `page.tsx` returns `<article>…</article>` directly; `layout.tsx` renders `{children}` inside `<body>` with no `<main>`, no `aria-label` landmark, and no skip link (`src/app/layout.tsx:20-33`, `page.tsx:8-10`).

**Who it hurts:** Keyboard and screen-reader users must tab/linearize through every block on repeat visits before reaching the guide content.

**Severity:** Moderate.

**One-line fix:** Wrap the page body in `<main>` (or add a visually-hidden skip-to-content link as the first focusable element).

---

### 3. Fare guidance can be stale up to 1 hour with no freshness signal (accuracy / speed-adjacent)

**Evidence:** `page.tsx:1` — `export const revalidate = 3600`; `page.tsx:25` — "Economy fares start around PKR 54,200; business class from roughly PKR 88,000" is static text with no "last reviewed" date. `next build` reports Revalidate `1h` for this route.

**Who it hurts:** All users planning trips; stale fares mislead budgeting.

**Severity:** Low.

**One-line fix:** Add a "Last reviewed <date>" line (or hard-code nothing — link to live fares and drop the static price claims).

---

### 4. Page is fast by construction (strength, not defect)

**Evidence:** `next build` output — route is 127 B, Revalidate `1h`, Expire `1y`, statically prerendered; zero client-side data fetching; Geist fonts self-hosted via `next/font` (`layout.tsx:5-13`); no images on the page (`page.tsx` has no ``).

**Who it helps:** Everyone — especially slow connections; first-load JS is the shared 103 kB framework bundle, not page-specific code.

**Severity:** N/A (positive finding). No fix needed; keep `revalidate = 3600` and avoid adding client components or images to this page.

---

### 5. Contrast and computed focus styles not verified (verification gap)

**Evidence:** `:focus-visible` is defined globally in `src/app/globals.css:29-32` (`outline: 2px solid var(--foreground)`, offset 2px) and `body` has `overflow-x: hidden`, but the audited page contains no focusable elements today, so nothing to verify; contrast ratios were not measurable (no browser available in this sandbox).

**Who it hurts:** Unknown until checked — low-vision users if contrast is below 4.5:1; keyboard users if outlines are ever removed.

**Severity:** Low (verification task).

**One-line fix:** Run Lighthouse + axe DevTools in Chrome/Firefox on `localhost:3000/flights/karachi-to-dubai` and fix any contrast/focus violations found. (Finding 1's new `<a>` is covered by the global focus style.)

## Summary

| Severity | Count |
|----------|-------|
| Moderate | 2 |
| Low | 2 |
| Positive | 1 |

**Release blocker?** No. Fix findings 1 and 2 before launch; finding 3 is a content-accuracy housekeeping item; finding 5 is a pre-release verification step.

**Recommended free checks locally:** Lighthouse (CI or CLI), axe DevTools browser extension, DevTools "Emulate vision deficiencies" + keyboard tab pass.
