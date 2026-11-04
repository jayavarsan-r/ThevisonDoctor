import { cacheLife } from "next/cache";
import { blogPosts } from "@/content/blog";
import { cases } from "@/content/cases";
import { clinicians } from "@/content/clinician";
import { events } from "@/content/events";
import { faqs } from "@/content/faqs";
import { locations } from "@/content/locations";
import { programs } from "@/content/programs";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { modeLabels, programTypeLabels } from "@/content/taxonomy";
import type {
  BlogPost,
  CareCase,
  Clinician,
  Faq,
  Program,
  ProgramType,
  Qualification,
  Speciality,
  Stage,
} from "@/content/types";
import { gate, gateAll, onlyVisible, type Gated } from "./drafts";
import { formatDate, todayInIndia } from "./format";
import { programHref } from "./links";
import { FILTERS_FROM, nextIntake, PROGRAM_TYPES, typeAnchor } from "./program-view";

/**
 * Content getters (BUILD_PROMPT §9.2). Every getter drops draft items and
 * unverified values unless preview mode is on. Pages and components must
 * read content through these functions, never from src/content directly.
 */

/** Today in India (YYYY-MM-DD), cached for a day so "upcoming" lists roll over. */
export async function getToday(): Promise<string> {
  "use cache";
  cacheLife("days");
  return todayInIndia();
}

// ---------- Programs ----------

export function getPrograms(): Program[] {
  return onlyVisible(programs);
}

export function getProgram(slug: string): Program | undefined {
  return getPrograms().find((p) => p.slug === slug);
}

export function getProgramsBySpeciality(specialities: Speciality[]): Program[] {
  return getPrograms().filter((p) => p.specialities.some((s) => specialities.includes(s)));
}

export function getRelatedPrograms(program: Program): Program[] {
  const explicit = (program.relatedSlugs ?? [])
    .map((slug) => getProgram(slug))
    .filter((p): p is Program => Boolean(p));
  if (explicit.length) return explicit.slice(0, 3);
  return getPrograms()
    .filter(
      (p) =>
        p.slug !== program.slug && p.specialities.some((s) => program.specialities.includes(s)),
    )
    .slice(0, 3);
}

/** The program with the soonest open intake — used by the Academy menu card. */
export function getFeaturedIntake(today: string) {
  return getPrograms()
    .map((program) => ({ program, intake: nextIntake(program, today) }))
    .filter((x): x is { program: Program; intake: NonNullable<ReturnType<typeof nextIntake>> } =>
      Boolean(x.intake),
    )
    .sort((a, b) => a.intake.start.localeCompare(b.intake.start))[0];
}

// ---------- Events ----------

export function getEvents() {
  return onlyVisible(events).sort((a, b) => a.start.localeCompare(b.start));
}

export function getUpcomingEvents(today: string, limit?: number) {
  const upcoming = getEvents().filter((e) => (e.end ?? e.start) >= today);
  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

export function getPastEvents(today: string) {
  return getEvents()
    .filter((e) => (e.end ?? e.start) < today)
    .reverse();
}

// ---------- Services ----------

export function getServices() {
  return onlyVisible(services);
}

export function getService(slug: string) {
  return getServices().find((s) => s.slug === slug);
}

// ---------- FAQs ----------

export function getFaqs(
  opts: { audience?: Faq["audience"]; homepage?: boolean; ids?: string[] } = {},
) {
  let list = onlyVisible(faqs);
  if (opts.audience) list = list.filter((f) => f.audience === opts.audience);
  if (opts.homepage) list = list.filter((f) => f.homepage);
  if (opts.ids) {
    const ids = opts.ids;
    list = ids.map((id) => list.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f));
  }
  return list;
}

// ---------- Clinician ----------

export interface ClinicianView {
  id: string;
  name: string;
  displayName: string;
  credential: string;
  role: Clinician["role"];
  summary: string;
  expertise: string[];
  qualificationsLine: Gated<string> | null;
  qualifications: Gated<Qualification>[];
  registration: Gated<{ council: string; number: string }> | null;
  experience: Gated<{ place: string; years?: string }>[];
  teachingApproach: Gated<string> | null;
  photo?: string;
  stats: { value: string; label: string }[];
}

function toView(c: Clinician): ClinicianView {
  return {
    id: c.id,
    name: c.name,
    displayName: c.displayName,
    credential: c.credential,
    role: c.role,
    summary: c.summary,
    expertise: c.expertise,
    qualificationsLine: gate(c.qualificationsLine),
    qualifications: gateAll(c.qualifications),
    registration: gate(c.registration),
    experience: gateAll(c.experience),
    teachingApproach: gate(c.teachingApproach),
    photo: c.photo,
    stats: c.stats ?? [],
  };
}

export function getClinician(id = "subash-v"): ClinicianView {
  const c = clinicians.find((x) => x.id === id) ?? clinicians[0];
  return toView(c);
}

export function getFaculty(ids: string[]): ClinicianView[] {
  return ids
    .map((id) => clinicians.find((c) => c.id === id))
    .filter((c): c is Clinician => Boolean(c))
    .map(toView);
}

// ---------- Locations & site ----------

export function getLocations() {
  return {
    consultationLocations: onlyVisible(locations.consultationLocations),
    homeVisitPincodes: locations.homeVisitPincodes,
    defaultWhereWhen: locations.defaultWhereWhen,
  };
}

export function getCertificateStatement() {
  return gate(site.academy.certificateStatement);
}

// ---------- Program links that adapt to what is published ----------

type ProgramSlice = { type?: Program["type"]; speciality?: Speciality; stage?: Stage };

/**
 * Best destination for a slice of programs: exactly one match → its page;
 * several → the explorer (filtered, or the matching group while there are too
 * few programs for filters); none → the "get notified" enquiry.
 */
export function programsLink(slice: ProgramSlice) {
  const matches = getPrograms().filter(
    (p) =>
      (!slice.type || p.type === slice.type) &&
      (!slice.speciality || p.specialities.includes(slice.speciality)) &&
      (!slice.stage || p.stages.includes(slice.stage)),
  );
  if (matches.length === 1) return { href: programHref(matches[0]), count: 1 };
  if (matches.length > 1 && getPrograms().length < FILTERS_FROM) {
    const types = [...new Set(matches.map((p) => p.type))];
    return {
      href: types.length === 1 ? `/academy#${typeAnchor(types[0])}` : "/academy#programs",
      count: matches.length,
    };
  }
  if (matches.length > 1) {
    const q = new URLSearchParams();
    if (slice.type) {
      q.set(
        "type",
        slice.type === "workshop" || slice.type === "cme" ? "workshop-cme" : slice.type,
      );
    }
    if (slice.speciality) q.set("speciality", slice.speciality);
    if (slice.stage) q.set("stage", slice.stage);
    return { href: `/academy?${q.toString()}#programs`, count: matches.length };
  }
  return { href: "/academy/enquire?intent=notify", count: 0 };
}

export type ChartRow = {
  type: Program["type"];
  label: string;
  href: string;
  status: "open" | "listed" | "soon";
};

/** The five program types, with where each leads and whether an intake is open. */
export function getProgramChart(today: string): ChartRow[] {
  return PROGRAM_TYPES.map((type) => {
    const link = programsLink({ type });
    const open = getPrograms().some((p) => p.type === type && nextIntake(p, today));
    const eventType = type === "workshop" || type === "cme";
    return {
      type,
      label: programTypeLabels[type].plural,
      href: link.count === 0 && eventType ? "/academy/workshops" : link.href,
      status: open ? "open" : link.count ? "listed" : "soon",
    };
  });
}

export type NavLink = { href: string; label: string; description: string };

/**
 * Academy menu links. While few programs are published: a program on its own
 * links to its page, and a type with several programs links to that group
 * (e.g. "Certifications · 2 courses · 4 weeks · Hybrid"). Then the rest.
 */
export function getAcademyLinks(today: string): NavLink[] {
  const list = getPrograms();
  const programLink = (p: Program): NavLink => {
    const intake = nextIntake(p, today);
    return {
      href: programHref(p),
      label: p.title,
      description: [
        p.duration,
        p.mode ? modeLabels[p.mode] : undefined,
        intake ? `Next intake ${formatDate(intake.start)}` : undefined,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  };
  const groupLink = (type: ProgramType, ps: Program[]): NavLink => ({
    href: programsLink({ type }).href,
    label: programTypeLabels[type].plural,
    description: [
      `${ps.length} courses`,
      ...new Set(ps.map((p) => p.duration).filter(Boolean)),
      ...new Set(ps.map((p) => (p.mode ? modeLabels[p.mode] : undefined)).filter(Boolean)),
    ].join(" · "),
  });
  const programLinks: NavLink[] =
    list.length < FILTERS_FROM
      ? PROGRAM_TYPES.map((type) => list.filter((p) => p.type === type))
          .filter((ps) => ps.length)
          .map((ps) => (ps.length === 1 ? programLink(ps[0]) : groupLink(ps[0].type, ps)))
      : [
          {
            href: "/academy?type=fellowship#programs",
            label: "Fellowships",
            description: "In-depth clinical programs.",
          },
          {
            href: "/academy?type=certification#programs",
            label: "Certifications",
            description: "Focused courses with an assessment.",
          },
          {
            href: "/academy?type=clinical-training#programs",
            label: "Clinical training",
            description: "Short, practice-led training sessions.",
          },
        ];
  return [
    {
      href: "/academy#programs",
      label: "All programs",
      description: "Eligibility, format and fees, up front.",
    },
    ...programLinks,
    {
      href: "/academy/workshops",
      label: "Workshops & CME",
      description: "Upcoming sessions and continuing education.",
    },
    {
      href: "/academy/enquire?intent=notify",
      label: "Get notified",
      description: "Hear first about new courses, workshops and CME.",
    },
  ];
}

// ---------- Blog ----------

export function getPosts() {
  return onlyVisible(blogPosts);
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

/** Same category first, then the rest; never the post itself. */
export function getRelatedPosts(post: BlogPost, limit = 3) {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  return [
    ...others.filter((p) => p.relatedService === post.relatedService),
    ...others.filter(
      (p) => p.relatedService !== post.relatedService && p.category === post.category,
    ),
    ...others.filter(
      (p) => p.relatedService !== post.relatedService && p.category !== post.category,
    ),
  ].slice(0, limit);
}

export function getPostsForService(serviceSlug: string, limit = 3) {
  return getPosts()
    .filter((p) => p.relatedService === serviceSlug)
    .slice(0, limit);
}

/** Words ÷ 200, rounded up — shown as "4 min read". */
export function readingMinutes(post: BlogPost) {
  const text = [
    post.intro,
    ...post.symptoms,
    ...post.sections.flatMap((s) => [
      s.heading,
      ...(s.body ?? []),
      ...(s.list ?? []),
      ...(s.items ?? []).flatMap((i) => [i.title, i.text]),
    ]),
    ...post.faqs.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return Math.max(2, Math.ceil(text.split(/\s+/).length / 200));
}

// ---------- Before-and-after cases ----------

/** Published cases that have both photos. */
export function getCases(): CareCase[] {
  return onlyVisible(cases).filter((c) => c.before && c.after);
}

export function getCasesForService(serviceSlug: string) {
  return getCases().filter((c) => c.relatedService === serviceSlug);
}

export function getCasesForPost(postSlug: string) {
  return getCases().filter((c) => c.relatedPosts?.includes(postSlug));
}
