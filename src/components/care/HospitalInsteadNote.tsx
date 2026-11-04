import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export const HOSPITAL_SIGNS = [
  "Sudden loss of vision",
  "Flashes of light or a shower of new floaters",
  "Eye injury or chemical splash",
  "Severe eye pain or a very red, painful eye",
  "Double vision that comes on suddenly",
];

/** Required on every eye-care page (rule 7). */
export function HospitalInsteadNote({
  title = "When to go to a hospital instead",
  id,
  className,
}: {
  title?: string;
  id?: string;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id ?? "hospital-instead"}
      className={cn("rounded-card border-2 border-orange-700/60 bg-white p-6 sm:p-8", className)}
    >
      <div className="flex items-start gap-3">
        <TriangleAlert
          aria-hidden
          strokeWidth={1.5}
          className="mt-1 size-6 shrink-0 text-orange-700"
        />
        <div className="flex flex-col gap-4">
          <h2 id={id ?? "hospital-instead"} className="text-h3 font-semibold text-ink">
            {title}
          </h2>
          <p className="text-[15px] text-slate-600">
            Go to the nearest hospital emergency department immediately if you have:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {HOSPITAL_SIGNS.map((s) => (
              <li key={s} className="flex gap-2.5 text-[15px] font-medium text-ink">
                <span
                  aria-hidden
                  className="mt-[9px] size-1.5 shrink-0 rounded-full bg-orange-700"
                />
                {s}
              </li>
            ))}
          </ul>
          <p className="text-meta text-slate-600">We do not provide emergency care.</p>
        </div>
      </div>
    </section>
  );
}
