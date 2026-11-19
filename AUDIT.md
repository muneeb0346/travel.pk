# Accessibility & Speed Audit (`AUDIT.md`)

**Target:** `https://travel.pk/air/search/?origin=KHI&destination=DXB&departure=2026-11-21`  
**Tool:** Google Lighthouse 13.5.0 (Desktop)  
**Evidence:** Lighthouse JSON report + network waterfall + screenshots captured locally in Chrome/Firefox.  

---

### 1. Slow Server Response (TTFB) & Stalled Asset Chunks
* **Severity:** Critical
* **Evidence:** Lighthouse `server-response-time` measured `1,407 ms` (metric TTFB `2,710 ms`), Speed Index hit `5.9 s`, and the run triggered a slow-load warning (*"The page loaded too slowly to finish within the time limit"*). Network logs show 12+ `/_next/static/chunks/*.js` files aborted (`statusCode: -1`) alongside Cloudflare's `/cdn-cgi/challenge-platform/scripts/jsd/main.js`.
* **Who it hurts:** Users on slower or mobile connections searching for flights—they stare at an incomplete/stalled state for ~6 seconds, and automated crawlers/browsers time out before hydration finishes.
* **One-line fix:** Serve the search skeleton immediately from edge cache (`TTFB < 200 ms`) while streaming live fare APIs client-side, and exclude `/_next/static/*` from Cloudflare JS bot challenges.

---

### 2. Prohibited `aria-label` on Generic `<div>` Container
* **Severity:** High
* **Evidence:** Lighthouse `aria-prohibited-attr` flagged `<div class="space-y-3" aria-busy="true" aria-label="Loading flight results">` inside `main#main` (also breaking the `agent-accessibility-tree` check).
* **Who it hurts:** Screen reader users and AI browser agents, which cannot reliably announce or parse `aria-label` attributes placed on role-less `<div>` elements.
* **One-line fix:** Add `role="status"` to the loading container `<div>` so its `aria-label` and `aria-busy` state are valid in the accessibility tree.

---

### 3. Unused CSS & JavaScript Bloating Initial Payload
* **Severity:** Medium
* **Evidence:** Lighthouse `unused-css-rules` reported **93.4% unused CSS** (`33,268 B` of `36,154 B`) in `0g45zc95i4oca.css`, while `unused-javascript` and `legacy-javascript-insight` flagged **78.1% unused JS** (`57,289 B` of `73,860 B`) plus `13,815 B` of ES polyfills (`Array.prototype.at`, `Object.fromEntries`, `Object.hasOwn`) in `2dtu9uvb7_qpz.js`.
* **Who it hurts:** Bandwidth-constrained and mobile users paying data costs and waiting extra round-trips (`510 ms` RTT) to download code never executed on the search page.
* **One-line fix:** Target modern browsers in `.browserslistrc` to drop legacy polyfills, scope route-level CSS, and lazy-load non-critical modals/drawers.

---

### 4. Low Text Color Contrast in Top Navigation
* **Severity:** Medium
* **Evidence:** Lighthouse `color-contrast` flagged two header elements below the WCAG AA `4.5:1` threshold: the brand tagline `ELEVATED JOURNEYS` (`2.53:1`, `#9ca3af` on `#ffffff`) and the active `Flights` link (`4.34:1`, `#64748b` on `#f1f5f9`).
* **Who it hurts:** Users with low vision, color vision deficiencies, or anyone viewing the site outdoors on a glaring mobile screen.
* **One-line fix:** Darken the tagline to `#4b5563` (`text-gray-600`) and deepen the active `Flights` text color to achieve at least a `4.5:1` contrast ratio.

---

### 5. Accessible Name vs. Visible Text Mismatch on Header Links
* **Severity:** Low
* **Evidence:** Lighthouse `label-content-name-mismatch` flagged two links in `<header>`: the home link (`visible: "Travel.pk"`, `aria-label="Travel.pk Home"`) and the primary CTA (`visible: "Book Now"`, `aria-label="Book a flight"`).
* **Who it hurts:** Speech-recognition / voice-control users (e.g., Dragon NaturallySpeaking, Voice Control) who try to click links by speaking their visible on-screen text.
* **One-line fix:** Remove the mismatched `aria-label` attributes from both links (or match them verbatim to `"Travel.pk"` and `"Book Now"`).