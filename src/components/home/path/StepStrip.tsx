import { cn } from "@/lib/cn";

/** One row of three mono-labelled steps joined by thin arrows; replaces the old checklist. */
export function StepStrip({
  steps,
  tone,
  className,
}: {
  steps: readonly string[];
  tone: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <ol
      aria-label="Steps"
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[11px] leading-4 md:gap-x-2 md:gap-y-1 md:text-[12px] md:leading-5",
        dark ? "text-slate-300" : "text-slate-600",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-1.5 md:gap-2">
          <span className="whitespace-nowrap">
            <span
              aria-hidden
              className={cn(
                "mr-1.5 inline-block size-1.5 -translate-y-px rounded-full",
                dark ? "bg-orange-300" : "bg-orange-700",
              )}
            />
            {step}
          </span>
          {i < steps.length - 1 ? (
            <svg
              aria-hidden
              width="14"
              height="8"
              viewBox="0 0 16 8"
              fill="none"
              className={dark ? "text-blue-300/70" : "text-blue-900/50"}
            >
              <path d="M0 4h14M11 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
            </svg>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
