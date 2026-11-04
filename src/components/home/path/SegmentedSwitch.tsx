"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Eye, GraduationCap } from "lucide-react";
import { m } from "motion/react";
import { cn } from "@/lib/cn";
import { SPRING_INDICATOR } from "@/lib/motion";

export type PathKey = "learn" | "care";
export type InputMethod = "click" | "key" | "swipe";

const OPTIONS = [
  { value: "learn", long: "I'm here to learn", short: "Learn", icon: GraduationCap },
  { value: "care", long: "I'm here for eye care", short: "Eye care", icon: Eye },
] as const;

/**
 * Pill segmented switch — the Radix tablist. A sliding indicator springs under
 * the active option: navy for Learn, royal blue for Care.
 */
export function SegmentedSwitch({
  value,
  instant,
  reduce,
  nudge,
  onInput,
}: {
  value: PathKey;
  instant: boolean;
  reduce: boolean;
  /** One-off idle hint on the inactive option. */
  nudge: boolean;
  onInput: (method: InputMethod) => void;
}) {
  const care = value === "care";
  return (
    <Tabs.List
      aria-label="Choose your path"
      onKeyDown={() => onInput("key")}
      onPointerDown={() => onInput("click")}
      className="relative grid h-12 w-full shrink-0 grid-cols-2 rounded-full border border-blue-200 bg-blue-50 p-1 md:h-14 lg:inline-grid lg:w-auto"
    >
      <m.span
        aria-hidden
        data-path-indicator
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-[0_6px_18px_-8px_rgb(30_58_138/0.55)]"
        initial={false}
        animate={{ x: care ? "100%" : "0%", backgroundColor: care ? "#2563EB" : "#1E3A8A" }}
        transition={
          instant || reduce
            ? { duration: 0 }
            : { x: SPRING_INDICATOR, backgroundColor: { duration: 0.3 } }
        }
      />
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const inactive = o.value !== value;
        return (
          <Tabs.Trigger
            key={o.value}
            value={o.value}
            data-path-tab={o.value}
            className={cn(
              "group relative z-[1] inline-flex items-center justify-center gap-2 rounded-full px-3 text-[15px] font-semibold whitespace-nowrap text-blue-900 transition-colors duration-200 hover:text-ink data-[state=active]:text-white md:px-6",
              inactive && nudge && "path-nudge",
            )}
          >
            <Icon
              aria-hidden
              strokeWidth={1.75}
              className="size-[18px] transition-transform duration-150 ease-brand group-hover:group-data-[state=inactive]:translate-x-0.5"
            />
            <span className="md:hidden">{o.short}</span>
            <span className="hidden md:inline">{o.long}</span>
          </Tabs.Trigger>
        );
      })}
    </Tabs.List>
  );
}
