import { headers } from "next/headers";
import type { SearchParams } from "./page";
import { OffersResponse, Offer } from "@/types/offer";
import { formatPrice } from "@/lib/format";
import { RetryButton } from "@/components/retry-button";
import { ClearFiltersButton } from "@/components/clear-filters-button";

function matchesAirline(offer: Offer, airlines: string): boolean {
  const wanted = airlines
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);
  if (wanted.length === 0) return true;
  const haystack = `${offer.airline} ${offer.airlineCode}`.toLowerCase();
  return wanted.some((w) => haystack.includes(w));
}

function matchesStops(offer: Offer, stops: string): boolean {
  if (stops === "any") return true;
  return offer.stops === stops;
}

function matchesDate(offer: Offer, date: string): boolean {
  return offer.segments.some(
    (segment) =>
      segment.departure.slice(0, 10) === date ||
      segment.arrival.slice(0, 10) === date,
  );
}

function applyFilters(
  offers: Offer[],
  {
    route,
    cabin,
    stops,
    airlines,
    price,
    date,
  }: {
    route?: string;
    cabin?: string;
    stops?: string;
    airlines?: string;
    price?: string;
    date?: string;
  },
): Offer[] {
  return offers.filter((offer) => {
    if (route && offer.route !== route) return false;
    if (cabin && cabin !== "any" && offer.cabin !== cabin) return false;
    if (stops && !matchesStops(offer, stops)) return false;
    if (airlines && !matchesAirline(offer, airlines)) return false;
    if (price) {
      const max = Number(price);
      if (!Number.isNaN(max) && offer.price > max) return false;
    }
    if (date && !matchesDate(offer, date)) return false;
    return true;
  });
}

function applySort(offers: Offer[], sort?: string): Offer[] {
  const sorted = [...offers];
  switch (sort) {
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "duration":
      sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
      break;
  }
  return sorted;
}

function activeFiltersDescription(params: SearchParams): string | null {
  const parts: string[] = [];
  if (params.cabin && params.cabin !== "any") parts.push(params.cabin);
  if (params.stops && params.stops !== "any") parts.push(params.stops);
  if (params.airlines) parts.push(`airlines: ${params.airlines}`);
  if (params.price) parts.push(`max PKR ${params.price}`);
  return parts.length ? parts.join(" \u00b7 ") : null;
}

export default async function OffersList({
  params,
}: {
  params: SearchParams;
}) {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const searchParams = new URLSearchParams();
  if (params.route) searchParams.set("route", params.route);
  if (params.date) searchParams.set("date", params.date);
  if (params.pax) searchParams.set("pax", params.pax);
  if (params.cabin) searchParams.set("cabin", params.cabin);
  if (params.stops) searchParams.set("stops", params.stops);
  if (params.airlines) searchParams.set("airlines", params.airlines);
  if (params.price) searchParams.set("price", params.price);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.simulate) searchParams.set("simulate", params.simulate);

  const res = await fetch(`${origin}/api/offers?${searchParams.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return (
      <section>
        <p role="status" aria-live="polite">
          Unable to load flights. The service is temporarily unavailable.
        </p>
        <RetryButton />
        <ul aria-label="Flight results"></ul>
      </section>
    );
  }

  const data: OffersResponse = await res.json();

  let offers = applyFilters(data.offers, {
    route: params.route,
    cabin: params.cabin,
    stops: params.stops,
    airlines: params.airlines,
    price: params.price,
    date: params.date,
  });
  offers = applySort(offers, params.sort);

  const filters = activeFiltersDescription(params);

  return (
    <section>
      {data.failedAirlines.length > 0 && (
        <div role="status" aria-live="polite" className="mb-3 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          Partial results {'\u2014'} {data.failedAirlines.join(
            ", "
                        )} couldn{'\u2019'}t be loaded.
        </div>
      )}
      <p role="status" aria-live="polite">
        {offers.length} flight result{offers.length !== 1 ? "s" : ""} found
      </p>
      <ul aria-label="Flight results" className="divide-y divide-slate-200">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <li key={offer.id} className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="font-semibold">{offer.airline}</div>
                  <div className="text-xs text-slate-500">
                    {offer.airlineCode} {offer.segments[0]?.flightNumber ?? ""}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold">
                      {formatPrice(offer.price)}
                    </span>
                    <span className="text-xs text-slate-500">{offer.cabin}</span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    {offer.segments.map((segment) => (
                      <div
                        key={`${segment.origin}-${segment.destination}`}
                        className="overflow-hidden overflow-x-clip"
                      >
                        {segment.origin} {'\u2192'} {segment.destination}
                        <br />
                        <span className="text-xs font-mono">
                          {segment.departure.slice(11, 16)} {segment.originTimezone}
                          {" \u2192 "}
                          {segment.arrival.slice(11, 16)} {segment.destinationTimezone}
                        </span>
                      </div>
                    ))}
                    <div className="mt-1 text-xs text-slate-500">
                      {offer.durationMinutes} min
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li key="none" className="py-4 text-slate-500">
            No flights found.{filters ? ` Filters: ${filters}.` : ""}
          </li>
        )}
      </ul>
      {offers.length === 0 && filters && <ClearFiltersButton params={params} />}
    </section>
  );
}
