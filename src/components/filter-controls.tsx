"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pushParams } from "./retry-button";
import { ClearFiltersButton } from "./clear-filters-button";
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

function normalizeAirlineParam(value: string): string {
  return value.trim().toLowerCase() === "pia" ? "Pakistan International Airlines" : value.trim();
}

const fieldClass =
  "block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] shadow-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

function hasActiveFilters(params: SearchParams, selectedAirlines: string[]): boolean {
  return (
    (params.cabin !== undefined && params.cabin !== "any") ||
    (params.stops !== undefined && params.stops !== "any") ||
    selectedAirlines.length > 0 ||
    (params.price !== undefined && params.price !== "")
  );
}

export function FilterControls({
  params,
}: {
  params: SearchParams;
}) {
  const router = useRouter();
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>(
    (params.airlines ?? "")
      .split(",")
      .map((airline) => normalizeAirlineParam(airline))
      .filter(Boolean)
      .filter((airline, index, arr) => arr.indexOf(airline) === index)
  );
  const [priceDraft, setPriceDraft] = useState(params.price ?? "");

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

  const active = hasActiveFilters(params, selectedAirlines);

  function toggleCabin(value: string) {
    pushParams(router, params, { cabin: value === "any" ? undefined : value });
  }

  function toggleStops(value: string) {
    pushParams(router, params, { stops: value === "any" ? undefined : value });
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

  return (
    <section
      aria-label="Filter controls"
      className="flex w-full flex-col gap-4 lg:flex-1"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
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
      </div>

      <fieldset className="min-w-0">
        <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Airlines
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {AIRLINE_OPTIONS.map((airline) => (
            <label
              key={airline}
              className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-slate-800/60"
            >
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline)}
                onChange={() => toggleAirline(airline)}
                className="h-4 w-4 shrink-0 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] accent-[var(--accent)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              />
              <span className="break-words">{airline}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {active && (
        <div className="flex">
          <ClearFiltersButton params={params} />
        </div>
      )}
    </section>
  );
}
