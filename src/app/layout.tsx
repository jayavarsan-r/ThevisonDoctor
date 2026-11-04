import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@/components/layout/Analytics";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { site, siteUrl } from "@/content/site";
import {
  getAcademyLinks,
  getClinician,
  getFeaturedIntake,
  getServices,
  getToday,
  getUpcomingEvents,
} from "@/lib/content";
import { showDrafts } from "@/lib/drafts";
import { formatDate } from "@/lib/format";
import "@/styles/globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-instrument",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.shortName} — Optometry Academy & Eye Care in Chennai`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
  // Google Search Console ownership (client-supplied, Nov 2026).
  verification: { google: site.googleSiteVerification },
  // Preview deployments show drafts and must never be indexed.
  robots: showDrafts ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0B1736",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const today = await getToday();
  const nextEvent = getUpcomingEvents(today, 1)[0];
  const featured = getFeaturedIntake(today);
  const academyLinks = getAcademyLinks(today);
  const clinician = getClinician();
  const navServices = getServices().map(({ slug, title, short, icon }) => ({
    slug,
    title,
    short,
    icon,
  }));

  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${newsreader.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <head>
        {/* Enables scroll-reveal styles only when JS runs, so content never hides without it. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <SkipLink />
        <UtilityBar
          nextEvent={nextEvent}
          admission={
            featured
              ? {
                  title: featured.program.title,
                  href: `/academy/programs/${featured.program.slug}`,
                  intake: formatDate(featured.intake.start),
                }
              : undefined
          }
        />
        <SiteHeader
          academyLinks={academyLinks}
          services={navServices}
          featured={
            featured
              ? {
                  slug: featured.program.slug,
                  title: featured.program.title,
                  start: featured.intake.start,
                }
              : null
          }
        />
        <main id="main" tabIndex={-1} className="main-with-action-bar focus:outline-none">
          {children}
        </main>
        <SiteFooter
          academyLinks={academyLinks}
          year={today.slice(0, 4)}
          services={navServices}
          registration={clinician.registration}
        />
        <MobileActionBar />
        <Analytics />
        <RevealObserver />
      </body>
    </html>
  );
}
