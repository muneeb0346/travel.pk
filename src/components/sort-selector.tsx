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
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="sort-select"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
      >
        Sort by
      </label>
      <select
        id="sort-select"
        value={params.sort ?? "price_asc"}
        onChange={(event) => {
          router.push(`?${buildSearchParams(params, { sort: event.target.value })}`);
        }}
        className="block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] shadow-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
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
