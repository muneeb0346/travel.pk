import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
          Pakistan flight discovery
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          travel.pk
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Search live flight offers or explore route guides with clear fares, schedules, and filters built for
          quick comparison.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-foreground)] shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Search flights
          </Link>
          <Link
            href="/flights/karachi-to-dubai"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Route guide: Karachi → Dubai
          </Link>
        </div>
      </section>
    </main>
  );
}