"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { Program } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { SpecList } from "@/components/ui/SpecList";
import { cn } from "@/lib/cn";
import { programHref } from "@/lib/links";
import { feeText, intakeText, modeText, stagesText, typeMono } from "@/lib/program-view";

export function ProgramCard({
  program,
  today,
  compare,
}: {
  program: Program;
  today: string;
  compare?: { checked: boolean; disabled: boolean; onChange: (checked: boolean) => void };
}) {
  const intake = intakeText(program, today);
  const id = `compare-${program.slug}`;
  const titleId = `program-${program.slug}-title`;

  return (
    <DraftBadge draft={program.status === "draft"} className="h-full">
      <article
        aria-labelledby={titleId}
        className="card-interactive flex h-full flex-col rounded-card border border-line bg-white p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="eyebrow text-blue-900">{typeMono(program)}</span>
          {intake ? <Badge dot>Next intake {intake}</Badge> : null}
        </div>
        <h3 id={titleId} className="mt-4 text-h3 font-semibold text-ink">
          {program.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[15px] text-slate-600">{program.outcome}</p>
        <SpecList
          size="sm"
          className="mt-5"
          rows={[
            { label: "Who it's for", value: stagesText(program) },
            { label: "Duration", value: program.duration },
            { label: "Mode", value: modeText(program) },
            { label: "Fee", value: feeText(program) },
            { label: "Next intake", value: intake },
          ]}
        />
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <Link
            href={programHref(program)}
            className="inline-flex items-center gap-1 text-[15px] font-semibold link"
            aria-describedby={titleId}
          >
            View program <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
          </Link>
          {compare ? (
            <div className="flex items-center gap-2">
              <Checkbox.Root
                id={id}
                checked={compare.checked}
                disabled={compare.disabled}
                onCheckedChange={(v) => compare.onChange(v === true)}
                aria-describedby={titleId}
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-[5px] border border-slate-300 bg-white transition-colors",
                  "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                <Checkbox.Indicator>
                  <Check aria-hidden strokeWidth={2.5} className="size-3.5" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label
                htmlFor={id}
                className={cn(
                  "cursor-pointer py-2 text-meta font-medium text-ink select-none",
                  compare.disabled && "cursor-not-allowed text-slate-500",
                )}
              >
                Compare
              </label>
            </div>
          ) : null}
        </div>
      </article>
    </DraftBadge>
  );
}
