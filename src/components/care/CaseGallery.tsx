import { ArrowRight, Info, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CareCase, CasePhoto } from "@/content/types";
import { cn } from "@/lib/cn";

type Layout = "stacked" | "split";

function Photo({
  photo,
  label,
  sizes,
}: {
  photo: CasePhoto;
  label: "Before" | "After";
  sizes: string;
}) {
  return (
    <div className="relative aspect-[12/5] overflow-hidden bg-blue-50">
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      <span
        aria-hidden
        className={cn(
          "absolute top-3 left-3 inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[11px] leading-none font-medium tracking-[0.08em] uppercase shadow-sm",
          label === "Before" ? "bg-white/95 text-ink" : "bg-blue-600 text-white",
        )}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * One before-and-after case. "stacked" puts the photos one above the other
 * (cards in a grid); "split" puts them side by side (a single, wider case).
 */
export function CaseCard({
  item,
  serviceTitle,
  headingLevel = 3,
  layout = "stacked",
}: {
  item: CareCase;
  /** Adds a link to the related service page. */
  serviceTitle?: string;
  headingLevel?: 3 | 4;
  layout?: Layout;
}) {
  if (!item.before || !item.after) return null;
  const H = headingLevel === 3 ? "h3" : "h4";
  const titleId = `case-${item.id}-title`;
  const sizes =
    layout === "split"
      ? "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
      : "(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw";

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white"
    >
      <div className={cn("grid gap-px bg-line", layout === "split" && "sm:grid-cols-2")}>
        <Photo photo={item.before} label="Before" sizes={sizes} />
        <Photo photo={item.after} label="After" sizes={sizes} />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-7">
        <p className="flex items-center gap-2.5 eyebrow text-orange-700">
          <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
          Treated with {item.treatment.toLowerCase()}
        </p>
        <H id={titleId} className="text-h3 font-semibold text-ink">
          {item.condition}
        </H>
        <p className="measure text-[15px] text-slate-600">{item.summary}</p>
        {item.safetyNote ? (
          <p className="flex gap-2 text-meta text-slate-600">
            <TriangleAlert
              aria-hidden
              strokeWidth={1.5}
              className="mt-0.5 size-4 shrink-0 text-orange-700"
            />
            <span>{item.safetyNote}</span>
          </p>
        ) : null}
        {serviceTitle ? (
          <p className="mt-auto pt-3">
            <Link
              href={`/eye-care/${item.relatedService}`}
              className="text-[15px] font-semibold link"
            >
              {serviceTitle}
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                className="ml-1 inline size-4 align-[-3px]"
              />
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function CaseGallery({
  cases,
  serviceTitles,
  headingLevel = 3,
  className,
}: {
  cases: CareCase[];
  /** slug → title, to link each case to its service page. */
  serviceTitles?: Record<string, string>;
  headingLevel?: 3 | 4;
  className?: string;
}) {
  if (!cases.length) return null;
  if (cases.length === 1) {
    return (
      <div className={className}>
        <CaseCard
          item={cases[0]}
          layout="split"
          headingLevel={headingLevel}
          serviceTitle={serviceTitles?.[cases[0].relatedService]}
        />
      </div>
    );
  }
  return (
    <ul className={cn("grid gap-6 md:grid-cols-2", className)}>
      {cases.map((c) => (
        <li key={c.id} className="h-full">
          <CaseCard
            item={c}
            headingLevel={headingLevel}
            serviceTitle={serviceTitles?.[c.relatedService]}
          />
        </li>
      ))}
    </ul>
  );
}

/** The plain-language caveat shown with every set of cases. */
export function CasesNote({ className }: { className?: string }) {
  return (
    <p className={cn("flex gap-2.5 text-meta text-slate-600", className)}>
      <Info aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 text-blue-900" />
      <span>
        Each case is one person&apos;s experience. What non-surgical care can do depends on the type
        and cause of the condition, so an assessment comes first — and we&apos;ll tell you if
        surgery or hospital care is the better route.
      </span>
    </p>
  );
}
