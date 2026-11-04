import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** White card, 1px line border, 14px radius, no shadow at rest (§4.6). */
export function Card({
  interactive,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-white p-6 sm:p-7",
        interactive && "card-interactive",
        className,
      )}
      {...props}
    />
  );
}
