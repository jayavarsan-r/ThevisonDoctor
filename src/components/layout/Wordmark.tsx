import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The brand emblem (from "Vision Doctor Final Logo") with the name set as live
 * text, so it stays readable at header size. On dark surfaces the emblem sits
 * on a white tile, because its blues are too close to navy.
 */
export function Wordmark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center gap-2.5 rounded-btn", className)}
      aria-label={`${site.shortName} — home`}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center transition-colors duration-200",
          dark ? "size-10 rounded-[10px] bg-white p-1" : "size-10",
        )}
      >
        <Image
          src="/images/brand/emblem.png"
          alt=""
          width={160}
          height={192}
          priority
          sizes="40px"
          className="h-full w-auto"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[17px] font-semibold tracking-[-0.01em] transition-colors duration-200",
            dark ? "text-white" : "text-ink",
          )}
        >
          {site.shortName}
        </span>
        <span
          className={cn(
            "mt-1 font-mono text-[10px] tracking-[0.12em] transition-colors duration-200",
            dark ? "text-blue-300" : "text-blue-900",
          )}
        >
          {site.wordmarkSubline}
        </span>
      </span>
    </Link>
  );
}
