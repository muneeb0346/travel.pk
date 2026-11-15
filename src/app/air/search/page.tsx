import { Suspense } from "react";
import OffersList from "./offers-list";
import { ResultsSkeleton } from "./results-skeleton";
import { FilterControls } from "@/components/filter-controls";
import { SortSelector } from "@/components/sort-selector";
import { MobileFilterDialog } from "@/components/mobile-filter-dialog";

export type SearchParams = {
  route?: string;
  date?: string;
  pax?: string;
  cabin?: string;
  stops?: string;
  airlines?: string;
  price?: string;
  sort?: string;
  simulate?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Flight results</h1>
      <p className="text-sm text-slate-500 mb-6">
        {params.route} {'\u00b7'} {params.date} {'\u00b7'} {params.pax} passengers {'\u00b7'}
        {params.cabin} {'\u00b7'} {params.stops} {'\u00b7'} sort: {params.sort}
        {params.simulate ? ` \u00b7 simulate: ${params.simulate}` : ""}
      </p>

      <div className="hidden sm:flex gap-4 items-end mb-6">
        <FilterControls params={params} />
        <SortSelector params={params} />
      </div>
      <MobileFilterDialog params={params} />

      <Suspense key={params.route ?? ""} fallback={<ResultsSkeleton />}>
        <OffersList params={params} />
      </Suspense>
    </main>
  );
}
