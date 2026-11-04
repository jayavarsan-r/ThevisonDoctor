import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SpecRow = { label: string; value?: ReactNode | null };

/**
 * The core academy pattern (§4.10): mono label left, value right, hairlines between.
 * Rows without a value are hidden unless `placeholder` is given (compare table).
 */
export function SpecList({
  rows,
  size = "md",
  placeholder,
  className,
  tone = "light",
}: {
  rows: SpecRow[];
  size?: "sm" | "md";
  placeholder?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const visible = placeholder
    ? rows
    : rows.filter((r) => r.value !== undefined && r.value !== null && r.value !== "");
  if (!visible.length) return null;

  return (
    <dl
      className={cn(
        "divide-y border-y",
        tone === "dark" ? "divide-white/15 border-white/15" : "divide-line border-line",
        className,
      )}
    >
      {visible.map((row) => {
        const empty = row.value === undefined || row.value === null || row.value === "";
        return (
          <div
            key={row.label}
            className={cn(
              "grid gap-x-4 gap-y-1",
              size === "sm"
                ? "grid-cols-[6.5rem_minmax(0,1fr)] py-2.5"
                : "grid-cols-1 py-3.5 sm:grid-cols-[9.5rem_minmax(0,1fr)]",
            )}
          >
            <dt
              className={cn(
                "pt-[3px] eyebrow",
                size === "sm" && "text-[11px]",
                tone === "dark" ? "text-blue-300" : "text-slate-600",
              )}
            >
              {row.label}
            </dt>
            <dd
              className={cn(
                size === "sm" ? "text-meta" : "text-[15px] leading-relaxed",
                tone === "dark" ? "text-white" : "text-ink",
                empty && "text-slate-500 italic",
              )}
            >
              {empty ? placeholder : row.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
