import { MapPin } from "lucide-react";
import type { ConsultationLocation } from "@/content/types";
import { DraftBadge } from "@/components/ui/DraftBadge";

/** Confirmed consultation locations, or the default sentence. Never the office. */
export function WhereAppointments({
  locations,
  fallback,
}: {
  locations: ConsultationLocation[];
  fallback: string;
}) {
  if (!locations.length) {
    return <p className="measure text-slate-600">{fallback}</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {locations.map((l) => (
        <li key={l.id}>
          <DraftBadge draft={l.status === "draft"}>
            <div className="flex gap-3 rounded-card border border-line bg-white p-5">
              <MapPin
                aria-hidden
                strokeWidth={1.5}
                className="mt-0.5 size-5 shrink-0 text-blue-900"
              />
              <div>
                <p className="font-semibold text-ink">{l.name}</p>
                <p className="text-[15px] text-slate-600">{l.area}</p>
                {l.days || l.hours ? (
                  <p className="mt-1 text-meta text-slate-600">
                    {[l.days, l.hours].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {l.note ? <p className="mt-1 text-meta text-slate-600">{l.note}</p> : null}
              </div>
            </div>
          </DraftBadge>
        </li>
      ))}
    </ul>
  );
}
