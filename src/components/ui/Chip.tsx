"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Filter chip (§4.10): 36px pill; on = blue-900 with white text and aria-pressed. */
export function Chip({
  pressed,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-[14px] font-medium whitespace-nowrap transition-colors duration-150 ease-brand",
        pressed
          ? "border-blue-900 bg-blue-900 text-white"
          : "border-line bg-white text-ink hover:border-blue-200 hover:bg-blue-50",
        className,
      )}
      {...props}
    />
  );
}
