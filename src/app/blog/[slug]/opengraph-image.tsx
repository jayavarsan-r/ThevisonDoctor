import { ImageResponse } from "next/og";
import { blogPosts } from "@/content/blog";
import { site } from "@/content/site";
import { blogCategoryLabels } from "@/content/taxonomy";

export const alt = `${site.shortName} — Eye health blog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return blogPosts.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }));
}

/** Per-article share image: category, title and brand on navy. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const title = post?.title ?? "Eye health blog";
  const category = post ? blogCategoryLabels[post.category] : "Eye health";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0B1736",
        color: "#FFFFFF",
        padding: "72px 80px",
        position: "relative",
      }}
    >
      {[160, 260, 360, 460].map((d, i) => (
        <div
          key={d}
          style={{
            position: "absolute",
            right: 120 - d / 2,
            bottom: 90 - d / 2,
            width: d,
            height: d,
            borderRadius: 9999,
            border: `2px solid ${i === 0 ? "rgba(249,115,22,0.8)" : "rgba(147,197,253,0.35)"}`,
          }}
        />
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#F97316" }} />
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#93C5FD" }}>
          {`EYE HEALTH BLOG · ${category.toUpperCase()}`}
        </div>
      </div>
      <div style={{ fontSize: 64, lineHeight: 1.08, maxWidth: 900, display: "flex" }}>{title}</div>
      <div style={{ fontSize: 26, color: "#CBD5E1" }}>{`${site.shortName} · Chennai`}</div>
    </div>,
    size,
  );
}
