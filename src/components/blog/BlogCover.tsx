import type { ReactNode } from "react";
import type { BlogCategory, BlogCover as CoverKind } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Brand illustrations for blog articles — simple line art in the site's
 * palette. Used instead of third-party or patient photographs.
 */

const LINE = "#93C5FD";
const SOFT = "rgba(191,219,254,0.35)";
const ORANGE = "#F97316";
const WHITE = "#FFFFFF";

const EYE = "M40 75 C72 33 168 33 200 75 C168 117 72 117 40 75 Z";

/** An eye drawn around (cx, cy) — the default is the centre of the 240×150 canvas. */
function Eye({
  cx = 120,
  cy = 75,
  s = 1,
  iris = 22,
  irisX = 0,
  faded = false,
}: {
  cx?: number;
  cy?: number;
  s?: number;
  iris?: number;
  irisX?: number;
  faded?: boolean;
}) {
  return (
    <g
      transform={`translate(${cx - 120 * s} ${cy - 75 * s}) scale(${s})`}
      opacity={faded ? 0.45 : 1}
      strokeDasharray={faded ? "4 5" : undefined}
    >
      <path d={EYE} stroke={LINE} />
      <circle cx={120 + irisX} cy="75" r={iris} stroke={WHITE} />
      <circle cx={120 + irisX} cy="75" r={iris * 0.4} fill={LINE} stroke="none" />
    </g>
  );
}

function Fundus({ children }: { children?: ReactNode }) {
  return (
    <g>
      <circle cx="120" cy="75" r="52" stroke={LINE} />
      <circle cx="146" cy="72" r="13" stroke={WHITE} />
      <path
        d="M134 66 C116 56 98 52 78 54 M134 78 C116 90 98 96 80 96 M140 60 C136 44 128 34 116 28 M142 84 C138 102 128 112 116 120"
        stroke={SOFT}
        strokeWidth="2"
      />
      {children}
    </g>
  );
}

/** Deterministic dot field for the colour plate, computed once at module load. */
const COLOUR_DOTS = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: 150 }, () => {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 54;
    const x = 120 + Math.cos(a) * r;
    const y = 75 + Math.sin(a) * r;
    // A soft "7" shape in orange, everything else blue.
    const inShape =
      (y < 60 && y > 48 && x > 100 && x < 142) ||
      (Math.abs(x - (150 - (y - 48) * 0.55)) < 7 && y >= 48 && y < 112);
    return {
      x: x.toFixed(1),
      y: y.toFixed(1),
      r: (2.2 + rand() * 2.6).toFixed(1),
      fill: inShape ? ORANGE : rand() > 0.5 ? LINE : SOFT,
    };
  });
})();

function ColourPlate() {
  return (
    <g>
      {COLOUR_DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} stroke="none" />
      ))}
    </g>
  );
}

const ART: Record<CoverKind, ReactNode> = {
  "dry-eye": (
    <g>
      <Eye />
      <path d="M58 52 C90 30 150 30 182 52" stroke={SOFT} strokeDasharray="3 5" />
      <path d="M190 30 c6 8 8 14 0 20 c-8 -6 -6 -12 0 -20Z" fill={ORANGE} stroke="none" />
      <path d="M208 52 c4 6 5 10 0 14 c-5 -4 -4 -8 0 -14Z" fill={LINE} stroke="none" />
      <path
        d="M46 104 c4 6 5 10 0 14 c-5 -4 -4 -8 0 -14Z"
        fill={LINE}
        stroke="none"
        opacity="0.6"
      />
    </g>
  ),
  keratoconus: (
    <g transform="translate(-26 0)">
      <path d="M92 18 V132" stroke={SOFT} />
      <path d="M92 26 C138 38 138 112 92 124" stroke={LINE} strokeDasharray="4 5" />
      <path d="M92 26 C120 44 168 70 170 75 C168 80 120 106 92 124" stroke={ORANGE} />
      <path d="M86 16 C176 26 206 75 206 75 C206 75 176 124 86 134" stroke={WHITE} opacity="0.55" />
      <circle cx="170" cy="75" r="3" fill={ORANGE} stroke="none" />
    </g>
  ),
  cataract: (
    <g>
      <path d={EYE} stroke={LINE} />
      <circle cx="120" cy="75" r="24" stroke={WHITE} />
      <circle cx="120" cy="75" r="16" fill={SOFT} stroke="none" />
      <circle cx="113" cy="70" r="7" fill={WHITE} opacity="0.5" stroke="none" />
      <circle cx="127" cy="80" r="6" fill={WHITE} opacity="0.35" stroke="none" />
      <path d="M60 30 h30 M150 120 h34" stroke={SOFT} strokeDasharray="2 6" />
    </g>
  ),
  squint: (
    <g>
      <Eye cx={72} cy={88} s={0.6} />
      <Eye cx={168} cy={88} s={0.6} irisX={-12} />
      <circle cx="120" cy="30" r="4" fill={ORANGE} stroke="none" />
      <path d="M72 88 L120 30" stroke={ORANGE} strokeDasharray="3 4" opacity="0.8" />
      <path d="M161 88 L204 36" stroke={SOFT} strokeDasharray="3 4" />
    </g>
  ),
  glaucoma: (
    <g>
      <circle cx="120" cy="75" r="52" stroke={LINE} />
      <circle cx="140" cy="72" r="20" stroke={WHITE} />
      <circle cx="140" cy="72" r="14" stroke={ORANGE} />
      <path
        d="M122 64 C104 56 88 54 72 58 M122 82 C104 92 88 96 74 94 M134 54 C130 40 122 32 112 28"
        stroke={SOFT}
        strokeWidth="2"
      />
    </g>
  ),
  armd: (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`v${i}`} d={`M${64 + i * 14} 19 V131`} stroke={SOFT} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`h${i}`} d={`M64 ${19 + i * 14} H176`} stroke={SOFT} />
      ))}
      <path d="M92 61 C104 70 112 58 120 68 C128 78 136 66 148 75" stroke={WHITE} />
      <circle cx="120" cy="75" r="15" fill={ORANGE} opacity="0.85" stroke="none" />
      <circle cx="120" cy="75" r="24" stroke={ORANGE} opacity="0.35" />
    </g>
  ),
  diabetic: (
    <Fundus>
      {[
        [96, 62],
        [104, 92],
        [88, 80],
        [128, 104],
        [118, 46],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 2 ? 3 : 4}
          fill={i % 2 ? WHITE : ORANGE}
          stroke="none"
        />
      ))}
    </Fundus>
  ),
  hypertensive: (
    <g>
      <Fundus />
      <path
        d="M24 130 H86 L94 116 L102 140 L110 110 L118 130 H216"
        stroke={ORANGE}
        strokeLinejoin="round"
      />
    </g>
  ),
  amblyopia: (
    <g>
      <Eye cx={72} cy={62} s={0.6} />
      <Eye cx={168} cy={62} s={0.6} faded />
      <path d="M48 112 h48 M144 112 h48" stroke={SOFT} />
      <circle cx="72" cy="112" r="4" fill={ORANGE} stroke="none" />
    </g>
  ),
  vergence: (
    <g>
      <Eye cx={76} cy={104} s={0.5} />
      <Eye cx={164} cy={104} s={0.5} />
      <path d="M76 104 L120 34 L164 104" stroke={ORANGE} strokeDasharray="4 4" />
      <path d="M76 104 L120 18 L164 104" stroke={SOFT} strokeDasharray="2 5" />
      <circle cx="120" cy="34" r="4" fill={ORANGE} stroke="none" />
    </g>
  ),
  accommodation: (
    <g transform="translate(22 0)">
      <path d="M112 26 C130 50 130 100 112 124 C94 100 94 50 112 26Z" stroke={WHITE} />
      <path d="M20 50 H104 L176 75 M20 100 H104 L176 75" stroke={LINE} />
      <path d="M20 62 H104 L150 75 M20 88 H104 L150 75" stroke={ORANGE} opacity="0.85" />
      <circle cx="176" cy="75" r="3.5" fill={LINE} stroke="none" />
      <circle cx="150" cy="75" r="3.5" fill={ORANGE} stroke="none" />
    </g>
  ),
  myopia: (
    <g transform="translate(14 0)">
      <circle cx="140" cy="75" r="46" stroke={LINE} />
      <path d="M184 52 C192 66 192 84 184 98" stroke={WHITE} strokeWidth="3" />
      <path d="M20 58 H100 L158 75 M20 92 H100 L158 75" stroke={ORANGE} />
      <path d="M158 75 L186 66 M158 75 L186 84" stroke={ORANGE} opacity="0.4" />
      <circle cx="158" cy="75" r="3.5" fill={ORANGE} stroke="none" />
      <path d="M100 48 C110 60 110 90 100 102" stroke={WHITE} opacity="0.6" />
    </g>
  ),
  screen: (
    <g>
      <rect x="64" y="26" width="112" height="72" rx="8" stroke={LINE} />
      <path d="M108 98 L104 116 H136 L132 98" stroke={LINE} />
      <path d="M96 62 C108 48 132 48 144 62 C132 76 108 76 96 62Z" stroke={WHITE} />
      <circle cx="120" cy="62" r="6" fill={ORANGE} stroke="none" />
      <text
        x="120"
        y="136"
        textAnchor="middle"
        fill={ORANGE}
        fontFamily="ui-monospace, monospace"
        fontSize="11"
        letterSpacing="2"
      >
        20 · 20 · 20
      </text>
    </g>
  ),
  colour: <ColourPlate />,
};

export function BlogCover({
  cover,
  category,
  className,
}: {
  cover: CoverKind;
  category: BlogCategory;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden",
        category === "eye-diseases" ? "bg-navy-950" : "bg-blue-900",
        className,
      )}
    >
      {/* Dot texture (CSS, so repeated covers never share SVG ids). */}
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1.5px)] bg-[size:18px_18px]" />
      <svg
        viewBox="0 0 240 150"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="relative size-full"
        focusable="false"
      >
        {ART[cover]}
      </svg>
    </div>
  );
}
