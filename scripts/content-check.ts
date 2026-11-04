/**
 * pnpm content:check (BUILD_PROMPT §9.4) — runs automatically before `build`.
 *
 * 1. Lists every draft item and unverified field into CONTENT_TODO.md, grouped by page.
 * 2. Exits with code 1 if published content is invalid:
 *    - a published program lacks eligibility, duration, mode or fee
 *      (a missing intake is a to-do: the page says "Dates to be announced")
 *    - a published before-and-after case lacks a photo or alt text
 *    - a published program still contains placeholder text ("To be confirmed", "[Draft]", "TBC")
 *    - a program claims approved accreditation without naming the body
 *    - a published event lacks start or mode
 *    - published copy uses a banned superlative ("best", "No. 1", "leading", …)
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { blogPosts } from "../src/content/blog";
import { cases } from "../src/content/cases";
import { clinicians } from "../src/content/clinician";
import { events } from "../src/content/events";
import { faqs } from "../src/content/faqs";
import { locations } from "../src/content/locations";
import { partners } from "../src/content/partners";
import { programs } from "../src/content/programs";
import { services } from "../src/content/services";
import { site } from "../src/content/site";
import { contentNotes } from "../src/content/todo";

type Todo = { page: string; item: string; note: string };

const todos: Todo[] = [];
const errors: string[] = [];
const add = (page: string, item: string, note: string) => todos.push({ page, item, note });

const PLACEHOLDER = /to be confirmed|\[draft\]|\bTBC\b/i;
const BANNED =
  /\b(best|no\.?\s?1|number one|leading|world[- ]class|guarantee[ds]?|100\s?%|cure[sd]?)\b/i;

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

function checkBanned(label: string, value: unknown) {
  for (const s of strings(value)) {
    const m = s.match(BANNED);
    if (m) errors.push(`${label}: banned wording "${m[0]}" in "${s.slice(0, 80)}"`);
  }
}

// ---------- Programs ----------
for (const p of programs) {
  if (p.status === "draft") {
    add(
      "Academy › Programs",
      p.title,
      `Draft program \`${p.slug}\` — hidden in production until every detail is confirmed.`,
    );
    continue;
  }
  const missing: string[] = [];
  if (!p.eligibility) missing.push("eligibility");
  if (!p.duration) missing.push("duration");
  if (!p.mode) missing.push("mode");
  if (!p.fee) missing.push("fee");
  if (!p.intakes?.length) {
    add(
      "Academy › Programs",
      `${p.title} — intake dates`,
      'No intake yet; the page says "Dates to be announced". Add the start date (and apply-by date) in src/content/programs.ts.',
    );
  }
  if (missing.length)
    errors.push(`Published program "${p.slug}" is missing: ${missing.join(", ")}`);
  for (const s of strings(p)) {
    if (PLACEHOLDER.test(s)) {
      errors.push(
        `Published program "${p.slug}" still contains placeholder text: "${s.slice(0, 80)}"`,
      );
      break;
    }
  }
  if (p.accreditation.status === "approved" && !p.accreditation.body) {
    errors.push(
      `Program "${p.slug}" claims approved accreditation without naming the accrediting body`,
    );
  }
  checkBanned(`Program "${p.slug}"`, p);
}

// ---------- Events ----------
for (const e of events) {
  if (e.status === "draft") {
    add(
      "Academy › Workshops & CME",
      e.title,
      `Draft event \`${e.slug}\` — confirm topic, date, format and venue.`,
    );
    continue;
  }
  if (!e.start) errors.push(`Published event "${e.slug}" is missing start`);
  if (!e.mode) errors.push(`Published event "${e.slug}" is missing mode`);
  if (e.accreditation.status === "approved" && !e.accreditation.body) {
    errors.push(
      `Event "${e.slug}" claims approved accreditation without naming the accrediting body`,
    );
  }
  checkBanned(`Event "${e.slug}"`, e);
}

// ---------- Services ----------
for (const s of services) {
  const page = `Eye Care › ${s.title}`;
  if (s.status === "draft") add(page, s.title, `Draft service \`${s.slug}\`.`);
  if (!s.feeDisplay)
    add(page, "Fee", 'Not supplied — page shows "Confirmed when we call — before you book."');
  if (!s.whereWhen) add(page, "Where and when", "Not supplied — page shows the default sentence.");
  for (const d of s.details ?? []) {
    if (!d.verified || !d.value)
      add(page, d.label, "Draft field — hidden until supplied and verified.");
  }
  if (s.status === "published") checkBanned(`Service "${s.slug}"`, s);
}

// ---------- FAQs ----------
for (const f of faqs) {
  if (f.status === "draft")
    add(
      f.audience === "learner" ? "Academy › FAQ" : "Eye Care › FAQ",
      f.q,
      "Draft FAQ — confirm the answer.",
    );
  else checkBanned(`FAQ "${f.id}"`, f);
}

// ---------- Clinician ----------
for (const c of clinicians) {
  if (!c.qualificationsLine.verified) {
    add(
      "About",
      "Qualifications line",
      `"${c.qualificationsLine.value}" — unverified; hidden in production.`,
    );
  }
  for (const q of c.qualifications) {
    if (!q.verified) {
      add(
        "About",
        `Qualification: ${q.value.degree}`,
        "Unverified. Supply degree, institution and year, with proof.",
      );
    }
  }
  if (!c.registration)
    add("About", "Registration", "Registration council and number not supplied.");
  else if (!c.registration.verified)
    add("About", "Registration", "Registration number unverified.");
  if (!c.experience.length)
    add(
      "About",
      "Clinical experience",
      "Hospitals and clinics previously worked at are not supplied.",
    );
  for (const x of c.experience)
    if (!x.verified) add("About", `Experience: ${x.value.place}`, "Unverified.");
  if (!c.teachingApproach.verified)
    add("About", "Teaching approach", "Draft placeholder — to be written with the clinician.");
  if (!c.photo) add("About", "Portrait", "No portrait yet — PhotoSlot placeholder shown.");
  checkBanned(`Clinician "${c.id}"`, {
    summary: c.summary,
    expertise: c.expertise,
    stats: c.stats,
  });
}

// ---------- Site & locations ----------
if (!site.academy.certificateStatement.verified) {
  add(
    "Academy",
    "Certificates and accreditation",
    `"${site.academy.certificateStatement.value}" — draft; hidden in production.`,
  );
}
if (!site.responseTime)
  add(
    "Sitewide",
    "Response time",
    'Confirm a response-time promise for enquiries (e.g. "within one working day") and set `site.responseTime`. Hidden while empty.',
  );
if (!locations.consultationLocations.length) {
  add("Eye Care", "Consultation locations", "None listed — the default sentence is shown.");
}
for (const l of locations.consultationLocations) {
  if (l.status === "draft") add("Eye Care", `Location: ${l.name}`, "Draft location.");
}
if (!locations.homeVisitPincodes.length) {
  add(
    "Eye Care › Home eye consultation",
    "Home-visit pincodes",
    "None listed — the pincode checker is hidden.",
  );
}
checkBanned("Site", { description: site.description });

// ---------- Blog ----------
const seenSlugs = new Set<string>();
for (const p of blogPosts) {
  if (seenSlugs.has(p.slug)) errors.push(`Duplicate blog slug "${p.slug}"`);
  seenSlugs.add(p.slug);
  if (p.status === "draft") {
    add("Blog", p.title, `Draft article \`${p.slug}\`.`);
    continue;
  }
  if (p.seoTitle.length > 60)
    errors.push(`Blog "${p.slug}": seoTitle is ${p.seoTitle.length} characters (max 60)`);
  if (p.description.length > 160) {
    errors.push(`Blog "${p.slug}": description is ${p.description.length} characters (max 160)`);
  }
  checkBanned(`Blog "${p.slug}"`, p);
}
add(
  "Blog",
  "Author and medical review",
  "Articles are published under The Vision Doctor. Confirm whether to credit an author or medical reviewer by name (helps search ranking for health content).",
);

// ---------- Social & partners ----------
for (const sp of site.social) {
  if (!sp.confirmed) {
    add(
      "Sitewide",
      `${sp.label} link`,
      `Replace the placeholder (${sp.url}) with the clinic's ${sp.label} profile URL in src/content/site.ts and set confirmed: true. The icon is hidden until then.`,
    );
  }
}
if (!partners.length) {
  add("Home", "Brand collaborations", "No partner logos — the logo strip is hidden.");
}

// ---------- Before-and-after cases ----------
for (const c of cases) {
  const page = "Eye Care › Before and after";
  if (c.status === "draft") {
    add(
      page,
      `${c.condition} — ${c.treatment}`,
      "Draft case — hidden until the before and after photos are supplied.",
    );
    continue;
  }
  if (!c.before || !c.after)
    errors.push(`Published case "${c.id}" needs a before and an after photo`);
  for (const ph of [c.before, c.after]) {
    if (ph && ph.alt.trim().length < 10) errors.push(`Case "${c.id}": photo alt text is missing`);
  }
  if (!c.consentConfirmed) {
    add(
      page,
      `${c.condition} — ${c.treatment}: patient consent`,
      "Confirm the patient gave written permission for these photos to be published, then set consentConfirmed: true in src/content/cases.ts.",
    );
  }
  checkBanned(`Case "${c.id}"`, {
    condition: c.condition,
    treatment: c.treatment,
    summary: c.summary,
  });
}

for (const c of clinicians) {
  add(
    "About",
    `"${c.credential}" after the name`,
    `Shown with the name everywhere ("${c.displayName}") at the clinician's request. Keep a copy of the O.D. certificate (institution and year) on file, and supply it so the full qualifications line can be verified.`,
  );
}

for (const n of contentNotes) todos.push(n);

// ---------- Write CONTENT_TODO.md ----------
const order = [
  "Sitewide",
  "Home",
  "Academy",
  "Academy › Programs",
  "Academy › Workshops & CME",
  "Academy › FAQ",
  "Eye Care",
  "About",
  "Legal",
];
const pages = [...new Set(todos.map((t) => t.page))].sort((a, b) => {
  const ia = order.findIndex((o) => a === o);
  const ib = order.findIndex((o) => b === o);
  const ra = ia === -1 ? order.findIndex((o) => a.startsWith(o)) + 0.5 : ia;
  const rb = ib === -1 ? order.findIndex((o) => b.startsWith(o)) + 0.5 : ib;
  return ra - rb || a.localeCompare(b);
});

const lines: string[] = [
  "# Content to-do",
  "",
  "_Generated by `pnpm content:check` (runs before every build). Do not edit by hand — update the files in `src/content/` and re-run._",
  "",
  "Everything below is either a draft, unverified, or missing. Drafts are hidden in production and shown with a",
  "**DRAFT — NOT VERIFIED** badge when `NEXT_PUBLIC_SHOW_DRAFTS=true`.",
  "",
  `**${todos.length} open items.**`,
  "",
];
for (const page of pages) {
  lines.push(`## ${page}`, "");
  for (const t of todos.filter((x) => x.page === page))
    lines.push(`- [ ] **${t.item}** — ${t.note}`);
  lines.push("");
}
writeFileSync(join(process.cwd(), "CONTENT_TODO.md"), lines.join("\n"));

console.log(`content:check — ${todos.length} open content items written to CONTENT_TODO.md`);
if (errors.length) {
  console.error(`\ncontent:check failed with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("content:check — published content is valid.");
