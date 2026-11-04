import type { Metadata } from "next";
import { BlogCard, postHref } from "@/components/blog/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site, siteUrl } from "@/content/site";
import { blogCategoryLabels } from "@/content/taxonomy";
import type { BlogCategory } from "@/content/types";
import { getPosts, readingMinutes } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: { absolute: "Eye Health Blog: Symptoms, Causes & Care | The Vision Doctor" },
  description:
    "Clear guides to common eye conditions — dry eye, glaucoma, cataract, keratoconus, myopia in children, lazy eye and digital eye strain — from The Vision Doctor, Chennai.",
  keywords: [
    "eye health blog",
    "eye conditions",
    "eye symptoms",
    "optometrist in Chennai",
    "eye care tips",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Eye Health Blog · The Vision Doctor",
    description: "Practical guides to common eye conditions, their symptoms and care.",
  },
};

const FEATURED = "myopia-control-children-symptoms-management";
const CATEGORY_LEADS: Record<BlogCategory, string> = {
  "eye-diseases":
    "Conditions that affect the health of the eye — what to look out for, and why early checks matter.",
  "vision-disorders":
    "Problems with focusing, eye teaming and vision development — and how they are managed.",
};

export default function BlogPage() {
  const posts = getPosts();
  const featured = posts.find((p) => p.slug === FEATURED) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);
  const groups = (Object.keys(blogCategoryLabels) as BlogCategory[]).map((c) => ({
    category: c,
    posts: rest.filter((p) => p.category === c),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "The Vision Doctor — Eye Health Blog",
            url: `${siteUrl}/blog`,
            publisher: { "@type": "Organization", name: site.name, url: siteUrl },
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${siteUrl}${postHref(p)}`,
              datePublished: p.published,
            })),
          },
        ]}
      />

      <PageHero
        tone="tint"
        eyebrow="Eye health blog"
        title="Eye health, explained clearly."
        lead="Practical guides to common eye conditions — their symptoms, causes and care — from dry eye and glaucoma to myopia in children and digital eye strain."
      />

      {featured ? (
        <section aria-label="Featured article" className="bg-blue-50 pb-14 md:pb-20">
          <div className="container-page">
            <BlogCard
              post={featured}
              minutes={readingMinutes(featured)}
              featured
              headingLevel={2}
            />
          </div>
        </section>
      ) : null}

      {groups.map((g) =>
        g.posts.length ? (
          <section
            key={g.category}
            aria-labelledby={`blog-${g.category}`}
            className="bg-white py-14 md:py-20"
          >
            <div className="container-page">
              <SectionHeader
                id={`blog-${g.category}`}
                label={`${g.posts.length} articles`}
                title={blogCategoryLabels[g.category]}
                lead={CATEGORY_LEADS[g.category]}
                layout="split"
              />
              <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {g.posts.map((p) => (
                  <li key={p.slug}>
                    <BlogCard post={p} minutes={readingMinutes(p)} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null,
      )}

      <section aria-labelledby="blog-cta" className="bg-white pb-16 md:pb-24">
        <div className="container-page">
          <div
            data-surface="dark"
            className="flex flex-col gap-6 rounded-[24px] bg-navy-950 p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="flex max-w-[44rem] flex-col gap-3">
              <h2
                id="blog-cta"
                className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-medium text-white"
              >
                Noticed any of these symptoms?
              </h2>
              <p className="text-lead text-slate-300">
                Book an eye appointment in Chennai. We confirm the place, time and fee before your
                visit.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/eye-care#book" variant="accent" arrow>
                Book an eye appointment
              </Button>
              <Button
                href={buildWhatsAppLink("care")}
                variant="ghost-dark"
                icon={<WhatsAppIcon />}
                data-wa-context="care"
              >
                WhatsApp us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
