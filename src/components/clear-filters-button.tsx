"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import type { SearchParams } from "@/app/air/search/page";

export function ClearFiltersButton({
  params,
}: {
  params: SearchParams;
}) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        const sp = new URLSearchParams();
        if (params.route) sp.set("route", params.route);
        if (params.date) sp.set("date", params.date);
        if (params.pax) sp.set("pax", params.pax);
        if (params.sort) sp.set("sort", params.sort);
        if (params.simulate) sp.set("simulate", params.simulate);
        router.push(`?${sp.toString()}`);
      }}
    >
      Clear filters
    </Button>
  );
}
