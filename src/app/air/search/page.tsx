import { Suspense } from "react";
import OffersList from "./offers-list";
import { ResultsSkeleton } from "./results-skeleton";
import { FilterControls } from "@/components/filter-controls";
import { MobileFilterDialog } from "@/components/mobile-filter-dialog";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/card";

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

function formatRoute(route?: string): string {
  if (!route) return "Selected route";
  const parts = route
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean);
  const deduped: string[] = [];
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower === "to" && deduped[deduped.length - 1]?.toLowerCase() === "to") continue;
    deduped.push(part);
  }
  const labels = deduped.map((part) =>
    part.toLowerCase() === "to" ? "to" : part.charAt(0).toUpperCase() + part.slice(1),
  );
  let text = labels.join(" ");
  text = text.replace(/\bto to\b/gi, "to");
  return text;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const summary = [
    params.date,
    params.pax ? `${params.pax} passengers` : null,
    params.cabin,
    params.stops && params.stops !== "any" ? params.stops : null,
    params.sort ? `sort: ${params.sort}` : null,
    params.simulate ? `simulate: ${params.simulate}` : null,
  ].filter(Boolean);

  return (
    <PageContainer>
      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">
          Live fares
        </p>
        <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {formatRoute(params.route)}
        </h1>
        <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-[var(--muted)] sm:text-base">
          {summary.length > 0 ? summary.join(" · ") : "Review available offers for your selected route."}
        </p>
        <div className="mt-4 hidden sm:block">
          <FilterControls params={params} />
        </div>
        <div className="mt-4 sm:hidden">
          <MobileFilterDialog params={params} />
        </div>
      </Card>

      <Suspense key={JSON.stringify(params)} fallback={<ResultsSkeleton />}>
        <OffersList params={params} />
      </Suspense>
    </PageContainer>
  );
}
