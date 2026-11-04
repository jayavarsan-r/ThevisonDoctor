import { House, ScanEye, UsersRound, type LucideProps } from "lucide-react";
import type { ServiceIcon as ServiceIconName, Speciality } from "@/content/types";
import { cn } from "@/lib/cn";

type IconProps = { className?: string; size?: number };

function Svg({ className, size = 32, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Myopia: an eye with a lens arc in front of it. */
export function MyopiaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 16c2.6-4.3 6.2-6.5 10.5-6.5S26.4 11.7 29 16c-2.6 4.3-6.2 6.5-10.5 6.5S10.6 20.3 8 16Z" />
      <circle cx="18.5" cy="16" r="3.2" />
      <path d="M4.5 8.5c-2 4.6-2 10.4 0 15" />
    </Svg>
  );
}

/** Binocular vision: two overlapping rings. */
export function BinocularIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="16" r="8" />
      <circle cx="20" cy="16" r="8" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Specialty contact lenses: a dome profile on its base. */
export function ContactLensIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 22c2.5-7.5 7-11.5 12-11.5S25.5 14.5 28 22" />
      <path d="M7.5 22c2-5 5-7.6 8.5-7.6s6.5 2.6 8.5 7.6" strokeOpacity="0.55" />
      <path d="M3 22h26" />
    </Svg>
  );
}

/** Ocular diagnostics: a fundus circle with an optic disc and vessels. */
export function DiagnosticsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="16" cy="16" r="12.5" />
      <circle cx="20.5" cy="15" r="2.4" />
      <path d="M18.4 13.6c-2.8-2-6-2.8-9.6-2.4M18.3 16.4c-2.6 2.3-5.8 3.3-9.6 3.1M19.5 12.8c-.6-2.4-1.8-4.4-3.7-6M19.6 17.3c-.4 2.6-1.6 4.8-3.6 6.6" />
      <circle cx="11" cy="15.5" r="0.9" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export const specialityIcons: Record<Speciality, (p: IconProps) => React.ReactElement> = {
  myopia: MyopiaIcon,
  "binocular-vision": BinocularIcon,
  "contact-lenses": ContactLensIcon,
  diagnostics: DiagnosticsIcon,
};

function lucide(Icon: React.ComponentType<LucideProps>) {
  return function LucideIcon({ className, size = 32 }: IconProps) {
    return <Icon aria-hidden size={size} strokeWidth={1.5} className={className} />;
  };
}

const serviceIconMap: Record<ServiceIconName, (p: IconProps) => React.ReactElement> = {
  home: lucide(House),
  screening: lucide(UsersRound),
  myopia: MyopiaIcon,
  binocular: BinocularIcon,
  lens: ContactLensIcon,
  exam: lucide(ScanEye),
};

export function ServiceIcon({ name, className, size }: IconProps & { name: ServiceIconName }) {
  const Icon = serviceIconMap[name];
  return <Icon className={cn("text-blue-900", className)} size={size} />;
}

/** WhatsApp glyph drawn in the same 1.5 stroke style as the rest of the icon set. */
export function WhatsAppIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.6l-4.5.9Z" />
      <path d="M9.2 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.6.4-1.4.6-2.2.4-2.6-.6-4.9-2.9-5.5-5.5-.2-.8 0-1.6.3-2.2Z" />
    </svg>
  );
}

/** YouTube mark in the 1.5 stroke style (not the brand logo). */
export function YouTubeIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Instagram mark in the 1.5 stroke style (not the brand logo). */
export function InstagramIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** LinkedIn mark in the 1.5 stroke style (not the brand logo). */
export function LinkedInIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10.5V16.5M8 7.6v.01M11.5 16.5v-6M11.5 13c0-1.6 1.1-2.6 2.5-2.6s2.5.9 2.5 2.6v3.5" />
    </svg>
  );
}

/** Facebook mark in the 1.5 stroke style (not the brand logo). */
export function FacebookIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15 8h-1.5A2 2 0 0 0 11.5 10v11M9 13h5" />
    </svg>
  );
}
