export function ResultsSkeleton() {
  return (
    <section className="space-y-3">
      <p role="status" aria-live="polite" className="sr-only">
        Loading flights…
      </p>
      <ul aria-label="Flight results" className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} className="h-20 border-b border-slate-200 py-4 last:border-b-0">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-32 bg-slate-200 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 bg-slate-200 rounded-md" />
                <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
