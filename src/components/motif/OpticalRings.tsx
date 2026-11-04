import { cn } from "@/lib/cn";

/**
 * Signature motif — "Optical rings" (§4.7).
 * Concentric thin circles after keratometer mires / Placido rings, with one
 * orange focal ring. Static; an optional dashed ring turns once every 120s
 * and stops under prefers-reduced-motion.
 *
 * Used in exactly four places: hero, path selector, footer mark, 404.
 * (The wordmark and PhotoSlot use a reduced glyph of the same idea.)
 */
export function OpticalRings({
  className,
  tone = "light",
  rings = 8,
  focal = 3,
  rotate = false,
  reticle = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  rings?: number;
  focal?: number;
  rotate?: boolean;
  reticle?: boolean;
}) {
  const stroke = tone === "dark" ? "#93C5FD" : "#BFDBFE";
  const min = 22;
  const max = 196;
  const step = (max - min) / Math.max(rings - 1, 1);
  const radii = Array.from({ length: rings }, (_, i) => min + i * step);

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none select-none", className)}
    >
      {reticle ? (
        <g stroke={stroke} strokeOpacity={0.3} strokeWidth={1} vectorEffect="non-scaling-stroke">
          <line x1="200" y1="0" x2="200" y2="400" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="200" x2="400" y2="200" vectorEffect="non-scaling-stroke" />
        </g>
      ) : null}
      {radii.map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke={i === focal ? "#F97316" : stroke}
          strokeOpacity={i === focal ? 0.8 : 0.35 + ((i * 7) % 3) * 0.12}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {rotate ? (
        <g className="animate-ring-spin" style={{ transformOrigin: "200px 200px" }}>
          <circle
            cx="200"
            cy="200"
            r={radii[Math.max(rings - 2, 0)] + step / 2}
            stroke={stroke}
            strokeOpacity={0.55}
            strokeWidth={1}
            strokeDasharray="2 9"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ) : null}
      <circle cx="200" cy="200" r="2.5" fill="#F97316" fillOpacity={0.8} />
    </svg>
  );
}

/** Small mark used in the wordmark — three rings and a focal dot. */
export function RingsMark({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const stroke = tone === "dark" ? "#FFFFFF" : "#1E3A8A";
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" className={className}>
      <circle cx="16" cy="16" r="14.5" stroke={stroke} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="9.5" stroke={stroke} strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="5" stroke="#F97316" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.6" fill="#F97316" />
    </svg>
  );
}
