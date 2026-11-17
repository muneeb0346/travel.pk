import { readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(new URL("../src/data/offers.json", import.meta.url), "utf8"));

const CABINS = new Set(["economy", "business", "first"]);
const STOPS = new Set(["any", "nonstop", "1plus"]);
const errors = [];
const ids = new Set();

for (const [i, offer] of raw.entries()) {
  const prefix = `offer[${i}]`;
  if (typeof offer.id !== "string") errors.push(`${prefix}: id missing`);
  else {
    if (ids.has(offer.id)) errors.push(`${prefix}: duplicate id ${offer.id}`);
    ids.add(offer.id);
  }
  if (typeof offer.route !== "string") errors.push(`${prefix}: route missing`);
  if (typeof offer.price !== "number" || !Number.isFinite(offer.price) || offer.price < 0) {
    errors.push(`${prefix}: price invalid ${JSON.stringify(offer.price)}`);
  }
  if (offer.currency !== "PKR") errors.push(`${prefix}: currency not PKR`);
  if (!CABINS.has(offer.cabin)) errors.push(`${prefix}: cabin invalid ${offer.cabin}`);
  if (!STOPS.has(offer.stops)) errors.push(`${prefix}: stops invalid ${offer.stops}`);
  if (typeof offer.airline !== "string") errors.push(`${prefix}: airline missing`);
  if (typeof offer.airlineCode !== "string") errors.push(`${prefix}: airlineCode missing`);
  if (!Array.isArray(offer.segments) || offer.segments.length === 0) {
    errors.push(`${prefix}: segments empty`);
    continue;
  }
  offer.segments.forEach((seg, j) => {
    const p = `${prefix}.segments[${j}]`;
    for (const k of ["carrier", "flightNumber", "origin", "destination"]) {
      if (typeof seg[k] !== "string") errors.push(`${p}: ${k} missing`);
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(seg.departure ?? "")) {
      errors.push(`${p}: departure missing offset`);
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(seg.arrival ?? "")) {
      errors.push(`${p}: arrival missing offset`);
    }
    if (typeof seg.durationMinutes !== "number") errors.push(`${p}: durationMinutes missing`);
    if (typeof seg.originTimezone !== "string") errors.push(`${p}: originTimezone missing`);
    if (typeof seg.destinationTimezone !== "string") errors.push(`${p}: destinationTimezone missing`);
  });
  if (typeof offer.durationMinutes !== "number") errors.push(`${prefix}: durationMinutes missing`);
}

const prices = raw.map((o) => o.price);
const min = Math.min(...prices);
const max = Math.max(...prices);

console.log(`offers: ${raw.length} (ids unique: ${ids.size === raw.length})`);
console.log(`price range: PKR ${min} - PKR ${max}`);
console.log(`cabin mix: ${[...raw].reduce((a, o) => ((a[o.cabin] = (a[o.cabin] || 0) + 1), a), {})}`);
console.log(`stops mix: ${[...raw].reduce((a, o) => ((a[o.stops] = (a[o.stops] || 0) + 1), a), {})}`);
console.log(`routes: ${[...new Set(raw.map((o) => o.route))].sort().join(", ")}`);
console.log(errors.length ? `VALIDATION FAILED:\n${errors.join("\n")}` : "VALIDATION PASSED");
process.exit(errors.length ? 1 : 0);
