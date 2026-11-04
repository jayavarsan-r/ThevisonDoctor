"use client";

import { House, MessageSquareText, PhoneCall, type LucideIcon } from "lucide-react";
import { animate, m, useMotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

type Pt = [number, number];
/** Cubic Bézier in percent space: [P0, P1, P2, P3]. */
type Curve = [Pt, Pt, Pt, Pt];

const NODES: { label: string; icon: LucideIcon }[] = [
  { label: "Enquire", icon: MessageSquareText },
  { label: "We call to confirm", icon: PhoneCall },
  { label: "Your visit", icon: House },
];
const NODE_T = [0, 0.5, 1];

/** Lower-left to the focal target in the upper right (desktop). */
const DIAGONAL: Curve = [
  [13, 58],
  [29, 58],
  [45, 28],
  [71, 28],
];
/** Left to right across the mobile band. */
const HORIZONTAL: Curve = [
  [12, 58],
  [36, 20],
  [64, 80],
  [88, 46],
];

/** Short chip labels for published services; other services get no chip. */
const SERVICE_CHIPS: Record<string, string> = {
  "home-eye-consultation": "Home visits",
  "eye-screening": "Screening",
  "myopia-management": "Myopia",
  "vision-therapy": "Vision therapy",
  "specialty-contact-lenses": "Contact lenses",
};

const RINGS = [1, 2, 3, 4, 5, 6.6];
const OUTER = RINGS[RINGS.length - 1];

function bezier([p0, p1, p2, p3]: Curve, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

function useSize<T extends HTMLElement>(fallback: { w: number; h: number }) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: Math.max(1, e.contentRect.width), h: Math.max(1, e.contentRect.height) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

function CareRings({ center, step }: { center: Pt; step: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        ["--cx" as string]: `${center[0]}%`,
        ["--cy" as string]: `${center[1]}%`,
        ["--s" as string]: step,
      }}
    >
      <svg
        viewBox={`${-OUTER} ${-OUTER} ${OUTER * 2} ${OUTER * 2}`}
        fill="none"
        className="absolute"
        style={{
          left: `calc(var(--cx) - ${OUTER} * var(--s))`,
          top: `calc(var(--cy) - ${OUTER} * var(--s))`,
          width: `calc(${OUTER * 2} * var(--s))`,
          height: `calc(${OUTER * 2} * var(--s))`,
        }}
      >
        {RINGS.map((r, i) => (
          <circle
            key={r}
            r={r}
            stroke={i === 0 ? "#F97316" : "#BFDBFE"}
            strokeOpacity={i === 0 ? 0.9 : 0.6}
            strokeDasharray={i === 1 ? "4 6" : undefined}
            vectorEffect="non-scaling-stroke"
            className={i === 1 ? "path-ambient path-spin" : undefined}
          />
        ))}
      </svg>
      {/* Breathing focal dot, sitting on the orange focal ring. */}
      <span
        className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: "calc(var(--cx) + 0.707 * var(--s))",
          top: "calc(var(--cy) - 0.707 * var(--s))",
        }}
      >
        <span className="path-ambient path-breathe block size-full rounded-full bg-orange-500 shadow-[0_0_12px_rgb(249_115_22/0.55)]" />
      </span>
    </div>
  );
}

/**
 * The appointment path: three nodes on a curve, a line that draws itself in,
 * and a small orange dot that travels node to node while the section is visible.
 */
function AppointmentPath({
  curve,
  fallbackSize,
  draw,
  running,
  reduce,
  compact,
}: {
  curve: Curve;
  fallbackSize: { w: number; h: number };
  /** Increment to replay the line drawing. */
  draw: number;
  running: boolean;
  reduce: boolean;
  compact: boolean;
}) {
  const [ref, size] = useSize<HTMLDivElement>(fallbackSize);
  const progress = useMotionValue(0);
  const dotRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sizeRef = useRef(size);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // Position the travelling dot and pulse each node as the dot passes.
  useEffect(() => {
    const update = (p: number) => {
      const [x, y] = bezier(curve, p);
      const { w, h } = sizeRef.current;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${(x / 100) * w - 3}px, ${(y / 100) * h - 3}px)`;
      }
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const near = Math.max(0, 1 - Math.abs(p - NODE_T[i]) / 0.08);
        el.style.transform = `scale(${1 + 0.06 * near})`;
      });
    };
    update(progress.get());
    return progress.on("change", update);
  }, [curve, progress]);

  useEffect(() => {
    if (!running || reduce) return;
    const controls = animate(progress, [0, 1], {
      duration: 3.7,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.8,
    });
    return () => controls.stop();
  }, [running, reduce, progress]);

  const d = (() => {
    const px = curve.map(([x, y]) => [(x / 100) * size.w, (y / 100) * size.h]);
    return `M${px[0][0]} ${px[0][1]} C${px[1][0]} ${px[1][1]} ${px[2][0]} ${px[2][1]} ${px[3][0]} ${px[3][1]}`;
  })();

  return (
    <div ref={ref} className="absolute inset-0">
      <svg
        aria-hidden
        className="absolute inset-0 size-full overflow-visible"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <m.path
          key={draw}
          d={d}
          stroke="#2563EB"
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={draw > 0 && !reduce ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </svg>

      {NODES.map((node, i) => {
        const [x, y] = bezier(curve, NODE_T[i]);
        const Icon = node.icon;
        // Label placement keeps text clear of the line.
        const labelPos = compact
          ? "top-full left-1/2 mt-1.5 -translate-x-1/2 text-center"
          : i === 0
            ? "top-1/2 left-full ml-3 -translate-y-1/2"
            : i === 1
              ? "top-1/2 right-full mr-3 -translate-y-1/2 text-right"
              : "top-full left-1/2 mt-8 -translate-x-1/2 text-center";
        return (
          <div
            key={node.label}
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className={cn(
                "flex items-center justify-center rounded-full border border-blue-200 bg-white text-blue-900 shadow-[0_6px_16px_-10px_rgb(30_58_138/0.5)]",
                compact ? "size-9" : "size-10",
              )}
            >
              <Icon strokeWidth={1.5} className={compact ? "size-4" : "size-[18px]"} />
            </span>
            <span
              className={cn(
                "absolute font-medium whitespace-nowrap text-ink",
                compact ? "text-[12px]" : "text-[14px]",
                labelPos,
              )}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {reduce ? null : (
        <span
          ref={dotRef}
          aria-hidden
          className={cn(
            "absolute top-0 left-0 size-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgb(249_115_22/0.8)] transition-opacity duration-300",
            running ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}

export function CarePath({
  services,
  draw,
  running,
  reduce,
  desktop,
}: {
  services: { slug: string; title: string }[];
  draw: number;
  running: boolean;
  reduce: boolean;
  desktop: boolean;
}) {
  const chips = services
    .filter((s) => SERVICE_CHIPS[s.slug])
    .map((s) => ({ ...s, label: SERVICE_CHIPS[s.slug] }));

  return (
    <>
      <div className="[container-type:size] relative hidden h-full overflow-hidden lg:block">
        <CareRings center={DIAGONAL[3]} step="min(10cqh, 9cqw)" />
        <AppointmentPath
          curve={DIAGONAL}
          fallbackSize={{ w: 600, h: 460 }}
          draw={draw}
          running={running && desktop}
          reduce={reduce}
          compact={false}
        />
        <ul className="absolute inset-x-8 bottom-8 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/eye-care/${c.slug}`}
                aria-label={`${c.label} — ${c.title}`}
                className="inline-flex h-9 items-center rounded-full border border-blue-200 bg-white px-3.5 text-[14px] font-medium text-blue-900 transition-[border-color,translate] duration-200 ease-brand hover:-translate-y-0.5 hover:border-blue-600 pointer-coarse:h-11"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative h-full overflow-hidden lg:hidden">
        <CareRings center={HORIZONTAL[3]} step="22px" />
        <AppointmentPath
          curve={HORIZONTAL}
          fallbackSize={{ w: 358, h: 168 }}
          draw={draw}
          running={running && !desktop}
          reduce={reduce}
          compact
        />
      </div>
    </>
  );
}
