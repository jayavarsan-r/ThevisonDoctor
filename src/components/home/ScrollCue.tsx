"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Small "Scroll" indicator at the hero's bottom edge; hides once the page scrolls. */
export function ScrollCue() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center gap-3 transition-opacity duration-200",
        hidden ? "opacity-0" : "opacity-100",
      )}
    >
      <span className="eyebrow text-blue-300">Scroll</span>
      <span className="h-px w-12 bg-blue-300/60" />
    </div>
  );
}
