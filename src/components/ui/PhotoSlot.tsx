import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/cn";

const ratios = {
  "4/5": "aspect-[4/5]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "1/1": "aspect-square",
} as const;

/**
 * Placeholder for a real photograph (§4.8). When `src` is set it renders
 * next/image instead. Placeholders are decorative and hidden from assistive tech.
 */
export function PhotoSlot({
  ratio = "4/3",
  caption,
  src,
  alt = "",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority,
  className,
}: {
  ratio?: keyof typeof ratios;
  caption: string;
  src?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-card bg-blue-50", ratios[ratio], className)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-card border border-blue-200/70 bg-blue-50 p-6 text-center",
        ratios[ratio],
        className,
      )}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="absolute -right-1/4 -bottom-1/3 w-[110%] opacity-70"
      >
        {[40, 72, 104, 136, 168, 196].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            stroke={i === 2 ? "#F97316" : "#BFDBFE"}
            strokeOpacity={i === 2 ? 0.45 : 0.8}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <Camera strokeWidth={1.5} className="relative size-7 text-blue-900/70" />
      <p className="relative max-w-[28ch] eyebrow text-[11px] text-blue-900/80">{caption}</p>
    </div>
  );
}
