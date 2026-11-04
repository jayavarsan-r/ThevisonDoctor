import Image from "next/image";
import type { CSSProperties } from "react";
import type { Partner } from "@/content/partners";
import { cn } from "@/lib/cn";
import { MarqueeToggle } from "./MarqueeToggle";

/** Visual area each logo gets (px², desktop) so wide and compact marks look equally heavy. */
const LOGO_AREA = 5600;
/** Each half of the loop needs at least this many logos to stay wider than the strip. */
const MIN_PER_HALF = 8;

function logoSize({ width, height }: Partner["logo"]) {
  const aspect = width / height;
  const w = Math.sqrt(LOGO_AREA * aspect);
  return { w: Math.round(w), h: Math.round(w / aspect) };
}

/**
 * Brand collaborations: an endless, slow logo strip. It pauses on hover and
 * with the pause button (WCAG 2.2.2), and stands still for people who prefer
 * reduced motion.
 */
export function BrandMarquee({
  partners,
  direction = "left",
}: {
  partners: Partner[];
  direction?: "left" | "right";
}) {
  if (!partners.length) return null;
  const repeat = Math.max(1, Math.ceil(MIN_PER_HALF / partners.length));
  const half = Array.from({ length: repeat }, () => partners).flat();
  const loop = [...half, ...half];

  return (
    <section aria-labelledby="brands-title" className="bg-white pt-12 pb-2 md:pt-16">
      <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-6 md:flex-nowrap md:gap-x-10">
        <h2
          id="brands-title"
          className="flex-1 eyebrow text-blue-900 md:max-w-[12rem] md:flex-none"
        >
          <span className="flex items-center gap-2.5">
            <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
            Brand collaborations
          </span>
        </h2>
        <MarqueeToggle target="brands-marquee" className="md:order-3" />
        <div
          id="brands-marquee"
          className="marquee-viewport relative min-w-0 basis-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] md:order-2 md:flex-1 md:basis-0"
        >
          <ul
            className={cn(
              "marquee-track flex w-max items-center",
              direction === "right" && "marquee-reverse",
            )}
          >
            {loop.map((p, i) => {
              const copy = i >= partners.length;
              const { w, h } = logoSize(p.logo);
              return (
                <li
                  key={`${p.id}-${i}`}
                  aria-hidden={copy ? true : undefined}
                  className="flex h-20 shrink-0 items-center px-7 md:px-10"
                >
                  <Image
                    src={p.logo.src}
                    alt={copy ? "" : p.name}
                    width={p.logo.width}
                    height={p.logo.height}
                    sizes={`${w}px`}
                    style={{ "--h": `${h}px` } as CSSProperties}
                    className="h-[calc(var(--h)*0.8)] w-auto max-w-none md:h-(--h)"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
