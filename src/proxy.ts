import { NextResponse, type NextRequest } from "next/server";
import { blogPosts } from "@/content/blog";
import { programs } from "@/content/programs";
import { services } from "@/content/services";
import { onlyVisible } from "@/lib/drafts";

/**
 * Cache Components streams dynamic routes, so a page-level notFound() for an
 * unknown slug would arrive after a 200 status. This rejects unknown or draft
 * program/service slugs before rendering so they get a real 404.
 */
const programSlugs = new Set(onlyVisible(programs).map((p) => p.slug));
const serviceSlugs = new Set(onlyVisible(services).map((s) => s.slug));
const postSlugs = new Set(onlyVisible(blogPosts).map((p) => p.slug));

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const program = pathname.match(/^\/academy\/programs\/([^/]+)\/?$/);
  const service = pathname.match(/^\/eye-care\/([^/]+)\/?$/);
  const post = pathname.match(/^\/blog\/([^/]+)\/?$/);
  const known = program
    ? programSlugs.has(decodeURIComponent(program[1]))
    : service
      ? serviceSlugs.has(decodeURIComponent(service[1]))
      : post
        ? postSlugs.has(decodeURIComponent(post[1]))
        : true;
  if (known) return NextResponse.next();
  // Rewrite to a path with no route, which renders app/not-found.tsx with a 404 status.
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = {
  matcher: ["/academy/programs/:slug", "/eye-care/:slug", "/blog/:slug"],
};
