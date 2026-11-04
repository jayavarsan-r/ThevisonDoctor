"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

/** Pause / play for a `.marquee-viewport` (by id). Hidden when motion is reduced. */
export function MarqueeToggle({ target, className }: { target: string; className?: string }) {
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    document.getElementById(target)?.toggleAttribute("data-paused", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-controls={target}
      aria-label={paused ? "Play logo animation" : "Pause logo animation"}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-blue-900 transition-colors hover:border-blue-200 hover:bg-blue-50 motion-reduce:hidden",
        className,
      )}
    >
      {paused ? (
        <Play aria-hidden strokeWidth={1.75} className="size-3.5 translate-x-px" />
      ) : (
        <Pause aria-hidden strokeWidth={1.75} className="size-3.5" />
      )}
    </button>
  );
}
