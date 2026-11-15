"use client";

import { useRouter } from "next/navigation";
import { buildSearchParams } from "./retry-button";
import type { SearchParams } from "@/app/air/search/page";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "duration", label: "Shortest duration" },
];

export function SortSelector({
  params,
}: {
  params: SearchParams;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <label htmlFor="sort-select" className="text-xs font-medium text-slate-600 uppercase tracking-wider">
        Sort
      </label>
      <select
        id="sort-select"
        value={params.sort ?? "price_asc"}
        onChange={(event) => {
          router.push(`?${buildSearchParams(params, { sort: event.target.value })}`);
        }}
        className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
