"use client";

import { cn } from "@/lib/cn";

/** Sticky bottom bar that appears once a program is ticked for comparison (§6.3). */
export function CompareBar({
  count,
  max,
  onCompare,
  onClear,
}: {
  count: number;
  max: number;
  onCompare: () => void;
  onClear: () => void;
}) {
  if (!count) return null;
  const ready = count >= 2;
  return (
    <div
      className={cn(
        "fixed inset-x-3 z-40 mx-auto flex max-w-[640px] items-center justify-between gap-4 rounded-card border border-line bg-white px-4 py-3 shadow-float sm:px-5",
        "bottom-[calc(var(--action-bar-h)+env(safe-area-inset-bottom)+12px)] md:bottom-6",
      )}
    >
      <p className="text-meta text-ink">
        <span className="font-semibold">{count} selected</span>
        <span className="text-slate-600">
          {ready ? ` · up to ${max}` : " · select one more to compare"}
        </span>
      </p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onClear} className="text-meta font-medium link">
          Clear
        </button>
        <button
          type="button"
          onClick={onCompare}
          disabled={!ready}
          className="inline-flex h-10 items-center rounded-btn bg-blue-600 px-4 text-[14px] font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
