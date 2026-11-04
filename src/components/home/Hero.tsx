import { ArrowRight } from "lucide-react";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { OpticalRings } from "@/components/motif/OpticalRings";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "./HeroVideo";
import { ScrollCue } from "./ScrollCue";

const TRUST = [
  "Myopia management",
  "Vision therapy",
  "Specialty contact lenses",
  "Ocular diagnostics",
];

function heroMedia() {
  const dir = path.join(process.cwd(), "public", "media");
  const has = (f: string) => fs.existsSync(path.join(dir, f));
  return { webm: has("hero.webm"), mp4: has("hero.mp4"), poster: has("hero-poster.avif") };
}

/** "Discover" — the cinematic dark-navy hero (§6.1). The H1 is the LCP element. */
export type HeroAdmission = { title: string; shortTitle: string; href: string; intake?: string };

export function Hero({
  clinicianName,
  admission,
}: {
  clinicianName: string;
  /** The program with the soonest open intake, if any. */
  admission?: HeroAdmission;
}) {
  const media = heroMedia();
  const hasVideo = media.webm || media.mp4;

  return (
    <section
      data-surface="dark"
      aria-labelledby="hero-title"
      className="relative isolate -mt-[var(--header-h)] flex min-h-[88svh] flex-col overflow-hidden bg-navy-950 pt-[var(--header-h)] md:min-h-[78svh]"
    >
      {hasVideo ? (
        <>
          <HeroVideo
            webm={media.webm ? "/media/hero.webm" : undefined}
            mp4={media.mp4 ? "/media/hero.mp4" : undefined}
            poster={media.poster ? "/media/hero-poster.avif" : undefined}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0B1736_0%,rgba(11,23,54,0.85)_40%,rgba(30,58,138,0.35)_100%)]"
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute top-[62%] right-[-55%] aspect-square w-[150vw] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(30,58,138,0.85),rgba(30,58,138,0.25)_60%,transparent)] sm:right-[-30%] sm:w-[110vw] lg:top-1/2 lg:right-[-14%] lg:w-[min(64vw,980px)]" />
          <OpticalRings
            tone="dark"
            rings={9}
            focal={4}
            rotate
            className="absolute top-[64%] right-[-62%] w-[150vw] -translate-y-1/2 opacity-70 sm:right-[-34%] sm:w-[110vw] lg:top-1/2 lg:right-[-16%] lg:w-[min(66vw,1000px)] lg:opacity-100"
          />
        </div>
      )}

      <div className="container-page grid flex-1 items-center py-14 md:py-20 lg:grid-cols-12">
        <div className="flex flex-col gap-7 lg:col-span-7">
          {admission ? (
            <Link
              href={admission.href}
              className="group inline-flex w-fit max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-white/5 py-1.5 pr-3.5 pl-1.5 text-[13px] text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/10"
            >
              <span className="shrink-0 rounded-full bg-orange-500 px-2.5 py-1 font-mono text-[10.5px] leading-none font-medium tracking-[0.08em] text-navy-950 uppercase">
                Admissions open
              </span>
              <span className="min-w-0 truncate">
                <span className="hidden sm:inline">{admission.title}</span>
                <span className="sm:hidden">{admission.shortTitle}</span>
                {admission.intake ? ` · ${admission.intake}` : ""}
              </span>
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                className="size-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          ) : null}
          <p className="eyebrow text-blue-300">Optometry Academy &amp; Eye Care · Chennai</p>
          <h1 id="hero-title" className="font-display text-display font-medium text-white">
            <span className="block">See further.</span> <span className="block">Learn deeper.</span>{" "}
            <em className="block text-orange-300">Care better.</em>
          </h1>
          <p className="measure-lead text-lead text-slate-300">
            Clinical optometry training for students and practising optometrists, and personalised,
            appointment-based eye care — led by {clinicianName}.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="#path" variant="light" arrow>
              Explore the Academy
            </Button>
            <Button href="/eye-care" variant="ghost-dark">
              Find eye care
            </Button>
          </div>
          <ul
            aria-label="Areas of expertise"
            className="flex flex-wrap gap-x-3 gap-y-1 eyebrow text-blue-300"
          >
            {TRUST.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {t}
                {i < TRUST.length - 1 ? <span aria-hidden>·</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page">
        <div className="flex h-14 items-center">
          <ScrollCue />
        </div>
      </div>
    </section>
  );
}
