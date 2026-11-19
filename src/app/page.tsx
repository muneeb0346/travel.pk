import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/card";
import { Button } from "@/components/button";

export default function Home() {
  return (
    <PageContainer>
      <Card className="py-0 sm:p-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">
          Pakistan flight discovery
        </p>
        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          travel.pk
        </h1>
        <p className="mb-10 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Search live flight offers or explore route guides with clear fares, schedules, and filters built for
          quick comparison.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2"
          >
            <Button variant="primary">Search flights</Button>
          </Link>
          <Link href="/air/flights/karachi-to-dubai">
            <Button variant="outline">Route guide: Karachi → Dubai</Button>
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
