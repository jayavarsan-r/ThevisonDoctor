import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const DRAFT_LABEL = "DRAFT — NOT VERIFIED";

/** The inline label on its own. */
export function DraftTag({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border border-dashed px-2.5 font-mono text-[11px] leading-none font-medium tracking-[0.06em] whitespace-nowrap",
        tone === "dark"
          ? "border-orange-300 bg-navy-950 text-orange-300"
          : "border-orange-700 bg-orange-50 text-orange-700",
        className,
      )}
    >
      {DRAFT_LABEL}
    </span>
  );
}

/**
 * Wraps draft or unverified UI in an orange dashed outline with a label.
 * Only ever reached in preview mode — getters strip drafts in production.
 * When `draft` is false it renders children untouched.
 */
export function DraftBadge({
  draft = true,
  children,
  className,
  tone = "light",
  inline = false,
}: {
  draft?: boolean;
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
  inline?: boolean;
}) {
  if (!draft) return <>{children}</>;

  if (inline) {
    return (
      <span
        className={cn(
          "inline-flex flex-wrap items-center gap-2 rounded-[6px] outline-2 outline-offset-4 outline-dashed",
          tone === "dark" ? "outline-orange-300" : "outline-orange-700",
          className,
        )}
      >
        {children}
        <DraftTag tone={tone} />
      </span>
    );
  }

  return (
    <div
      data-draft
      className={cn(
        "relative rounded-card outline-2 outline-offset-4 outline-dashed",
        tone === "dark" ? "outline-orange-300" : "outline-orange-700",
        className,
      )}
    >
      <DraftTag tone={tone} className="absolute -top-3 right-3 z-10" />
      {children}
    </div>
  );
}
