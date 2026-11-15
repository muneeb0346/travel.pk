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
      className="underline underline-offset-4 text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
    >
      Clear filters
    </button>
  );
}
