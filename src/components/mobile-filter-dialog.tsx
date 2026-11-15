"use client";

import { useEffect, useRef, useState } from "react";
import { FilterControls } from "@/components/filter-controls";
import { SortSelector } from "@/components/sort-selector";
import type { SearchParams } from "@/app/air/search/page";

export function MobileFilterDialog({
  params,
}: {
  params: SearchParams;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      if (open) dialogRef.current.showModal();
      else dialogRef.current.close();
    }
  }, [open]);

  function handleDialogClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex sm:hidden items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
      >
        Filters
      </button>
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        className="border border-slate-200 bg-white rounded-lg p-5 shadow-xl max-w-md w-full sm:max-w-lg"
      >
        <form method="dialog">
          <button
            type="submit"
            className="absolute top-3 right-3 rounded-md p-1.5 text-slate-400 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
            aria-label="Close filters"
          >
            ✕
          </button>
        </form>
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        <FilterControls params={params} />
        <SortSelector params={params} />
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Done
          </button>
        </div>
      </dialog>
    </>
  );
}
