import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { blogCategoryLabels } from "@/content/taxonomy";
import type { BlogPost } from "@/content/types";
import { cn } from "@/lib/cn";
import { BlogCover } from "./BlogCover";

export const postHref = (p: Pick<BlogPost, "slug">) => `/blog/${p.slug}`;

/** Article card — the whole card is clickable through the title link. */
export function BlogCard({
  post,
  minutes,
  featured = false,
  headingLevel = 3,
}: {
  post: BlogPost;
  minutes: number;
  featured?: boolean;
  headingLevel?: 2 | 3;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white transition-[border-color,translate] duration-200 ease-brand hover:-translate-y-0.5 hover:border-blue-200 motion-reduce:hover:translate-y-0",
        featured && "lg:grid lg:grid-cols-2",
      )}
    >
      <BlogCover
        cover={post.cover}
        category={post.category}
        className={cn("aspect-[16/10] w-full", featured && "lg:aspect-auto lg:h-full lg:min-h-80")}
      />
      <div
        className={cn("flex flex-1 flex-col gap-3 p-6", featured && "lg:justify-center lg:p-10")}
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 eyebrow text-blue-900">
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
            {blogCategoryLabels[post.category]}
          </span>
          <span className="text-slate-600">{minutes} min read</span>
        </p>
        <H
          className={cn(
            "font-semibold text-ink",
            featured
              ? "font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-medium"
              : "text-[19px] leading-snug",
          )}
        >
          <Link
            href={postHref(post)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </H>
        <p className={cn("text-[15px] text-slate-600", !featured && "line-clamp-3")}>
          {post.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[15px] font-semibold text-blue-600">
          Read article
          <ArrowRight
            aria-hidden
            strokeWidth={1.5}
            className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </span>
      </div>
      {/* Keyboard focus ring for the whole card (the link's own ring is hidden). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px] ring-blue-600 ring-offset-2 group-has-[a:focus-visible]:ring-2"
      />
    </article>
  );
}
