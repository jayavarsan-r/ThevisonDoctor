import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Mono eyebrow with the orange focal dot, e.g. "● THE ACADEMY". */
export function Eyebrow({
  children,
  tone = "light",
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-2.5 eyebrow",
        tone === "dark" ? "text-blue-300" : "text-blue-900",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-orange-500" />
      <span>{children}</span>
    </Tag>
  );
}
