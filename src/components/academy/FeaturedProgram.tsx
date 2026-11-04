import type { Program } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { SpecList } from "@/components/ui/SpecList";
import { programHref } from "@/lib/links";
import { feeText, intakeText, modeText, typeMono } from "@/lib/program-view";

/** Admissions spotlight for the program with the soonest open intake (dark surfaces). */
export function FeaturedProgram({ program, today }: { program: Program; today: string }) {
  const intake = intakeText(program, today);
  return (
    <article
      aria-labelledby="featured-program-title"
      className="relative overflow-hidden rounded-card border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7"
    >
      <p className="flex items-center gap-2.5 eyebrow text-orange-300">
        <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
        Admissions open{intake ? ` · First batch ${intake}` : ""}
      </p>
      <p className="mt-4 eyebrow text-blue-300">{typeMono(program)}</p>
      <h2
        id="featured-program-title"
        className="mt-2 font-display text-[clamp(1.5rem,2.4vw,1.875rem)] leading-tight font-medium text-white"
      >
        {program.title}
      </h2>
      <SpecList
        tone="dark"
        size="sm"
        className="mt-5"
        rows={[
          { label: "Duration", value: program.duration },
          { label: "Mode", value: modeText(program) },
          { label: "Fee", value: feeText(program) },
          { label: "Location", value: program.venue },
          { label: "Clinical", value: program.partner ? `With ${program.partner}` : undefined },
        ]}
      />
      <Button href={programHref(program)} variant="light" arrow className="mt-6 w-full">
        View program
      </Button>
    </article>
  );
}
