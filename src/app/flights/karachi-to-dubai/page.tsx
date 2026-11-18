import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/card";
import { Button } from "@/components/button";

export const revalidate = 3600;

export const metadata = {
  title: "Karachi to Dubai — Flight Route Guide | travel.pk",
  description:
    "Static route guide for Karachi to Dubai flights: airlines, duration, timezone, and fares in PKR.",
};

export default function KarachiToDubaiGuide() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-[var(--accent)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[var(--accent-foreground)]"
      >
        Skip to main content
      </a>
      <PageContainer>
        <nav aria-label="Breadcrumb" className="mb-6 px-0 py-0 sm:px-0">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--foreground)]">
              Karachi to Dubai
            </li>
          </ol>
        </nav>
        <main id="main-content">
          <Card className="py-0 sm:p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Route guide
            </p>
            <h1 className="mt-0 mb-6 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Karachi to Dubai flights
            </h1>
            <p className="mb-8 max-w-3xl text-base leading-7 text-[var(--muted)]">
              Direct flights from Karachi (KHI) to Dubai (DXB) typically take about 2 hours 15 minutes. Pakistan
              observes PKT (UTC+5) and the UAE observes GST (UTC+4), so Dubai is one hour behind Karachi.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <section aria-labelledby="airlines-heading" className="rounded-xl border border-[var(--border)] bg-slate-900/40 p-5">
                <h2 id="airlines-heading" className="text-lg font-semibold text-[var(--foreground)]">
                  Airlines on this route
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--foreground)]">
                  <li>Pakistan International Airlines (PIA)</li>
                  <li>Emirates (EK)</li>
                  <li>FlyDubai (FZ)</li>
                  <li>Air Arabia (G9)</li>
                  <li>Qatar Airways (QR) via Doha</li>
                </ul>
              </section>

              <section aria-labelledby="fares-heading" className="rounded-xl border border-[var(--border)] bg-slate-900/40 p-5">
                <h2 id="fares-heading" className="text-lg font-semibold text-[var(--foreground)]">
                  Typical fares
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">
                  Economy fares commonly start around PKR 54,200. Business class fares can start around PKR 88,000,
                  depending on airline, demand, and travel date.
                </p>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="font-medium text-[var(--foreground)]">Approximate duration</dt>
                    <dd className="text-[var(--muted)]">2h 15m nonstop</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]">Timezone difference</dt>
                    <dd className="text-[var(--muted)]">Dubai is 1 hour behind Karachi</dd>
                  </div>
                </dl>
              </section>
            </div>

            <section aria-labelledby="live-fares-heading" className="mt-8 rounded-xl border border-teal-900/50 bg-teal-950/30 p-5">
              <h2 id="live-fares-heading" className="text-lg font-semibold text-[var(--foreground)]">
                Search live fares
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                Live fares are fetched per search and are not cached. Open the live search to compare current
                availability and prices.
              </p>
              <div className="mt-4">
                <Link
                  href="/air/search?route=karachi-to-dubai"
                >
                  <Button variant="primary">View live Karachi to Dubai fares</Button>
                </Link>
              </div>
            </section>
          </Card>
        </main>
      </PageContainer>
    </>
  );
}
