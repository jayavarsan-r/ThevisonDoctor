"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}

/**
 * Tracks whether an element has been revealed (once, at `amount` visibility),
 * whether it is currently in the viewport, and whether the tab is visible.
 * `ambient` is true only while all of that holds — use it to pause looping
 * motion when nobody can see it.
 */
export function useInViewAnimation(ref: RefObject<HTMLElement | null>, { amount = 0.35 } = {}) {
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      // Very old browsers: treat the section as visible on the next frame.
      const id = requestAnimationFrame(() => {
        setRevealed(true);
        setInView(true);
      });
      return () => cancelAnimationFrame(id);
    }
    const reveal = new IntersectionObserver(
      ([entry]) => {
        // The first callback reports the current state, which may be below the threshold.
        if (entry.isIntersecting && entry.intersectionRatio >= amount - 0.01) {
          setRevealed(true);
          reveal.disconnect();
        }
      },
      { threshold: amount },
    );
    const visibility = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    reveal.observe(el);
    visibility.observe(el);
    return () => {
      reveal.disconnect();
      visibility.disconnect();
    };
  }, [ref, amount]);

  return { revealed, inView, pageVisible, ambient: inView && pageVisible };
}

/** Matches a media query on the client; `fallback` is used during SSR. */
export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}
