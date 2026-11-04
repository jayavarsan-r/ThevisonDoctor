# The Vision Doctor — Academy & Eye Care website

Website for **The Vision Doctor Academy and Eye Care Services**, Kolathur, Chennai. The site has three modes:

- **Discover**: the dark-navy hero.
- **Learn**: the Academy, with a path selector, program explorer, compare tool and program pages.
- **Care**: a lighter patient section for appointment-based eye care.

Every published fact comes from `src/content/`. Anything unconfirmed is a draft and is **never rendered in production**.

## Stack

Next.js 16 (App Router, Cache Components, TypeScript strict) · Tailwind CSS 4 (CSS-first tokens) · Radix UI primitives · react-hook-form + zod · lucide-react · Resend (optional) · Playwright + axe-core.

## Getting started

```bash
pnpm install
cp .env.example .env.local      # edit as needed
pnpm dev                        # http://localhost:3000
```

Node ≥ 20.9 (current LTS recommended).

| Script                                               | What it does                                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm dev`                                           | Development server                                                                          |
| `pnpm build`                                         | Runs `content:check` (prebuild), then `next build`                                          |
| `pnpm start`                                         | Serves the production build                                                                 |
| `pnpm lint` / `pnpm typecheck` / `pnpm format:check` | ESLint, `tsc --noEmit`, Prettier                                                            |
| `pnpm content:check`                                 | Writes `CONTENT_TODO.md`; fails if published content is incomplete                          |
| `pnpm test:e2e:install`                              | One-off: downloads Playwright's Chromium                                                    |
| `pnpm test:e2e`                                      | Playwright smoke, interaction, content-rule and axe (WCAG 2.2 AA) tests, desktop and mobile |

## Environment

See `.env.example`. Summary:

| Variable                                                   | Purpose                                                                                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                     | Canonical URL for metadata, sitemap and JSON-LD                                                                                                           |
| `NEXT_PUBLIC_SHOW_DRAFTS`                                  | `true` **on preview deployments only**. It shows draft content with a "DRAFT — NOT VERIFIED" badge and makes the site `noindex` with robots `Disallow: /` |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`       | Optional analytics. Loaded only after the visitor accepts the consent banner                                                                              |
| `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL` | Email delivery of enquiries                                                                                                                               |
| `SHEETS_WEBHOOK_URL`                                       | Optional Google Apps Script webhook that appends enquiries to a sheet                                                                                     |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`               | Optional Cloudflare Turnstile on both forms                                                                                                               |

To build a preview locally beside the production build, run `NEXT_DIST_DIR=.next-preview NEXT_PUBLIC_SHOW_DRAFTS=true pnpm build`.

## Content workflow

All business facts live in `src/content/`:

| File                                                            | Contents                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.ts`                                                       | Name, phone, WhatsApp, email, office address (always labelled "appointments only, not a walk-in clinic"), emergency note                                                                                                                                               |
| `clinician.ts`                                                  | `NAME` and `CREDENTIAL` set the clinician's name, shown everywhere as "Dr. Subash V, O.D. (SWISS)" at his request. Use of "Dr." by optometrists is under legal review; change it here to update the whole site. `role` ("Optometrist") is used only in structured data |
| `programs.ts`, `events.ts`                                      | Academy programs and workshops/CME. The **Fellowship in Advanced Clinical Optometry** is published from the client's brochure; the other programs and both events are drafts, hidden in production                                                                     |
| `services.ts`                                                   | The six eye-care services (published). Fees, area, days and hours are empty and therefore hidden                                                                                                                                                                       |
| `faqs.ts`, `locations.ts`, `taxonomy.ts`, `legal.ts`, `todo.ts` | FAQs, locations, labels, legal review flag, and questions for the owner                                                                                                                                                                                                |

Rules the code enforces:

- Pages read content only through `src/lib/content.ts`. Its getters drop `status: "draft"` items and `verified: false` values unless preview mode is on.
- `pnpm content:check` runs before every build. It **fails** if a published program is missing eligibility, duration, mode or fee, or still contains placeholder text (a program without an intake is allowed: its page says "Dates to be announced" and the date is listed as a to-do). It also fails if a published before-and-after case lacks a photo or alt text. It also fails if a published event lacks a start or mode, if accreditation is "approved" without a named body, or if published copy uses a banned superlative ("best", "No. 1", "leading", "world-class", "guaranteed", "100%", "cure").
- Unknown or draft program and service URLs return a real **404** from `src/proxy.ts`, before rendering starts.

### How the Academy adapts to what is published

- **One to four programs** (now: the fellowship and two certifications): the Programs section shows everything at once with no filters or compare tool. The program with the soonest open intake is a full spotlight; the rest are grouped by type (for example "Certifications · 2 courses · 4 weeks · Hybrid · ₹10,000 each"). A "Coming next" strip names the categories not yet published.
- **Five or more** (`FILTERS_FROM` in `src/lib/program-view.ts`): the filterable explorer and compare tool appear automatically.
- **Links follow the same logic** (`programsLink()` in `src/lib/content.ts`). Menu items, speciality links, stage cards and the homepage program chart go straight to the program when only one matches, to its group (e.g. `/academy#certification-programs`) or the filtered explorer when several match, and to "Get notified" when none do. The Academy menu lists a lone program by name and groups several of one type into one entry.
- **Workshops & CME:** with no published events, the section explains both formats in the client's wording, next to a "Next dates — to be announced" card with WhatsApp and Get notified actions.

### Publishing a program

1. In `src/content/programs.ts`, replace every "To be confirmed" with confirmed facts. Set `mode`, add `fee` (`amountINR`, `gstNote` e.g. "+ GST", `includes`) and, once dates are confirmed, an `intakes` entry.
2. Set the accreditation status. Only set `approved` together with the accrediting `body` (and `points` for CE/CPD).
3. Set `status: "published"` and run `pnpm content:check`, then `pnpm build`.

`CONTENT_TODO.md` lists everything still missing, grouped by page. It is regenerated on every build, so don't edit it by hand.

## Client-supplied content

| Source                   | Used for                                                                                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fellowship brochure      | The published fellowship: title, 6 months, hybrid, Chennai, Aradhana Eye Care Hospital association, 10–15 learners (first batch), ₹30,000, first batch January 2027, who can apply, six key learning areas, highlights, assessment, certificate and the important note on scope |
| "Our Services" document  | Academy program-type descriptions, home consultation and screening copy, the definition of super-speciality eye care (now its own group on Eye Care), and the mission statement on About                                                                                        |
| Founder portrait         | Homepage clinician feature, About hero and the clinician cards                                                                                                                                                                                                                  |
| "Certificate Course.pdf" | The two published certifications: Advanced Clinical Examination & Ocular Disease Screening (with Aradhana Eye Care Hospital) and Retinal Imaging & Diagnostics — 4 weeks, hybrid, ₹10,000, 10–15 participants, eligibility, what you'll learn and certificate wording           |
| WhatsApp, 26 Oct 2026    | Five partner logos for the brand strip; two before-and-after photo pairs (ptosis with crutch glasses, squint with vision therapy); "36,000+ patients seen" for the clinician profile                                                                                            |

Facts the brochure does not give are not invented. These include the exact start date, schedule, apply-by date, what the fee includes, and GST. Accreditation is shown as "Certificate issued by The Vision Doctor Academy (no government accreditation)", as confirmed in the 29 Oct 2026 meeting. They are listed in `CONTENT_TODO.md`.

## Blog

`/blog` and `/blog/[slug]` publish the 14 eye-health articles from the client's "BLOGS" document (`src/content/blog.ts`).

- **SEO:** each article has a keyword-led H1, a `<title>` of 60 characters or fewer, a meta description of 160 characters or fewer, a canonical URL, its own share image (`opengraph-image`), and `BlogPosting` + `MedicalCondition` + `FAQPage` + `BreadcrumbList` structured data. Articles are in the sitemap. `pnpm content:check` fails the build if a title or description runs long, or if an article uses a banned superlative.
- **Internal links:** every article links to its related service, and service pages and the homepage link back to articles. This helps both readers and search.
- **Images:** the source document's images came from third-party sites (some watermarked) or showed patients' eyes, so each article uses a brand illustration (`src/components/blog/BlogCover.tsx`).
- **Safety:** articles are general information. Each one carries the hospital-emergency note, and conditions with urgent warning signs also show an "Urgent" callout.

## Placeholders to replace

- **Brand collaborations:** `src/content/partners.ts` lists six partners, including VV Vision Clinic (Nov 2026). Their logos were cleaned up from WhatsApp images (background removed, trimmed) in `public/images/partners/`; original files would be sharper. The strip can be paused with its button and stands still under reduced motion.
- **Prism-glasses case:** `src/content/cases.ts` has it as a draft until its photos arrive.
- **Social profiles:** LinkedIn and Facebook are live. YouTube and Instagram are hidden in production until their profile URLs are pasted into `site.social` (`src/content/site.ts`) with `confirmed: true`, which also adds them to structured data.
- **GST and Udyam (MSME):** add them to `site.registrations` and they appear in the footer.
- **Brand logo:** `public/images/brand/` holds the logo from "Vision Doctor Final Logo.zip" (stacked, horizontal and the emblem). The header and footer use the emblem with the name as live text; `src/app/icon.png` and `apple-icon.png` are generated from it. Google Search Console verification is set by `site.googleSiteVerification`.

## Enquiries

`POST /api/enquiry` validates with the same zod schemas as the forms (`src/lib/validation.ts`). The forms collect the minimum data and never ask for medical history, symptoms or date of birth.

- **Delivery:** Resend email and/or the Sheets webhook. If **no channel is configured**, development logs the enquiry to the console and production **refuses it with 503**. The form then tells the visitor to use WhatsApp or phone, so no lead is lost silently. Configure at least one channel before launch.
- **Spam protection:** a hidden honeypot (filled submissions get a fake success and are not delivered), a 16 KB body limit, a per-IP rate limit (6 per 10 minutes, kept in memory per server instance), and optional Turnstile.
- **References:** each enquiry gets a reference like `TVD-A-261013-K7QM` (A = Academy, C = Care). It appears on the thank-you page and in the pre-filled "Continue on WhatsApp" message.

Example Apps Script for `SHEETS_WEBHOOK_URL` (deploy it as a web app):

```js
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActive().getSheetByName("Enquiries");
  sheet.appendRow([new Date(), data.ref, data.kind, JSON.stringify(data.fields)]);
  return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON);
}
```

## Analytics and privacy

- `track(event, params)` in `src/lib/analytics.ts` sends nothing until the visitor accepts the consent banner, and drops any parameter that could carry personal data.
- The consent banner appears only when an analytics ID is configured.
- Events tracked: `path_select`, `filter_change`, `compare_open`, `enquiry_start`, `enquiry_submit`, `enquiry_error`, `generate_lead` (thank-you page, once per reference), `whatsapp_click`, `phone_click`, `email_click`, `pincode_check`.

## Hero video (optional)

Add `public/media/hero.webm` and/or `hero.mp4`, plus `hero-poster.avif`. Use no audio and show no patients. The video starts loading only after `requestIdleCallback`, and is skipped for reduced motion, Save-Data and viewports narrower than 640px, where the poster is shown instead. It always has a Pause/Play button. Without these files the hero shows the optical-rings artwork.

## Photography: art direction

The founder portrait (`public/images/dr-subash-v.jpg`) is set through `clinician.photo` and served by `next/image` as AVIF/WebP. Any remaining `PhotoSlot` placeholder states the photo it needs, for example `PHOTO · FOUNDER PORTRAIT · 4:5 · NATURAL LIGHT`. To replace one, put the file in `public/images/` and pass its path through content.

- Real people and real equipment, never stock eyeballs, AI faces or generic hospital corridors.
- Natural window light, a slightly cool grade and shallow depth of field.
- Consistent crops: portraits 4:5, scenes 4:3.
- **Written consent** from everyone pictured.
- **Before-and-after cases** (`src/content/cases.ts`) are shown at the client's request on Eye Care, the matching service pages, the homepage care band and the squint article. Photos are cropped to the eye area (12:5) with metadata removed, each has descriptive alt text, and every set carries a plain-language caveat. Set `consentConfirmed: true` only once the patient's written permission is on file; until then each case is listed in `CONTENT_TODO.md`.

## Design system ("The Vision Lab")

- The client palette is applied exactly. Tailwind's default colours are removed (`src/styles/globals.css`), so only approved tokens exist.
- Contrast rules: white text never sits on orange, because orange buttons use navy `#0B1736` text; orange text uses `#C2410C`; chips use `#1E3A8A` on `#BFDBFE`.
- Type: Newsreader for display and H1/H2, Instrument Sans for UI and body, IBM Plex Mono for eyebrows and spec labels. Mono eyebrows with an orange dot (`● THE ACADEMY`) are the brand signature.
- The optical-rings motif appears in the hero, behind the path selector and on the 404 page. Sections run into each other without dividing lines.
- Motion is CSS-first. Reveals are once per element. The homepage path selector uses `motion` (Framer Motion) through `LazyMotion` + `domAnimation` for its "focus pull" switch; its ambient loops pause when the section is off-screen or the tab is hidden. Under `prefers-reduced-motion` the reveals, ring rotation, travelling dot, idle nudge and video are switched off, and the path switch becomes a 150 ms crossfade.

## Quality checks (last run)

- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm build`: all clean.
- `pnpm test:e2e`: 256 passed, 9 skipped (device-specific tests). This covers axe WCAG 2.2 AA scans of every route (including the fellowship page), the 404 page and the form error state; content-rule checks in production (no drafts, no unverified credentials, no banned claims, a hospital note on every service page, the fellowship's confirmed facts); and the path-selector acceptance checks (heights, keyboard, swipe, `?path=care` with no flash, reduced motion, axe in both states).
- First-load JavaScript (gzip, measured before the blog, certifications and partner strip were added): home ≈ 243 KB (the path selector's Framer Motion adds about 44 KB), `/academy` ≈ 187 KB, fellowship page ≈ 190 KB, `/eye-care` ≈ 229 KB. The Next.js and React baseline accounts for about 130 KB of each. CLS measured ≤ 0.005 locally. The H1 is text, so it is the LCP element.

## Assumptions: missing parts of the brief

The build prompt arrived cut off partway through **§12 (Forms)**, so §12.1–§20 were never received. These parts were built with conservative defaults and should be checked against the full brief:

| Area                         | What was assumed                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §12 Form fields              | **Academy:** enquiry type, program or specialities, name, phone, optional email, career stage, optional qualification, organisation (institutions only), preferred contact, optional message, consent. **Care:** service, who it's for (with parent/guardian confirmation for a child), preferred place, area, optional pincode, optional preferred time, name, phone, optional email, preferred contact, optional non-medical message, consent |
| §13 WhatsApp pre-fills       | Short templates per context in `src/lib/whatsapp.ts`                                                                                                                                                                                                                                                                                                                                                                                            |
| Analytics events and consent | As listed above. Consent is required for GA4 and for Plausible                                                                                                                                                                                                                                                                                                                                                                                  |
| SEO / JSON-LD                | Organization, WebSite, Person (verified credentials only), Course + CourseInstance, Event, Service with a MedicalBusiness provider, FAQPage, BreadcrumbList. The street address is left out of structured data                                                                                                                                                                                                                                  |
| §17 Budgets                  | No numbers were received. The figures above are what was measured                                                                                                                                                                                                                                                                                                                                                                               |
| §20 Phases                   | Built in this order: setup and content layer, layout shell, homepage, Academy, Eye Care, forms and API, legal and SEO, then tests                                                                                                                                                                                                                                                                                                               |

Deliberate deviations:

- "Book eye care" in the header shows from `xl` rather than `lg`, because it doesn't fit beside the full navigation at 1024px.
- On Eye Care pages the header's "Enquire now" uses the outline style, so the page's own orange "Book an eye appointment" stays the only accent in view.
- Path selector: following client feedback, the Learn visual is a **program chart** (the five program types set like a vision chart, with a stepping focus line and live Open / Coming soon status), not concentric rings, so it no longer echoes the hero. The sliding indicator springs on `x` instead of using `layoutId`, and swipe uses pointer events instead of Framer `drag`. Both `layoutId` and `drag` need the larger `domMax` bundle; this keeps `domAnimation` as the brief asked. Both panels stay mounted (inactive one `inert`) instead of using `AnimatePresence`, so the server HTML is complete, the height never jumps and `?path=care` can be restored before hydration. The optional sticky mobile switch was not added, because it would collide with the sticky header.
- The service tiles' "Learn more" links carry a screen-reader suffix naming the service.

## Before launch

1. Work through `CONTENT_TODO.md` with the owner.
2. Have a qualified lawyer review the five legal pages, then set `legal.reviewed = true` in `src/content/legal.ts`. This removes the draft banners and allows indexing.
3. Set `NEXT_PUBLIC_SITE_URL` and at least one enquiry delivery channel, then send a test enquiry.
4. Decide on the "Dr." prefix (`clinician.displayName`).
# ThevisonDoctor
