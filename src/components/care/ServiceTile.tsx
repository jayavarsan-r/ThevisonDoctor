import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/content/types";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { ServiceIcon } from "@/components/ui/icons";
import { serviceHref } from "@/lib/links";

export function ServiceTile({ service }: { service: Service }) {
  return (
    <DraftBadge draft={service.status === "draft"} className="h-full">
      <article className="card-interactive flex h-full flex-col gap-4 rounded-card border border-line bg-white p-6 sm:p-7">
        <ServiceIcon name={service.icon} />
        <h3 className="text-[19px] leading-snug font-semibold text-ink">{service.title}</h3>
        <p className="text-[15px] text-slate-600">{service.short}</p>
        <Link
          href={serviceHref(service)}
          className="mt-auto inline-flex items-center gap-1 pt-2 text-[15px] font-semibold link"
        >
          Learn more<span className="sr-only"> about {service.title.toLowerCase()}</span>
          <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
        </Link>
      </article>
    </DraftBadge>
  );
}

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <li key={s.slug} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
          <ServiceTile service={s} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Services grouped the way the client describes them: home consultations,
 * screening and examinations first, then super-speciality eye care.
 */
export function GroupedServices({
  services,
  superSpeciality,
}: {
  services: Service[];
  superSpeciality: string;
}) {
  const core = services.filter((s) => s.group === "core");
  const special = services.filter((s) => s.group === "super-speciality");
  return (
    <div className="flex flex-col gap-6">
      <ServiceGrid services={core} />
      {special.length ? (
        <section
          aria-labelledby="super-speciality-title"
          className="rounded-[20px] border border-blue-200 bg-white/60 p-5 sm:p-8"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2.5 eyebrow text-blue-900">
                <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
                Super-speciality
              </p>
              <h3
                id="super-speciality-title"
                className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium text-ink"
              >
                Super-speciality eye care
              </h3>
            </div>
            <p className="max-w-[56ch] text-[15px] text-slate-600">{superSpeciality}</p>
          </div>
          <div className="mt-6">
            <ServiceGrid services={special} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
