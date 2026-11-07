import { ArrowRight, Clock, Info, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, postHref } from "@/components/blog/BlogCard";
import { BlogCover } from "@/components/blog/BlogCover";
import { CaseGallery, CasesNote } from "@/components/care/CaseGallery";
import { HospitalInsteadNote } from "@/components/care/HospitalInsteadNote";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site, siteUrl } from "@/content/site";
import { blogCategoryLabels } from "@/content/taxonomy";
import type { BlogPost } from "@/content/types";
import {
  getCasesForPost,
  getPost,
  getPosts,
  getRelatedPosts,
  getService,
  readingMinutes,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  const slugs = getPosts().map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: "__no-published-posts__" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: postHref(post) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      section: blogCategoryLabels[post.category],
      tags: post.keywords,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

const sectionId = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function articleSchema(post: BlogPost) {
  const url = `${siteUrl}${postHref(post)}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.published,
    dateModified: post.published,
    inLanguage: "en-IN",
    keywords: post.keywords.join(", "),
    image: `${url}/opengraph-image`,
    articleSection: blogCategoryLabels[post.category],
    author: { "@type": "Organization", name: site.name, url: siteUrl },
    publisher: { "@type": "Organization", name: site.name, url: siteUrl },
    about: {
      "@type": "MedicalCondition",
      name: post.condition,
      signOrSymptom: post.symptoms.map((s) => ({ "@type": "MedicalSignOrSymptom", name: s })),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const minutes = readingMinutes(post);
  const service = getService(post.relatedService);
  const related = getRelatedPosts(post);
  const cases = getCasesForPost(post.slug);
  const toc = [
    ...post.sections.map((s) => ({ id: sectionId(s.heading), label: s.heading })),
    ...(cases.length ? [{ id: "from-our-practice", label: "Before and after" }] : []),
    { id: "faq", label: "Frequently asked questions" },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post),
          faqSchema(
            post.faqs.map((f, i) => ({
              id: `${post.slug}-${i}`,
              audience: "patient",
              q: f.q,
              a: f.a,
              status: "published",
            })),
          ),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: postHref(post) },
          ]),
        ]}
      />

      <article>
        <header className="bg-blue-50">
          <div className="container-page flex flex-col gap-6 pt-10 pb-12 md:pt-14 md:pb-16">
            <Breadcrumb
              items={[{ name: "Blog", href: "/blog" }, { name: blogCategoryLabels[post.category] }]}
            />
            <h1 className="max-w-[26ch] font-display text-h1 font-medium text-ink">{post.title}</h1>
            <p className="measure-lead text-lead text-slate-600">{post.intro}</p>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-meta text-slate-600">
              <span>By {site.shortName}</span>
              <span>
                Published <time dateTime={post.published}>{formatDate(post.published)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden strokeWidth={1.5} className="size-4" />
                {minutes} min read
              </span>
            </p>
          </div>
          <div className="container-page">
            <BlogCover
              cover={post.cover}
              category={post.category}
              className="aspect-[16/9] w-full translate-y-10 rounded-[24px] sm:aspect-[21/8] md:translate-y-14"
            />
          </div>
        </header>

        <div className="container-page grid gap-12 pt-20 pb-16 md:pt-28 md:pb-24 lg:grid-cols-12 lg:gap-12">
          <div className="flex min-w-0 flex-col gap-10 lg:col-span-8">
            {post.urgentNote ? (
              <div
                role="note"
                className="flex gap-3 rounded-card border-2 border-orange-700/60 bg-white p-5 text-[15px] text-ink"
              >
                <TriangleAlert
                  aria-hidden
                  strokeWidth={1.5}
                  className="mt-0.5 size-5 shrink-0 text-orange-700"
                />
                <p>
                  <strong className="font-semibold">Urgent: </strong>
                  {post.urgentNote}
                </p>
              </div>
            ) : null}

            {post.sections.map((s) => (
              <section
                key={s.heading}
                aria-labelledby={sectionId(s.heading)}
                className="flex flex-col gap-4"
              >
                <h2
                  id={sectionId(s.heading)}
                  className="scroll-mt-28 font-display text-[clamp(1.6rem,2.6vw,2rem)] leading-tight font-medium text-ink"
                >
                  {s.heading}
                </h2>
                {s.body?.map((p) => (
                  <p key={p} className="measure text-[17px] leading-[1.7] text-slate-600">
                    {p}
                  </p>
                ))}
                {s.list ? (
                  <ul className="flex flex-col gap-2.5">
                    {(s.list[0] === "__SYMPTOMS__" ? post.symptoms : s.list).map((item) => (
                      <li key={item} className="flex gap-3 text-[17px] leading-[1.6] text-ink">
                        <span
                          aria-hidden
                          className="mt-[11px] size-1.5 shrink-0 rounded-full bg-orange-500"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {s.items ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {s.items.map((it) => (
                      <li key={it.title} className="rounded-card border border-line bg-white p-5">
                        <h3 className="text-[17px] font-semibold text-ink">{it.title}</h3>
                        <p className="mt-1.5 text-[15px] text-slate-600">{it.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {cases.length ? (
              <section aria-labelledby="from-our-practice" className="flex flex-col gap-4">
                <h2
                  id="from-our-practice"
                  className="scroll-mt-28 font-display text-[clamp(1.6rem,2.6vw,2rem)] leading-tight font-medium text-ink"
                >
                  From our practice: before and after
                </h2>
                <CaseGallery
                  cases={cases}
                  serviceTitles={Object.fromEntries(
                    cases.map((c) => [c.relatedService, getService(c.relatedService)?.title ?? ""]),
                  )}
                />
                <CasesNote />
              </section>
            ) : null}

            <section aria-labelledby="faq" className="flex flex-col gap-4">
              <h2
                id="faq"
                className="scroll-mt-28 font-display text-[clamp(1.6rem,2.6vw,2rem)] leading-tight font-medium text-ink"
              >
                Frequently asked questions
              </h2>
              <Accordion
                items={post.faqs.map((f, i) => ({ id: `faq-${i}`, title: f.q, content: f.a }))}
              />
            </section>

            <p className="flex gap-2.5 rounded-card bg-blue-50 p-4 text-meta text-slate-600">
              <Info
                aria-hidden
                strokeWidth={1.5}
                className="mt-0.5 size-4 shrink-0 text-blue-900"
              />
              <span>
                This article is general information, not a diagnosis or personal medical advice. See
                our{" "}
                <Link href="/medical-disclaimer" className="link">
                  medical information disclaimer
                </Link>
                .
              </span>
            </p>

            <HospitalInsteadNote id="post-hospital" />
          </div>

          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <nav
                aria-label="On this page"
                className="hidden rounded-card border border-line p-6 lg:block"
              >
                <p className="eyebrow text-slate-600">On this page</p>
                <ol className="mt-3 flex flex-col gap-2">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-[15px] text-ink hover:text-blue-600">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div data-surface="dark" className="flex flex-col gap-4 rounded-card bg-navy-950 p-6">
                <p className="eyebrow text-blue-300">Eye care in Chennai</p>
                <p className="font-display text-[24px] leading-tight text-white">
                  {service
                    ? `Need help with this? Book: ${service.title.toLowerCase()}.`
                    : "Book an eye appointment."}
                </p>
                <p className="text-[15px] text-slate-300">
                  By appointment, at confirmed locations or at your home. We confirm the place, time
                  and fee first.
                </p>
                <Button
                  href={service ? `/eye-care/${service.slug}#book` : "/eye-care#book"}
                  variant="light"
                  arrow
                  className="w-full"
                >
                  Book an eye appointment
                </Button>
                <Button
                  href={buildWhatsAppLink("care")}
                  variant="ghost-dark"
                  icon={<WhatsAppIcon />}
                  className="w-full"
                  data-wa-context="care"
                >
                  WhatsApp us
                </Button>
                {service ? (
                  <Link
                    href={`/eye-care/${service.slug}`}
                    className="inline-flex items-center gap-1 text-meta font-semibold link-dark"
                  >
                    About {service.title.toLowerCase()}
                    <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="related-posts" className="bg-blue-50 py-16 md:py-20">
          <div className="container-page">
            <h2
              id="related-posts"
              className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-medium text-ink"
            >
              Related articles
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={p} minutes={readingMinutes(p)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
