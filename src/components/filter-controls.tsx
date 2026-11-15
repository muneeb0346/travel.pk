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
  "PIA",
  "Qatar Airways",
  "SereneAir",
  "Virgin Atlantic",
];

const inputClasses =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700";

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
      .map((airline) => airline.trim())
      .filter(Boolean)
  );
  const [priceDraft, setPriceDraft] = useState(params.price ?? "");

  useEffect(() => {
    setSelectedAirlines(
      (params.airlines ?? "")
        .split(",")
        .map((airline) => airline.trim())
        .filter(Boolean)
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
    <section className="flex flex-col sm:flex-row sm:items-end gap-3 border border-slate-200 rounded-lg p-4 sm:p-5 bg-slate-50/50">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <label htmlFor="cabin-select" className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Cabin
        </label>
        <select
          id="cabin-select"
          value={params.cabin ?? "any"}
          onChange={(event) => toggleCabin(event.target.value)}
          className={inputClasses}
        >
          {CABIN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <label htmlFor="stops-select" className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Stops
        </label>
        <select
          id="stops-select"
          value={params.stops ?? "any"}
          onChange={(event) => toggleStops(event.target.value)}
          className={inputClasses}
        >
          {STOPS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Airlines
        </label>
        <div className="flex flex-wrap gap-2">
          {AIRLINE_OPTIONS.map((airline) => (
            <label key={airline} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline)}
                onChange={() => toggleAirline(airline)}
                className="rounded border-slate-300 text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              />
              {airline}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <label htmlFor="price-input" className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Max price (PKR)
        </label>
        <input
          id="price-input"
          type="number"
          min="0"
          value={priceDraft}
          onChange={(event) => setPriceDraft(event.target.value)}
          onBlur={commitPrice}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitPrice();
          }}
          className={inputClasses}
        />
      </div>

      {active && (
        <ClearFiltersButton params={params} />
      )}
    </section>
  );
}
