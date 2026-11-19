export function ResultsSkeleton() {
  return (
    <section className="mt-6 space-y-4" aria-busy="true">
      <p role="status" aria-live="polite" className="sr-only">
        Loading flights…
      </p>
      <div className="h-5 w-48 animate-pulse rounded bg-[var(--border)]" />
      <ul aria-label="Flight results" className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className="min-h-[12rem] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:min-h-[10rem] sm:p-5"
          >
            <div className="flex h-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3 sm:min-w-0 sm:flex-1">
                <div className="flex flex-wrap gap-2">
                  <div className="h-5 w-36 animate-pulse rounded bg-[var(--border)]" />
                  <div className="h-5 w-20 animate-pulse rounded bg-[var(--border)]" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--border)]" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full max-w-md animate-pulse rounded bg-[var(--border)]" />
                  <div className="h-4 w-5/6 max-w-sm animate-pulse rounded bg-[var(--border)]" />
                </div>
                <div className="h-4 w-28 animate-pulse rounded bg-[var(--border)]" />
              </div>
              <div className="space-y-2 border-t border-[var(--border)] pt-3 sm:border-t-0 sm:pt-0 sm:text-right">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--border)] sm:ml-auto" />
                <div className="h-8 w-32 animate-pulse rounded bg-[var(--border)] sm:ml-auto" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
