"use client";

import { useRouter } from "next/navigation";
import type { SearchParams } from "@/app/air/search/page";

export function buildSearchParams(
  params: SearchParams,
  updates: Partial<SearchParams>
): string {
  const sp = new URLSearchParams();
  const setIf = (key: string, value?: string) => {
    if (value !== undefined && value !== "") sp.set(key, value);
  };
  setIf("route", params.route);
  setIf("date", params.date);
  setIf("pax", params.pax);
  setIf("cabin", params.cabin);
  setIf("stops", params.stops);
  setIf("airlines", params.airlines);
  setIf("price", params.price);
  setIf("sort", params.sort);
  setIf("simulate", params.simulate);
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === "") sp.delete(key);
    else sp.set(key, value);
  }
  return sp.toString();
}

export function pushParams(
  router: ReturnType<typeof useRouter>,
  params: SearchParams,
  updates: Partial<SearchParams>
) {
  router.push(`?${buildSearchParams(params, updates)}`);
}

export function RetryButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      Retry
    </button>
  );
}
