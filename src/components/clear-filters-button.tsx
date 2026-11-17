"use client";

import { useRouter } from "next/navigation";
import type { SearchParams } from "@/app/air/search/page";

export function ClearFiltersButton({
  params,
}: {
  params: SearchParams;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        const sp = new URLSearchParams();
        if (params.route) sp.set("route", params.route);
        if (params.date) sp.set("date", params.date);
        if (params.pax) sp.set("pax", params.pax);
        if (params.sort) sp.set("sort", params.sort);
        if (params.simulate) sp.set("simulate", params.simulate);
        router.push(`?${sp.toString()}`);
      }}
      className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      Clear filters
    </button>
  );
}
