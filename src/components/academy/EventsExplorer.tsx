"use client";

import { useState } from "react";
import { modeLabels, specialityLabels } from "@/content/taxonomy";
import type { Event, Mode, Speciality } from "@/content/types";
import { EventRow, NoEvents } from "@/components/home/WorkshopStrip";
import { Chip } from "@/components/ui/Chip";
import { Select } from "@/components/ui/Select";

/** Upcoming events with Format and Speciality filters (§7.3). */
export function EventsExplorer({ events }: { events: Event[] }) {
  const [mode, setMode] = useState<Mode | "all">("all");
  const [speciality, setSpeciality] = useState<Speciality | "">("");

  if (!events.length) return <NoEvents />;

  const results = events.filter(
    (e) =>
      (mode === "all" || e.mode === mode) && (!speciality || e.specialities?.includes(speciality)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-end md:justify-between">
        <div role="group" aria-label="Format" className="flex flex-wrap gap-2">
          <Chip pressed={mode === "all"} onClick={() => setMode("all")}>
            All formats
          </Chip>
          {(Object.keys(modeLabels) as Mode[]).map((m) => (
            <Chip key={m} pressed={mode === m} onClick={() => setMode(m)}>
              {modeLabels[m]}
            </Chip>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 md:w-72">
          <label htmlFor="event-speciality" className="text-meta font-medium text-ink">
            Speciality
          </label>
          <Select
            id="event-speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value as Speciality | "")}
            className="h-11 text-[15px]"
          >
            <option value="">All</option>
            {(Object.keys(specialityLabels) as Speciality[]).map((s) => (
              <option key={s} value={s}>
                {specialityLabels[s]}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <p role="status" aria-live="polite" className="mt-5 font-mono text-[13px] text-slate-600">
        {results.length} {results.length === 1 ? "event" : "events"}
      </p>
      {results.length ? (
        <ul className="mt-5 flex flex-col gap-4">
          {results.map((e) => (
            <li key={e.slug}>
              <EventRow event={e} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-card border border-dashed border-slate-300 p-8 text-center text-slate-600">
          No events match these filters.
        </p>
      )}
    </div>
  );
}
