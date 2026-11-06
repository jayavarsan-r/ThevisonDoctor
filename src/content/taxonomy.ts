import type { Mode, ProgramType, Speciality, Stage } from "./types";

export const programTypeLabels: Record<
  ProgramType,
  { label: string; plural: string; mono: string }
> = {
  fellowship: { label: "Fellowship", plural: "Fellowships", mono: "FELLOWSHIP" },
  certification: { label: "Certification", plural: "Certifications", mono: "CERTIFICATION" },
  "clinical-training": {
    label: "Clinical training",
    plural: "Clinical training",
    mono: "CLINICAL TRAINING",
  },
  workshop: { label: "Workshop", plural: "Workshops", mono: "WORKSHOP" },
  cme: { label: "CME", plural: "CME", mono: "CME" },
};

/** Filter groups used by the explorer chips. Workshops and CME share a chip. */
export const programTypeFilters = [
  { value: "all", label: "All" },
  { value: "fellowship", label: "Fellowships" },
  { value: "certification", label: "Certifications" },
  { value: "clinical-training", label: "Clinical training" },
  { value: "workshop-cme", label: "Workshops & CME" },
] as const;

export type ProgramTypeFilter = (typeof programTypeFilters)[number]["value"];

export function matchesTypeFilter(type: ProgramType, filter: ProgramTypeFilter) {
  if (filter === "all") return true;
  if (filter === "workshop-cme") return type === "workshop" || type === "cme";
  return type === filter;
}

export const stageLabels: Record<Stage, string> = {
  "student-intern": "Student or intern",
  "practising-optometrist": "Practising optometrist",
  "other-eyecare": "Other eye-care professional",
};

export const specialityLabels: Record<Speciality, string> = {
  myopia: "Myopia management",
  "binocular-vision": "Binocular vision & vision therapy",
  "contact-lenses": "Specialty contact lenses",
  diagnostics: "Ocular diagnostics",
};

export const modeLabels: Record<Mode, string> = {
  "in-person": "In-person",
  online: "Online",
  hybrid: "Hybrid",
};

/**
 * "Program types explained" (§7.1.4). Descriptions are the client's own
 * wording ("Our Services" › Academy). Short-term clinical training and
 * workshops are one category there, so they share a row.
 */
export const programTypeExplainers: {
  key: string;
  label: string;
  description: string;
  typicallyFor: string;
}[] = [
  {
    key: "fellowship",
    label: "Fellowship programs",
    description:
      "Advanced clinical learning programs designed to enhance professional knowledge, practical skills, and clinical competency in optometry.",
    typicallyFor: "B.Optom graduates, qualified optometrists and early-career optometrists.",
  },
  {
    key: "certification",
    label: "Certification programs",
    description:
      "Structured learning programs that strengthen subject-specific knowledge and practical skills in specialised areas of eye care.",
    typicallyFor:
      "B.Optom graduates and qualified optometrists building skills in a specialised area of eye care.",
  },
  {
    key: "workshops",
    label: "Short-term clinical workshops",
    description:
      "Focused, interactive, skill-based hands-on training sessions that give practical exposure to modern optometric techniques, equipment and diagnostic techniques, to improve clinical practice.",
    typicallyFor: "Students, interns and practising optometrists who want hands-on practice.",
  },
  {
    key: "cme",
    label: "Continuing Medical Education (CME)",
    description:
      "Educational sessions designed to support continuous professional learning and keep eye care professionals updated on current clinical practices and advancements.",
    typicallyFor:
      "Optometry students and practising eye-care professionals keeping their knowledge current.",
  },
];

export const blogCategoryLabels: Record<import("./types").BlogCategory, string> = {
  "eye-diseases": "Eye diseases",
  "vision-disorders": "Vision disorders",
};
