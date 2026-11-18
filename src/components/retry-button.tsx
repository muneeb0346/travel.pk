"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
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
    <Button
      type="button"
      variant="primary"
      onClick={() => router.refresh()}
    >
      Retry
    </Button>
  );
}
