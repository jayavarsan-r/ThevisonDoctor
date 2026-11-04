import type { Transition, Variants } from "motion/react";

/**
 * Shared motion language. Durations follow BUILD_PROMPT §4.9; the path
 * selector's "focus pull" values come from the path-selector redesign brief.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const SPRING_INDICATOR: Transition = { type: "spring", stiffness: 400, damping: 34 };

export type MotionMode = {
  /** prefers-reduced-motion: opacity only, 150ms. */
  reduce: boolean;
  /** Small screens: no blur filter (opacity and scale only). */
  mobile: boolean;
  /** Apply the change instantly (state restored from URL / session, not a user action). */
  instant: boolean;
};

/**
 * Focus pull for the path visuals. Outgoing: fade, shrink to 0.96, blur to 10px
 * (300ms). Incoming: from 1.04 and 10px blur into focus (450ms, 120ms later).
 */
export function focusPullVariants({ reduce, mobile, instant }: MotionMode): Variants {
  if (instant) {
    return {
      active: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0 } },
      inactive: { opacity: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0 } },
    };
  }
  if (reduce) {
    return {
      active: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.15 } },
      inactive: { opacity: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.15 } },
    };
  }
  const blurIn = mobile ? ["blur(0px)", "blur(0px)"] : ["blur(10px)", "blur(0px)"];
  return {
    active: {
      opacity: [0, 1],
      scale: [1.04, 1],
      filter: blurIn,
      transition: { duration: 0.45, delay: 0.12, ease: EASE },
    },
    inactive: {
      opacity: 0,
      scale: 0.96,
      filter: mobile ? "blur(0px)" : "blur(10px)",
      transition: { duration: 0.3, ease: EASE },
    },
  };
}

/** Text column: the outgoing group fades up; incoming children stagger in by 50ms. */
export function textGroupVariants({ reduce, instant }: MotionMode): Variants {
  if (instant || reduce) {
    const d = instant ? 0 : 0.15;
    return {
      active: { opacity: 1, transition: { duration: d } },
      inactive: { opacity: 0, transition: { duration: d } },
    };
  }
  return {
    active: { opacity: 1, transition: { duration: 0, staggerChildren: 0.05, delayChildren: 0.1 } },
    inactive: { opacity: 0, transition: { duration: 0.18, ease: EASE } },
  };
}

export function textItemVariants({ reduce, instant }: MotionMode): Variants {
  if (instant || reduce) {
    return { active: { opacity: 1, y: 0 }, inactive: { opacity: 1, y: 0 } };
  }
  return {
    active: { opacity: [0, 1], y: [12, 0], transition: { duration: 0.38, ease: EASE } },
    inactive: { opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE } },
  };
}
