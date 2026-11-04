import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Container({
  wide,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { wide?: boolean }) {
  return (
    <div
      className={cn(
        wide ? "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8" : "container-page",
        className,
      )}
      {...props}
    />
  );
}
