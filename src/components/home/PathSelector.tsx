"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight } from "lucide-react";
import { animate, domAnimation, LazyMotion, m, useMotionValue } from "motion/react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
} from "react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useInViewAnimation, useMediaQuery } from "@/hooks/useInViewAnimation";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { ChartRow } from "@/lib/content";
import {
  focusPullVariants,
  SPRING_INDICATOR,
  textGroupVariants,
  textItemVariants,
  type MotionMode,
} from "@/lib/motion";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CarePath } from "./path/CarePath";
import { LearnChart } from "./path/LearnChart";
import { SegmentedSwitch, type InputMethod, type PathKey } from "./path/SegmentedSwitch";
import { StepStrip } from "./path/StepStrip";

const STORAGE_KEY = "tvd_path";
const isPath = (v: unknown): v is PathKey => v === "learn" || v === "care";

/** ?path= wins, then the remembered session choice. */
function readInitialPath(): PathKey | null {
  const q = new URLSearchParams(window.location.search).get("path");
  if (isPath(q)) return q;
  try {
    const s = window.sessionStorage.getItem(STORAGE_KEY);
    return isPath(s) ? s : null;
  } catch {
    return null;
  }
}
const noopSubscribe = () => () => {};

/**
 * Runs while the HTML is parsed, before first paint: restores a Care choice
 * from ?path= or sessionStorage so the section never flashes the Learn state.
 * React takes over after hydration and removes data-boot.
 */
const BOOT_SCRIPT = `(function(){try{var s=document.currentScript.parentElement;var q=new URLSearchParams(location.search).get('path');var p=(q==='learn'||q==='care')?q:null;if(!p){try{var v=sessionStorage.getItem('${STORAGE_KEY}');if(v==='learn'||v==='care')p=v}catch(e){}}if(p==='care'){s.setAttribute('data-active','care');s.setAttribute('data-boot','care')}}catch(e){}})();`;

const COPY = {
  learn: {
    label: "For learners · The Academy",
    title: (
      <>
        Build speciality skills, <em className="text-orange-300">case by case.</em>
      </>
    ),
    text: "Fellowships, certifications, clinical training, workshops and CME — with eligibility, format and fees shown up front.",
    steps: ["Explore", "Check eligibility", "Enquire"],
    cta: { label: "Explore programs", href: "/academy", variant: "light" as ButtonVariant },
    wa: {
      label: "Ask on WhatsApp",
      href: buildWhatsAppLink("academy"),
      context: "academy",
      variant: "ghost-dark" as ButtonVariant,
    },
  },
  care: {
    label: "For patients · Eye care",
    title: (
      <>
        Specialist eye care, <em className="text-blue-600">by appointment.</em>
      </>
    ),
    text: "Home consultations, screening and speciality care. We confirm the place, time and fee before your visit.",
    steps: ["Choose a service", "We call you", "Your visit"],
    cta: {
      label: "Book an eye appointment",
      href: "/eye-care#book",
      variant: "primary" as ButtonVariant,
    },
    wa: {
      label: "WhatsApp us",
      href: buildWhatsAppLink("care"),
      context: "care",
      variant: "secondary" as ButtonVariant,
    },
  },
} as const;

function Cta({
  href,
  variant,
  children,
  className,
}: {
  href: string;
  variant: ButtonVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={buttonClasses({
        variant,
        className: cn("h-[52px] active:scale-[0.98] md:h-12", className),
      })}
    >
      <span>{children}</span>
      <ArrowRight
        aria-hidden
        strokeWidth={1.5}
        className="size-[18px] transition-transform duration-150 ease-brand group-hover:translate-x-[3px]"
      />
    </Link>
  );
}

function WhatsAppCta({ path }: { path: PathKey }) {
  const wa = COPY[path].wa;
  return (
    <>
      <a
        href={wa.href}
        target="_blank"
        rel="noopener noreferrer"
        data-wa-context={wa.context}
        className={buttonClasses({
          variant: wa.variant,
          className: "hidden active:scale-[0.98] md:inline-flex",
        })}
      >
        <WhatsAppIcon />
        <span>{wa.label}</span>
        <span className="sr-only"> (opens WhatsApp)</span>
      </a>
      <a
        href={wa.href}
        target="_blank"
        rel="noopener noreferrer"
        data-wa-context={wa.context}
        aria-label="Chat on WhatsApp (opens WhatsApp)"
        className={cn(
          "inline-flex size-[52px] shrink-0 items-center justify-center rounded-btn transition-[background-color,scale] duration-150 active:scale-[0.98] md:hidden",
          path === "learn"
            ? "border border-white/35 text-white hover:bg-white/10"
            : "bg-blue-200 text-blue-900",
        )}
      >
        <WhatsAppIcon size={22} />
      </a>
    </>
  );
}

/** "What brings you to The Vision Doctor?" — the Focus-pull path selector. */
export function PathSelector({
  services,
  chart,
}: {
  services: { slug: string; title: string }[];
  /** Program types with live status, for the Learn chart. */
  chart: ChartRow[];
}) {
  const stored = useSyncExternalStore(noopSubscribe, readInitialPath, () => null);
  const [choice, setChoice] = useState<PathKey | null>(null);
  const value: PathKey = choice ?? stored ?? "learn";

  // Hydration-safe: matches the server (false) on the first render, then updates.
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const desktop = useMediaQuery("(min-width: 1024px)", true);
  const mobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLElement>(null);
  const { revealed, ambient } = useInViewAnimation(sectionRef, { amount: 0.35 });

  const [userActed, setUserActed] = useState(false);
  const [careSwitches, setCareSwitches] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [nudge, setNudge] = useState(false);
  const methodRef = useRef<InputMethod>("click");
  const interacted = useRef(false);

  const mode: MotionMode = { reduce, mobile, instant: !userActed };
  const entrance = revealed && !reduce;
  // The Care line draws in when Care is first revealed, and each time it is chosen.
  const careDraw = (entrance && value === "care" ? 1 : 0) + careSwitches;

  // Hand over from the pre-hydration boot state once React shows the same path.
  useEffect(() => {
    const s = sectionRef.current;
    if (s?.dataset.boot && s.dataset.boot === value) delete s.dataset.boot;
  }, [value]);

  // Idle hint: one gentle nudge on the inactive option, 4s after the reveal.
  useEffect(() => {
    if (!revealed || reduce) return;
    const show = setTimeout(() => {
      if (!interacted.current) setNudge(true);
    }, 4000);
    const hide = setTimeout(() => setNudge(false), 5200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [revealed, reduce]);

  const select = (next: PathKey, method: InputMethod) => {
    if (next === value) return;
    interacted.current = true;
    setNudge(false);
    setUserActed(true);
    setChoice(next);
    if (next === "care" && !reduce) setCareSwitches((n) => n + 1);
    setAnnounce(next === "learn" ? "Showing: Academy path" : "Showing: Eye care path");
    try {
      window.sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      // sessionStorage unavailable — the choice still applies for this view.
    }
    track("path_select", { path: next, method });
  };

  // ----- Swipe between paths below lg (pointer events; vertical scroll stays native) -----
  const dragX = useMotionValue(0);
  const swipe = useRef<{ x: number; y: number; t: number; active: boolean } | null>(null);
  const suppressClick = useRef(false);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (desktop || e.button !== 0) return;
    if ((e.target as Element).closest("[data-no-swipe]")) return;
    swipe.current = { x: e.clientX, y: e.clientY, t: performance.now(), active: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.active) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        s.active = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      } else if (Math.abs(dy) > 8) {
        swipe.current = null;
        return;
      }
    }
    if (s.active && !reduce) dragX.set(dx * 0.18);
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s?.active) return;
    suppressClick.current = true;
    const dx = e.clientX - s.x;
    const velocity = (dx / Math.max(1, performance.now() - s.t)) * 1000;
    animate(dragX, 0, reduce ? { duration: 0 } : SPRING_INDICATOR);
    if (Math.abs(dx) > 60 || (Math.abs(velocity) > 400 && Math.abs(dx) > 20)) {
      select(dx < 0 ? "care" : "learn", "swipe");
    }
  };

  const textGroup = textGroupVariants(mode);
  const textItem = textItemVariants(mode);
  const visual = focusPullVariants(mode);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        id="path"
        ref={sectionRef}
        data-path-root
        data-active={value}
        data-revealed={revealed ? "" : undefined}
        data-ambient={ambient && !reduce ? "on" : "off"}
        suppressHydrationWarning
        aria-labelledby="path-title"
        onPointerDownCapture={() => (interacted.current = true)}
        onKeyDownCapture={() => (interacted.current = true)}
        className="relative overflow-hidden bg-white py-14 md:py-20 lg:py-24"
      >
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <div className="container-page">
          <Tabs.Root
            value={value}
            onValueChange={(v) => isPath(v) && select(v, methodRef.current)}
            activationMode="automatic"
          >
            <div className="flex flex-col gap-3.5 md:gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div className="flex flex-col gap-3 md:gap-5">
                <Eyebrow>Choose your path</Eyebrow>
                <h2
                  id="path-title"
                  className="font-display text-[clamp(1.75rem,7vw,2.25rem)] leading-[1.08] font-medium tracking-[-0.01em] text-ink md:text-h2"
                >
                  What brings you to The Vision Doctor?
                </h2>
              </div>
              <SegmentedSwitch
                value={value}
                instant={!userActed}
                reduce={reduce}
                nudge={nudge}
                onInput={(method) => (methodRef.current = method)}
              />
            </div>

            <div
              data-path-panel
              className="path-panel mt-3 touch-pan-y overflow-hidden rounded-[20px] md:mt-8 lg:rounded-[24px]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={() => (swipe.current = null)}
              onClickCapture={(e) => {
                if (suppressClick.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  suppressClick.current = false;
                }
              }}
            >
              <m.div className="grid" style={{ x: dragX }}>
                {(["learn", "care"] as const).map((key) => {
                  const active = key === value;
                  const copy = COPY[key];
                  const dark = key === "learn";
                  return (
                    <Tabs.Content
                      key={key}
                      value={key}
                      forceMount
                      inert={!active}
                      data-path-content={key}
                      data-surface={dark ? "dark" : undefined}
                      className="col-start-1 row-start-1 grid focus-visible:outline-offset-[-4px] lg:min-h-[440px] lg:grid-cols-2"
                    >
                      {/* Text column */}
                      <m.div
                        data-path-anim
                        variants={textGroup}
                        initial={false}
                        animate={active ? "active" : "inactive"}
                        className="order-2 flex flex-col justify-center px-6 pt-4 pb-6 lg:order-1 lg:p-12"
                      >
                        <m.p
                          data-path-anim
                          variants={textItem}
                          className={cn(
                            "flex items-center gap-2.5 eyebrow",
                            dark ? "text-blue-300" : "text-blue-900",
                          )}
                        >
                          <span
                            aria-hidden
                            className="size-1.5 shrink-0 rounded-full bg-orange-500"
                          />
                          {copy.label}
                        </m.p>
                        <m.h3
                          data-path-anim
                          variants={textItem}
                          className={cn(
                            "mt-2 font-display text-[1.625rem] leading-[1.12] font-medium md:mt-4 md:text-[clamp(1.75rem,2.6vw,2.5rem)] md:leading-[1.08]",
                            dark ? "text-white" : "text-ink",
                          )}
                        >
                          {copy.title}
                        </m.h3>
                        <m.p
                          data-path-anim
                          variants={textItem}
                          className={cn(
                            "mt-2.5 max-w-[52ch] text-[15px] leading-[1.5] md:mt-4 md:text-body md:leading-[1.6]",
                            dark ? "text-slate-300" : "text-slate-600",
                          )}
                        >
                          {copy.text}
                        </m.p>
                        <m.div data-path-anim variants={textItem} className="mt-2.5 md:mt-6">
                          <StepStrip steps={copy.steps} tone={dark ? "dark" : "light"} />
                        </m.div>
                        <m.div
                          data-path-anim
                          variants={textItem}
                          className="mt-4 flex items-center gap-3 md:mt-8 md:flex-wrap"
                        >
                          <Cta
                            href={copy.cta.href}
                            variant={copy.cta.variant}
                            className="flex-1 md:flex-none"
                          >
                            {copy.cta.label}
                          </Cta>
                          <WhatsAppCta path={key} />
                        </m.div>
                      </m.div>

                      {/* Visual column — edge to edge, rings clipped by the panel */}
                      <div className="relative order-1 h-[168px] lg:order-2 lg:h-auto">
                        <m.div
                          data-path-anim
                          variants={visual}
                          initial={false}
                          animate={active ? "active" : "inactive"}
                          className="absolute inset-0"
                        >
                          {key === "learn" ? (
                            <LearnChart
                              rows={chart}
                              play={entrance}
                              running={ambient && active && !reduce}
                              desktop={desktop}
                            />
                          ) : (
                            <CarePath
                              services={services}
                              draw={careDraw}
                              running={ambient && active}
                              reduce={reduce}
                              desktop={desktop}
                            />
                          )}
                        </m.div>
                      </div>
                    </Tabs.Content>
                  );
                })}
              </m.div>
            </div>
          </Tabs.Root>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>
      </section>
    </LazyMotion>
  );
}
