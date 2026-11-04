"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Decorative background video (§6.1). Never blocks render:
 * - preload="none"; sources attach only after requestIdleCallback
 * - skipped for prefers-reduced-motion, Save-Data and viewports < 640px
 *   (the poster is shown instead)
 * - a visible Pause / Play control whenever it plays
 */
export function HeroVideo({ webm, mp4, poster }: { webm?: string; mp4?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (reduce || saveData || window.innerWidth < 640) return;

    const start = () => setEnabled(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 1500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!enabled || !v) return;
    v.load();
    v.play().catch(() => {
      // Autoplay refused — the poster stays.
    });
  }, [enabled]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <>
      <video
        ref={ref}
        aria-hidden="true"
        tabIndex={-1}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 -z-20 size-full object-cover"
      >
        {enabled && webm ? <source src={webm} type="video/webm" /> : null}
        {enabled && mp4 ? <source src={mp4} type="video/mp4" /> : null}
      </video>
      {enabled ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="absolute right-4 bottom-[4.5rem] z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-navy-950/60 text-white backdrop-blur hover:bg-white/10 sm:right-6 lg:right-8"
        >
          {playing ? (
            <Pause aria-hidden strokeWidth={1.5} className="size-4" />
          ) : (
            <Play aria-hidden strokeWidth={1.5} className="size-4" />
          )}
        </button>
      ) : null}
    </>
  );
}
