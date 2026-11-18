"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { pushParams } from "./retry-button";
import type { SearchParams } from "@/app/air/search/page";

const CABIN_OPTIONS: { value: string; label: string }[] = [
  { value: "any", label: "Any cabin" },
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

const STOPS_OPTIONS: { value: string; label: string }[] = [
  { value: "any", label: "Any stops" },
  { value: "nonstop", label: "Nonstop" },
  { value: "1plus", label: "1+ stops" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "duration", label: "Shortest duration" },
];

const AIRLINE_OPTIONS = [
  "Air Arabia",
  "Airblue",
  "British Airways",
  "Emirates",
  "FlyDubai",
  "Gulf Air",
  "Pakistan International Airlines",
  "Qatar Airways",
  "SereneAir",
  "Virgin Atlantic",
];

const fieldClass =
  "block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] shadow-sm";

const pillBase =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all hover:border-[var(--accent)]";

const pillActiveClass =
  "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]";

const clearPillClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-800 transition-all";

function normalizeAirlineParam(value: string): string {
  return value.trim().toLowerCase() === "pia" ? "Pakistan International Airlines" : value.trim();
}

export function FilterControls({
  params,
}: {
  params: SearchParams;
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  const [selectedAirlines, setSelectedAirlines] = useState<string[]>(() =>
    (params.airlines ?? "")
      .split(",")
      .map((airline) => normalizeAirlineParam(airline))
      .filter(Boolean)
      .filter((airline, index, arr) => arr.indexOf(airline) === index)
  );
  const [priceDraft, setPriceDraft] = useState(params.price ?? "");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [selectedAirlines]);

  useEffect(() => {
    setSelectedAirlines(
      (params.airlines ?? "")
        .split(",")
        .map((airline) => normalizeAirlineParam(airline))
        .filter(Boolean)
        .filter((airline, index, arr) => arr.indexOf(airline) === index)
    );
  }, [params.airlines]);

  useEffect(() => {
    setPriceDraft(params.price ?? "");
  }, [params.price]);

  function toggleCabin(value: string) {
    pushParams(router, params, { cabin: value === "any" ? undefined : value });
  }

  function toggleStops(value: string) {
    pushParams(router, params, { stops: value === "any" ? undefined : value });
  }

  function toggleSort(value: string) {
    pushParams(router, params, { sort: value });
  }

  function toggleAirline(airline: string) {
    setSelectedAirlines((previous) => {
      const next = previous.includes(airline)
        ? previous.filter((item) => item !== airline)
        : [...previous, airline];
      pushParams(router, params, {
        airlines: next.length > 0 ? next.join(",") : undefined,
      });
      return next;
    });
  }

  function commitPrice() {
    const value = priceDraft === "" ? undefined : priceDraft;
    pushParams(router, params, { price: value });
  }

  function clearFilters() {
    const sp = new URLSearchParams();
    if (params.route) sp.set("route", params.route);
    if (params.date) sp.set("date", params.date);
    if (params.pax) sp.set("pax", params.pax);
    if (params.sort) sp.set("sort", params.sort);
    if (params.simulate) sp.set("simulate", params.simulate);
    router.push(`?${sp.toString()}`);
  }

  return (
    <section aria-label="Filter controls" className="relative w-full">
      <div className="flex flex-col gap-2">
        {/* Row 1: cabin, stops, price, sort */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 min-w-0">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cabin-select"
              className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
            >
              Cabin
            </label>
            <select
              id="cabin-select"
              value={params.cabin ?? "any"}
              onChange={(event) => toggleCabin(event.target.value)}
              className={fieldClass}
            >
              {CABIN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="stops-select"
              className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
            >
              Stops
            </label>
            <select
              id="stops-select"
              value={params.stops ?? "any"}
              onChange={(event) => toggleStops(event.target.value)}
              className={fieldClass}
            >
              {STOPS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="price-input"
              className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
            >
              Max price (PKR)
            </label>
            <input
              id="price-input"
              type="number"
              min="0"
              inputMode="numeric"
              value={priceDraft}
              onChange={(event) => setPriceDraft(event.target.value)}
              onBlur={commitPrice}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitPrice();
              }}
              className={fieldClass}
              placeholder="Any price"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="sort-select"
              className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
            >
              Sort by
            </label>
            <select
              id="sort-select"
              value={params.sort ?? "price_asc"}
              onChange={(event) => toggleSort(event.target.value)}
              className={fieldClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: airlines pills (scrollable) + clear cross sibling on right */}
        <div className="flex items-start gap-2 min-w-0">
          <div className="relative flex flex-1 min-w-0 overflow-hidden">
            <div
              ref={scrollRef}
              className="overflow-x-auto w-full min-w-0 flex-nowrap gap-2 scrollbar-none flex"
            >
              {AIRLINE_OPTIONS.map((airline) => (
                <label
                  key={airline}
                  className={`${pillBase} ${selectedAirlines.includes(airline) ? pillActiveClass : ""}`}
                  onPointerDown={(event) => event.preventDefault()}
                >
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline)}
                    onChange={() => toggleAirline(airline)}
                    className="peer sr-only"
                  />
                  <span className="whitespace-nowrap">{airline}</span>
                </label>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--surface)] to-transparent transition-opacity duration-300"
              style={{ opacity: canScrollLeft ? 1 : 0 }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--surface)] to-transparent transition-opacity duration-300"
              style={{ opacity: canScrollRight ? 1 : 0 }}
            />
          </div>
          <button
            type="button"
            onClick={clearFilters}
            aria-label="Clear filters"
            className={clearPillClass}
            style={{ minWidth: "auto" }}
          >
            ×
          </button>
        </div>
      </div>
    </section>
  );
}
