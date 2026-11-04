import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.shortName} — Optometry Academy & Eye Care, Chennai`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RINGS = [90, 150, 210, 270, 330, 390, 450];

/** Brand OG template: navy field, the emblem inside optical rings on the right, wordmark and line. */
export default async function OpengraphImage() {
  const emblem = await readFile(join(process.cwd(), "public/images/brand/emblem.png"));
  const emblemSrc = `data:image/png;base64,${emblem.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#0B1736",
        color: "#FFFFFF",
        padding: "72px 80px",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {RINGS.map((d, i) => (
        <div
          key={d}
          style={{
            position: "absolute",
            left: 920 - d / 2,
            top: 315 - d / 2,
            width: d,
            height: d,
            borderRadius: 9999,
            border: `2px solid ${i === 2 ? "rgba(249,115,22,0.85)" : "rgba(147,197,253,0.45)"}`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 920 - 70,
          top: 315 - 70,
          width: 140,
          height: 140,
          borderRadius: 9999,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={emblemSrc} width={83} height={100} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#F97316" }} />
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#93C5FD" }}>
          OPTOMETRY ACADEMY &amp; EYE CARE · CHENNAI
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 }}>
        <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: -2 }}>{site.shortName}</div>
        <div style={{ fontSize: 34, color: "#CBD5E1" }}>
          See further. Learn deeper. Care better.
        </div>
      </div>
      <div style={{ fontSize: 22, color: "#93C5FD", letterSpacing: 2 }}>
        FELLOWSHIPS · CERTIFICATIONS · CLINICAL TRAINING · EYE CARE BY APPOINTMENT
      </div>
    </div>,
    size,
  );
}
