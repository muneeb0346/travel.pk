"use client";

import { useEffect, useRef, useState } from "react";
import { FilterControls } from "@/components/filter-controls";
import { Button } from "@/components/button";
import type { SearchParams } from "@/app/air/search/page";

export function MobileFilterDialog({
  params,
}: {
  params: SearchParams;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleDialogClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) setOpen(false);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Filters & sort</p>
          <p className="text-sm text-[var(--muted)]">Refine results without leaving this page.</p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => setOpen(true)}
        >
          Open filters
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-filters-title"
        onClick={handleDialogClick}
        onClose={() => setOpen(false)}
        className="m-auto w-[calc(100vw-1.5rem)] max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--foreground)] shadow-xl backdrop:bg-slate-900/55 sm:w-full"
      >
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
            <div>
              <h2 id="mobile-filters-title" className="text-lg font-semibold">
                Filters and sorting
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Changes apply immediately and stay in the URL.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
            >
              Close
            </Button>
          </div>
          <div className="space-y-5 overflow-y-auto px-5 py-5">
            <FilterControls params={params} />
          </div>
          <div className="border-t border-[var(--border)] px-5 py-4">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
