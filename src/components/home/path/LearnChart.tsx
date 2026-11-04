"use client";

import Link from "next/link";
import { useEffect, useId, useState, type CSSProperties } from "react";
import type { ChartRow } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Learn visual — the five program types set like a vision chart, largest line
 * first. An orange focus line steps down the chart while the section is on
 * screen; hovering or focusing a line brings it into focus. Each line shows
 * whether that kind of program is open now or coming soon (from content).
 */

const DESKTOP_SIZE = ["text-[28px]", "text-[22px]", "text-[19px]", "text-[16px]", "text-[14px]"];
const MOBILE_SIZE = ["text-[17px]", "text-[14.5px]", "text-[13px]", "text-[12px]", "text-[11px]"];
const ACUITY = ["6/60", "6/36", "6/24", "6/18", "6/12"];
const ROW_H = 50; // px, desktop
const ROW_H_MOBILE = 25; // px

const STATUS: Record<ChartRow["status"], { text: string; label: string; cls: string }> = {
  open: { text: "Open", label: "admissions open — view program", cls: "text-orange-300" },
  listed: { text: "View", label: "view programs", cls: "text-blue-300" },
  soon: { text: "Soon", label: "coming soon — get notified", cls: "text-slate-300" },
};

function DotGrid({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)}>
      <defs>
        <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Steps the focus line through the rows while `running`. */
function useFocusStep(count: number, running: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setStep((s) => (s + 1) % count), 2400);
    return () => clearInterval(id);
  }, [count, running]);
  return step;
}

function FocusLine({
  index,
  rowHeight,
  compact,
}: {
  index: number;
  rowHeight: number;
  compact?: boolean;
}) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 transition-transform duration-700 ease-brand motion-reduce:transition-none"
      style={{ height: rowHeight, transform: `translateY(${index * rowHeight}px)` }}
    >
      <span
        className={cn(
          "absolute inset-x-0 inset-y-1 rounded-[10px] bg-white/[0.05] ring-1 ring-orange-500/45",
          compact && "inset-y-0.5 rounded-[7px]",
        )}
      />
      <span className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rounded-full bg-orange-500 shadow-[0_0_12px_rgb(249_115_22/0.7)]" />
      <span className="absolute top-1/2 -right-1 size-2 -translate-y-1/2 rounded-full bg-orange-500 shadow-[0_0_12px_rgb(249_115_22/0.7)]" />
    </span>
  );
}

function rowTone(focused: boolean) {
  return focused
    ? "text-white [filter:blur(0px)]"
    : "text-white/60 [filter:blur(0.6px)] motion-reduce:[filter:none]";
}

/** Desktop: an interactive chart card; every line is a link. */
function ChartDesktop({
  rows,
  play,
  running,
}: {
  rows: ChartRow[];
  play: boolean;
  running: boolean;
}) {
  const auto = useFocusStep(rows.length, running);
  const [hover, setHover] = useState<number | null>(null);
  const focus = hover ?? auto;

  return (
    <div className="absolute inset-0 grid place-items-center p-6 xl:p-8">
      <DotGrid className="text-white/[0.07]" />
      <div className="relative w-full max-w-[440px] rounded-[18px] border border-white/12 bg-navy-950/80 px-6 pt-5 pb-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_30px_60px_-30px_rgb(0_0_0/0.6)] backdrop-blur-sm">
        <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.12em] text-blue-300 uppercase">
          <span>The Vision Doctor Academy</span>
          <span>Program chart</span>
        </div>
        <ol className="relative mt-4" onMouseLeave={() => setHover(null)}>
          <FocusLine index={focus} rowHeight={ROW_H} />
          {rows.map((row, i) => {
            const status = STATUS[row.status];
            return (
              <li
                key={row.type}
                data-enter
                style={{ height: ROW_H, "--i": i } as CSSProperties}
                className={cn("relative", play && "path-chart-enter")}
              >
                <Link
                  href={row.href}
                  aria-label={`${row.label}: ${status.label}`}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="grid h-full grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] items-center rounded-[10px] px-2"
                >
                  <span aria-hidden />
                  <span
                    className={cn(
                      "min-w-0 text-center leading-none font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-[color,filter] duration-500 ease-brand",
                      DESKTOP_SIZE[i],
                      rowTone(i === focus),
                    )}
                  >
                    {row.label}
                  </span>
                  <span className="flex flex-col items-end gap-1 font-mono text-[10px] leading-none tracking-[0.08em] uppercase">
                    <span className={cn("flex items-center gap-1", status.cls)}>
                      {row.status === "open" ? (
                        <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
                      ) : null}
                      {status.text}
                    </span>
                    <span aria-hidden className="text-blue-300">
                      {ACUITY[i]}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-3 font-mono text-[10.5px] tracking-[0.08em] text-slate-300 uppercase">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
            Open now
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-full border border-slate-300" />
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
}

/** Mobile band: the same chart, compact and decorative (the CTA below links on). */
function ChartBand({ rows, running }: { rows: ChartRow[]; running: boolean }) {
  const focus = useFocusStep(rows.length, running);
  return (
    <div aria-hidden className="relative h-full overflow-hidden">
      <DotGrid className="text-white/[0.07]" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <ol className="relative w-full max-w-[320px]">
          <FocusLine index={focus} rowHeight={ROW_H_MOBILE} compact />
          {rows.map((row, i) => (
            <li
              key={row.type}
              style={{ height: ROW_H_MOBILE }}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center px-2"
            >
              <span aria-hidden />
              <span
                className={cn(
                  "min-w-0 text-center leading-none font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-[color,filter] duration-500 ease-brand",
                  MOBILE_SIZE[i],
                  rowTone(i === focus),
                )}
              >
                {row.label}
              </span>
              <span
                className={cn(
                  "text-right font-mono text-[9.5px] tracking-[0.08em] uppercase",
                  STATUS[row.status].cls,
                )}
              >
                {STATUS[row.status].text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Both layouts are rendered; CSS shows one, so the server HTML is complete at any width. */
export function LearnChart({
  rows,
  play,
  running,
  desktop,
}: {
  rows: ChartRow[];
  play: boolean;
  running: boolean;
  desktop: boolean;
}) {
  return (
    <>
      <div className="relative hidden h-full lg:block">
        <ChartDesktop rows={rows} play={play} running={running && desktop} />
      </div>
      <div className="h-full lg:hidden">
        <ChartBand rows={rows} running={running && !desktop} />
      </div>
    </>
  );
}
