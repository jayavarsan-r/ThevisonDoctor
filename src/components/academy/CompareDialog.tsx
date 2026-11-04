"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Program } from "@/content/types";
import { programHref } from "@/lib/links";
import {
  accreditationText,
  applyByText,
  batchText,
  feeText,
  intakeText,
  modeText,
  stagesText,
  typeLabel,
} from "@/lib/program-view";

const NOT_CONFIRMED = "Not yet confirmed";

/** Side-by-side comparison of 2–3 programs (§6.3). */
export function CompareDialog({
  open,
  onOpenChange,
  programs,
  today,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programs: Program[];
  today: string;
}) {
  const rows: { label: string; render: (p: Program) => ReactNode }[] = [
    { label: "Type", render: typeLabel },
    { label: "Who it's for", render: stagesText },
    { label: "Eligibility", render: (p) => p.eligibility },
    { label: "Duration", render: (p) => p.duration },
    { label: "Schedule", render: (p) => p.schedule },
    { label: "Mode", render: modeText },
    { label: "Venue", render: (p) => p.venue },
    { label: "Clinical training", render: (p) => p.partner },
    { label: "Batch size", render: batchText },
    { label: "Fee", render: feeText },
    { label: "Next intake", render: (p) => intakeText(p, today) },
    { label: "Apply by", render: (p) => applyByText(p, today) },
    { label: "Certificate", render: (p) => p.certificate },
    { label: "Accreditation", render: (p) => accreditationText(p.accreditation) },
    {
      label: "Outcomes",
      render: (p) =>
        p.outcomes?.length ? (
          <ul className="list-disc space-y-1 pl-4">
            {p.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        ) : undefined,
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-overlay fixed inset-0 z-50 bg-navy-950/50" />
        <Dialog.Content className="animate-dialog fixed inset-x-3 top-[5vh] bottom-[5vh] z-50 mx-auto flex max-w-[1080px] flex-col overflow-hidden rounded-card bg-white shadow-float focus:outline-none sm:inset-x-6">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7 sm:py-5">
            <div>
              <Dialog.Title className="font-display text-[28px] leading-tight font-medium text-ink">
                Compare programs
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-meta text-slate-600">
                Details that are not yet confirmed are marked as such.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close comparison"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-btn border border-line text-ink hover:bg-blue-50"
            >
              <X aria-hidden strokeWidth={1.5} className="size-5" />
            </Dialog.Close>
          </div>
          <div
            className="flex-1 overflow-auto"
            tabIndex={0}
            role="region"
            aria-label="Comparison table"
          >
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <caption className="sr-only">Program comparison</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="sticky left-0 z-10 w-40 bg-white px-5 py-4 sm:px-7">
                    <span className="sr-only">Detail</span>
                  </th>
                  {programs.map((p) => (
                    <th
                      key={p.slug}
                      scope="col"
                      className="min-w-[220px] px-4 py-4 align-bottom font-semibold text-ink"
                    >
                      <Link href={programHref(p)} className="text-[16px] link">
                        {p.title}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-line align-top last:border-b-0">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-5 py-4 eyebrow font-medium text-slate-600 sm:px-7"
                    >
                      {row.label}
                    </th>
                    {programs.map((p) => {
                      const v = row.render(p);
                      return (
                        <td key={p.slug} className="px-4 py-4 text-ink">
                          {v === undefined || v === null || v === "" ? (
                            <span className="text-slate-500 italic">{NOT_CONFIRMED}</span>
                          ) : (
                            v
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
