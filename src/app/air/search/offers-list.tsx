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
  return parts.length ? parts.join(" · ") : null;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
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
      <section className="rounded-2xl border border-red-900/50 bg-red-950/30 p-5 text-red-100 shadow-sm sm:p-6">
        <p role="status" aria-live="polite" className="text-base font-medium">
          Unable to load flights. The service is temporarily unavailable.
        </p>
        <p className="mt-2 text-sm text-red-200">
          Your search and filters are still applied. Try again in a moment.
        </p>
        <div className="mt-4">
          <RetryButton />
        </div>
        <ul aria-label="Flight results" className="sr-only"></ul>
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
    <section className="mt-6 space-y-4">
      {data.failedAirlines.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-amber-900/50 bg-amber-950/30 p-4 text-sm text-amber-100 shadow-sm"
        >
          <p className="font-medium">Partial results</p>
          <p className="mt-1">
            {data.failedAirlines.join(", ")} couldn&apos;t be loaded. Showing available offers below.
          </p>
        </div>
      )}

      <p role="status" aria-live="polite" className="text-sm font-medium text-[var(--muted)]">
        {offers.length} flight result{offers.length !== 1 ? "s" : ""} found
      </p>

      <ul aria-label="Flight results" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <li
              key={offer.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
                      {offer.airline}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {offer.airlineCode} {offer.segments[0]?.flightNumber ?? ""}
                    </p>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-200">
                      {offer.cabin}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-200">
                      {offer.stops === "nonstop" ? "Nonstop" : "1+ stops"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {offer.segments.map((segment) => (
                      <div
                        key={`${segment.origin}-${segment.destination}`}
                        className="flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="min-w-0 truncate">
                            <p className="font-medium text-[var(--foreground)]">
                              {segment.departure.slice(11, 16)}{" "}
                              <span className="text-[var(--muted)]">{segment.origin}</span>
                            </p>
                            <p className="text-xs text-[var(--muted)]">
                              {segment.originTimezone}
                            </p>
                          </div>
                          <span
                            className="shrink-0 text-[var(--muted)]"
                            aria-hidden="true"
                          >
                            →
                          </span>
                          <div className="min-w-0 truncate text-right sm:text-left">
                            <p className="font-medium text-[var(--foreground)]">
                              {segment.arrival.slice(11, 16)}{" "}
                              <span className="text-[var(--muted)]">{segment.destination}</span>
                            </p>
                            <p className="text-xs text-[var(--muted)]">
                              {segment.destinationTimezone}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-end justify-between gap-3 border-t border-[var(--border)] pt-3 sm:flex-col sm:items-end sm:justify-start sm:gap-0 sm:border-t-0 sm:pt-0 sm:text-right">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Total fare</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                      {formatPrice(offer.price)}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    Duration: {formatDuration(offer.durationMinutes)}
                  </p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="col-span-1 lg:col-span-2 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm sm:p-8">
            <p className="text-base font-medium text-[var(--foreground)]">No flights found</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {filters
                ? `No offers match your active filters: ${filters}.`
                : "No offers are available for this search right now."}
            </p>
            <div className="mt-6 flex justify-center">
              <ClearFiltersButton params={params} />
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}
