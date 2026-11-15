import { Suspense } from "react";
import OffersList from "./offers-list";
import { ResultsSkeleton } from "./results-skeleton";

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
        {params.route} · {params.date} · {params.pax} passengers ·
        {params.cabin} · {params.stops} · sort: {params.sort}
        {params.simulate ? ` · simulate: ${params.simulate}` : ""}
      </p>

      <Suspense key={params.route ?? ""} fallback={<ResultsSkeleton />}>
        <OffersList params={params} />
      </Suspense>
    </main>
  );
}
