import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "draft" | "outline" | "dark" | "accent";

const tones: Record<Tone, string> = {
  default: "bg-blue-50 text-blue-900",
  draft: "border border-dashed border-orange-700 bg-orange-50 text-orange-700",
  outline: "border border-line bg-white text-slate-600",
  dark: "border border-white/20 bg-white/5 text-blue-300",
  accent: "bg-blue-900 text-white",
};

/** Mono 11px uppercase pill (§4.10). */
export function Badge({
  tone = "default",
  children,
  className,
  dot,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] leading-none font-medium tracking-[0.06em] whitespace-nowrap uppercase",
        tones[tone],
        className,
      )}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-orange-500" /> : null}
      {children}
    </span>
  );
}
