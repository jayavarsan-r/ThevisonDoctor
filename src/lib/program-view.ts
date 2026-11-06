import { modeLabels, programTypeLabels, specialityLabels, stageLabels } from "@/content/taxonomy";
import type { Accreditation, Program, ProgramType } from "@/content/types";
import { formatDate, formatINR } from "./format";

/** Display helpers shared by ProgramCard, CompareDialog and SpecRail. Client-safe. */

export const PROGRAM_TYPES: readonly ProgramType[] = [
  "fellowship",
  "certification",
  "clinical-training",
  "workshop",
  "cme",
];

/**
 * Filters and compare appear once this many programs are published. Below it,
 * the explorer shows every program at once, grouped by type.
 */
export const FILTERS_FROM = 5;

/** In-page anchor for a group of programs, e.g. "/academy#certification-programs". */
export const typeAnchor = (type: ProgramType) => `${type}-programs`;

/**
 * Program categories with nothing published yet, as a phrase:
 * "short-term clinical workshops and CME". Empty when every category exists.
 */
export function comingNextText(programs: Pick<Program, "type">[]) {
  const has = (...types: ProgramType[]) => programs.some((p) => types.includes(p.type));
  const parts = [
    has("fellowship") ? null : "fellowship programs",
    has("certification") ? null : "certification programs",
    has("clinical-training", "workshop") ? null : "short-term clinical workshops",
    has("cme") ? null : "CME",
  ].filter((x): x is string => Boolean(x));
  if (parts.length < 2) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

export function nextIntake(program: Pick<Program, "intakes">, today: string) {
  return (program.intakes ?? [])
    .filter((i) => i.status === "open" && i.start >= today)
    .sort((a, b) => a.start.localeCompare(b.start))[0];
}

export const typeLabel = (p: Pick<Program, "type">) => programTypeLabels[p.type].label;
export const typeMono = (p: Pick<Program, "type">) => programTypeLabels[p.type].mono;

export const stagesText = (p: Pick<Program, "stages">) =>
  p.stages.map((s) => stageLabels[s]).join(", ") || undefined;

export const specialitiesText = (p: Pick<Program, "specialities">) =>
  p.specialities.map((s) => specialityLabels[s]).join(", ") || undefined;

export const modeText = (p: Pick<Program, "mode">) => (p.mode ? modeLabels[p.mode] : undefined);

/** "₹30,000 + GST" */
export const feeText = (p: Pick<Program, "fee">) =>
  p.fee ? `${formatINR(p.fee.amountINR)}${p.fee.gstNote ? ` ${p.fee.gstNote}` : ""}` : undefined;

export function intakeText(p: Pick<Program, "intakes">, today: string) {
  const next = nextIntake(p, today);
  return next ? formatDate(next.start) : undefined;
}

export function applyByText(p: Pick<Program, "intakes">, today: string) {
  const next = nextIntake(p, today);
  return next?.applyBy ? formatDate(next.applyBy) : undefined;
}

/**
 * Accreditation is only ever described as approved when the status is
 * "approved" AND a named body is recorded (§7.1.5).
 */
export function accreditationText(a: Accreditation) {
  if (a.status === "approved" && a.body) {
    return `Accredited by ${a.body}${a.points ? ` · ${a.points} CE/CPD points` : ""}`;
  }
  if (a.status === "applied") return "Applied for — not yet approved";
  // The Academy issues its own certificates (29 Oct 2026; wording per client, 6 Nov).
  return "Certificate issued by The Vision Doctor Academy";
}

export function cpdText(a: Accreditation) {
  if (a.status === "approved" && a.body && a.points) return `${a.points} points (${a.body})`;
  return "Not accredited";
}

export const batchText = (p: Pick<Program, "batchSize">) => p.batchSize || undefined;

export const isEventType = (p: Pick<Program, "type">) => p.type === "workshop" || p.type === "cme";
