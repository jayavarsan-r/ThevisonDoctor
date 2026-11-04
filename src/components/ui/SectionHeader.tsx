import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

/**
 * Eyebrow + Newsreader H2 + optional lead.
 * `layout="split"` puts the title on a 5/12 column and the lead on 7/12 (editorial split).
 */
export function SectionHeader({
  label,
  title,
  lead,
  id,
  tone = "light",
  layout = "stack",
  action,
  className,
}: {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  layout?: "stack" | "split";
  action?: ReactNode;
  className?: string;
}) {
  const dark = tone === "dark";
  const heading = (
    <h2
      id={id}
      className={cn("font-display text-h2 font-medium", dark ? "text-white" : "text-ink")}
    >
      {title}
    </h2>
  );
  const leadEl = lead ? (
    <p className={cn("measure-lead text-lead", dark ? "text-slate-300" : "text-slate-600")}>
      {lead}
    </p>
  ) : null;

  if (layout === "split") {
    return (
      <header className={cn("grid gap-6 lg:grid-cols-12 lg:gap-8", className)}>
        <div className="flex flex-col gap-5 lg:col-span-6">
          <Eyebrow tone={tone}>{label}</Eyebrow>
          {heading}
        </div>
        <div className="flex flex-col justify-end gap-6 lg:col-span-5 lg:col-start-8">
          {leadEl}
          {action}
        </div>
      </header>
    );
  }

  return (
    <header className={cn("flex flex-col gap-5", className)}>
      <Eyebrow tone={tone}>{label}</Eyebrow>
      {heading}
      {leadEl}
      {action}
    </header>
  );
}
