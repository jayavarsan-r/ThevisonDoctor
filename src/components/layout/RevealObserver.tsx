"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `is-visible` to [data-reveal] elements as they scroll into view, once
 * each. The CSS in globals.css only hides them when JS is running and motion
 * is allowed, so content is never hidden without this script.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      pending().forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    pending().forEach((el) => io.observe(el));
    // Catch elements rendered later (streamed or client-rendered sections).
    const mo = new MutationObserver(() => pending().forEach((el) => io.observe(el)));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
