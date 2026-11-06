import { cn } from "@/lib/cn";

export const ADMISSION_STEPS = [
  { title: "Enquire", text: "Tell us your background and the program you're interested in." },
  {
    title: "Meet eligibility",
    text: "We confirm eligibility, schedule and fees with you directly.",
  },
  { title: "Confirm your place", text: "Secure your seat for the intake that suits you." },
  {
    title: "Learn and practise",
    text: "Theory, demonstration and guided practice, as described on each program page.",
  },
];

/**
 * Numbered timeline — horizontal with a 1px blue-200 connector on desktop,
 * vertical on mobile (§6.5). Also used for patient "how it works" steps.
 */
export function StepsTimeline({
  steps,
  className,
  tone = "tint",
}: {
  steps: { title: string; text?: string }[];
  className?: string;
  tone?: "tint" | "white";
}) {
  const cols = steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return (
    <ol className={cn("relative grid gap-8 lg:gap-6", cols, className)}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          data-reveal
          style={{ "--i": i } as React.CSSProperties}
          className="relative flex gap-5 lg:flex-col lg:gap-5"
        >
          {/* connector */}
          {i < steps.length - 1 ? (
            <span
              aria-hidden
              className="absolute top-11 bottom-[-2rem] left-[21px] w-px bg-blue-200 lg:top-[21px] lg:right-[-1.5rem] lg:bottom-auto lg:left-11 lg:h-px lg:w-auto"
            />
          ) : null}
          <span
            className={cn(
              "relative z-[1] inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-blue-200 text-[15px] font-semibold text-blue-900",
              tone === "tint" ? "bg-white" : "bg-blue-50",
            )}
          >
            {i + 1}
          </span>
          <div className="flex flex-col gap-1.5 pt-2 lg:pt-0 lg:pr-4">
            <h3 className="text-[19px] leading-snug font-semibold text-ink">{step.title}</h3>
            {step.text ? <p className="text-[15px] text-slate-600">{step.text}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function AdmissionsSteps({ className }: { className?: string }) {
  return <StepsTimeline steps={ADMISSION_STEPS} className={className} />;
}
