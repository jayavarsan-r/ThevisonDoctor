import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { showDrafts } from "@/lib/drafts";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "./icons";

const ICONS = {
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
} as const;

/** Unconfirmed profiles (placeholder URLs) only appear in preview mode. */
export const visibleSocial = () => site.social.filter((s) => s.confirmed || showDrafts);

/** Icon buttons for the clinic's social profiles (configured in site.ts). */
export function SocialLinks({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {visibleSocial().map((s) => {
        const Icon = ICONS[s.id as keyof typeof ICONS];
        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`${site.shortName} on ${s.label} (opens in a new tab)`}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-150",
                tone === "dark"
                  ? "border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                  : "border-line text-blue-900 hover:border-blue-200 hover:bg-blue-50",
              )}
            >
              <Icon size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
