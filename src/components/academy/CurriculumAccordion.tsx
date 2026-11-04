"use client";

import type { Program } from "@/content/types";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";

/** Curriculum modules with theory/practical split badges when provided (§7.2). */
export function CurriculumAccordion({ modules }: { modules: NonNullable<Program["curriculum"]> }) {
  return (
    <Accordion
      items={modules.map((m, i) => ({
        id: `module-${i}`,
        title: <>{m.title}</>,
        meta:
          m.theoryHours || m.practicalHours ? (
            <span className="flex flex-wrap gap-2">
              {m.theoryHours ? <Badge>Theory {m.theoryHours} h</Badge> : null}
              {m.practicalHours ? <Badge>Practical {m.practicalHours} h</Badge> : null}
            </span>
          ) : undefined,
        content: (
          <>
            {m.summary ? <p>{m.summary}</p> : null}
            {m.topics?.length ? (
              <ul className="mt-1 flex flex-col gap-2">
                {m.topics.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[10px] size-1.5 shrink-0 rounded-full bg-blue-600"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
            {!m.summary && !m.topics?.length ? (
              <p>No further details have been published for this module yet.</p>
            ) : null}
          </>
        ),
      }))}
    />
  );
}
