"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  matchesTypeFilter,
  programTypeFilters,
  specialityLabels,
  stageLabels,
  type ProgramTypeFilter,
} from "@/content/taxonomy";
import type { Program, Speciality, Stage } from "@/content/types";
import { Chip } from "@/components/ui/Chip";
import { Select } from "@/components/ui/Select";
import { track } from "@/lib/analytics";
import { FILTERS_FROM } from "@/lib/program-view";
import { CompareBar } from "./CompareBar";
import { CompareDialog } from "./CompareDialog";
import { EmptyPrograms } from "./EmptyPrograms";
import { ProgramCard } from "./ProgramCard";
import { ProgramShowcase } from "./ProgramShowcase";

type Filters = { type: ProgramTypeFilter; stage: Stage | ""; speciality: Speciality | "" };
const DEFAULTS: Filters = { type: "all", stage: "", speciality: "" };
const MAX_COMPARE = 3;

const isType = (v: string | null): v is ProgramTypeFilter =>
  programTypeFilters.some((f) => f.value === v);
const isStage = (v: string | null): v is Stage => !!v && v in stageLabels;
const isSpeciality = (v: string | null): v is Speciality => !!v && v in specialityLabels;

type Props = {
  programs: Program[];
  today: string;
  /** Show at most this many cards, then a "View all programs" link. */
  limit?: number;
  viewAllHref?: string;
};

/**
 * Filterable program grid with compare (§6.3). Filters sync to the URL
 * (?type=&stage=&speciality=) with shallow history updates. While the URL is
 * being read on the client, the unfiltered grid renders as a fallback.
 */
export function ProgramExplorer(props: Props) {
  return (
    <Suspense fallback={<ExplorerView {...props} filters={DEFAULTS} onFilters={() => {}} />}>
      <UrlSyncedExplorer {...props} />
    </Suspense>
  );
}

function UrlSyncedExplorer(props: Props) {
  const params = useSearchParams();
  const pathname = usePathname();

  const filters: Filters = {
    type: isType(params.get("type")) ? (params.get("type") as ProgramTypeFilter) : "all",
    stage: isStage(params.get("stage")) ? (params.get("stage") as Stage) : "",
    speciality: isSpeciality(params.get("speciality"))
      ? (params.get("speciality") as Speciality)
      : "",
  };

  const onFilters = (next: Filters) => {
    const q = new URLSearchParams(params.toString());
    for (const key of Object.keys(DEFAULTS) as (keyof Filters)[]) {
      if (next[key] === DEFAULTS[key]) q.delete(key);
      else q.set(key, next[key]);
    }
    const qs = q.toString();
    window.history.replaceState(
      null,
      "",
      `${pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
    );
    track("filter_change", {
      type: next.type,
      stage: next.stage || "any",
      speciality: next.speciality || "all",
    });
  };

  return <ExplorerView {...props} filters={filters} onFilters={onFilters} />;
}

function ExplorerView({
  programs,
  today,
  limit,
  viewAllHref,
  filters,
  onFilters,
}: Props & { filters: Filters; onFilters: (f: Filters) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const results = useMemo(
    () =>
      programs.filter(
        (p) =>
          matchesTypeFilter(p.type, filters.type) &&
          (!filters.stage || p.stages.includes(filters.stage)) &&
          (!filters.speciality || p.specialities.includes(filters.speciality)),
      ),
    [programs, filters.type, filters.stage, filters.speciality],
  );

  if (!programs.length) return <EmptyPrograms />;
  // A few programs: no filters or compare — show them all, grouped by type.
  if (programs.length < FILTERS_FROM) return <ProgramShowcase programs={programs} today={today} />;

  const shown = typeof limit === "number" ? results.slice(0, limit) : results;
  const hasMore = typeof limit === "number" && results.length > limit;
  const filtered = filters.type !== "all" || filters.stage || filters.speciality;
  const selectedPrograms = selected
    .map((slug) => programs.find((p) => p.slug === slug))
    .filter((p): p is Program => Boolean(p));

  const toggle = (slug: string, checked: boolean) =>
    setSelected((s) =>
      checked ? [...s, slug].slice(0, MAX_COMPARE) : s.filter((x) => x !== slug),
    );

  return (
    <div className={selected.length ? "pb-24" : undefined}>
      <div className="flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:items-end lg:justify-between">
        <div
          role="group"
          aria-label="Program type"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {programTypeFilters.map((f) => (
            <Chip
              key={f.value}
              pressed={filters.type === f.value}
              onClick={() => onFilters({ ...filters, type: f.value })}
            >
              {f.label}
            </Chip>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[480px]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-stage" className="text-meta font-medium text-ink">
              I am a…
            </label>
            <Select
              id="filter-stage"
              value={filters.stage}
              onChange={(e) => onFilters({ ...filters, stage: e.target.value as Stage | "" })}
              className="h-11 text-[15px]"
            >
              <option value="">Any stage</option>
              {(Object.keys(stageLabels) as Stage[]).map((s) => (
                <option key={s} value={s}>
                  {stageLabels[s]}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-speciality" className="text-meta font-medium text-ink">
              Speciality
            </label>
            <Select
              id="filter-speciality"
              value={filters.speciality}
              onChange={(e) =>
                onFilters({ ...filters, speciality: e.target.value as Speciality | "" })
              }
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
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="font-mono text-[13px] text-slate-600">
          {results.length} {results.length === 1 ? "program" : "programs"}
        </p>
        {filtered ? (
          <button
            type="button"
            onClick={() => onFilters(DEFAULTS)}
            className="text-meta font-medium link"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {shown.length ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug} className="h-full">
              <ProgramCard
                program={p}
                today={today}
                compare={
                  programs.length > 1
                    ? {
                        checked: selected.includes(p.slug),
                        disabled: !selected.includes(p.slug) && selected.length >= MAX_COMPARE,
                        onChange: (c) => toggle(p.slug, c),
                      }
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-card border border-dashed border-slate-300 p-8 text-center">
          <p className="font-semibold text-ink">No programs match these filters.</p>
          <p className="mt-1 text-slate-600">
            Try another speciality or stage, or clear the filters.
          </p>
        </div>
      )}

      {hasMore && viewAllHref ? (
        <div className="mt-8">
          <Link href={viewAllHref} className="inline-flex items-center gap-1 font-semibold link">
            View all programs <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
          </Link>
        </div>
      ) : null}

      <CompareBar
        count={selected.length}
        max={MAX_COMPARE}
        onCompare={() => {
          setCompareOpen(true);
          track("compare_open", { count: selected.length });
        }}
        onClear={() => setSelected([])}
      />
      <CompareDialog
        open={compareOpen}
        onOpenChange={setCompareOpen}
        programs={selectedPrograms}
        today={today}
      />
      <span className="sr-only" aria-live="polite">
        {selected.length ? `${selected.length} selected for comparison` : ""}
      </span>
    </div>
  );
}
