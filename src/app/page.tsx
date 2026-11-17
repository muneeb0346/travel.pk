import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-4">travel.pk</h1>
      <p className="text-slate-600 mb-8">
        Flight search and route guides for Pakistan. Find live fares or read a route guide.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/air/search?route=karachi-to-dubai&date=2026-12-01&pax=2"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-700"
        >
          Search flights
        </Link>
        <Link
          href="/flights/karachi-to-dubai"
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Route guide: Karachi → Dubai
        </Link>
      </div>
    </main>
  );
}