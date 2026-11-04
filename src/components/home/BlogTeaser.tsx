import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/content/types";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** "From the eye health blog" — three articles on the homepage. */
export function BlogTeaser({ posts }: { posts: { post: BlogPost; minutes: number }[] }) {
  if (!posts.length) return null;
  return (
    <section aria-labelledby="blog-teaser-title" className="bg-white pt-20 pb-4 md:pt-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            id="blog-teaser-title"
            label="Eye health blog"
            title="Understand your eyes."
            lead="Plain-language guides to common eye conditions — what to look out for, and when to get checked."
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-1 font-semibold link md:mb-2"
          >
            All articles <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map(({ post, minutes }) => (
            <li key={post.slug}>
              <BlogCard post={post} minutes={minutes} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
