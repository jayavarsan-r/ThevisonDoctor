import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Compact page hero. `dark` sits under the transparent header (route must be
 * listed in DARK_HERO_ROUTES); `tint` and `light` start below the white header.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  tone = "light",
  breadcrumb,
  children,
  aside,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light" | "tint";
  breadcrumb?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section
      data-surface={dark ? "dark" : undefined}
      className={cn(
        "relative overflow-hidden",
        dark && "-mt-[var(--header-h)] bg-navy-950 pt-[var(--header-h)]",
        tone === "tint" && "bg-blue-50",
        tone === "light" && "bg-white",
        className,
      )}
    >
      <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className={cn("flex flex-col gap-6", aside ? "lg:col-span-7" : "lg:col-span-9")}>
          {breadcrumb}
          <h1 className={cn("font-display text-h1 font-medium", dark ? "text-white" : "text-ink")}>
            {title}
          </h1>
          {lead ? (
            <p className={cn("measure-lead text-lead", dark ? "text-slate-300" : "text-slate-600")}>
              {lead}
            </p>
          ) : null}
          {children ? (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
          ) : null}
        </div>
        {aside ? <div className="lg:col-span-5">{aside}</div> : null}
      </div>
    </section>
  );
}
